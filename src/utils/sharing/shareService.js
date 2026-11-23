import File from "@/models/File";
import Folder from "@/models/Folder";
import User from "@/models/User";
import { LinkPolicy } from "@/utils/files/linkPolicy";
import {
  MAX_FOLDER_DEPTH,
  OWNER_ROLE,
  SHARE_ACTIONS,
  SHARE_ROLES,
  canGrantRole,
  canPerform,
  getControlLevel,
  getDirectRole,
  getItemAccess,
  isValidObjectId,
  roleAtLeast,
  strongerRole,
} from "@/utils/sharing/sharingAccess";

// Most people one request may add, so a single call cannot flood an item's list
export const MAX_RECIPIENTS = 20;

export const NOTE_MAX_LENGTH = 500;

// Most shared items the Notices feed looks at before keeping the newest
const NOTICE_SCAN_LIMIT = 50;
const NOTICE_LIMIT = 20;

const ITEM_TYPES = ["file", "folder"];

const NO_PERMISSION = "You don't have permission to do that";

// A refusal with the status to answer and a message safe to show as it is
export class ShareError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const sameId = (a, b) => a != null && b != null && String(a) === String(b);

const modelFor = (itemType) => (itemType === "folder" ? Folder : File);

const labelFor = (itemType) => (itemType === "folder" ? "Folder" : "File");

// The caller's access to an item, or the refusal a route should answer with
const loadAccess = async (itemId, itemType, userId) => {
  if (!ITEM_TYPES.includes(itemType)) throw new ShareError(400, "Unknown item type");

  const access = await getItemAccess(itemId, itemType, userId, { lean: true });
  if (!access) throw new ShareError(404, `${labelFor(itemType)} not found`);

  return access;
};

// What the caller may do on this item, for both the checks and the interface
const describeAbilities = (access) => {
  const controlLevel = getControlLevel(access.item);
  const canShare = canPerform(access.role, SHARE_ACTIONS.SHARE, { controlLevel });

  return {
    role: access.role,
    isOwner: access.isOwner,
    controlLevel,
    canShare,
    canManageSettings: canPerform(access.role, SHARE_ACTIONS.MANAGE),
    grantableRoles: canShare ? SHARE_ROLES.filter((role) => canGrantRole(access.role, role)) : [],
  };
};

// Nobody changes or removes someone holding a stronger role than their own
const canActOn = (actorRole, targetRole) => actorRole === OWNER_ROLE || roleAtLeast(actorRole, targetRole);

const findEntry = (item, userId) => (item.sharedWith || []).find((entry) => sameId(entry.user, userId));

// The owner's active folders above an item, nearest first, with their shares
const loadAncestors = async (item, itemType) => {
  const ancestors = [];
  const visited = new Set([String(item._id)]);
  let parentId = itemType === "folder" ? item.parentFolder : item.folder;

  for (let depth = 0; parentId && depth < MAX_FOLDER_DEPTH; depth += 1) {
    if (visited.has(String(parentId))) break;
    visited.add(String(parentId));

    const parent = await Folder.findOne({ _id: parentId, owner: item.owner, isDeleted: false })
      .select("name parentFolder sharedWith")
      .lean();

    if (!parent) break;

    ancestors.push(parent);
    parentId = parent.parentFolder;
  }

  return ancestors;
};

// The strongest role each person holds through the folders above, and the nearest folder giving it
const collectInherited = (ancestors) => {
  const byUser = new Map();

  ancestors.forEach((folder) => {
    (folder.sharedWith || []).forEach((entry) => {
      const role = getDirectRole(folder, entry.user);
      if (!role) return;

      const key = String(entry.user);
      const current = byUser.get(key);

      // A nearer folder wins a tie, since it was visited first
      if (!current || strongerRole(current.role, role) !== current.role) {
        byUser.set(key, { userId: key, role, via: { id: String(folder._id), name: folder.name } });
      }
    });
  });

  return byUser;
};

const loadUsers = async (ids) => {
  const unique = [...new Set(ids.filter(Boolean).map(String))].filter(isValidObjectId);
  if (unique.length === 0) return new Map();

  const users = await User.find({ _id: { $in: unique } }).select("name email image").lean();
  return new Map(users.map((user) => [String(user._id), user]));
};

const toPerson = (user, extra = {}) => ({
  id: String(user._id),
  name: user.name || "Unnamed",
  email: user.email || null,
  avatar: user.image || null,
  ...extra,
});

