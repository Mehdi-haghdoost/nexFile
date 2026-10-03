import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import Folder from "@/models/Folder";
import cloudinary from "@/lib/cloudinary";

const MAX_UPLOAD_ATTEMPTS = 3;
const RETRY_DELAY_MS = [500, 1500];
const MAX_FILE_BYTES = 100 * 1024 * 1024;

// Cloudinary rejects these outright; letters of any script, spaces and
// brackets are accepted, so only the genuinely invalid ones are replaced
const sanitizePublicId = (name) =>
  name
    .replace(/\.[^/.]+$/, "")
    .replace(/[?&#\\%<>+]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/-{2,}/g, "-")
    .trim()
    .slice(0, 120) || "file";

// Gateway failures and dropped sockets are both worth retrying; a rejected
// request (bad params, auth, quota) fails identically every time
const isTransientNetworkError = (error) =>
  ["ECONNRESET", "ETIMEDOUT", "EPIPE"].includes(error?.code) ||
  [499, 500, 502, 503, 504].includes(error?.http_code);

const uploadToCloudinaryOnce = (buffer, options) =>
  new Promise((resolve, reject) => {
    // The stream can settle through its callback or its error event, and a
    // second settle after the first is ignored rather than left unhandled
    let isSettled = false;

    const settle = (fn, value) => {
      if (isSettled) return;
      isSettled = true;
      clearTimeout(timeout);
      fn(value);
    };

    // Guards against a hung connection separately from Cloudinary's own retry-worthy errors below.
    const timeout = setTimeout(() => {
      settle(reject, new Error("Upload timeout after 10 minutes"));
    }, 600000);

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) settle(reject, error);
      else settle(resolve, result);
    });

    // Without this listener a stream error escapes the promise entirely
    uploadStream.on("error", (error) => settle(reject, error));

    uploadStream.end(buffer);
  });

// A dropped connection is worth retrying; a real API rejection (bad params, auth, quota) fails identically every time.
const uploadToCloudinaryWithRetry = async (buffer, options) => {
  let lastError;

  for (let attempt = 0; attempt < MAX_UPLOAD_ATTEMPTS; attempt += 1) {
    try {
      return await uploadToCloudinaryOnce(buffer, options);
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === MAX_UPLOAD_ATTEMPTS - 1;

      if (!isTransientNetworkError(error) || isLastAttempt) throw error;

      console.warn(`Cloudinary upload attempt ${attempt + 1} failed (${error.code}), retrying...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS[attempt] || 1500));
    }
  }

  throw lastError;
};

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

    const formData = await request.formData();
    const file = formData.get("file");
    const folderId = formData.get("folder");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, message: "Cannot upload empty file" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 100MB limit" },
        { status: 400 }
      );
    }

    if (folderId) {
      const folder = await Folder.findOne({
        _id: folderId,
        owner: decoded.userId,
        isDeleted: false,
      });

      if (!folder) {
        return NextResponse.json(
          { success: false, message: "Folder not found" },
          { status: 404 }
        );
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    let resourceType = 'raw';
    if (file.type?.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.type?.startsWith('video/')) {
      resourceType = 'video';
    }

    const uploadResult = await uploadToCloudinaryWithRetry(buffer, {
      folder: `nexfile/${decoded.userId}/${folderId || 'root'}`,
      resource_type: resourceType,
      public_id: `${Date.now()}-${sanitizePublicId(file.name)}`,
      timeout: 600000,
      chunk_size: 6000000,
    });

    const fileDoc = await File.create({
      name: file.name,
      originalName: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      extension,
      owner: decoded.userId,
      folder: folderId || null,
      cloudinaryId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      metadata: {
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        resourceType: uploadResult.resource_type,
      },
    });

    if (folderId) {
      await Folder.findByIdAndUpdate(folderId, {
        $inc: {
          filesCount: 1,
          totalSize: file.size,
        },
        lastActivity: new Date(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        file: {
          id: fileDoc._id.toString(),
          name: fileDoc.name,
          originalName: fileDoc.originalName,
          size: fileDoc.size,
          mimeType: fileDoc.mimeType,
          extension: fileDoc.extension,
          url: fileDoc.secureUrl,
          secureUrl: fileDoc.secureUrl,
          cloudinaryId: fileDoc.cloudinaryId,
          folder: fileDoc.folder ? fileDoc.folder.toString() : null,
          isDeleted: fileDoc.isDeleted,
          createdAt: fileDoc.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    let errorMessage = "Failed to upload file";

    if (error.message?.toLowerCase().includes('timeout')) {
      errorMessage = "Upload timeout. Please try with a smaller file or check your connection.";
    } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      // Network-path level failure, not a Cloudinary rejection -- worth telling the person it isn't the file.
      errorMessage = "The connection was interrupted while uploading. This is often caused by a VPN or proxy tool on your machine.";
    } else if (error.http_code === 499) {
      errorMessage = "Upload cancelled or timeout. Please try again.";
    } else if (error.http_code === 400) {
      // Cloudinary's own wording names internal ids, so it is not passed on
      errorMessage = "Cloudinary rejected this file. Try renaming it and uploading again.";
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}