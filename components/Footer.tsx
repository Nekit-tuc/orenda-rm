import Link from "next/link";
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
            className="inline-flex items-center justify-center text-2xl font-extrabold tracking-tight text-[#d4af37] transition hover:text-[#e2c56d] md:text-3xl"
          >
            Orenda RM
          </Link>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/58 md:text-base">
            Нерухомість Житомира та області.
          </p>

          <div className="mt-5">
            <SubmitPropertyButton className="inline-flex items-center justify-center rounded-full border border-[#b89652]/40 bg-black/40 px-5 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(184,150,82,0.18)] backdrop-blur transition-all duration-300 hover:border-[#d4af37] hover:text-[#d8ba68]" />
          </div>
        </div>

        <div className="text-center md:text-right">
          <FooterSocialLinks />

          <div className="mt-5 text-xs leading-6 text-white/42 sm:text-sm">
            <p>© 2026 Orenda RM</p>
            <p>Всі права захищені.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
