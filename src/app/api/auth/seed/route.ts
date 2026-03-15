import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const password = await bcrypt.hash("admin123", 10);
    
    const users = [
      { name: "Admin User", email: "admin@trigon.com", role: "ADMIN" },
      { name: "Supervisor User", email: "supervisor@trigon.com", role: "SUPERVISOR" },
      { name: "Worker User", email: "worker@trigon.com", role: "WORKER" },
    ];

    for (const u of users) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          ...u,
          password,
        },
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
