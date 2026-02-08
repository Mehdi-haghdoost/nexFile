import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import Folder from "@/models/Folder";
import File from "@/models/File";
import cloudinary from "@/lib/cloudinary";

/**
 * POST /api/folders/[id]/copy
 * Copy a folder with all its contents
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

    // ✅ Fix: await params properly
    const params = await context.params;
    const { id } = params;
    
    const body = await request.json();
    const { targetFolderId, newName } = body;

    console.log('📂 Copy folder request:', { id, targetFolderId, newName, userId: decoded.userId });

    // Find source folder
    const sourceFolder = await Folder.findOne({
      _id: id,
      owner: decoded.userId,
      isDeleted: false,
    });

    console.log('📂 Source folder:', sourceFolder?._id);

    if (!sourceFolder) {
      return NextResponse.json(
        { success: false, message: "Source folder not found" },
        { status: 404 }
      );
    }

    // Validate target folder if provided
    let targetParentId = sourceFolder.parentFolder; // ✅ Default: same location as original

    if (targetFolderId) {
      const targetFolder = await Folder.findOne({
        _id: targetFolderId,
        owner: decoded.userId,
        isDeleted: false,
      });

      if (!targetFolder) {
        return NextResponse.json(
          { success: false, message: "Target folder not found" },
          { status: 404 }
        );
      }

      // Prevent copying into itself or its children
      if (targetFolderId === id) {
        return NextResponse.json(
          { success: false, message: "Cannot copy folder into itself" },
          { status: 400 }
        );
      }

      targetParentId = targetFolderId;
    }

    // Copy folder recursively
    const copiedFolder = await copyFolderRecursive(
      sourceFolder,
      decoded.userId,
      targetParentId,
      newName || `Copy of ${sourceFolder.name}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Folder copied successfully",
        folder: {
          id: copiedFolder._id.toString(),
          name: copiedFolder.name,
          description: copiedFolder.description,
          color: copiedFolder.color,
          parentFolder: copiedFolder.parentFolder,
          filesCount: copiedFolder.filesCount,
          subFoldersCount: copiedFolder.subFoldersCount,
          totalSize: copiedFolder.totalSize,
          createdAt: copiedFolder.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Copy folder error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to copy folder",
      },
      { status: 500 }
    );
  }
}

/**
 * Recursively copy folder and all its contents
 */
async function copyFolderRecursive(
  sourceFolder,
  userId,
  parentFolderId,
  newName
) {
  console.log(`📂 Copying folder: ${sourceFolder.name} → ${newName}`);

  // Create new folder
  const newFolder = await Folder.create({
    name: newName,
    description: sourceFolder.description,
    owner: userId,
    parentFolder: parentFolderId,
    accessType: sourceFolder.accessType,
    color: sourceFolder.color,
    icon: sourceFolder.icon,
    tags: [...sourceFolder.tags],
  });

  console.log(`✅ Created folder: ${newFolder.name} (${newFolder._id})`);

  // Get all files in source folder
  const files = await File.find({
    folder: sourceFolder._id,
    owner: userId,
    isDeleted: false,
  });

  console.log(`📄 Found ${files.length} files to copy`);

  // Copy each file
  let totalSize = 0;
  for (const file of files) {
    try {
      const copiedFile = await copyFile(file, userId, newFolder._id);
      totalSize += copiedFile.size;
      console.log(`✅ Copied file: ${file.name}`);
    } catch (error) {
      console.error(`❌ Failed to copy file ${file.name}:`, error);
      // Continue with other files
    }
  }

  // Get all subfolders
  const subfolders = await Folder.find({
    parentFolder: sourceFolder._id,
    owner: userId,
    isDeleted: false,
  });

  console.log(`📁 Found ${subfolders.length} subfolders to copy`);

  // Copy each subfolder recursively
  let subFoldersCount = 0;
  for (const subfolder of subfolders) {
    try {
      const copiedSubfolder = await copyFolderRecursive(
        subfolder,
        userId,
        newFolder._id,
        subfolder.name // Keep original name for subfolders
      );
      subFoldersCount++;
      totalSize += copiedSubfolder.totalSize;
      console.log(`✅ Copied subfolder: ${subfolder.name}`);
    } catch (error) {
      console.error(`❌ Failed to copy subfolder ${subfolder.name}:`, error);
      // Continue with other subfolders
    }
  }

  // Update folder stats
  newFolder.filesCount = files.length;
  newFolder.subFoldersCount = subFoldersCount;
  newFolder.totalSize = totalSize;
  await newFolder.save();

  console.log(`✅ Updated stats for ${newFolder.name}: ${files.length} files, ${subFoldersCount} subfolders`);

  // Update parent folder stats if exists
  if (parentFolderId) {
    await Folder.findByIdAndUpdate(parentFolderId, {
      $inc: {
        subFoldersCount: 1,
        totalSize: totalSize,
      },
      lastActivity: new Date(),
    });
    console.log(`✅ Updated parent folder stats`);
  }

  return newFolder;
}

/**
 * Copy a single file (duplicate in Cloudinary)
 */
async function copyFile(sourceFile, userId, targetFolderId) {
  try {
    console.log(`📄 Copying file: ${sourceFile.name}`);

    // Download from Cloudinary
    const response = await fetch(sourceFile.secureUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file from Cloudinary: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine resource type
    let resourceType = 'raw';
    if (sourceFile.mimeType.startsWith('image/')) {
      resourceType = 'image';
    } else if (sourceFile.mimeType.startsWith('video/')) {
      resourceType = 'video';
    }

    // Upload to Cloudinary with new public_id
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `nexfile/${userId}/${targetFolderId}`,
          resource_type: resourceType,
          public_id: `${Date.now()}-copy-${sourceFile.originalName.replace(/\.[^/.]+$/, '')}`,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    // Create new file document
    const newFile = await File.create({
      name: sourceFile.name,
      originalName: sourceFile.originalName,
      mimeType: sourceFile.mimeType,
      size: sourceFile.size,
      extension: sourceFile.extension,
      owner: userId,
      folder: targetFolderId,
      cloudinaryId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      isPublic: sourceFile.isPublic,
      tags: [...sourceFile.tags],
      metadata: {
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        resourceType: uploadResult.resource_type,
      },
    });

    console.log(`✅ Created file document: ${newFile.name}`);

    return newFile;
  } catch (error) {
    console.error(`❌ Failed to copy file ${sourceFile.name}:`, error);
    throw error;
  }
}