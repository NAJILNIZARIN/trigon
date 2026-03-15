import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { name } = body;
    // Need await params in Next.js 15+ sometimes, but params as any usually avoids issues. Wait, params is an object containing string.
    const { id } = await params; // Keep this line as params is a Promise
    const dept = await prisma.department.update({ // Changed from findUnique to update to match original intent, but using new structure
      where: { id: id }, // Use the awaited 'id'
      data: { name },
    });
    return NextResponse.json(dept);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.department.delete({
      where: { id: id }, // Use the awaited 'id'
    });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed" }, { status: 500 });
  }
}
