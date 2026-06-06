// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import { verifyAccessToken } from "@/utils/auth/tokenManager";
// import File from "@/models/File";
// import Signature from "@/models/Signature";
// import cloudinary from "@/lib/cloudinary";
// import { PDFDocument, rgb } from 'pdf-lib';

// export async function POST(request) {
//   try {
//     await connectDB();

//     const token = request.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const decoded = verifyAccessToken(token);
//     if (!decoded || !decoded.userId) {
//       return NextResponse.json(
//         { success: false, message: "Invalid token" },
//         { status: 401 }
//       );
//     }

//     const { pdfId, signatureId } = await request.json();

//     if (!pdfId || !signatureId) {
//       return NextResponse.json(
//         { success: false, message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Get PDF file
//     const pdfFile = await File.findOne({
//       _id: pdfId,
//       owner: decoded.userId,
//       mimeType: 'application/pdf',
//       isDeleted: false,
//     });

//     if (!pdfFile) {
//       return NextResponse.json(
//         { success: false, message: "PDF file not found" },
//         { status: 404 }
//       );
//     }

//     // Get signature
//     const signature = await Signature.findOne({
//       _id: signatureId,
//       owner: decoded.userId,
//     });

//     if (!signature) {
//       return NextResponse.json(
//         { success: false, message: "Signature not found" },
//         { status: 404 }
//       );
//     }

//     // Download PDF from Cloudinary
//     const pdfResponse = await fetch(pdfFile.secureUrl);
//     const pdfBuffer = await pdfResponse.arrayBuffer();

//     // Load PDF
//     const pdfDoc = await PDFDocument.load(pdfBuffer);
    
//     // Get last page
//     const pages = pdfDoc.getPages();
//     const lastPage = pages[pages.length - 1];
//     const { width, height } = lastPage.getSize();

//     // Add signature based on type
//     if (signature.type === 'draw' || signature.type === 'upload') {
//       // Get signature image URL
//       const signatureImageUrl = signature.type === 'draw' 
//         ? signature.data 
//         : signature.cloudinaryUrl;
      
//       // Download signature image
//       const signatureResponse = await fetch(signatureImageUrl);
//       const signatureBuffer = await signatureResponse.arrayBuffer();
      
//       // Embed image (try PNG first, fallback to JPEG)
//       let signatureImage;
//       try {
//         signatureImage = await pdfDoc.embedPng(signatureBuffer);
//       } catch (e) {
//         try {
//           signatureImage = await pdfDoc.embedJpg(signatureBuffer);
//         } catch (e2) {
//           throw new Error('Invalid signature image format');
//         }
//       }
      
//       // Calculate signature dimensions
//       const signatureWidth = 150;
//       const signatureHeight = 50;
      
//       // Add to PDF (bottom right corner)
//       lastPage.drawImage(signatureImage, {
//         x: width - signatureWidth - 50,
//         y: 50,
//         width: signatureWidth,
//         height: signatureHeight,
//       });
      
//     } else if (signature.type === 'type') {
//       // Add text signature
//       const { text } = signature.data;
      
//       lastPage.drawText(text, {
//         x: width - 200,
//         y: 50,
//         size: 24,
//         color: rgb(0, 0, 0),
//       });
//     }

//     // Save modified PDF
//     const modifiedPdfBytes = await pdfDoc.save();
//     const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);

//     // Upload to Cloudinary
//     const uploadResult = await new Promise((resolve, reject) => {
//       const timeout = setTimeout(() => {
//         reject(new Error('Upload timeout'));
//       }, 600000);

//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: `nexfile/${decoded.userId}/signed`,
//           resource_type: 'raw',
//           public_id: `${Date.now()}-${pdfFile.name.replace('.pdf', '')}-signed`,
//           timeout: 600000,
//         },
//         (error, result) => {
//           clearTimeout(timeout);
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );

//       uploadStream.end(modifiedPdfBuffer);
//     });

