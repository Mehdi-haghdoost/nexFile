import Folder from "@/models/Folder";
import File from "@/models/File";
import cloudinary from "@/lib/cloudinary";

export class FolderService {
  static async createFolder(folderData, userId) {
    const folder = await Folder.create({
      ...folderData,
      owner: userId,
    });

    if (folder.parentFolder) {
      await Folder.findByIdAndUpdate(folder.parentFolder, {
        $inc: { subFoldersCount: 1 },
        lastActivity: new Date(),
      });
    }

    return folder;
  }

  static async getUserFolders(userId, options = {}) {
    const { parentFolder = null, includeDeleted = false } = options;

    const query = {
      owner: userId,
      parentFolder,
    };

    if (!includeDeleted) {
      query.isDeleted = false;
    }

    return await Folder.find(query).sort({ createdAt: -1 });
  }

  static async getFolderById(folderId, userId) {
    const folder = await Folder.findOne({
      _id: folderId,
      owner: userId,
    });

    return folder;
  }

  static async updateFolder(folderId, userId, updateData) {
    const folder = await Folder.findOneAndUpdate(
      {
        _id: folderId,
        owner: userId,
        isDeleted: false,
      },
      {
        ...updateData,
        lastActivity: new Date(),
      },
      { new: true, runValidators: true }
    );

    return folder;
  }

  // Walks the tree level by level, so a deletion reaches every depth rather than only the children
  static async getDescendantFolderIds(folderId) {
    const collected = [];
    let frontier = [folderId];

    while (frontier.length) {
      const children = await Folder.find({ parentFolder: { $in: frontier } }).select("_id");
      if (!children.length) break;

      const childIds = children.map((child) => child._id);
      collected.push(...childIds);
      frontier = childIds;
    }

    return collected;
  }

  static async softDeleteFolder(folderId, userId) {
    const folder = await Folder.findOne({
      _id: folderId,
      owner: userId,
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    // One timestamp across the whole cascade, which restore later uses to undo exactly this delete
    const deletedAt = new Date();
    const descendants = await this.getDescendantFolderIds(folderId);
    const allFolderIds = [folder._id, ...descendants];

    await Folder.updateMany(
      { _id: { $in: allFolderIds } },
      { isDeleted: true, deletedAt }
    );

    // Files were left untouched before, so they survived their folder and became unreachable
    await File.updateMany(
      { folder: { $in: allFolderIds }, owner: userId, isDeleted: false },
      { isDeleted: true, deletedAt }
    );

    if (folder.parentFolder) {
      await Folder.findByIdAndUpdate(folder.parentFolder, {
        $inc: { subFoldersCount: -1 },
        lastActivity: new Date(),
      });
    }

    folder.isDeleted = true;
    folder.deletedAt = deletedAt;

    return folder;
  }

  static async restoreFolder(folderId, userId) {
    const folder = await Folder.findOne({
      _id: folderId,
      owner: userId,
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    const { deletedAt } = folder;
    const descendants = await this.getDescendantFolderIds(folderId);
    const allFolderIds = [folder._id, ...descendants];

    // Only what this delete removed comes back, so a file deleted on its own earlier stays in the trash
    if (deletedAt) {
      await Folder.updateMany(
        { _id: { $in: allFolderIds }, deletedAt },
        { isDeleted: false, deletedAt: null }
      );

      await File.updateMany(
        { folder: { $in: allFolderIds }, owner: userId, deletedAt },
        { isDeleted: false, deletedAt: null }
      );
    }

    if (folder.parentFolder) {
      await Folder.findByIdAndUpdate(folder.parentFolder, {
        $inc: { subFoldersCount: 1 },
        lastActivity: new Date(),
      });
    }

    folder.isDeleted = false;
    folder.deletedAt = null;

    return folder;
  }

  // Reports which assets survived, since Cloudinary resolves with a status rather than throwing
  static async destroyFolderAssets(fileDocs) {
    const stored = fileDocs.filter((file) => file.cloudinaryId);

    const results = await Promise.allSettled(
      stored.map((file) =>
        cloudinary.uploader.destroy(file.cloudinaryId, {
          resource_type: file.metadata?.resourceType || "raw",
        })
      )
    );

    const failed = [];

    results.forEach((result, index) => {
      const file = stored[index];

      if (result.status === "rejected") {
        console.error(
          `Cloudinary destroy failed for ${file.name}:`,
          result.reason?.message || result.reason
        );
        failed.push(file);
        return;
      }

      // An asset that is already gone counts as removed
      const outcome = result.value?.result;

      if (outcome !== "ok" && outcome !== "not found") {
        console.error(`Cloudinary destroy returned '${outcome}' for ${file.name}`);
        failed.push(file);
      }
    });

    return { attempted: stored.length, failed };
  }

  static async permanentDeleteFolder(folderId, userId) {
    const folder = await Folder.findOne({
      _id: folderId,
      owner: userId,
      isDeleted: true,
    });

    if (!folder) {
      throw new Error("Folder not found or not in trash");
    }

    const descendants = await this.getDescendantFolderIds(folderId);
    const allFolderIds = [folder._id, ...descendants];

    const files = await File.find({ folder: { $in: allFolderIds }, owner: userId });
    const { attempted, failed } = await this.destroyFolderAssets(files);

    // Nothing is removed while an asset survives, so a retry can still reach it
    if (failed.length > 0) {
      throw new Error(
        `Could not remove ${failed.length} of ${attempted} stored files in "${folder.name}". Please try again.`
      );
    }

    await File.deleteMany({ folder: { $in: allFolderIds }, owner: userId });
    await Folder.deleteMany({ _id: { $in: allFolderIds } });

    return folder;
  }

  static async searchFolders(userId, searchQuery) {
    return await Folder.find({
      owner: userId,
      isDeleted: false,
      $text: { $search: searchQuery },
    }).sort({ score: { $meta: "textScore" } });
  }

  static checkAccess(folder, userId, requiredPermission = "view") {
    if (folder.owner.toString() === userId.toString()) {
      return true;
    }

    if (folder.accessType === "regular") {
      return true;
    }

    const userPermission = folder.sharedWith.find(
      (share) => share.user.toString() === userId.toString()
    );

    if (!userPermission) {
      return false;
    }

    const permissionLevels = {
      view: 1,
      edit: 2,
      admin: 3,
    };

    return (
      permissionLevels[userPermission.permission] >=
      permissionLevels[requiredPermission]
    );
  }

  static async getFolderPath(folderId) {
    const path = [];
    let currentFolder = await Folder.findById(folderId);

    while (currentFolder) {
      path.unshift({
        id: currentFolder._id,
        name: currentFolder.name,
      });

      if (!currentFolder.parentFolder) break;

      currentFolder = await Folder.findById(currentFolder.parentFolder);
    }

    return path;
  }
}