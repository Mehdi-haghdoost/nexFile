import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { OrganizationService } from "@/utils/admin/organizationService";
import { ActivityService } from "@/utils/admin/activityService";
import User from "@/models/User";

// GET /api/admin/activity?category=all|Members|Groups|Content|Security
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

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";

    const user = await User.findById(decoded.userId).select("name");
    const org = await OrganizationService.resolveOrgContext(decoded.userId, user?.name);

    const activities = await ActivityService.listActivity(org._id, { category });

    return NextResponse.json({ success: true, activities }, { status: 200 });
  } catch (error) {
    console.error("List activity error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load activity" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/activity
// Clears the organization's activity log (admins only)
export async function DELETE(request) {
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

    const isAdmin = await OrganizationService.isOrgAdmin(org._id, decoded.userId);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Only admins can clear activity" },
        { status: 403 }
      );
    }

    const deleted = await ActivityService.clearActivity(org._id);

    return NextResponse.json({ success: true, deleted }, { status: 200 });
  } catch (error) {
    console.error("Clear activity error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to clear activity" },
      { status: 500 }
    );
  }
}