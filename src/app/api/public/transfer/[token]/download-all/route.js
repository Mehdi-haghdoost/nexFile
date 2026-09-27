import archiver from "archiver";
import { Readable } from "stream";
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
  TRANSFER_ZIP_COMPRESSION_LEVEL,
} from "@/utils/constants/transferConstants";

// Streaming an archive rules out any static optimisation of this route
export const dynamic = "force-dynamic";

// Sends the recipient back to the public page, which explains the reason it carries
const backToTransferPage = (request, token, issue) => {
  const url = new URL(`${TRANSFER_LINK_PATH}/${token}`, request.url);
  url.searchParams.set(TRANSFER_DOWNLOAD_ISSUE_PARAM, issue);

  return NextResponse.redirect(url, { headers: { "Cache-Control": "no-store" } });
};

// Keeps two files of the same name from colliding inside the archive
const uniqueName = (name, taken) => {
  if (!taken.has(name)) {
    taken.add(name);
    return name;
  }

  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const extension = dot > 0 ? name.slice(dot) : "";

  let counter = 2;
  let candidate = `${base} (${counter})${extension}`;

  while (taken.has(candidate)) {
    counter += 1;
    candidate = `${base} (${counter})${extension}`;
  }

  taken.add(candidate);
  return candidate;
};

// Names the archive twice, since only the encoded form survives non-ASCII titles
const buildContentDisposition = (groupName) => {
  const safe = groupName.replace(/[\\/:*?"<>|]/g, "_").slice(0, 100) || "transfer";
  const ascii = safe.replace(/[^\x20-\x7E]/g, "_");

  return `attachment; filename="${ascii}.zip"; filename*=UTF-8''${encodeURIComponent(safe)}.zip`;
};

// Streams every file in a transfer as one archive
export async function GET(request, { params }) {
  const { token } = await params;

  try {
    await connectDB();

    const transfer = await Transfer.findOne({ token, isDeleted: false });

    if (!transfer || transfer.expirationDate <= new Date()) {
      return backToTransferPage(request, token, TRANSFER_DOWNLOAD_ISSUES.EXPIRED);
    }

    const stored = transfer.files.filter((file) => file.cloudinaryId || file.url);

    if (!stored.length) {
      return backToTransferPage(request, token, TRANSFER_DOWNLOAD_ISSUES.UNAVAILABLE);
    }

    if (transfer.isPasswordEnabled) {
      const accessToken = request.cookies.get(TRANSFER_ACCESS_COOKIE)?.value;

      if (!verifyTransferAccess(accessToken, transfer._id)) {
        return backToTransferPage(request, token, TRANSFER_DOWNLOAD_ISSUES.LOCKED);
      }
    }

    // Counted per file so the figure means the same thing however it was downloaded
    await Transfer.updateOne(
      { _id: transfer._id },
      { $inc: { downloadCount: stored.length } }
    );

    notifyFirstDownload(transfer).catch((error) =>
      console.error("First download notification failed:", error.message)
    );

    const archive = archiver("zip", { zlib: { level: TRANSFER_ZIP_COMPRESSION_LEVEL } });

    archive.on("error", (error) => {
      console.error("Archive error:", error.message);
      archive.destroy(error);
    });

    // Not awaited: the response has to start streaming before these finish
    (async () => {
      const taken = new Set();

      try {
        for (const file of stored) {
          const response = await fetch(buildSignedDownloadUrl(file));

          if (!response.ok || !response.body) {
            console.error(`Archive skipped ${file.name}: ${response.status}`);
            continue;
          }

          archive.append(Readable.fromWeb(response.body), { name: uniqueName(file.name, taken) });
        }

        await archive.finalize();
      } catch (error) {
        console.error("Archive build failed:", error.message);
        archive.destroy(error);
      }
    })();

    return new Response(Readable.toWeb(archive), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": buildContentDisposition(transfer.groupName),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Transfer archive error:", error);
    return backToTransferPage(request, token, TRANSFER_DOWNLOAD_ISSUES.UNAVAILABLE);
  }
}