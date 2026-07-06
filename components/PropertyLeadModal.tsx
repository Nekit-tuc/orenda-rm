"use client";

import { useState } from "react";
import { setPropertyLeadAccess } from "@/lib/propertyLeadAccess";

type PropertyLeadModalProps = {
  isOpen: boolean;
  propertyId: number;
  propertyTitle: string;
  propertySlug: string;
  source?: string;
  onClose?: () => void;
  onSuccess: () => void;
};

function isValidFullName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  return (
    parts.length >= 2 &&
    parts.every((part) => /^[A-Za-zА-Яа-яІіЇїЄєҐґ'’ʼ-]{2,}$/.test(part))
  );
}

function isValidPhone(value: string) {
  return /^0\d{9}$/.test(value.trim());
}

export default function PropertyLeadModal({
  isOpen,
  propertyId,
  propertyTitle,
  propertySlug,
  source = "property_card",
  onClose,
  onSuccess,
}: PropertyLeadModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!isValidFullName(fullName)) {
      setMessage("Вкажіть прізвище та імʼя. По батькові можна не вводити.");
      return;
    }

    if (!isValidPhone(phone)) {
      setMessage("Телефон має бути у форматі 0961212121.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/property-leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        phone,
        propertyId,
        propertyTitle,
        propertySlug,
        source,
      }),
    });

    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
    } | null;

    setIsSubmitting(false);

    if (!response.ok || !result?.ok) {
      setMessage(result?.message || "Не вдалося зберегти заявку.");
      return;
    }

    setPropertyLeadAccess();
    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/82 px-4 py-6 backdrop-blur-xl">
      <button
        type="button"
        aria-label="Закрити"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[430px] overflow-hidden rounded-3xl border border-[#b89652]/35 bg-[#090909] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.62)] sm:p-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,150,82,0.18),transparent_42%)]" />

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b89652]">
            Orenda RM
          </p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-white">
            Отримати доступ до ціни
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/62">
            Залиште контакти, щоб переглянути ціну та деталі обʼєкта.
          </p>

          <div className="mt-5 grid gap-3">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-white/70">ПІБ</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Іваненко Іван"
                autoComplete="name"
                className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/28 focus:border-[#d4af37]/70 focus:ring-2 focus:ring-[#b89652]/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-white/70">Телефон</span>
              <input
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="0961212121"
                inputMode="numeric"
                autoComplete="tel"
                className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/28 focus:border-[#d4af37]/70 focus:ring-2 focus:ring-[#b89652]/25"
              />
            </label>
          </div>

          {message && (
            <p className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-100">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#d4af37]/55 bg-[#b89652] px-5 py-3 text-base font-black text-black shadow-[0_0_30px_rgba(184,150,82,0.28)] transition-all duration-300 hover:bg-[#d4af37] hover:shadow-[0_0_38px_rgba(212,175,55,0.36)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/70 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Зберігаємо..." : "Переглянути обʼєкт"}
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-white/38">
            Ми не зберігаємо персональні дані в localStorage, тільки факт доступу.
          </p>
        </div>
      </form>
    </div>
  );
}
