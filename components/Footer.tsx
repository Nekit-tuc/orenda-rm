import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo_v1.png"
              alt="Orenda RM"
              width={80}
              height={80}
              className="rounded-full shadow-[0_0_30px_rgba(184,150,82,0.25)]"
            />

            <div>
              <p className="text-2xl font-bold text-[#b89652]">Orenda RM</p>
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                Нерухомість Житомира
              </p>
            </div>
          </Link>

          <p className="mt-5 max-w-md text-sm leading-6 text-white/50">
            Каталог оренди та продажу нерухомості у Житомирі: комерційні
            приміщення, офіси, склади, квартири та об’єкти для бізнесу.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm uppercase tracking-[0.25em] text-[#b89652]">
            Навігація
          </h4>

          <div className="flex flex-col gap-3 text-sm text-white/60">
            <Link href="/" className="transition hover:text-[#b89652]">
              Головна
            </Link>
            <Link href="/#objects" className="transition hover:text-[#b89652]">
              Об’єкти
            </Link>
            <Link href="/favorites" className="transition hover:text-[#b89652]">
              Обране
            </Link>
            <Link href="/#map" className="transition hover:text-[#b89652]">
              Карта
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm uppercase tracking-[0.25em] text-[#b89652]">
            Контакти
          </h4>

          <div className="flex flex-col gap-3 text-sm text-white/60">
            <a
              href="https://t.me/zt_space"
              target="_blank"
              className="transition hover:text-[#b89652]"
            >
              Telegram
            </a>

            <p>Житомир, Україна</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/35">
        © {new Date().getFullYear()} Orenda RM. Всі права захищено.
      </div>
    </footer>
  );
}