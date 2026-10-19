import crypto from "crypto";
import cloudinary from "@/lib/cloudinary";
import FileRequest from "@/models/FileRequest";
import Folder from "@/models/Folder";
import { FileService } from "@/utils/files/fileService";
import { hashPassword } from "@/utils/auth/hashPassword";

// An upload the submission then refuses would otherwise sit in storage unreferenced
const discardUploadedAsset = async (uploadResult) => {
  if (!uploadResult?.public_id) return;

  try {
    await cloudinary.uploader.destroy(uploadResult.public_id, {
      resource_type: uploadResult.resource_type || "raw",
    });
  } catch (error) {
    console.error(`Could not discard ${uploadResult.public_id}:`, error.message);
  }
};

export class FileRequestService {
  // Create a new file request and generate its public token
  static async createRequest(data, ownerId) {
    const {
      title,
      description,
      folderId,
      hasDeadline,
      deadline,
      hasPassword,
      passwordData,
    } = data;

    if (!title || !title.trim()) {
      throw new Error("Title is required");
    }

    if (!folderId) {
      throw new Error("Folder is required");
    }

    const folder = await Folder.findOne({
      _id: folderId,
      owner: ownerId,
      isDeleted: false,
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    let hashedPassword = null;

    if (hasPassword && passwordData?.password) {
      hashedPassword = await hashPassword(passwordData.password);
    }

    const token = crypto.randomBytes(12).toString("hex");

    return FileRequest.create({
      title: title.trim(),
      description: (description || "").trim(),
      owner: ownerId,
      folder: folderId,
      token,
      hasDeadline: Boolean(hasDeadline),
      deadline:
        hasDeadline && deadline?.fullDateTime
          ? new Date(deadline.fullDateTime)
          : null,
      hasPassword: Boolean(hasPassword && hashedPassword),
      password: hashedPassword,
    });
  }

  // List the owner's requests, optionally filtered by status
  static async getUserRequests(ownerId, { filter = "All" } = {}) {
    const query = { owner: ownerId };

    if (filter === "Opened") query.status = "opened";
    if (filter === "Closed") query.status = "closed";

    return FileRequest.find(query).sort({ createdAt: -1 }).lean();
  }

  // Open or close a request
  static async updateStatus(requestId, ownerId, status) {
    const request = await FileRequest.findOne({
      _id: requestId,
      owner: ownerId,
    });

    if (!request) {
      throw new Error("File request not found");
    }

    request.status = status;
    await request.save();

    return request;
  }

  // Permanently remove a request. Submitted files remain in their folder
  // because they belong to the owner rather than to the request
  static async deleteRequest(requestId, ownerId) {
    const request = await FileRequest.findOneAndDelete({
      _id: requestId,
      owner: ownerId,
    });

    if (!request) {
      throw new Error("File request not found");
    }

    return request;
  }

  // Why a request is not accepting files, or null when it is
  static getClosedReason(request) {
    if (request.status === "closed") {
      return "This request is closed and is no longer accepting files";
    }

    if (
      request.hasDeadline &&
      request.deadline &&
      new Date(request.deadline) <= new Date()
    ) {
      return "The deadline for this request has passed";
    }

    return null;
  }

  // Public info for the landing page, with no owner or password data exposed
  static async getPublicRequest(token) {
    const request = await FileRequest.findOne({ token });

    if (!request) {
      throw new Error("Request not found");
    }

    return {
      request,
      publicInfo: {
        title: request.title,
        description: request.description,
        hasDeadline: request.hasDeadline,
        deadline: request.deadline,
        isPasswordRequired: request.hasPassword,
        // A submitter only needs to know whether the request is closed
        closedReason: this.getClosedReason(request),
      },
    };
  }

  // Recheck the destination because a request can outlive its folder
  static async getOpenFolder(request) {
    return Folder.findOne({
      _id: request.folder,
      owner: request.owner,
      isDeleted: false,
    });
  }

  // Record a public submission as a real file in the destination folder
  static async recordSubmission(
    request,
    { submitterName, uploadResult, originalFile }
  ) {
    const folder = await this.getOpenFolder(request);

    // Avoid creating a file that points to an unavailable folder
    if (!folder) {
      await discardUploadedAsset(uploadResult);
      throw new Error(
        "This request's destination folder is no longer available"
      );
    }

    let fileDoc;

    try {
      fileDoc = await FileService.createFile(
        {
          name: originalFile.name,
          originalName: originalFile.name,
          mimeType: originalFile.type || "application/octet-stream",
          size: originalFile.size,
          extension:
            originalFile.name.split(".").pop()?.toLowerCase() || "",
          folder: request.folder,
          cloudinaryId: uploadResult.public_id,
          url: uploadResult.url,
          secureUrl: uploadResult.secure_url,
          metadata: {
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            resourceType: uploadResult.resource_type,
          },
        },
        request.owner
      );
    } catch (error) {
      // Remove the uploaded asset if its database record cannot be created
      await discardUploadedAsset(uploadResult);
      throw error;
    }

    // Count unique submitters separately from the number of uploaded files
    const isNewSubmitter = !(request.submissions || []).some(
      (submission) =>
        (submission.submitterName || "").toLowerCase() ===
        submitterName.toLowerCase()
    );

    try {
      // Atomically update the submission ledger and its counters
      await FileRequest.updateOne(
        { _id: request._id },
        {
          $push: {
            submissions: {
              submitterName,
              file: fileDoc._id,
              fileName: originalFile.name,
              fileSize: originalFile.size,
            },
          },
          $inc: {
            uploadsCount: 1,
            ...(isNewSubmitter ? { submittersCount: 1 } : {}),
          },
        }
      );
    } catch (error) {
      // The file already exists; log ledger failures for later reconciliation
      console.error(
        `Submission ledger not updated for request ${request._id}, file ${fileDoc._id}:`,
        error.message
      );
    }

    return fileDoc;
  }
}
