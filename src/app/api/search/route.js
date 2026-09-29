import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { searchEverything } from "@/utils/search/searchService";

// Below this a search matches almost everything, which is noise rather than a result
const MIN_TERM_LENGTH = 2;

// Searches the caller's folders and files by name
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const term = (searchParams.get("q") || "").trim();

    if (term.length < MIN_TERM_LENGTH) {
      return NextResponse.json({ success: true, folders: [], files: [] });
    }

    const results = await searchEverything(userId, term);

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}