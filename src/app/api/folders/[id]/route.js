import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FolderService } from "@/utils/folders/folderService";
import { updateFolderSchema } from "@/utils/folders/folderValidator";
import {
  SHARE_ACTIONS,
  canPerform,
  getAccessibleFolderPath,
  getItemAccess,
} from "@/utils/sharing/sharingAccess";

// The only field someone the folder is shared with may change
const RECIPIENT_EDITABLE_FIELDS = ["name"];

// A malformed id cannot match any folder, so it is answered like a missing one
const notFound = () =>
  NextResponse.json(
    { success: false, message: "Folder not found" },
    { status: 404 }
  );

// Someone who can open the folder but whose role does not allow the action
const forbidden = () =>
  NextResponse.json(
    { success: false, message: "You don't have permission to do that" },
    { status: 403 }
  );

// Resolves the caller and a valid id, or the response explaining why not
const requireCaller = async (request, context) => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return {
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const decoded = verifyAccessToken(token);

  if (!decoded?.userId) {
    return {
      response: NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      ),
    };
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return { response: notFound() };

  return { userId: decoded.userId, id };
};

// Returns one folder, the caller's role on it and the path the breadcrumb shows
export async function GET(request, context) {
  try {
    await connectDB();

    const { userId, id, response } = await requireCaller(request, context);
    if (response) return response;

    // Owners and anyone the folder or a folder above it is shared with
    const access = await getItemAccess(id, "folder", userId);
    if (!access) return notFound();

    const { item: folder, role, isOwner } = access;

    // The owner sees the whole path; a recipient only the part that was shared with them
    const path = isOwner
      ? await FolderService.getFolderPath(id)
      : await getAccessibleFolderPath(folder, userId);

    return NextResponse.json({
      success: true,
      folder: {
        id: folder._id.toString(),
        name: folder.name,
        description: folder.description,
        parentFolder: folder.parentFolder ? folder.parentFolder.toString() : null,
        color: folder.color,
        icon: folder.icon,
        accessType: folder.accessType,
        filesCount: folder.filesCount,
        subFoldersCount: folder.subFoldersCount,
        totalSize: folder.totalSize,
        // Starring is the owner's own marker
        isStarred: isOwner ? folder.isStarred : false,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
        role,
        isOwner,
      },
      path: path.map((entry) => ({
        id: entry.id.toString(),
        name: entry.name,
      })),
    });
  } catch (error) {
    console.error("Get folder error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Renames a folder, or changes any other field the update schema allows; recipients with edit access may only rename
export async function PATCH(request, context) {
  try {
    await connectDB();

    const { userId, id, response } = await requireCaller(request, context);
    if (response) return response;

    const body = await request.json().catch(() => ({}));

    let updateData;
    try {
      updateData = updateFolderSchema.parse(body);
    } catch (validationError) {
      const issues = validationError.issues || validationError.errors || [];

      return NextResponse.json(
        {
          success: false,
          message: issues[0]?.message || "Invalid folder details",
        },
        { status: 400 }
      );
    }

    // The owner's update matches only their own folder
    let folder = await FolderService.updateFolder(id, userId, updateData);

    if (!folder) {
      const access = await getItemAccess(id, "folder", userId, { lean: true });
      if (!access) return notFound();

      const touchesOtherFields = Object.keys(updateData).some(
        (field) => !RECIPIENT_EDITABLE_FIELDS.includes(field)
      );

      if (!canPerform(access.role, SHARE_ACTIONS.EDIT) || touchesOtherFields || !updateData.name) {
        return forbidden();
      }

      // Written under the owner's id, since the folder stays theirs
      folder = await FolderService.updateFolder(id, access.item.owner, { name: updateData.name });
      if (!folder) return notFound();
    }

    return NextResponse.json({
      success: true,
      message: "Folder updated",
      folder: {
        id: folder._id.toString(),
        name: folder.name,
        parentFolder: folder.parentFolder ? folder.parentFolder.toString() : null,
        filesCount: folder.filesCount,
        subFoldersCount: folder.subFoldersCount,
        totalSize: folder.totalSize,
        updatedAt: folder.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update folder error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Soft delete by default; ?permanent=true also destroys the subtree and its assets
export async function DELETE(request, context) {
  let caller = {};

  try {
    await connectDB();

    caller = await requireCaller(request, context);
    if (caller.response) return caller.response;

    const { userId, id } = caller;

    const { searchParams } = new URL(request.url);
    const isPermanent = searchParams.get("permanent") === "true";

    const folder = isPermanent
      ? await FolderService.permanentDeleteFolder(id, userId)
      : await FolderService.softDeleteFolder(id, userId);

    return NextResponse.json({
      success: true,
      message: isPermanent ? "Folder permanently deleted" : "Folder moved to trash",
      folder: { id, permanent: isPermanent },
    });
  } catch (error) {
    // The service throws for a folder the caller does not own, which is not a server fault
    if (error.message?.includes("not found")) {
      try {
        // Someone the folder is shared with is told they may not delete it, not that it is missing
        const access = await getItemAccess(caller.id, "folder", caller.userId, { lean: true });
        return access ? forbidden() : notFound();
      } catch {
        return notFound();
      }
    }

    console.error("Delete folder error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}