//     // Create new file record
//     const signedFile = await File.create({
//       name: `${pdfFile.name.replace('.pdf', '')}-signed.pdf`,
//       originalName: `${pdfFile.originalName.replace('.pdf', '')}-signed.pdf`,
//       mimeType: 'application/pdf',
//       size: modifiedPdfBuffer.length,
//       extension: 'pdf',
//       owner: decoded.userId,
//       folder: pdfFile.folder,
//       cloudinaryId: uploadResult.public_id,
//       url: uploadResult.url,
//       secureUrl: uploadResult.secure_url,
//       metadata: {
//         format: 'pdf',
//         resourceType: 'raw',
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Signature applied successfully",
//       file: {
//         id: signedFile._id.toString(),
//         name: signedFile.name,
//         originalName: signedFile.originalName,
//         size: signedFile.size,
//         url: signedFile.secureUrl,
//         secureUrl: signedFile.secureUrl,
//         mimeType: signedFile.mimeType,
//         extension: signedFile.extension,
//         cloudinaryId: signedFile.cloudinaryId,
//         folder: signedFile.folder,
//         isDeleted: signedFile.isDeleted,
//         createdAt: signedFile.createdAt,
//       },
//     });

//   } catch (error) {
//     console.error("Apply signature error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to apply signature" },
//       { status: 500 }
//     );
//   }
// }

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------


// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import { verifyAccessToken } from "@/utils/auth/tokenManager";
// import File from "@/models/File";
// import Signature from "@/models/Signature";
// import cloudinary from "@/lib/cloudinary";
// import { PDFDocument, rgb } from 'pdf-lib';

// export async function POST(request) {
//   try {
//     await connectDB();

//     const token = request.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const decoded = verifyAccessToken(token);
//     if (!decoded || !decoded.userId) {
//       return NextResponse.json(
//         { success: false, message: "Invalid token" },
//         { status: 401 }
//       );
//     }

//     const { pdfId, signatureId } = await request.json();

//     if (!pdfId || !signatureId) {
//       return NextResponse.json(
//         { success: false, message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Get PDF file
//     const pdfFile = await File.findOne({
//       _id: pdfId,
//       owner: decoded.userId,
//       mimeType: 'application/pdf',
//       isDeleted: false,
//     });

//     if (!pdfFile) {
//       return NextResponse.json(
//         { success: false, message: "PDF file not found" },
//         { status: 404 }
//       );
//     }

//     // Get signature
//     const signature = await Signature.findOne({
//       _id: signatureId,
//       owner: decoded.userId,
//     });

//     if (!signature) {
//       return NextResponse.json(
//         { success: false, message: "Signature not found" },
//         { status: 404 }
//       );
//     }

//     // Download PDF from Cloudinary
//     const pdfResponse = await fetch(pdfFile.secureUrl);
//     if (!pdfResponse.ok) {
//       throw new Error(`Failed to download PDF: ${pdfResponse.status}`);
//     }
//     const pdfBuffer = await pdfResponse.arrayBuffer();

//     // Load PDF
//     const pdfDoc = await PDFDocument.load(pdfBuffer);
    
//     // Get last page
//     const pages = pdfDoc.getPages();
//     const lastPage = pages[pages.length - 1];
//     const { width, height } = lastPage.getSize();

//     // Add signature based on type
//     if (signature.type === 'draw' || signature.type === 'upload') {
//       const signatureImageUrl = signature.type === 'draw' 
//         ? signature.data 
//         : signature.cloudinaryUrl;
      
//       const signatureResponse = await fetch(signatureImageUrl);
//       if (!signatureResponse.ok) {
//         throw new Error(`Failed to download signature image: ${signatureResponse.status}`);
//       }
//       const signatureBuffer = await signatureResponse.arrayBuffer();
      
//       let signatureImage;
//       try {
//         signatureImage = await pdfDoc.embedPng(signatureBuffer);
//       } catch (e) {
//         try {
//           signatureImage = await pdfDoc.embedJpg(signatureBuffer);
//         } catch (e2) {
//           throw new Error('Invalid signature image format');
//         }
//       }
      
//       const signatureWidth = 150;
//       const signatureHeight = 50;
      
//       lastPage.drawImage(signatureImage, {
//         x: width - signatureWidth - 50,
//         y: 50,
//         width: signatureWidth,
//         height: signatureHeight,
//       });
      
//     } else if (signature.type === 'type') {
//       const { text } = signature.data;
//       lastPage.drawText(text, {
//         x: width - 200,
//         y: 50,
//         size: 24,
//         color: rgb(0, 0, 0),
//       });
//     }

//     // Save modified PDF
//     const modifiedPdfBytes = await pdfDoc.save();
//     const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);

//     // ✅ Fix: public_id فقط با کاراکترهای ایمن - بدون فارسی
//     const safePublicId = `signed_${Date.now()}_${pdfFile._id.toString()}`;

