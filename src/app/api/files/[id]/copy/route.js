import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import Folder from "@/models/Folder";
import cloudinary from "@/lib/cloudinary";

/**
 * POST /api/files/[id]/copy
 * Copy a file to same or different folder
 */
export async function POST(request, context) {
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

    const params = await context.params;
    const { id } = params;
    
    const body = await request.json();
    const { targetFolderId, newName } = body;

    console.log('📄 Copy file request:', { id, targetFolderId, newName, userId: decoded.userId });

    // Find source file
    const sourceFile = await File.findOne({
      _id: id,
      owner: decoded.userId,
      isDeleted: false,
    });

    if (!sourceFile) {
      return NextResponse.json(
        { success: false, message: "Source file not found" },
        { status: 404 }
      );
    }

    // Validate target folder if provided
    let targetFolder = sourceFile.folder; // Default: same folder

    if (targetFolderId && targetFolderId !== sourceFile.folder?.toString()) {
      const folder = await Folder.findOne({
        _id: targetFolderId,
        owner: decoded.userId,
        isDeleted: false,
      });

      if (!folder) {
        return NextResponse.json(
          { success: false, message: "Target folder not found" },
          { status: 404 }
        );
      }

      targetFolder = targetFolderId;
    }

    // Check file type and copy accordingly
    let copiedFile;

    if (sourceFile.mimeType === 'application/vnd.nexfile.document') {
      // nexFile Document - just duplicate metadata
      copiedFile = await copyNexFileDocument(sourceFile, decoded.userId, targetFolder, newName);
    } else if (sourceFile.cloudinaryId) {
      // ✅ Use Cloudinary's built-in copy (no download needed!)
      copiedFile = await copyViaCloudinaryAPI(sourceFile, decoded.userId, targetFolder, newName);
    } else {
      throw new Error('File has no valid cloudinaryId');
    }

    return NextResponse.json(
      {
        success: true,
        message: "File copied successfully",
        file: {
          id: copiedFile._id.toString(),
          name: copiedFile.name,
          originalName: copiedFile.originalName,
          size: copiedFile.size,
          mimeType: copiedFile.mimeType,
          extension: copiedFile.extension,
          folder: copiedFile.folder,
          url: copiedFile.secureUrl || copiedFile.url,
          createdAt: copiedFile.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Copy file error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to copy file",
      },
      { status: 500 }
    );
  }
}

/**
 * Copy nexFile Document (metadata only)
 */
async function copyNexFileDocument(sourceFile, userId, targetFolderId, newName) {
  try {
    console.log(`📄 Copying nexFile Document: ${sourceFile.name} → ${newName}`);

    // Generate new cloudinaryId
    const timestamp = Date.now();
    const newCloudinaryId = `nexfile-document-${timestamp}`;

    // Create new document with same structure
    const newFile = await File.create({
      name: newName,
      originalName: newName,
      mimeType: sourceFile.mimeType,
      size: sourceFile.size,
      extension: sourceFile.extension,
      owner: userId,
      folder: targetFolderId || null,
      cloudinaryId: newCloudinaryId,
      url: `/documents/${userId}/${targetFolderId || 'root'}/${timestamp}`,
      secureUrl: `/documents/${userId}/${targetFolderId || 'root'}/${timestamp}`,
      isPublic: sourceFile.isPublic,
      tags: [...sourceFile.tags],
      metadata: { ...sourceFile.metadata },
    });

    console.log(`✅ nexFile Document copied: ${newFile.name}`);

    // Update folder stats
    if (targetFolderId) {
      await Folder.findByIdAndUpdate(targetFolderId, {
        $inc: {
          filesCount: 1,
          totalSize: sourceFile.size,
        },
        lastActivity: new Date(),
      });
    }

    return newFile;
  } catch (error) {
    console.error(`❌ Failed to copy nexFile Document:`, error);
    throw error;
  }
}

/**
 * ✅ Copy using Cloudinary API (no download needed!)
 */
