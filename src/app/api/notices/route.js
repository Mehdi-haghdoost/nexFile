import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Folder from "@/models/Folder";
import { requireUser } from "@/utils/auth/requireUser";
import { FileService } from "@/utils/files/fileService";
import { buildFileNotices } from "@/utils/files/fileNotices";

const RECENT_FOLDER_LIMIT = 6;

// Returns the caller's feed, derived rather than stored
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const [sharedItems, deletedItems, recentFolders] = await Promise.all([
      FileService.getSharedItems(userId),
      FileService.getDeletedItems(userId),
      Folder.find({ owner: userId, isDeleted: false })
        .sort({ lastActivity: -1 })
        .limit(RECENT_FOLDER_LIMIT)
        .select("name lastActivity")
        .lean(),
    ]);

    const notices = buildFileNotices({
      sharedItems,
      deletedItems,
      recentFolders: recentFolders.map((folder) => ({
        id: folder._id.toString(),
        name: folder.name,
        lastActivity: folder.lastActivity,
      })),
    });

    return NextResponse.json({ success: true, notices });
  } catch (error) {
    console.error("Notices error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}