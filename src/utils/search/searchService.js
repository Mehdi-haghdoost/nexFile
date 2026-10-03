import File from "@/models/File";
import Folder from "@/models/Folder";

// Escapes user input so it can be used safely inside a regex
const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Enough to be useful in a dropdown without becoming a second file list
const RESULT_LIMIT = 8;

// Resolves a folder's ancestry from one pass over the user's folders, rather
// than a query per level as walking the tree would need
const buildPathResolver = async (userId) => {
    const folders = await Folder.find({ owner: userId, isDeleted: false })
        .select("name parentFolder")
        .lean();

    const byId = new Map(folders.map((folder) => [folder._id.toString(), folder]));

    return (folderId) => {
        const path = [];
        let current = folderId ? byId.get(folderId.toString()) : null;

        // Bounded by the folder count, so bad data cannot produce an endless loop
        while (current && path.length <= byId.size) {
            path.unshift({ id: current._id.toString(), name: current.name });
            current = current.parentFolder ? byId.get(current.parentFolder.toString()) : null;
        }

        return path;
    };
};

// Regex rather than the text index, which matches whole words only and so finds
// nothing until a search term is fully typed
export const searchEverything = async (userId, term) => {
    const pattern = new RegExp(escapeRegex(term), "i");

    const [folders, files, resolvePath] = await Promise.all([
        Folder.find({ owner: userId, isDeleted: false, name: pattern })
            .sort({ lastActivity: -1 })
            .limit(RESULT_LIMIT)
            .select("name parentFolder filesCount subFoldersCount"),

        File.find({
            owner: userId,
            isDeleted: false,
            $or: [{ name: pattern }, { originalName: pattern }],
        })
            .sort({ updatedAt: -1 })
            .limit(RESULT_LIMIT)
            .select("name originalName extension mimeType size folder updatedAt"),

        buildPathResolver(userId),
    ]);

    return {
        folders: folders.map((folder) => ({
            id: folder._id.toString(),
            name: folder.name,
            filesCount: folder.filesCount,
            subFoldersCount: folder.subFoldersCount,
            // Where the folder sits, which a result outside the current view needs
            path: resolvePath(folder.parentFolder),
        })),
        files: files.map((file) => ({
            id: file._id.toString(),
            name: file.originalName || file.name,
            extension: file.extension,
            mimeType: file.mimeType,
            size: file.size,
            // The folder is what a result needs to be opened in context
            folder: file.folder ? file.folder.toString() : null,
            path: resolvePath(file.folder),
            updatedAt: file.updatedAt,
        })),
    };
};