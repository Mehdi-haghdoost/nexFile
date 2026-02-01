import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";

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
    const file = await File.findOne({
      _id: id,
      owner: decoded.userId,
      isDeleted: false,
    });

    if (!file) {
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

    const { id } = await params; // ✅ Next.js 15

    const file = await File.findOne({
      _id: id,
      owner: decoded.userId,
      isDeleted: false,
    });

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    // Soft delete
    file.isDeleted = true;
    file.deletedAt = new Date();
    await file.save();

    return NextResponse.json(
      {
        success: true,
        message: "File moved to trash successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete file error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete file",
      },
      { status: 500 }
    );
  }
}