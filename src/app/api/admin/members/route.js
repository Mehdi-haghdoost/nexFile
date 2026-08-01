import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { OrganizationService } from "@/utils/admin/organizationService";
import { MembershipService } from "@/utils/admin/membershipService";
import { InviteService } from "@/utils/admin/inviteService";
import User from "@/models/User";

// Resolve the org to operate on from the ?orgId= query param, falling back
// to the requester's default organization.
async function resolveOrgFromRequest(decoded, request) {
  const { searchParams } = new URL(request.url);
  const requestedOrgId = searchParams.get("orgId");
  const user = await User.findById(decoded.userId).select("name");
  return OrganizationService.resolveOrgContext(decoded.userId, user?.name, requestedOrgId);
}

// GET /api/admin/members?tab=active|guests|invited|suspended|removed|suggested&orgId=<optional>
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

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "active";

    const members = await MembershipService.listMembers(org._id, tab);

    return NextResponse.json({ success: true, members }, { status: 200 });
  } catch (error) {
    console.error("List members error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load members" },
      { status: 500 }
    );
  }
}

// POST /api/admin/members?orgId=<optional>
// body: { email?, role } -> creates a link-based invite for the resolved org
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
    const { email, role } = await request.json();

    const invite = await InviteService.createInvite(org._id, decoded.userId, { email, role });

    return NextResponse.json(
      { success: true, invite: { id: invite._id.toString(), token: invite.token } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create invite error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create invite" },
      { status: 400 }
    );
  }
}