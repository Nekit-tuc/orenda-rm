import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("orendarm-admin-session")?.value === "true";

  if (!isAdmin) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("property_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("PROPERTY LEADS LOAD ERROR:", error);

    return Response.json(
      { ok: false, message: "Не вдалося завантажити ліди." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, leads: data || [] });
}
