import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import Folder from "@/models/Folder";

/**
 * PATCH /api/files/[id]/permissions
 * Update file/folder permissions settings
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

    const { id } = await params;
    const body = await request.json();

    const {
      permissionLevel,        // 'folder-member' | 'only-owner' | 'admins-only'
      isCommentsEnabled,      // true | false
      accessLevel,            // 'anyone' | 'invited' | 'team'
      isExpirationEnabled,
      expirationDate,
      isPasswordEnabled,
      password,
      disableDownloads,
      itemType               // 'file' | 'folder'
    } = body;

    // Find item (file or folder)
    const Model = itemType === 'folder' ? Folder : File;
    const item = await Model.findOne({
      _id: id,
      owner: decoded.userId,
      isDeleted: false,
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: `${itemType} not found` },
        { status: 404 }
      );
    }

    // Update permissions
    if (permissionLevel !== undefined) {
      item.permissions = {
        ...item.permissions,
        controlLevel: permissionLevel
      };
    }

    if (isCommentsEnabled !== undefined) {
      item.permissions = {
        ...item.permissions,
        showAccessInfo: isCommentsEnabled
      };
    }

    // Update share link settings
    if (accessLevel !== undefined) {
      item.shareLink = {
        ...item.shareLink,
        accessLevel,
        isExpirationEnabled,
        expirationDate: isExpirationEnabled ? expirationDate : null,
        isPasswordEnabled,
        password: isPasswordEnabled ? password : null,
        disableDownloads: disableDownloads || false,
        updatedAt: new Date()
      };
    }

    await item.save();

    return NextResponse.json(
      {
        success: true,
        message: "Permissions updated successfully",
        item: {
          id: item._id.toString(),
          permissions: item.permissions,
          shareLink: item.shareLink,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update permissions error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update permissions",
      },
      { status: 500 }
    );
  }
}