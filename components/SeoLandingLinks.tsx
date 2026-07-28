import Link from "next/link";
import { seoLandingPages } from "@/lib/seoLandingPages";

type SeoLandingLinksProps = {
  currentSlug?: string;
  title?: string;
  compact?: boolean;
};

export default function SeoLandingLinks({
  currentSlug,
  title = "Популярні напрямки",
  compact = false,
}: SeoLandingLinksProps) {
  const links = seoLandingPages.filter((page) => page.slug !== currentSlug);

  return (
    <section
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${
        compact ? "py-5" : "py-8"
      }`}
    >
      <div className="rounded-3xl border border-[#b89652]/25 bg-white/[0.035] p-4 backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-extrabold text-white md:text-xl">
            {title}
          </h2>
          <Link
            href="/objects"
            className="text-sm font-semibold text-[#d8ba68] transition hover:text-[#f2d77c]"
          >
            Усі об’єкти →
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {links.map((page) => (
            <Link
              key={page.slug}
              href={`/nerukhomist/${page.slug}`}
              className="rounded-2xl border border-white/10 bg-black/35 px-4 py-2.5 text-sm font-semibold text-white/78 transition hover:border-[#d4af37]/60 hover:text-[#d8ba68]"
            >
              {page.breadcrumbLabel}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
