import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";

const MAX_FETCH_ATTEMPTS = 3;
const RETRY_DELAY_MS = [500, 1500];

const isTransientNetworkError = (error) =>
    ["ECONNRESET", "ETIMEDOUT", "EAI_AGAIN", "ENOTFOUND"].includes(error?.cause?.code);

// DNS blips and reset connections are worth a retry; anything else (a real 404/expired asset) fails identically every time
const fetchWithRetry = async (url) => {
    let lastError;

    for (let attempt = 0; attempt < MAX_FETCH_ATTEMPTS; attempt += 1) {
        try {
            return await fetch(url);
        } catch (error) {
            lastError = error;
            const isLastAttempt = attempt === MAX_FETCH_ATTEMPTS - 1;

            if (!isTransientNetworkError(error) || isLastAttempt) throw error;

            console.warn(`Content fetch attempt ${attempt + 1} failed (${error.cause?.code}), retrying...`);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS[attempt] || 1500));
        }
    }

    throw lastError;
};

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
        if (!decoded || !decoded.userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "File not found" },
                { status: 404 }
            );
        }

        const file = await File.findOne({
            _id: id,
            isDeleted: false,
            $or: [{ owner: decoded.userId }, { "sharedWith.user": decoded.userId }],
        });

        if (!file) {
            return NextResponse.json(
                { success: false, message: "File not found" },
                { status: 404 }
            );
        }

        const isPdf =
            file.extension === "pdf" || file.mimeType === "application/pdf";

        if (!isPdf) {
            return NextResponse.json(
                { success: false, message: "This file is not a PDF" },
                { status: 400 }
            );
        }

        const sourceUrl = file.secureUrl || file.url;
        if (!sourceUrl) {
            return NextResponse.json(
                { success: false, message: "This file has no stored content" },
                { status: 404 }
            );
        }

        const upstream = await fetchWithRetry(sourceUrl);

        if (!upstream.ok || !upstream.body) {
            return NextResponse.json(
                { success: false, message: "Failed to read the stored file" },
                { status: 502 }
            );
        }

        const encodedName = encodeURIComponent(file.originalName || file.name);

        return new NextResponse(upstream.body, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "X-File-Name": encodedName,
                "Cache-Control": "private, no-store",
            },
        });
    } catch (error) {
        console.error("Read file content error:", error);

        const isNetworkError = isTransientNetworkError(error);

        return NextResponse.json(
            {
                success: false,
                message: isNetworkError
                    ? "Could not reach file storage. This is often a temporary network/DNS hiccup -- please try again."
                    : "Failed to read file content",
            },
            { status: isNetworkError ? 503 : 500 }
        );
    }
}