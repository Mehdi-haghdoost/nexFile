import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { MembershipService } from "@/utils/admin/membershipService";

// PATCH /api/admin/members/[id]
// body: { role?, permission?, status? }
export async function PATCH(request, { params }) {
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
    const body = await request.json();

    await MembershipService.updateMember(id, decoded.userId, body);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update member error:", error);
    const code = error.message?.includes("not found") ? 404 : 400;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update member" },
      { status: code }
    );
  }
}

// DELETE /api/admin/members/[id]
// Soft-removes the member (status becomes 'removed')
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
    await MembershipService.removeMember(id, decoded.userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Remove member error:", error);
    const code = error.message?.includes("not found") ? 404 : 400;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to remove member" },
      { status: code }
    );
  }
}