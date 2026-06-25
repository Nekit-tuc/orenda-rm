"use client";

import { useState } from "react";
import { shareProperty } from "@/lib/shareProperty";

type SharePropertyButtonProps = {
  title: string;
  text: string;
  url: string;
  className?: string;
  rounded?: "xl" | "full";
};

export default function SharePropertyButton({
  title,
  text,
  url,
  className = "",
  rounded = "xl",
}: SharePropertyButtonProps) {
  const [message, setMessage] = useState("");

  async function handleShare() {
    const absoluteUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url}`;

    try {
      const result = await shareProperty({
        title,
        text,
        url: absoluteUrl,
      });

      if (result === "copied") {
        setMessage("Посилання скопійовано");
        window.setTimeout(() => setMessage(""), 2200);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      await navigator.clipboard.writeText(absoluteUrl);
      setMessage("Посилання скопійовано");
      window.setTimeout(() => setMessage(""), 2200);
    }
  }

  const roundedClass = rounded === "full" ? "rounded-full" : "rounded-xl";

  return (
    <span className="relative inline-flex w-full md:w-auto">
      <button
        type="button"
        onClick={handleShare}
        className={`${roundedClass} inline-flex w-full items-center justify-center gap-2 border border-white/15 bg-white/[0.04] text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-[#b89652]/60 hover:bg-[#b89652]/15 hover:text-[#e2c875] focus:outline-none focus:ring-2 focus:ring-[#b89652]/60 md:w-auto ${className || "px-5 py-3"}`}
      >
        <span aria-hidden="true">↗</span>
        Поділитися
      </button>

      {message && (
        <span className="absolute left-1/2 top-[calc(100%+0.5rem)] z-20 w-max -translate-x-1/2 rounded-full border border-[#b89652]/30 bg-black px-3 py-2 text-xs text-[#e2c875] shadow-2xl shadow-black/40">
          {message}
        </span>
      )}
    </span>
  );
}
