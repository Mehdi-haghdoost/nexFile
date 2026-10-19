
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FileService } from "@/utils/files/fileService";

/**
 * PATCH /api/files/[id]/move
 * Move a file to a different folder.
 */
export async function PATCH(request, context) {
  try {
    await connectDB();

    // Verify authentication
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

    const { id } = await context.params;
    const body = await request.json();
    const { targetFolderId } = body;

    // Validate the destination and move through the shared service
    const file = await FileService.moveFile(
      id,
      decoded.userId,
      targetFolderId
    );

    return NextResponse.json(
      {
        success: true,
        message: "File moved successfully",
        file: {
          id: file._id.toString(),
          name: file.name,
          originalName: file.originalName,
          folder: file.folder,
          updatedAt: file.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Move file error:", error);

    if (error.message === "File not found") {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    if (error.message === "Destination folder not found") {
      return NextResponse.json(
        { success: false, message: "Target folder not found" },
        { status: 404 }
      );
    }

    if (error.message === "File was moved by another request") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This file was moved by another request. Refresh and try again.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to move file",
      },
      { status: 500 }
    );
  }
}
