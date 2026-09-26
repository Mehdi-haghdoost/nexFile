import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Transfer from "@/models/Transfer";
import { verifyTransferAccess } from "@/utils/transfers/transferAccess";
import { buildSignedDownloadUrl } from "@/utils/transfers/transferDownloadUrl";
import { notifyFirstDownload } from "@/utils/transfers/transferNotifications";
import {
  TRANSFER_ACCESS_COOKIE,
  TRANSFER_DOWNLOAD_ISSUES,
  TRANSFER_DOWNLOAD_ISSUE_PARAM,
  TRANSFER_LINK_PATH,
} from "@/utils/constants/transferConstants";

// Sends the recipient back to the public page, which explains the reason it carries
const backToTransferPage = (request, token, issue) => {
  const url = new URL(`${TRANSFER_LINK_PATH}/${token}`, request.url);
  url.searchParams.set(TRANSFER_DOWNLOAD_ISSUE_PARAM, issue);

  return NextResponse.redirect(url);
};

// Checks access, counts the download and redirects to a short-lived signed URL
export async function GET(request, { params }) {
  const { token, index } = await params;

  try {
    await connectDB();

    const transfer = await Transfer.findOne({ token, isDeleted: false });

    if (!transfer || transfer.expirationDate <= new Date()) {
      return backToTransferPage(request, token, TRANSFER_DOWNLOAD_ISSUES.EXPIRED);
    }

    const fileIndex = Number(index);
    const file = Number.isInteger(fileIndex) ? transfer.files[fileIndex] : null;

    if (!file?.cloudinaryId && !file?.url) {
      return backToTransferPage(request, token, TRANSFER_DOWNLOAD_ISSUES.UNAVAILABLE);
    }

    // The access cookie outlives neither its own hour nor a password change
    if (transfer.isPasswordEnabled) {
      const accessToken = request.cookies.get(TRANSFER_ACCESS_COOKIE)?.value;

      if (!verifyTransferAccess(accessToken, transfer._id)) {
        return backToTransferPage(request, token, TRANSFER_DOWNLOAD_ISSUES.LOCKED);
      }
    }

    // Counted here because every public download link passes through this route
    await Transfer.updateOne({ _id: transfer._id }, { $inc: { downloadCount: 1 } });

    // Not awaited: a mail failure must never stop the download
    notifyFirstDownload(transfer).catch((error) =>
      console.error("First download notification failed:", error.message)
    );

    // Signed per request and valid for minutes, so a copied URL stops working
    return NextResponse.redirect(buildSignedDownloadUrl(file), 302);
  } catch (error) {
    console.error("Transfer download error:", error);
    return backToTransferPage(request, token, TRANSFER_DOWNLOAD_ISSUES.UNAVAILABLE);
  }
}