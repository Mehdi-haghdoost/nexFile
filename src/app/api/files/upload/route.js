import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FileService } from "@/utils/files/fileService";
import { uploadFileSchema } from "@/utils/files/fileValidators";
import { writeFile } from "fs/promises";

export async function POST(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folderId = formData.get("folder");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, message: "Cannot upload empty file" },
        { status: 400 }
      );
    }

    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 100MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    await FileService.ensureUploadDirectory(decoded.userId, folderId);

    // Generate file path and URL - THIS IS THE FIX!
    const filePath = FileService.generateFilePath(
      decoded.userId,
      folderId,
      file.name
    );
    
    const filename = filePath.split(/[/\\]/).pop();
    
    const fileUrl = FileService.generateFileUrl(
      decoded.userId,
      folderId,
      filename
    );

    console.log('📂 File path:', filePath);
    console.log('🔗 File URL:', fileUrl);

    // Write file to disk
    await writeFile(filePath, buffer);

    const extension = FileService.getFileExtension(file.name);

    const fileData = {
      name: file.name,
      originalName: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      extension,
      path: filePath,  // ✅ NOW IT'S SET!
      url: fileUrl,    // ✅ NOW IT'S SET!
      folder: folderId || null,
    };

    console.log('📝 File data before validation:', fileData);

    // Validate data
    const validatedData = uploadFileSchema.parse(fileData);

    // Save to database
    const createdFile = await FileService.createFile(
      validatedData,
      decoded.userId
    );

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        file: {
          id: createdFile._id.toString(),
          name: createdFile.name,
          size: createdFile.size,
          mimeType: createdFile.mimeType,
          extension: createdFile.extension,
          url: createdFile.url,
          folder: createdFile.folder,
          createdAt: createdFile.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Upload file error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors?.map(e => `${e.path.join('.')}: ${e.message}`) || [],
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to upload file",
      },
      { status: 500 }
    );
  }
}