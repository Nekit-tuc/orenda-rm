import type { FormattedProperty } from "@/types/property";

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() || "";
}

function readableDealType(value?: string | null) {
  const text = cleanText(value).toLowerCase();

  if (text.includes("прод")) {
    return "Продаж";
  }

  if (text.includes("орен")) {
    return "Оренда";
  }

  return cleanText(value) || "Оренда";
}

function isCommercialType(value?: string | null) {
  const text = cleanText(value).toLowerCase();

  return text.includes("комер") || text.includes("маф") || text.includes("кіоск");
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

  if (dealType === "Оренда" && isCommercialType(property.type)) {
    return ["Оренда комерційного приміщення", area, location]
      .filter(Boolean)
      .join(", ");
  }

  return [dealType, type, area, location].filter(Boolean).join(", ");
}

export function buildPropertySeoDescription(property: FormattedProperty) {
  const dealType = readableDealType(property.dealType).toLowerCase();
  const type = cleanText(property.type).toLowerCase();
  const address = locationFromProperty(property);
  const area = cleanText(property.area);
  const price = getVisiblePropertyPrice(property);
  const intro = [dealType, type, area, address].filter(Boolean).join(", ");
  const details = cleanText(property.description);
  const pricePart = price ? ` Ціна за м²: ${price}.` : "";
  const text = `${intro}.${pricePart} ${details}`.trim();

  return text.length > 160 ? `${text.slice(0, 157).trim()}...` : text;
}

export function getPropertyDealTypeLabel(property: FormattedProperty) {
  return readableDealType(property.dealType);
}

export function buildPropertyImageAlt(property: {
  address?: string | null;
  dealType?: string | null;
  type?: string | null;
}) {
  const dealType = readableDealType(property.dealType).toLowerCase();
  const address = cleanText(property.address);
  const suffix = address ? ` на ${address}, Житомир` : " у Житомирі";

  if (dealType === "оренда" && isCommercialType(property.type)) {
    return `Комерційне приміщення в оренду${suffix}`;
  }

  return `Фото приміщення${suffix}`;
}

