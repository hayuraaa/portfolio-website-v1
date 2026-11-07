import { NextResponse, type NextRequest } from "next/server";

// Optimistic check only: bounce visitors with no session cookie away from /admin.
// The real check (cookie matches a live session in the DB) happens in requireUser().
export function proxy(request: NextRequest) {
  if (!request.cookies.has("session")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
