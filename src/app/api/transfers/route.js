import crypto from "crypto";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { hashPassword } from "@/utils/auth/hashPassword";
import Transfer from "@/models/Transfer";
import User from "@/models/User";
import {
  buildShareLink,
  buildTransferQuery,
  isOwnedTransferAsset,
  normalizeRecipients,
  serializeTransfer,
} from "@/utils/transfers/transferService";
import { deliverTransferEmails } from "@/utils/transfers/transferMailer";
import { getPublicOrigin } from "@/utils/transfers/transferRouteHelpers";
import {
  TRANSFER_ALLOWED_EXPIRY_DAYS,
  TRANSFER_DEFAULT_EXPIRY_DAYS,
  TRANSFER_MAX_MESSAGE_LENGTH,
  TRANSFER_MAX_RECIPIENTS,
  TRANSFER_MIN_PASSWORD_LENGTH,
} from "@/utils/constants/transferConstants";

// Shared shape for the validation failures in POST
const badRequest = (message) =>
  NextResponse.json({ success: false, message }, { status: 400 });

export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { searchParams, origin } = new URL(request.url);
    const tab = searchParams.get("tab") || "sent";
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";

    // The received tab matches on email, so it needs the user record
    let userEmail = null;
    if (tab === "received") {
      const user = await User.findById(decoded.userId).select("email");
      userEmail = user?.email || null;

      if (!userEmail) {
        return NextResponse.json({ success: true, transfers: [] });
      }
    }

    const query = buildTransferQuery({
      userId: decoded.userId,
      userEmail,
      tab,
      status,
      search,
    });

    const transfers = await Transfer.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      transfers: transfers.map((t) => serializeTransfer(t, origin)),
    });

  } catch (error) {
    console.error("List transfers error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      groupName,
      type,
      files,
      expiresInDays,
      password,
      recipients,
      message: rawMessage,
    } = body;

    if (!Array.isArray(files) || files.length === 0) {
      return badRequest("At least one file is required");
    }

    // Rejects assets the caller did not upload, so a transfer cannot expose or delete someone else's file
    if (!files.every((file) => isOwnedTransferAsset(file, decoded.userId))) {
      return badRequest("One or more files do not belong to this account");
    }

    // Falls back to the default rather than erroring on an unlisted value
    const requestedDays = Number(expiresInDays);
    const days = TRANSFER_ALLOWED_EXPIRY_DAYS.includes(requestedDays)
      ? requestedDays
      : TRANSFER_DEFAULT_EXPIRY_DAYS;

    const sharePassword = typeof password === "string" ? password.trim() : "";

    if (sharePassword && sharePassword.length < TRANSFER_MIN_PASSWORD_LENGTH) {
      return badRequest(`Password must be at least ${TRANSFER_MIN_PASSWORD_LENGTH} characters`);
    }

    const isEmailTransfer = type === "email";
    const { valid: recipientEmails, invalid: invalidRecipients } = normalizeRecipients(
      isEmailTransfer ? recipients : []
    );

    if (isEmailTransfer) {
      if (invalidRecipients.length) {
        return badRequest(`Invalid email address: ${invalidRecipients[0]}`);
      }
      if (!recipientEmails.length) {
        return badRequest("Add at least one recipient");
      }
      if (recipientEmails.length > TRANSFER_MAX_RECIPIENTS) {
        return badRequest(`A transfer can be sent to up to ${TRANSFER_MAX_RECIPIENTS} people`);
      }
    }

    const note = isEmailTransfer && typeof rawMessage === "string"
      ? rawMessage.trim().slice(0, TRANSFER_MAX_MESSAGE_LENGTH)
      : "";

    const normalizedFiles = files.map((file) => ({
      name: file.name,
      extension: file.extension || "file",
      mimeType: file.mimeType || "application/octet-stream",
      size: Number(file.size) || 0,
      url: file.url,
      cloudinaryId: file.cloudinaryId,
      resourceType: file.resourceType || "raw",
      isPrivate: Boolean(file.isPrivate),
    }));

    const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    // Hashed with the same bcrypt helper as account passwords, never stored raw
    const passwordHash = sharePassword ? await hashPassword(sharePassword) : null;

    const transfer = await Transfer.create({
      groupName: groupName || normalizedFiles[0].name || "Untitled Transfer",
      owner: decoded.userId,
      type: isEmailTransfer ? "email" : "link",
      token: crypto.randomBytes(16).toString("hex"),
      files: normalizedFiles,
      filesCount: normalizedFiles.length,
      totalSize: normalizedFiles.reduce((sum, file) => sum + file.size, 0),
      message: note,
      expirationDate,
      isPasswordEnabled: Boolean(passwordHash),
      password: passwordHash,
    });

    const { origin } = new URL(request.url);
    let delivery = null;

    // The transfer is saved first, so a failed email never loses the link
    if (isEmailTransfer) {
      const sender = await User.findById(decoded.userId).select("name email");

      transfer.recipients = await deliverTransferEmails({
        transfer,
        emails: recipientEmails,
        sender,
        link: buildShareLink(transfer.token, getPublicOrigin(request)),
      });
      await transfer.save();

      delivery = {
        sent: transfer.recipients.filter((r) => r.status === "sent").map((r) => r.email),
        failed: transfer.recipients.filter((r) => r.status === "failed").map((r) => r.email),
      };
    }

    return NextResponse.json({
      success: true,
      message: isEmailTransfer ? "Transfer sent" : "Transfer created",
      transfer: serializeTransfer(transfer, origin, { includeRecipients: true }),
      delivery,
    });

  } catch (error) {
    console.error("Create transfer error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}