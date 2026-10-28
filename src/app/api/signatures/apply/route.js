// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import { verifyAccessToken } from "@/utils/auth/tokenManager";
// import File from "@/models/File";
// import Signature from "@/models/Signature";
// import cloudinary from "@/lib/cloudinary";
// import { FileService } from "@/utils/files/fileService";
// import { PDFDocument, rgb } from 'pdf-lib';

// // Stamp placement on the last page, in PDF points
// const STAMP = { width: 150, height: 50, right: 50, bottom: 40 };

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

//     const pdfResponse = await fetch(pdfFile.secureUrl);
//     if (!pdfResponse.ok) {
//       throw new Error(`Failed to download PDF: ${pdfResponse.status}`);
//     }
//     const pdfBuffer = await pdfResponse.arrayBuffer();

//     const pdfDoc = await PDFDocument.load(pdfBuffer);
//     const pages = pdfDoc.getPages();
//     const lastPage = pages[pages.length - 1];
//     const { width } = lastPage.getSize();

//     // Older records stored the Cloudinary URL in data, so either field can hold the image
//     const signatureImageUrl = signature.cloudinaryUrl
//       || (typeof signature.data === 'string' ? signature.data : null);

//     if (signatureImageUrl) {
//       const signatureResponse = await fetch(signatureImageUrl);
//       if (!signatureResponse.ok) {
//         throw new Error(`Failed to download signature: ${signatureResponse.status}`);
//       }
//       const signatureBuffer = await signatureResponse.arrayBuffer();

//       let signatureImage;
//       try {
//         signatureImage = await pdfDoc.embedPng(signatureBuffer);
//       } catch {
//         try {
//           signatureImage = await pdfDoc.embedJpg(signatureBuffer);
//         } catch {
//           throw new Error('Invalid signature image format');
//         }
//       }

//       lastPage.drawImage(signatureImage, {
//         x: width - STAMP.width - STAMP.right,
//         y: STAMP.bottom,
//         width: STAMP.width,
//         height: STAMP.height,
//       });
//     } else {
//       // Typed signatures saved before they were rendered to images hold only text
//       const text = signature.data?.text;

//       if (!text) {
//         return NextResponse.json(
//           { success: false, message: "This signature has no image to apply" },
//           { status: 400 }
//         );
//       }

//       try {
//         lastPage.drawText(text, {
//           x: width - 200,
//           y: 50,
//           size: 24,
//           color: rgb(0, 0, 0),
//         });
//       } catch {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "This signature was saved as plain text in characters the PDF cannot embed. Open Signatures and create it again.",
//           },
//           { status: 400 }
//         );
//       }
//     }

//     const modifiedPdfBytes = await pdfDoc.save();
//     const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);

//     const base64Pdf = modifiedPdfBuffer.toString('base64');
//     const dataUri = `data:application/pdf;base64,${base64Pdf}`;
//     const safePublicId = `signed_${Date.now()}_${pdfFile._id.toString()}`;

//     const uploadResult = await cloudinary.uploader.upload(dataUri, {
//       folder: `nexfile/${decoded.userId}/signed`,
//       resource_type: 'raw',
//       public_id: safePublicId,
//       timeout: 300000,
//     });

//     const originalBaseName = pdfFile.name.replace(/\.pdf$/i, '');
//     const signedFileName = `${originalBaseName}-signed.pdf`;

//     // Created through the service so the parent folder's counters follow, as on upload
//     const signedFile = await FileService.createFile({
//       name: signedFileName,
//       originalName: signedFileName,
//       mimeType: 'application/pdf',
//       size: modifiedPdfBuffer.length,
//       extension: 'pdf',
//       folder: pdfFile.folder,
//       cloudinaryId: uploadResult.public_id,
//       url: uploadResult.url,
//       secureUrl: uploadResult.secure_url,
//       metadata: {
//         format: 'pdf',
//         resourceType: 'raw',
//       },
//     }, decoded.userId);

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
import Folder from "@/models/Folder";
import Signature from "@/models/Signature";
import { FileService } from "@/utils/files/fileService";
import {
  describeUploadError,
  sanitizePublicId,
  uploadBuffer,
} from "@/utils/files/cloudinaryUpload";
import { PDFDocument, rgb } from 'pdf-lib';

// Stamp placement on the last page, in PDF points
const STAMP = { width: 150, height: 50, right: 50, bottom: 40 };

const SIGNED_SUFFIX = '-signed.pdf';

// Keeps the signed name within the File model's 255-character limit
const MAX_BASE_NAME_LENGTH = 255 - SIGNED_SUFFIX.length;

const fail = (message, status) =>
  NextResponse.json({ success: false, message }, { status });

const isObjectId = (value) => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

