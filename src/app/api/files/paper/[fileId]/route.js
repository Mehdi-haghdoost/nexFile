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