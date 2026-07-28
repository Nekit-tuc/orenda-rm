"use client";

import { useEffect, useRef, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { propertyTypeFilters } from "@/lib/propertyCategories";
import type { FormattedProperty } from "@/types/property";
import { ObjectsIcon } from "@/components/PremiumIcons";
import { analyticsEvents } from "@/lib/analytics";

const dealFilters = ["Всі", "Оренда", "Продаж"] as const;

type PropertyTypeFilter = (typeof propertyTypeFilters)[number];
type DealType = (typeof dealFilters)[number];

type PropertiesSectionProps = {
  properties: FormattedProperty[];
  sectionTitle: string;
  sectionSubtitle: string;
  sectionDescription?: string;
  titleAs?: "h1" | "h2";
};

export default function PropertiesSection({
  properties,
  sectionTitle,
  sectionSubtitle,
  sectionDescription,
  titleAs = "h2",
}: PropertiesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<PropertyTypeFilter>("Всі");
  const [activeDealType, setActiveDealType] = useState<DealType>("Всі");
  const [search, setSearch] = useState("");
  const isInitialSearchRender = useRef(true);
  const HeadingTag = titleAs;

  useEffect(() => {
    if (isInitialSearchRender.current) {
      isInitialSearchRender.current = false;
      return;
    }

    const searchTerm = search.trim();

    if (!searchTerm) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      analyticsEvents.search({
        search_term: searchTerm,
        section: "properties",
      });
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const filteredProperties = properties.filter((property) => {
    const typeMatch = activeFilter === "Всі" || property.type === activeFilter;

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

  const resetFilters = () => {
    setActiveFilter("Всі");
    setActiveDealType("Всі");
    setSearch("");
  };

  return (
    <section
      id="objects"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-16 sm:px-6 md:pb-24"
    >
      <div className="mb-8">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#b89652] sm:text-xs sm:tracking-[0.28em]">
            {sectionSubtitle}
          </p>

          <HeadingTag className="mt-2.5 text-2xl font-extrabold leading-tight md:text-3xl">
            {sectionTitle}
          </HeadingTag>

          {sectionDescription && (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
              {sectionDescription}
            </p>
          )}
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
            onChange={(e) => {
              const value = e.target.value as PropertyTypeFilter;
              setActiveFilter(value);
              analyticsEvents.filterChange({
                filter_name: "property_type",
                filter_value: value,
                section: "properties",
              });
            }}
            className="min-h-12 rounded-xl border border-white/10 bg-[#070707] px-4 py-4 text-white outline-none transition focus:border-[#b89652]/60 md:px-5"
          >
            {propertyTypeFilters.map((filter) => (
              <option key={filter}>{filter}</option>
            ))}
          </select>

          <select
            value={activeDealType}
            onChange={(e) => {
              const value = e.target.value as DealType;
              setActiveDealType(value);
              analyticsEvents.filterChange({
                filter_name: "deal_type",
                filter_value: value,
                section: "properties",
              });
            }}
            className="min-h-12 rounded-xl border border-white/10 bg-[#070707] px-4 py-4 text-white outline-none transition focus:border-[#b89652]/60 md:px-5"
          >
            {dealFilters.map((filter) => (
              <option key={filter}>{filter}</option>
            ))}
          </select>

          <a
            href="#objects"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#b89652]/45 bg-[#b89652]/10 px-6 py-4 text-center font-semibold text-white shadow-[0_0_25px_rgba(184,150,82,0.14)] transition-all duration-300 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.28)] focus:outline-none focus:ring-2 focus:ring-[#b89652] [&>svg]:text-[#d8ba68] hover:[&>svg]:text-black"
          >
            <ObjectsIcon />
            Показати приміщення
          </a>
        </div>

        <p className="mt-4 text-sm text-white/50">
          Знайдено об’єктів:{" "}
          <span className="font-semibold text-white/80">
            {filteredProperties.length}
          </span>
        </p>
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
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center sm:p-10">
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            За вибраними параметрами об’єктів не знайдено
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
            Спробуйте змінити фільтри або переглянути всі комерційні
            приміщення.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#b89652]/45 bg-[#b89652]/10 px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#d8ba68]"
          >
            Скинути фільтри
          </button>
        </div>
      )}
    </section>
  );
}
