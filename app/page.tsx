import Link from "next/link";

import PropertiesSection from "@/components/PropertiesSection";

import MapWrapper from "@/components/MapWrapper";
import { getProperties } from "@/lib/getProperties";
import Image from "next/image";
import Footer from "@/components/Footer";
import FavoritesNav from "@/components/FavoritesNav";
import Header from "@/components/Header";


export default async function Home() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-0 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-[-10%] h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <Header />

    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#b89652]">
          Orenda RM • Житомир
        </p>

        <h1 className="text-5xl font-bold leading-tight md:text-7xl">
          Нерухомість в Житомирі та області
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
          Комерційні приміщення, офіси, склади, квартири та інвестиційні
          об’єкти в одному сучасному каталозі.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#objects"
            className="rounded-xl bg-[#b89652] px-6 py-4 font-medium text-white transition hover:opacity-80"
          >
            Дивитись об’єкти
          </a>

          <a
            href="https://t.me/zt_space"
            target="_blank"
            className="rounded-xl border border-white/15 px-6 py-4 font-medium text-white transition hover:border-[#b89652]/60 hover:text-[#b89652]"
          >
            Зв’язатися
          </a>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[#070707] p-5 shadow-[0_0_40px_rgba(184,150,82,0.08)]">
        <div className="rounded-[1.5rem] border border-[#b89652]/20 bg-black p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            Premium real objeckts
          </p>

          <div className="mt-8 grid gap-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/40">Об’єкти</p>
              <p className="mt-2 text-4xl font-bold text-[#b89652]">
                {properties.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/40">Напрямок</p>
              <p className="mt-2 text-2xl font-bold">Оренда / Продаж</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/40">Регіон</p>
              <p className="mt-2 text-2xl font-bold">Житомир та Житомирська область</p>
            </div>
          </div>
        </div>
      </div>
    </section>

      <PropertiesSection properties={properties} />

    <section id="map" className="mx-auto max-w-7xl px-6 pb-24">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#b89652]">
            Географія об’єктів
          </p>

          <h3 className="mt-3 text-4xl font-bold">
            Карта нерухомості Житомира
          </h3>

          <p className="mt-3 max-w-2xl text-white/50">
            Переглядайте актуальні об’єкти на карті та швидко знаходьте
            приміщення у потрібній частині міста.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[#070707] p-4 shadow-[0_0_40px_rgba(184,150,82,0.08)]">
        <MapWrapper properties={properties} />
      </div>
    </section>
    <Footer />
    </main>
  );
}
