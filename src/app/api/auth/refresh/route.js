// import { NextResponse } from "next/server";
// import connectToDB from "@/lib/mongodb";
// import { 
//   verifyRefreshToken, 
//   generateAccessToken, 
//   generateRefreshToken, 
//   findRefreshToken,
//   revokeRefreshToken,
//   saveRefreshToken,
//   setAuthCookies 
// } from "@/utils/auth/tokenManager";

// export async function POST(req) {
//   try {
//     await connectToDB();

//     const oldRefreshToken = req.cookies.get("refreshToken")?.value;

//     if (!oldRefreshToken) {
//       return NextResponse.json(
//         { message: "Refresh token not found" },
//         { status: 401 }
//       );
//     }

//     let payload;
//     try {
//       payload = verifyRefreshToken(oldRefreshToken);
//     } catch (error) {
//       return NextResponse.json(
//         { message: "Invalid or expired refresh token" },
//         { status: 401 }
//       );
//     }

//     if (!payload) {
//       return NextResponse.json(
//         { message: "Invalid or expired refresh token" },
//         { status: 401 }
//       );
//     }

//     const refreshTokenDoc = await findRefreshToken(oldRefreshToken);

//     if (!refreshTokenDoc) {
//       return NextResponse.json(
//         { message: "Invalid refresh token" },
//         { status: 401 }
//       );
//     }

//     const user = refreshTokenDoc.userId;

//     const newAccessToken = generateAccessToken({
//       userId: user._id.toString(),
//       email: user.email,
//       role: user.role,
//     });

//     const newRefreshToken = generateRefreshToken({
//       userId: user._id.toString(),
//       email: user.email,
//     });

//     await revokeRefreshToken(oldRefreshToken);
//     await saveRefreshToken(user._id, newRefreshToken);

//     let response = NextResponse.json(
//       {
//         message: "Token refreshed successfully",
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           image: user.image,
//         },
//       },
//       { status: 200 }
//     );

//     response = setAuthCookies(response, newAccessToken, newRefreshToken);

//     return response;
//   } catch (error) {
//     console.error("Refresh token error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import { 
  verifyRefreshToken, 
  generateAccessToken, 
  generateRefreshToken, 
  findRefreshToken,
  revokeRefreshToken,
  saveRefreshToken,
  setAuthCookies,
  cleanupUserTokens
} from "@/utils/auth/tokenManager";

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 * 
 * Process:
 * 1. Verify refresh token from cookie
 * 2. Check if token exists in database and is not revoked
 * 3. Generate new access and refresh tokens
 * 4. Revoke old refresh token
 * 5. Save new refresh token to database
 * 6. Clean up old tokens for this user
 * 7. Set new tokens in cookies
 * 
 * @returns {Object} - { message, user }
 */
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

    // Verify JWT token
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

    // Check if token exists in database and is valid
    const refreshTokenDoc = await findRefreshToken(oldRefreshToken);

    if (!refreshTokenDoc) {

      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }


    const user = refreshTokenDoc.userId;

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Revoke old refresh token
    await revokeRefreshToken(oldRefreshToken);

    // Save new refresh token to database
    await saveRefreshToken(user._id, newRefreshToken);


    // Clean up old tokens for this user
    await cleanupUserTokens(user._id);

    // Prepare response
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

    // Set new tokens in cookies
    response = setAuthCookies(response, newAccessToken, newRefreshToken);

    return response;
  } catch (error) {
    console.error("❌ [Refresh] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}