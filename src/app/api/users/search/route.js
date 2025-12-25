import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request) {
  try {
    const headersList = headers();
    const userId = headersList.get("x-user-id");
    const userEmail = headersList.get("x-user-email");
    const userRole = headersList.get("x-user-role");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Your search logic here
    return NextResponse.json({
      message: "Search results",
      user: { userId, userEmail, userRole },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}