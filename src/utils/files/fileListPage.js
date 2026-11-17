import mongoose from "mongoose";
import File from "@/models/File";
import Folder from "@/models/Folder";

// Files per page of a file list; Load more asks for the next page
export const FILE_PAGE_SIZE = 30;

// Largest page a client may ask for
const MAX_FILE_PAGE_SIZE = 100;

// The Recent filter covers files changed within this many days
const RECENT_DAYS = 7;

// Longest search text used; anything longer is cut rather than refused
const MAX_SEARCH_LENGTH = 100;

const DAY_MS = 24 * 60 * 60 * 1000;

// The stored field behind each sort option; Type orders by name, since every item in this list is a file
const SORT_FIELDS = { name: "name", type: "name", date: "updatedAt", size: "size" };

// Names are compared without letter case, the same way the list compares them
const NAME_COLLATION = { locale: "en", strength: 2 };

// Treats the search text as plain characters, so symbols such as "(" or "." match themselves
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Reads the list options from a query string, falling back to the list's defaults
export const readFileListOptions = (searchParams) => {
  const sort = searchParams.get("sort") || "";
  const limit = Math.floor(Number(searchParams.get("limit")));

  return {
    sortBy: Object.hasOwn(SORT_FIELDS, sort) ? sort : "name",
    sortOrder: searchParams.get("order") === "desc" ? "desc" : "asc",
    recent: searchParams.get("recent") === "1",
    starred: searchParams.get("starred") === "1",
    search: (searchParams.get("search") || "").trim().slice(0, MAX_SEARCH_LENGTH),
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, MAX_FILE_PAGE_SIZE) : FILE_PAGE_SIZE,
  };
};

// The position after the last file shown: its sort value and id, so ties are neither skipped nor repeated
const encodeFileCursor = (file, field) => {
  const value = file[field] instanceof Date ? file[field].getTime() : file[field] ?? null;
  return Buffer.from(JSON.stringify([value, file._id.toString()])).toString("base64url");
};

// Reads a cursor back for the given sort, or null when it is not one this list produced for that sort
export const parseFileCursor = (cursor, sortBy) => {
  try {
    const decoded = JSON.parse(Buffer.from(String(cursor), "base64url").toString("utf8"));
    if (!Array.isArray(decoded) || decoded.length !== 2) return null;

    const [value, id] = decoded;
    if (typeof id !== "string" || !/^[a-f0-9]{24}$/i.test(id)) return null;

    // A file missing its sort value is stored as null, which still pages correctly
    const field = SORT_FIELDS[sortBy] || "name";
    const isValidValue = value === null || (field === "name" ? typeof value === "string" : Number.isFinite(value));
    if (!isValidValue) return null;

    return {
      value: field === "updatedAt" && value !== null ? new Date(value) : value,
      id: new mongoose.Types.ObjectId(id),
    };
  } catch {
    return null;
  }
};

// Files after the cursor in the list's direction, with the id breaking ties between equal values
const pastCursor = (field, direction, after) => {
  const op = direction === 1 ? "$gt" : "$lt";
  const tie = { [field]: after.value, _id: { [op]: after.id } };

  // A missing value sorts before every other one and never passes a greater-than or less-than test, so it is matched directly
  if (after.value === null) return direction === 1 ? [{ [field]: { $ne: null } }, tie] : [tie];
  if (direction === 1) return [{ [field]: { $gt: after.value } }, tie];
  return [{ [field]: { $lt: after.value } }, tie, { [field]: null }];
};

// One page of the owner's files: one folder's when a folder is given, otherwise every folder's
export const getFileListPage = async (
  ownerId,
  {
    folderId = null,
    sortBy = "name",
    sortOrder = "asc",
    recent = false,
    starred = false,
    search = "",
    after = null,
    limit = FILE_PAGE_SIZE,
    now = new Date(),
  } = {}
) => {
  const field = SORT_FIELDS[sortBy] || "name";
  const direction = sortOrder === "desc" ? -1 : 1;

  const conditions = [{ owner: ownerId, isDeleted: false }];
  if (folderId) conditions.push({ folder: folderId });
  if (recent) conditions.push({ updatedAt: { $gte: new Date(now.getTime() - RECENT_DAYS * DAY_MS) } });
  if (starred) conditions.push({ isStarred: true });

  const text = search.trim().slice(0, MAX_SEARCH_LENGTH);
  if (text) {
    const pattern = new RegExp(escapeRegex(text), "i");
    const matches = [{ name: pattern }, { extension: pattern }];

    // Across all folders a file is also found by the name of the folder it is in
    if (!folderId) {
      const folderIds = await Folder.distinct("_id", { owner: ownerId, isDeleted: false, name: pattern });
      if (folderIds.length) matches.push({ folder: { $in: folderIds } });
    }

    conditions.push({ $or: matches });
  }

  const pageConditions = [...conditions];
  if (after) pageConditions.push({ $or: pastCursor(field, direction, after) });

  // One extra file shows whether another page exists
  let query = File.find({ $and: pageConditions })
    .sort({ [field]: direction, _id: direction })
    .limit(limit + 1);

  if (field === "name") query = query.collation(NAME_COLLATION);

  // Only the all-folders list needs each file's folder name
  if (!folderId) query = query.populate("folder", "name");

  // The total is counted once, on the first page
  const [found, total] = await Promise.all([
    query.lean(),
    after ? null : File.countDocuments({ $and: conditions }),
  ]);

  const files = found.slice(0, limit);

  return {
    files,
    nextCursor: found.length > limit ? encodeFileCursor(files[files.length - 1], field) : null,
    total,
  };
};