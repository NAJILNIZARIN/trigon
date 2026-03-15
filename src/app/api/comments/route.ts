import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { quotationId, content } = await req.json();
  const userId = (session.user as any).id;

  try {
    const comment = await prisma.comment.create({
      data: {
        quotationId,
        userId,
        content,
      },
      include: {
        user: { select: { name: true, role: true } },
      },
    });

    return Response.json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return Response.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
