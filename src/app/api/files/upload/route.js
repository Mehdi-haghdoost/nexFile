import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import Folder from "@/models/Folder";
import {
  describeUploadError,
  resolveResourceType,
  sanitizePublicId,
  uploadBuffer,
} from "@/utils/files/cloudinaryUpload";

const MAX_FILE_BYTES = 100 * 1024 * 1024;

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    const uploadResult = await uploadBuffer(buffer, {
      folder: `nexfile/${decoded.userId}/${folderId || "root"}`,
      resource_type: resolveResourceType(file.type),
      public_id: `${Date.now()}-${sanitizePublicId(file.name)}`,
    });

    const fileDoc = await File.create({
      name: file.name,
      originalName: file.name,
      mimeType: file.type || "application/octet-stream",
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
        $inc: { filesCount: 1, totalSize: file.size },
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

    return NextResponse.json(
      { success: false, message: describeUploadError(error) },
      { status: 500 }
    );
  }
}