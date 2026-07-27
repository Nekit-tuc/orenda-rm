"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NewsCard from "@/components/news/NewsCard";
import type { RealEstateNews } from "@/types/news";

type NewsSliderProps = {
  news: RealEstateNews[];
};

export default function NewsSlider({ news }: NewsSliderProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    function updateActiveIndex() {
      if (!scroller) {
        return;
      }

      const cards = Array.from(
        scroller.querySelectorAll<HTMLElement>("[data-news-card]")
      );
      const closestIndex = cards.reduce(
        (closest, card, index) => {
          const distance = Math.abs(card.offsetLeft - scroller.scrollLeft);
          return distance < closest.distance ? { index, distance } : closest;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY }
      ).index;

      setActiveIndex(Math.min(Math.max(closestIndex, 0), news.length - 1));
    }

    updateActiveIndex();
    scroller.addEventListener("scroll", updateActiveIndex, { passive: true });

    return () => scroller.removeEventListener("scroll", updateActiveIndex);
  }, [news.length]);

  if (news.length === 0) {
    return null;
  }

  function scrollToIndex(index: number) {
    const scroller = scrollerRef.current;
    const card = scroller?.querySelector<HTMLElement>("[data-news-card]");

    if (!scroller || !card) {
      return;
    }

    const clampedIndex = Math.min(Math.max(index, 0), news.length - 1);
    scroller.scrollTo({
      left: card.parentElement?.children[clampedIndex]
        ? (card.parentElement.children[clampedIndex] as HTMLElement).offsetLeft
        : clampedIndex * card.offsetWidth,
      behavior: "smooth",
    });
  }

  function scrollByDirection(direction: -1 | 1) {
    scrollToIndex(activeIndex + direction);
  }

  return (
    <section className="relative mx-auto box-border w-full max-w-full min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:max-w-7xl lg:py-12">
      <div className="relative w-full max-w-full min-w-0 overflow-hidden lg:overflow-visible lg:rounded-[1.6rem] lg:border lg:border-[#b89652]/25 lg:bg-[radial-gradient(circle_at_top_left,rgba(184,150,82,0.12),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] lg:px-10 lg:py-10 lg:shadow-[0_30px_100px_rgba(0,0,0,0.35)] lg:backdrop-blur-xl">
        <div className="mb-4 flex flex-col gap-3 lg:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3 lg:mb-3 lg:gap-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#d8ba68] sm:text-[11px] lg:text-xs">
                Новини
              </p>
              <span className="h-px w-8 bg-[#b89652]/35 lg:w-10" />
            </div>
            <h2 className="text-[26px] font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-[28px] lg:text-4xl">
              Новини ринку нерухомості
            </h2>
          </div>

          <Link
            href="/news"
            className="hidden items-center justify-center gap-3 rounded-2xl border border-[#b89652]/45 bg-black/25 px-6 py-3 text-sm font-semibold text-[#f2d37d] transition duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652]/12 hover:shadow-[0_0_30px_rgba(184,150,82,0.22)] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] lg:inline-flex"
          >
            Усі новини <span className="text-xl leading-none">→</span>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Попередні новини"
          onClick={() => scrollByDirection(-1)}
          className="absolute left-[-22px] top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-[#b89652]/55 bg-black/80 text-3xl leading-none text-[#d8ba68] shadow-[0_0_32px_rgba(0,0,0,0.5)] transition hover:scale-105 hover:border-[#d4af37] hover:shadow-[0_0_34px_rgba(184,150,82,0.28)] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] lg:flex"
        >
          ‹
        </button>

        <div
          ref={scrollerRef}
          tabIndex={0}
          aria-label="Слайдер новин"
          className="news-slider-scroll flex w-full max-w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 pr-4 focus:outline-none sm:gap-4 lg:gap-[18px] lg:px-1 lg:pb-3 lg:pr-1"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              scrollByDirection(-1);
            }
            if (event.key === "ArrowRight") {
              scrollByDirection(1);
            }
          }}
        >
          {news.map((item) => (
            <article
              key={item.id}
              data-news-card
              className="min-w-0 max-w-[340px] flex-[0_0_84vw] snap-start sm:flex-[0_0_44vw] lg:max-w-none lg:flex-[0_0_calc(33.333%-12px)]"
            >
              <NewsCard news={item} />
            </article>
          ))}
        </div>

        <button
          type="button"
          aria-label="Наступні новини"
          onClick={() => scrollByDirection(1)}
          className="absolute right-[-22px] top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-[#b89652]/55 bg-black/80 text-3xl leading-none text-[#d8ba68] shadow-[0_0_32px_rgba(0,0,0,0.5)] transition hover:scale-105 hover:border-[#d4af37] hover:shadow-[0_0_34px_rgba(184,150,82,0.28)] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] lg:flex"
        >
          ›
        </button>

        <div className="mt-3 flex items-center justify-center gap-2 lg:mt-5 lg:gap-3">
          {news.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Перейти до новини ${index + 1}`}
              onClick={() => scrollToIndex(index)}
              className={`h-1.5 rounded-full transition lg:h-2.5 ${
                activeIndex === index
                  ? "w-5 bg-[#d8ba68] lg:w-2.5"
                  : "w-1.5 bg-white/20 hover:bg-white/40 lg:w-2.5"
              }`}
            />
          ))}
        </div>

        <Link
          href="/news"
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#b89652]/45 bg-black/25 px-5 py-2.5 text-sm font-semibold text-[#f2d37d] transition duration-300 hover:border-[#d4af37] hover:bg-[#b89652]/12 focus:outline-none focus:ring-2 focus:ring-[#d8ba68] lg:hidden"
        >
          Усі новини <span className="text-xl leading-none">→</span>
        </Link>
      </div>
    </section>
  );
}
