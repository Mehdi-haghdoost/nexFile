import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { FileService } from "@/utils/files/fileService";
import {
  SHARED_FILTERS,
  SHARED_MAX_PAGE_SIZE,
  SHARED_PAGE_SIZE,
  SHARED_SORTS,
  SHARED_TABS,
  listSharedItems,
  parseSharedCursor,
} from "@/utils/sharing/shareService";

const jsonError = (message, status) =>
  NextResponse.json({ success: false, message }, { status });

// Reads the list options, or the reason they cannot be used
const readOptions = (searchParams) => {
  const tab = searchParams.get("tab");
  const filter = searchParams.get("filter") || "all";
  const sort = searchParams.get("sort") || "sharedAt";
  // Newest first for dates and A to Z for names, unless asked otherwise
  const order = searchParams.get("order") || (sort === "name" ? "asc" : "desc");
  const rawLimit = searchParams.get("limit");
  const rawCursor = searchParams.get("cursor");

  if (!Object.values(SHARED_TABS).includes(tab)) return { error: "Choose Shared with me or Shared by me" };
  if (!SHARED_FILTERS.includes(filter)) return { error: "Unknown filter" };
  if (!SHARED_SORTS.includes(sort)) return { error: "Unknown sort" };
  if (!["asc", "desc"].includes(order)) return { error: "Unknown sort order" };

  const limit = rawLimit == null ? SHARED_PAGE_SIZE : Number(rawLimit);
  if (!Number.isInteger(limit) || limit < 1 || limit > SHARED_MAX_PAGE_SIZE) {
    return { error: `Page size must be between 1 and ${SHARED_MAX_PAGE_SIZE}` };
  }

  const cursor = rawCursor ? parseSharedCursor(rawCursor, sort) : null;
  if (rawCursor && !cursor) return { error: "This list changed; reload it to continue" };

  return { options: { tab, filter, sort, order, limit, cursor } };
};

// GET ?tab=with-me|by-me&filter&sort&order&limit&cursor: one page of the Shared list
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { searchParams } = new URL(request.url);

    // The current screen asks without a tab and still gets the full list, until it moves to pages
    if (!searchParams.has("tab")) {
      const items = await FileService.getSharedItems(userId);
      return NextResponse.json({ success: true, items }, { status: 200 });
    }

    const { options, error } = readOptions(searchParams);
    if (error) return jsonError(error, 400);

    const page = await listSharedItems(userId, options);

    return NextResponse.json({ success: true, ...page }, { status: 200 });
  } catch (error) {
    console.error("Get shared items error:", error);
    return jsonError("Failed to load shared items. Please try again.", 500);
  }
}