// Everyone who can reach an item and what the caller may change; anyone with access may read it
export const listAccess = async (itemId, itemType, userId) => {
  const access = await loadAccess(itemId, itemType, userId);
  const { item } = access;

  const ancestors = await loadAncestors(item, itemType);
  const inheritedByUser = collectInherited(ancestors);
  const direct = (item.sharedWith || []).filter((entry) => SHARE_ROLES.includes(entry.permission));

  const users = await loadUsers([
    item.owner,
    ...direct.map((entry) => entry.user),
    ...direct.map((entry) => entry.sharedBy),
    ...inheritedByUser.keys(),
  ]);

  const owner = users.get(String(item.owner));

  // Accounts that no longer exist are left out rather than shown as blanks
  const people = direct
    .filter((entry) => users.has(String(entry.user)) && !sameId(entry.user, item.owner))
    .map((entry) => {
      const inherited = inheritedByUser.get(String(entry.user));
      const sharer = entry.sharedBy ? users.get(String(entry.sharedBy)) : null;

      // Shown when a folder above gives this person more than their own entry does
      const outranked = Boolean(inherited) && strongerRole(inherited.role, entry.permission) !== entry.permission;

      return toPerson(users.get(String(entry.user)), {
        role: entry.permission,
        sharedAt: entry.sharedAt || null,
        sharedBy: sharer ? { id: String(sharer._id), name: sharer.name || "Unnamed" } : null,
        inheritedRole: outranked ? inherited.role : null,
        inheritedVia: outranked ? inherited.via : null,
      });
    });

  const directIds = new Set(direct.map((entry) => String(entry.user)));

  const inherited = [...inheritedByUser.values()]
    .filter((entry) => !directIds.has(entry.userId) && users.has(entry.userId) && !sameId(entry.userId, item.owner))
    .map((entry) => toPerson(users.get(entry.userId), { role: entry.role, via: entry.via }));

  return {
    item: { id: String(item._id), name: item.name, type: itemType },
    owner: owner ? toPerson(owner) : { id: String(item.owner), name: "Unknown", email: null, avatar: null },
    you: { id: String(userId), ...describeAbilities(access) },
    people,
    inherited,
  };
};

// Reads the people to add, refusing anything malformed before a query runs
const readRecipients = (users) => {
  if (!Array.isArray(users) || users.length === 0) throw new ShareError(400, "Choose at least one person");
  if (users.length > MAX_RECIPIENTS) throw new ShareError(400, `You can add up to ${MAX_RECIPIENTS} people at once`);

  const byId = new Map();

  users.forEach((user) => {
    const id = String((typeof user === "string" ? user : user?.id) ?? "").trim();
    const permission = typeof user === "object" && user?.permission ? user.permission : "view";

    if (!isValidObjectId(id)) throw new ShareError(400, "Some people could not be found");
    if (!SHARE_ROLES.includes(permission)) throw new ShareError(400, "Choose a valid role");

    byId.set(id, permission);
  });

  return byId;
};

const readNote = (note) => {
  if (note == null) return "";
  if (typeof note !== "string") throw new ShareError(400, "The note must be text");

  const trimmed = note.trim();
  if (trimmed.length > NOTE_MAX_LENGTH) {
    throw new ShareError(400, `The note cannot be longer than ${NOTE_MAX_LENGTH} characters`);
  }

  return trimmed;
};

