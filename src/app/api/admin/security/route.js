import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { OrganizationService } from "@/utils/admin/organizationService";
import { ActivityService } from "@/utils/admin/activityService";
import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import File from "@/models/File";
import Folder from "@/models/Folder";
import User from "@/models/User";

// Organization-scoped keys only. Password and two-step verification belong to
// the individual user and are handled under /api/auth/*.
const ORG_SECURITY_KEYS = ["linkPassword", "linkExpiration", "externalSharing"];

// Count existing share links across the org that violate a policy
async function countViolatingLinks(orgId, { requirePassword, requireExpiry }) {
  const memberships = await Membership.find({
    organization: orgId,
    status: "active",
  })
    .select("user")
    .lean();

  const memberIds = memberships.map((m) => m.user);
  if (memberIds.length === 0) return 0;

  const conditions = [];
  if (requirePassword) {
    conditions.push({ "shareLink.isPasswordEnabled": { $ne: true } });
  }
  if (requireExpiry) {
    conditions.push({ "shareLink.isExpirationEnabled": { $ne: true } });
  }
  if (conditions.length === 0) return 0;

  const query = {
    owner: { $in: memberIds },
    isDeleted: false,
    "shareLink.updatedAt": { $ne: null },
    $or: conditions,
  };

  const [files, folders] = await Promise.all([
    File.countDocuments(query),
    Folder.countDocuments(query),
  ]);

  return files + folders;
}

/** Strips the legacy per-user key that used to live on the organization. */
const pickOrgSecurity = (security = {}) => ({
  linkPassword: Boolean(security.linkPassword),
  linkExpiration: Boolean(security.linkExpiration),
  externalSharing: security.externalSharing || "Email and link",
});

// GET /api/admin/security
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const user = await User.findById(userId).select("name");
    const org = await OrganizationService.resolveOrgContext(userId, user?.name);

    const isAdmin = await OrganizationService.isOrgAdmin(org._id, userId);

    return NextResponse.json(
      {
        success: true,
        security: pickOrgSecurity(org.security),
        // Lets the UI disable org-wide controls for non-admin members.
        isAdmin,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get security settings error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load settings" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/security
// body: { linkPassword?, linkExpiration?, externalSharing? }
export async function PATCH(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const user = await User.findById(userId).select("name");
    const orgContext = await OrganizationService.resolveOrgContext(userId, user?.name);

    const isAdmin = await OrganizationService.isOrgAdmin(orgContext._id, userId);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Only admins can change security settings" },
        { status: 403 }
      );
    }

    const updates = await request.json();

    // Reject personal keys explicitly rather than ignoring them silently.
    if (updates.twoStepVerification !== undefined || updates.password !== undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Password and two-step verification are managed per user",
        },
        { status: 400 }
      );
    }

    const org = await Organization.findById(orgContext._id);

    if (!org.security) {
      org.security = {};
    }

    const changed = [];

    for (const key of ORG_SECURITY_KEYS) {
      if (updates[key] !== undefined) {
        org.security[key] = updates[key];
        changed.push(key);
      }
    }

    if (changed.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid settings provided" },
        { status: 400 }
      );
    }

    org.markModified("security");
    await org.save();

    // Report existing links that don't satisfy a policy being switched on
    let warning = null;
    const turningOnPassword = updates.linkPassword === true;
    const turningOnExpiry = updates.linkExpiration === true;

    if (turningOnPassword || turningOnExpiry) {
      const violating = await countViolatingLinks(org._id, {
        requirePassword: turningOnPassword,
        requireExpiry: turningOnExpiry,
      });

      if (violating > 0) {
        warning = `${violating} existing share link${violating > 1 ? "s" : ""} don't meet this policy. New and updated links will be required to comply.`;
      }
    }

    await ActivityService.log(org._id, userId, {
      action: "security.updated",
      description: `Updated security settings: ${changed.join(", ")}`,
      category: "Security",
    });

    return NextResponse.json(
      { success: true, security: pickOrgSecurity(org.security), warning },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update security settings error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}