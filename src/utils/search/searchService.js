import File from "@/models/File";
import Folder from "@/models/Folder";

// Escapes user input so it can be used safely inside a regex
const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Enough to be useful in a dropdown without becoming a second file list
const RESULT_LIMIT = 8;

// Regex rather than the text index, which matches whole words only and so finds
// nothing until a search term is fully typed
export const searchEverything = async (userId, term) => {
    const pattern = new RegExp(escapeRegex(term), "i");

    const [folders, files] = await Promise.all([
        Folder.find({ owner: userId, isDeleted: false, name: pattern })
            .sort({ lastActivity: -1 })
            .limit(RESULT_LIMIT)
            .select("name filesCount subFoldersCount"),

        File.find({
            owner: userId,
            isDeleted: false,
            $or: [{ name: pattern }, { originalName: pattern }],
        })
            .sort({ updatedAt: -1 })
            .limit(RESULT_LIMIT)
            .select("name originalName extension mimeType size folder updatedAt"),
    ]);

    return {
        folders: folders.map((folder) => ({
            id: folder._id.toString(),
            name: folder.name,
            filesCount: folder.filesCount,
            subFoldersCount: folder.subFoldersCount,
        })),
        files: files.map((file) => ({
            id: file._id.toString(),
            name: file.originalName || file.name,
            extension: file.extension,
            mimeType: file.mimeType,
            size: file.size,
            // The folder is what a result needs to be opened in context
            folder: file.folder ? file.folder.toString() : null,
            updatedAt: file.updatedAt,
        })),
    };
};