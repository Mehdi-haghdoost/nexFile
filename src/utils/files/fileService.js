
import File from "@/models/File";
import Folder from "@/models/Folder";
import path from "path";
import fs from "fs/promises";
import cloudinary from "@/lib/cloudinary";
import { FolderService } from "@/utils/folders/folderService";
import { LinkPolicy } from "@/utils/files/linkPolicy";

export class FileService {
  static async createFile(fileData, userId) {
    try {
      const file = await File.create({
        ...fileData,
        owner: userId,
      });

      if (file.folder) {
        await Folder.findByIdAndUpdate(file.folder, {
          $inc: { filesCount: 1, totalSize: file.size },
          lastActivity: new Date(),
        });
      }

      return file;
    } catch (error) {
      console.error("Error creating file in DB:", error);
      throw error;
    }
  }

  static async getUserFiles(userId, options = {}) {
    const { folder = null, includeDeleted = false } = options;

    const query = {
      owner: userId,
      folder,
    };

    if (!includeDeleted) {
      query.isDeleted = false;
    }

    return await File.find(query).sort({ createdAt: -1 });
  }

  static async getFileById(fileId, userId) {
    return await File.findOne({
      _id: fileId,
      owner: userId,
    });
  }

  static async updateFile(fileId, userId, updateData) {
    return await File.findOneAndUpdate(
      {
        _id: fileId,
        owner: userId,
        isDeleted: false,
      },
      updateData,
      { new: true, runValidators: true }
    );
  }

  static async softDeleteFile(fileId, userId) {
    const file = await File.findOneAndUpdate(
      {
        _id: fileId,
        owner: userId,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!file) {
      const existingFile = await File.findOne({
        _id: fileId,
        owner: userId,
      });

      if (!existingFile) {
        throw new Error("File not found");
      }

      return existingFile;
    }

    if (file.folder) {
      try {
        await Folder.findByIdAndUpdate(file.folder, {
          $inc: { filesCount: -1, totalSize: -file.size },
          lastActivity: new Date(),
        });
      } catch (error) {
        console.error(
          `Folder ${file.folder} not decremented for file ${file._id}:`,
          error.message
        );
      }
    }

    return file;
  }

  static async restoreFile(fileId, userId) {
    const file = await File.findOneAndUpdate(
      {
        _id: fileId,
        owner: userId,
        isDeleted: true,
      },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
        },
      },
      { new: true }
    );

    if (!file) {
      const existingFile = await File.findOne({
        _id: fileId,
        owner: userId,
      });

      if (!existingFile) {
        throw new Error("File not found");
      }

      return existingFile;
    }

    if (file.folder) {
      await Folder.findByIdAndUpdate(file.folder, {
        $inc: { filesCount: 1, totalSize: file.size },
        lastActivity: new Date(),
      });
    }

