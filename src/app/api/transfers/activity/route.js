import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import {
  getActivityRows,
  getTransferRows,
  parseActivityCursor,
} from "@/utils/transfers/transferMonitorService";
import { getPublicOrigin } from "@/utils/transfers/transferRouteHelpers";

// Each tab has its own row shape, built by the monitor service; only Activity is paged
const TAB_LOADERS = {
  activity: (userId, { before }) => getActivityRows(userId, { before }),
  transfers: async (userId, { origin }) => ({
    rows: await getTransferRows(userId, { origin }),
    nextCursor: null,
  }),
};

// GET /api/transfers/activity?tab=activity|transfers&cursor=<nextCursor from the previous page>
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

    // A cursor the service did not produce would restart the list and repeat rows, so it is refused
    const cursor = searchParams.get("cursor");
    const before = cursor ? parseActivityCursor(cursor) : null;

    if (cursor && !before) {
      return NextResponse.json(
        { success: false, message: "Invalid cursor" },
        { status: 400 }
      );
    }

    // Public links use NEXT_PUBLIC_APP_URL when it is set, falling back to the request origin
    const { rows, nextCursor } = await TAB_LOADERS[tab](userId, {
      origin: getPublicOrigin(request),
      before,
    });

    return NextResponse.json({ success: true, tab, rows, nextCursor });
  } catch (error) {
    console.error("Get transfer activity error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}