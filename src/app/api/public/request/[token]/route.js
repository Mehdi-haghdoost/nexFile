import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { FileRequestService } from "@/utils/fileRequests/fileRequestService";

// GET /api/public/request/[token]
// Public endpoint: no auth, no owner data exposed
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { token } = await params;

    const data = await FileRequestService.getPublicRequest(token);

    return NextResponse.json({ success: true, request: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Request not found" },
      { status: 404 }
    );
  }
}

// POST /api/public/request/[token]
// Test-mode: records a submission without storing the actual file yet
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { token } = await params;

    await FileRequestService.recordTestSubmission(token);

    return NextResponse.json(
      { success: true, message: "Test submission recorded" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit" },
      { status: 400 }
    );
  }
}