// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import { verifyAccessToken } from "@/utils/auth/tokenManager";
// import File from "@/models/File";

// // GET - لیست همه paper docs کاربر
// export async function GET(request) {
//     try {
//         await connectDB();

//         const token = request.cookies.get("token")?.value;
//         if (!token) {
//             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//         }

//         const decoded = verifyAccessToken(token);
//         if (!decoded?.userId) {
//             return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
//         }

//         const { searchParams } = new URL(request.url);
//         const folderId = searchParams.get('folderId');

//         const query = {
//             owner: decoded.userId,
//             mimeType: 'application/paper',
//             isDeleted: false,
//         };

//         // Filter by folder if provided
//         if (folderId) {
//             query.folder = folderId;
//         }

//         const files = await File.find(query).sort({ updatedAt: -1 });

//         return NextResponse.json({
//             success: true,
//             files: files.map(f => ({
//                 id: f._id.toString(),
//                 name: f.name,
//                 folder: f.folder,
//                 updatedAt: f.updatedAt,
//             })),
//         });

//     } catch (error) {
//         console.error("List paper files error:", error);
//         return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
//     }
// }

// // POST - ساخت paper doc جدید
// export async function POST(request) {
//     try {
//         await connectDB();

//         const token = request.cookies.get("token")?.value;
//         if (!token) {
//             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//         }

//         const decoded = verifyAccessToken(token);
//         if (!decoded?.userId) {
//             return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
//         }

//         const { name, folderId } = await request.json();

//         const file = await File.create({
//             name: name || 'Untitled Document',
//             originalName: name || 'Untitled Document',
//             mimeType: 'application/paper',
//             extension: 'paper',
//             size: 0,
//             owner: decoded.userId,
//             folder: folderId || null,
//             content: '',
//             metadata: { resourceType: 'raw' },
//         });

//         return NextResponse.json({
//             success: true,
//             file: {
//                 id: file._id.toString(),
//                 name: file.name,
//                 folder: file.folder,
//                 content: file.content,
//                 updatedAt: file.updatedAt,
//             },
//         });

//     } catch (error) {
//         console.error("Create paper file error:", error);
//         return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
//     }
// }

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";

export async function GET(request) {
    try {
        await connectDB();

        const token = request.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const decoded = verifyAccessToken(token);
        if (!decoded?.userId) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const folderId = searchParams.get('folderId');

        const query = {
            owner: decoded.userId,
            mimeType: 'application/paper',
            isDeleted: false,
        };

        if (folderId) query.folder = folderId;

        const files = await File.find(query).sort({ updatedAt: -1 });

        return NextResponse.json({
            success: true,
            files: files.map(f => ({
                id: f._id.toString(),
                name: f.name,
                folder: f.folder,
                updatedAt: f.updatedAt,
            })),
        });

    } catch (error) {
        console.error("List paper files error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const token = request.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const decoded = verifyAccessToken(token);
        if (!decoded?.userId) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

        const { name, folderId } = await request.json();

        const file = await File.create({
            name: name || 'Untitled Document',
            originalName: name || 'Untitled Document',
            mimeType: 'application/paper',
            extension: 'paper',
            size: 0,
            owner: decoded.userId,
            folder: folderId || null,
            content: '',
            cloudinaryId: null,
            url: null,
            secureUrl: null,
        });

        return NextResponse.json({
            success: true,
            file: {
                id: file._id.toString(),
                name: file.name,
                folder: file.folder,
                content: file.content,
                updatedAt: file.updatedAt,
            },
        });

    } catch (error) {
        console.error("Create paper file error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}