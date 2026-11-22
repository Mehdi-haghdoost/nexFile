import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import {
  ShareError,
  addPeople,
  changeRole,
  leave,
  listAccess,
  removeEveryone,
  removePerson,
} from "@/utils/sharing/shareService";

const jsonError = (message, status) =>
  NextResponse.json({ success: false, message }, { status });

// A known refusal keeps its status and message; anything else is logged and kept from the browser
const handleError = (error, context) => {
  if (error instanceof ShareError) return jsonError(error.message, error.status);

  console.error(`${context} error:`, error);
  return jsonError("Something went wrong while updating sharing. Please try again.", 500);
};

// A body that is not JSON is treated as empty, so the checks below answer it
const readBody = (request) => request.json().catch(() => ({}));

// A missing type means a file, as before; anything unknown is refused by the service
const readItemType = (value) => value ?? "file";

const plural = (count) => (count === 1 ? "1 person" : `${count} people`);

// Sums up who was added, who already had access and who the policy kept out
const describeAdded = ({ added, alreadyShared, blocked }) => {
  const parts = [];
  if (added.length) parts.push(`Shared with ${plural(added.length)}`);
  if (alreadyShared.length) parts.push(`${plural(alreadyShared.length)} already had access`);
  if (blocked.length) parts.push(`${plural(blocked.length)} blocked by your organization's sharing policy`);

  return parts.join(". ") || "Nothing changed";
};

// GET ?itemType=file|folder: the owner, everyone with access and what the caller may change
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { id } = await params;
    const itemType = readItemType(new URL(request.url).searchParams.get("itemType"));

    const access = await listAccess(id, itemType, userId);

    // The current share modal still reads this older list; it goes when the modal moves to the fields above
    const sharedUsers = access.people.map(({ id: personId, name, email, avatar, role }) => ({
      id: personId,
      name,
      email,
      avatar,
      permission: role,
    }));

    return NextResponse.json({ success: true, ...access, sharedUsers }, { status: 200 });
  } catch (error) {
    return handleError(error, "Get item access");
  }
}

// POST { users: [{ id, permission }], note, itemType }: adds people with one note for the batch
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { id } = await params;
    const { users, note, itemType } = await readBody(request);

    const result = await addPeople(id, readItemType(itemType), userId, { users, note });

    return NextResponse.json(
      {
        success: true,
        message: describeAdded(result),
        addedCount: result.added.length,
        alreadySharedCount: result.alreadyShared.length,
        blockedCount: result.blocked.length,
        ...result.access,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Share item");
  }
}

// PATCH { userId, permission, itemType }: changes one person's role in place
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { id } = await params;
    const { userId: targetUserId, permission, itemType } = await readBody(request);

    const access = await changeRole(id, readItemType(itemType), userId, { targetUserId, permission });

    return NextResponse.json({ success: true, message: "Access updated", ...access }, { status: 200 });
  } catch (error) {
    return handleError(error, "Change role");
  }
}

// DELETE { itemType, userId } removes one person, { leave: true } drops the caller's own access,
// { all: true } lets the owner remove everyone; with none of these the older behavior stays until the Shared list moves over
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { id } = await params;
    const body = await readBody(request);
    const itemType = readItemType(body.itemType);

    if (body.userId && String(body.userId) !== String(userId)) {
      const access = await removePerson(id, itemType, userId, { targetUserId: String(body.userId) });
      return NextResponse.json({ success: true, message: "Access removed", ...access }, { status: 200 });
    }

    if (body.leave === true || body.userId) {
      await leave(id, itemType, userId);
      return NextResponse.json({ success: true, message: "You no longer have access" }, { status: 200 });
    }

    if (body.all === true) {
      await removeEveryone(id, itemType, userId);
      return NextResponse.json({ success: true, message: "Sharing removed" }, { status: 200 });
    }

    // Older callers send no option: the owner removed everyone and anyone else left
    try {
      await removeEveryone(id, itemType, userId);
      return NextResponse.json({ success: true, message: "Sharing removed" }, { status: 200 });
    } catch (error) {
      if (!(error instanceof ShareError) || error.status !== 403) throw error;

      await leave(id, itemType, userId);
      return NextResponse.json({ success: true, message: "You no longer have access" }, { status: 200 });
    }
  } catch (error) {
    return handleError(error, "Unshare item");
  }
}