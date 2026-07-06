import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type LeadPayload = {
  fullName?: string;
  phone?: string;
  propertyId?: number;
  propertyTitle?: string;
  propertySlug?: string;
  source?: string;
};

function isValidFullName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  return (
    parts.length >= 2 &&
    parts.every((part) => /^[\p{L}'’ʼ-]{2,}$/u.test(part))
  );
}

function isValidPhone(value: string) {
  return /^0\d{9}$/.test(value.trim());
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as LeadPayload | null;

  if (!payload) {
    return Response.json({ ok: false, message: "Некоректні дані." }, { status: 400 });
  }

  const fullName = payload.fullName?.trim() || "";
  const phone = payload.phone?.trim() || "";

  if (!isValidFullName(fullName)) {
    return Response.json(
      {
        ok: false,
        message: "Вкажіть прізвище та імʼя. По батькові можна не вводити.",
      },
      { status: 400 }
    );
  }

  if (!isValidPhone(phone)) {
    return Response.json(
      { ok: false, message: "Телефон має бути у форматі 0961212121." },
      { status: 400 }
    );
  }

  try {
    const headersList = await headers();
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.from("property_leads").insert({
      full_name: fullName,
      phone,
      property_id: payload.propertyId ?? null,
      property_title: payload.propertyTitle?.trim() || null,
      property_slug: payload.propertySlug?.trim() || null,
      source: payload.source?.trim() || "price_access",
      user_agent: headersList.get("user-agent"),
    });

    if (error) {
      console.error("PROPERTY LEAD INSERT ERROR:", error);

      return Response.json(
        {
          ok: false,
          message:
            "Не вдалося зберегти заявку. Перевірте таблицю property_leads у Supabase.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("PROPERTY LEAD API ERROR:", error);

    return Response.json(
      {
        ok: false,
        message:
          "Не вдалося зберегти заявку. Перевірте Supabase env та SQL для property_leads.",
      },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
