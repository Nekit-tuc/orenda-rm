import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsCard from "@/components/news/NewsCard";
import { getPublishedNews } from "@/lib/getPublishedNews";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Новини ринку нерухомості",
  description:
    "Аналітика, поради та актуальні матеріали про інвестиційну нерухомість від Investal Estate.",
  alternates: {
    canonical: "/news",
  },
};

export default async function NewsPage() {
  const news = await getPublishedNews();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020202] text-white">
      <Header />
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#d8ba68]">
              Investal Estate
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl md:text-5xl">
              Усі новини
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
              Добірка актуальних матеріалів про ринок, інвестиції,
              законодавство та комерційну нерухомість.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#b89652]/40 px-5 py-3 text-sm font-semibold text-[#d8ba68] transition hover:bg-[#b89652] hover:text-black"
          >
            На головну
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-white/60">
            Новин поки немає.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} compact />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
