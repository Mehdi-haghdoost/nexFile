import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import cloudinary from "@/lib/cloudinary";

const MAX_UPLOAD_ATTEMPTS = 3;
const RETRY_DELAY_MS = [500, 1500];
const MAX_FILE_BYTES = 100 * 1024 * 1024;

const isTransientNetworkError = (error) =>
  ["ECONNRESET", "ETIMEDOUT", "EPIPE"].includes(error?.code);

const uploadToCloudinaryOnce = (buffer, options) =>
  new Promise((resolve, reject) => {
    // Guards against a hung connection separately from Cloudinary's own errors
    const timeout = setTimeout(() => {
      reject(new Error("Upload timeout after 10 minutes"));
    }, 600000);

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      clearTimeout(timeout);
      if (error) reject(error);
      else resolve(result);
    });

    uploadStream.end(buffer);
  });

// A dropped connection is worth retrying; a real API rejection fails the same way every time
const uploadToCloudinaryWithRetry = async (buffer, options) => {
  let lastError;

  for (let attempt = 0; attempt < MAX_UPLOAD_ATTEMPTS; attempt += 1) {
    try {
      return await uploadToCloudinaryOnce(buffer, options);
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === MAX_UPLOAD_ATTEMPTS - 1;

      if (!isTransientNetworkError(error) || isLastAttempt) throw error;

      console.warn(`Transfer upload attempt ${attempt + 1} failed (${error.code}), retrying...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS[attempt] || 1500));
    }
  }

  throw lastError;
};

// Uploads one transfer attachment and returns its metadata
// Kept separate from /api/files/upload because a transfer file is not a File document
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    let resourceType = "raw";
    if (file.type?.startsWith("image/")) {
      resourceType = "image";
    } else if (file.type?.startsWith("video/")) {
      resourceType = "video";
    }

    const uploadResult = await uploadToCloudinaryWithRetry(buffer, {
      folder: `nexfile/transfers/${decoded.userId}`,
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`,
      timeout: 600000,
      chunk_size: 6000000,
    });

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded",
        file: {
          name: file.name,
          extension,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          url: uploadResult.secure_url,
          cloudinaryId: uploadResult.public_id,
          resourceType: uploadResult.resource_type,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Transfer upload error:", error);

    let errorMessage = "Failed to upload file";
    if (error.message?.includes("timeout") || error.message?.includes("Timeout")) {
      errorMessage = "Upload timeout. Please try a smaller file or check your connection.";
    } else if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
      errorMessage = "The connection was interrupted while uploading. A VPN or proxy tool is often the cause.";
    } else if (error.http_code === 499) {
      errorMessage = "Upload cancelled or timeout. Please try again.";
    }

    return NextResponse.json(
      { success: false, message: error.message || errorMessage },
      { status: 500 }
    );
  }
}