import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET() {
  return new Promise((resolve) => {
    // We use the absolute path to prisma schema to ensure it's found
    const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
    
    // Run prisma db push
    exec(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        resolve(NextResponse.json({ 
          error: error.message, 
          stderr, 
          stdout 
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
