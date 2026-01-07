import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import Folder from "@/models/Folder";
import cloudinary from "@/lib/cloudinary";

/**
 * POST /api/files/upload
 * Upload file to Cloudinary and save metadata to MongoDB
 * 
 * Process:
 * 1. Verify authentication
 * 2. Get file from FormData
 * 3. Upload to Cloudinary
 * 4. Save metadata to MongoDB
 * 5. Update folder stats
 * 6. Return file info
 */
export async function POST(request) {
  try {
    await connectDB();

    // Verify authentication
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

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file");
    const folderId = formData.get("folder");

    // Validate file
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

    // 500MB limit
    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 500MB limit" },
        { status: 400 }
      );
    }

    // Validate folder if provided
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    // Determine resource type
    let resourceType = 'raw';
    if (file.type.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.type.startsWith('video/')) {
      resourceType = 'video';
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `nexfile/${decoded.userId}/${folderId || 'root'}`,
          resource_type: resourceType,
          public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    // Save metadata to MongoDB
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

    // Update folder stats
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
          cloudinaryId: fileDoc.cloudinaryId,
          folder: fileDoc.folder,
          createdAt: fileDoc.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to upload file",
      },
      { status: 500 }
    );
  }
}