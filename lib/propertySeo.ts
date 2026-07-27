import type { FormattedProperty } from "@/types/property";

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() || "";
}

function readableDealType(value?: string | null) {
  const text = cleanText(value).toLowerCase();

  if (text.includes("прод") || value === "РџСЂРѕРґР°Р¶") {
    return "Продаж";
  }

  if (text.includes("орен") || value === "РћСЂРµРЅРґР°") {
    return "Оренда";
  }

  return cleanText(value) || "Оренда";
}

function locationFromProperty(property: FormattedProperty) {
  const address = cleanText(property.address);

  if (!address) {
    return "Житомир";
  }

  return address.length > 70 ? `${address.slice(0, 67).trim()}...` : address;
}

export function getVisiblePropertyPrice(property: FormattedProperty) {
  return cleanText(property.pricePerMeter || property.price || "");
}

export function buildPropertySeoTitle(property: FormattedProperty) {
  const dealType = readableDealType(property.dealType);
  const type = cleanText(property.type).toLowerCase();
  const area = cleanText(property.area);
  const location = locationFromProperty(property);

  return [dealType, type, area, location].filter(Boolean).join(" ");
}

export function buildPropertySeoDescription(property: FormattedProperty) {
  const dealType = readableDealType(property.dealType).toLowerCase();
  const type = cleanText(property.type).toLowerCase();
  const address = locationFromProperty(property);
  const area = cleanText(property.area);
  const price = getVisiblePropertyPrice(property);
  const intro = [dealType, type, address, area].filter(Boolean).join(", ");
  const details = cleanText(property.description);
  const pricePart = price ? ` Ціна: ${price}.` : "";
  const text = `${intro}.${pricePart} ${details}`.trim();

  return text.length > 160 ? `${text.slice(0, 157).trim()}...` : text;
}

export function getPropertyDealTypeLabel(property: FormattedProperty) {
  return readableDealType(property.dealType);
}
