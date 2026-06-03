"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  function login(e: React.FormEvent) {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("zt-space-admin", "true");
      router.push("/admin");
      return;
    }

    alert("Невірний пароль");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <form
        onSubmit={login}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8"
      >
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/40">
          Admin Login
        </p>

        <h1 className="text-3xl font-bold">Вхід в адмінку</h1>

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-8 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none placeholder:text-white/30"
        />

        <button className="mt-5 w-full rounded-full bg-white px-6 py-4 font-medium text-black transition hover:opacity-80">
          Увійти
        </button>
      </form>
    </main>
  );
}