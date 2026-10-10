import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Signature from "@/models/Signature";
import cloudinary from "@/lib/cloudinary";

// Cloudinary resolves instead of throwing when nothing was removed, so the result has to be read
const destroySignatureAsset = async (cloudinaryId) => {
  if (!cloudinaryId) return { ok: true };

  try {
    const result = await cloudinary.uploader.destroy(cloudinaryId, {
      resource_type: "image",
      invalidate: true,
    });

    // An asset that is already gone counts as removed
    if (result?.result === "ok" || result?.result === "not found") {
      return { ok: true };
    }

    return { ok: false, reason: result?.result || "unknown" };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
};

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const userId = request.headers.get("x-user-id");
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const signature = await Signature.findOne({ _id: id, owner: userId });

    if (!signature) {
      return NextResponse.json(
        { message: "Signature not found" },
        { status: 404 }
      );
    }

    const destroyed = await destroySignatureAsset(signature.cloudinaryId);

    // The record stays on failure, so the image never outlives it unnoticed
    if (!destroyed.ok) {
      console.error(`Cloudinary destroy failed for signature ${id}: ${destroyed.reason}`);

      return NextResponse.json(
        { message: "Could not remove the signature image. Please try again." },
        { status: 502 }
      );
    }

    await Signature.deleteOne({ _id: signature._id });

    return NextResponse.json({
      success: true,
      message: "Signature deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting signature:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const userId = request.headers.get("x-user-id");
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { isDefault } = body;

    if (typeof isDefault !== "boolean") {
      return NextResponse.json(
        { message: "isDefault must be true or false" },
        { status: 400 }
      );
    }

    const signature = await Signature.findOne({ _id: id, owner: userId });

    if (!signature) {
      return NextResponse.json(
        { message: "Signature not found" },
        { status: 404 }
      );
    }

    // The others are cleared first, so an interruption leaves no default rather than two
    if (isDefault) {
      await Signature.updateMany(
        { owner: userId, _id: { $ne: signature._id } },
        { isDefault: false }
      );
    }

    signature.isDefault = isDefault;
    await signature.save();

    return NextResponse.json({
      success: true,
      signature,
      message: "Signature updated successfully",
    });
  } catch (error) {
    console.error("Error updating signature:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}