import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("orendarm-admin-session")?.value === "true";

  return Response.json({ ok: isAdmin });
}
