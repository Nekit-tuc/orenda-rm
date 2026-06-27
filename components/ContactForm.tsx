"use client";

import { useState } from "react";
import { SendIcon } from "@/components/PremiumIcons";

type ContactFormProps = {
  propertyTitle: string;
  propertyId: number;
};

export default function ContactForm({
  propertyTitle,
  propertyId,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function submitForm(e: React.FormEvent) {
    e.preventDefault();

    const message = `Добрий день! Цікавить об'єкт:

${propertyTitle}
ID: ${propertyId}

Мене звати: ${name}
Телефон: ${phone}`;

    window.open(
      `https://t.me/orenda_rm?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  return (
    <form
      onSubmit={submitForm}
      className="mt-6 rounded-2xl border border-[#b89652]/20 bg-[#070707] p-4 md:p-5"
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#b89652]">
        Заявка
      </p>

      <h3 className="mt-2 text-lg font-extrabold md:text-xl">
        Залишити заявку на дзвінок
      </h3>

      <input
        required
        placeholder="Ваше ім’я"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-4 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#b89652]/60"
      />

      <input
        required
        placeholder="Телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#b89652]/60"
      />

      <button className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#b89652]/45 bg-[#b89652]/10 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_22px_rgba(184,150,82,0.14)] backdrop-blur transition-all duration-300 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black hover:shadow-[0_0_28px_rgba(212,175,55,0.26)] focus:outline-none focus:ring-2 focus:ring-[#b89652] [&>svg]:text-[#d8ba68] hover:[&>svg]:text-black">
        <SendIcon />
        Відправити заявку
      </button>
    </form>
  );
}
