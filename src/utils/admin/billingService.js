import mongoose from "mongoose";
import Membership from "@/models/Membership";
import File from "@/models/File";
import {
  PLANS,
  DEFAULT_PLAN_ID,
  BILLING_CYCLES,
  BILLING_STATUS,
  TAX_RATE_BPS,
  CURRENCY,
  TRIAL_DAYS,
} from "@/utils/constants/billingConstants";

const BYTES_PER_GB = 1024 ** 3;

export class BillingService {
  static getPlan(planId) {
    return PLANS[planId] || PLANS[DEFAULT_PLAN_ID];
  }

  /** Active member user ids, used to scope usage queries to the org. */
  static async getMemberIds(orgId) {
    const memberships = await Membership.find({
      organization: orgId,
      status: "active",
    })
      .select("user")
      .lean();

    return memberships.map((m) => m.user);
  }

  static async getSeatUsage(orgId) {
    return Membership.countDocuments({ organization: orgId, status: "active" });
  }

  /**
   * Total bytes of non-deleted files owned by the org's members.
   * Files aren't org-scoped yet, so ownership is the only link available.
   */
  static async getStorageUsage(orgId) {
    const memberIds = await this.getMemberIds(orgId);
    if (memberIds.length === 0) return 0;

    const result = await File.aggregate([
      {
        $match: {
          owner: { $in: memberIds.map((id) => new mongoose.Types.ObjectId(id)) },
          isDeleted: false,
        },
      },
      { $group: { _id: null, total: { $sum: "$size" } } },
    ]);

    return result[0]?.total || 0;
  }

  static isTrialing(org) {
    const trialEndsAt = org?.billing?.trialEndsAt;
    return Boolean(trialEndsAt && new Date(trialEndsAt) > new Date());
  }

  /**
   * Line items for the summary panel. All amounts are integer cents, so tax
   * never introduces a floating point rounding error.
   */
  static buildSummary(org) {
    const plan = this.getPlan(org.plan);
    const cycle = org?.billing?.cycle || BILLING_CYCLES.MONTHLY;
    const isYearly = cycle === BILLING_CYCLES.YEARLY;

    // A trial is billed at zero until it ends.
    const trialing = this.isTrialing(org);
    const basePrice = isYearly ? plan.priceYearly : plan.priceMonthly;
    const subtotal = trialing ? 0 : basePrice;

    const taxAmount = Math.round((subtotal * TAX_RATE_BPS) / 10000);

    return {
      currency: CURRENCY,
      cycle,
      cycleLabel: isYearly ? "Billed yearly" : "Billed monthly",
      planName: plan.name,
      subtotal,
      taxRateBps: TAX_RATE_BPS,
      taxAmount,
      total: subtotal + taxAmount,
      trialing,
    };
  }

  /** Full billing payload for the admin console. */
  static async getBillingOverview(org) {
    const plan = this.getPlan(org.plan);

    const [seatsUsed, storageUsedBytes] = await Promise.all([
      this.getSeatUsage(org._id),
      this.getStorageUsage(org._id),
    ]);

    const storageQuotaBytes = plan.storageQuotaGB * BYTES_PER_GB;

    return {
      plan: {
        id: plan.id,
        name: plan.name,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        seatLimit: plan.seatLimit,
        storageQuotaGB: plan.storageQuotaGB,
      },
      status: this.isTrialing(org) ? BILLING_STATUS.TRIALING : BILLING_STATUS.ACTIVE,
      cycle: org?.billing?.cycle || BILLING_CYCLES.MONTHLY,
      trialEndsAt: org?.billing?.trialEndsAt || null,
      currentPeriodEnd: org?.billing?.currentPeriodEnd || null,
      paymentMethod: org?.billing?.paymentMethod || null,
      usage: {
        seatsUsed,
        seatLimit: plan.seatLimit,
        storageUsedBytes,
        storageQuotaBytes,
        storageQuotaGB: plan.storageQuotaGB,
      },
      summary: this.buildSummary(org),
    };
  }

  /** Starts the trial clock the first time an org opens billing. */
  static async ensureBillingDefaults(org) {
    if (org?.billing?.trialEndsAt) return org;

    if (!org.billing) org.billing = {};

    org.billing.trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
    org.billing.status = BILLING_STATUS.TRIALING;
    org.markModified("billing");
    await org.save();

    return org;
  }
}