import Image from "next/image";
import PropertiesSection from "@/components/PropertiesSection";
import MapWrapper from "@/components/MapWrapper";
import { getProperties } from "@/lib/getProperties";
import { getHomepageSettings } from "@/lib/homepageSettings";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BuyoutIcon, MessageIcon, ObjectsIcon } from "@/components/PremiumIcons";
import SubmitPropertyButton from "@/components/SubmitPropertyButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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

      <section className="relative overflow-hidden border-b border-white/10">
        <Image
          src="/hero-building.png"
          alt="Сучасний будинок Orenda RM"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[61%_center] opacity-45 md:object-contain md:object-right md:opacity-70"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_34%,rgba(184,150,82,0.2),transparent_28%),linear-gradient(90deg,#020202_0%,rgba(2,2,2,0.86)_40%,rgba(2,2,2,0.42)_68%,#020202_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-black/30" />

        <div className="relative mx-auto grid min-h-[calc(100svh-76px)] w-full max-w-7xl gap-5 px-4 py-7 sm:px-6 sm:py-9 md:min-h-[660px] md:gap-8 md:py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:py-10 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="relative z-10 max-w-3xl">
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#c9a85a] sm:text-[11px] sm:tracking-[0.32em]">
              Orenda RM • Житомир
            </p>

            <h1 className="max-w-[570px] text-[clamp(2.05rem,9.6vw,2.55rem)] font-extrabold uppercase leading-[1.1] tracking-[-0.01em] text-white md:text-[clamp(2.85rem,4.9vw,4.15rem)]">
              {homepageSettings.heroTitle}
            </h1>

            <p className="mt-4 max-w-[480px] text-sm leading-6 text-white/72 sm:text-[15px] md:mt-5 md:text-base md:leading-7">
              {homepageSettings.heroSubtitle}
            </p>

            <div className="mt-5 grid gap-2.5 sm:flex sm:flex-wrap md:mt-7">
              <a
                href={homepageSettings.heroButtonUrl}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#b89652]/45 bg-[#b89652]/10 px-5 py-2.5 text-center text-[13px] font-bold text-white shadow-[0_0_25px_rgba(184,150,82,0.18)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black hover:shadow-[0_0_35px_rgba(212,175,55,0.35)] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] md:px-7 md:py-3.5 md:text-sm [&>svg]:text-[#d8ba68] hover:[&>svg]:text-black"
              >
                <ObjectsIcon />
                Дивитись обʼєкти
              </a>

              <a
                href="#contacts"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#b89652]/35 bg-black/35 px-5 py-2.5 text-center text-[13px] font-bold text-white shadow-[0_0_20px_rgba(184,150,82,0.12)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652]/12 hover:text-[#d8ba68] hover:shadow-[0_0_28px_rgba(212,175,55,0.22)] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] md:px-7 md:py-3.5 md:text-sm [&>svg]:text-[#d8ba68]"
              >
                <MessageIcon />
                Звʼязатись
              </a>

            </div>
          </div>

          <div className="relative z-10 rounded-[1.35rem] border border-white/12 bg-[#101010]/70 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:p-4 lg:rounded-[1.75rem] lg:p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#c9a85a] sm:tracking-[0.32em]">
              Premium real objects
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-3">
              <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.045] p-3 lg:rounded-2xl lg:p-4">
                <p className="text-[10px] text-white/45 sm:text-xs">Обʼєкти</p>
                <p className="mt-1 text-lg font-extrabold text-[#c9a85a] sm:text-xl lg:text-2xl">
                  {properties.length}
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.045] p-3 lg:rounded-2xl lg:p-4">
                <p className="text-[10px] text-white/45 sm:text-xs">Напрямок</p>
                <p className="mt-1 text-xs font-extrabold leading-tight sm:text-sm lg:text-lg">
                  Оренда / Продаж
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.045] p-3 lg:rounded-2xl lg:p-4">
                <p className="text-[10px] text-white/45 sm:text-xs">Регіон</p>
                <p className="mt-1 text-xs font-extrabold leading-tight sm:text-sm lg:text-lg">
                  Житомир та область
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-8">
        <div className="grid gap-4 overflow-hidden rounded-3xl border border-[#b89652]/30 bg-[radial-gradient(circle_at_top_right,rgba(184,150,82,0.18),transparent_32%),rgba(255,255,255,0.035)] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:p-6">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#b89652]/35 bg-black/35 text-[#d8ba68] shadow-[0_0_24px_rgba(184,150,82,0.14)] sm:h-14 sm:w-14">
            <BuyoutIcon className="h-7 w-7" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#b89652]">
              Пропозиція власникам
            </p>
            <h2 className="mt-1.5 text-xl font-extrabold text-white sm:text-2xl">
              Викуп обʼєктів
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/64">
              Ми також розглядаємо обʼєкти для викупу: землю, комерційну нерухомість та будинки.
              Надішліть інформацію про свій обʼєкт — ми ознайомимось із пропозицією та звʼяжемося з вами.
            </p>
          </div>

          <SubmitPropertyButton
            label="Запропонувати"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-[#b89652]/45 bg-[#b89652]/10 px-5 py-2.5 text-center text-sm font-bold text-white shadow-[0_0_24px_rgba(184,150,82,0.16)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black hover:shadow-[0_0_34px_rgba(212,175,55,0.3)] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] md:w-auto"
          />
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-10 sm:px-6 md:pb-14">
        <div className="overflow-hidden rounded-3xl border border-[#b89652]/30 bg-[radial-gradient(circle_at_80%_35%,rgba(184,150,82,0.22),transparent_28%),linear-gradient(135deg,rgba(184,150,82,0.16),rgba(255,255,255,0.035))] p-5 shadow-[0_26px_90px_rgba(0,0,0,0.32)] sm:p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl font-extrabold sm:text-2xl md:text-3xl">
                Не знайшли <span className="text-[#d8ba68]">потрібний варіант?</span>
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">
                Не знайшли потрібний варіант? Напишіть нам — підберемо приміщення під ваш бюджет і задачу.
              </p>
            </div>

            <div className="grid gap-3 sm:flex md:justify-end">
              <a
                href="https://t.me/orenda_rm"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#b89652]/45 bg-[#b89652]/10 px-5 py-2.5 text-center text-[13px] font-bold text-white shadow-[0_0_25px_rgba(184,150,82,0.18)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black hover:shadow-[0_0_35px_rgba(212,175,55,0.35)] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] sm:text-sm [&>svg]:text-[#d8ba68] hover:[&>svg]:text-black"
              >
                <MessageIcon />
                Написати в Telegram
              </a>
              <a
                href="#objects"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#b89652]/35 bg-black/25 px-5 py-2.5 text-center text-[13px] font-bold text-white shadow-[0_0_20px_rgba(184,150,82,0.12)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652]/12 hover:text-[#d8ba68] hover:shadow-[0_0_28px_rgba(212,175,55,0.22)] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] sm:text-sm [&>svg]:text-[#d8ba68]"
              >
                <ObjectsIcon />
                Переглянути обʼєкти
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold sm:text-2xl">Новини ринку нерухомості</h2>
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
