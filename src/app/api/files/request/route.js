import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FileRequestService } from "@/utils/fileRequests/fileRequestService";

// POST /api/files/request
// Creates a new file request and returns its token for building the link
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

    const body = await request.json();
    const created = await FileRequestService.createRequest(body, decoded.userId);

    return NextResponse.json(
      {
        success: true,
        request: {
          id: created._id.toString(),
          token: created.token,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create file request error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create request" },
      { status: 500 }
    );
  }
}

// GET /api/files/request?filter=All|Opened|Closed
// Lists the current user's file requests
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
    const filter = searchParams.get("filter") || "All";

    const requests = await FileRequestService.getUserRequests(decoded.userId, {
      filter,
    });

    return NextResponse.json({ success: true, requests }, { status: 200 });
  } catch (error) {
    console.error("List file requests error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load requests" },
      { status: 500 }
    );
  }
}