//     // Upload to Cloudinary
//     const uploadResult = await new Promise((resolve, reject) => {
//       const timeoutId = setTimeout(() => {
//         reject(new Error('Upload timeout after 5 minutes'));
//       }, 300000);

//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: `nexfile/${decoded.userId}/signed`,
//           resource_type: 'raw',
//           public_id: safePublicId,  // ✅ فقط ASCII - بدون فارسی
//           timeout: 300000,
//           chunk_size: 6000000,
//         },
//         (error, result) => {
//           clearTimeout(timeoutId);
//           if (error) {
//             console.error('Cloudinary upload error:', error);
//             reject(error);
//           } else {
//             resolve(result);
//           }
//         }
//       );

//       uploadStream.end(modifiedPdfBuffer);
//     });

//     // ✅ نام فایل با پسوند .pdf - مستقل از public_id
//     const originalBaseName = pdfFile.name.replace(/\.pdf$/i, '');
//     const signedFileName = `${originalBaseName}-signed.pdf`;

//     // Create new file record
//     const signedFile = await File.create({
//       name: signedFileName,
//       originalName: signedFileName,
//       mimeType: 'application/pdf',
//       size: modifiedPdfBuffer.length,
//       extension: 'pdf',
//       owner: decoded.userId,
//       folder: pdfFile.folder,
//       cloudinaryId: uploadResult.public_id,
//       url: uploadResult.url,
//       secureUrl: uploadResult.secure_url,
//       metadata: {
//         format: 'pdf',
//         resourceType: 'raw',
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Signature applied successfully",
//       file: {
//         id: signedFile._id.toString(),
//         name: signedFile.name,
//         originalName: signedFile.originalName,
//         size: signedFile.size,
//         url: signedFile.secureUrl,
//         secureUrl: signedFile.secureUrl,
//         mimeType: signedFile.mimeType,
//         extension: signedFile.extension,
//         cloudinaryId: signedFile.cloudinaryId,
//         folder: signedFile.folder,
//         isDeleted: signedFile.isDeleted,
//         createdAt: signedFile.createdAt,
//       },
//     });

//   } catch (error) {
//     console.error("Apply signature error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to apply signature" },
//       { status: 500 }
//     );
//   }
// }

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

    // Download PDF
    console.log('Downloading PDF from:', pdfFile.secureUrl);
    const pdfResponse = await fetch(pdfFile.secureUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.status}`);
    }
    const pdfBuffer = await pdfResponse.arrayBuffer();
    console.log('PDF downloaded, size:', pdfBuffer.byteLength, 'bytes');

    // Load and modify PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width, height } = lastPage.getSize();

    if (signature.type === 'draw' || signature.type === 'upload') {
      const signatureImageUrl = signature.type === 'draw'
        ? signature.data
        : signature.cloudinaryUrl;

      console.log('Downloading signature image from:', signatureImageUrl);
      const signatureResponse = await fetch(signatureImageUrl);
      if (!signatureResponse.ok) {
        throw new Error(`Failed to download signature: ${signatureResponse.status}`);
      }
      const signatureBuffer = await signatureResponse.arrayBuffer();

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

      lastPage.drawImage(signatureImage, {
        x: width - 200,
        y: 40,
        width: 150,
        height: 50,
      });

    } else if (signature.type === 'type') {
      const text = typeof signature.data === 'string'
        ? signature.data
        : signature.data?.text || 'Signature';

      lastPage.drawText(text, {
        x: width - 200,
        y: 50,
        size: 24,
        color: rgb(0, 0, 0),
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);
    console.log('PDF modified, size:', modifiedPdfBuffer.length, 'bytes');

    // ✅ Upload با base64 data URI - بدون upload_stream
    const base64Pdf = modifiedPdfBuffer.toString('base64');
    const dataUri = `data:application/pdf;base64,${base64Pdf}`;

    const safePublicId = `signed_${Date.now()}_${pdfFile._id.toString()}`;

    console.log('Uploading to Cloudinary...');
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: `nexfile/${decoded.userId}/signed`,
      resource_type: 'raw',
      public_id: safePublicId,
      timeout: 300000,
    });
    console.log('Upload success:', uploadResult.public_id);

    const originalBaseName = pdfFile.name.replace(/\.pdf$/i, '');
    const signedFileName = `${originalBaseName}-signed.pdf`;

    const signedFile = await File.create({
      name: signedFileName,
      originalName: signedFileName,
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