import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { MonitorService } from "@/utils/monitor/monitorService";

// GET /api/files/monitor?tab=Viewer|Files
// Returns aggregated monitoring rows for the requested tab
export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "Viewer";

    const rows =
      tab === "Files"
        ? await MonitorService.getFileRows(decoded.userId)
        : await MonitorService.getViewerRows(decoded.userId);

    return NextResponse.json({ success: true, rows }, { status: 200 });
  } catch (error) {
    console.error("Get monitor rows error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load monitoring data" },
      { status: 500 }
    );
  }
}

// POST /api/files/monitor
// body: { fileId }
// Demo: registers a send and seeds sample view activity for that file
export async function POST(request) {
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

    const { fileId } = await request.json();
    if (!fileId) {
      return NextResponse.json(
        { success: false, message: "fileId is required" },
        { status: 400 }
      );
    }

    const result = await MonitorService.createSendWithSampleViews(
      fileId,
      decoded.userId
    );

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error) {
    console.error("Create send error:", error);
    const code = error.message?.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send file" },
      { status: code }
    );
  }
}