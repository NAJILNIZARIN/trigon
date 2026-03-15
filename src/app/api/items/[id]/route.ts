import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await prisma.item.findUnique({
      where: { id },
      include: { 
        department: true, 
        category: true, 
        subCategory: true,
        breakdowns: true 
      }
    });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch item details" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { 
      name, departmentId, categoryId, subCategoryId,
      spec1, spec2, spec3, unit, tags,
      basePrice, margin, finalPrice, status, breakdowns 
    } = body;

    // Delete existing breakdowns and create new ones
    const item = await prisma.item.update({
      where: { id },
      data: {
        name,
        departmentId: departmentId || null,
        categoryId: categoryId || null,
        subCategoryId: subCategoryId || null,
        spec1: spec1 || null,
        spec2: spec2 || null,
        spec3: spec3 || null,
        unit: unit || "Nos",
        tags: tags || null,
        basePrice: Number(basePrice),
        margin: Number(margin),
        finalPrice: Number(finalPrice),
        status: status || "Active",
        breakdowns: {
          deleteMany: {},
          create: breakdowns ? breakdowns.map((b: any) => ({
            name: b.name,
            amount: Number(b.amount)
          })) : []
        }
      },
      include: { department: true, category: true, subCategory: true, breakdowns: true }
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.item.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
