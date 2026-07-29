import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const allowedStatuses = ["new", "in_progress", "contacted", "closed", "spam"] as const;

async function isAdminSession() {
  const cookieStore = await cookies();

  return cookieStore.get("investal-admin-session")?.value === "true";
}

export async function GET() {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("client_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("CLIENT LEADS LOAD ERROR:", error);

    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, leads: data || [] });
}

export async function PATCH(request: Request) {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    id?: string;
    status?: string;
    admin_note?: string | null;
  } | null;

  if (!payload?.id) {
    return Response.json({ ok: false, message: "Некоректний id заявки." }, { status: 400 });
  }

  if (
    payload.status &&
    !allowedStatuses.includes(payload.status as (typeof allowedStatuses)[number])
  ) {
    return Response.json({ ok: false, message: "Некоректний статус." }, { status: 400 });
  }

  const updatePayload: Record<string, string | null> = {};

  if (payload.status) {
    updatePayload.status = payload.status;
  }

  if (typeof payload.admin_note !== "undefined") {
    updatePayload.admin_note = payload.admin_note?.trim() || null;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("client_leads")
    .update(updatePayload)
    .eq("id", payload.id);

  if (error) {
    console.error("CLIENT LEAD UPDATE ERROR:", error);

    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
