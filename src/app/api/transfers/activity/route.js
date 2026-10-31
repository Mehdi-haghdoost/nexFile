import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { getActivityRows, getTransferRows } from "@/utils/transfers/transferMonitorService";

// Each tab has its own row shape, built by the monitor service
const TAB_LOADERS = {
  activity: getActivityRows,
  transfers: getTransferRows,
};

// GET /api/transfers/activity?tab=activity|transfers
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "activity";

    // Own keys only, so a name such as "constructor" cannot reach a built-in function
    if (!Object.hasOwn(TAB_LOADERS, tab)) {
      return NextResponse.json(
        { success: false, message: "Unknown tab" },
        { status: 400 }
      );
    }

    const rows = await TAB_LOADERS[tab](userId);

    return NextResponse.json({ success: true, tab, rows });
  } catch (error) {
    console.error("Get transfer activity error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}