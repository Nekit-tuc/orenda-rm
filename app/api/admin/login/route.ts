import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as {
    password?: string;
  };

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return Response.json(
      { ok: false, message: "Пароль адмінки не налаштований" },
      { status: 500 }
    );
  }

  if (!password || password !== adminPassword) {
    return Response.json(
      { ok: false, message: "Невірний пароль" },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  const isHttps = new URL(request.url).protocol === "https:";

  cookieStore.set("investal-admin-session", "true", {
    httpOnly: true,
    sameSite: "strict",
    secure: isHttps,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ ok: true });
}
