import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { loadOwnedTransfer } from "@/utils/transfers/transferRouteHelpers";
import { serializeTransfer } from "@/utils/transfers/transferService";

// Expires a transfer immediately while keeping its record, so it can be reactivated later
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { transfer, response } = await loadOwnedTransfer(request, id);
    if (response) return response;

    // An already expired transfer is left alone so a natural lapse is never recorded as ended early
    if (transfer.expirationDate > new Date()) {
      const now = new Date();
      transfer.expirationDate = now;
      transfer.endedAt = now;
      await transfer.save();
    }

    const { origin } = new URL(request.url);

    return NextResponse.json({
      success: true,
      message: "Transfer ended",
      transfer: serializeTransfer(transfer, origin),
    });
  } catch (error) {
    console.error("End transfer error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}