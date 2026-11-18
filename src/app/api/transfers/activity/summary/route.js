import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import {
  getAttentionItems,
  getMonitorSummary,
  normalizeSummaryWindow,
} from "@/utils/transfers/transferMonitorService";
import { getPublicOrigin } from "@/utils/transfers/transferRouteHelpers";

// GET /api/transfers/activity/summary?days=7|30
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    // Only 7 or 30 days are offered; anything else, or no value, means 7
    const { searchParams } = new URL(request.url);
    const windowDays = normalizeSummaryWindow(searchParams.get("days"));

    // Public links use NEXT_PUBLIC_APP_URL when it is set, falling back to the request origin
    const [summary, attention] = await Promise.all([
      getMonitorSummary(userId, { windowDays }),
      getAttentionItems(userId, { origin: getPublicOrigin(request) }),
    ]);

    return NextResponse.json({
      success: true,
      summary,
      attention: { items: attention.items, total: attention.total },
      totalTransfers: attention.totalTransfers,
    });
  } catch (error) {
    console.error("Get transfer summary error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}