import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Transfer from "@/models/Transfer";
import { verifyPassword } from "@/utils/auth/hashPassword";

// Public route, no auth cookie required
// Returns metadata on GET; file URLs are only released once any password clears
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { token } = await params;

    const transfer = await Transfer.findOne({ token, isDeleted: false });

    if (!transfer) {
      return NextResponse.json(
        { success: false, message: "Transfer not found" },
        { status: 404 }
      );
    }

    if (transfer.expirationDate <= new Date()) {
      return NextResponse.json(
        { success: false, message: "This transfer has expired" },
        { status: 410 }
      );
    }

    await Transfer.updateOne({ _id: transfer._id }, { $inc: { viewCount: 1 } });

    return NextResponse.json({
      success: true,
      transfer: {
        groupName: transfer.groupName,
        filesCount: transfer.filesCount,
        totalSize: transfer.totalSize,
        expirationDate: transfer.expirationDate,
        isPasswordEnabled: transfer.isPasswordEnabled,
        // Names are safe to show; URLs are withheld until the password clears
        files: transfer.files.map((file) => ({
          name: file.name,
          extension: file.extension,
          size: file.size,
          url: transfer.isPasswordEnabled ? null : file.url,
        })),
      },
    });
  } catch (error) {
    console.error("Get public transfer error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Unlocks a password protected transfer and counts the download
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { token } = await params;
    const { password } = await request.json();

    const transfer = await Transfer.findOne({ token, isDeleted: false });

    if (!transfer) {
      return NextResponse.json(
        { success: false, message: "Transfer not found" },
        { status: 404 }
      );
    }

    if (transfer.expirationDate <= new Date()) {
      return NextResponse.json(
        { success: false, message: "This transfer has expired" },
        { status: 410 }
      );
    }

    if (transfer.isPasswordEnabled) {
      if (!password) {
        return NextResponse.json(
          { success: false, message: "Password is required" },
          { status: 400 }
        );
      }

      const isValid = await verifyPassword(password, transfer.password);

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: "Incorrect password" },
          { status: 401 }
        );
      }
    }

    await Transfer.updateOne({ _id: transfer._id }, { $inc: { downloadCount: 1 } });

    return NextResponse.json({
      success: true,
      files: transfer.files.map((file) => ({
        name: file.name,
        extension: file.extension,
        size: file.size,
        url: file.url,
      })),
    });
  } catch (error) {
    console.error("Unlock transfer error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}