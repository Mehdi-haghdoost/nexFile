import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getPublicOrigin, loadOwnedTransfer } from "@/utils/transfers/transferRouteHelpers";
import { serializeTransfer } from "@/utils/transfers/transferService";
import { TRANSFER_MAX_NAME_LENGTH } from "@/utils/constants/transferConstants";

// Shared shape for the validation failures below
const badRequest = (message) =>
  NextResponse.json({ success: false, message }, { status: 400 });

// Renames a transfer; only the name changes, whatever state the transfer is in
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { transfer, response } = await loadOwnedTransfer(request, id);
    if (response) return response;

    // A missing, unreadable or non-object body simply has no name in it
    const body = await request.json().catch(() => null);
    const groupName = body && typeof body === "object" ? body.groupName : undefined;

    // Only text counts, and spaces alone are no name at all
    const name = typeof groupName === "string" ? groupName.trim() : "";

    if (!name) {
      return badRequest("Enter a transfer name");
    }

    if (name.length > TRANSFER_MAX_NAME_LENGTH) {
      return badRequest(`Transfer name cannot exceed ${TRANSFER_MAX_NAME_LENGTH} characters`);
    }

    // Saving the same name again would only touch updatedAt
    if (name !== transfer.groupName) {
      transfer.groupName = name;
      await transfer.save();
    }

    // Keeps the details page link on the same public URL after renaming
    const origin = getPublicOrigin(request);

    return NextResponse.json({
      success: true,
      message: "Transfer renamed",
      transfer: serializeTransfer(transfer, origin),
    });
  } catch (error) {
    console.error("Rename transfer error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}