// Adds people with one note for the whole batch; people who already have an entry are reported, not changed
export const addPeople = async (itemId, itemType, userId, { users, note } = {}) => {
  const access = await loadAccess(itemId, itemType, userId);
  const abilities = describeAbilities(access);
  const { item } = access;

  if (!abilities.canShare) throw new ShareError(403, "You don't have permission to add people");

  const requested = readRecipients(users);
  const cleanNote = readNote(note);

  if (requested.has(String(item.owner))) throw new ShareError(400, "The owner already has full access");
  if (requested.has(String(userId))) throw new ShareError(400, "You can't share with yourself");

  for (const permission of requested.values()) {
    if (!canGrantRole(access.role, permission)) {
      throw new ShareError(403, "You can't give anyone a role higher than your own");
    }
  }

  const found = await loadUsers([...requested.keys()]);
  if (found.size !== requested.size) throw new ShareError(400, "Some people could not be found");

  const alreadyShared = [...requested.keys()].filter((id) => findEntry(item, id));
  const candidates = [...requested.keys()].filter((id) => !findEntry(item, id));

  // The owner's organization decides who may receive their items, whoever is sharing
  const { allowed, blocked = [], policy } = candidates.length
    ? await LinkPolicy.filterRecipients(item.owner, candidates)
    : { allowed: [], blocked: [] };

  if (candidates.length > 0 && allowed.length === 0) {
    throw new ShareError(
      403,
      `Your organization's external sharing policy (${policy}) only allows sharing with organization members`
    );
  }

  const Model = modelFor(itemType);
  const added = [];
  const sharedAt = new Date();

  for (const id of allowed.map(String)) {
    // Pushed only while the person is still absent, so two requests cannot add them twice
    const result = await Model.updateOne(
      { _id: item._id, isDeleted: false, "sharedWith.user": { $ne: id } },
      {
        $push: {
          sharedWith: { user: id, permission: requested.get(id), sharedAt, sharedBy: userId, note: cleanNote },
        },
      }
    );

    if (result.modifiedCount > 0) added.push(id);
    else alreadyShared.push(id);
  }

  return {
    added,
    alreadyShared,
    blocked: blocked.map(String),
    access: await listAccess(itemId, itemType, userId),
  };
};

// Checks shared by changing a role and removing someone
const loadTarget = async (itemId, itemType, userId, targetUserId) => {
  const access = await loadAccess(itemId, itemType, userId);
  const abilities = describeAbilities(access);

  if (!abilities.canShare) throw new ShareError(403, NO_PERMISSION);
  if (!isValidObjectId(targetUserId)) throw new ShareError(400, "Choose a person");
  if (sameId(targetUserId, userId)) throw new ShareError(400, "You can't change your own access");
  if (sameId(targetUserId, access.item.owner)) throw new ShareError(400, "The owner's access can't be changed");

  const entry = findEntry(access.item, targetUserId);
  if (!entry) {
    throw new ShareError(404, "That person wasn't added directly here; change their access on the folder they come from");
  }

  if (!canActOn(access.role, entry.permission)) {
    throw new ShareError(403, "You can't change someone whose role is higher than yours");
  }

  return { access, entry };
};

// Changes one person's role in place, so moving from View to Edit needs no new invitation
export const changeRole = async (itemId, itemType, userId, { targetUserId, permission } = {}) => {
  if (!SHARE_ROLES.includes(permission)) throw new ShareError(400, "Choose a valid role");

  const { access, entry } = await loadTarget(itemId, itemType, userId, targetUserId);

  if (!canGrantRole(access.role, permission)) {
    throw new ShareError(403, "You can't give anyone a role higher than your own");
  }

  if (entry.permission !== permission) {
    const result = await modelFor(itemType).updateOne(
      { _id: access.item._id, isDeleted: false, "sharedWith.user": targetUserId },
      { $set: { "sharedWith.$.permission": permission } }
    );

    // Removed by someone else in the meantime
    if (result.matchedCount === 0) throw new ShareError(409, "That person no longer has access here");
  }

  return listAccess(itemId, itemType, userId);
};

export const removePerson = async (itemId, itemType, userId, { targetUserId } = {}) => {
  const { access } = await loadTarget(itemId, itemType, userId, targetUserId);

  await modelFor(itemType).updateOne(
    { _id: access.item._id, isDeleted: false },
    { $pull: { sharedWith: { user: targetUserId } } }
  );

  return listAccess(itemId, itemType, userId);
};

// Drops the caller's own entry; access coming from a folder above has to be left there
export const leave = async (itemId, itemType, userId) => {
  const access = await loadAccess(itemId, itemType, userId);

  if (access.isOwner) throw new ShareError(400, "The owner can't leave their own item");

  if (!findEntry(access.item, userId)) {
    throw new ShareError(400, "Your access comes from a folder shared with you; leave that folder instead");
  }

  await modelFor(itemType).updateOne(
    { _id: access.item._id, isDeleted: false },
    { $pull: { sharedWith: { user: userId } } }
  );

  return { left: true };
};

// Clears every direct share at once, for the owner only
export const removeEveryone = async (itemId, itemType, userId) => {
  const access = await loadAccess(itemId, itemType, userId);
  if (!access.isOwner) throw new ShareError(403, NO_PERMISSION);

  await modelFor(itemType).updateOne({ _id: access.item._id, isDeleted: false }, { $set: { sharedWith: [] } });

  return { removedAll: true };
};

