import File from "@/models/File";
import Folder from "@/models/Folder";
import path from "path";
import fs from "fs/promises";

export class FileService {
  static async createFile(fileData, userId) {
    try {
      console.log('📝 Creating file with data:', fileData);
      
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
      console.error('Error creating file in DB:', error);
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

  static getFileExtension(filename) {
    return path.extname(filename).toLowerCase().substring(1);
  }

  static generateFilePath(userId, folderId, filename) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = this.getFileExtension(filename);
    const safeFilename = `${timestamp}-${randomStr}.${extension}`;

    // Create path: public/uploads/userId/folderId/filename
    const pathParts = [process.cwd(), 'public', 'uploads', userId.toString()];
    
    if (folderId) {
      pathParts.push(folderId.toString());
    }
    
    pathParts.push(safeFilename);

    return path.join(...pathParts);
  }

  static generateFileUrl(userId, folderId, filename) {
    const urlParts = ['/uploads', userId.toString()];
    
    if (folderId) {
      urlParts.push(folderId.toString());
    }
    
    urlParts.push(filename);

    return urlParts.join('/');
  }

  static async ensureUploadDirectory(userId, folderId = null) {
    const pathParts = [process.cwd(), 'public', 'uploads', userId.toString()];
    
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