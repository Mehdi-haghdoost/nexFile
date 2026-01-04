import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import { 
  verifyRefreshToken, 
  generateAccessToken, 
  generateRefreshToken, 
  findRefreshToken,
  revokeRefreshToken,
  saveRefreshToken,
  setAuthCookies 
} from "@/utils/auth/tokenManager";

export async function POST(req) {
  try {
    await connectToDB();

    const oldRefreshToken = req.cookies.get("refreshToken")?.value;

    if (!oldRefreshToken) {
      return NextResponse.json(
        { message: "Refresh token not found" },
        { status: 401 }
      );
    }

    let payload;
    try {
      payload = verifyRefreshToken(oldRefreshToken);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    if (!payload) {
      return NextResponse.json(
        { message: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    const refreshTokenDoc = await findRefreshToken(oldRefreshToken);

    if (!refreshTokenDoc) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const user = refreshTokenDoc.userId;

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    await revokeRefreshToken(oldRefreshToken);
    await saveRefreshToken(user._id, newRefreshToken);

    let response = NextResponse.json(
      {
        message: "Token refreshed successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
      },
      { status: 200 }
    );

    response = setAuthCookies(response, newAccessToken, newRefreshToken);

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}