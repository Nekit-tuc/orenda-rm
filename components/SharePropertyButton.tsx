"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { shareProperty } from "@/lib/shareProperty";
import { ShareIcon } from "@/components/PremiumIcons";

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

  async function handleShare(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

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
        onPointerDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
        className={`${roundedClass} inline-flex w-full items-center justify-center gap-2 border border-[#b89652]/45 bg-[#b89652]/10 text-sm font-semibold text-white shadow-[0_0_25px_rgba(184,150,82,0.16)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black hover:shadow-[0_0_32px_rgba(212,175,55,0.3)] focus:outline-none focus:ring-2 focus:ring-[#b89652]/70 md:w-auto [&>svg]:text-[#d8ba68] hover:[&>svg]:text-black ${className || "px-5 py-3"}`}
      >
        <ShareIcon />
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
