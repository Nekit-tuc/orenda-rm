"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FavoritesNav from "./FavoritesNav";
import { DesktopSocialLinks, HeaderSocialLinks } from "./SocialLinks";

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
          : "bg-black/88 py-2 backdrop-blur-xl md:py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-3 sm:px-4 md:flex-nowrap md:gap-4 md:px-6">
        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-start">
          <Link href="/" className="flex min-w-0 items-center">
            <Image
              src="/logo_v1.png"
              alt="Orenda RM"
              width={110}
              height={110}
              className={`object-contain transition-all duration-300 ${
                scrolled
                  ? "h-9 w-14 md:h-12 md:w-16"
                  : "h-10 w-16 md:h-16 md:w-24"
              }`}
              priority
            />
          </Link>

          <div className="md:hidden">
            <HeaderSocialLinks />
          </div>
        </div>

        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <a href="#objects" className="transition hover:text-[#b89652]">
            Обʼєкти
          </a>

          <FavoritesNav />

          <a href="#map" className="transition hover:text-[#b89652]">
            Карта
          </a>
        </nav>

        <DesktopSocialLinks />

        <nav className="grid w-full grid-cols-3 gap-1.5 text-center text-xs font-semibold md:hidden">
          <a
            href="#objects"
            className="min-w-0 rounded-xl border border-white/10 px-2 py-1.5 text-white/72 transition hover:border-[#b89652]/50 focus:outline-none focus:ring-2 focus:ring-[#b89652]"
          >
            Обʼєкти
          </a>

          <FavoritesNav />

          <a
            href="#map"
            className="min-w-0 rounded-xl border border-white/10 px-2 py-1.5 text-white/72 transition hover:border-[#b89652]/50 focus:outline-none focus:ring-2 focus:ring-[#b89652]"
          >
            Карта
          </a>
        </nav>
      </div>
    </header>
  );
}