// The newest items shared directly with the caller, with who added them and their note, for Notices
export const listShareNotices = async (userId) => {
  if (!isValidObjectId(userId)) return [];

  const query = { "sharedWith.user": userId, isDeleted: false, owner: { $ne: userId } };

  const [files, folders] = await Promise.all([
    File.find(query).sort({ "sharedWith.sharedAt": -1 }).limit(NOTICE_SCAN_LIMIT).select("name owner sharedWith").lean(),
    Folder.find(query).sort({ "sharedWith.sharedAt": -1 }).limit(NOTICE_SCAN_LIMIT).select("name owner sharedWith").lean(),
  ]);

  const items = [
    ...files.map((doc) => ({ doc, type: "file" })),
    ...folders.map((doc) => ({ doc, type: "folder" })),
  ]
    .map(({ doc, type }) => ({ doc, type, entry: findEntry(doc, userId) }))
    .filter(({ entry }) => entry)
    .sort((a, b) => new Date(b.entry.sharedAt || 0) - new Date(a.entry.sharedAt || 0))
    .slice(0, NOTICE_LIMIT);

  // Shares made before the sharer was recorded are credited to the owner
  const users = await loadUsers(items.map(({ doc, entry }) => entry.sharedBy || doc.owner));

  return items.map(({ doc, type, entry }) => {
    const sharer = users.get(String(entry.sharedBy || doc.owner));

    return {
      id: String(doc._id),
      type,
      name: doc.name,
      isOwner: false,
      sharedBy: { name: sharer?.name || "Someone" },
      sharedAt: entry.sharedAt || null,
      note: entry.note || "",
    };
  });
};

export const SHARED_TABS = { WITH_ME: "with-me", BY_ME: "by-me" };
export const SHARED_FILTERS = ["all", "files", "folders", "links"];
export const SHARED_SORTS = ["sharedAt", "name"];
export const SHARED_PAGE_SIZE = 30;
export const SHARED_MAX_PAGE_SIZE = 100;

// How many recipient names a Shared by me row carries for its "Shared with" column
const SHARED_WITH_PREVIEW = 3;

// Orders names the way people read them: case-insensitive, with "file 2" before "file 10"
const nameCollator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

const compareSortValues = (a, b) =>
  typeof a === "number" && typeof b === "number" ? a - b : nameCollator.compare(String(a), String(b));

// Rows ordered by their sort value, then by id so equal values always fall in the same order
const compareRows = (a, b, direction) => {
  const byValue = compareSortValues(a.sortValue, b.sortValue);
  return (byValue !== 0 ? byValue : a.id.localeCompare(b.id)) * direction;
};

// Where the next page starts: the last row's sort value and id
const encodeSharedCursor = (row) =>
  Buffer.from(JSON.stringify({ v: row.sortValue, id: row.id })).toString("base64url");

// Reads a cursor back, or null when it is malformed or was made for the other sort
export const parseSharedCursor = (cursor, sort) => {
  try {
    const decoded = JSON.parse(Buffer.from(String(cursor), "base64url").toString("utf8"));
    const expectedType = sort === "name" ? "string" : "number";

    if (!isValidObjectId(decoded?.id) || typeof decoded.v !== expectedType) return null;
    return { sortValue: decoded.v, id: decoded.id };
  } catch {
    return null;
  }
};

const validEntries = (doc) => (doc.sharedWith || []).filter((entry) => SHARE_ROLES.includes(entry.permission));

const newestEntryDate = (doc) =>
  validEntries(doc).reduce((latest, entry) => {
    const time = entry.sharedAt ? new Date(entry.sharedAt).getTime() : 0;
    return Math.max(latest, time);
  }, 0);

