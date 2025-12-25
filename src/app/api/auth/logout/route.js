import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import { verifyRefreshToken, revokeRefreshToken, clearAuthCookies } from "@/utils/auth/tokenManager";

export async function POST(req) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      await connectToDB();

      const payload = verifyRefreshToken(refreshToken);

      if (payload && payload.userId) {
        await revokeRefreshToken(refreshToken);
      }
    }

    let response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    response = clearAuthCookies(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    
    let response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    response = clearAuthCookies(response);

    return response;
  }
}