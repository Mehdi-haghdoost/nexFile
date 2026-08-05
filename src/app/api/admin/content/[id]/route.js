import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { ContentService } from "@/utils/admin/contentService";

// PATCH /api/admin/content/[id]
// body: { isArchived }
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
    const { isArchived } = await request.json();

    await ContentService.setArchived(id, Boolean(isArchived));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update content error:", error);
    const code = error.message?.includes("not found") ? 404 : 400;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update folder" },
      { status: code }
    );
  }
}