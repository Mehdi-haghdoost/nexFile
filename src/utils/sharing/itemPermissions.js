// Roles that may rename an item and edit its content
const EDIT_ROLES = ["owner", "admin", "edit"];

// How the caller's access is described to them
const ROLE_LABELS = {
  owner: "Owner",
  admin: "Admin",
  edit: "Can edit",
  view: "Can view",
};

// The caller's role on a listed item; lists of one's own items carry no role, so they mean owner
export const getItemRole = (item) => item?.role || "owner";

// What the interface may offer for an item; the server checks every action again
export const getItemPermissions = (item) => {
  const role = getItemRole(item);

  return {
    role,
    isOwner: role === "owner",
    canEdit: EDIT_ROLES.includes(role),
  };
};

// True when a role may rename and edit content
export const canEditWithRole = (role) => EDIT_ROLES.includes(role);

export const getRoleLabel = (role) => ROLE_LABELS[role] || ROLE_LABELS.view;