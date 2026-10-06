import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { FileService } from "@/utils/files/fileService";

// Returns everything shared with the caller, or shared by them with someone
// else. Filtering is left to the client, which already narrows the same list
// without a round trip per filter.
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const items = await FileService.getSharedItems(userId);

    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (error) {
    console.error("Get shared items error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to get shared items" },
      { status: 500 }
    );
  }
}