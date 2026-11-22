import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import File from "@/models/File";
import Folder from "@/models/Folder";
import {
  CONTROL_LEVELS,
  SHARE_ACTIONS,
  checkItemAccess,
  getControlLevel,
} from "@/utils/sharing/sharingAccess";

const ITEM_TYPES = ["file", "folder"];

const jsonError = (message, status) =>
  NextResponse.json({ success: false, message }, { status });

// The settings Manage access shows; public links do not exist yet, so none are stored or returned
const toSettings = (item) => ({
  controlLevel: getControlLevel(item),
  showAccessInfo: Boolean(item.permissions?.showAccessInfo),
});

// Only the owner opens Manage access; everyone else is told no, or not found when they have no access
const checkOwner = async (request, params, itemType) => {
  const { userId, response } = requireUser(request);
  if (response) return { response };

  if (!ITEM_TYPES.includes(itemType)) return { response: jsonError("Unknown item type", 400) };

  const { id } = await params;
  const result = await checkItemAccess(id, itemType, userId, SHARE_ACTIONS.MANAGE, { lean: true });
  if (!result.ok) return { response: jsonError(result.message, result.status) };

  return { item: result.access.item };
};

// GET ?itemType=file|folder: the stored Control permissions and access-info setting
export async function GET(request, { params }) {
  try {
    await connectDB();

    const itemType = new URL(request.url).searchParams.get("itemType") || "file";
    const { item, response } = await checkOwner(request, params, itemType);
    if (response) return response;

    return NextResponse.json(
      { success: true, permissions: toSettings(item), publicLinksAvailable: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get permissions error:", error);
    return jsonError("Failed to load the settings", 500);
  }
}

// PATCH { permissionLevel, isCommentsEnabled, itemType }: saves Control permissions and the access-info setting only
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const { permissionLevel, isCommentsEnabled, itemType = "file" } = body;

    const { item, response } = await checkOwner(request, params, itemType);
    if (response) return response;

    const updates = {};

    if (permissionLevel !== undefined) {
      if (!Object.values(CONTROL_LEVELS).includes(permissionLevel)) {
        return jsonError("Choose a valid Control permissions setting", 400);
      }
      updates["permissions.controlLevel"] = permissionLevel;
    }

    if (isCommentsEnabled !== undefined) {
      if (typeof isCommentsEnabled !== "boolean") {
        return jsonError("The access information setting must be on or off", 400);
      }
      updates["permissions.showAccessInfo"] = isCommentsEnabled;
    }

    if (Object.keys(updates).length === 0) return jsonError("No settings to save", 400);

    const Model = itemType === "folder" ? Folder : File;
    const updated = await Model.findOneAndUpdate(
      { _id: item._id, isDeleted: false },
      { $set: updates },
      { new: true }
    ).lean();

    if (!updated) return jsonError(`${itemType === "folder" ? "Folder" : "File"} not found`, 404);

    return NextResponse.json(
      {
        success: true,
        message: "Permissions updated successfully",
        item: { id: updated._id.toString(), permissions: toSettings(updated) },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update permissions error:", error);
    return jsonError("Failed to save the settings", 500);
  }
}