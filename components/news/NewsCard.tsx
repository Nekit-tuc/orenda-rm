import Image from "next/image";
import Link from "next/link";
import type { RealEstateNews } from "@/types/news";

type NewsCardProps = {
  news: RealEstateNews;
  compact?: boolean;
};

export function formatNewsDate(value?: string | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function NewsCard({ news, compact = false }: NewsCardProps) {
  const href = `/news/${news.slug}`;
  const imageUrl = news.image_url || "/hero-building.png";

  return (
    <Link
      href={href}
      className="group block h-full overflow-hidden rounded-2xl border border-[#b89652]/22 bg-[#0b0b0b] shadow-[0_14px_38px_rgba(0,0,0,0.32)] transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/55 hover:shadow-[0_0_38px_rgba(184,150,82,0.2)] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] lg:rounded-[1.35rem] lg:shadow-[0_18px_55px_rgba(0,0,0,0.35)]"
    >
      <div className="relative h-[108px] overflow-hidden bg-white/5 sm:h-[116px] lg:aspect-[16/10] lg:h-auto">
        <Image
          src={imageUrl}
          alt={news.title}
          fill
          sizes={
            compact
              ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              : "(min-width: 1280px) 28vw, (min-width: 1024px) 33vw, (min-width: 640px) 44vw, 84vw"
          }
          unoptimized
          loading="lazy"
          className="object-cover opacity-90 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {news.category && (
          <span className="absolute left-3 top-3 rounded-lg bg-[#d8b95d] px-2.5 py-1 text-[10px] font-semibold leading-none text-black shadow-[0_10px_28px_rgba(0,0,0,0.25)] sm:text-[11px] lg:left-4 lg:top-4 lg:px-3 lg:py-1.5 lg:text-xs">
            {news.category}
          </span>
        )}
      </div>

      <div className="flex min-h-[104px] flex-col p-3 lg:min-h-[220px] lg:p-6">
        <time className="text-[11px] leading-none text-white/48 sm:text-xs lg:text-sm">
          {formatNewsDate(news.published_at)}
        </time>
        <h3 className="mt-1.5 line-clamp-2 text-[16px] font-semibold leading-tight text-white sm:text-[17px] lg:mt-4 lg:text-xl">
          {news.title}
        </h3>
        {news.excerpt && (
          <p className="hidden lg:mt-4 lg:line-clamp-3 lg:block lg:text-sm lg:leading-6 lg:text-white/55">
            {news.excerpt}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-1.5 text-[13px] font-semibold text-[#d8ba68] lg:gap-3 lg:pt-6 lg:text-sm">
          <span className="lg:hidden">Читати</span>
          <span className="hidden lg:inline">Читати більше</span>
          <span className="text-lg leading-none transition group-hover:translate-x-1 lg:text-xl">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