// One page of the Shared list: items shared directly with the caller, or the caller's own items shared with others
export const listSharedItems = async (
  userId,
  { tab = SHARED_TABS.WITH_ME, filter = "all", sort = "sharedAt", order = "desc", cursor = null, limit = SHARED_PAGE_SIZE } = {}
) => {
  // Public links do not exist yet, so the Links filter has nothing to list
  if (filter === "links") {
    return { items: [], nextCursor: null, total: cursor ? undefined : 0, linksUnavailable: true };
  }

  const isWithMe = tab !== SHARED_TABS.BY_ME;
  const direction = order === "asc" ? 1 : -1;

  const query = isWithMe
    ? { "sharedWith.user": userId, isDeleted: false, owner: { $ne: userId } }
    : { owner: userId, isDeleted: false, "sharedWith.0": { $exists: true } };

  const sources = [
    filter !== "folders" && { Model: File, type: "file" },
    filter !== "files" && { Model: Folder, type: "folder" },
  ].filter(Boolean);

  // Only what sorting needs is read for every match; full details are loaded for the requested page alone
  const lists = await Promise.all(
    sources.map(({ Model, type }) =>
      Model.find(query)
        .select("name sharedWith")
        .lean()
        .then((docs) => docs.map((doc) => ({ doc, type })))
    )
  );

  const rows = lists
    .flat()
    .map(({ doc, type }) => {
      const entry = isWithMe ? findEntry(doc, userId) : null;
      const sharedTime = isWithMe ? (entry?.sharedAt ? new Date(entry.sharedAt).getTime() : 0) : newestEntryDate(doc);

      return {
        id: String(doc._id),
        type,
        sharedTime,
        sortValue: sort === "name" ? doc.name || "" : sharedTime,
        // Shared by me lists only items with a real share; a list of broken entries does not count
        isListed: isWithMe ? Boolean(entry && SHARE_ROLES.includes(entry.permission)) : validEntries(doc).length > 0,
      };
    })
    .filter((row) => row.isListed)
    .sort((a, b) => compareRows(a, b, direction));

  const start = cursor ? rows.findIndex((row) => compareRows(row, cursor, direction) > 0) : 0;
  const page = start === -1 ? [] : rows.slice(start, start + limit);
  const hasMore = start !== -1 && start + limit < rows.length;

  const items = await loadSharedPage(page, userId, isWithMe);

  return {
    items,
    nextCursor: hasMore ? encodeSharedCursor(page[page.length - 1]) : null,
    // Counted on the first page only, as the file list does
    total: cursor ? undefined : rows.length,
    linksUnavailable: false,
  };
};

// Full details for one page of rows, kept in the page's order
const loadSharedPage = async (page, userId, isWithMe) => {
  if (page.length === 0) return [];

  const idsOf = (type) => page.filter((row) => row.type === type).map((row) => row.id);
  const fields = "name extension mimeType owner sharedWith";

  const [files, folders] = await Promise.all([
    idsOf("file").length ? File.find({ _id: { $in: idsOf("file") } }).select(fields).lean() : [],
    idsOf("folder").length ? Folder.find({ _id: { $in: idsOf("folder") } }).select(fields).lean() : [],
  ]);

  const docs = new Map([...files, ...folders].map((doc) => [String(doc._id), doc]));

  const previewEntries = (doc) =>
    validEntries(doc)
      .sort((a, b) => new Date(b.sharedAt || 0) - new Date(a.sharedAt || 0))
      .slice(0, SHARED_WITH_PREVIEW);

  // Shares made before the sharer was recorded are credited to the owner
  const userIds = [...docs.values()].flatMap((doc) => {
    if (!isWithMe) return previewEntries(doc).map((entry) => entry.user);
    const entry = findEntry(doc, userId);
    return [doc.owner, entry?.sharedBy];
  });

  const users = await loadUsers(userIds);
  const nameOf = (id) => users.get(String(id))?.name || "Unknown";

  return page
    .filter((row) => docs.has(row.id))
    .map((row) => {
      const doc = docs.get(row.id);
      const isFile = row.type === "file";

      const base = {
        id: row.id,
        type: row.type,
        name: doc.name,
        extension: isFile ? doc.extension || "" : null,
        mimeType: isFile ? doc.mimeType || null : null,
        sharedAt: row.sharedTime ? new Date(row.sharedTime).toISOString() : null,
      };

      if (!isWithMe) {
        return {
          ...base,
          isOwner: true,
          role: OWNER_ROLE,
          sharedBy: null,
          owner: null,
          sharedWith: {
            count: validEntries(doc).length,
            names: previewEntries(doc).filter((entry) => users.has(String(entry.user))).map((entry) => nameOf(entry.user)),
          },
        };
      }

      const entry = findEntry(doc, userId);
      const sharerId = entry?.sharedBy || doc.owner;
      const sharer = users.get(String(sharerId));

      return {
        ...base,
        isOwner: false,
        role: entry?.permission || "view",
        sharedBy: { id: String(sharerId), name: sharer?.name || "Unknown", avatar: sharer?.image || null },
        owner: { id: String(doc.owner), name: nameOf(doc.owner) },
        sharedWith: null,
      };
    });
};