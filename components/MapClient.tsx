"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Image from "next/image";
import Link from "next/link";
import L from "leaflet";
import { useRef, useState } from "react";

const filters = ["Всі", "Офіси", "Склади", "Квартири", "Комерція"];

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
  title: string;
  type: string;
  dealType: string;
  priceTotal: string;
  pricePerMeter: string;
  area: string;
  image: string;
  lat: number;
  lng: number;
};

function PropertyMarker({ property }: { property: MapProperty }) {
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
        <div className="w-[230px] font-sans">
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

          <h3 className="text-base font-semibold text-black">
            {property.title}
          </h3>

          <p className="mt-1 text-sm text-black/60">{property.area}</p>

          <p className="mt-2 text-lg font-bold text-black">
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
            href={`/objects/${property.id}`}
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

  const filteredProperties =
    activeFilter === "Всі"
      ? properties
      : properties.filter((property) => property.type === activeFilter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-5 py-2 text-sm transition ${
              activeFilter === filter
                ? "bg-[#b89652] text-white"
                : "border border-white/15 text-white/60 hover:bg-white hover:text-black"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-[#b89652]/20 bg-black p-2">        <MapContainer
          center={[50.2547, 28.6587]}
          zoom={13}
          scrollWheelZoom={true}
          className="z-0 h-[600px] w-full rounded-2xl"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredProperties.map((property) => (
            <PropertyMarker key={property.id} property={property} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
