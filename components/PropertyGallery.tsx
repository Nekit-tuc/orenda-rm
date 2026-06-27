"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/PremiumIcons";

type PropertyGalleryProps = {
  images: readonly string[];
  title: string;
};

export default function PropertyGallery({
  images,
  title,
}: PropertyGalleryProps) {
  const safeImages = images.length > 0 ? images : ["/logo.png"];
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = safeImages[activeIndex];

  function prevImage() {
    setActiveIndex((current) =>
      current === 0 ? safeImages.length - 1 : current - 1
    );
  }

  function nextImage() {
    setActiveIndex((current) =>
      current === safeImages.length - 1 ? 0 : current + 1
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-[#b89652]/20 bg-[#070707] shadow-[0_0_35px_rgba(184,150,82,0.12)] md:rounded-[2rem]">
        <Image
          src={activeImage}
          alt={title}
          width={1000}
          height={700}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          unoptimized
          className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[460px]"
        />

        <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur md:left-5 md:top-5 md:px-4 md:text-sm">
          {activeIndex + 1} / {safeImages.length}
        </div>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#b89652]/40 bg-black/60 text-[#d8ba68] shadow-[0_0_25px_rgba(184,150,82,0.16)] backdrop-blur transition-all duration-300 hover:scale-105 hover:border-[#d4af37] hover:bg-[#b89652]/20 hover:text-[#f1d787] hover:shadow-[0_0_35px_rgba(212,175,55,0.32)] focus:outline-none focus:ring-2 focus:ring-[#b89652] md:left-5 md:h-11 md:w-11"
              aria-label="Попереднє фото"
            >
              <ChevronLeftIcon />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#b89652]/40 bg-black/60 text-[#d8ba68] shadow-[0_0_25px_rgba(184,150,82,0.16)] backdrop-blur transition-all duration-300 hover:scale-105 hover:border-[#d4af37] hover:bg-[#b89652]/20 hover:text-[#f1d787] hover:shadow-[0_0_35px_rgba(212,175,55,0.32)] focus:outline-none focus:ring-2 focus:ring-[#b89652] md:right-5 md:h-11 md:w-11"
              aria-label="Наступне фото"
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-20 shrink-0 overflow-hidden rounded-xl border transition md:w-auto md:rounded-2xl ${
                activeIndex === index
                  ? "border-[#b89652] opacity-100 shadow-[0_0_18px_rgba(184,150,82,0.24)]"
                  : "border-white/10 opacity-55 hover:border-[#b89652]/40 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={title}
                width={220}
                height={130}
                sizes="20vw"
                unoptimized
                className="h-16 w-full object-cover md:h-20"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
