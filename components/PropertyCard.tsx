"use client";

import Image from "next/image";
import Link from "next/link";
import { toggleFavoriteId, useFavoriteIds } from "@/lib/favorites";
import { getRouteUrl } from "@/lib/getRouteUrl";
import { getPropertySlug } from "@/lib/getPropertySlug";
import SharePropertyButton from "@/components/SharePropertyButton";

type PropertyCardProps = {
  id: number;
  slug?: string | null;
  title: string;
  type: string;
  dealType: "Оренда" | "Продаж";
  priceTotal: string;
  pricePerMeter: string;
  area: string;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  description: string;
  image: string;
};

export default function PropertyCard({
  id,
  slug,
  title,
  type,
  dealType,
  priceTotal,
  pricePerMeter,
  area,
  address,
  lat,
  lng,
  description,
  image,
}: PropertyCardProps) {
  const favoriteIds = useFavoriteIds();
  const isFavorite = favoriteIds.includes(id);
  const routeUrl = getRouteUrl({ address, lat, lng });
  const propertySlug = getPropertySlug({ id, title, slug });
  const propertyUrl = `/objects/${propertySlug}`;
  const shareText = `${description} ${priceTotal}`.trim();

  function toggleFavorite() {
    toggleFavoriteId(id);
  }

  return (
    <article className="group grid overflow-hidden rounded-[1.75rem] border border-[#b89652]/35 bg-[#070707] shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition duration-300 hover:border-[#b89652]/55 hover:shadow-[0_0_35px_rgba(184,150,82,0.16)] md:rounded-3xl md:border-white/10 lg:grid-cols-[0.75fr_1.45fr]">
      <div className="flex min-w-0 flex-col p-4 md:p-7">
        <div className="mb-3 hidden items-center justify-between gap-3 md:mb-5 md:flex">
          <span className="rounded-md bg-[#b89652] px-3 py-1.5 text-[11px] font-bold uppercase text-white md:px-4 md:py-2 md:text-xs">
            {dealType}
          </span>

          <button
            onClick={toggleFavorite}
            className="rounded-full border border-white/10 bg-black/50 px-3 py-2 text-base transition hover:border-[#b89652]/50 hover:bg-[#b89652] hover:text-white md:text-lg"
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <p className="mb-2 text-[11px] uppercase tracking-[0.26em] text-[#b89652] md:text-xs md:tracking-[0.25em]">
          {type}
        </p>

        <h4 className="line-clamp-2 break-words text-xl font-black leading-tight text-white md:text-2xl">
          {title}
        </h4>

        <div className="mt-3 grid grid-cols-2 gap-2 py-1 md:mt-5 md:block md:space-y-4 md:border-y md:border-white/10 md:py-5">
          <div className="flex gap-2 md:gap-3">
            <span className="text-lg text-[#b89652] md:text-2xl">📍</span>
            <div>
              <p className="text-xs text-white/40 md:text-sm">Локація</p>
              <p className="line-clamp-1 text-sm text-white/75">
                {address || "Житомир"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 md:gap-3">
            <span className="text-lg text-[#b89652] md:text-2xl">▣</span>
            <div>
              <p className="text-xs text-white/40 md:text-sm">Площа</p>
              <p className="line-clamp-1 text-base font-bold text-[#b89652] md:text-2xl">
                {area}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-5 text-white/55 md:mt-5 md:line-clamp-3 md:leading-6">
          {description}
        </p>

        <div className="mt-auto pt-4 md:pt-6">
          <div className="rounded-2xl border border-[#b89652]/45 bg-[#b89652]/10 p-3 md:border-0 md:bg-transparent md:p-0">
            <p className="break-words text-2xl font-black text-[#d2aa4f] md:text-3xl">
              {dealType === "Оренда" ? priceTotal : priceTotal}
            </p>

            <p className="mt-1 break-words text-sm text-white/45">
              {dealType === "Оренда" ? pricePerMeter : pricePerMeter}
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 md:mt-5 md:flex md:flex-wrap md:gap-3">
            <Link
              href={propertyUrl}
              className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-[#b89652]/50 bg-[#b89652]/5 px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-[#b89652] hover:text-black md:min-h-0 md:w-auto md:px-5 md:py-3 md:text-sm"
            >
              Детальніше <span>→</span>
            </Link>

            {routeUrl && (
              <a
                href={routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-[#b89652]/12 px-2.5 py-2 text-center text-xs font-semibold leading-tight text-white ring-1 ring-[#b89652]/45 transition hover:bg-[#b89652] hover:text-black md:min-h-0 md:w-auto md:px-5 md:py-3 md:text-sm"
              >
                <span>📍</span>
                Побудувати маршрут
              </a>
            )}

            <SharePropertyButton
              title={title}
              text={shareText}
              url={propertyUrl}
              className="min-h-11 px-2.5 py-2 text-xs text-white ring-1 ring-[#b89652]/45 md:min-h-0 md:px-5 md:py-3 md:text-sm"
            />

            <button
              type="button"
              onClick={toggleFavorite}
              className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-[#b89652]/45 bg-[#b89652]/5 px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-[#b89652] hover:text-black md:hidden"
            >
              <span>{isFavorite ? "❤️" : "♡"}</span>
              В обране
            </button>
          </div>
        </div>
      </div>

      <div className="relative order-first min-h-[210px] overflow-hidden sm:min-h-[250px] md:min-h-[320px] lg:order-none lg:min-h-[500px]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1280px) 45vw, 100vw"
          unoptimized
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 md:hidden">
          <span className="rounded-xl bg-[#d2aa4f] px-3 py-1.5 text-xs font-black uppercase text-white shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
            {dealType}
          </span>

          <button
            type="button"
            onClick={toggleFavorite}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/35 text-lg text-white shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur transition hover:bg-[#b89652]"
            aria-label="Додати в обране"
          >
            {isFavorite ? "❤️" : "♡"}
          </button>
        </div>
      </div>
    </article>
  );
}
