"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { MessageIcon } from "@/components/PremiumIcons";

type ContactItem = {
  label: string;
  value: string;
  href: string;
  icon: "telegram" | "phone" | "email";
};

const contacts: ContactItem[] = [
  {
    label: "Telegram",
    value: "@orenda_rm",
    href: "https://t.me/orenda_rm",
    icon: "telegram",
  },
  {
    label: "Телефон",
    value: "+38 (097) 957-38-56",
    href: "tel:+380979573856",
    icon: "phone",
  },
  {
    label: "Email",
    value: "investal.estate.zt@gmail.com",
    href: "mailto:investal.estate.zt@gmail.com",
    icon: "email",
  },
];

function ContactIcon({ icon }: { icon: ContactItem["icon"] }) {
  if (icon === "telegram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          d="M21.5 4.6 3.4 11.55c-.82.32-.79 1.49.05 1.76l4.52 1.45 1.74 5.1c.28.82 1.37.98 1.88.28l2.47-3.39 4.62 3.33c.7.51 1.7.12 1.86-.74L23 5.76c.16-.9-.66-1.47-1.5-1.16Z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="m8.1 14.72 8.55-5.42-6.92 7.1"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (icon === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          d="M7.1 4.5 9.2 4a1.7 1.7 0 0 1 1.92.96l1.07 2.47a1.7 1.7 0 0 1-.43 1.94l-1.13 1.03a11.2 11.2 0 0 0 4.97 4.97l1.03-1.13a1.7 1.7 0 0 1 1.94-.43l2.47 1.07a1.7 1.7 0 0 1 .96 1.92l-.5 2.1a2.36 2.36 0 0 1-2.58 1.8C10.45 19.79 4.21 13.55 3.3 5.08A2.36 2.36 0 0 1 5.1 2.5Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4.5 6.5h15v11h-15v-11Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m5.25 7.25 6.75 5.5 6.75-5.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function ContactDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [desktopPosition, setDesktopPosition] = useState({
    right: 16,
    top: 96,
  });
  const dropdownId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function updateDesktopPosition() {
      const button = buttonRef.current;

      if (!button) {
        return;
      }

      const rect = button.getBoundingClientRect();
      const panelWidth = 360;
      const viewportPadding = 16;
      const rightFromButton = window.innerWidth - rect.right;
      const right =
        rect.left + panelWidth > window.innerWidth - viewportPadding
          ? viewportPadding
          : Math.max(viewportPadding, rightFromButton);

      setDesktopPosition({
        right,
        top: Math.min(rect.bottom + 12, window.innerHeight - viewportPadding),
      });
    }

    updateDesktopPosition();
    window.addEventListener("resize", updateDesktopPosition);
    window.addEventListener("scroll", updateDesktopPosition, true);

    return () => {
      window.removeEventListener("resize", updateDesktopPosition);
      window.removeEventListener("scroll", updateDesktopPosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    firstLinkRef.current?.focus();

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        rootRef.current &&
        !rootRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const dropdownStyle = {
    "--contact-dropdown-right": `${desktopPosition.right}px`,
    "--contact-dropdown-top": `${desktopPosition.top}px`,
  } as CSSProperties;

  const dropdownLayer =
    typeof document !== "undefined"
      ? createPortal(
          <>
            <button
              type="button"
              aria-label="Закрити способи зв'язку"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsOpen(false)}
              className={`fixed inset-0 z-[9998] bg-black/65 backdrop-blur-sm transition-opacity duration-200 ${
                isOpen
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            />

            <div
              ref={panelRef}
              id={dropdownId}
              role="dialog"
              aria-label="Способи зв'язку"
              aria-hidden={!isOpen}
              style={dropdownStyle}
              className={`fixed inset-x-4 bottom-4 z-[9999] mx-auto max-h-[calc(100dvh-2rem)] w-auto max-w-[calc(100vw-32px)] overflow-y-auto overflow-x-hidden rounded-3xl border border-[#b89652]/30 bg-[#080808]/95 p-3 text-left shadow-[0_20px_80px_rgba(0,0,0,0.7),0_0_34px_rgba(184,150,82,0.16)] backdrop-blur-xl transition-all duration-200 md:inset-x-auto md:bottom-auto md:right-[var(--contact-dropdown-right)] md:top-[var(--contact-dropdown-top)] md:mx-0 md:w-[360px] md:max-w-none md:overflow-hidden md:border-[#b89652]/35 md:bg-[#070707]/92 md:shadow-[0_24px_80px_rgba(0,0,0,0.58),0_0_34px_rgba(184,150,82,0.16)] md:backdrop-blur-2xl ${
                isOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none translate-y-4 scale-[0.97] opacity-0 md:-translate-y-2"
              }`}
            >
              <div className="border-b border-white/10 px-2 pb-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#b89652]/35 bg-[#b89652]/10 text-[#d8ba68]">
                    <MessageIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-white">
                      Зв&apos;язатися
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-white/52">
                      Напишіть нам будь-яким зручним способом
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 pt-3">
                {contacts.map((contact, index) => (
                  <a
                    key={contact.label}
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={contact.href}
                    target={
                      contact.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      contact.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    tabIndex={isOpen ? 0 : -1}
                    onClick={() => setIsOpen(false)}
                    className="group flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3.5 py-3 text-base text-white transition-all duration-300 hover:scale-[1.01] hover:border-[#d4af37]/70 hover:bg-[#b89652]/10 hover:shadow-[0_0_24px_rgba(212,175,55,0.18)] focus:outline-none focus:ring-2 focus:ring-[#b89652]/70 md:min-h-12 md:text-sm"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#b89652]/25 bg-black/35 text-white/76 transition group-hover:border-[#d4af37]/70 group-hover:text-[#d8ba68]">
                      <ContactIcon icon={contact.icon} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-white">
                        {contact.label}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-white/52">
                        {contact.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="relative w-full sm:w-auto">
      <button
        ref={buttonRef}
        type="button"
        aria-controls={dropdownId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#b89652]/35 bg-black/35 px-5 py-2.5 text-center text-[13px] font-bold text-white shadow-[0_0_20px_rgba(184,150,82,0.12)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-[#d4af37] hover:bg-[#b89652]/12 hover:text-[#d8ba68] hover:shadow-[0_0_28px_rgba(212,175,55,0.22)] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] md:px-7 md:py-3.5 md:text-sm [&>svg]:text-[#d8ba68]"
      >
        <MessageIcon />
        Зв&apos;язатися
      </button>
      {dropdownLayer}
    </div>
  );
}
