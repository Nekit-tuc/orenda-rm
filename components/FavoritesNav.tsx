"use client";

import Link from "next/link";
import { useFavoriteIds } from "@/lib/favorites";

export default function FavoritesNav() {
  const favoriteIds = useFavoriteIds();

  return (
    <Link
      href="/favorites"
      className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 transition hover:border-[#b89652]/50 hover:bg-[#b89652]/10"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b89652]/15 text-[#b89652]">
        ❤
      </span>

      <span>Обране</span>

      {favoriteIds.length > 0 && (
        <span className="rounded-full bg-[#b89652] px-2 py-1 text-xs font-bold text-white">
          {favoriteIds.length}
        </span>
      )}
    </Link>
  );
}