import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("orendarm-admin-session");

  return Response.json({ ok: true });
}
