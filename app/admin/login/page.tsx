"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      router.replace("/admin");
      return;
    }

    const result = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    alert(result?.message || "Невірний пароль");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030712] px-4 text-white sm:px-6">
      <form
        onSubmit={login}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-blue-950/20 backdrop-blur-xl sm:p-8"
      >
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/40">
          Admin Login
        </p>

        <h1 className="text-3xl font-bold">Вхід в адмінку</h1>

        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-8 w-full rounded-2xl border border-white/10 bg-[#030712] px-5 py-4 outline-none transition placeholder:text-white/30 focus:border-blue-300/60 focus:ring-2 focus:ring-blue-300/30"
        />

        <button
          disabled={isSubmitting}
          className="mt-5 w-full rounded-2xl bg-blue-500 px-6 py-4 font-medium text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Перевірка..." : "Увійти"}
        </button>
      </form>
    </main>
  );
}
