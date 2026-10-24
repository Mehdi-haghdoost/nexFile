import Folder from "@/models/Folder";
import File from "@/models/File";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";


export class FolderService {
  static async createFolder(folderData, userId) {
    // Reject a missing, foreign or trashed parent before anything is written
    if (folderData.parentFolder) {
      const parent = await Folder.findOne({
        _id: folderData.parentFolder,
        owner: userId,
        isDeleted: false,
      }).select("_id");

      if (!parent) {
        throw new Error("Parent folder not found");
      }
    }

    const folder = await Folder.create({
      ...folderData,
      owner: userId,
    });

    // Count the child only on an active parent owned by the caller
    if (folder.parentFolder) {
      await Folder.updateOne(
        {
          _id: folder.parentFolder,
          owner: userId,
          isDeleted: false,
        },
        {
          $inc: { subFoldersCount: 1 },
          $set: { lastActivity: new Date() },
        }
      );
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

  // Walks the caller's own tree level by level, so a deletion reaches every depth but never another owner's folders
  static async getDescendantFolderIds(folderId, userId) {
    // Refuse to search across owners when the caller is unknown
    if (!userId) {
      throw new Error("userId is required to list descendant folders");
    }

    const collected = [];
    let frontier = [folderId];

    while (frontier.length) {
      const children = await Folder.find({
        parentFolder: { $in: frontier },
        owner: userId,
      }).select("_id");
      if (!children.length) break;

      const childIds = children.map((child) => child._id);
      collected.push(...childIds);
      frontier = childIds;
    }

    return collected;
  }

  // Derives a folder's counters from its active files and subfolders without writing anything
  static async computeFolderCounters(folderId, userId) {
    const folderObjectId = new mongoose.Types.ObjectId(folderId.toString());
    const ownerId = new mongoose.Types.ObjectId(userId.toString());

    const [fileStats, subFoldersCount] = await Promise.all([
      File.aggregate([
        {
          $match: {
            folder: folderObjectId,
            owner: ownerId,
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,
            filesCount: { $sum: 1 },
            totalSize: { $sum: "$size" },
          },
        },
      ]),
      Folder.countDocuments({
        parentFolder: folderObjectId,
        owner: ownerId,
        isDeleted: false,
      }),
    ]);

    const stats = fileStats[0] || {
      filesCount: 0,
      totalSize: 0,
    };

    return {
      filesCount: stats.filesCount,
      totalSize: stats.totalSize,
      subFoldersCount,
    };
  }

  static async recalculateFolderCounters(folderIds, userId) {
    const uniqueFolderIds = [
      ...new Set(folderIds.map((id) => id.toString())),
    ];

    const ownerId = new mongoose.Types.ObjectId(userId.toString());

    for (const folderId of uniqueFolderIds) {
      const counters = await this.computeFolderCounters(folderId, userId);

      await Folder.updateOne(
        {
          _id: new mongoose.Types.ObjectId(folderId),
          owner: ownerId,
        },
        {
          $set: counters,
          $currentDate: { lastActivity: true },
        }
      );
    }
  }

static async softDeleteFolder(folderId, userId) {
  const folder = await Folder.findOne({
    _id: folderId,
    owner: userId,
  });

  if (!folder) {
    throw new Error("Folder not found");
  }

  // Prevent repeated deletion from corrupting counters
  if (folder.isDeleted) {
    return folder;
  }

  const deletedAt = new Date();
  const descendants = await this.getDescendantFolderIds(folderId, userId);
  const allFolderIds = [folder._id, ...descendants];

  // Delete only active folders so previously deleted folders keep their original timestamp
  await Folder.updateMany(
    {
      _id: { $in: allFolderIds },
      owner: userId,
      isDeleted: false,
    },
    {
      $set: { isDeleted: true, deletedAt },
    }
  );

  // Soft-delete active files belonging to this folder tree
  await File.updateMany(
    {
      folder: { $in: allFolderIds },
      owner: userId,
      isDeleted: false,
    },
    {
      $set: { isDeleted: true, deletedAt },
    }
  );

  // Recalculate counters from actual database records
  await this.recalculateFolderCounters(allFolderIds, userId);

  if (folder.parentFolder) {
    await this.recalculateFolderCounters([folder.parentFolder], userId);
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

  // Prevent repeated restoration from corrupting counters
  if (!folder.isDeleted) {
    return folder;
  }

  const { deletedAt } = folder;
  const descendants = await this.getDescendantFolderIds(folderId, userId);
  const allFolderIds = [folder._id, ...descendants];

  // Restore only folders deleted by this specific cascade
  if (deletedAt) {
    await Folder.updateMany(
      {
        _id: { $in: allFolderIds },
        owner: userId,
        isDeleted: true,
        deletedAt,
      },
      {
        $set: { isDeleted: false, deletedAt: null },
      }
    );

    // Files deleted independently before the folder deletion remain in the trash
    await File.updateMany(
      {
        folder: { $in: allFolderIds },
        owner: userId,
        isDeleted: true,
        deletedAt,
      },
      {
        $set: { isDeleted: false, deletedAt: null },
      }
    );
  }

  // Rebuild counters for the restored tree and its parent
  await this.recalculateFolderCounters(allFolderIds, userId);

  if (folder.parentFolder) {
    await this.recalculateFolderCounters([folder.parentFolder], userId);
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

    const descendants = await this.getDescendantFolderIds(folderId, userId);
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
    await Folder.deleteMany({ _id: { $in: allFolderIds }, owner: userId });

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