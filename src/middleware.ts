import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get access token from cookies
  const accessToken = request.cookies.get("access_token")?.value;

  const { pathname } = request.nextUrl;

  // Define protected routes - dashboard and all related routes
  const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/exam",
    "/my-book",
    "/profile",
    "/question",
    "/result",
    "/team",
    "/youtube",
    "/guideline",
  ];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If trying to access protected route without token -> redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access login page -> redirect to dashboard
  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};