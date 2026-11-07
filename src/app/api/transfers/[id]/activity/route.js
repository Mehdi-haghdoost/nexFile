import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { loadOwnedTransfer } from "@/utils/transfers/transferRouteHelpers";
import {
  getTransferActivityPage,
  getTransferActivityStats,
  parseActivityCursor,
} from "@/utils/transfers/transferMonitorService";

// GET /api/transfers/[id]/activity?before=<cursor>
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Missing, deleted and someone else's transfers all get the same 404
    const { transfer, response } = await loadOwnedTransfer(request, id);
    if (response) return response;

    const rawCursor = new URL(request.url).searchParams.get("before");
    const before = rawCursor ? parseActivityCursor(rawCursor) : null;

    if (rawCursor && !before) {
      return NextResponse.json(
        { success: false, message: "Invalid cursor" },
        { status: 400 }
      );
    }

    // The figures come with the first page only, since older pages never change them
    const [page, stats] = await Promise.all([
      getTransferActivityPage(transfer._id, { before }),
      before ? null : getTransferActivityStats(transfer),
    ]);

    return NextResponse.json({
      success: true,
      events: page.events,
      nextCursor: page.nextCursor,
      ...(stats && { stats }),
    });
  } catch (error) {
    console.error("Get transfer activity timeline error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}