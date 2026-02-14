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

    let cloudinaryId = null;
    let cloudinaryUrl = null;
    let finalData = null;

    // Handle different signature types
    if (type === "draw" || type === "upload") {
      // Upload base64 to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(data, {
        folder: `nexfile/${userId}/signatures`,
        resource_type: "image",
      });
      
      cloudinaryId = uploadResult.public_id;
      cloudinaryUrl = uploadResult.secure_url;
      finalData = cloudinaryUrl;
    } else if (type === "type") {
      // For type, store the text and fontId
      finalData = data;
    }

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
    console.error("Error creating signature:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}