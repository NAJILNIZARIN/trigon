import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, categoryId } = body;

    const subCategory = await prisma.subCategory.update({
      where: { id },
      data: { name, categoryId },
      include: { category: true },
    });
    return NextResponse.json(subCategory);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to update sub-category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.subCategory.delete({ where: { id } });
    return NextResponse.json({ message: "Sub-category deleted" });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to delete sub-category" }, { status: 500 });
  }
}
