import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";

export async function GET(request, { params }) {
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
        if (!decoded?.userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const { fileId } = await params;

        const file = await File.findOne({
            _id: fileId,
            owner: decoded.userId,
            isDeleted: false,
        });

        if (!file) {
            return NextResponse.json(
                { success: false, message: "File not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            file: {
                id: file._id.toString(),
                name: file.name,
                content: file.content || "",
                folder: file.folder,
                updatedAt: file.updatedAt,
            },
        });

    } catch (error) {
        console.error("Get paper file error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
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
        if (!decoded?.userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const { fileId } = await params;
        const { content, name } = await request.json();

        const file = await File.findOne({
            _id: fileId,
            owner: decoded.userId,
            isDeleted: false,
        });

        if (!file) {
            return NextResponse.json(
                { success: false, message: "File not found" },
                { status: 404 }
            );
        }

        // Update content and optionally name
        if (content !== undefined) file.content = content;
        if (name !== undefined) file.name = name;

        await file.save();

        return NextResponse.json({
            success: true,
            message: "File saved",
            file: {
                id: file._id.toString(),
                name: file.name,
                content: file.content,
                updatedAt: file.updatedAt,
            },
        });

    } catch (error) {
        console.error("Update paper file error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Soft delete so the document lands in Deleted Files and stays restorable
// Pass ?permanent=true to remove the record from the collection instead
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
        if (!decoded?.userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const { fileId } = await params;
        const { searchParams } = new URL(request.url);
        const isPermanent = searchParams.get("permanent") === "true";

        // Only paper documents are deletable through this route
        const file = await File.findOne({
            _id: fileId,
            owner: decoded.userId,
            mimeType: "application/paper",
        });

        if (!file) {
            return NextResponse.json(
                { success: false, message: "File not found" },
                { status: 404 }
            );
        }

        if (isPermanent) {
            await file.deleteOne();

            return NextResponse.json({
                success: true,
                message: "File permanently deleted",
                file: { id: fileId, permanent: true },
            });
        }

        // Deleting an already deleted file is treated as a success
        if (file.isDeleted) {
            return NextResponse.json({
                success: true,
                message: "File already deleted",
                file: { id: file._id.toString(), permanent: false },
            });
        }

        file.isDeleted = true;
        file.deletedAt = new Date();
        await file.save();

        return NextResponse.json({
            success: true,
            message: "File moved to deleted files",
            file: {
                id: file._id.toString(),
                name: file.name,
                folder: file.folder,
                permanent: false,
            },
        });

    } catch (error) {
        console.error("Delete paper file error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Restores a soft deleted paper document back into its folder
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
        if (!decoded?.userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const { fileId } = await params;

        const file = await File.findOne({
            _id: fileId,
            owner: decoded.userId,
            mimeType: "application/paper",
        });

        if (!file) {
            return NextResponse.json(
                { success: false, message: "File not found" },
                { status: 404 }
            );
        }

        // Restoring a document that was never deleted is treated as a success
        if (!file.isDeleted) {
            return NextResponse.json({
                success: true,
                message: "File is already active",
                file: {
                    id: file._id.toString(),
                    name: file.name,
                    folder: file.folder,
                },
            });
        }

        file.isDeleted = false;
        file.deletedAt = null;
        await file.save();

        return NextResponse.json({
            success: true,
            message: "File restored",
            file: {
                id: file._id.toString(),
                name: file.name,
                folder: file.folder,
            },
        });

    } catch (error) {
        console.error("Restore paper file error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}