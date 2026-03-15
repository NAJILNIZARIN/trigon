import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: { 
        department: true,
        category: true,
        subCategory: true,
        breakdowns: true
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to fetch items" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, departmentId, categoryId, subCategoryId,
      spec1, spec2, spec3, unit, tags,
      basePrice, margin, finalPrice, status, breakdowns 
    } = body;
    
    if (!name || basePrice === undefined || margin === undefined) {
      return NextResponse.json({ error: "Name, Base Price, and Margin are required" }, { status: 400 });
    }

    const item = await prisma.item.create({
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
        breakdowns: breakdowns && breakdowns.length > 0 ? {
          create: breakdowns.map((b: { name: string; amount: number }) => ({
            name: b.name,
            amount: Number(b.amount)
          }))
        } : undefined
      },
      include: { department: true, category: true, subCategory: true, breakdowns: true }
    });
    
    return NextResponse.json(item, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message || "Failed to create item" }, { status: 500 });
  }
}
