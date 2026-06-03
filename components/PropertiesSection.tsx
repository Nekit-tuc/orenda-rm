"use client";

import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import type { FormattedProperty } from "@/types/property";

const filters = ["Всі", "Офіси", "Склади", "Квартири", "Комерція"] as const;
const dealFilters = ["Всі", "Оренда", "Продаж"] as const;

type PropertyTypeFilter = (typeof filters)[number];
type DealType = (typeof dealFilters)[number];

type PropertiesSectionProps = {
  properties: FormattedProperty[];
};

export default function PropertiesSection({
  properties,
}: PropertiesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<PropertyTypeFilter>("Всі");
  const [activeDealType, setActiveDealType] = useState<DealType>("Всі");
  const [search, setSearch] = useState("");

  const filteredProperties = properties.filter((property) => {
    const typeMatch =
      activeFilter === "Всі" || property.type === activeFilter;

    const dealMatch =
      activeDealType === "Всі" || property.dealType === activeDealType;

    const searchValue = search.toLowerCase().trim();

    const searchMatch =
      searchValue === "" ||
      property.title.toLowerCase().includes(searchValue) ||
      property.description.toLowerCase().includes(searchValue) ||
      property.address.toLowerCase().includes(searchValue) ||
      property.type.toLowerCase().includes(searchValue) ||
      property.dealType.toLowerCase().includes(searchValue);

    return typeMatch && dealMatch && searchMatch;
  });

  return (
    <section id="objects" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
      <div className="mb-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#b89652] sm:text-sm sm:tracking-[0.3em]">
            Каталог нерухомості
          </p>

          <h3 className="mt-3 text-3xl font-bold md:text-4xl">
            Актуальні об’єкти
          </h3>
        </div>

        <div className="grid gap-3 md:gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <input
            type="text"
            placeholder="Пошук: офіс, склад, адреса..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-h-12 rounded-xl border border-white/10 bg-[#070707] px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-[#b89652]/60 md:px-5"
          />

          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as PropertyTypeFilter)}
            className="min-h-12 rounded-xl border border-white/10 bg-[#070707] px-4 py-4 text-white outline-none transition focus:border-[#b89652]/60 md:px-5"
          >
            {filters.map((filter) => (
              <option key={filter}>{filter}</option>
            ))}
          </select>

          <select
            value={activeDealType}
            onChange={(e) => setActiveDealType(e.target.value as DealType)}
            className="min-h-12 rounded-xl border border-white/10 bg-[#070707] px-4 py-4 text-white outline-none transition focus:border-[#b89652]/60 md:px-5"
          >
            {dealFilters.map((filter) => (
              <option key={filter}>{filter}</option>
            ))}
          </select>

          <a
            href="#objects"
            className="min-h-12 rounded-xl bg-[#b89652] px-6 py-4 text-center font-medium text-white transition hover:opacity-80"
          >
            Показати об’єкти
          </a>
        </div>
      </div>

      {filteredProperties.length > 0 ? (
        <div className="grid gap-5 md:gap-8">
              {filteredProperties.map((property) => (
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
              slug={property.slug}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#b89652] text-white/5 p-10 text-center">
          <h4 className="text-2xl font-bold">Нічого не знайдено</h4>
          <p className="mt-2 text-white/40">
            Спробуй змінити пошук або фільтри.
          </p>
        </div>
      )}
    </section>
  );
}
