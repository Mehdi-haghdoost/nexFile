import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getPublicOrigin, loadOwnedTransfer } from "@/utils/transfers/transferRouteHelpers";
import {
  buildShareLink,
  getTransferStatus,
  serializeTransfer,
} from "@/utils/transfers/transferService";
import { deliverTransferEmails } from "@/utils/transfers/transferMailer";

// Retries failed deliveries, either for one address or for every failed one
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { transfer, userId, response } = await loadOwnedTransfer(request, id);
    if (response) return response;

    // Emailing a link that no longer works would only confuse the recipient
    if (getTransferStatus(transfer.expirationDate) === "expired") {
      return NextResponse.json(
        { success: false, message: "Reactivate the transfer before resending" },
        { status: 400 }
      );
    }

    const { email } = await request.json().catch(() => ({}));
    const target = typeof email === "string" ? email.trim().toLowerCase() : "";

    // Only failed deliveries qualify, so this route cannot repeatedly email someone who already has it
    const failedEmails = transfer.recipients
      .filter((recipient) => recipient.status === "failed")
      .map((recipient) => recipient.email);

    const emails = target ? failedEmails.filter((address) => address === target) : failedEmails;

    if (!emails.length) {
      return NextResponse.json(
        { success: false, message: "There are no failed deliveries to retry" },
        { status: 400 }
      );
    }

    const sender = await User.findById(userId).select("name email");

    const results = await deliverTransferEmails({
      transfer,
      emails,
      sender,
      link: buildShareLink(transfer.token, getPublicOrigin(request)),
    });

    // Updates each retried recipient in place and leaves the others untouched
    const resultsByEmail = new Map(results.map((result) => [result.email, result]));

    transfer.recipients.forEach((recipient) => {
      const result = resultsByEmail.get(recipient.email);
      if (!result) return;

      recipient.status = result.status;
      recipient.sentAt = result.sentAt;
      recipient.failureCode = result.failureCode;
    });

    await transfer.save();

    const { origin } = new URL(request.url);

    return NextResponse.json({
      success: true,
      transfer: serializeTransfer(transfer, origin, { includeRecipients: true }),
      delivery: {
        sent: results.filter((result) => result.status === "sent").map((result) => result.email),
        failed: results.filter((result) => result.status === "failed").map((result) => result.email),
      },
    });
  } catch (error) {
    console.error("Resend transfer email error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}