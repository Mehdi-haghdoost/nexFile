import Membership from "@/models/Membership";
import Folder from "@/models/Folder";
import File from "@/models/File";

// Format a byte count for display
const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 MB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
};

export class ContentService {
  // Folders owned by any active member of this organization.
  // Note: folders belong to users, not organizations, so this aggregates
  // across the org's members rather than querying an org-owned collection.
  static async listContent(orgId, tab = "shared-folder") {
    const memberships = await Membership.find({
      organization: orgId,
      status: "active",
    })
      .select("user")
      .lean();

    const memberIds = memberships.map((m) => m.user);
    if (memberIds.length === 0) return [];

    // Member access has a different shape than the folder table; not supported yet
    if (tab === "member-access") return [];

    const query = { owner: { $in: memberIds }, isDeleted: false };

    if (tab === "shared-folder") {
      query["sharedWith.0"] = { $exists: true };
    } else if (tab === "archived") {
      query.isArchived = true;
    } else if (tab === "locked-files") {
      query["shareLink.isPasswordEnabled"] = true;
    }
    // 'team-folder' falls through: every folder across the organization

    const folders = await Folder.find(query)
      .populate({ path: "owner", select: "name email image" })
      .sort({ updatedAt: -1 })
      .lean();

    // Compute each folder's real size from its non-deleted files
    const rows = await Promise.all(
      folders
        .filter((f) => f.owner)
        .map(async (f) => {
          const result = await File.aggregate([
            { $match: { folder: f._id, isDeleted: false } },
            { $group: { _id: null, total: { $sum: "$size" } } },
          ]);

          return {
            id: f._id.toString(),
            folder: f.name,
            name: f.owner.name || f.owner.email,
            avatar: f.owner.image || null,
            storageUsage: formatBytes(result[0]?.total || 0),
            lastModified: f.updatedAt,
            isArchived: Boolean(f.isArchived),
          };
        })
    );

    return rows;
  }

  // Archive or unarchive a folder
  static async setArchived(folderId, isArchived) {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      throw new Error("Folder not found");
    }

    folder.isArchived = isArchived;
    await folder.save();
    return folder;
  }
}