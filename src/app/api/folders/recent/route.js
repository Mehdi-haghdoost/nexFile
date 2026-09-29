import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Folder from "@/models/Folder";
import { requireUser } from "@/utils/auth/requireUser";

// Enough to fill the sidebar panel without turning it into a second folder list
const RECENT_LIMIT = 6;

// Lists the folders the caller touched most recently, for the sidebar panel
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    // lastActivity is stamped on create, move, copy and update, so it tracks real use
    const folders = await Folder.find({ owner: userId, isDeleted: false })
      .sort({ lastActivity: -1 })
      .limit(RECENT_LIMIT)
      .select("name filesCount lastActivity");

    return NextResponse.json({
      success: true,
      folders: folders.map((folder) => ({
        id: folder._id.toString(),
        name: folder.name,
        filesCount: folder.filesCount,
        lastActivity: folder.lastActivity,
      })),
    });
  } catch (error) {
    console.error("Recent folders error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}