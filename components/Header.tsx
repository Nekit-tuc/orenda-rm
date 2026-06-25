"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FavoritesNav from "./FavoritesNav";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`relative z-50 border-b border-white/10 transition-all duration-300 md:sticky md:top-0 ${
        scrolled
          ? "bg-black/95 py-2 backdrop-blur-xl"
          : "bg-black/82 py-3 backdrop-blur-xl md:py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 md:flex-nowrap md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo_v1.png"
            alt="Orenda RM"
            width={110}
            height={110}
            className={`object-contain transition-all duration-300 ${
              scrolled ? "h-12 w-16" : "h-14 w-20 md:h-16 md:w-24"
            }`}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <a href="#objects" className="transition hover:text-[#b89652]">
            Об’єкти
          </a>

          <FavoritesNav />

          <a href="#map" className="transition hover:text-[#b89652]">
            Карта
          </a>
        </nav>

        <a
          href="https://t.me/zt_space"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-[#caa854] px-4 py-3 text-sm font-bold text-white shadow-[0_14px_34px_rgba(202,168,84,0.22)] transition hover:bg-[#d8ba68] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] md:px-5"
        >
          Telegram
        </a>

        <nav className="grid w-full grid-cols-3 gap-2 text-center text-sm md:hidden">
          <a
            href="#objects"
            className="rounded-xl border border-white/10 px-3 py-2 text-white/70 transition hover:border-[#b89652]/50"
          >
            Об’єкти
          </a>

          <FavoritesNav />

          <a
            href="#map"
            className="rounded-xl border border-white/10 px-3 py-2 text-white/70 transition hover:border-[#b89652]/50"
          >
            Карта
          </a>
        </nav>
      </div>
    </header>
  );
}