// The server fetches only its own image host or inline images, so a stored URL cannot point it at another address
const isAllowedImageSource = (url) => {
  if (url.startsWith('data:image/')) return true;

  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && hostname === 'res.cloudinary.com';
  } catch {
    return false;
  }
};

const downloadBytes = async (url, label) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${label}: ${response.status}`);
  }
  return response.arrayBuffer();
};

export async function POST(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return fail("Unauthorized", 401);
    }

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) {
      return fail("Invalid token", 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid request", 400);
    }

    const { pdfId, signatureId } = body || {};

    if (!pdfId || !signatureId) {
      return fail("Missing required fields", 400);
    }

    if (!isObjectId(pdfId) || !isObjectId(signatureId)) {
      return fail("Invalid request", 400);
    }

    const pdfFile = await File.findOne({
      _id: pdfId,
      owner: decoded.userId,
      mimeType: 'application/pdf',
      isDeleted: false,
    });

    if (!pdfFile) {
      return fail("PDF file not found", 404);
    }

    const signature = await Signature.findOne({
      _id: signatureId,
      owner: decoded.userId,
    });

    if (!signature) {
      return fail("Signature not found", 404);
    }

    // The signed copy joins the original's folder, so that folder must still be live
    if (pdfFile.folder) {
      const folder = await Folder.findOne({
        _id: pdfFile.folder,
        owner: decoded.userId,
        isDeleted: false,
      });

      if (!folder) {
        return fail("Folder not found", 404);
      }
    }

    const pdfBytes = await downloadBytes(pdfFile.secureUrl, 'PDF');

    let pdfDoc;
    try {
      pdfDoc = await PDFDocument.load(pdfBytes);
    } catch {
      return fail("This PDF can't be signed. It may be encrypted or damaged.", 400);
    }

    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width } = lastPage.getSize();

    // Older records stored the Cloudinary URL in data, so either field can hold the image
    const signatureImageUrl = signature.cloudinaryUrl
      || (typeof signature.data === 'string' ? signature.data : null);

    if (signatureImageUrl) {
      if (!isAllowedImageSource(signatureImageUrl)) {
        return fail("This signature's image can't be used. Open Signatures and create it again.", 400);
      }

      const signatureBytes = await downloadBytes(signatureImageUrl, 'signature');

      let signatureImage;
      try {
        signatureImage = await pdfDoc.embedPng(signatureBytes);
      } catch {
        try {
          signatureImage = await pdfDoc.embedJpg(signatureBytes);
        } catch {
          return fail("Invalid signature image format", 400);
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
        return fail("This signature has no image to apply", 400);
      }

      try {
        lastPage.drawText(text, {
          x: width - 200,
          y: 50,
          size: 24,
          color: rgb(0, 0, 0),
        });
      } catch {
        return fail(
          "This signature was saved as plain text in characters the PDF cannot embed. Open Signatures and create it again.",
          400
        );
      }
    }

    const signedBuffer = Buffer.from(await pdfDoc.save());

    const baseName = pdfFile.name.replace(/\.pdf$/i, '').slice(0, MAX_BASE_NAME_LENGTH);
    const signedFileName = `${baseName}${SIGNED_SUFFIX}`;

    let uploadResult;
    try {
      // No extension in the id, as on upload; a .pdf ending would trip Cloudinary's PDF delivery block
      uploadResult = await uploadBuffer(signedBuffer, {
        folder: `nexfile/${decoded.userId}/signed`,
        resource_type: 'raw',
        public_id: `${Date.now()}-${sanitizePublicId(signedFileName)}`,
      });
    } catch (error) {
      console.error("Signed PDF upload failed:", error);
      return fail(describeUploadError(error), 500);
    }

    let signedFile;
    try {
      // Created through the service so the parent folder's counters follow, as on upload
      signedFile = await FileService.createFile({
        name: signedFileName,
        originalName: signedFileName,
        mimeType: 'application/pdf',
        size: signedBuffer.length,
        extension: 'pdf',
        folder: pdfFile.folder,
        cloudinaryId: uploadResult.public_id,
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
        metadata: {
          format: 'pdf',
          resourceType: uploadResult.resource_type,
        },
      }, decoded.userId);
    } catch (error) {
      // A record that exists means only the counter step failed, and its asset must stay
      const recordExists = await File.exists({ cloudinaryId: uploadResult.public_id }).catch(() => true);

      if (!recordExists) {
        await FileService.destroyFileAsset({
          name: signedFileName,
          cloudinaryId: uploadResult.public_id,
          metadata: { resourceType: uploadResult.resource_type },
        });
      }

      throw error;
    }

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
    // Details stay in the server log; the person gets a message they can act on
    console.error("Apply signature error:", error);
    return fail("Failed to apply signature", 500);
  }
}