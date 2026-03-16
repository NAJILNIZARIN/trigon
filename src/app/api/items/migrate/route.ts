import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Add the missing column directly via SQL
    // We use executeRawUnsafe for maximum flexibility
    await prisma.$executeRawUnsafe(`ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "description" TEXT;`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Database schema updated successfully (Description column added)." 
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
