import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import File from "@/models/File";
import { requireUser } from "@/utils/auth/requireUser";
import { TRANSFER_MAX_FILE_BYTES } from "@/utils/constants/transferConstants";

// Picks the Cloudinary namespace from the stored type, falling back to the mime type
const resolveResourceType = (file) => {
  if (file.metadata?.resourceType) return file.metadata.resourceType;
  if (file.mimeType?.startsWith("image/")) return "image";
  if (file.mimeType?.startsWith("video/")) return "video";
  return "raw";
};

// Copies a stored file into the caller's transfer folder without routing bytes through this server
export async function POST(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { fileId } = await request.json().catch(() => ({}));

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return NextResponse.json(
        { success: false, message: "A valid file id is required" },
        { status: 400 }
      );
    }

    const source = await File.findOne({ _id: fileId, owner: userId, isDeleted: false });

    if (!source?.secureUrl) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    if (source.size > TRANSFER_MAX_FILE_BYTES) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 100MB limit" },
        { status: 400 }
      );
    }

    const resourceType = resolveResourceType(source);

    // A separate copy keeps the transfer intact if the original is edited or deleted
    const result = await cloudinary.uploader.upload(source.secureUrl, {
      folder: `nexfile/transfers/${userId}`,
      resource_type: resourceType,
      public_id: `${Date.now()}-${source.name.replace(/\.[^/.]+$/, "")}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "File added",
        file: {
          name: source.name,
          extension: source.extension,
          mimeType: source.mimeType,
          size: source.size,
          url: result.secure_url,
          cloudinaryId: result.public_id,
          resourceType: result.resource_type,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Import transfer file error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add file" },
      { status: 500 }
    );
  }
}