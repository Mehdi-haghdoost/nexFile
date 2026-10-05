import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import File from "@/models/File";
import { requireUser } from "@/utils/auth/requireUser";
import { FolderService } from "@/utils/folders/folderService";

// Returns a folder's size including every level beneath it, which the stored
// counter deliberately excludes so file operations need not walk up the tree
export async function GET(request, context) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Folder not found" },
        { status: 404 }
      );
    }

    const folder = await FolderService.getFolderById(id, userId);
    if (!folder || folder.isDeleted) {
      return NextResponse.json(
        { success: false, message: "Folder not found" },
        { status: 404 }
      );
    }

    const descendants = await FolderService.getDescendantFolderIds(id);
    const allFolderIds = [folder._id, ...descendants];

    // One aggregation across the subtree, rather than a query per level
    const [totals] = await File.aggregate([
      { $match: { folder: { $in: allFolderIds }, owner: new mongoose.Types.ObjectId(userId), isDeleted: false } },
      { $group: { _id: null, totalSize: { $sum: "$size" }, filesCount: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      success: true,
      totalSize: totals?.totalSize || 0,
      filesCount: totals?.filesCount || 0,
      foldersCount: descendants.length,
    });
  } catch (error) {
    console.error("Folder size error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}