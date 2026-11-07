import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { getAttentionItems, getMonitorSummary } from "@/utils/transfers/transferMonitorService";
import { getPublicOrigin } from "@/utils/transfers/transferRouteHelpers";

// GET /api/transfers/activity/summary
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    // Public links use NEXT_PUBLIC_APP_URL when it is set, falling back to the request origin
    const [summary, attention] = await Promise.all([
      getMonitorSummary(userId),
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