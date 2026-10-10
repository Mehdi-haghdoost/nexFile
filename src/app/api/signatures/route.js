import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Signature from "@/models/Signature";
import cloudinary from "@/lib/cloudinary";

const MAX_SIGNATURES = 10;

export async function GET(request) {
  try {
    await connectDB();

    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const signatures = await Signature.find({ owner: userId })
      .sort({ isDefault: -1, createdAt: -1 })
      .select("-__v");

    return NextResponse.json({
      success: true,
      signatures,
      count: signatures.length,
    });
  } catch (error) {
    console.error("Error fetching signatures:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const count = await Signature.countByOwner(userId);
    if (count >= MAX_SIGNATURES) {
      return NextResponse.json(
        { message: `Maximum ${MAX_SIGNATURES} signatures allowed` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, type, data, isDefault } = body;

    if (!name || !type || !data) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Every type is stored as an image, so applying one never depends on fonts the server lacks
    const image = type === "type" ? data.image : data;

    if (typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json(
        { message: "Signature image is missing or malformed" },
        { status: 400 }
      );
    }

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: `nexfile/${userId}/signatures`,
      resource_type: "image",
    });

    const cloudinaryId = uploadResult.public_id;
    const cloudinaryUrl = uploadResult.secure_url;

    // A typed signature also keeps the text and font it was rendered from
    const finalData = type === "type"
      ? { text: data.text, fontId: data.fontId }
      : cloudinaryUrl;

    const signature = await Signature.create({
      owner: userId,
      name,
      type,
      data: finalData,
      cloudinaryId,
      cloudinaryUrl,
      isDefault: isDefault || false,
    });

    return NextResponse.json({
      success: true,
      signature,
      message: "Signature created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating signatures:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}