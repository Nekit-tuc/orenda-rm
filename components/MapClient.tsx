"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Image from "next/image";
import Link from "next/link";
import L from "leaflet";
import { useRef, useState } from "react";
import { propertyTypeFilters } from "@/lib/propertyCategories";
import { getPropertySlug } from "@/lib/getPropertySlug";

const customIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 22px;
      height: 22px;
      background: white;
      border: 4px solid black;
      border-radius: 999px;
      box-shadow: 0 0 0 2px rgba(255,255,255,.35), 0 8px 24px rgba(0,0,0,.35);
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

type MapProperty = {
  id: number;
  slug?: string | null;
  title: string;
  type: string;
  dealType: string;
  priceTotal: string;
  pricePerMeter: string;
  area: string;
  image: string;
  lat: number | null;
  lng: number | null;
};

type MappableProperty = MapProperty & {
  lat: number;
  lng: number;
};

function PropertyMarker({ property }: { property: MappableProperty }) {
  const markerRef = useRef<L.Marker | null>(null);

  return (
    <Marker
      ref={markerRef}
      position={[property.lat, property.lng]}
      icon={customIcon}
      eventHandlers={{
        mouseover: () => markerRef.current?.openPopup(),
      }}
    >
      <Popup closeButton={false}>
        <div className="w-[min(230px,calc(100vw-64px))] font-sans">
          <Image
            src={property.image}
            alt={property.title}
            width={230}
            height={112}
            sizes="230px"
            unoptimized
            className="mb-3 h-28 w-full rounded-xl object-cover"
          />

          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-black/40">
            {property.type}
          </p>

          <h3 className="break-words text-base font-semibold text-black">
            {property.title}
          </h3>

          <p className="mt-1 text-sm text-black/60">{property.area}</p>

          <p className="mt-2 break-words text-lg font-bold text-black">
            {property.dealType === "Оренда"
            ? property.pricePerMeter
            : property.priceTotal}
            
          </p>
          <p className="mt-1 text-sm text-black/50">
            {property.dealType === "Оренда"
              ? property.priceTotal
              : property.pricePerMeter}
          </p>

          <Link
            href={`/objects/${getPropertySlug(property)}`}
            className="mt-4 inline-block rounded-full bg-black px-4 py-2 text-sm text-white"
          >
            Детальніше
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

export default function Map({
  properties,
}: {
  properties: MapProperty[];
}) {
  const [activeFilter, setActiveFilter] = useState("Всі");
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredProperties =
    activeFilter === "Всі"
      ? properties
      : properties.filter((property) => property.type === activeFilter);

  const mappableProperties = filteredProperties.filter(
    (property): property is MappableProperty =>
      typeof property.lat === "number" && typeof property.lng === "number"
  );

  return (
    <div
      className={
        isExpanded
          ? "fixed inset-0 z-[100] overflow-auto bg-black p-3"
          : "relative"
      }
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-white/50 md:hidden">
          Натисніть на мітку, щоб відкрити об’єкт.
        </p>

        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="ml-auto rounded-xl border border-[#b89652]/50 px-4 py-3 text-sm font-medium text-[#b89652] transition hover:bg-[#b89652] hover:text-black md:hidden"
        >
          {isExpanded ? "Закрити карту" : "На весь екран"}
        </button>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 md:mb-6 md:flex-wrap md:gap-3 md:overflow-visible md:pb-0">
        {propertyTypeFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 rounded-full px-4 py-3 text-sm transition md:px-5 md:py-2 ${
              activeFilter === filter
                ? "bg-[#b89652] text-white"
                : "border border-white/15 text-white/60 hover:bg-white hover:text-black"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[1.25rem] border border-[#b89652]/20 bg-black p-1.5 md:rounded-[1.5rem] md:p-2">
        <MapContainer
          key={isExpanded ? "expanded" : "normal"}
          center={[50.2547, 28.6587]}
          zoom={isExpanded ? 14 : 13}
          scrollWheelZoom={false}
          className={`z-0 w-full rounded-2xl ${
            isExpanded ? "h-[calc(100dvh-132px)]" : "h-[430px] md:h-[600px]"
          }`}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mappableProperties.map((property) => (
            <PropertyMarker key={property.id} property={property} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
