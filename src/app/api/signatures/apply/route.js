import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import Signature from "@/models/Signature";
import cloudinary from "@/lib/cloudinary";
import { PDFDocument, rgb } from 'pdf-lib';

export async function POST(request) {
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

    const { pdfId, signatureId } = await request.json();

    if (!pdfId || !signatureId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get PDF file
    const pdfFile = await File.findOne({
      _id: pdfId,
      owner: decoded.userId,
      mimeType: 'application/pdf',
      isDeleted: false,
    });

    if (!pdfFile) {
      return NextResponse.json(
        { success: false, message: "PDF file not found" },
        { status: 404 }
      );
    }

    // Get signature
    const signature = await Signature.findOne({
      _id: signatureId,
      owner: decoded.userId,
    });

    if (!signature) {
      return NextResponse.json(
        { success: false, message: "Signature not found" },
        { status: 404 }
      );
    }

    // Download PDF from Cloudinary
    const pdfResponse = await fetch(pdfFile.secureUrl);
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Load PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Get last page
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width, height } = lastPage.getSize();

    // Add signature based on type
    if (signature.type === 'draw' || signature.type === 'upload') {
      // Get signature image URL
      const signatureImageUrl = signature.type === 'draw' 
        ? signature.data 
        : signature.cloudinaryUrl;
      
      // Download signature image
      const signatureResponse = await fetch(signatureImageUrl);
      const signatureBuffer = await signatureResponse.arrayBuffer();
      
      // Embed image (try PNG first, fallback to JPEG)
      let signatureImage;
      try {
        signatureImage = await pdfDoc.embedPng(signatureBuffer);
      } catch (e) {
        try {
          signatureImage = await pdfDoc.embedJpg(signatureBuffer);
        } catch (e2) {
          throw new Error('Invalid signature image format');
        }
      }
      
      // Calculate signature dimensions
      const signatureWidth = 150;
      const signatureHeight = 50;
      
      // Add to PDF (bottom right corner)
      lastPage.drawImage(signatureImage, {
        x: width - signatureWidth - 50,
        y: 50,
        width: signatureWidth,
        height: signatureHeight,
      });
      
    } else if (signature.type === 'type') {
      // Add text signature
      const { text } = signature.data;
      
      lastPage.drawText(text, {
        x: width - 200,
        y: 50,
        size: 24,
        color: rgb(0, 0, 0),
      });
    }

    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Upload timeout'));
      }, 600000);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `nexfile/${decoded.userId}/signed`,
          resource_type: 'raw',
          public_id: `${Date.now()}-${pdfFile.name.replace('.pdf', '')}-signed`,
          timeout: 600000,
        },
        (error, result) => {
          clearTimeout(timeout);
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(modifiedPdfBuffer);
    });

    // Create new file record
    const signedFile = await File.create({
      name: `${pdfFile.name.replace('.pdf', '')}-signed.pdf`,
      originalName: `${pdfFile.originalName.replace('.pdf', '')}-signed.pdf`,
      mimeType: 'application/pdf',
      size: modifiedPdfBuffer.length,
      extension: 'pdf',
      owner: decoded.userId,
      folder: pdfFile.folder,
      cloudinaryId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      metadata: {
        format: 'pdf',
        resourceType: 'raw',
      },
    });

    return NextResponse.json({
      success: true,
      message: "Signature applied successfully",
      file: {
        id: signedFile._id.toString(),
        name: signedFile.name,
        originalName: signedFile.originalName,
        size: signedFile.size,
        url: signedFile.secureUrl,
        secureUrl: signedFile.secureUrl,
        mimeType: signedFile.mimeType,
        extension: signedFile.extension,
        cloudinaryId: signedFile.cloudinaryId,
        folder: signedFile.folder,
        isDeleted: signedFile.isDeleted,
        createdAt: signedFile.createdAt,
      },
    });

  } catch (error) {
    console.error("Apply signature error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to apply signature" },
      { status: 500 }
    );
  }
}