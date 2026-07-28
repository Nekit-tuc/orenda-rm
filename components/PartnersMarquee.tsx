"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { PublicPartner } from "@/types/partner";

type PartnersMarqueeProps = {
  partners: PublicPartner[];
};

type PartnersMarqueeStyle = CSSProperties & {
  "--partners-distance": string;
  "--partners-duration": string;
};

const minGroupViewportRatio = 1.5;
const pixelsPerSecond = 42;
const maxRepeatCount = 24;

function PartnerLogo({
  partner,
  onLogoLoad,
}: {
  partner: PublicPartner;
  onLogoLoad: () => void;
}) {
  return (
    <span className="partners-logo-item">
      <Image
        src={partner.logo_url}
        alt={partner.name}
        width={185}
        height={70}
        sizes="(min-width: 1024px) 185px, 175px"
        unoptimized
        onLoad={onLogoLoad}
        className="partners-logo"
        style={{ width: "auto" }}
      />
    </span>
  );
}

function buildLoopPartners(partners: PublicPartner[], repeatCount: number) {
  return Array.from({ length: repeatCount }, () => partners).flat();
}

export default function PartnersMarquee({ partners }: PartnersMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [repeatCount, setRepeatCount] = useState(1);
  const [groupWidth, setGroupWidth] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const filledPartners = useMemo(
    () => buildLoopPartners(partners, repeatCount),
    [partners, repeatCount]
  );

  const measureMarquee = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      const marquee = marqueeRef.current;
      const group = groupRef.current;

      if (!marquee || !group) {
        return;
      }

      const visibleWidth = marquee.clientWidth;
      const measuredGroupWidth = group.scrollWidth;

      if (visibleWidth <= 0 || measuredGroupWidth <= 0) {
        return;
      }

      const targetWidth = visibleWidth * minGroupViewportRatio;
      const baseWidth = Math.max(measuredGroupWidth / repeatCount, 1);
      const nextRepeatCount = Math.min(
        maxRepeatCount,
        Math.max(1, Math.ceil(targetWidth / baseWidth))
      );

      if (nextRepeatCount !== repeatCount) {
        setRepeatCount(nextRepeatCount);
        return;
      }

      setGroupWidth(measuredGroupWidth);
      setIsReady(true);
    });
  }, [repeatCount]);

  const handleLogoLoad = useCallback(() => {
    measureMarquee();
  }, [measureMarquee]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const frameId = requestAnimationFrame(measureMarquee);

    return () => cancelAnimationFrame(frameId);
  }, [measureMarquee]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const marquee = marqueeRef.current;
    const group = groupRef.current;
    const observer = new ResizeObserver(() => measureMarquee());

    if (marquee) {
      observer.observe(marquee);
    }

    if (group) {
      observer.observe(group);
    }

    window.addEventListener("orientationchange", measureMarquee);
    window.addEventListener("resize", measureMarquee);

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", measureMarquee);
      window.removeEventListener("resize", measureMarquee);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [measureMarquee]);

  if (partners.length === 0) {
    return null;
  }

  const duration = Math.max(22, Math.min(groupWidth / pixelsPerSecond, 45));
  const marqueeStyle = {
    "--partners-distance": `${groupWidth}px`,
    "--partners-duration": `${duration}s`,
  } as PartnersMarqueeStyle;

  return (
    <section className="relative z-10 box-border w-full max-w-full min-w-0 overflow-hidden px-4 py-4 sm:px-6 sm:py-5 lg:py-6">
      <div className="mx-auto w-full max-w-7xl min-w-0">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b89652]/85 sm:text-xs">
          Наші партнери
        </p>

        <div
          ref={marqueeRef}
          className="partners-marquee-mask w-full max-w-full min-w-0 overflow-hidden"
          style={marqueeStyle}
        >
          <div
            className="partners-marquee-track"
            data-ready={isReady && groupWidth > 0 ? "true" : "false"}
          >
            <div ref={groupRef} className="partners-marquee-group">
              {filledPartners.map((partner, index) => (
                <PartnerLogo
                  key={`${partner.id}-${index}`}
                  partner={partner}
                  onLogoLoad={handleLogoLoad}
                />
              ))}
            </div>

            <div className="partners-marquee-group" aria-hidden="true">
              {filledPartners.map((partner, index) => (
                <PartnerLogo
                  key={`${partner.id}-${index}-copy`}
                  partner={partner}
                  onLogoLoad={handleLogoLoad}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
