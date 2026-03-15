import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { department: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(categories);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, departmentId } = body;
    if (!name || !departmentId) {
      return NextResponse.json({ error: "Name and Department are required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name, departmentId },
      include: { department: true },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to create category" }, { status: 500 });
  }
}
