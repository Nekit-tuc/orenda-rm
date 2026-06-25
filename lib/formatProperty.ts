import type { FormattedProperty, Property } from "@/types/property";
import { createSlug } from "@/lib/createSlug";

export function formatProperty(property: Property): FormattedProperty {
  return {
    id: property.id,
    title: property.title,
    type: property.type,
    dealType: property.deal_type,
    price: property.price,
    priceTotal: property.price_total,
    pricePerMeter: property.price_per_meter,
    area: property.area,
    address: property.address,
    floor: property.floor ?? 0,
    floors: property.floors ?? 0,
    parking: property.parking,
    heating: property.heating ?? "Не вказано",
    internet: property.internet,
    security: property.security,
    bathroom: property.bathroom,
    description: property.description,
    image: property.image,
    images: property.images ?? [property.image],
    lat: property.lat,
    lng: property.lng,
    views: property.views,
    status: property.status,
    slug: property.slug || createSlug(property),
  };
}
