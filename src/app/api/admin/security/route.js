import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { OrganizationService } from "@/utils/admin/organizationService";
import { ActivityService } from "@/utils/admin/activityService";
import Organization from "@/models/Organization";
import User from "@/models/User";

// GET /api/admin/security
// Returns the organization's security settings
export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select("name");
    const org = await OrganizationService.resolveOrgContext(decoded.userId, user?.name);

    return NextResponse.json(
      { success: true, security: org.security || {} },
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
// body: { twoStepVerification?, linkPassword?, linkExpiration?, externalSharing? }
export async function PATCH(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select("name");
    const orgContext = await OrganizationService.resolveOrgContext(decoded.userId, user?.name);

    const isAdmin = await OrganizationService.isOrgAdmin(orgContext._id, decoded.userId);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Only admins can change security settings" },
        { status: 403 }
      );
    }

    const updates = await request.json();
    const org = await Organization.findById(orgContext._id);

    // Ensure the nested security object exists on older documents
    if (!org.security) {
      org.security = {};
    }

    const allowed = ["twoStepVerification", "linkPassword", "linkExpiration", "externalSharing"];
    const changed = [];

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        org.security[key] = updates[key];
        changed.push(key);
      }
    }

    org.markModified("security");
    await org.save();

    if (changed.length > 0) {
      await ActivityService.log(org._id, decoded.userId, {
        action: "security.updated",
        description: `Updated security settings: ${changed.join(", ")}`,
        category: "Security",
      });
    }

    return NextResponse.json({ success: true, security: org.security }, { status: 200 });
  } catch (error) {
    console.error("Update security settings error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}