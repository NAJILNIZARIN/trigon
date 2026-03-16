import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Step 1: Test database connection
    const userCount = await prisma.user.count();
    
    // Step 2: Check if admin user exists
    const admin = await prisma.user.findUnique({
      where: { email: "admin@trigon.com" },
      select: { id: true, name: true, email: true, role: true, password: true }
    });

    return NextResponse.json({
      status: "ok",
      dbConnected: true,
      userCount,
      adminExists: !!admin,
      adminHasPassword: !!admin?.password,
      authSecretSet: !!process.env.AUTH_SECRET,
      authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
      authUrlSet: !!process.env.AUTH_URL,
      authUrl: process.env.AUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      error: error.message,
      stack: error.stack?.slice(0, 500),
    }, { status: 500 });
  }
}

export const runtime = "nodejs";
