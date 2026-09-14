// import { NextResponse } from "next/server";
// import connectToDB from "@/lib/mongodb";
// import {
//   verifyRefreshToken,
//   generateAccessToken,
//   generateRefreshToken,
//   claimRefreshToken,
//   markTokenReplaced,
//   saveRefreshToken,
//   revokeAllUserTokens,
//   setAuthCookies,
//   clearAuthCookies,
//   limitUserTokens,
//   findRefreshToken,
// } from "@/utils/auth/tokenManager";

// /**
//  * Build the standard 401 response and wipe the auth cookies, so the browser
//  * stops sending credentials that the server has already rejected.
//  */
// const unauthorized = (message, code) => {
//   const response = NextResponse.json({ message, code }, { status: 401 });
//   return clearAuthCookies(response);
// };

// const buildUserPayload = (user) => ({
//   id: user._id,
//   name: user.name,
//   email: user.email,
//   role: user.role,
//   image: user.image,
// });

// export async function POST(req) {
//   try {
//     await connectToDB();

//     const oldRefreshToken = req.cookies.get("refreshToken")?.value;

//     if (!oldRefreshToken) {
//       return unauthorized("Refresh token not found", "NO_REFRESH_TOKEN");
//     }

//     // Signature and expiry check before touching the database.
//     const payload = verifyRefreshToken(oldRefreshToken);
//     if (!payload) {
//       return unauthorized("Invalid or expired refresh token", "INVALID_REFRESH_TOKEN");
//     }

//     // Atomically take ownership of the token. Only one concurrent caller wins.
//     const { status, doc } = await claimRefreshToken(oldRefreshToken);

//     /**
//      * Another request rotated this token moments ago. Instead of logging the
//      * user out, hand back the replacement token that request created. This is
//      * what stops parallel 401s on page load from ending the session.
//      */
//     if (status === "grace") {
//       const replacement = await findRefreshToken(doc.replacedByToken);

//       if (!replacement) {
//         return unauthorized("Refresh token no longer valid", "INVALID_REFRESH_TOKEN");
//       }

//       const user = replacement.userId;

//       const accessToken = generateAccessToken({
//         userId: user._id.toString(),
//         email: user.email,
//         role: user.role,
//       });

//       let response = NextResponse.json(
//         {
//           message: "Token refreshed successfully",
//           user: buildUserPayload(user),
//         },
//         { status: 200 }
//       );

//       return setAuthCookies(response, accessToken, replacement.token);
//     }

//     /**
//      * The token was revoked well outside the grace window but is being
//      * presented again. That is the classic replay signature, so every session
//      * for this user is terminated.
//      */
//     if (status === "reused") {
//       if (doc?.userId?._id) {
//         await revokeAllUserTokens(doc.userId._id);
//       }
//       return unauthorized("Refresh token reuse detected", "TOKEN_REUSE");
//     }

//     if (status !== "claimed") {
//       return unauthorized("Invalid refresh token", "INVALID_REFRESH_TOKEN");
//     }

//     const user = doc.userId;

//     if (!user) {
//       return unauthorized("User not found", "USER_NOT_FOUND");
//     }

//     const newAccessToken = generateAccessToken({
//       userId: user._id.toString(),
//       email: user.email,
//       role: user.role,
//     });

//     const newRefreshToken = generateRefreshToken({
//       userId: user._id.toString(),
//       email: user.email,
//     });

//     await saveRefreshToken(user._id, newRefreshToken);

//     // Link old -> new so requests inside the grace window can recover.
//     await markTokenReplaced(oldRefreshToken, newRefreshToken);

//     // Keep the collection bounded without deleting recently-rotated records.
//     await limitUserTokens(user._id, 5);

//     let response = NextResponse.json(
//       {
//         message: "Token refreshed successfully",
//         user: buildUserPayload(user),
//       },
//       { status: 200 }
//     );

//     return setAuthCookies(response, newAccessToken, newRefreshToken);
//   } catch (error) {
//     console.error("[Refresh] Error:", error);
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
  claimRefreshToken,
  saveRefreshToken,
  revokeAllUserTokens,
  setAuthCookies,
  clearAuthCookies,
  limitUserTokens,
  findRefreshToken,
} from "@/utils/auth/tokenManager";

/**
 * Build the standard 401 response and wipe the auth cookies, so the browser
 * stops sending credentials that the server has already rejected.
 */
const unauthorized = (message, code) => {
  const response = NextResponse.json({ message, code }, { status: 401 });
  return clearAuthCookies(response);
};

const buildUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  image: user.image,
});

export async function POST(req) {
  try {
    await connectToDB();

    const oldRefreshToken = req.cookies.get("refreshToken")?.value;

    if (!oldRefreshToken) {
      return unauthorized("Refresh token not found", "NO_REFRESH_TOKEN");
    }

    // Signature and expiry check before touching the database.
    const payload = verifyRefreshToken(oldRefreshToken);
    if (!payload) {
      return unauthorized("Invalid or expired refresh token", "INVALID_REFRESH_TOKEN");
    }

    /**
     * Minted before the claim so it can be recorded as the successor in the
     * same atomic update. It is discarded on any path other than "claimed".
     */
    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
    });

    // Atomically take ownership of the token. Only one concurrent caller wins.
    const { status, doc } = await claimRefreshToken(oldRefreshToken, newRefreshToken);

    /**
     * Another request rotated this token moments ago. Instead of logging the
     * user out, hand back the replacement token that request created. This is
     * what stops parallel 401s on page load from ending the session.
     */
    if (status === "grace") {
      const replacement = await findRefreshToken(doc.replacedByToken);

      if (!replacement) {
        return unauthorized("Refresh token no longer valid", "INVALID_REFRESH_TOKEN");
      }

      const user = replacement.userId;

      const accessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      let response = NextResponse.json(
        {
          message: "Token refreshed successfully",
          user: buildUserPayload(user),
        },
        { status: 200 }
      );

      return setAuthCookies(response, accessToken, replacement.token);
    }

    /**
     * The token was revoked well outside the grace window but is being
     * presented again. That is the classic replay signature, so every session
     * for this user is terminated.
     */
    if (status === "reused") {
      if (doc?.userId?._id) {
        await revokeAllUserTokens(doc.userId._id);
      }
      return unauthorized("Refresh token reuse detected", "TOKEN_REUSE");
    }

    if (status !== "claimed") {
      return unauthorized("Invalid refresh token", "INVALID_REFRESH_TOKEN");
    }

    const user = doc.userId;

    if (!user) {
      return unauthorized("User not found", "USER_NOT_FOUND");
    }

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await saveRefreshToken(user._id, newRefreshToken);

    /**
     * Bounded generously: the rotation timer fires every 12 minutes per tab, so
     * a low cap can delete a sibling tab's still-valid token and log it out.
     */
    await limitUserTokens(user._id, 20);

    let response = NextResponse.json(
      {
        message: "Token refreshed successfully",
        user: buildUserPayload(user),
      },
      { status: 200 }
    );

    return setAuthCookies(response, newAccessToken, newRefreshToken);
  } catch (error) {
    console.error("[Refresh] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}