import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { SHARE_ACTIONS, checkItemAccess } from "@/utils/sharing/sharingAccess";

// Characters a plain filename= value cannot carry; the full name travels in filename*
const UNSAFE_FILENAME_CHARS = /[^\x20-\x7e]|["\\]/g;

// An attachment header that keeps non-Latin names intact in every browser
const buildContentDisposition = (fileName) => {
  const fallback = fileName.replace(UNSAFE_FILENAME_CHARS, "_") || "download";
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
};

const jsonError = (message, status) =>
  NextResponse.json({ success: false, message }, { status });

// Streams a file the caller can view from storage as a download, so the browser saves it instead of opening it
export async function GET(request, { params }) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) return jsonError("Unauthorized", 401);

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) return jsonError("Invalid token", 401);

    const { id } = await params;

    const result = await checkItemAccess(id, "file", decoded.userId, SHARE_ACTIONS.VIEW, { lean: true });
    if (!result.ok) return jsonError(result.message, result.status);

    const file = result.access.item;

    // Paper documents live in the database and have nothing stored to download
    const sourceUrl = file.secureUrl || file.url;
    if (!sourceUrl) return jsonError("This file can't be downloaded", 400);

    let upstream;
    try {
      upstream = await fetch(sourceUrl);
    } catch (error) {
      console.error("Download fetch error:", error);
      return jsonError("Could not reach file storage. Please try again.", 503);
    }

    if (!upstream.ok || !upstream.body) {
      return jsonError("Failed to read the stored file", 502);
    }

    const headers = {
      "Content-Type": file.mimeType || upstream.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": buildContentDisposition(file.originalName || file.name || "download"),
      "Cache-Control": "private, no-store",
    };

    // Lets the browser show download progress; a compressed response is unpacked by fetch, so its length no longer applies
    const length = upstream.headers.get("content-length");
    if (length && !upstream.headers.get("content-encoding")) headers["Content-Length"] = length;

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (error) {
    console.error("Download file error:", error);
    return jsonError("Failed to download the file", 500);
  }
}