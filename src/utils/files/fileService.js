import File from "@/models/File";
import Folder from "@/models/Folder";
import path from "path";
import fs from "fs/promises";

export class FileService {
  static async createFile(fileData, userId) {
    try {
      console.log("📝 Creating file with data:", fileData);

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
    const file = await File.findOne({
      _id: fileId,
      owner: userId,
    });

    return file;
  }

  static async updateFile(fileId, userId, updateData) {
    const file = await File.findOneAndUpdate(
      {
        _id: fileId,
        owner: userId,
        isDeleted: false,
      },
      updateData,
      { new: true, runValidators: true }
    );

    return file;
  }

  static async softDeleteFile(fileId, userId) {
    const file = await File.findOne({
      _id: fileId,
      owner: userId,
    });

    if (!file) {
      throw new Error("File not found");
    }

    file.isDeleted = true;
    file.deletedAt = new Date();
    await file.save();

    if (file.folder) {
      await Folder.findByIdAndUpdate(file.folder, {
        $inc: { filesCount: -1, totalSize: -file.size },
        lastActivity: new Date(),
      });
    }

    return file;
  }

  static async restoreFile(fileId, userId) {
    const file = await File.findOne({
      _id: fileId,
      owner: userId,
    });

    if (!file) {
      throw new Error("File not found");
    }

    file.isDeleted = false;
    file.deletedAt = null;
    await file.save();

    if (file.folder) {
      await Folder.findByIdAndUpdate(file.folder, {
        $inc: { filesCount: 1, totalSize: file.size },
        lastActivity: new Date(),
      });
    }

    return file;
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

    try {
      await fs.unlink(file.path);
    } catch (error) {
      console.error("Error deleting physical file:", error);
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

    if (oldFolderId) {
      await Folder.findByIdAndUpdate(oldFolderId, {
        $inc: { filesCount: -1, totalSize: -file.size },
        lastActivity: new Date(),
      });
    }

    if (newFolderId) {
      await Folder.findByIdAndUpdate(newFolderId, {
        $inc: { filesCount: 1, totalSize: file.size },
        lastActivity: new Date(),
      });
    }

    file.folder = newFolderId;
    await file.save();

    return file;
  }

  static async searchFiles(userId, searchQuery) {
    return await File.find({
      owner: userId,
      isDeleted: false,
      $text: { $search: searchQuery },
    }).sort({ score: { $meta: "textScore" } });
  }

  // Share a file/folder with a list of users (adds to sharedWith)
  static async shareItem(itemId, ownerId, { users = [], itemType = "file" } = {}) {
    const Model = itemType === "folder" ? Folder : File;

    const item = await Model.findOne({
      _id: itemId,
      owner: ownerId,
      isDeleted: false,
    });

    if (!item) {
      throw new Error(`${itemType} not found`);
    }

    // Ensure sharedWith is a real array before mutating it
    if (!Array.isArray(item.sharedWith)) {
      item.sharedWith = [];
    }

    // Track existing recipients to avoid duplicates
    const existingIds = new Set(
      item.sharedWith.map((s) => s.user?.toString())
    );

    let addedCount = 0;

    for (const u of users) {
      // Accept several shapes: { id }, { user }, or a raw id string
      const rawId =
        typeof u === "string" ? u : u?.id || u?.user || u?._id || "";
      const uid = rawId.toString().trim();

      // Skip empty ids, the owner, and users already granted access
      if (!uid || uid === ownerId.toString() || existingIds.has(uid)) {
        continue;
      }

      item.sharedWith.push({
        user: uid,
        permission: ["view", "edit", "admin"].includes(u?.permission)
          ? u.permission
          : "view",
        sharedAt: new Date(),
      });
      existingIds.add(uid);
      addedCount += 1;
    }

    // Tell mongoose the array changed (nested paths can miss auto-tracking)
    item.markModified("sharedWith");
    await item.save();

    console.log(
      `🔗 shareItem: added ${addedCount} user(s) to ${itemType} ${itemId}. sharedWith now has ${item.sharedWith.length}.`
    );

    return item;
  }

  // Get the list of users an item is currently shared with (populated)
  static async getItemShares(itemId, ownerId, { itemType = "file" } = {}) {
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

    // Shape each grant the way the share modal expects
    return (item.sharedWith || [])
      .filter((s) => s.user) // skip grants whose user was deleted
      .map((s) => ({
        id: s.user._id.toString(),
        name: s.user.name || "Unnamed",
        email: s.user.email || null,
        avatar: s.user.image || null,
        permission: s.permission || "view",
      }));
  }

  // Revoke sharing: owner clears all grants, a recipient removes only themselves
  static async unshareItem(itemId, userId, { itemType = "file" } = {}) {
    const Model = itemType === "folder" ? Folder : File;

    const item = await Model.findOne({ _id: itemId, isDeleted: false });
    if (!item) {
      throw new Error(`${itemType} not found`);
    }

    const isOwner = item.owner.toString() === userId.toString();

    if (isOwner) {
      // Owner revokes all access, so the item leaves everyone's Shared list
      item.sharedWith = [];
    } else {
      // Recipient leaves: drop only their own grant
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

  // Get files + folders that are shared with the user, or shared by the user
  static async getSharedItems(userId, options = {}) {
    const { filter = "recent" } = options;

    // An item is "shared" if the user was granted access,
    // or the user owns it and has actually shared it with someone
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

    const ownerPopulate = { path: "owner", select: "name email image" };

    const [files, folders] = await Promise.all([
      File.find(sharedQuery).populate(ownerPopulate).lean(),
      Folder.find(sharedQuery).populate(ownerPopulate).lean(),
    ]);

    // Flatten a file/folder doc into a single UI-friendly shape
    const normalize = (doc, type) => {
      const isOwner = doc.owner?._id?.toString() === userId.toString();

      // Use the grant time for shared-with-me items, else last update
      const myShare = doc.sharedWith?.find(
        (s) => s.user?.toString() === userId.toString()
      );
      const sharedAt = myShare?.sharedAt || doc.updatedAt;

      return {
        id: doc._id.toString(),
        type, // 'file' | 'folder'
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

    // Optional server-side filtering (UI also filters client-side)
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
        items = []; // Owned by the File Requests feature (built later)
        break;
      default:
        break;
    }

    // Most recently shared first
    items.sort((a, b) => new Date(b.sharedAt) - new Date(a.sharedAt));

    return items;
  }

  static getFileExtension(filename) {
    return path.extname(filename).toLowerCase().substring(1);
  }

  static generateFilePath(userId, folderId, filename) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = this.getFileExtension(filename);
    const safeFilename = `${timestamp}-${randomStr}.${extension}`;

    // Create path: public/uploads/userId/folderId/filename
    const pathParts = [process.cwd(), "public", "uploads", userId.toString()];

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
    const pathParts = [process.cwd(), "public", "uploads", userId.toString()];

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