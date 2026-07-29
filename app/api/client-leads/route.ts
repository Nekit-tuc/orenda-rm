import { headers } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type ClientLeadPayload = {
  client_name?: string;
  phone?: string;
  property_id?: number | null;
  property_slug?: string | null;
  property_title?: string | null;
  source?: string;
  website?: string;
};

const rateLimitWindowMs = 15 * 60 * 1000;
const maxRequestsPerWindow = 5;
const rateLimitStore = new Map<string, number[]>();

function getClientIp(headersList: Headers) {
  const forwardedFor = headersList.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recentRequests = (rateLimitStore.get(ip) || []).filter(
    (timestamp) => now - timestamp < rateLimitWindowMs
  );

  if (recentRequests.length >= maxRequestsPerWindow) {
    rateLimitStore.set(ip, recentRequests);
    return true;
  }

  rateLimitStore.set(ip, [...recentRequests, now]);
  return false;
}

function normalizePhone(value: string) {
  return value.replace(/[\s\-()]/g, "").trim();
}

function isValidPhone(value: string) {
  return /^(?:0\d{9}|\+380\d{9}|380\d{9})$/.test(value);
}

function normalizeName(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | ClientLeadPayload
    | null;

  if (!payload) {
    return Response.json(
      { ok: false, message: "Некоректні дані заявки." },
      { status: 400 }
    );
  }

  if (payload.website?.trim()) {
    return Response.json({ ok: true });
  }

  const headersList = await headers();
  const ip = getClientIp(headersList);

  if (isRateLimited(ip)) {
    return Response.json(
      { ok: false, message: "Забагато заявок. Спробуйте трохи пізніше." },
      { status: 429 }
    );
  }

  const clientName = normalizeName(payload.client_name || "");
  const phone = normalizePhone(payload.phone || "");

  if (clientName.length < 2) {
    return Response.json(
      { ok: false, message: "Вкажіть ім’я мінімум з 2 символів." },
      { status: 400 }
    );
  }

  if (!isValidPhone(phone)) {
    return Response.json(
      { ok: false, message: "Вкажіть телефон у форматі 0964882271, 380964882271 або +380964882271." },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("client_leads").insert({
      property_id: payload.property_id ?? null,
      property_slug: payload.property_slug?.trim() || null,
      property_title: payload.property_title?.trim() || null,
      client_name: clientName,
      phone,
      source: payload.source?.trim() || "property_callback_form",
    });

    if (error) {
      console.error("CLIENT LEAD INSERT ERROR:", error);

      return Response.json(
        { ok: false, message: "Не вдалося зберегти заявку." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("CLIENT LEAD API ERROR:", error);

    return Response.json(
      { ok: false, message: "Не вдалося зберегти заявку." },
      { status: 500 }
    );
  }
}
