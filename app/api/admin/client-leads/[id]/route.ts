import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

async function isAdminSession() {
  const cookieStore = await cookies();

  return cookieStore.get("investal-admin-session")?.value === "true";
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminSession())) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!id) {
    return Response.json({ ok: false, message: "Некоректний id заявки." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("client_leads").delete().eq("id", id);

  if (error) {
    console.error("CLIENT LEAD DELETE ERROR:", error);

    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
