import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isPublicRoute = nextUrl.pathname === "/login";
  const isAuthRoute = nextUrl.pathname.startsWith("/api/auth");

  if (isAuthRoute) return NextResponse.next();

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  /*
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }
  */

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
