import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const cookieStore = await cookies();

  // Delete all possible NextAuth session cookies
  const cookieNames = [
    "authjs.session-token",
    "authjs.csrf-token",
    "authjs.callback-url",
    "__Secure-authjs.session-token",
    "__Secure-authjs.csrf-token",
    "__Secure-authjs.callback-url",
    "next-auth.session-token",
    "next-auth.csrf-token",
    "next-auth.callback-url",
  ];

  const response = NextResponse.redirect(`${origin}/login`, { status: 302 });

  for (const name of cookieNames) {
    response.cookies.set(name, "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  }

  return response;
}

export const runtime = "nodejs";
