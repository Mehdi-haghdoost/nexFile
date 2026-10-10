import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import Signature from "@/models/Signature";
import cloudinary from "@/lib/cloudinary";
import { FileService } from "@/utils/files/fileService";
import { PDFDocument, rgb } from 'pdf-lib';

// Stamp placement on the last page, in PDF points
const STAMP = { width: 150, height: 50, right: 50, bottom: 40 };

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

    const pdfResponse = await fetch(pdfFile.secureUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.status}`);
    }
    const pdfBuffer = await pdfResponse.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width } = lastPage.getSize();

    // Older records stored the Cloudinary URL in data, so either field can hold the image
    const signatureImageUrl = signature.cloudinaryUrl
      || (typeof signature.data === 'string' ? signature.data : null);

    if (signatureImageUrl) {
      const signatureResponse = await fetch(signatureImageUrl);
      if (!signatureResponse.ok) {
        throw new Error(`Failed to download signature: ${signatureResponse.status}`);
      }
      const signatureBuffer = await signatureResponse.arrayBuffer();

      let signatureImage;
      try {
        signatureImage = await pdfDoc.embedPng(signatureBuffer);
      } catch {
        try {
          signatureImage = await pdfDoc.embedJpg(signatureBuffer);
        } catch {
          throw new Error('Invalid signature image format');
        }
      }

      lastPage.drawImage(signatureImage, {
        x: width - STAMP.width - STAMP.right,
        y: STAMP.bottom,
        width: STAMP.width,
        height: STAMP.height,
      });
    } else {
      // Typed signatures saved before they were rendered to images hold only text
      const text = signature.data?.text;

      if (!text) {
        return NextResponse.json(
          { success: false, message: "This signature has no image to apply" },
          { status: 400 }
        );
      }

      try {
        lastPage.drawText(text, {
          x: width - 200,
          y: 50,
          size: 24,
          color: rgb(0, 0, 0),
        });
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "This signature was saved as plain text in characters the PDF cannot embed. Open Signatures and create it again.",
          },
          { status: 400 }
        );
      }
    }

    const modifiedPdfBytes = await pdfDoc.save();
    const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);

    const base64Pdf = modifiedPdfBuffer.toString('base64');
    const dataUri = `data:application/pdf;base64,${base64Pdf}`;
    const safePublicId = `signed_${Date.now()}_${pdfFile._id.toString()}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: `nexfile/${decoded.userId}/signed`,
      resource_type: 'raw',
      public_id: safePublicId,
      timeout: 300000,
    });

    const originalBaseName = pdfFile.name.replace(/\.pdf$/i, '');
    const signedFileName = `${originalBaseName}-signed.pdf`;

    // Created through the service so the parent folder's counters follow, as on upload
    const signedFile = await FileService.createFile({
      name: signedFileName,
      originalName: signedFileName,
      mimeType: 'application/pdf',
      size: modifiedPdfBuffer.length,
      extension: 'pdf',
      folder: pdfFile.folder,
      cloudinaryId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      metadata: {
        format: 'pdf',
        resourceType: 'raw',
      },
    }, decoded.userId);

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