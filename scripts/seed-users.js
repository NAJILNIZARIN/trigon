const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed script...");
  const password = await bcrypt.hash("admin123", 10);
  console.log("Password hashed.");
  
  const users = [
    { name: "Admin User", email: "admin@trigon.com", role: "ADMIN" },
    { name: "Supervisor User", email: "supervisor@trigon.com", role: "SUPERVISOR" },
    { name: "Worker User", email: "worker@trigon.com", role: "WORKER" },
  ];

  for (const u of users) {
    try {
      console.log(`Checking user: ${u.email}...`);
      const existing = await prisma.user.findUnique({ where: { email: u.email } });
      if (existing) {
        console.log(`User ${u.email} exists. Skipping.`);
      } else {
        await prisma.user.create({
          data: {
            ...u,
            password,
          },
        });
        console.log(`User ${u.name} (${u.role}) created.`);
      }
    } catch (err) {
      console.error(`Error for ${u.email}:`, err.message || err);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
