import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { InviteService } from "@/utils/admin/inviteService";

// GET /api/admin/invites/token/[token]
// Info shown on the accept-invite page
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { token } = await params;

    const info = await InviteService.getInviteInfo(token);

    return NextResponse.json({ success: true, invite: info }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Invite not found" },
      { status: 404 }
    );
  }
}

// POST /api/admin/invites/token/[token]
// Accepts the invite for the currently logged-in user
export async function POST(request, { params }) {
  try {
    await connectDB();

    const authToken = request.cookies.get("token")?.value;
    if (!authToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyAccessToken(authToken);
    if (!decoded?.userId) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const { token } = await params;
    const result = await InviteService.acceptInvite(token, decoded.userId);

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    console.error("Accept invite error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to accept invite" },
      { status: 400 }
    );
  }
}