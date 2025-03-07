import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import cookie from "cookie";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.token; 
  const isAuthenticated = !!token;

  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthenticated && pathname !== "/login" && pathname !== "/signup") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/user", "/profile", "/dashboard", "/settings", "/login", "/signup", "/api/auth/logout", "/setup", "/api/upload", "/api/delete-file"],
};
    