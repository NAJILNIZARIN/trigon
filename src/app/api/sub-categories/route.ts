import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const subCategories = await prisma.subCategory.findMany({ include: { category: true } });
    return NextResponse.json(subCategories);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, categoryId } = body;
    if (!name || !categoryId) return NextResponse.json({ error: "Name and Category ID are required" }, { status: 400 });

    const subCategory = await prisma.subCategory.create({ data: { name, categoryId } });
    return NextResponse.json(subCategory, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed" }, { status: 500 });
  }
}
