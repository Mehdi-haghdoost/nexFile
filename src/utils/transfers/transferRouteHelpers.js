import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Transfer from "@/models/Transfer";
import { requireUser } from "@/utils/auth/requireUser";

// Missing, malformed and foreign ids all get the same answer so ownership is never revealed
const notFound = () =>
    NextResponse.json(
        { success: false, message: "Transfer not found" },
        { status: 404 }
    );

// Resolves the caller and one of their live transfers, or the response explaining why not
export const loadOwnedTransfer = async (request, id) => {
    const { userId, response } = requireUser(request);
    if (response) return { response };

    if (!mongoose.Types.ObjectId.isValid(id)) return { response: notFound() };

    const transfer = await Transfer.findOne({ _id: id, owner: userId, isDeleted: false });
    if (!transfer) return { response: notFound() };

    return { transfer, userId };
};