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
      className={`sticky top-0 z-50 border-b border-white/10 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 py-2 backdrop-blur-xl"
          : "bg-black/80 py-4 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo_v1.png"
            alt="Orenda RM"
            width={scrolled ? 60 : 110}
            height={scrolled ? 60 : 110}
            className="rounded-full transition-all duration-300"
            priority
          />

        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#objects" className="hover:text-[#b89652]">
            Об'єкти
          </a>

          <FavoritesNav />

          <a href="#map" className="hover:text-[#b89652]">
            Карта
          </a>
        </nav>

        <a
          href="https://t.me/zt_space"
          target="_blank"
          className="rounded-xl bg-[#b89652] px-5 py-3 text-sm font-medium text-white transition hover:opacity-80"
        >
          Telegram
        </a>
      </div>
    </header>
  );
}