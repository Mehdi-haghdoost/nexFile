import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { FolderService } from "@/utils/folders/folderService";

// Most corrections echoed in the response; every correction is also logged
const MAX_REPORTED_CORRECTIONS = 100;

// Accepts the bearer token schedulers send, or a plain header for a manual run
const isAuthorized = (request) => {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const bearer = request.headers.get("authorization");
  if (bearer === `Bearer ${secret}`) return true;

  return request.headers.get("x-cron-secret") === secret;
};

// Repairs folder counters that no longer match the stored files and subfolders
export async function POST(request) {
  // This route writes to every owner's folders, so an unset secret disables it rather than leaving it open
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const { corrections, ...totals } =
      await FolderService.reconcileAllFolderCounters();

    console.log("Folder counter reconcile:", totals);

    return NextResponse.json({
      // A partial failure is reported so a scheduler or a person can notice it
      success: totals.failedOwners === 0,
      ...totals,
      corrections: corrections.slice(0, MAX_REPORTED_CORRECTIONS),
      correctionsTruncated: corrections.length > MAX_REPORTED_CORRECTIONS,
    });
  } catch (error) {
    console.error("Folder counter reconcile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}