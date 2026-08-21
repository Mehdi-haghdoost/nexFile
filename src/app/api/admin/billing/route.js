import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { OrganizationService } from "@/utils/admin/organizationService";
import { BillingService } from "@/utils/admin/billingService";
import User from "@/models/User";

// GET /api/admin/billing
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const user = await User.findById(userId).select("name");
    let org = await OrganizationService.resolveOrgContext(userId, user?.name);

    org = await BillingService.ensureBillingDefaults(org);

    const [billing, isAdmin] = await Promise.all([
      BillingService.getBillingOverview(org),
      OrganizationService.isOrgAdmin(org._id, userId),
    ]);

    return NextResponse.json({ success: true, billing, isAdmin }, { status: 200 });
  } catch (error) {
    console.error("Get billing error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load billing" },
      { status: 500 }
    );
  }
}