"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
});

type MapProperty = {
  id: number;
  title: string;
  type: string;
  dealType: "Оренда" | "Продаж";
  priceTotal: string;
  pricePerMeter: string;
  area: string;
  image: string;
  lat: number;
  lng: number;
};

type MapWrapperProps = {
  properties: MapProperty[];
};

export default function MapWrapper({ properties }: MapWrapperProps) {
  return <MapClient properties={properties} />;
}