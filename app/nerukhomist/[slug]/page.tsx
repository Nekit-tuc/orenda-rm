import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import SeoLandingAnalytics from "@/components/SeoLandingAnalytics";
import SeoLandingLinks from "@/components/SeoLandingLinks";
import { MessageIcon, ObjectsIcon } from "@/components/PremiumIcons";
import { getProperties } from "@/lib/getProperties";
import { getPropertySlug } from "@/lib/getPropertySlug";
import {
  filterSeoLandingProperties,
  getSeoLandingRedirect,
  getSeoLandingPage,
  seoLandingPages,
} from "@/lib/seoLandingPages";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SeoLandingPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seoLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: SeoLandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const redirectedSlug = getSeoLandingRedirect(slug);
  const page = getSeoLandingPage(redirectedSlug ?? slug);

  if (!page) {
    notFound();
  }

  const properties = await getProperties();
  const shouldIndex = filterSeoLandingProperties(properties, page).length > 0;
  const canonical = `/nerukhomist/${page.slug}`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    robots: {
      index: shouldIndex,
      follow: true,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      locale: "uk_UA",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: page.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function SeoLandingPage({ params }: SeoLandingPageProps) {
  const { slug } = await params;
  const redirectedSlug = getSeoLandingRedirect(slug);

  if (redirectedSlug) {
    permanentRedirect(`/nerukhomist/${redirectedSlug}`);
  }

  const page = getSeoLandingPage(slug);

  if (!page) {
    notFound();
  }

  const properties = await getProperties();
  const matchedProperties = filterSeoLandingProperties(properties, page);
  const relatedProperties = properties
    .filter((property) => !matchedProperties.some((item) => item.id === property.id))
    .slice(0, 3);
  const pagePath = `/nerukhomist/${page.slug}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Головна",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Нерухомість",
        item: absoluteUrl("/objects"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.breadcrumbLabel,
        item: absoluteUrl(pagePath),
      },
    ],
  };
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.h1,
    description: page.description,
    url: absoluteUrl(pagePath),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: matchedProperties.length,
    itemListElement: matchedProperties.map((property, index) => {
      const propertyUrl = absoluteUrl(`/objects/${getPropertySlug(property)}`);

      return {
        "@type": "ListItem",
        position: index + 1,
        url: propertyUrl,
        item: {
          "@type": "RealEstateListing",
          name: property.title,
          url: propertyUrl,
          image: property.image || absoluteUrl(DEFAULT_OG_IMAGE),
          address: property.address,
        },
      };
    }),
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const structuredData = [
    breadcrumbJsonLd,
    collectionJsonLd,
    ...(matchedProperties.length > 0 ? [itemListJsonLd] : []),
    faqJsonLd,
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020202] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <SeoLandingAnalytics
        landingSlug={page.slug}
        landingType={page.landingType}
        resultsCount={matchedProperties.length}
      />
      <Header />

      <section className="relative overflow-hidden border-b border-white/10 px-4 py-8 sm:px-6 md:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,150,82,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
        <div className="relative mx-auto w-full max-w-7xl min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-white/45"
          >
            <Link href="/" className="transition hover:text-[#d8ba68]">
              Головна
            </Link>
            <span>/</span>
            <Link href="/objects" className="transition hover:text-[#d8ba68]">
              Об’єкти
            </Link>
            <span>/</span>
            <span className="text-[#d8ba68]">{page.breadcrumbLabel}</span>
          </nav>

          <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b89652]">
                Investal Estate
              </p>
              <h1 className="mt-3 max-w-4xl break-words text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
                {page.h1}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-white/68 sm:text-base sm:leading-7">
                {page.intro}
              </p>
            </div>

            <div className="rounded-3xl border border-[#b89652]/25 bg-white/[0.035] p-5 backdrop-blur-xl">
              <p className="text-sm text-white/50">Знайдено об’єктів</p>
              <p className="mt-2 text-4xl font-black text-[#d8ba68]">
                {matchedProperties.length}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/55">
                Дані оновлюються з активного каталогу. Якщо потрібного формату
                немає, залиште запит на підбір.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-12">
        {matchedProperties.length > 0 ? (
          <div className="grid gap-5 md:gap-8">
            {matchedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                type={property.type}
                dealType={property.dealType}
                priceTotal={property.priceTotal}
                pricePerMeter={property.pricePerMeter}
                area={property.area}
                address={property.address}
                lat={property.lat}
                lng={property.lng}
                description={property.description}
                image={property.image}
                slug={property.slug}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#b89652]/25 bg-white/[0.035] p-5 text-center backdrop-blur-xl sm:p-8">
            <h2 className="text-2xl font-black">Наразі немає активних об’єктів</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/62">
              Ми не додаємо фіктивні оголошення на SEO-сторінки. Напишіть нам,
              і команда перевірить актуальні варіанти під ваш бюджет, площу та
              локацію.
            </p>
            <div className="mt-5 grid gap-3 sm:flex sm:justify-center">
              <a
                href="https://t.me/orenda_rm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#b89652]/45 bg-[#b89652]/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#b89652] hover:text-black"
              >
                <MessageIcon />
                Написати в Telegram
              </a>
              <Link
                href="/objects"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#d4af37]/60 hover:text-[#d8ba68]"
              >
                <ObjectsIcon />
                Переглянути весь каталог
              </Link>
            </div>
          </div>
        )}

        {matchedProperties.length === 0 && relatedProperties.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-black">Близькі актуальні пропозиції</h2>
            <p className="mt-2 text-sm text-white/55">
              Ці об’єкти не повністю відповідають фільтру сторінки, але можуть
              бути корисними для порівняння.
            </p>
            <div className="mt-5 grid gap-5">
              {relatedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  type={property.type}
                  dealType={property.dealType}
                  priceTotal={property.priceTotal}
                  pricePerMeter={property.pricePerMeter}
                  area={property.area}
                  address={property.address}
                  lat={property.lat}
                  lng={property.lng}
                  description={property.description}
                  image={property.image}
                  slug={property.slug}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 md:pb-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-7">
            <h2 className="text-2xl font-black">Як обрати приміщення</h2>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-white/66 sm:text-base">
              {page.seoText.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <aside className="rounded-3xl border border-[#b89652]/25 bg-[radial-gradient(circle_at_top_right,rgba(184,150,82,0.2),transparent_36%),rgba(255,255,255,0.035)] p-5 backdrop-blur-xl sm:p-6">
            <h2 className="text-xl font-black">
              Не знайшли потрібний варіант?
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/62">
              Напишіть нам параметри: тип приміщення, бажану площу, район,
              бюджет і формат угоди. Ми підкажемо, які варіанти є зараз.
            </p>
            <a
              href="https://t.me/orenda_rm"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#b89652]/45 bg-[#b89652]/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#b89652] hover:text-black"
            >
              <MessageIcon />
              Звернутися
            </a>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 md:pb-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-7">
          <h2 className="text-2xl font-black">Питання та відповіді</h2>
          <div className="mt-5 grid gap-3">
            {page.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <summary className="cursor-pointer list-none text-base font-bold text-white">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SeoLandingLinks currentSlug={page.slug} title="Схожі напрямки" />
      <Footer />
    </main>
  );
}
