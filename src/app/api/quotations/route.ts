import { auth } from "@/auth";
import prisma from "@/lib/prisma";
// import { Role } from "@prisma/client";
type Role = "ADMIN" | "SUPERVISOR" | "WORKER";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERVISOR") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, durationDays, workerIds } = await req.json();

  try {
    const quotation = await prisma.quotation.create({
      data: {
        title,
        description,
        durationDays,
        supervisorId: (session.user as any).id,
        status: "Active",
        assignedWorkers: {
          create: workerIds.map((id: string) => ({
            workerId: id,
          })),
        },
      },
      include: {
        assignedWorkers: true,
      },
    });

    return Response.json(quotation);
  } catch (error) {
    console.error("Error creating quotation:", error);
    return Response.json({ error: "Failed to create quotation" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user.role;
  const userId = (session.user as any).id;

  try {
    let quotations;

    if (role === "ADMIN") {
      quotations = await prisma.quotation.findMany({
        include: {
          supervisor: { select: { name: true } },
          assignedWorkers: { include: { worker: { select: { name: true } } } },
          progress: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (role === "SUPERVISOR") {
      quotations = await prisma.quotation.findMany({
        where: { supervisorId: userId },
        include: {
          assignedWorkers: { include: { worker: { select: { name: true } } } },
          progress: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Worker: Only quotations they are assigned to
      quotations = await prisma.quotation.findMany({
        where: {
          assignedWorkers: {
            some: { workerId: userId }
          }
        },
        include: {
          supervisor: { select: { name: true } },
          progress: {
            where: { workerId: userId }
          }
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return Response.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return Response.json({ error: "Failed to fetch quotations" }, { status: 500 });
  }
}
