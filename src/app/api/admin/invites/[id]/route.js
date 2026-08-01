import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { InviteService } from "@/utils/admin/inviteService";

// DELETE /api/admin/invites/[id]
// Cancels a pending invite by its own _id
export async function DELETE(request, { params }) {
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

    const { id } = await params;
    await InviteService.cancelInvite(id, decoded.userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Cancel invite error:", error);
    const code = error.message?.includes("not found") ? 404 : 400;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to cancel invite" },
      { status: code }
    );
  }
}