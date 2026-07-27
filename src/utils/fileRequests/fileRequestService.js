import crypto from "crypto";
import FileRequest from "@/models/FileRequest";
import { hashPassword } from "@/utils/auth/hashPassword";

export class FileRequestService {
  // Create a new file request and generate its public token
  static async createRequest(data, ownerId) {
    const {
      title,
      description,
      folderId,
      hasDeadline,
      deadline, // { fullDateTime } | null
      hasPassword,
      passwordData, // { password } | null
    } = data;

    if (!title || !title.trim()) {
      throw new Error("Title is required");
    }
    if (!folderId) {
      throw new Error("Folder is required");
    }

    let hashedPassword = null;
    if (hasPassword && passwordData?.password) {
      hashedPassword = await hashPassword(passwordData.password);
    }

    const token = crypto.randomBytes(12).toString("hex");

    const request = await FileRequest.create({
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

    return request;
  }

  // List the owner's requests, optionally filtered by status
  static async getUserRequests(ownerId, { filter = "All" } = {}) {
    const query = { owner: ownerId };
    if (filter === "Opened") query.status = "opened";
    if (filter === "Closed") query.status = "closed";

    return await FileRequest.find(query).sort({ createdAt: -1 }).lean();
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

  // Permanently remove a request
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

  // Public info for the landing page (no owner/password data exposed)
  static async getPublicRequest(token) {
    const request = await FileRequest.findOne({ token }).lean();
    if (!request) {
      throw new Error("Request not found");
    }

    return {
      title: request.title,
      description: request.description,
      status: request.status,
      hasDeadline: request.hasDeadline,
      deadline: request.deadline,
    };
  }

  // Test-mode submission: just bumps counters, doesn't persist a real file yet
  static async recordTestSubmission(token) {
    const request = await FileRequest.findOne({ token });
    if (!request) {
      throw new Error("Request not found");
    }
    if (request.status === "closed") {
      throw new Error("This request is closed");
    }

    request.submittersCount = (request.submittersCount || 0) + 1;
    request.uploadsCount = (request.uploadsCount || 0) + 1;
    await request.save();

    return request;
  }
}