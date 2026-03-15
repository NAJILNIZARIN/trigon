const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function test() {
  console.log("Reading .env manually...");
  const envContent = fs.readFileSync('.env', 'utf8');
  const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
  
  if (!dbUrlMatch) {
    console.error("DATABASE_URL not found in .env");
    return;
  }
  
  const dbUrl = dbUrlMatch[1];
  console.log("Explicit URL from .env:", dbUrl.replace(/:[^:@]+@/, ':****@').replace(/\?.*/, ''));

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

  try {
    const start = Date.now();
    await prisma.$connect();
    console.log(`Connected successfully in ${Date.now() - start}ms`);
    const userCount = await prisma.user.count();
    console.log(`Current user count: ${userCount}`);
  } catch (err) {
    console.error("Connection failed:");
    console.error(err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
