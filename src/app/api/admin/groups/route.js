import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { OrganizationService } from "@/utils/admin/organizationService";
import { GroupService } from "@/utils/admin/groupService";
import User from "@/models/User";

// Resolve the org to operate on from ?orgId=, falling back to the default
async function resolveOrgFromRequest(decoded, request) {
  const { searchParams } = new URL(request.url);
  const requestedOrgId = searchParams.get("orgId");
  const user = await User.findById(decoded.userId).select("name");
  return OrganizationService.resolveOrgContext(decoded.userId, user?.name, requestedOrgId);
}

// GET /api/admin/groups?orgId=<optional>
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

    const org = await resolveOrgFromRequest(decoded, request);
    const groups = await GroupService.listGroups(org._id);

    return NextResponse.json({ success: true, groups }, { status: 200 });
  } catch (error) {
    console.error("List groups error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load groups" },
      { status: 500 }
    );
  }
}

// POST /api/admin/groups?orgId=<optional>
// body: { name, gradient?, permission?, managerId?, memberIds? }
export async function POST(request) {
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

    const org = await resolveOrgFromRequest(decoded, request);
    const body = await request.json();

    const group = await GroupService.createGroup(org._id, decoded.userId, body);

    return NextResponse.json(
      { success: true, group: { id: group._id.toString(), name: group.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create group error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create group" },
      { status: 400 }
    );
  }
}