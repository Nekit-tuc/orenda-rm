import Link from "next/link";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyFeatures from "@/components/PropertyFeatures";
import { supabase } from "@/lib/supabase";
import { formatProperty } from "@/lib/formatProperty";
import type { Property } from "@/types/property";
import ViewCounter from "@/components/ViewCounter";
import Image from "next/image";
import FavoritesNav from "@/components/FavoritesNav";
import ContactForm from "@/components/ContactForm";

      type Props = {
        params: Promise<{
          id: string;
        }>;
      };

      export async function generateMetadata({ params }: Props) {
        const { id } = await params;

        let query = supabase
          .from("properties")
          .select("*");

        const { data } = Number(id)
          ? await query.eq("id", Number(id)).single()
          : await query.eq("slug", id).single();

        if (!data) {
          return {
            title: "Об’єкт не знайдено | ZT SPACE",
            description: "Об’єкт нерухомості не знайдено.",
          };
        }

        const property = formatProperty(data as Property);

        const mainPrice =
          property.dealType === "Оренда"
            ? property.pricePerMeter
            : property.priceTotal;

        return {
          title: `${property.dealType}: ${property.title}, ${property.area} | ZT SPACE`,
          description: `${property.dealType} нерухомості у Житомирі: ${property.title}, ${property.area}, ${mainPrice}. ${property.address}`,
          openGraph: {
            title: `${property.dealType}: ${property.title} | ZT SPACE`,
            description: `${property.area}, ${mainPrice}, ${property.address}`,
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

      let query = supabase
        .from("properties")
        .select("*");

      const { data, error } = Number(id)
        ? await query.eq("id", Number(id)).single()
        : await query.eq("slug", id).single();

      if (error || !data) {
        return (
          <main className="flex min-h-screen items-center justify-center bg-black text-white">
            Об’єкт не знайдено
          </main>
        );
      }

  const property = formatProperty(data as Property);

  return (
    <main className="min-h-screen bg-black text-white">
      <ViewCounter
        propertyId={property.id}
        currentViews={property.views}
      />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo_v1.png"
              alt="Orenda RM"
              width={110}
              height={110}
              className="rounded-full"
              priority
            />


          </Link>

          <div className="flex items-center gap-3">

          <FavoritesNav />

            <a
              href="https://t.me/zt_space"
              target="_blank"
              className="rounded-full border border-white/20 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
            >
              Telegram
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <PropertyGallery
            images={property.images || [property.image]}
            title={property.title}
          />

          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/40">
              Житомир
            </p>

            <h1 className="text-5xl font-bold leading-tight">
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

            <p className="mt-10 text-lg leading-8 text-white/60">
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
            <div className="text-5xl font-bold text-[#b89652]">
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

            <div className="mt-10 flex gap-4">
              <a
                href="https://t.me/zt_space"
                target="_blank"
                className="rounded-full bg-white px-6 py-3 font-medium text-black transition hover:opacity-80"
              >
                Написати
              </a>

              <Link
                href="/"
                className="rounded-full border border-white/20 px-6 py-3 transition hover:bg-white hover:text-black"
              >
                Назад
              </Link>
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
