import { hashPassword, verifyPassword } from "@/utils/auth/hashPassword";
import { OrganizationService } from "@/utils/admin/organizationService";
import Membership from "@/models/Membership";
import Organization from "@/models/Organization";

// Default lifetime applied when the org requires expiry but none was given
const DEFAULT_EXPIRY_DAYS = 30;

export class LinkPolicy {
  // Validate incoming share-link settings against the org's security policy,
  // and normalize them (hashing the password, filling a default expiry).
  static async applyToShareLink(userId, incoming = {}) {
    const policy = await OrganizationService.getSecurityPolicyForUser(userId);

    let {
      accessLevel,
      isExpirationEnabled,
      expirationDate,
      isPasswordEnabled,
      password,
      disableDownloads,
    } = incoming;

    // Public links are blocked when external sharing disallows them
    const publicLinksBlocked =
      policy.externalSharing === "Email only" || policy.externalSharing === "Disabled";

    if (accessLevel === "anyone" && publicLinksBlocked) {
      throw new Error(
        `Your organization's external sharing policy (${policy.externalSharing}) does not allow public links`
      );
    }

    // Organization requires every share link to be password protected
    if (policy.linkPassword) {
      if (!isPasswordEnabled) {
        throw new Error(
          "Your organization requires every share link to have a password"
        );
      }
      if (!password || password.length < 4) {
        throw new Error("Link password must be at least 4 characters");
      }
    }

    // Organization requires every share link to expire
    if (policy.linkExpiration) {
      if (!isExpirationEnabled) {
        throw new Error(
          "Your organization requires every share link to have an expiration date"
        );
      }
      if (!expirationDate) {
        // Apply a sensible default rather than rejecting outright
        const fallback = new Date(Date.now() + DEFAULT_EXPIRY_DAYS * 86400000);
        expirationDate = fallback.toISOString();
      }
    }

    // Reject dates already in the past
    if (isExpirationEnabled && expirationDate) {
      if (new Date(expirationDate) <= new Date()) {
        throw new Error("Expiration date must be in the future");
      }
    }

    // Store the link password hashed, never in plain text
    const hashedPassword =
      isPasswordEnabled && password ? await hashPassword(password) : null;

    return {
      accessLevel: accessLevel || "anyone",
      isExpirationEnabled: Boolean(isExpirationEnabled),
      expirationDate: isExpirationEnabled && expirationDate ? new Date(expirationDate) : null,
      isPasswordEnabled: Boolean(isPasswordEnabled && hashedPassword),
      password: hashedPassword,
      disableDownloads: Boolean(disableDownloads),
    };
  }

  // Which of these user ids belong to the owner's organization?
  // Returns a Set of id strings for quick lookups.
  static async getOrgMemberIds(ownerId) {
    let org = await Organization.findOne({ owner: ownerId }).select("_id").lean();

    if (!org) {
      const membership = await Membership.findOne({
        user: ownerId,
        status: "active",
      })
        .sort({ joinedAt: 1 })
        .lean();

      if (membership) {
        org = { _id: membership.organization };
      }
    }

    if (!org) return new Set();

    const memberships = await Membership.find({
      organization: org._id,
      status: "active",
    })
      .select("user")
      .lean();

    return new Set(memberships.map((m) => m.user.toString()));
  }

  // Reject recipients outside the organization when the policy forbids it.
  // Returns the recipients that are allowed through.
  static async filterRecipients(ownerId, userIds = []) {
    const policy = await OrganizationService.getSecurityPolicyForUser(ownerId);

    // These policies allow direct sharing with anyone
    if (policy.externalSharing === "Email and link" || policy.externalSharing === "Email only") {
      return { allowed: userIds, blocked: [] };
    }

    // 'Link only' and 'Disabled' both forbid sharing directly with outsiders
    const memberIds = await this.getOrgMemberIds(ownerId);

    const allowed = [];
    const blocked = [];

    for (const id of userIds) {
      if (memberIds.has(id.toString())) {
        allowed.push(id);
      } else {
        blocked.push(id);
      }
    }

    return { allowed, blocked, policy: policy.externalSharing };
  }

  // Is this share link currently usable? Checks expiry only.
  static checkLinkAvailability(shareLink) {
    if (!shareLink) {
      return { ok: false, reason: "No share link exists for this item" };
    }

    if (shareLink.isExpirationEnabled && shareLink.expirationDate) {
      if (new Date(shareLink.expirationDate) <= new Date()) {
        return { ok: false, reason: "This link has expired" };
      }
    }

    return { ok: true };
  }

  // Verify a submitted password against the stored hash
  static async checkLinkPassword(shareLink, submittedPassword) {
    if (!shareLink?.isPasswordEnabled) {
      return true; // No password required
    }
    if (!submittedPassword || !shareLink.password) {
      return false;
    }
    return verifyPassword(submittedPassword, shareLink.password);
  }
}