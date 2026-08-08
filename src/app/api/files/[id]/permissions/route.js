import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { LinkPolicy } from "@/utils/files/linkPolicy";
import File from "@/models/File";
import Folder from "@/models/Folder";

/**
 * PATCH /api/files/[id]/permissions
 * Update file/folder permissions and share-link settings.
 * Share-link settings are validated against the organization's security policy.
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

    // Update folder/document permissions
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

    // Update share-link settings, enforcing the organization's policy
    if (accessLevel !== undefined) {
      const normalized = await LinkPolicy.applyToShareLink(decoded.userId, {
        accessLevel,
        isExpirationEnabled,
        expirationDate,
        isPasswordEnabled,
        password,
        disableDownloads,
      });

      item.shareLink = {
        ...item.shareLink,
        ...normalized,
        // Preserve an existing password when the client sends none
        password: normalized.password || item.shareLink?.password || null,
        createdAt: item.shareLink?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      item.markModified("shareLink");
    }

    item.markModified("permissions");
    await item.save();

    return NextResponse.json(
      {
        success: true,
        message: "Permissions updated successfully",
        item: {
          id: item._id.toString(),
          permissions: item.permissions,
          // Never return the stored password hash to the client
          shareLink: item.shareLink
            ? { ...item.shareLink, password: undefined }
            : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update permissions error:", error);

    // Policy violations are client errors, not server failures
    const isPolicyError =
      error.message?.includes("requires") || error.message?.includes("must be");

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update permissions",
      },
      { status: isPolicyError ? 400 : 500 }
    );
  }
}