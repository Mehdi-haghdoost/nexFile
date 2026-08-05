import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { GroupService } from "@/utils/admin/groupService";

// PATCH /api/admin/groups/[id]
// body: { name?, permission?, gradient?, managerId?, memberIds? }
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

    await GroupService.updateGroup(id, decoded.userId, body);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update group error:", error);
    const code = error.message?.includes("not found") ? 404 : 400;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update group" },
      { status: code }
    );
  }
}

// DELETE /api/admin/groups/[id]
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
    await GroupService.deleteGroup(id, decoded.userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete group error:", error);
    const code = error.message?.includes("not found") ? 404 : 400;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete group" },
      { status: code }
    );
  }
}