"use client";

import Image from "next/image";
import Link from "next/link";
import { toggleFavoriteId, useFavoriteIds } from "@/lib/favorites";

type PropertyCardProps = {
  id: number;
  slug?: string | null;
  title: string;
  type: string;
  dealType: "Оренда" | "Продаж";
  priceTotal: string;
  pricePerMeter: string;
  area: string;
  description: string;
  image: string;
};

export default function PropertyCard({
  id,
  title,
  type,
  dealType,
  priceTotal,
  pricePerMeter,
  area,
  description,
  image,
}: PropertyCardProps) {
  const favoriteIds = useFavoriteIds();
  const isFavorite = favoriteIds.includes(id);

  function toggleFavorite() {
    toggleFavoriteId(id);
  }

  return (
    <article className="group grid overflow-hidden rounded-3xl border border-white/10 bg-[#070707] transition duration-300 hover:-translate-y-1 hover:border-[#b89652]/50 hover:shadow-[0_0_35px_rgba(184,150,82,0.16)] lg:grid-cols-[0.75fr_1.45fr]">
      <div className="flex flex-col p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="rounded-md bg-[#b89652] px-4 py-2 text-xs font-bold uppercase text-white">
            {dealType}
          </span>

          <button
            onClick={toggleFavorite}
            className="rounded-full border border-white/10 bg-black/50 px-3 py-2 text-lg transition hover:border-[#b89652]/50 hover:bg-[#b89652] hover:text-white"
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#b89652]">
          {type}
        </p>

        <h4 className="text-2xl font-bold leading-tight text-white">
          {title}
        </h4>

        <div className="mt-5 space-y-4 border-y border-white/10 py-5">
          <div className="flex gap-3">
            <span className="text-2xl text-[#b89652]">📍</span>
            <div>
              <p className="text-sm text-white/40">Локація</p>
              <p className="text-sm text-white/80">Житомир</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="text-2xl text-[#b89652]">▣</span>
            <div>
              <p className="text-sm text-white/40">Площа</p>
              <p className="text-2xl font-bold text-[#b89652]">{area}</p>
            </div>
          </div>
        </div>

        <p className="mt-5 line-clamp-3 text-sm leading-6 text-white/55">
          {description}
        </p>

        <div className="mt-auto pt-6">
          <p className="text-3xl font-bold text-[#b89652]">
            {dealType === "Оренда" ? priceTotal : priceTotal}
          </p>

          <p className="mt-1 text-sm text-white/40">
            {dealType === "Оренда" ? pricePerMeter : pricePerMeter}
          </p>

          <Link
            href={`/objects/${id}`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#b89652]/50 px-5 py-3 text-sm font-medium text-[#b89652] transition hover:bg-[#b89652] hover:text-black"
          >
            Детальніше <span>→</span>
          </Link>
        </div>
      </div>

      <div className="relative min-h-[420px] overflow-hidden lg:min-h-[500px]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1280px) 45vw, 100vw"
          unoptimized
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
      </div>
    </article>
  );
}