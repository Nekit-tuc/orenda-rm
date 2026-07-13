import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("investal-admin-session")?.value === "true";

  if (!isAdmin) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("property_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("PROPERTY LEADS LOAD ERROR:", error);

      return Response.json(
        {
          ok: false,
          message:
            "Не вдалося завантажити ліди. Перевірте RLS для property_leads або додайте SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, leads: data || [] });
  } catch (error) {
    console.error("PROPERTY LEADS API ERROR:", error);

    return Response.json(
      {
        ok: false,
        message:
          "Не вдалося завантажити ліди. Перевірте Supabase env та таблицю property_leads.",
      },
      { status: 500 }
    );
  }
}