    return file;
  }

  static async destroyFileAsset(file) {
    if (!file.cloudinaryId) return { ok: true };

    try {
      const result = await cloudinary.uploader.destroy(file.cloudinaryId, {
        resource_type: file.metadata?.resourceType || "raw",
      });

      if (result?.result === "ok" || result?.result === "not found") {
        return { ok: true };
      }

      console.error(
        `Cloudinary destroy returned '${result?.result}' for ${file.name}`
      );

      return { ok: false, reason: result?.result || "unknown" };
    } catch (error) {
      console.error(
        `Cloudinary destroy failed for ${file.name}:`,
        error.message
      );

      return { ok: false, reason: error.message };
    }
  }

  static async permanentDeleteFile(fileId, userId) {
    const file = await File.findOne({
      _id: fileId,
      owner: userId,
      isDeleted: true,
    });

    if (!file) {
      throw new Error("File not found or not in trash");
    }

    const destroyed = await this.destroyFileAsset(file);

    if (!destroyed.ok) {
      throw new Error(
        `Could not remove ${file.name} from storage. Please try again.`
      );
    }

    await File.findByIdAndDelete(fileId);

    return file;
  }

  static async moveFile(fileId, userId, newFolderId) {
    const file = await File.findOne({
      _id: fileId,
      owner: userId,
      isDeleted: false,
    });

    if (!file) {
      throw new Error("File not found");
    }

    const oldFolderId = file.folder;
    const targetFolderId = newFolderId || null;

    // Validate the destination folder before moving the file
    if (targetFolderId) {
      const targetFolder = await Folder.findOne({
        _id: targetFolderId,
        owner: userId,
        isDeleted: false,
      });

      if (!targetFolder) {
        throw new Error("Destination folder not found");
      }
    }

    // Avoid changing counters when the file is already in the target folder
    if (
      (oldFolderId?.toString() || null) ===
      (targetFolderId?.toString() || null)
    ) {
      return file;
    }

   

    // Move only if the file is still in its original folder
    const moved = await File.findOneAndUpdate(
      {
        _id: fileId,
        owner: userId,
        isDeleted: false,
        folder: oldFolderId ?? null,
      },
      {
        $set: { folder: targetFolderId },
      },
      { new: true }
    );

   
    if (!moved) {
      throw new Error("File was moved by another request");
    }

    // Log counter failures instead of reporting the completed move as failed
    try {
      if (oldFolderId) {
        await Folder.findByIdAndUpdate(oldFolderId, {
          $inc: {
            filesCount: -1,
            totalSize: -moved.size,
          },
          lastActivity: new Date(),
        });
      }

      if (targetFolderId) {
        await Folder.findByIdAndUpdate(targetFolderId, {
          $inc: {
            filesCount: 1,
            totalSize: moved.size,
          },
          lastActivity: new Date(),
        });
      }
    } catch (error) {
      console.error(
        `Counters not moved for file ${moved._id} from ${oldFolderId} to ${targetFolderId}:`,
        error.message
      );
    }

    return moved;
  }

  static async searchFiles(userId, searchQuery) {
    return await File.find({
      owner: userId,
      isDeleted: false,
      $text: { $search: searchQuery },
    }).sort({ score: { $meta: "textScore" } });
  }

  static async shareItem(
    itemId,
    ownerId,
    { users = [], itemType = "file" } = {}
  ) {
    const Model = itemType === "folder" ? Folder : File;

    const item = await Model.findOne({
      _id: itemId,
      owner: ownerId,
      isDeleted: false,
    });

    if (!item) {
      throw new Error(`${itemType} not found`);
    }

    if (!Array.isArray(item.sharedWith)) {
      item.sharedWith = [];
    }

    const requested = users
      .map((u) => {
        const rawId =
          typeof u === "string" ? u : u?.id || u?.user || u?._id || "";

        return {
          id: rawId.toString().trim(),
          permission: u?.permission,
        };
      })
      .filter((u) => u.id);

    const { allowed, blocked, policy } =
      await LinkPolicy.filterRecipients(
        ownerId,
        requested.map((u) => u.id)
      );

    if (blocked?.length > 0 && allowed.length === 0) {
      throw new Error(
        `Your organization's external sharing policy (${policy}) only allows sharing with organization members`
      );
    }

    const allowedSet = new Set(allowed.map((id) => id.toString()));
    const existingIds = new Set(
      item.sharedWith.map((s) => s.user?.toString())
    );

    let addedCount = 0;

    for (const u of requested) {
      if (
        u.id === ownerId.toString() ||
        existingIds.has(u.id) ||
        !allowedSet.has(u.id)
      ) {
        continue;
      }

      item.sharedWith.push({
        user: u.id,
        permission: ["view", "edit", "admin"].includes(u.permission)
          ? u.permission
          : "view",
        sharedAt: new Date(),
      });

      existingIds.add(u.id);
      addedCount += 1;
    }

    item.markModified("sharedWith");
    await item.save();

    return {
      item,
      addedCount,
      blockedCount: blocked?.length || 0,
    };
  }

  static async getItemShares(
    itemId,
    ownerId,
    { itemType = "file" } = {}
  ) {
    const Model = itemType === "folder" ? Folder : File;

    const item = await Model.findOne({
      _id: itemId,
      owner: ownerId,
      isDeleted: false,
    })
      .populate({ path: "sharedWith.user", select: "name email image" })
      .lean();

    if (!item) {
      throw new Error(`${itemType} not found`);
    }

    return (item.sharedWith || [])
      .filter((s) => s.user)
      .map((s) => ({
        id: s.user._id.toString(),
        name: s.user.name || "Unnamed",
        email: s.user.email || null,
        avatar: s.user.image || null,
        permission: s.permission || "view",
      }));
  }

  static async unshareItem(
    itemId,
    userId,
    { itemType = "file" } = {}
  ) {
    const Model = itemType === "folder" ? Folder : File;

    const item = await Model.findOne({
      _id: itemId,
      isDeleted: false,
    });

    if (!item) {
      throw new Error(`${itemType} not found`);
    }

    const isOwner = item.owner.toString() === userId.toString();

    if (isOwner) {
      item.sharedWith = [];
    } else {
      const before = item.sharedWith.length;

      item.sharedWith = item.sharedWith.filter(
        (s) => s.user?.toString() !== userId.toString()
      );

      if (item.sharedWith.length === before) {
        throw new Error("You do not have access to this item");
      }
    }

    item.markModified("sharedWith");
    await item.save();

    return item;
  }

  static async getSharedItems(userId, options = {}) {
    const { filter = "recent" } = options;

    const sharedQuery = {
      isDeleted: false,
      $or: [
        { "sharedWith.user": userId },
        {
          owner: userId,
          "sharedWith.0": { $exists: true },
        },
      ],
    };

    const ownerPopulate = {
      path: "owner",
      select: "name email image",
    };

    const [files, folders] = await Promise.all([
      File.find(sharedQuery).populate(ownerPopulate).lean(),
      Folder.find(sharedQuery).populate(ownerPopulate).lean(),
    ]);

    const normalize = (doc, type) => {
      const isOwner =
        doc.owner?._id?.toString() === userId.toString();

      const myShare = doc.sharedWith?.find(
        (s) => s.user?.toString() === userId.toString()
      );

      const sharedAt = myShare?.sharedAt || doc.updatedAt;

      return {
        id: doc._id.toString(),
        type,
        name: doc.name,
        extension: type === "file" ? doc.extension : null,
        mimeType: type === "file" ? doc.mimeType : null,
        thumbnailUrl: type === "file" ? doc.thumbnailUrl : null,
        url: type === "file" ? doc.url : null,
        secureUrl: type === "file" ? doc.secureUrl : null,
        isOwner,
        hasLink: Boolean(doc.shareLink?.url),
        accessLevel: doc.shareLink?.accessLevel || null,
        sharedBy: isOwner
          ? { name: "You", email: null, image: null }
          : {
            name: doc.owner?.name || "Unknown",
            email: doc.owner?.email || null,
            image: doc.owner?.image || null,
          },
        sharedAt,
        createdAt: doc.createdAt,
      };
    };

    let items = [
      ...files.map((f) => normalize(f, "file")),
      ...folders.map((f) => normalize(f, "folder")),
    ];

    switch (filter) {
      case "files":
        items = items.filter((i) => i.type === "file");
        break;
      case "folders":
        items = items.filter((i) => i.type === "folder");
        break;
      case "links":
        items = items.filter((i) => i.hasLink);
        break;
      case "requests":
        items = [];
        break;
      default:
        break;
    }

    items.sort(
      (a, b) => new Date(b.sharedAt) - new Date(a.sharedAt)
    );

    return items;
  }

  static async getDeletedItems(userId) {
    const query = {
      owner: userId,
      isDeleted: true,
    };

    const [files, folders] = await Promise.all([
      File.find(query)
        .populate({ path: "folder", select: "name isDeleted" })
        .lean(),
      Folder.find(query).lean(),
    ]);

    const fileType = (ext) => {
      const e = (ext || "").toLowerCase();

      if (
        ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(e)
      ) {
        return "photo";
      }

      if (
        ["mp4", "mov", "avi", "mkv", "webm"].includes(e)
      ) {
        return "video";
      }

      return "file";
    };

    const standaloneFiles = files.filter(
      (f) => !f.folder?.isDeleted
    );

    const mappedFiles = standaloneFiles.map((f) => ({
      id: f._id.toString(),
      itemType: "file",
      name: f.name,
      type: fileType(f.extension),
      folder: f.folder?.name || "Root",
      category: f.extension ? f.extension.toUpperCase() : "File",
      deletedAt: f.deletedAt,
    }));

    const deletedFolderIds = new Set(
      folders.map((folder) => folder._id.toString())
    );

    const topLevelDeletedFolders = folders.filter(
      (folder) =>
        !folder.parentFolder ||
        !deletedFolderIds.has(folder.parentFolder.toString())
    );

    const mappedFolders = topLevelDeletedFolders.map((f) => ({
      id: f._id.toString(),
      itemType: "folder",
      name: f.name,
      type: "folder",
      folder: "Folder",
      category: "Folder",
      deletedAt: f.deletedAt,
    }));

    return [...mappedFiles, ...mappedFolders].sort(
      (a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)
    );
  }

  static async restoreFolder(folderId, userId) {
    return FolderService.restoreFolder(folderId, userId);
  }

  static async permanentDeleteFolder(folderId, userId) {
    return FolderService.permanentDeleteFolder(folderId, userId);
  }

  static getFileExtension(filename) {
    return path.extname(filename).toLowerCase().substring(1);
  }

  static generateFilePath(userId, folderId, filename) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = this.getFileExtension(filename);
    const safeFilename = `${timestamp}-${randomStr}.${extension}`;

    const pathParts = [
      process.cwd(),
      "public",
      "uploads",
      userId.toString(),
    ];

    if (folderId) {
      pathParts.push(folderId.toString());
    }

    pathParts.push(safeFilename);

    return path.join(...pathParts);
  }

  static generateFileUrl(userId, folderId, filename) {
    const urlParts = ["/uploads", userId.toString()];

    if (folderId) {
      urlParts.push(folderId.toString());
    }

    urlParts.push(filename);

    return urlParts.join("/");
  }

  static async ensureUploadDirectory(userId, folderId = null) {
    const pathParts = [
      process.cwd(),
      "public",
      "uploads",
      userId.toString(),
    ];

    if (folderId) {
      pathParts.push(folderId.toString());
    }

    const uploadDir = path.join(...pathParts);

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    return uploadDir;
  }
}
