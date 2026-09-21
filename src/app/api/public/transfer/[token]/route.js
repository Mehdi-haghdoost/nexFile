import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Transfer from "@/models/Transfer";
import { verifyPassword } from "@/utils/auth/hashPassword";
import {
  buildPublicFiles,
  getTransferAccessCookiePath,
  signTransferAccess,
  verifyTransferAccess,
} from "@/utils/transfers/transferAccess";
import {
  TRANSFER_ACCESS_COOKIE,
  TRANSFER_ACCESS_TTL_SECONDS,
} from "@/utils/constants/transferConstants";

// Finds a live transfer or returns the response explaining why it is unavailable
const findLiveTransfer = async (token) => {
  const transfer = await Transfer.findOne({ token, isDeleted: false });

  if (!transfer) {
    return {
      error: NextResponse.json(
        { success: false, message: "Transfer not found" },
        { status: 404 }
      ),
    };
  }

  if (transfer.expirationDate <= new Date()) {
    return {
      error: NextResponse.json(
        { success: false, message: "This transfer has expired" },
        { status: 410 }
      ),
    };
  }

  return { transfer };
};

// Public route: returns transfer details and counts a view
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { token } = await params;
    const { transfer, error } = await findLiveTransfer(token);
    if (error) return error;

    await Transfer.updateOne({ _id: transfer._id }, { $inc: { viewCount: 1 } });

    // A recipient who unlocked earlier keeps access until the cookie expires
    const hasAccess =
      !transfer.isPasswordEnabled ||
      verifyTransferAccess(request.cookies.get(TRANSFER_ACCESS_COOKIE)?.value, transfer._id);

    return NextResponse.json({
      success: true,
      transfer: {
        groupName: transfer.groupName,
        filesCount: transfer.filesCount,
        totalSize: transfer.totalSize,
        expirationDate: transfer.expirationDate,
        isPasswordEnabled: transfer.isPasswordEnabled,
        isUnlocked: hasAccess,
        files: buildPublicFiles(transfer, hasAccess),
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

// Verifies a transfer password and grants access through a scoped cookie
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { token } = await params;
    const { password } = await request.json().catch(() => ({}));

    const { transfer, error } = await findLiveTransfer(token);
    if (error) return error;

    // Open transfers need no unlock, so just return their links
    if (!transfer.isPasswordEnabled) {
      return NextResponse.json({
        success: true,
        files: buildPublicFiles(transfer, true),
      });
    }

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

    const response = NextResponse.json({
      success: true,
      files: buildPublicFiles(transfer, true),
    });

    // httpOnly and path-scoped so the proof never reaches scripts or other transfers
    response.cookies.set(TRANSFER_ACCESS_COOKIE, signTransferAccess(transfer._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: getTransferAccessCookiePath(token),
      maxAge: TRANSFER_ACCESS_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Unlock transfer error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}