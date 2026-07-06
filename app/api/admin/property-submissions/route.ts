import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const allowedStatuses = ["new", "contacted", "rejected", "approved"] as const;

async function isAdminSession() {
  const cookieStore = await cookies();

  return cookieStore.get("orendarm-admin-session")?.value === "true";
}

export async function GET() {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("property_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("PROPERTY SUBMISSIONS LOAD ERROR:", error);

    return Response.json(
      { ok: false, message: "Не вдалося завантажити пропозиції." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, submissions: data || [] });
}

export async function PATCH(request: Request) {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    id?: string;
    status?: string;
  } | null;

  if (
    !payload?.id ||
    !payload.status ||
    !allowedStatuses.includes(payload.status as (typeof allowedStatuses)[number])
  ) {
    return Response.json({ ok: false, message: "Некоректний статус." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("property_submissions")
    .update({ status: payload.status })
    .eq("id", payload.id);

  if (error) {
    console.error("PROPERTY SUBMISSION STATUS UPDATE ERROR:", error);

    return Response.json(
      { ok: false, message: "Не вдалося змінити статус." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
