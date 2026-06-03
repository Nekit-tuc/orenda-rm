"use client";

import Image from "next/image";
import { useState } from "react";

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
          className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
        />

        <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-2 text-sm text-white backdrop-blur md:left-5 md:top-5 md:px-4">
          {activeIndex + 1} / {safeImages.length}
        </div>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-2xl text-white backdrop-blur transition hover:border-[#b89652]/60 hover:bg-[#b89652] md:left-5 md:h-12 md:w-12"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-2xl text-white backdrop-blur transition hover:border-[#b89652]/60 hover:bg-[#b89652] md:right-5 md:h-12 md:w-12"
            >
              ›
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-24 shrink-0 overflow-hidden rounded-2xl border transition md:w-auto ${
                activeIndex === index
                  ? "border-[#b89652] opacity-100"
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
                className="h-20 w-full object-cover md:h-24"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
