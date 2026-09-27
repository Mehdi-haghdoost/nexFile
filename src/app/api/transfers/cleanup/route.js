import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { runTransferCleanup } from "@/utils/transfers/transferCleanup";

// Accepts the bearer token schedulers send, or a plain header for a manual run
const isAuthorized = (request) => {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const bearer = request.headers.get("authorization");
  if (bearer === `Bearer ${secret}`) return true;

  return request.headers.get("x-cron-secret") === secret;
};

// Removes the stored files of transfers whose grace period has passed
export async function POST(request) {
  // This route deletes files, so an unset secret disables it rather than leaving it open
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const result = await runTransferCleanup();

    console.log("Transfer cleanup:", result);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Transfer cleanup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}