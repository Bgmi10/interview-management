import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
//@ts-ignore
import cookie from "cookie";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.token; 
  const isAuthenticated = !!token;
  const role = cookies.role;

  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthenticated && pathname !== "/login" && pathname !== "/signup") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (role === "Candidate" && pathname.startsWith("/dashboard/recruiter")) {
    return NextResponse.redirect(new URL("/dashboard/candidate", req.url));
  }

  if (role === "Recruiter" && pathname.startsWith("/dashboard/candidate")) {
    return NextResponse.redirect(new URL("/dashboard/recruiter", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/user", "/profile", "/dashboard/recruiter", "/settings", "/login", "/signup", "/api/auth/logout", "/setup", "/api/upload", "/api/delete-file", "/api/recruiter/jobs", "/api/recruiter/jobs/:id", "/dashboard/candidate", "/api/candidate/apply-job", "/api/candidate/profile", "/api/candidate/update-applicant", "/api/profile/profile-log", "/api/profile/profile-viewed", "/api/collage"],
};
    