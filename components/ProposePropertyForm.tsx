"use client";

import { useMemo, useRef, useState } from "react";

type ProposePropertyFormProps = {
  rules: string[];
};

const propertyTypes = ["Земля", "Комерція", "Будинок"] as const;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 10 * 1024 * 1024;
const maxPhotos = 15;

export default function ProposePropertyForm({ rules }: ProposePropertyFormProps) {
  const [step, setStep] = useState<"rules" | "form">("rules");
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [propertyType, setPropertyType] = useState<(typeof propertyTypes)[number]>("Земля");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const isLand = propertyType === "Земля";
  const cadastralHelp = useMemo(
    () =>
      isLand
        ? "Для землі кадастровий номер і фото кадастрового плану обовʼязкові."
        : "Для комерції та будинку можна залишити, якщо є кадастрові дані.",
    [isLand]
  );

  function validateFiles(files: File[], required: boolean, label: string) {
    if (required && files.length < 1) {
      return `Додайте ${label}.`;
    }

    if (files.length > maxPhotos) {
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
    formData.set("propertyType", propertyType);

    const photos = formData
      .getAll("photos")
      .filter((item): item is File => item instanceof File && item.size > 0);
    const cadastralPhotos = formData
      .getAll("cadastralPhoto")
      .filter((item): item is File => item instanceof File && item.size > 0);

    const photosError = validateFiles(photos, true, "мінімум 1 фото обʼєкта");
    const cadastralError = validateFiles(
      cadastralPhotos,
      isLand,
      "фото кадастрового плану"
    );

    if (photosError || cadastralError) {
      setMessage(photosError || cadastralError);
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
    setPropertyType("Земля");
  }

  if (step === "rules") {
    return (
      <div className="rounded-3xl border border-[#b89652]/30 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-6 md:p-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b89652]">
            Правила
          </p>
          <h2 className="mt-3 text-2xl font-black leading-tight">
            Перед додаванням обʼєкта
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/62">
            Будь ласка, уважно ознайомтеся з обовʼязковими умовами.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          {rules.map((rule, index) => (
            <div
              key={rule}
              className="rounded-2xl border border-white/10 bg-black/35 p-4"
            >
              <p className="text-sm leading-6 text-white/72">
                <span className="mr-2 font-black text-[#d8ba68]">
                  {index + 1}.
                </span>
                {rule}
              </p>
            </div>
          ))}
        </div>

        <label className="mt-6 flex gap-3 rounded-2xl border border-[#b89652]/30 bg-[#b89652]/10 p-4">
          <input
            type="checkbox"
            checked={acceptedRules}
            onChange={(event) => setAcceptedRules(event.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-[#b89652]"
          />
          <span className="text-sm leading-6 text-white/78">
            Я уважно ознайомився(лася) з правилами та підтверджую, що надана
            мною інформація є достовірною.
          </span>
        </label>

        <button
          type="button"
          disabled={!acceptedRules}
          onClick={() => setStep("form")}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#d4af37]/55 bg-[#b89652] px-5 py-3 text-base font-black text-black shadow-[0_0_30px_rgba(184,150,82,0.28)] transition-all duration-300 hover:bg-[#d4af37] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Продовжити
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#b89652]/30 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-6 md:p-8"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b89652]">
            Форма
          </p>
          <h2 className="mt-3 text-2xl font-black leading-tight">
            Дані обʼєкта
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/62">
            Заповніть поля та додайте фото. Обʼєкт не буде опублікований без перевірки.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setStep("rules")}
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#b89652]/45 hover:text-[#d8ba68]"
        >
          Назад до правил
        </button>
      </div>

      <div className="grid gap-5">
        <section className="rounded-3xl border border-white/10 bg-black/30 p-4 sm:p-5">
          <h3 className="text-lg font-black">Контактні дані</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input required name="fullName" placeholder="ПІБ *" className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#d4af37]/70" />
            <input required name="phone" placeholder="Телефон *" inputMode="tel" className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#d4af37]/70" />
            <input name="telegram" placeholder="Telegram" className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#d4af37]/70" />
            <input name="email" type="email" placeholder="Email" className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#d4af37]/70" />
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/30 p-4 sm:p-5">
          <h3 className="text-lg font-black">Інформація про обʼєкт</h3>
          <div className="mt-4 grid gap-3">
            <div className="grid gap-2 sm:grid-cols-3">
              {propertyTypes.map((type) => (
                <label
                  key={type}
                  className={`flex min-h-12 items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    propertyType === type
                      ? "border-[#d4af37] bg-[#b89652]/15 text-[#d8ba68]"
                      : "border-white/10 bg-black/30 text-white/72"
                  }`}
                >
                  <input
                    type="radio"
                    name="propertyTypeRadio"
                    checked={propertyType === type}
                    onChange={() => setPropertyType(type)}
                    className="accent-[#b89652]"
                  />
                  {type}
                </label>
              ))}
            </div>

            <input required name="address" placeholder="Адреса *" className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#d4af37]/70" />
            <div className="grid gap-3 md:grid-cols-2">
              <input required name="area" placeholder="Площа *" className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#d4af37]/70" />
              <input required name="price" placeholder="Ціна *" className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#d4af37]/70" />
            </div>
            <textarea name="description" placeholder="Опис" className="min-h-28 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#d4af37]/70" />
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/30 p-4 sm:p-5">
          <h3 className="text-lg font-black">Кадастр</h3>
          <p className="mt-2 text-sm leading-6 text-white/52">{cadastralHelp}</p>
          <div className="mt-4 grid gap-3">
            <input
              required={isLand}
              name="cadastralNumber"
              placeholder={`Кадастровий номер${isLand ? " *" : ""}`}
              className="min-h-12 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#d4af37]/70"
            />
            <label className="grid gap-2 rounded-2xl border border-dashed border-[#b89652]/35 bg-black/45 p-4">
              <span className="text-sm font-semibold text-white/78">
                Фото кадастрового плану{isLand ? " *" : ""}
              </span>
              <input
                required={isLand}
                name="cadastralPhoto"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-[#b89652] file:px-4 file:py-2 file:font-bold file:text-black"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/30 p-4 sm:p-5">
          <h3 className="text-lg font-black">Фото обʼєкта</h3>
          <p className="mt-2 text-sm leading-6 text-white/52">
            Додайте від 1 до 15 фото. JPG, JPEG, PNG або WEBP до 10MB.
          </p>
          <label className="mt-4 grid gap-2 rounded-2xl border border-dashed border-[#b89652]/35 bg-black/45 p-4">
            <span className="text-sm font-semibold text-white/78">
              Додати фото *
            </span>
            <input
              required
              name="photos"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-[#b89652] file:px-4 file:py-2 file:font-bold file:text-black"
            />
          </label>
        </section>
      </div>

      {message && (
        <p
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm leading-5 ${
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
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#d4af37]/55 bg-[#b89652] px-5 py-3 text-base font-black text-black shadow-[0_0_30px_rgba(184,150,82,0.28)] transition-all duration-300 hover:bg-[#d4af37] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Надсилаємо..." : "Надіслати на перевірку"}
      </button>
    </form>
  );
}
