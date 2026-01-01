import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FolderService } from "@/utils/folders/folderService";
import { createFolderSchema } from "@/utils/folders/folderValidator";

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

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const validatedData = createFolderSchema.parse(body);

    const folder = await FolderService.createFolder(
      validatedData,
      decoded.userId
    );

    return NextResponse.json(
      {
        success: true,
        message: "Folder created successfully",
        folder: {
          id: folder._id,
          name: folder.name,
          description: folder.description,
          accessType: folder.accessType,
          parentFolder: folder.parentFolder,
          color: folder.color,
          icon: folder.icon,
          filesCount: folder.filesCount,
          subFoldersCount: folder.subFoldersCount,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Create folder error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create folder",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
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

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parentFolder = searchParams.get("parentFolder");
    const includeDeleted = searchParams.get("includeDeleted") === "true";

    const folders = await FolderService.getUserFolders(decoded.userId, {
      parentFolder: parentFolder || null,
      includeDeleted,
    });

    return NextResponse.json(
      {
        success: true,
        folders: folders.map((folder) => ({
          id: folder._id,
          name: folder.name,
          description: folder.description,
          accessType: folder.accessType,
          parentFolder: folder.parentFolder,
          color: folder.color,
          icon: folder.icon,
          filesCount: folder.filesCount,
          subFoldersCount: folder.subFoldersCount,
          totalSize: folder.totalSize,
          isStarred: folder.isStarred,
          isArchived: folder.isArchived,
          isDeleted: folder.isDeleted,
          deletedAt: folder.deletedAt,
          lastActivity: folder.lastActivity,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Get folders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get folders",
      },
      { status: 500 }
    );
  }
}