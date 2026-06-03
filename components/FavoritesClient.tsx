"use client";

import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { useFavoriteIds } from "@/lib/favorites";
import type { FormattedProperty } from "@/types/property";

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
              title={property.title}
              type={property.type}
              dealType={property.dealType}
              priceTotal={property.priceTotal}
              pricePerMeter={property.pricePerMeter}
              area={property.area}
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
            className="mt-6 inline-block rounded-full bg-[#b89652] px-6 py-3 font-medium text-white px-6 py-3 font-medium text-black transition hover:opacity-80"
          >
            Перейти до об’єктів
          </Link>
        </div>
      )}
    </section>
  );
}
