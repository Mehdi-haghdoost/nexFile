import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";

/**
 * GET /api/files/[id]/content
 * Streams the raw PDF bytes for pdf.js.
 *
 * The browser cannot read the Cloudinary delivery URL directly: raw uploads
 * are served without CORS headers, and accounts with restricted PDF delivery
 * reject the request outright. Proxying also lets ownership be checked, which
 * a public secureUrl cannot do.
 */
export async function GET(request, { params }) {
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
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // A malformed id is a missing file from the caller's point of view.
    // Querying with it would surface a mongoose cast error to the browser.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    const file = await File.findOne({
      _id: id,
      isDeleted: false,
      $or: [{ owner: decoded.userId }, { "sharedWith.user": decoded.userId }],
    });

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    const isPdf =
      file.extension === "pdf" || file.mimeType === "application/pdf";

    if (!isPdf) {
      return NextResponse.json(
        { success: false, message: "This file is not a PDF" },
        { status: 400 }
      );
    }

    const sourceUrl = file.secureUrl || file.url;
    if (!sourceUrl) {
      return NextResponse.json(
        { success: false, message: "This file has no stored content" },
        { status: 404 }
      );
    }

    const upstream = await fetch(sourceUrl);

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { success: false, message: "Failed to read the stored file" },
        { status: 502 }
      );
    }

    // Header values must be ASCII, and file names here are often Persian.
    const encodedName = encodeURIComponent(file.originalName || file.name);

    // The body is piped through rather than buffered, so large files do not
    // sit in server memory.
    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename*=UTF-8''${encodedName}`,
        "X-File-Name": encodedName,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Read file content error:", error);

    // Internal messages carry model and field names, so they stay in the log.
    return NextResponse.json(
      { success: false, message: "Failed to read file content" },
      { status: 500 }
    );
  }
}