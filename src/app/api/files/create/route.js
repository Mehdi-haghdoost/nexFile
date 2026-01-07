import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import Folder from "@/models/Folder";

/**
 * POST /api/files/create
 * Create a new empty file (document) in a folder
 */
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

    const body = await request.json();
    const { folderId, name = "Untitled Document", type = "document" } = body;

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

    // Create empty file document
    // This is different from upload - it's creating a new document to be edited
    const fileDoc = await File.create({
      name: name,
      originalName: name,
      mimeType: 'application/vnd.nexfile.document',
      size: 0,
      extension: 'paper',
      owner: decoded.userId,
      folder: folderId || null,
      cloudinaryId: `nexfile-document-${Date.now()}`,
      url: `/documents/${decoded.userId}/${folderId || 'root'}/${Date.now()}`,
      secureUrl: `/documents/${decoded.userId}/${folderId || 'root'}/${Date.now()}`,
      metadata: {
        format: 'paper',
        resourceType: 'document',
      },
    });

    // Update folder stats
    if (folderId) {
      await Folder.findByIdAndUpdate(folderId, {
        $inc: {
          filesCount: 1,
        },
        lastActivity: new Date(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "File created successfully",
        file: {
          id: fileDoc._id.toString(),
          name: fileDoc.name,
          size: fileDoc.size,
          mimeType: fileDoc.mimeType,
          extension: fileDoc.extension,
          url: fileDoc.secureUrl,
          folder: fileDoc.folder,
          createdAt: fileDoc.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create file error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create file",
      },
      { status: 500 }
    );
  }
}