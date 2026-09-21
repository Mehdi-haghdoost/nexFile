import crypto from "crypto";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { hashPassword } from "@/utils/auth/hashPassword";
import Transfer from "@/models/Transfer";
import User from "@/models/User";
import {
  buildTransferQuery,
  isOwnedTransferAsset,
  serializeTransfer,
} from "@/utils/transfers/transferService";
import {
  TRANSFER_ALLOWED_EXPIRY_DAYS,
  TRANSFER_DEFAULT_EXPIRY_DAYS,
  TRANSFER_MIN_PASSWORD_LENGTH,
} from "@/utils/constants/transferConstants";

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
    const { groupName, type, files, expiresInDays, password } = body;

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one file is required" },
        { status: 400 }
      );
    }

    // Rejects assets the caller did not upload, so a transfer cannot expose or delete someone else's file
    if (!files.every((file) => isOwnedTransferAsset(file, decoded.userId))) {
      return NextResponse.json(
        { success: false, message: "One or more files do not belong to this account" },
        { status: 400 }
      );
    }

    // Falls back to the default rather than erroring on an unlisted value
    const requestedDays = Number(expiresInDays);
    const days = TRANSFER_ALLOWED_EXPIRY_DAYS.includes(requestedDays)
      ? requestedDays
      : TRANSFER_DEFAULT_EXPIRY_DAYS;

    const sharePassword = typeof password === "string" ? password.trim() : "";

    if (sharePassword && sharePassword.length < TRANSFER_MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          message: `Password must be at least ${TRANSFER_MIN_PASSWORD_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    const normalizedFiles = files.map((file) => ({
      name: file.name,
      extension: file.extension || "file",
      mimeType: file.mimeType || "application/octet-stream",
      size: Number(file.size) || 0,
      url: file.url,
      cloudinaryId: file.cloudinaryId,
      resourceType: file.resourceType || "raw",
    }));

    const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    // Hashed with the same bcrypt helper as account passwords, never stored raw
    const passwordHash = sharePassword ? await hashPassword(sharePassword) : null;

    const transfer = await Transfer.create({
      groupName: groupName || normalizedFiles[0].name || "Untitled Transfer",
      owner: decoded.userId,
      type: type === "email" ? "email" : "link",
      token: crypto.randomBytes(16).toString("hex"),
      files: normalizedFiles,
      filesCount: normalizedFiles.length,
      totalSize: normalizedFiles.reduce((sum, file) => sum + file.size, 0),
      expirationDate,
      isPasswordEnabled: Boolean(passwordHash),
      password: passwordHash,
    });

    const { origin } = new URL(request.url);

    return NextResponse.json({
      success: true,
      message: "Transfer created",
      transfer: serializeTransfer(transfer, origin),
    });

  } catch (error) {
    console.error("Create transfer error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}