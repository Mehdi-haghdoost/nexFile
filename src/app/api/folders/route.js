import { NextResponse } from "next/server";
import Folder from "@/models/Folder";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FolderService } from "@/utils/folders/folderService";
import { createFolderSchema } from "@/utils/folders/folderValidator";
import { OWNER_ROLE, getItemAccess, inheritRole } from "@/utils/sharing/sharingAccess";

// The subfolders of a folder shared with the caller, each with the role it gives them
const getSharedSubfolders = async (access, userId) => {
  const folders = await Folder.find({
    owner: access.item.owner,
    parentFolder: access.item._id,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  return folders.map((folder) => ({ folder, role: inheritRole(access.role, folder, userId) }));
};

// The fields every folder list receives
const toFolderRow = ({ folder, role }) => {
  const isOwner = role === OWNER_ROLE;

  return {
    id: folder._id.toString(),
    name: folder.name,
    description: folder.description,
    accessType: folder.accessType,
    // Stringified so a card can compare it against a route id without coercing
    parentFolder: folder.parentFolder ? folder.parentFolder.toString() : null,
    color: folder.color,
    icon: folder.icon,
    filesCount: folder.filesCount,
    subFoldersCount: folder.subFoldersCount,
    totalSize: folder.totalSize,
    // Starring is the owner's own marker
    isStarred: isOwner ? folder.isStarred : false,
    isArchived: folder.isArchived,
    isDeleted: folder.isDeleted,
    deletedAt: folder.deletedAt,
    lastActivity: folder.lastActivity,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
    role,
  };
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
          errors: error.issues || error.errors,
        },
        { status: 400 }
      );
    }

    // A missing, foreign or trashed parent is a client error, not a server failure
    if (error.message === "Parent folder not found") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 404 }
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
    const includeAll = searchParams.get("includeAll") === "true";

    // A folder someone else owns lists its subfolders when it is shared with the caller
    if (parentFolder && !includeAll) {
      const access = await getItemAccess(parentFolder, "folder", decoded.userId);

      if (access && !access.isOwner) {
        const rows = await getSharedSubfolders(access, decoded.userId);

        return NextResponse.json(
          { success: true, folders: rows.map(toFolderRow) },
          { status: 200 }
        );
      }
    }

    const folders = includeAll
      ? await Folder.find({
        owner: decoded.userId,
        ...(includeDeleted ? {} : { isDeleted: false }),
      }).sort({ createdAt: -1 })
      : await FolderService.getUserFolders(decoded.userId, {
        parentFolder: parentFolder || null,
        includeDeleted,
      });

    return NextResponse.json(
      {
        success: true,
        folders: folders.map((folder) => toFolderRow({ folder, role: OWNER_ROLE })),
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