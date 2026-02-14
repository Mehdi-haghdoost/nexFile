import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Signature from "@/models/Signature";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const userId = request.headers.get("x-user-id");
    const { id } = params;
    
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

    if (signature.cloudinaryId) {
      await cloudinary.uploader.destroy(signature.cloudinaryId);
    }

    await Signature.deleteOne({ _id: id });

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
    const { id } = params;
    
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { isDefault } = body;

    const signature = await Signature.findOneAndUpdate(
      { _id: id, owner: userId },
      { isDefault },
      { new: true }
    );
    
    if (!signature) {
      return NextResponse.json(
        { message: "Signature not found" },
        { status: 404 }
      );
    }

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