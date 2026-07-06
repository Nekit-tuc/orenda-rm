"use client";

import { useRef, useState } from "react";

type SubmitPropertyButtonProps = {
  className?: string;
  label?: string;
};

const objectTypes = ["Земля", "Комерція", "Будинок"] as const;
const maxFiles = 15;
const maxFileSize = 10 * 1024 * 1024;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export default function SubmitPropertyButton({
  className = "",
  label = "Запропонувати обʼєкт",
}: SubmitPropertyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  function validateFiles(files: File[]) {
    if (files.length < 1) {
      return "Додайте мінімум 1 фото обʼєкта або плану.";
    }

    if (files.length > maxFiles) {
      return "Можна додати максимум 15 фото.";
    }

    const invalidFile = files.find(
      (file) => !allowedMimeTypes.includes(file.type) || file.size > maxFileSize
    );

    if (invalidFile) {
      return "Фото мають бути jpg, jpeg, png або webp до 10MB.";
    }

    return "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = formData
      .getAll("photos")
      .filter((item): item is File => item instanceof File && item.size > 0);
    const fileError = validateFiles(files);

    if (fileError) {
      setMessage(fileError);
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/property-submissions", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
    } | null;

    setIsSubmitting(false);

    if (!response.ok || !result?.ok) {
      setMessage(result?.message || "Не вдалося надіслати обʼєкт.");
      return;
    }

    setIsSuccess(true);
    setMessage(
      "Дякуємо! Ваш обʼєкт надіслано на перевірку. Ми звʼяжемося з вами найближчим часом."
    );
    formRef.current?.reset();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setMessage("");
          setIsSuccess(false);
        }}
        className={
          className ||
          "inline-flex items-center justify-center rounded-2xl border border-[#b89652]/45 bg-black/35 px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_20px_rgba(184,150,82,0.12)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652]/12 hover:text-[#d8ba68] focus:outline-none focus:ring-2 focus:ring-[#d8ba68]"
        }
      >
        {label}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[140] overflow-y-auto bg-black/82 px-4 py-5 text-white backdrop-blur-xl">
          <button
            type="button"
            aria-label="Закрити"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 cursor-default"
          />

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-[#b89652]/35 bg-[#090909] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.66)] sm:p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,150,82,0.16),transparent_42%)]" />

            <div className="relative">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b89652]">
                    Orenda RM
                  </p>
                  <h2 className="mt-3 text-2xl font-black leading-tight">
                    Запропонувати обʼєкт
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    Надішліть дані власника та фото. Обʼєкт побачить тільки адміністратор.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-xl text-white/70 transition hover:border-[#b89652]/50 hover:text-[#d8ba68]"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-white/70">ПІБ власника *</span>
                  <input
                    required
                    name="fullName"
                    autoComplete="name"
                    className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none transition placeholder:text-white/28 focus:border-[#d4af37]/70"
                    placeholder="Іваненко Іван"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Телефон *</span>
                  <input
                    required
                    name="phone"
                    inputMode="tel"
                    autoComplete="tel"
                    className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none transition placeholder:text-white/28 focus:border-[#d4af37]/70"
                    placeholder="0961212121"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Telegram</span>
                  <input
                    name="telegram"
                    className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none transition placeholder:text-white/28 focus:border-[#d4af37]/70"
                    placeholder="@username"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Тип обʼєкта *</span>
                  <select
                    required
                    name="objectType"
                    className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none transition focus:border-[#d4af37]/70"
                  >
                    {objectTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm text-white/70">Адреса *</span>
                  <input
                    required
                    name="address"
                    className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none transition placeholder:text-white/28 focus:border-[#d4af37]/70"
                    placeholder="Житомир, адреса обʼєкта"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Площа *</span>
                  <input
                    required
                    name="area"
                    className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none transition placeholder:text-white/28 focus:border-[#d4af37]/70"
                    placeholder="100 м² або 12 соток"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Ціна *</span>
                  <input
                    required
                    name="price"
                    className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none transition placeholder:text-white/28 focus:border-[#d4af37]/70"
                    placeholder="48000 грн/міс або 75000 $"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm text-white/70">
                    Кадастровий номер *
                  </span>
                  <input
                    required
                    name="cadastralNumber"
                    className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none transition placeholder:text-white/28 focus:border-[#d4af37]/70"
                    placeholder="182208..."
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm text-white/70">
                    Фото обʼєкта, запису чи плану * (1-15 фото)
                  </span>
                  <input
                    required
                    name="photos"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    multiple
                    className="min-h-12 rounded-2xl border border-dashed border-[#b89652]/35 bg-black/45 px-4 py-3 text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-[#b89652] file:px-4 file:py-2 file:font-bold file:text-black"
                  />
                  <span className="text-xs leading-5 text-white/42">
                    До 10MB кожне. Обовʼязково додайте фото запису/плану або фото обʼєкта.
                  </span>
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm text-white/70">Коментар / опис</span>
                  <textarea
                    name="description"
                    className="min-h-28 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none transition placeholder:text-white/28 focus:border-[#d4af37]/70"
                    placeholder="Що важливо знати про обʼєкт?"
                  />
                </label>
              </div>

              {message && (
                <p
                  className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-5 ${
                    isSuccess
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                      : "border-red-400/25 bg-red-500/10 text-red-100"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#d4af37]/55 bg-[#b89652] px-5 py-3 text-base font-black text-black shadow-[0_0_30px_rgba(184,150,82,0.28)] transition-all duration-300 hover:bg-[#d4af37] hover:shadow-[0_0_38px_rgba(212,175,55,0.36)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/70 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Надсилаємо..." : "Надіслати на перевірку"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
