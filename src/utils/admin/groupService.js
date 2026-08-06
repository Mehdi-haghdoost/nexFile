import Group from "@/models/Group";
import Membership from "@/models/Membership";
import { OrganizationService } from "./organizationService";
import { ActivityService } from "./activityService";

export class GroupService {
  // List an organization's groups, shaped for the groups table
  static async listGroups(orgId) {
    const groups = await Group.find({ organization: orgId })
      .populate({
        path: "manager",
        populate: { path: "user", select: "name email image" },
      })
      .sort({ createdAt: -1 })
      .lean();

    return groups.map((g) => ({
      id: g._id.toString(),
      name: g.name,
      icon: { gradient: g.gradient },
      membersCount: g.members?.length || 0,
      manager: {
        name: g.manager?.user?.name || "Unassigned",
        avatar: g.manager?.user?.image || null,
      },
      permission: g.permission,
    }));
  }

  // Create a group; only org admins may do this
  static async createGroup(orgId, requesterId, { name, gradient, permission, managerId, memberIds }) {
    const isAdmin = await OrganizationService.isOrgAdmin(orgId, requesterId);
    if (!isAdmin) {
      throw new Error("Only admins can create groups");
    }

    if (!name || !name.trim()) {
      throw new Error("Group name is required");
    }

    // Keep only memberships that actually belong to this organization
    const validMembers = await Membership.find({
      _id: { $in: memberIds || [] },
      organization: orgId,
      status: "active",
    }).select("_id");

    const group = await Group.create({
      name: name.trim(),
      organization: orgId,
      gradient: gradient || "from-[#5C9FEC] to-[#186BCB]",
      permission: permission || "View only",
      manager: managerId || null,
      members: validMembers.map((m) => m._id),
    });

    await ActivityService.log(orgId, requesterId, {
      action: "group.created",
      description: `Created the group "${group.name}"`,
      category: "Groups",
    });

    return group;
  }

  // Update a group's editable fields
  static async updateGroup(groupId, requesterId, updates) {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const isAdmin = await OrganizationService.isOrgAdmin(group.organization, requesterId);
    if (!isAdmin) {
      throw new Error("Only admins can manage groups");
    }

    if (updates.name) group.name = updates.name.trim();
    if (updates.permission) group.permission = updates.permission;
    if (updates.gradient) group.gradient = updates.gradient;
    if (updates.managerId !== undefined) group.manager = updates.managerId || null;

    if (Array.isArray(updates.memberIds)) {
      const validMembers = await Membership.find({
        _id: { $in: updates.memberIds },
        organization: group.organization,
        status: "active",
      }).select("_id");
      group.members = validMembers.map((m) => m._id);
    }

    await group.save();
    return group;
  }

  // Permanently delete a group
  static async deleteGroup(groupId, requesterId) {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const isAdmin = await OrganizationService.isOrgAdmin(group.organization, requesterId);
    if (!isAdmin) {
      throw new Error("Only admins can delete groups");
    }

    await Group.findByIdAndDelete(groupId);

    await ActivityService.log(group.organization, requesterId, {
      action: "group.deleted",
      description: `Deleted the group "${group.name}"`,
      category: "Groups",
    });

    return true;
  }
}