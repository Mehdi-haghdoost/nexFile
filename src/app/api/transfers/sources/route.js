import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import File from "@/models/File";
import { requireUser } from "@/utils/auth/requireUser";
import { escapeRegex } from "@/utils/transfers/transferService";
import {
  TRANSFER_MAX_FILE_BYTES,
  TRANSFER_SOURCE_LIMIT,
} from "@/utils/constants/transferConstants";

// Lists the caller's stored files that can be copied into a transfer
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("folderId") || "";
    const search = searchParams.get("search") || "";

    // Only files with a Cloudinary copy qualify; paper docs live in the database
    const query = {
      owner: userId,
      isDeleted: false,
      secureUrl: { $ne: null },
      mimeType: { $ne: "application/paper" },
      size: { $lte: TRANSFER_MAX_FILE_BYTES },
    };

    if (folderId === "root") {
      query.folder = null;
    } else if (folderId) {
      if (!mongoose.Types.ObjectId.isValid(folderId)) {
        return NextResponse.json(
          { success: false, message: "Invalid folder" },
          { status: 400 }
        );
      }
      query.folder = folderId;
    }

    if (search) {
      query.name = { $regex: escapeRegex(search), $options: "i" };
    }

    const files = await File.find(query)
      .sort({ updatedAt: -1 })
      .limit(TRANSFER_SOURCE_LIMIT)
      .select("name extension size mimeType folder");

    return NextResponse.json({
      success: true,
      files: files.map((file) => ({
        id: file._id.toString(),
        name: file.name,
        extension: file.extension,
        size: file.size,
        mimeType: file.mimeType,
        folder: file.folder ? file.folder.toString() : null,
      })),
    });
  } catch (error) {
    console.error("List transfer sources error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}