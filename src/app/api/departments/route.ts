import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(departments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch departments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const department = await prisma.department.create({
      data: { name },
    });
    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create department" }, { status: 500 });
  }
}
