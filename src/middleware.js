// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const PUBLIC_ROUTES = [
//   "/",
//   "/login-register",
//   "/api/auth/register",
//   "/api/auth/login",
//   "/api/test-db",
//   "/request",
// ];

// const AUTH_ROUTES = ["/login-register"];

// const PROTECTED_ROUTES = [
//   "/home",
//   "/folder",
//   "/paper-doc",
//   "/pdf-editor",
//   "/transfer",
//   "/invite", // Accepting an org invite requires being logged in
// ];

// async function verifyToken(token) {
//   try {
//     const secret = new TextEncoder().encode(
//       process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production"
//     );
//     const { payload } = await jwtVerify(token, secret);
//     return payload;
//   } catch (error) {
//     return null;
//   }
// }

// export async function middleware(request) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("token")?.value;

//   const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
//   const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
//   const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
//   const isApiRoute = pathname.startsWith("/api/");
//   const isPublicApiRoute = pathname.startsWith("/api/public/");

//   let user = null;
//   if (token) {
//     user = await verifyToken(token);
//   }

//   // Public API routes (file-request landing page) never require auth
//   if (isApiRoute && !pathname.startsWith("/api/auth/") && !isPublicApiRoute) {
//     if (!user) {
//       return NextResponse.json(
//         { message: "Unauthorized" },
//         { status: 401 }
//       );
//     }
//   }

//   if (user && isAuthRoute) {
//     return NextResponse.redirect(new URL("/home", request.url));
//   }

//   if (!user && isProtectedRoute) {
//     const loginUrl = new URL("/login-register", request.url);
//     loginUrl.searchParams.set("redirect", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   const response = NextResponse.next();
//   if (user) {
//     response.headers.set("x-user-id", user.userId);
//     response.headers.set("x-user-email", user.email);
//     response.headers.set("x-user-role", user.role);
//   }

//   return response;
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Page routes reachable without authentication.
 * "/" is matched exactly: using startsWith would make every path public.
 */
const PUBLIC_PAGE_ROUTES = [
  { path: "/", exact: true },
  { path: "/login-register", exact: false },
  { path: "/request", exact: false },
];

/** API prefixes that manage their own auth or are intentionally open. */
const PUBLIC_API_PREFIXES = ["/api/auth/", "/api/public/", "/api/test-db"];

const AUTH_ROUTES = ["/login-register"];

const PROTECTED_ROUTES = [
  "/home",
  "/folder",
  "/paper-doc",
  "/pdf-editor",
  "/transfer",
  "/invite",
];

const getSecret = () =>
  new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET ||
      "nexfile-dev-secret-key-2024-change-in-production"
  );

async function verifyToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

const matchesAny = (pathname, routes) =>
  routes.some((route) =>
    route.exact ? pathname === route.path : pathname.startsWith(route.path)
  );

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const user = await verifyToken(accessToken);

  /**
   * The access token lives 15 minutes, the refresh token 30 days. When only the
   * refresh token is still valid the session is very much alive: the client just
   * has not rotated yet. Redirecting to login here is what made sessions look
   * like they expired early, so instead the request is allowed through and the
   * client-side refresh flow takes over.
   */
  const canRefresh = !user && Boolean(await verifyToken(refreshToken));

  const isApiRoute = pathname.startsWith("/api/");
  const isPublicApiRoute = PUBLIC_API_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Protected API routes always demand a valid access token. The response code
  // tells the client whether refreshing is worth attempting.
  if (isApiRoute && !isPublicApiRoute) {
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          code: canRefresh ? "TOKEN_EXPIRED" : "UNAUTHENTICATED",
        },
        { status: 401 }
      );
    }
  }

  /**
   * Only a fully valid access token bounces the user away from the login page.
   * Redirecting on `canRefresh` alone would trap anyone whose refresh token was
   * revoked server-side in a login -> home -> login loop.
   */
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!user && !canRefresh && isProtectedRoute) {
    const loginUrl = new URL("/login-register", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /**
   * Identity headers belong on the REQUEST so route handlers can read them.
   * Setting them on the response would leak the user id and role to the browser
   * while giving the server nothing.
   */
  const requestHeaders = new Headers(request.headers);

  // Strip any inbound values first, otherwise a client could spoof them.
  requestHeaders.delete("x-user-id");
  requestHeaders.delete("x-user-email");
  requestHeaders.delete("x-user-role");

  if (user) {
    requestHeaders.set("x-user-id", String(user.userId ?? ""));
    requestHeaders.set("x-user-email", String(user.email ?? ""));
    requestHeaders.set("x-user-role", String(user.role ?? ""));
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};