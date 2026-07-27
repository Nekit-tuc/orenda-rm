import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { formatNewsDate } from "@/components/news/NewsCard";
import { getPublishedNewsBySlug } from "@/lib/getPublishedNews";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getPublishedNewsBySlug(slug);

  if (!news) {
    return {
      title: "Новину не знайдено",
    };
  }

  const description =
    news.excerpt || news.content?.slice(0, 155) || "Новина Investal Estate";

  return {
    title: news.title,
    description,
    alternates: {
      canonical: `/news/${news.slug}`,
    },
    openGraph: {
      title: news.title,
      description,
      type: "article",
      publishedTime: news.published_at || undefined,
      images: news.image_url ? [news.image_url] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await getPublishedNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const content = news.content || news.excerpt || "";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020202] text-white">
      <Header />
      <article className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <Link
          href="/news"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#b89652]/40 px-5 py-3 text-sm font-semibold text-[#d8ba68] transition hover:bg-[#b89652] hover:text-black"
        >
          ← До всіх новин
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {news.category && (
              <span className="rounded-full bg-[#d8ba68] px-4 py-1.5 font-semibold text-black">
                {news.category}
              </span>
            )}
            <time className="text-white/45">
              {formatNewsDate(news.published_at)}
            </time>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl md:text-5xl">
            {news.title}
          </h1>
          {news.excerpt && (
            <p className="mt-5 text-lg leading-8 text-white/60">
              {news.excerpt}
            </p>
          )}
        </header>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-[#b89652]/25 bg-white/5">
          <Image
            src={news.image_url || "/hero-building.png"}
            alt={news.title}
            fill
            sizes="(min-width: 1024px) 960px, 100vw"
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-base leading-8 text-white/72 sm:p-7">
          {content ? (
            content.split("\n").map((paragraph) => (
              <p key={paragraph} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))
          ) : (
            <p>Текст новини скоро буде додано.</p>
          )}
        </div>
      </article>
      <Footer />
    </main>
  );
}
