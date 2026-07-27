import Image from "next/image";
import type { CSSProperties } from "react";
import type { PublicPartner } from "@/types/partner";

type PartnersMarqueeProps = {
  partners: PublicPartner[];
};

function PartnerLogo({ partner }: { partner: PublicPartner }) {
  return (
    <span className="partners-logo-item">
      <Image
        src={partner.logo_url}
        alt={partner.name}
        width={150}
        height={60}
        sizes="(min-width: 1024px) 145px, 130px"
        unoptimized
        className="partners-logo"
      />
    </span>
  );
}

function repeatPartnersForLoop(partners: PublicPartner[]) {
  if (partners.length <= 2) {
    return Array.from({ length: 8 }, () => partners).flat();
  }

  if (partners.length <= 5) {
    return Array.from({ length: 4 }, () => partners).flat();
  }

  if (partners.length <= 10) {
    return Array.from({ length: 2 }, () => partners).flat();
  }

  return partners;
}

export default function PartnersMarquee({ partners }: PartnersMarqueeProps) {
  if (partners.length === 0) {
    return null;
  }

  const loopPartners = repeatPartnersForLoop(partners);
  const duration = Math.max(24, Math.min(67, loopPartners.length * 2.9));
  const mobileDuration = Math.max(22, Math.min(58, loopPartners.length * 2.4));
  const marqueeStyle = {
    "--partners-duration": `${duration}s`,
    "--partners-mobile-duration": `${mobileDuration}s`,
  } as CSSProperties;

  return (
    <section className="relative z-10 box-border w-full max-w-full min-w-0 overflow-hidden px-4 py-4 sm:px-6 sm:py-5 lg:py-6">
      <div className="mx-auto w-full max-w-7xl min-w-0">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b89652]/85 sm:text-xs">
          Наші партнери
        </p>

        <div
          className="partners-marquee-mask w-full max-w-full min-w-0 overflow-hidden"
          style={marqueeStyle}
        >
          <div className="partners-marquee-track">
            <div className="partners-marquee-group">
              {loopPartners.map((partner, index) => (
                <PartnerLogo
                  key={`${partner.id}-${index}`}
                  partner={partner}
                />
              ))}
            </div>

            <div className="partners-marquee-group" aria-hidden="true">
              {loopPartners.map((partner, index) => (
                <PartnerLogo
                  key={`${partner.id}-${index}-copy`}
                  partner={partner}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
