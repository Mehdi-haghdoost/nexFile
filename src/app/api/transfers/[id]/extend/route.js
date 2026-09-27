import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { loadOwnedTransfer } from "@/utils/transfers/transferRouteHelpers";
import { serializeTransfer } from "@/utils/transfers/transferService";
import { TRANSFER_ALLOWED_EXPIRY_DAYS } from "@/utils/constants/transferConstants";

const DAY_MS = 24 * 60 * 60 * 1000;

// Sets a new expiry counted from now, which also reactivates an ended or expired transfer
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { transfer, response } = await loadOwnedTransfer(request, id);
    if (response) return response;

    // Reactivating a cleaned-up transfer would give recipients a working link to nothing
    if (transfer.filesPurgedAt) {
      return NextResponse.json(
        {
          success: false,
          message: "This transfer's files were removed after it expired, so it cannot be reactivated",
        },
        { status: 400 }
      );
    }

    const { expiresInDays } = await request.json().catch(() => ({}));
    const days = Number(expiresInDays);

    // Strict, unlike create, since a silent fallback would set a date the sender never chose
    if (!TRANSFER_ALLOWED_EXPIRY_DAYS.includes(days)) {
      return NextResponse.json(
        { success: false, message: "Choose one of the listed expiry options" },
        { status: 400 }
      );
    }

    transfer.expirationDate = new Date(Date.now() + days * DAY_MS);
    transfer.endedAt = null;
    await transfer.save();

    const { origin } = new URL(request.url);

    return NextResponse.json({
      success: true,
      message: "Expiry updated",
      transfer: serializeTransfer(transfer, origin),
    });
  } catch (error) {
    console.error("Extend transfer error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}