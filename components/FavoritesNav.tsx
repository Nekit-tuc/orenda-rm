"use client";

import Link from "next/link";
import { useFavoriteIds } from "@/lib/favorites";

export default function FavoritesNav() {
  const favoriteIds = useFavoriteIds();

  return (
    <Link
      href="/favorites"
      className="flex min-w-0 items-center justify-center gap-1 rounded-xl border border-white/10 px-2 py-1.5 text-white/72 transition hover:border-[#b89652]/50 hover:bg-[#b89652]/10 focus:outline-none focus:ring-2 focus:ring-[#b89652] md:gap-3 md:rounded-full md:px-4 md:py-2 md:text-white"
    >
      <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-[#b89652]/15 text-[#b89652] md:flex">
        ♥
      </span>

      <span className="truncate">Обране</span>

      {favoriteIds.length > 0 && (
        <span className="rounded-full bg-[#b89652] px-1.5 py-0.5 text-[10px] font-bold text-white md:px-2 md:py-1 md:text-xs">
          {favoriteIds.length}
        </span>
      )}
    </Link>
  );
}
