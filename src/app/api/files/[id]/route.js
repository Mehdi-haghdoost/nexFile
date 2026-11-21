import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import User from "@/models/User";
import { FileService } from "@/utils/files/fileService";
import { SHARE_ACTIONS, canPerform, checkItemAccess, getItemAccess } from "@/utils/sharing/sharingAccess";

// The only fields someone the file is shared with may change
const RECIPIENT_EDITABLE_FIELDS = ["originalName", "name"];

const forbidden = () =>
  NextResponse.json(
    { success: false, message: "You don't have permission to do that" },
    { status: 403 }
  );

// The signed-in caller's id, or null when the session cookie is missing or invalid
const readCallerId = (request) => {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  return verifyAccessToken(token)?.userId || null;
};

// Details of one file for its page, including who owns it and the caller's role
export async function GET(request, { params }) {
  try {
    await connectDB();

    const userId = readCallerId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const result = await checkItemAccess(id, "file", userId, SHARE_ACTIONS.VIEW, { lean: true });
    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status }
      );
    }

    const { item: file, role, isOwner } = result.access;
    const owner = await User.findById(file.owner).select("name email").lean();

    return NextResponse.json(
      {
        success: true,
        file: {
          id: file._id.toString(),
          name: file.name,
          originalName: file.originalName,
          mimeType: file.mimeType,
          extension: file.extension,
          size: file.size,
          // A recipient has no use for the id of the owner's folder
          folder: isOwner && file.folder ? file.folder.toString() : null,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
          owner: {
            name: owner?.name || "Unknown",
            email: owner?.email || null,
          },
          role,
          isOwner,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get file error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load the file" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/files/[id]
 * Update file (rename, move, pin, etc.)
 */
export async function PATCH(request, { params }) {
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

    const { id } = await params; // ✅ Next.js 15
    const body = await request.json();

    // Find file and verify ownership
    let file = await File.findOne({
      _id: id,
      owner: decoded.userId,
      isDeleted: false,
    });

    // Someone the file is shared with is found through their access instead
    const access = file ? null : await getItemAccess(id, "file", decoded.userId);

    if (!file && !access) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    // Update allowed fields
    const allowedUpdates = ['originalName', 'name', 'folder', 'isPinned'];
    const updates = {};

    Object.keys(body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = body[key];
      }
    });

    // If no valid updates
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update" },
        { status: 400 }
      );
    }

    // A recipient with edit access may rename, and move or pin nothing
    if (access) {
      const touchesOtherFields = Object.keys(updates).some(
        (field) => !RECIPIENT_EDITABLE_FIELDS.includes(field)
      );

      if (!canPerform(access.role, SHARE_ACTIONS.EDIT) || touchesOtherFields) {
        return forbidden();
      }

      file = access.item;
    }

    // Apply updates
    Object.assign(file, updates);
    
    // Update name field if originalName changed
    if (updates.originalName) {
      file.name = updates.originalName;
    }
    
    await file.save();

    return NextResponse.json(
      {
        success: true,
        message: "File updated successfully",
        file: {
          id: file._id.toString(),
          name: file.name,
          originalName: file.originalName,
          folder: file.folder,
          isPinned: file.isPinned,
          updatedAt: file.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update file error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update file",
      },
      { status: 500 }
    );
  }
}


/**
 * DELETE /api/files/[id]
 * Delete file (soft delete)
 */
export async function DELETE(request, { params }) {
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

    const { id } = await params;

    const file = await FileService.softDeleteFile(id, decoded.userId);

    return NextResponse.json(
      {
        success: true,
        message: file.isDeleted
          ? "File moved to trash successfully"
          : "File deletion status updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete file error:", error);

    if (error.message === "File not found") {
      // Someone the file is shared with is told they may not delete it, not that it is missing
      const access = await readDeleteAccess(request, params);
      if (access) return forbidden();

      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete file",
      },
      { status: 500 }
    );
  }
}

// Whether the caller can reach a file they failed to delete; any failure here counts as no access
const readDeleteAccess = async (request, params) => {
  try {
    const userId = readCallerId(request);
    const { id } = await params;

    return userId ? await getItemAccess(id, "file", userId, { lean: true }) : null;
  } catch {
    return null;
  }
};