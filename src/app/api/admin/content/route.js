import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { OrganizationService } from "@/utils/admin/organizationService";
import { ContentService } from "@/utils/admin/contentService";
import User from "@/models/User";

// GET /api/admin/content?tab=shared-folder|team-folder|archived|locked-files|member-access
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
    const requestedOrgId = searchParams.get("orgId");
    const tab = searchParams.get("tab") || "shared-folder";

    const user = await User.findById(decoded.userId).select("name");
    const org = await OrganizationService.resolveOrgContext(decoded.userId, user?.name, requestedOrgId);

    const items = await ContentService.listContent(org._id, tab);

    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (error) {
    console.error("List content error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load content" },
      { status: 500 }
    );
  }
}