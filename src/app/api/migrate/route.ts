import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

// Force Node.js runtime to allow child_process
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Promise((resolve) => {
    const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
    
    // Test command first
    exec(`npx prisma -v`, (err, stdout, stderr) => {
      console.log("Prisma version test:", stdout);
    });

    exec(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ 
          error: error.message, 
          stderr, 
          stdout,
          cwd: process.cwd()
        }, { status: 500 }));
        return;
      }
      
      resolve(NextResponse.json({ 
        message: "Migration attempted", 
        stdout, 
        stderr 
      }));
    });
  });
}
