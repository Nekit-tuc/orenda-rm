import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyFeatures from "@/components/PropertyFeatures";
import { formatProperty } from "@/lib/formatProperty";
import ViewCounter from "@/components/ViewCounter";
import ContactForm from "@/components/ContactForm";
import { getRouteUrl } from "@/lib/getRouteUrl";
import { getPropertyBySlugOrId } from "@/lib/getPropertyBySlugOrId";
import SharePropertyButton from "@/components/SharePropertyButton";
import { getPropertySlug } from "@/lib/getPropertySlug";
import Header from "@/components/Header";
import { BackIcon, MessageIcon, RouteIcon } from "@/components/PremiumIcons";
import PropertyPageAccessGate from "@/components/PropertyPageAccessGate";
import ObjectAnalytics from "@/components/ObjectAnalytics";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/site";
import {
  buildPropertySeoDescription,
  buildPropertySeoTitle,
  getPropertyDealTypeLabel,
  getVisiblePropertyPrice,
} from "@/lib/propertySeo";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function parseNumericValue(value?: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const match = normalized.match(/\d+(?:\.\d+)?/);

  return match ? Number(match[0]) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getPropertyBySlugOrId(id);

  if (!data) {
    notFound();
  }

  const property = formatProperty(data);
  const propertySlug = getPropertySlug(property);
  const canonicalPath = `/objects/${propertySlug}`;
  const title = buildPropertySeoTitle(property);
  const description = buildPropertySeoDescription(property);
  const image = property.image || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      type: "website",
      locale: "uk_UA",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;
  const { data, error, foundBy } = await getPropertyBySlugOrId(id);

  if (error || !data) {
    notFound();
  }

  const property = formatProperty(data);
  const propertySlug = getPropertySlug(property);

  if ((foundBy === "id" || id !== propertySlug) && propertySlug) {
    redirect(`/objects/${propertySlug}`);
  }

  const routeUrl = getRouteUrl(property);
  const propertyUrl = `/objects/${propertySlug}`;
  const absolutePropertyUrl = absoluteUrl(propertyUrl);
  const shareText = `${property.description} ${property.priceTotal}`.trim();
  const visiblePrice = getVisiblePropertyPrice(property);
  const areaValue = parseNumericValue(property.area);
  const offerPrice = parseNumericValue(visiblePrice);
  const propertyImages = property.images?.filter(Boolean) || [];
  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: absolutePropertyUrl,
    image: propertyImages.length ? propertyImages : [absoluteUrl(DEFAULT_OG_IMAGE)],
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: "Житомир",
      addressRegion: "Житомирська область",
      addressCountry: "UA",
    },
    ...(areaValue
      ? {
          floorSize: {
            "@type": "QuantitativeValue",
            value: areaValue,
            unitCode: "MTK",
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: absolutePropertyUrl,
      availability: "https://schema.org/InStock",
      businessFunction:
        getPropertyDealTypeLabel(property) === "Оренда"
          ? "http://purl.org/goodrelations/v1#LeaseOut"
          : "http://purl.org/goodrelations/v1#Sell",
      ...(offerPrice
        ? {
            price: offerPrice,
            priceCurrency: "UAH",
          }
        : {}),
    },
  };
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
        name: "Об’єкти",
        item: absoluteUrl("/#objects"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.title,
        item: absolutePropertyUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([listingJsonLd, breadcrumbJsonLd]),
        }}
      />
      <ViewCounter propertyId={property.id} currentViews={property.views} />
      <ObjectAnalytics
        id={property.id}
        slug={propertySlug}
        type={property.type}
        city="Житомир"
        district={property.address}
        dealType={property.dealType}
      />
      <Header />
      <PropertyPageAccessGate
        propertyId={property.id}
        propertyTitle={property.title}
        propertySlug={propertySlug}
        propertyType={property.type}
        dealType={property.dealType}
      />

      <section className="mx-auto max-w-7xl overflow-hidden px-4 py-6 sm:px-6 md:py-10">
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-8">
          <PropertyGallery
            images={property.images || [property.image]}
            title={property.title}
            address={property.address}
            dealType={property.dealType}
            type={property.type}
          />

          <div className="min-w-0">
            <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-white/40 sm:text-xs sm:tracking-[0.28em]">
              Investal Estate
            </p>

            <h1 className="break-words text-2xl font-extrabold leading-tight md:text-4xl">
              {property.title}
            </h1>

            <p className="mt-3 break-words text-sm leading-6 text-white/50">
              Адреса: {property.address}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70">
                {property.area}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70">
                {property.type}
              </span>

              <span className="rounded-full border border-[#b89652]/45 bg-[#b89652]/15 px-3 py-1.5 text-xs font-semibold text-[#d8ba68]">
                {property.dealType}
              </span>
            </div>

            <PropertyFeatures
              address={property.address}
              floor={property.floor}
              floors={property.floors}
              parking={property.parking}
              heating={property.heating}
              internet={property.internet}
              security={property.security}
              bathroom={property.bathroom}
            />

            <p className="mt-4 text-sm leading-6 text-white/60 md:text-[15px] md:leading-7">
              {property.description}
            </p>

            <div className="mt-6 rounded-2xl border border-[#b89652]/25 bg-[#b89652]/8 px-4 py-3">
              <div className="break-words text-2xl font-extrabold text-[#d8ba68] md:text-3xl">
                {property.pricePerMeter}
              </div>

              <p className="mt-1 break-words text-sm text-white/42">
                Ціна за м² після заявки
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <a
                href="https://t.me/orenda_rm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#b89652]/45 bg-[#b89652]/10 px-4 py-2 text-center text-xs font-semibold text-white shadow-[0_0_22px_rgba(184,150,82,0.14)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black hover:shadow-[0_0_28px_rgba(212,175,55,0.26)] focus:outline-none focus:ring-2 focus:ring-[#b89652] sm:text-sm [&>svg]:text-[#d8ba68] hover:[&>svg]:text-black"
              >
                <MessageIcon />
                Написати
              </a>

              <SharePropertyButton
                title={property.title}
                text={shareText}
                url={propertyUrl}
                rounded="xl"
                className="min-h-10 px-4 py-2 text-xs sm:text-sm"
              />
            </div>

            {routeUrl && (
              <a
                href={routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#b89652]/45 bg-[#b89652]/10 px-4 py-2 text-center text-xs font-semibold text-white shadow-[0_0_22px_rgba(184,150,82,0.14)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black hover:shadow-[0_0_28px_rgba(212,175,55,0.26)] focus:outline-none focus:ring-2 focus:ring-[#b89652] sm:w-auto sm:text-sm [&>svg]:text-[#d8ba68] hover:[&>svg]:text-black"
              >
                <RouteIcon />
                Побудувати маршрут
              </a>
            )}

            <Link
              href="/"
              className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#b89652]/35 bg-black/30 px-4 py-2 text-center text-xs font-semibold text-white shadow-[0_0_18px_rgba(184,150,82,0.1)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652]/12 hover:text-[#d8ba68] hover:shadow-[0_0_24px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-[#b89652] sm:w-auto sm:text-sm [&>svg]:text-[#d8ba68]"
            >
              <BackIcon />
              Назад
            </Link>

            <ContactForm
              propertyTitle={property.title}
              propertyId={property.id}
              propertySlug={propertySlug}
              propertyType={property.type}
              dealType={property.dealType}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
