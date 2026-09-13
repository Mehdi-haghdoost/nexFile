import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import Transfer from "@/models/Transfer";
import cloudinary from "@/lib/cloudinary";
import { serializeTransfer } from "@/utils/transfers/transferService";

// Removes the stored assets so a permanent delete does not leak Cloudinary storage
const destroyTransferAssets = async (files = []) => {
    const results = await Promise.allSettled(
        files
            .filter((file) => file.cloudinaryId)
            .map((file) => cloudinary.uploader.destroy(file.cloudinaryId, {
                resource_type: file.resourceType || "raw",
            }))
    );

    // A failed asset delete should not block the record delete, so just log it
    results
        .filter((result) => result.status === "rejected")
        .forEach((result) => console.error("Cloudinary destroy failed:", result.reason));
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
        if (!decoded?.userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const transfer = await Transfer.findOne({
            _id: id,
            owner: decoded.userId,
            isDeleted: false,
        });

        if (!transfer) {
            return NextResponse.json(
                { success: false, message: "Transfer not found" },
                { status: 404 }
            );
        }

        const { origin } = new URL(request.url);

        return NextResponse.json({
            success: true,
            transfer: serializeTransfer(transfer, origin),
        });

    } catch (error) {
        console.error("Get transfer error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Soft delete keeps the record so an already shared link can be audited later
// Pass ?permanent=true to drop the record and its Cloudinary assets
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

        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const isPermanent = searchParams.get("permanent") === "true";

        const transfer = await Transfer.findOne({
            _id: id,
            owner: decoded.userId,
        });

        if (!transfer) {
            return NextResponse.json(
                { success: false, message: "Transfer not found" },
                { status: 404 }
            );
        }

        if (isPermanent) {
            await destroyTransferAssets(transfer.files);
            await transfer.deleteOne();

            return NextResponse.json({
                success: true,
                message: "Transfer permanently deleted",
                transfer: { id, permanent: true },
            });
        }

        // Deleting an already deleted transfer is treated as a success
        if (transfer.isDeleted) {
            return NextResponse.json({
                success: true,
                message: "Transfer already deleted",
                transfer: { id: transfer._id.toString(), permanent: false },
            });
        }

        transfer.isDeleted = true;
        transfer.deletedAt = new Date();
        await transfer.save();

        return NextResponse.json({
            success: true,
            message: "Transfer deleted",
            transfer: { id: transfer._id.toString(), permanent: false },
        });

    } catch (error) {
        console.error("Delete transfer error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}