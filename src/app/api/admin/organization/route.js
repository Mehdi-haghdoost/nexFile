import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { OrganizationService } from "@/utils/admin/organizationService";
import User from "@/models/User";

// GET /api/admin/organization?orgId=<optional>
// Returns the resolved organization context plus the full list of
// organizations the user can switch between.
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

    const user = await User.findById(decoded.userId).select("name");
    const org = await OrganizationService.resolveOrgContext(
      decoded.userId,
      user?.name,
      requestedOrgId
    );
    const organizations = await OrganizationService.getUserOrganizations(decoded.userId);

    return NextResponse.json(
      {
        success: true,
        organization: { id: org._id.toString(), name: org.name, plan: org.plan },
        organizations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get organization error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load organization" },
      { status: 500 }
    );
  }
}