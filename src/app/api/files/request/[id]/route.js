import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FileRequestService } from "@/utils/fileRequests/fileRequestService";

// PATCH /api/files/request/[id]
// body: { status: 'opened' | 'closed' }
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!["opened", "closed"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    await FileRequestService.updateStatus(id, decoded.userId, status);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update file request error:", error);
    const code = error.message?.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update request" },
      { status: code }
    );
  }
}

// DELETE /api/files/request/[id]
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await FileRequestService.deleteRequest(id, decoded.userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete file request error:", error);
    const code = error.message?.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete request" },
      { status: code }
    );
  }
}