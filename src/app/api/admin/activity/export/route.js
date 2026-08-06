import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { OrganizationService } from "@/utils/admin/organizationService";
import { ActivityService } from "@/utils/admin/activityService";
import User from "@/models/User";

// Escape a value for safe inclusion in a CSV cell
const csvCell = (value) => {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
};

// GET /api/admin/activity/export?category=all|Members|Groups|Security|General
// Returns the activity log as a downloadable CSV file
export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";

    const user = await User.findById(decoded.userId).select("name");
    const org = await OrganizationService.resolveOrgContext(decoded.userId, user?.name);

    const activities = await ActivityService.listActivity(org._id, { category, limit: 1000 });

    const header = ["Date", "Time", "Activity", "Category", "Person", "Location"];
    const rows = activities.map((a) => {
      const created = a.createdAt ? new Date(a.createdAt) : null;
      return [
        created ? created.toLocaleDateString("en-GB") : "",
        created ? created.toLocaleTimeString("en-GB") : "",
        a.activity,
        a.category,
        a.person.name,
        a.location,
      ].map(csvCell).join(",");
    });

    const csv = [header.map(csvCell).join(","), ...rows].join("\n");
    const filename = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export activity error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to export activity" },
      { status: 500 }
    );
  }
}