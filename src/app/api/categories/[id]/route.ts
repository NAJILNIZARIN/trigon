import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { name, departmentId } = body;
    const { id } = await params;
    const category = await prisma.category.update({
      where: { id },
      data: { name, departmentId },
      include: { department: true },
    });
    return NextResponse.json(category);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed" }, { status: 500 });
  }
}
```
