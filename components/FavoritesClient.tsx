"use client";

import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { useFavoriteIds } from "@/lib/favorites";
import type { FormattedProperty } from "@/types/property";
import { ObjectsIcon } from "@/components/PremiumIcons";

type FavoritesClientProps = {
  properties: FormattedProperty[];
};

export default function FavoritesClient({ properties }: FavoritesClientProps) {
  const favoriteIds = useFavoriteIds();
  const favoriteProperties = properties.filter((property) =>
    favoriteIds.includes(property.id)
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/40">
          Ваші обрані об’єкти
        </p>

        <h1 className="text-5xl font-bold">Обрані об’єкти</h1>

        <p className="mt-4 text-white/50">
          Тут зберігаються об’єкти, які ви відмітили сердечком.
        </p>
      </div>

      {favoriteProperties.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favoriteProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              slug={property.slug}
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
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-3xl font-bold">Поки що пусто</h2>
          <p className="mt-3 text-white/50">
            Натисніть сердечко на об’єкті, щоб додати його в обране.
          </p>

          <Link
            href="/#objects"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[#b89652]/45 bg-[#b89652]/10 px-6 py-3 font-semibold text-white shadow-[0_0_25px_rgba(184,150,82,0.16)] transition-all duration-300 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black hover:shadow-[0_0_32px_rgba(212,175,55,0.3)] focus:outline-none focus:ring-2 focus:ring-[#b89652] [&>svg]:text-[#d8ba68] hover:[&>svg]:text-black"
          >
            <ObjectsIcon />
            Перейти до об’єктів
          </Link>
        </div>
      )}
    </section>
  );
}
