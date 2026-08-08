import mongoose from "mongoose";
import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import File from "@/models/File";

// Turn a raw byte count into a short human-readable string
const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 MB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
};

export class OrganizationService {
  // All organizations this user can access, for the org switcher:
  // their own organization first (if any), then every organization
  // they are an active member of.
  static async getUserOrganizations(userId) {
    const owned = await Organization.findOne({ owner: userId }).lean();

    const memberships = await Membership.find({
      user: userId,
      status: "active",
    })
      .populate({ path: "organization", select: "name owner" })
      .sort({ joinedAt: 1 })
      .lean();

    const orgs = [];

    if (owned) {
      orgs.push({ id: owned._id.toString(), name: owned.name, role: "Admin", isOwner: true });
    }

    for (const m of memberships) {
      if (!m.organization) continue;
      const id = m.organization._id.toString();
      if (owned && id === owned._id.toString()) continue; // already listed as owner
      orgs.push({ id, name: m.organization.name, role: m.role, isOwner: false });
    }

    return orgs;
  }

  // Does this user have access (owner or active member) to this org?
  static async hasAccess(orgId, userId) {
    const org = await Organization.findById(orgId).select("owner").lean();
    if (!org) return false;
    if (org.owner.toString() === userId.toString()) return true;

    const membership = await Membership.findOne({
      organization: orgId,
      user: userId,
      status: "active",
    }).lean();

    return Boolean(membership);
  }

  // Resolve which organization the Admin Console should show:
  // 1) the requested orgId, if the user has access to it
  // 2) otherwise, the organization they own
  // 3) otherwise, an organization they're an active member of
  // 4) otherwise, lazily create their own organization
  static async resolveOrgContext(userId, userName, requestedOrgId = null) {
    if (requestedOrgId) {
      const allowed = await this.hasAccess(requestedOrgId, userId);
      if (allowed) {
        const requested = await Organization.findById(requestedOrgId);
        if (requested) return requested;
      }
      // Falls through to default resolution if access is denied or invalid
    }

    let org = await Organization.findOne({ owner: userId });
    if (org) return org;

    const membership = await Membership.findOne({
      user: userId,
      status: "active",
    }).sort({ joinedAt: 1 });

    if (membership) {
      org = await Organization.findById(membership.organization);
      if (org) return org;
    }

    org = await Organization.create({
      name: `${userName || "My"}'s Organization`,
      owner: userId,
    });

    await Membership.create({
      organization: org._id,
      user: userId,
      role: "Admin",
      permission: "Can Edit",
      status: "active",
    });

    return org;
  }

  // Sum of a user's non-deleted file sizes, formatted for display.
  // Note: this is platform-wide (not scoped to one organization) since
  // files aren't org-scoped yet.
  static async getUserStorageUsage(userId) {
    const result = await File.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
        },
      },
      { $group: { _id: null, total: { $sum: "$size" } } },
    ]);

    return formatBytes(result[0]?.total || 0);
  }

  // Is this user an Admin (or the owner) of the given organization?
  static async isOrgAdmin(orgId, userId) {
    const org = await Organization.findById(orgId).select("owner").lean();
    if (!org) return false;
    if (org.owner.toString() === userId.toString()) return true;

    const membership = await Membership.findOne({
      organization: orgId,
      user: userId,
      role: "Admin",
      status: "active",
    }).lean();

    return Boolean(membership);
  }

  // Security policy for the organization that owns this user's content.
  // Falls back to permissive defaults when the user has no organization yet.
  static async getSecurityPolicyForUser(userId) {
    const Organization = (await import("@/models/Organization")).default;
    const Membership = (await import("@/models/Membership")).default;

    let org = await Organization.findOne({ owner: userId }).select("security").lean();

    if (!org) {
      const membership = await Membership.findOne({
        user: userId,
        status: "active",
      })
        .sort({ joinedAt: 1 })
        .lean();

      if (membership) {
        org = await Organization.findById(membership.organization).select("security").lean();
      }
    }

    return {
      linkPassword: Boolean(org?.security?.linkPassword),
      linkExpiration: Boolean(org?.security?.linkExpiration),
      externalSharing: org?.security?.externalSharing || "Email and link",
    };
  }

}