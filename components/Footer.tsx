import Link from "next/link";
import BrandLogo, { BRAND_NAME } from "@/components/BrandLogo";
import { FooterSocialLinks } from "./SocialLinks";
import SubmitPropertyButton from "@/components/SubmitPropertyButton";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#030303]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(184,150,82,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_42%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:px-6 md:grid-cols-[1fr_auto] md:items-center md:py-12">
        <div className="text-center md:text-left">
          <Link
            href="/"
            className="inline-flex items-center justify-center transition hover:opacity-90"
          >
            <BrandLogo className="h-20 w-36 md:h-24 md:w-44" />
          </Link>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/58 md:text-base">
            Сучасна платформа нерухомості для купівлі, продажу та оренди.
          </p>

          <div className="mt-5">
            <SubmitPropertyButton className="inline-flex items-center justify-center rounded-full border border-[#b89652]/40 bg-black/40 px-5 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(184,150,82,0.18)] backdrop-blur transition-all duration-300 hover:border-[#d4af37] hover:text-[#d8ba68]" />
          </div>
        </div>

        <div className="text-center md:text-right">
          <FooterSocialLinks />

          <div className="mt-5 text-xs leading-6 text-white/42 sm:text-sm">
            <p>© 2026 {BRAND_NAME}</p>
            <p>Всі права захищені.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
