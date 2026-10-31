import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { getMonitorSummary } from "@/utils/transfers/transferMonitorService";

// GET /api/transfers/activity/summary
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const summary = await getMonitorSummary(userId);

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error("Get transfer summary error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}