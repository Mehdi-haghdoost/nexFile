import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";

// Lists the soft deleted paper documents so they can be restored or removed for good
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
        if (!decoded?.userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const files = await File.find({
            owner: decoded.userId,
            mimeType: "application/paper",
            isDeleted: true,
        }).sort({ deletedAt: -1 });

        return NextResponse.json({
            success: true,
            files: files.map(f => ({
                id: f._id.toString(),
                name: f.name,
                folder: f.folder,
                deletedAt: f.deletedAt,
            })),
        });

    } catch (error) {
        console.error("List deleted paper files error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}