import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Transfer from "@/models/Transfer";
import { verifyTransferAccess } from "@/utils/transfers/transferAccess";
import {
  TRANSFER_ACCESS_COOKIE,
  TRANSFER_LINK_PATH,
} from "@/utils/constants/transferConstants";

// Every failure sends the recipient back to the public page, which explains the state
const backToTransferPage = (request, token) =>
  NextResponse.redirect(new URL(`${TRANSFER_LINK_PATH}/${token}`, request.url));

// Checks access, counts the download and redirects to the stored file
export async function GET(request, { params }) {
  const { token, index } = await params;

  try {
    await connectDB();

    const transfer = await Transfer.findOne({ token, isDeleted: false });

    if (!transfer || transfer.expirationDate <= new Date()) {
      return backToTransferPage(request, token);
    }

    const fileIndex = Number(index);
    const file = Number.isInteger(fileIndex) ? transfer.files[fileIndex] : null;

    if (!file?.url) {
      return backToTransferPage(request, token);
    }

    if (transfer.isPasswordEnabled) {
      const accessToken = request.cookies.get(TRANSFER_ACCESS_COOKIE)?.value;

      if (!verifyTransferAccess(accessToken, transfer._id)) {
        return backToTransferPage(request, token);
      }
    }

    // Counted here because every download link on the public page passes through this route
    await Transfer.updateOne({ _id: transfer._id }, { $inc: { downloadCount: 1 } });

    return NextResponse.redirect(file.url, 302);
  } catch (error) {
    console.error("Transfer download error:", error);
    return backToTransferPage(request, token);
  }
}