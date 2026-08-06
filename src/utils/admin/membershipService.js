import Membership from "@/models/Membership";
import Invite from "@/models/Invite";
import Organization from "@/models/Organization";
import { OrganizationService } from "./organizationService";
import { ActivityService } from "./activityService";

export class MembershipService {
  // List members for a tab: 'active' | 'guests' | 'invited' | 'suspended' | 'removed' | 'suggested'
  static async listMembers(orgId, tab = "active") {
    if (tab === "invited") {
      const invites = await Invite.find({
        organization: orgId,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      })
        .sort({ createdAt: -1 })
        .lean();

      return invites.map((inv) => ({
        id: inv._id.toString(),
        kind: "invite",
        name: inv.email || "Pending invite",
        avatar: null,
        role: inv.role,
        storageUsage: "-",
        permission: "-",
        status: "invited",
        token: inv.token,
        expiresAt: inv.expiresAt,
      }));
    }

    // No suggestion algorithm yet; always empty
    if (tab === "suggested") {
      return [];
    }

    const statusMap = {
      active: "active",
      guests: "active",
      suspended: "suspended",
      removed: "removed",
    };
    const status = statusMap[tab] || "active";

    const query = { organization: orgId, status };
    if (tab === "guests") {
      query.role = "Guest";
    } else if (tab === "active") {
      query.role = { $ne: "Guest" };
    }

    const org = await Organization.findById(orgId).select("owner").lean();

    const memberships = await Membership.find(query)
      .populate({ path: "user", select: "name email image" })
      .sort({ joinedAt: -1 })
      .lean();

    const rows = await Promise.all(
      memberships
        .filter((m) => m.user) // skip memberships whose user was deleted
        .map(async (m) => ({
          id: m._id.toString(),
          kind: "member",
          userId: m.user._id.toString(),
          name: m.user.name || m.user.email,
          email: m.user.email,
          avatar: m.user.image || null,
          role: m.role,
          storageUsage: await OrganizationService.getUserStorageUsage(m.user._id),
          permission: m.permission,
          status: m.status,
          isOwner: org?.owner?.toString() === m.user._id.toString(),
        }))
    );

    return rows;
  }

  // Change a member's role, permission, or status
  static async updateMember(membershipId, requesterId, updates) {
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      throw new Error("Member not found");
    }

    const isAdmin = await OrganizationService.isOrgAdmin(
      membership.organization,
      requesterId
    );
    if (!isAdmin) {
      throw new Error("Only admins can manage members");
    }

    const org = await Organization.findById(membership.organization).select("owner");
    if (org.owner.toString() === membership.user.toString()) {
      throw new Error("The organization owner's membership cannot be changed");
    }

    if (updates.role) membership.role = updates.role;
    if (updates.permission) membership.permission = updates.permission;
    if (updates.status) membership.status = updates.status;

    await membership.save();

    // Record what changed for the activity log
    const changes = [];
    if (updates.role) changes.push(`role to ${updates.role}`);
    if (updates.permission) changes.push(`permission to ${updates.permission}`);
    if (updates.status) changes.push(`status to ${updates.status}`);

    if (changes.length > 0) {
      await ActivityService.log(membership.organization, requesterId, {
        action: "member.updated",
        description: `Changed a member's ${changes.join(", ")}`,
        category: "Members",
      });
    }

    return membership;
  }

  // Soft-remove a member, keeping the record for audit purposes
  static async removeMember(membershipId, requesterId) {
    return this.updateMember(membershipId, requesterId, { status: "removed" });
  }
}