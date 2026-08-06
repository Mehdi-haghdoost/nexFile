import crypto from "crypto";
import Invite from "@/models/Invite";
import Membership from "@/models/Membership";
import Organization from "@/models/Organization";
import { OrganizationService } from "./organizationService";
import { ActivityService } from "./activityService";

const INVITE_EXPIRY_DAYS = 7;

export class InviteService {
  // Create a link-based invite; no email is actually sent
  static async createInvite(orgId, requesterId, { email, role }) {
    const isAdmin = await OrganizationService.isOrgAdmin(orgId, requesterId);
    if (!isAdmin) {
      throw new Error("Only admins can invite members");
    }

    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 86400000);

    const invite = await Invite.create({
      organization: orgId,
      email: email || null,
      role: role || "Member",
      token,
      invitedBy: requesterId,
      expiresAt,
    });

    await ActivityService.log(orgId, requesterId, {
      action: "member.invited",
      description: `Created an invite link${email ? ` for ${email}` : ""} as ${role || "Member"}`,
      category: "Members",
    });

    return invite;
  }

  // Public-facing info shown on the accept-invite page
  static async getInviteInfo(token) {
    const invite = await Invite.findOne({ token }).populate({
      path: "organization",
      select: "name",
    });

    if (!invite) {
      throw new Error("Invite not found");
    }

    return {
      organizationName: invite.organization?.name || "Organization",
      role: invite.role,
      isExpired: invite.expiresAt < new Date(),
      isUsed: invite.isUsed,
    };
  }

  // Accept an invite: create or reactivate the membership for this user
  static async acceptInvite(token, userId) {
    const invite = await Invite.findOne({ token });
    if (!invite) {
      throw new Error("Invite not found");
    }
    if (invite.isUsed) {
      throw new Error("This invite has already been used");
    }
    if (invite.expiresAt < new Date()) {
      throw new Error("This invite has expired");
    }

    const existing = await Membership.findOne({
      organization: invite.organization,
      user: userId,
    });

    if (existing) {
      existing.role = invite.role;
      existing.status = "active";
      existing.invitedBy = invite.invitedBy;
      await existing.save();
    } else {
      await Membership.create({
        organization: invite.organization,
        user: userId,
        role: invite.role,
        permission: "Can View",
        status: "active",
        invitedBy: invite.invitedBy,
      });
    }

    invite.isUsed = true;
    await invite.save();

    await ActivityService.log(invite.organization, userId, {
      action: "member.joined",
      description: `Joined the organization as ${invite.role}`,
      category: "Members",
    });

    const org = await Organization.findById(invite.organization).select("name");
    return { organizationName: org?.name };
  }

  // Cancel a pending invite
  static async cancelInvite(inviteId, requesterId) {
    const invite = await Invite.findById(inviteId);
    if (!invite) {
      throw new Error("Invite not found");
    }

    const isAdmin = await OrganizationService.isOrgAdmin(
      invite.organization,
      requesterId
    );
    if (!isAdmin) {
      throw new Error("Only admins can cancel invites");
    }

    await Invite.findByIdAndDelete(inviteId);
    return true;
  }
}