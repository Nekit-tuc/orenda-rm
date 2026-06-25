import Image from "next/image";
import PropertiesSection from "@/components/PropertiesSection";
import MapWrapper from "@/components/MapWrapper";
import { getProperties } from "@/lib/getProperties";
import { getHomepageSettings } from "@/lib/homepageSettings";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

const benefits = [
  {
    icon: "▥",
    title: "Актуальні обʼєкти",
    text: "Щоденне оновлення бази",
  },
  {
    icon: "◇",
    title: "Перевірені власники",
    text: "Тільки надійні пропозиції",
  },
  {
    icon: "⌖",
    title: "Весь регіон",
    text: "Житомир та область",
  },
  {
    icon: "◌",
    title: "Підтримка 24/7",
    text: "Допоможемо знайти найкраще",
  },
];

export default async function Home() {
  const [properties, homepageSettings] = await Promise.all([
    getProperties(),
    getHomepageSettings(),
  ]);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#020202] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[min(820px,100vw)] -translate-x-1/2 rounded-full bg-[#b89652]/10 blur-3xl" />
        <div className="absolute bottom-0 right-[-12rem] h-[420px] w-[420px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <Header />

      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_45%,rgba(184,150,82,0.18),transparent_32%),linear-gradient(90deg,#020202_0%,rgba(2,2,2,0.9)_34%,rgba(2,2,2,0.42)_58%,#020202_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020202] to-transparent" />

        <div className="relative mx-auto grid min-h-[calc(100svh-92px)] w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:min-h-[700px] md:py-12 lg:grid-cols-[1fr_390px] lg:items-center lg:py-6">
          <div className="relative z-10 max-w-3xl pt-4 lg:pt-0">
            <p className="mb-5 text-xs uppercase tracking-[0.36em] text-[#c9a85a] sm:text-sm">
              Orenda RM • Житомир
            </p>

            <h1 className="max-w-2xl text-[clamp(2.25rem,6.4vw,4.75rem)] font-black leading-[1.02] tracking-[-0.025em] text-white">
              {homepageSettings.heroTitle}
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              {homepageSettings.heroSubtitle}
            </p>

            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href={homepageSettings.heroButtonUrl}
                className="rounded-xl bg-[#caa854] px-6 py-4 text-center text-sm font-bold text-white shadow-[0_18px_48px_rgba(202,168,84,0.28)] transition hover:bg-[#d8ba68] focus:outline-none focus:ring-2 focus:ring-[#d8ba68]"
              >
                Дивитись обʼєкти
              </a>

              <a
                href="#contacts"
                className="rounded-xl border border-white/18 bg-black/30 px-6 py-4 text-center text-sm font-bold text-white transition hover:border-[#caa854] hover:text-[#d8ba68] focus:outline-none focus:ring-2 focus:ring-[#d8ba68]"
              >
                Звʼязатися
              </a>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-[-18%] bottom-[5%] top-[20%] sm:inset-x-[-8%] sm:bottom-[3%] sm:top-[12%] lg:left-[29%] lg:right-[22%] lg:bottom-[7%] lg:top-[8%]">
            <Image
              src="/hero-building.png"
              alt="Сучасний будинок Orenda RM"
              fill
              priority
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-contain object-bottom opacity-70 drop-shadow-[0_0_58px_rgba(202,168,84,0.18)] lg:opacity-78"
            />
          </div>

          <div className="relative z-10 mt-4 rounded-[1.25rem] border border-white/12 bg-[#101010]/78 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:mt-6 sm:p-5 lg:mt-0 lg:rounded-[1.75rem] lg:p-6">
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#c9a85a] sm:text-[11px] sm:tracking-[0.32em]">
              Premium real objects
            </p>

            <div className="mt-3 grid gap-2 sm:mt-5 sm:gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 sm:rounded-2xl sm:p-4">
                <p className="text-[11px] text-white/42 sm:text-xs">Обʼєкти</p>
                <p className="mt-1 text-2xl font-black text-[#c9a85a] sm:mt-2 sm:text-3xl">
                  {properties.length}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 sm:rounded-2xl sm:p-4">
                <p className="text-[11px] text-white/42 sm:text-xs">Напрямок</p>
                <p className="mt-1 text-base font-black sm:mt-2 sm:text-xl">
                  Оренда / Продаж
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 sm:rounded-2xl sm:p-4">
                <p className="text-[11px] text-white/42 sm:text-xs">Регіон</p>
                <p className="mt-1 text-base font-black leading-tight sm:mt-2 sm:text-xl">
                  Житомир та Житомирська область
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12">
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-2xl font-black">Новини ринку нерухомості</h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {homepageSettings.realEstateBlocks.map((item) => (
            <a
              key={`${item.title}-${item.date}`}
              href={item.href || "/#objects"}
              className="group relative min-h-64 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition hover:-translate-y-1 hover:border-[#c9a85a]/50 focus:outline-none focus:ring-2 focus:ring-[#c9a85a]"
              aria-label={item.title}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                unoptimized
                className="object-cover opacity-75 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <span className="rounded-full bg-[#c9a85a]/18 px-3 py-1 text-[11px] font-bold text-[#e2c875]">
                  {item.tag}
                </span>
                <h3 className="mt-4 line-clamp-2 text-base font-black leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/65">
                  {item.text}
                </p>
                <p className="mt-5 text-sm text-white/55">{item.date}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-2 sm:mt-7 sm:grid-cols-2 sm:gap-0 sm:overflow-hidden sm:p-0 lg:grid-cols-4">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="flex min-w-0 gap-2 rounded-xl bg-black/20 p-3 sm:gap-4 sm:rounded-none sm:border-r sm:border-white/10 sm:bg-transparent sm:p-5 last:sm:border-r-0"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#c9a85a]/15 text-sm text-[#c9a85a] sm:h-12 sm:w-12 sm:text-xl">
                {item.icon}
              </span>
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-bold leading-tight sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-4 text-white/48 sm:mt-2 sm:text-sm sm:leading-5">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PropertiesSection
        properties={properties}
        sectionTitle={homepageSettings.sectionTitle}
        sectionSubtitle={homepageSettings.sectionSubtitle}
      />

      <section id="map" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#b89652]">
              Географія обʼєктів
            </p>

            <h3 className="mt-3 text-3xl font-bold md:text-4xl">
              Карта нерухомості Житомира
            </h3>

            <p className="mt-3 max-w-2xl text-white/50">
              Переглядайте актуальні обʼєкти на карті та швидко знаходьте
              приміщення у потрібній частині міста.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#070707] p-2 shadow-[0_0_40px_rgba(184,150,82,0.08)] md:rounded-[2rem] md:p-4">
          <MapWrapper properties={properties} />
        </div>
      </section>

      <div id="contacts" />
      <Footer />
    </main>
  );
}
