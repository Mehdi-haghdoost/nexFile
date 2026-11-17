import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FileService } from "@/utils/files/fileService";
import File from "@/models/File";
import { getFileListPage, parseFileCursor, readFileListOptions } from "@/utils/files/fileListPage";

// Pickers need every file the account owns, not only the folder being browsed
const getAccountFiles = async (userId, { includeDeleted }) => {
  const query = { owner: userId };

  if (!includeDeleted) {
    query.isDeleted = false;
  }

  return await File.find(query)
    .populate("folder", "name")
    .sort({ createdAt: -1 });
};

// The fields every file list receives; folderName is filled only where the folder was looked up
const toFileRow = (file) => ({
  id: file._id,
  name: file.name,
  size: file.size,
  mimeType: file.mimeType,
  extension: file.extension,
  url: file.url,
  thumbnailUrl: file.thumbnailUrl,
  // The folder is populated only for the account-wide lists, so the id is kept either way
  folder: file.folder?._id || file.folder || null,
  folderName: file.folder?.name || null,
  isStarred: file.isStarred,
  isDeleted: file.isDeleted,
  deletedAt: file.deletedAt,
  downloadCount: file.downloadCount,
  createdAt: file.createdAt,
  updatedAt: file.updatedAt,
});

// Shared shape for a refused paged request
const badRequest = (message) =>
  NextResponse.json({ success: false, message }, { status: 400 });

// One page of the file list: one folder's files when a folder is given, otherwise every file the account owns
const getPagedFiles = async (userId, searchParams) => {
  const folder = searchParams.get("folder");
  if (folder && !/^[a-f0-9]{24}$/i.test(folder)) return badRequest("Invalid folder");

  const options = readFileListOptions(searchParams);

  // A cursor from another sort or a made-up one would restart the list and repeat files, so it is refused
  const cursor = searchParams.get("cursor");
  const after = cursor ? parseFileCursor(cursor, options.sortBy) : null;
  if (cursor && !after) return badRequest("Invalid cursor");

  const page = await getFileListPage(userId, { ...options, folderId: folder || null, after });

  return NextResponse.json(
    {
      success: true,
      files: page.files.map(toFileRow),
      nextCursor: page.nextCursor,
      total: page.total,
    },
    { status: 200 }
  );
};

export async function GET(request) {
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

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // A limit asks for one page; without it the whole list is returned as before, which the pickers rely on
    if (searchParams.has("limit")) {
      return await getPagedFiles(decoded.userId, searchParams);
    }

    const folder = searchParams.get("folder");
    const includeDeleted = searchParams.get("includeDeleted") === "true";
    const scope = searchParams.get("scope");

    const files = scope === "all"
      ? await getAccountFiles(decoded.userId, { includeDeleted })
      : await FileService.getUserFiles(decoded.userId, {
          folder: folder || null,
          includeDeleted,
        });

    return NextResponse.json(
      {
        success: true,
        files: files.map(toFileRow),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get files error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get files",
      },
      { status: 500 }
    );
  }
}