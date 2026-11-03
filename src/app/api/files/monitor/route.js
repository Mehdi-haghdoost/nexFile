import { NextResponse } from "next/server";

// The demo monitor was replaced by the transfer activity API, so callers are told where to go instead
const retired = () =>
  NextResponse.json(
    {
      success: false,
      message: "This demo endpoint has been retired. Use /api/transfers/activity instead.",
    },
    { status: 410 }
  );

// GET /api/files/monitor: retired, it no longer reads demo view data
export async function GET() {
  return retired();
}

// POST /api/files/monitor: retired, it no longer seeds sample view records
export async function POST() {
  return retired();
}