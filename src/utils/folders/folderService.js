import Folder from "@/models/Folder";

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

  static async softDeleteFolder(folderId, userId) {
    const folder = await Folder.findOne({
      _id: folderId,
      owner: userId,
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    folder.isDeleted = true;
    folder.deletedAt = new Date();
    await folder.save();

    await Folder.updateMany(
      { parentFolder: folderId },
      { isDeleted: true, deletedAt: new Date() }
    );

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

    folder.isDeleted = false;
    folder.deletedAt = null;
    await folder.save();

    return folder;
  }

  static async permanentDeleteFolder(folderId, userId) {
    const folder = await Folder.findOneAndDelete({
      _id: folderId,
      owner: userId,
      isDeleted: true,
    });

    if (!folder) {
      throw new Error("Folder not found or not in trash");
    }

    await Folder.deleteMany({ parentFolder: folderId });

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