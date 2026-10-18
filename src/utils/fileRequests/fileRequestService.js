// import crypto from "crypto";
// import FileRequest from "@/models/FileRequest";
// import File from "@/models/File";
// import Folder from "@/models/Folder";
// import { hashPassword } from "@/utils/auth/hashPassword";

// export class FileRequestService {
//   // Create a new file request and generate its public token
//   static async createRequest(data, ownerId) {
//     const {
//       title,
//       description,
//       folderId,
//       hasDeadline,
//       deadline,
//       hasPassword,
//       passwordData,
//     } = data;

//     if (!title || !title.trim()) {
//       throw new Error("Title is required");
//     }
//     if (!folderId) {
//       throw new Error("Folder is required");
//     }

//     // A request outlives its creation, so the folder is checked now rather than at upload
//     const folder = await Folder.findOne({
//       _id: folderId,
//       owner: ownerId,
//       isDeleted: false,
//     });

//     if (!folder) {
//       throw new Error("Folder not found");
//     }

//     let hashedPassword = null;
//     if (hasPassword && passwordData?.password) {
//       hashedPassword = await hashPassword(passwordData.password);
//     }

//     const token = crypto.randomBytes(12).toString("hex");

//     return FileRequest.create({
//       title: title.trim(),
//       description: (description || "").trim(),
//       owner: ownerId,
//       folder: folderId,
//       token,
//       hasDeadline: Boolean(hasDeadline),
//       deadline:
//         hasDeadline && deadline?.fullDateTime
//           ? new Date(deadline.fullDateTime)
//           : null,
//       hasPassword: Boolean(hasPassword && hashedPassword),
//       password: hashedPassword,
//     });
//   }

//   // List the owner's requests, optionally filtered by status
//   static async getUserRequests(ownerId, { filter = "All" } = {}) {
//     const query = { owner: ownerId };
//     if (filter === "Opened") query.status = "opened";
//     if (filter === "Closed") query.status = "closed";

//     return FileRequest.find(query).sort({ createdAt: -1 }).lean();
//   }

//   // Open or close a request
//   static async updateStatus(requestId, ownerId, status) {
//     const request = await FileRequest.findOne({ _id: requestId, owner: ownerId });
//     if (!request) {
//       throw new Error("File request not found");
//     }

//     request.status = status;
//     await request.save();
//     return request;
//   }

//   // Permanently remove a request. Files already submitted are left in their
//   // folder, since they belong to the owner now rather than to the request
//   static async deleteRequest(requestId, ownerId) {
//     const request = await FileRequest.findOneAndDelete({
//       _id: requestId,
//       owner: ownerId,
//     });

//     if (!request) {
//       throw new Error("File request not found");
//     }

//     return request;
//   }

//   // Why a request is not accepting files, or null when it is
//   static getClosedReason(request) {
//     if (request.status === "closed") {
//       return "This request is closed and is no longer accepting files";
//     }

//     if (request.hasDeadline && request.deadline && new Date(request.deadline) <= new Date()) {
//       return "The deadline for this request has passed";
//     }

//     return null;
//   }

//   // Public info for the landing page, with no owner or password data exposed
//   static async getPublicRequest(token) {
//     const request = await FileRequest.findOne({ token });
//     if (!request) {
//       throw new Error("Request not found");
//     }

//     return {
//       request,
//       publicInfo: {
//         title: request.title,
//         description: request.description,
//         hasDeadline: request.hasDeadline,
//         deadline: request.deadline,
//         isPasswordRequired: request.hasPassword,
//         // One reason covers closed and expired, since a submitter only needs to know it is shut
//         closedReason: this.getClosedReason(request),
//       },
//     };
//   }

//   // Records a file that arrived through the public link, as a real stored file
//   // in the request's folder rather than only a counter
//   static async recordSubmission(request, { submitterName, uploadResult, originalFile }) {
//     const fileDoc = await File.create({
//       name: originalFile.name,
//       originalName: originalFile.name,
//       mimeType: originalFile.type || "application/octet-stream",
//       size: originalFile.size,
//       extension: originalFile.name.split(".").pop()?.toLowerCase() || "",
//       owner: request.owner,
//       folder: request.folder,
//       cloudinaryId: uploadResult.public_id,
//       url: uploadResult.url,
//       secureUrl: uploadResult.secure_url,
//       metadata: {
//         width: uploadResult.width,
//         height: uploadResult.height,
//         format: uploadResult.format,
//         resourceType: uploadResult.resource_type,
//       },
//     });

//     // The same person can send several files, so submitters counts people not uploads
//     const isNewSubmitter = !request.submissions.some(
//       (submission) => submission.submitterName.toLowerCase() === submitterName.toLowerCase()
//     );

//     request.submissions.push({
//       submitterName,
//       file: fileDoc._id,
//       fileName: originalFile.name,
//       fileSize: originalFile.size,
//     });

//     request.uploadsCount = request.submissions.length;
//     if (isNewSubmitter) request.submittersCount += 1;

//     await request.save();

//     await Folder.findByIdAndUpdate(request.folder, {
//       $inc: { filesCount: 1, totalSize: originalFile.size },
//       lastActivity: new Date(),
//     });

//     return fileDoc;
//   }
// }

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
    const request = await FileRequest.findOne({ _id: requestId, owner: ownerId });
    if (!request) {
      throw new Error("File request not found");
    }

    request.status = status;
    await request.save();
    return request;
  }

  // Permanently remove a request. Files already submitted are left in their
  // folder, since they belong to the owner now rather than to the request
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

    if (request.hasDeadline && request.deadline && new Date(request.deadline) <= new Date()) {
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
        // One reason covers closed and expired, since a submitter only needs to know it is shut
        closedReason: this.getClosedReason(request),
      },
    };
  }

  // The destination is checked again at submission time, because a request
  // outlives the folder it was created for
  static async getOpenFolder(request) {
    return Folder.findOne({
      _id: request.folder,
      owner: request.owner,
      isDeleted: false,
    });
  }

  // Records a file that arrived through the public link, as a real stored file
  // in the request's folder rather than only a counter
  static async recordSubmission(request, { submitterName, uploadResult, originalFile }) {
    const folder = await this.getOpenFolder(request);

    // Otherwise the file would point at a folder nobody can open, and the counter
    // update on a missing id would silently match nothing
    if (!folder) {
      await discardUploadedAsset(uploadResult);
      throw new Error("This request's destination folder is no longer available");
    }

    // Creates the row and moves the folder's counters together, so nothing is incremented twice here
    const fileDoc = await FileService.createFile(
      {
        name: originalFile.name,
        originalName: originalFile.name,
        mimeType: originalFile.type || "application/octet-stream",
        size: originalFile.size,
        extension: originalFile.name.split(".").pop()?.toLowerCase() || "",
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

    // The same person can send several files, so submitters counts people not uploads
    const isNewSubmitter = !(request.submissions || []).some(
      (submission) =>
        (submission.submitterName || "").toLowerCase() === submitterName.toLowerCase()
    );

    try {
      // One atomic update, where save() would overwrite a concurrent submitter's entry
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
      // The file is stored and counted, so failing here would only make the sender
      // upload it again; the entry is rebuildable from the file and this log
      console.error(
        `Submission ledger not updated for request ${request._id}, file ${fileDoc._id}:`,
        error.message
      );
    }

    return fileDoc;
  }
}