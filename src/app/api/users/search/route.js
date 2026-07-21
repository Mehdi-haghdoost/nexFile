// import { NextResponse } from "next/server";
// import { headers } from "next/headers";

// export async function GET(request) {
//   try {
//     const headersList = headers();
//     const userId = headersList.get("x-user-id");
//     const userEmail = headersList.get("x-user-email");
//     const userRole = headersList.get("x-user-role");

//     if (!userId) {
//       return NextResponse.json(
//         { message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Your search logic here
//     return NextResponse.json({
//       message: "Search results",
//       user: { userId, userEmail, userRole },
//     });
//   } catch (error) {
//     console.error("Search error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import User from "@/models/User";

// GET /api/users/search?q=term  -> array of matching users (excluding self)
export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      return NextResponse.json([], { status: 200 });
    }

    // Case-insensitive match on name or email, excluding the current user
    const regex = new RegExp(q, "i");
    const users = await User.find({
      _id: { $ne: decoded.userId },
      $or: [{ name: regex }, { email: regex }],
    })
      .select("name email image")
      .limit(8)
      .lean();

    // Shape the response to match what ShareModal expects
    const results = users.map((u) => ({
      id: u._id.toString(),
      name: u.name || "Unnamed",
      email: u.email,
      avatar: u.image || null,
    }));

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}