import Link from "next/link";
import { redirect } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyFeatures from "@/components/PropertyFeatures";
import { formatProperty } from "@/lib/formatProperty";
import ViewCounter from "@/components/ViewCounter";
import Image from "next/image";
import FavoritesNav from "@/components/FavoritesNav";
import ContactForm from "@/components/ContactForm";
import { getRouteUrl } from "@/lib/getRouteUrl";
import { getPropertyBySlugOrId } from "@/lib/getPropertyBySlugOrId";
import SharePropertyButton from "@/components/SharePropertyButton";

const baseUrl = "https://orenda-rm.vercel.app";

      type Props = {
        params: Promise<{
          id: string;
        }>;
      };

      export async function generateMetadata({ params }: Props) {
        const { id } = await params;

        const { data } = await getPropertyBySlugOrId(id);

        if (!data) {
          return {
            title: "Об’єкт не знайдено | ZT SPACE",
            description: "Об’єкт нерухомості не знайдено.",
          };
        }

        const property = formatProperty(data);

        const mainPrice =
          property.dealType === "Оренда"
            ? property.pricePerMeter
            : property.priceTotal;
        const canonicalUrl = `${baseUrl}/objects/${property.slug}`;

        return {
          title: `${property.dealType}: ${property.title}, ${property.area} | Orenda RM`,
          description: `${property.title}. ${property.address}. ${property.area}, ${mainPrice}. ${property.dealType} нерухомості у Житомирі та області.`,
          alternates: {
            canonical: canonicalUrl,
          },
          openGraph: {
            title: `${property.dealType}: ${property.title} | Orenda RM`,
            description: `${property.area}, ${mainPrice}, ${property.address}`,
            url: canonicalUrl,
            images: [
              {
                url: property.image,
                width: 1200,
                height: 630,
                alt: property.title,
              },
            ],
            type: "website",
          },
        };
      }

    export default async function PropertyPage({ params }: Props) {
      const { id } = await params;

      const { data, error, foundBy } = await getPropertyBySlugOrId(id);

      if (error || !data) {
        return (
          <main className="flex min-h-screen items-center justify-center bg-black text-white">
            Об’єкт не знайдено
          </main>
        );
      }

  const property = formatProperty(data);

  if (foundBy === "id" && property.slug) {
    redirect(`/objects/${property.slug}`);
  }

  const routeUrl = getRouteUrl(property);
  const propertyUrl = `/objects/${property.slug || property.id}`;
  const shareText = `${property.description} ${property.priceTotal}`.trim();

  return (
    <main className="min-h-screen bg-black text-white">
      <ViewCounter
        propertyId={property.id}
        currentViews={property.views}
      />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo_v1.png"
              alt="Orenda RM"
              width={110}
              height={110}
              className="h-14 w-14 rounded-full md:h-24 md:w-24"
              priority
            />


          </Link>

          <div className="flex items-center gap-2 md:gap-3">

          <FavoritesNav />

            <a
              href="https://t.me/zt_space"
              target="_blank"
              className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white hover:text-black md:px-5"
            >
              Telegram
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <PropertyGallery
            images={property.images || [property.image]}
            title={property.title}
          />

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-white/40 sm:text-sm sm:tracking-[0.3em]">
              Житомир
            </p>

            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              {property.title}
            </h1>

            <p className="mt-4 text-white/50">📍 {property.address}</p>

            <div className="mt-6 flex flex-wrap gap-4">
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">
                {property.area}
              </span>

              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">
                {property.type}
              </span>

              <span className="rounded-full bg-[#b89652] px-4 py-2 text-sm text-white">
                {property.dealType}
              </span>
            </div>

            <p className="mt-8 text-base leading-7 text-white/60 md:mt-10 md:text-lg md:leading-8">
              {property.description}
            </p>

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

            <div className="mt-10">
            <div className="text-3xl font-bold text-[#b89652] md:text-5xl">
                {property.dealType === "Оренда"
                  ? property.pricePerMeter
                  : property.priceTotal}
              </div>

              <p className="mt-2 text-lg text-white/40">
                {property.dealType === "Оренда"
                  ? property.priceTotal
                  : property.pricePerMeter}
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:flex sm:gap-4">
              <a
                href="https://t.me/zt_space"
                target="_blank"
                className="rounded-full bg-white px-6 py-3 text-center font-medium text-black transition hover:opacity-80"
              >
                Написати
              </a>

              <Link
                href="/"
                className="rounded-full border border-white/20 px-6 py-3 text-center transition hover:bg-white hover:text-black"
              >
                Назад
              </Link>
            </div>

            {routeUrl && (
              <a
                href={routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#b89652]/60 bg-[#b89652]/10 px-6 py-3 text-center font-medium text-[#e2c875] transition hover:bg-[#b89652] hover:text-black sm:w-auto"
              >
                <span>📍</span>
                Побудувати маршрут
              </a>
            )}

            <div className="mt-3">
              <SharePropertyButton
                title={property.title}
                text={shareText}
                url={propertyUrl}
                rounded="full"
              />
            </div>

            <ContactForm
              propertyTitle={property.title}
              propertyId={property.id}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
