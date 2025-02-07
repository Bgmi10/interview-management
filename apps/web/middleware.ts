import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import cookie from "cookie";

// Middleware to protect routes and check authentication
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Get token from cookies
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.token;  // Token from cookies (if exists)

  // Check if the user is authenticated (has a token)
  const isAuthenticated = !!token;

  // If the user is authenticated, redirect them away from /login or /signup pages
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url)); // Or redirect to any page like /profile
  }

  // If the user is not authenticated and tries to access protected routes, redirect to login
  if (!isAuthenticated && pathname !== "/login" && pathname !== "/signup") {
    return NextResponse.redirect(new URL("/login", req.url));  // Redirect unauthenticated users to /login
  }

  // Allow access to login, signup, and protected routes as needed
  return NextResponse.next();
}

// Define which paths the middleware should apply to
export const config = {
  matcher: ["/user", "/profile", "/dashboard", "/settings", "/login", "/signup", "/api/auth/"],
};
