import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPERVISOR") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In a real implementation we would fetch from DB
  const workers = [
    { id: "usr_1", name: "Worker User", role: "WORKER", specialty: "Painting" },
    { id: "usr_2", name: "John Smith", role: "WORKER", specialty: "Hardware" },
  ];

  return Response.json(workers);
}