async function copyViaCloudinaryAPI(sourceFile, userId, targetFolderId, newName) {
  try {
    console.log(`📄 Copying via Cloudinary API: ${sourceFile.name} → ${newName}`);
    console.log(`📦 Source cloudinaryId: ${sourceFile.cloudinaryId}`);

    // Determine resource type
    let resourceType = 'raw';
    if (sourceFile.mimeType.startsWith('image/')) {
      resourceType = 'image';
    } else if (sourceFile.mimeType.startsWith('video/')) {
      resourceType = 'video';
    }

    // Generate new public_id
    const timestamp = Date.now();
    const newPublicId = `nexfile/${userId}/${targetFolderId || 'root'}/${timestamp}-copy-${newName.replace(/\.[^/.]+$/, '')}`;

    console.log(`📦 New publicId: ${newPublicId}`);

    // ✅ Use Cloudinary's rename/copy function
    const result = await cloudinary.uploader.rename(
      sourceFile.cloudinaryId,
      newPublicId,
      {
        resource_type: resourceType,
        to_type: 'upload',
        invalidate: true,
      }
    );

    console.log(`✅ Cloudinary copy result:`, result);

    // Create new file document
    const newFile = await File.create({
      name: newName,
      originalName: newName,
      mimeType: sourceFile.mimeType,
      size: sourceFile.size,
      extension: sourceFile.extension,
      owner: userId,
      folder: targetFolderId || null,
      cloudinaryId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      isPublic: sourceFile.isPublic,
      tags: [...sourceFile.tags],
      metadata: {
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type,
      },
    });

    console.log(`✅ File copied successfully: ${newFile.name}`);

    // Update folder stats
    if (targetFolderId) {
      await Folder.findByIdAndUpdate(targetFolderId, {
        $inc: {
          filesCount: 1,
          totalSize: sourceFile.size,
        },
        lastActivity: new Date(),
      });
    }

    return newFile;
  } catch (error) {
    console.error(`❌ Cloudinary API copy failed:`, error);
    
    // ✅ Fallback: Try explicit upload
    console.log('⚠️ Falling back to explicit upload method...');
    return await copyViaExplicitUpload(sourceFile, userId, targetFolderId, newName);
  }
}

/**
 * ✅ Fallback: Use Cloudinary's explicit upload
 */
async function copyViaExplicitUpload(sourceFile, userId, targetFolderId, newName) {
  try {
    console.log(`📄 Copying via explicit upload: ${sourceFile.name}`);

    // Determine resource type
    let resourceType = 'raw';
    if (sourceFile.mimeType.startsWith('image/')) {
      resourceType = 'image';
    } else if (sourceFile.mimeType.startsWith('video/')) {
      resourceType = 'video';
    }

    // Generate new public_id
    const timestamp = Date.now();
    const safeFileName = newName.replace(/[\/\\]/g, '-').replace(/\.[^/.]+$/, '');
    const newPublicId = `nexfile/${userId}/${targetFolderId || 'root'}/${timestamp}-${safeFileName}`;

    // ✅ Use explicit upload (Cloudinary handles the copying internally)
    const result = await cloudinary.uploader.explicit(
      sourceFile.cloudinaryId,
      {
        type: 'upload',
        resource_type: resourceType,
        public_id: newPublicId,
      }
    );

    console.log(`✅ Explicit upload result:`, result);

    // Create new file document
    const newFile = await File.create({
      name: newName,
      originalName: newName,
      mimeType: sourceFile.mimeType,
      size: sourceFile.size,
      extension: sourceFile.extension,
      owner: userId,
      folder: targetFolderId || null,
      cloudinaryId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      isPublic: sourceFile.isPublic,
      tags: [...sourceFile.tags],
      metadata: {
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type,
      },
    });

    console.log(`✅ File copied via explicit upload: ${newFile.name}`);

    // Update folder stats
    if (targetFolderId) {
      await Folder.findByIdAndUpdate(targetFolderId, {
        $inc: {
          filesCount: 1,
          totalSize: sourceFile.size,
        },
        lastActivity: new Date(),
      });
    }

    return newFile;
  } catch (error) {
    console.error(`❌ Explicit upload failed:`, error);
    throw new Error(`Failed to copy file: ${error.message}`);
  }
}