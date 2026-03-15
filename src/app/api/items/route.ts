import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: { 
        department: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, departmentId, categoryId, basePrice, margin, finalPrice, status, breakdowns } = body;
    
    if (!name || basePrice === undefined || margin === undefined) {
      return NextResponse.json({ error: "Name, Base Price, and Margin are required" }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        name,
        departmentId: departmentId || null,
        categoryId: categoryId || null,
        basePrice: Number(basePrice),
        margin: Number(margin),
        finalPrice: Number(finalPrice),
        status: status || "Active",
        breakdowns: breakdowns && breakdowns.length > 0 ? {
          create: breakdowns.map((b: any) => ({
            name: b.name,
            amount: Number(b.amount)
          }))
        } : undefined
      },
      include: { department: true, category: true, breakdowns: true }
    });
    
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
