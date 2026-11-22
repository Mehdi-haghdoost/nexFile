import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import Folder from "@/models/Folder";
import {
  describeUploadError,
  resolveResourceType,
  sanitizePublicId,
  uploadBuffer,
} from "@/utils/files/cloudinaryUpload";
import { SHARE_ACTIONS, checkItemAccess } from "@/utils/sharing/sharingAccess";

const MAX_FILE_BYTES = 100 * 1024 * 1024;

// The PDF header may follow a few junk bytes, but the spec keeps it within the first 1024
const PDF_HEADER_WINDOW = 1024;

const CONFLICT_MESSAGE =
  "This PDF was changed by someone else since you opened it. Save as copy, or reopen it to get the latest version.";

const jsonError = (message, status) =>
  NextResponse.json({ success: false, message }, { status });

const isPdfRecord = (file) => file.extension === "pdf" || file.mimeType === "application/pdf";

const looksLikePdf = (buffer) => buffer.subarray(0, PDF_HEADER_WINDOW).includes("%PDF-");

// Files saved before versions were counted have no version field, which reads as 1
const versionFilter = (version) =>
  version === 1 ? { $or: [{ version: 1 }, { version: { $exists: false } }] } : { version };

// Removes a stored asset without letting a storage failure undo a finished replace
const destroyAsset = async (publicId, resourceType, reason) => {
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "raw",
      invalidate: true,
    });

    if (result?.result !== "ok" && result?.result !== "not found") {
      console.error(`Replace: could not delete ${reason} asset ${publicId}:`, result?.result);
    }
  } catch (error) {
    console.error(`Replace: could not delete ${reason} asset ${publicId}:`, error);
  }
};

// Overwrites a stored PDF with an edited one, for the owner and anyone with edit access
export async function POST(request, { params }) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) return jsonError("Unauthorized", 401);

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) return jsonError("Invalid token", 401);

    const { id } = await params;

    const result = await checkItemAccess(id, "file", decoded.userId, SHARE_ACTIONS.EDIT, { lean: true });
    if (!result.ok) return jsonError(result.message, result.status);

    const file = result.access.item;

    // Paper docs and other types have no stored PDF to overwrite
    if (!isPdfRecord(file) || !file.cloudinaryId) {
      return jsonError("Only uploaded PDF files can be replaced", 400);
    }

    let formData;
    try {
      formData = await request.formData();
    } catch {
      return jsonError("The edited PDF was not received", 400);
    }

    const upload = formData.get("file");
    const expectedVersion = Number(formData.get("version"));

    if (!Number.isInteger(expectedVersion) || expectedVersion < 1) {
      return jsonError("Reopen the PDF and try again", 400);
    }

    if (!upload || typeof upload.arrayBuffer !== "function" || upload.size === 0) {
      return jsonError("The edited PDF is empty", 400);
    }

    if (upload.size > MAX_FILE_BYTES) {
      return jsonError("File size exceeds 100MB limit", 400);
    }

    const buffer = Buffer.from(await upload.arrayBuffer());
    if (!looksLikePdf(buffer)) return jsonError("The edited file is not a valid PDF", 400);

    // Checked before uploading, so a stale editor costs no storage
    if ((file.version ?? 1) !== expectedVersion) return jsonError(CONFLICT_MESSAGE, 409);

    let uploadResult;
    try {
      // Stored beside the owner's other files, under a new id so no cache serves the old bytes
      uploadResult = await uploadBuffer(buffer, {
        folder: `nexfile/${file.owner}/${file.folder || "root"}`,
        resource_type: resolveResourceType("application/pdf"),
        public_id: `${Date.now()}-${sanitizePublicId(file.originalName || file.name)}`,
      });
    } catch (error) {
      console.error("Replace upload error:", error);
      return jsonError(describeUploadError(error), 502);
    }

    // Matches only while nobody else has replaced it, so two saves can never both win
    const updated = await File.findOneAndUpdate(
      { _id: file._id, isDeleted: false, ...versionFilter(expectedVersion) },
      {
        $set: {
          cloudinaryId: uploadResult.public_id,
          url: uploadResult.url,
          secureUrl: uploadResult.secure_url,
          size: buffer.length,
          "metadata.format": uploadResult.format,
          "metadata.resourceType": uploadResult.resource_type,
          // Set rather than incremented, so an older file with no version field still moves to 2
          version: expectedVersion + 1,
        },
      },
      { new: true }
    );

    if (!updated) {
      // The new asset belongs to no record, so it is removed again
      await destroyAsset(uploadResult.public_id, uploadResult.resource_type, "unused new");
      return jsonError(CONFLICT_MESSAGE, 409);
    }

    // From here the replace has succeeded; follow-up failures are logged, never reported
    if (file.folder) {
      try {
        await Folder.findByIdAndUpdate(file.folder, {
          $inc: { totalSize: buffer.length - (file.size || 0) },
          lastActivity: new Date(),
        });
      } catch (error) {
        console.error("Replace: could not update folder size:", error);
      }
    }

    // Deleted only after the record points at the new asset
    await destroyAsset(file.cloudinaryId, file.metadata?.resourceType, "previous");

    return NextResponse.json(
      {
        success: true,
        message: "Original PDF replaced",
        file: {
          id: updated._id.toString(),
          size: updated.size,
          version: updated.version,
          url: updated.secureUrl,
          secureUrl: updated.secureUrl,
          updatedAt: updated.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Replace file error:", error);
    return jsonError("Failed to replace the PDF", 500);
  }
}