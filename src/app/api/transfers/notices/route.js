import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Transfer from "@/models/Transfer";
import { requireUser } from "@/utils/auth/requireUser";
import { buildTransferNotices } from "@/utils/transfers/transferNotices";

// Only recent transfers can produce a notice worth reading
const SCAN_LIMIT = 60;

// Returns the caller's notice feed, derived rather than stored
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const transfers = await Transfer.find({ owner: userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(SCAN_LIMIT)
      .select("groupName createdAt expirationDate firstDownloadedAt filesPurgedAt recipients");

    return NextResponse.json({
      success: true,
      notices: buildTransferNotices(transfers),
    });
  } catch (error) {
    console.error("Transfer notices error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}