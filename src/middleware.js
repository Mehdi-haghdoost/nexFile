import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = [
  "/",
  "/login-register",
  "/api/auth/register",
  "/api/auth/login",
  "/api/test-db",
];

const AUTH_ROUTES = ["/login-register"];

const PROTECTED_ROUTES = [
  "/home",
  "/folder",
  "/paper-doc",
  "/pdf-editor",
  "/transfer",
];

async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
  const isApiRoute = pathname.startsWith("/api/");

  let user = null;
  if (token) {
    user = await verifyToken(token);
  }

  if (isApiRoute && !pathname.startsWith("/api/auth/")) {
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!user && isProtectedRoute) {
    const loginUrl = new URL("/login-register", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  if (user) {
    response.headers.set("x-user-id", user.userId);
    response.headers.set("x-user-email", user.email);
    response.headers.set("x-user-role", user.role);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};