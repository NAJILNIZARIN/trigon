import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { quotationId, dayNumber, content } = await req.json();
  const userId = (session.user as any).id;

  try {
    const progress = await prisma.workProgress.create({
      data: {
        quotationId,
        workerId: userId,
        dayNumber,
        content,
      },
    });

    return Response.json(progress);
  } catch (error) {
    console.error("Error logging progress:", error);
    return Response.json({ error: "Failed to log progress" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const quotationId = searchParams.get("quotationId");

  if (!quotationId) return Response.json({ error: "Missing quotationId" }, { status: 400 });

  try {
    const progress = await prisma.workProgress.findMany({
      where: { quotationId },
      include: {
        worker: { select: { name: true } },
      },
      orderBy: { dayNumber: "asc" },
    });

    return Response.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return Response.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
