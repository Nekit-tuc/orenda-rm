"use client";

import { useState } from "react";

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
      `https://t.me/zt_space?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  return (
    <form
      onSubmit={submitForm}
      className="mt-10 rounded-[2rem] border border-[#b89652]/20 bg-[#070707] p-6"
    >
      <p className="text-sm uppercase tracking-[0.25em] text-[#b89652]">
        Заявка
      </p>

      <h3 className="mt-3 text-2xl font-bold">
        Залишити заявку на дзвінок
      </h3>

      <input
        required
        placeholder="Ваше ім’я"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-6 w-full rounded-xl border border-white/10 bg-black px-5 py-4 outline-none placeholder:text-white/30 focus:border-[#b89652]/60"
      />

      <input
        required
        placeholder="Телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mt-4 w-full rounded-xl border border-white/10 bg-black px-5 py-4 outline-none placeholder:text-white/30 focus:border-[#b89652]/60"
      />

      <button className="mt-5 w-full rounded-xl bg-[#b89652] px-6 py-4 font-medium text-white transition hover:opacity-80">
        Відправити заявку
      </button>
    </form>
  );
}