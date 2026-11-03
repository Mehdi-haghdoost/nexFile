import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import Transfer from "@/models/Transfer";
import TransferActivity from "@/models/TransferActivity";
import TransferViewMarker from "@/models/TransferViewMarker";
import { destroyTransferFile } from "@/utils/transfers/transferCleanup";
import { serializeTransfer } from "@/utils/transfers/transferService";
import { getPublicOrigin } from "@/utils/transfers/transferRouteHelpers";

// Removes the stored assets so a permanent delete does not leave Cloudinary storage behind
const destroyTransferAssets = async (files = []) => {
    const results = await Promise.allSettled(
        files.filter((file) => file.cloudinaryId).map(destroyTransferFile)
    );

    // A failed asset delete should not block the record delete, so it is only logged
    results
        .filter((result) => result.status === "rejected")
        .forEach((result) => console.error("Cloudinary destroy failed:", result.reason));
};

// Removes the visitor data of a permanently deleted transfer; each cleanup runs even if the other fails
const removeTransferVisitorData = async (transferId) => {
    const [activity, markers] = await Promise.allSettled([
        (async () => TransferActivity.deleteMany({ transfer: transferId }))(),
        (async () => TransferViewMarker.deleteMany({ transfer: transferId }))(),
    ]);

    // Leftovers are hidden from the monitor and expire on their own, so a failure is only logged
    if (activity.status === "rejected") {
        console.error(`Transfer activity cleanup failed for ${transferId}:`, activity.reason);
    }

    if (markers.status === "rejected") {
        console.error(`Transfer view marker cleanup failed for ${transferId}:`, markers.reason);
    }
};

// A malformed id cannot match any transfer, so it is answered like a missing one
const notFound = () =>
    NextResponse.json(
        { success: false, message: "Transfer not found" },
        { status: 404 }
    );

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
        if (!mongoose.Types.ObjectId.isValid(id)) return notFound();

        const transfer = await Transfer.findOne({
            _id: id,
            owner: decoded.userId,
            isDeleted: false,
        });

        if (!transfer) return notFound();

        // Matches the link the list, the Monitor and recipient emails use
        const origin = getPublicOrigin(request);

        // Only the owner reaches this route, so recipients are safe to include
        return NextResponse.json({
            success: true,
            transfer: serializeTransfer(transfer, origin, { includeRecipients: true }),
        });

    } catch (error) {
        console.error("Get transfer error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Soft delete by default; ?permanent=true also destroys the record and its assets
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
        if (!mongoose.Types.ObjectId.isValid(id)) return notFound();

        const { searchParams } = new URL(request.url);
        const isPermanent = searchParams.get("permanent") === "true";

        const transfer = await Transfer.findOne({
            _id: id,
            owner: decoded.userId,
        });

        if (!transfer) return notFound();

        if (isPermanent) {
            await destroyTransferAssets(transfer.files);
            await transfer.deleteOne();

            // Runs only after the record is gone, so a failed cleanup never touches a transfer that still exists
            await removeTransferVisitorData(transfer._id);

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