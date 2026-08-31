import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import Folder from "@/models/Folder";
import cloudinary from "@/lib/cloudinary";

const MAX_UPLOAD_ATTEMPTS = 3;
const RETRY_DELAY_MS = [500, 1500];

const isTransientNetworkError = (error) =>
  ["ECONNRESET", "ETIMEDOUT", "EPIPE"].includes(error?.code);

const uploadToCloudinaryOnce = (buffer, options) =>
  new Promise((resolve, reject) => {
    // Guards against a hung connection separately from Cloudinary's own retry-worthy errors below.
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
    if (!decoded || !decoded.userId) {
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

    // 100MB limit for free Cloudinary
    if (file.size > 100 * 1024 * 1024) {
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
    if (file.type.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.type.startsWith('video/')) {
      resourceType = 'video';
    }

    const uploadResult = await uploadToCloudinaryWithRetry(buffer, {
      folder: `nexfile/${decoded.userId}/${folderId || 'root'}`,
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`,
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
          folder: fileDoc.folder,
          isDeleted: fileDoc.isDeleted,
          createdAt: fileDoc.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    let errorMessage = "Failed to upload file";
    if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
      errorMessage = "Upload timeout. Please try with a smaller file or check your connection.";
    } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      // Network-path level failure, not a Cloudinary rejection -- worth telling the person it isn't the file.
      errorMessage = "The connection was interrupted while uploading. This is often caused by a VPN/proxy tool on your machine — check that first.";
    } else if (error.http_code === 499) {
      errorMessage = "Upload cancelled or timeout. Please try again.";
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || errorMessage,
      },
      { status: 500 }
    );
  }
}