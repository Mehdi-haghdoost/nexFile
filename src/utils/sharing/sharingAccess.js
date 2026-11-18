import File from "@/models/File";
import Folder from "@/models/Folder";

// The roles a share can grant, weakest first; the owner holds every right above them
export const SHARE_ROLES = ["view", "edit", "admin"];

export const OWNER_ROLE = "owner";

// What a caller asks to do with a file or folder
export const SHARE_ACTIONS = {
  // Open, preview and download
  VIEW: "view",
  // Rename and edit content
  EDIT: "edit",
  // Add people, and change or remove others
  SHARE: "share",
  // Public link settings, move, delete and star stay with the owner
  MANAGE: "manage",
  // Drop one's own access
  LEAVE: "leave",
};

// Who may add people, as set in an item's Control permissions
export const CONTROL_LEVELS = {
  FOLDER_MEMBER: "folder-member",
  ADMINS_ONLY: "admins-only",
  ONLY_OWNER: "only-owner",
};

const ROLE_RANK = { view: 1, edit: 2, admin: 3, [OWNER_ROLE]: 4 };

// Stops the walk up a folder tree, so a corrupt parent chain cannot loop forever
export const MAX_FOLDER_DEPTH = 64;

// A malformed id never matches a record, so it is refused before any query
export const isValidObjectId = (value) => /^[a-f0-9]{24}$/i.test(String(value ?? ""));

const sameId = (a, b) => a != null && b != null && String(a) === String(b);

// The stronger of two roles; a missing role loses to any role
export const strongerRole = (a, b) => {
  if (!ROLE_RANK[a]) return ROLE_RANK[b] ? b : null;
  if (!ROLE_RANK[b]) return a;
  return ROLE_RANK[a] >= ROLE_RANK[b] ? a : b;
};

// True when a role reaches at least the required one
export const roleAtLeast = (role, required) =>
  Boolean(ROLE_RANK[role]) && ROLE_RANK[role] >= (ROLE_RANK[required] || Infinity);

// The role an item's own share list gives a person; an unknown permission value grants nothing
export const getDirectRole = (item, userId) => {
  const entry = (item?.sharedWith || []).find((share) => sameId(share?.user, userId));
  return entry && SHARE_ROLES.includes(entry.permission) ? entry.permission : null;
};

// A child's role inside a parent the caller can reach: the inherited role or its own share, whichever is stronger
export const inheritRole = (parentRole, item, userId) => strongerRole(parentRole, getDirectRole(item, userId));

// The folder an item sits in: a folder's parent, or a file's folder
const getParentFolderId = (item, itemType) => (itemType === "folder" ? item.parentFolder : item.folder);

// The caller's role on a loaded item: owner, or the strongest share on the item and every folder above it
export const resolveRole = async (item, itemType, userId) => {
  if (!item || !isValidObjectId(userId)) return null;
  if (sameId(item.owner, userId)) return OWNER_ROLE;

  let role = getDirectRole(item, userId);
  let parentId = getParentFolderId(item, itemType);
  const visited = new Set([String(item._id)]);

  // Admin is the strongest role a share can give, so nothing above can raise it
  for (let depth = 0; parentId && role !== "admin" && depth < MAX_FOLDER_DEPTH; depth += 1) {
    if (visited.has(String(parentId))) break;
    visited.add(String(parentId));

    // Only the owner's own active folders pass access down
    const parent = await Folder.findOne({ _id: parentId, owner: item.owner, isDeleted: false })
      .select("parentFolder sharedWith")
      .lean();

    if (!parent) break;

    role = strongerRole(role, getDirectRole(parent, userId));
    parentId = parent.parentFolder;
  }

  return role;
};

// The Control permissions setting that applies to an item, falling back to the model's default
export const getControlLevel = (item) => {
  const level = item?.permissions?.controlLevel;
  return Object.values(CONTROL_LEVELS).includes(level) ? level : CONTROL_LEVELS.FOLDER_MEMBER;
};

// Whether a role allows an action, following the agreed permission table
export const canPerform = (role, action, { controlLevel = CONTROL_LEVELS.FOLDER_MEMBER } = {}) => {
  if (!ROLE_RANK[role]) return false;

  switch (action) {
    case SHARE_ACTIONS.VIEW:
      return true;
    case SHARE_ACTIONS.EDIT:
      return roleAtLeast(role, "edit");
    case SHARE_ACTIONS.SHARE:
      if (role === OWNER_ROLE) return true;
      if (controlLevel === CONTROL_LEVELS.ONLY_OWNER) return false;
      if (controlLevel === CONTROL_LEVELS.ADMINS_ONLY) return role === "admin";
      // Folder member: editors and admins, never view-only
      return roleAtLeast(role, "edit");
    case SHARE_ACTIONS.MANAGE:
      return role === OWNER_ROLE;
    case SHARE_ACTIONS.LEAVE:
      return role !== OWNER_ROLE;
    default:
      return false;
  }
};

// A sharer can give a known role no higher than their own; the owner can give any
export const canGrantRole = (sharerRole, requestedRole) => {
  if (!SHARE_ROLES.includes(requestedRole)) return false;
  if (sharerRole === OWNER_ROLE) return true;
  return roleAtLeast(sharerRole, requestedRole);
};

// Loads an active file or folder with the caller's role, or null when it is missing, deleted or out of reach
export const getItemAccess = async (itemId, itemType, userId, { lean = false } = {}) => {
  if (!isValidObjectId(itemId) || !isValidObjectId(userId)) return null;

  const Model = itemType === "folder" ? Folder : File;
  const query = Model.findOne({ _id: itemId, isDeleted: false });
  const item = lean ? await query.lean() : await query;
  if (!item) return null;

  const role = await resolveRole(item, itemType, userId);
  if (!role) return null;

  return { item, role, isOwner: role === OWNER_ROLE };
};

// The check a route runs before acting: 404 when the caller cannot reach the item, 403 when their role is too weak
export const checkItemAccess = async (itemId, itemType, userId, action = SHARE_ACTIONS.VIEW, options = {}) => {
  const label = itemType === "folder" ? "Folder" : "File";
  const access = await getItemAccess(itemId, itemType, userId, options);

  // Someone without access is never told whether the item exists
  if (!access) return { ok: false, status: 404, message: `${label} not found` };

  const allowed = canPerform(access.role, action, { controlLevel: getControlLevel(access.item) });
  if (!allowed) return { ok: false, status: 403, message: "You don't have permission to do that", access };

  return { ok: true, access };
};