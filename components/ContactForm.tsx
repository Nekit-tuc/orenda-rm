"use client";

import { useRef, useState, type FormEvent } from "react";
import { SendIcon } from "@/components/PremiumIcons";
import { analyticsEvents } from "@/lib/analytics";

type ContactFormProps = {
  propertyTitle: string;
  propertyId: number;
  propertySlug?: string;
  propertyType?: string;
  dealType?: string;
};

const successMessage =
  "Заявку успішно надіслано. Ми зв’яжемося з вами найближчим часом.";
const errorMessage =
  "Не вдалося надіслати заявку. Спробуйте ще раз або зв’яжіться з нами телефоном.";

function normalizePhone(value: string) {
  return value.replace(/[\s\-()]/g, "").trim();
}

function isValidPhone(value: string) {
  return /^(?:0\d{9}|\+380\d{9}|380\d{9})$/.test(value);
}

export default function ContactForm({
  propertyTitle,
  propertyId,
  propertySlug,
  propertyType,
  dealType,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitInProgressRef = useRef(false);

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitInProgressRef.current) {
      return;
    }

    const clientName = name.replace(/\s+/g, " ").trim();
    const normalizedPhone = normalizePhone(phone);

    if (clientName.length < 2 || !isValidPhone(normalizedPhone)) {
      setIsError(true);
      setMessage(errorMessage);
      analyticsEvents.formSubmitError({
        form_name: "object_callback_form",
        page_path: window.location.pathname,
        error_type: "validation",
      });
      return;
    }

    submitInProgressRef.current = true;
    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/client-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_name: clientName,
          phone: normalizedPhone,
          property_id: propertyId,
          property_slug: propertySlug,
          property_title: propertyTitle,
          source: "property_callback_form",
          website,
        }),
      });

      if (!response.ok) {
        analyticsEvents.formSubmitError({
          form_name: "object_callback_form",
          page_path: window.location.pathname,
          error_type: response.status === 429 ? "server" : "server",
        });
        setIsError(true);
        setMessage(errorMessage);
        return;
      }

      setName("");
      setPhone("");
      setWebsite("");
      setIsError(false);
      setMessage(successMessage);
      analyticsEvents.generateLead({
        lead_source: "contact_form",
        form_name: "object_callback_form",
        page_path: window.location.pathname,
        object_id: propertyId,
        object_slug: propertySlug,
        object_type: propertyType,
        deal_type: dealType,
      });
    } catch (error) {
      console.error("CLIENT LEAD FORM ERROR:", error);
      setIsError(true);
      setMessage(errorMessage);
      analyticsEvents.formSubmitError({
        form_name: "object_callback_form",
        page_path: window.location.pathname,
        error_type: "network",
      });
    } finally {
      setIsSubmitting(false);
      submitInProgressRef.current = false;
    }
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
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="sr-only"
        aria-hidden="true"
      />

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
        inputMode="tel"
        className="mt-3 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#b89652]/60"
      />

      {message && (
        <p
          className={`mt-3 text-sm leading-5 ${
            isError ? "text-red-300" : "text-[#d8ba68]"
          }`}
        >
          {message}
        </p>
      )}

      <button
        disabled={isSubmitting}
        className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#b89652]/45 bg-[#b89652]/10 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_22px_rgba(184,150,82,0.14)] backdrop-blur transition-all duration-300 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black hover:shadow-[0_0_28px_rgba(212,175,55,0.26)] focus:outline-none focus:ring-2 focus:ring-[#b89652] disabled:cursor-not-allowed disabled:opacity-60 [&>svg]:text-[#d8ba68] hover:[&>svg]:text-black"
      >
        <SendIcon />
        {isSubmitting ? "Надсилання..." : "Відправити заявку"}
      </button>
    </form>
  );
}
