"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Image from "next/image";
import Link from "next/link";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { propertyTypeFilters } from "@/lib/propertyCategories";
import { getRouteUrl } from "@/lib/getRouteUrl";
import { getPropertySlug } from "@/lib/getPropertySlug";
import { hasPropertyLeadAccess } from "@/lib/propertyLeadAccess";
import {
  CloseIcon,
  DetailsIcon,
  ExpandIcon,
  RouteIcon,
} from "@/components/PremiumIcons";

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
  address?: string | null;
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
  const routeUrl = getRouteUrl({
    lat: property.lat,
    lng: property.lng,
    address: property.address,
  });
  const propertyUrl = `/objects/${getPropertySlug(property)}`;
  const [hasLeadAccess, setHasLeadAccess] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setHasLeadAccess(hasPropertyLeadAccess());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <Marker
      ref={markerRef}
      position={[property.lat, property.lng]}
      icon={customIcon}
      eventHandlers={{
        mouseover: () => markerRef.current?.openPopup(),
      }}
    >
      <Popup
        closeButton={false}
        className="orenda-map-popup"
        maxWidth={320}
        minWidth={0}
        autoPanPadding={[16, 16]}
        keepInView
      >
        <div className="group w-[min(320px,calc(100vw-32px))] max-w-[calc(100vw-32px)] overflow-hidden rounded-3xl border border-[#b89652]/35 bg-[#0c0c0c] p-2 font-sans text-white shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_34px_rgba(184,150,82,0.26),0_24px_70px_rgba(0,0,0,0.58)]">
          <div className="relative overflow-hidden rounded-[1.15rem]">
            <Image
              src={property.image}
              alt={property.title}
              width={320}
              height={160}
              sizes="320px"
              unoptimized
              className="h-[136px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] min-[390px]:h-[150px] sm:h-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
            <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-1.5">
              <span className="rounded-full border border-[#b89652]/45 bg-black/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#d8ba68] shadow-[0_8px_26px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                {property.dealType}
              </span>
              <span className="rounded-full border border-[#b89652]/25 bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white/90 shadow-[0_8px_26px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                {property.type}
              </span>
            </div>
            <span className="absolute bottom-2 left-2 rounded-full border border-[#b89652]/40 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase text-[#d8ba68] shadow-[0_8px_26px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              {property.area}
            </span>
          </div>

          <div className="space-y-1.5 px-1.5 py-2.5">
            <h3 className="line-clamp-1 break-words text-base font-black leading-tight text-white">
              {property.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-4">
              <span className="line-clamp-1 max-w-full break-words text-white/62">
                <span className="text-[#d8ba68]">📍</span>{" "}
                {property.address || "Житомир"}
              </span>
              <span className="font-black text-[#d8ba68]">
                {hasLeadAccess ? property.pricePerMeter : "Ціна за запитом"}
              </span>
            </div>
          </div>

          <div className="grid gap-2 px-1 pb-1 min-[360px]:grid-cols-2">
            {routeUrl && (
              <a
                href={routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-[#b89652]/45 bg-black/45 px-2.5 py-2 text-[11px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:border-[#d4af37] hover:bg-[#b89652]/14 hover:text-[#d8ba68] hover:shadow-[0_0_24px_rgba(212,175,55,0.24)] focus:outline-none focus:ring-2 focus:ring-[#b89652]/60 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-[#d8ba68]"
              >
                <RouteIcon />
                <span className="truncate">Маршрут</span>
              </a>
            )}

            <Link
              href={propertyUrl}
              className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-[#b89652]/45 bg-black/45 px-2.5 py-2 text-[11px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:border-[#d4af37] hover:bg-[#b89652]/14 hover:text-[#d8ba68] hover:shadow-[0_0_24px_rgba(212,175,55,0.24)] focus:outline-none focus:ring-2 focus:ring-[#b89652]/60 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-[#d8ba68]"
            >
              <DetailsIcon />
              Детальніше
            </Link>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function Map({ properties }: { properties: MapProperty[] }) {
  const [activeFilter, setActiveFilter] = useState<
    (typeof propertyTypeFilters)[number]
  >(propertyTypeFilters[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredProperties =
    activeFilter === propertyTypeFilters[0]
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
          Натисніть на мітку, щоб відкрити обʼєкт.
        </p>

        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="ml-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#b89652]/45 bg-[#b89652]/10 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(184,150,82,0.14)] transition-all duration-300 hover:border-[#d4af37] hover:bg-[#b89652] hover:text-black hover:shadow-[0_0_28px_rgba(212,175,55,0.28)] focus:outline-none focus:ring-2 focus:ring-[#b89652] md:hidden [&>svg]:text-[#d8ba68] hover:[&>svg]:text-black"
        >
          {isExpanded ? <CloseIcon /> : <ExpandIcon />}
          {isExpanded ? "Закрити карту" : "На весь екран"}
        </button>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 md:mb-6 md:flex-wrap md:gap-3 md:overflow-visible md:pb-0">
        {propertyTypeFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 rounded-full border px-4 py-3 text-sm font-semibold transition-all duration-300 md:px-5 md:py-2 ${
              activeFilter === filter
                ? "border-[#d4af37] bg-[#b89652] text-black shadow-[0_0_24px_rgba(212,175,55,0.28)]"
                : "border-[#b89652]/30 bg-black/30 text-white/70 hover:border-[#d4af37] hover:bg-[#b89652]/15 hover:text-[#d8ba68]"
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
