import type { FormattedProperty } from "@/types/property";

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() || "";
}

function ensureSquareMeters(value?: string | null) {
  const text = cleanText(value);

  if (!text) {
    return "";
  }

  return /м²|м2/i.test(text) ? text : `${text} м²`;
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

  return (
    text.includes("комер") ||
    text.includes("маф") ||
    text.includes("кіоск") ||
    text.includes("офіс") ||
    text.includes("склад") ||
    text.includes("магаз")
  );
}

function normalizeType(value?: string | null) {
  const text = cleanText(value);
  const lower = text.toLowerCase();

  if (lower.includes("маф") || lower.includes("кіоск")) {
    return "МАФ/кіоск";
  }

  if (lower.includes("офіс")) {
    return "офіс";
  }

  if (lower.includes("склад")) {
    return "склад";
  }

  if (lower.includes("магаз")) {
    return "магазин";
  }

  if (isCommercialType(text)) {
    return "комерційне приміщення";
  }

  return text || "комерційне приміщення";
}

function cleanSentence(value: string) {
  return value.replace(/\s+/g, " ").replace(/\s+([,.—])/g, "$1").trim();
}

function sentenceFromParts(parts: string[]) {
  return cleanSentence(parts.filter(Boolean).join(" "));
}

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function getVisiblePropertyPrice(property: FormattedProperty) {
  return cleanText(property.pricePerMeter || property.price || "");
}

export function getPropertyDealTypeLabel(property: FormattedProperty) {
  return readableDealType(property.dealType);
}

export function getPropertyDisplayType(property: FormattedProperty) {
  return normalizeType(property.type);
}

export function buildPropertySeoTitle(property: FormattedProperty) {
  const dealType = readableDealType(property.dealType);
  const type = normalizeType(property.type);
  const area = ensureSquareMeters(property.area);
  const address = cleanText(property.address);

  const base =
    dealType === "Оренда"
      ? `${capitalize(type)} в оренду у Житомирі`
      : `${capitalize(type)} на продаж у Житомирі`;
  const location = address && address.length <= 54 ? ` на ${address}` : "";
  const areaPart = area ? ` — ${area}` : "";

  return cleanSentence(`${base}${location}${areaPart} | Investal Estate`);
}

export function buildPropertySeoDescription(property: FormattedProperty) {
  const dealType = readableDealType(property.dealType);
  const type = normalizeType(property.type);
  const address = cleanText(property.address);
  const area = ensureSquareMeters(property.area);
  const intro =
    dealType === "Оренда"
      ? `Оренда ${type} у Житомирі`
      : `Продаж ${type} у Житомирі`;
  const addressPart = address ? `за адресою ${address}.` : "";
  const areaPart = area ? `Площа — ${area}.` : "";

  return sentenceFromParts([
    `${intro} ${addressPart}`,
    areaPart,
    "Переглядайте фотографії, характеристики, опис та умови оренди.",
  ]);
}

export function buildPropertyH1(property: FormattedProperty) {
  const dealType = readableDealType(property.dealType);
  const type = normalizeType(property.type);
  const area = ensureSquareMeters(property.area);
  const address = cleanText(property.address);

  if (address) {
    return cleanSentence(
      `${capitalize(type)} ${
        dealType === "Оренда" ? "в оренду" : "на продаж"
      } на ${address} у Житомирі`
    );
  }

  return cleanSentence(`${capitalize(type)} ${area} у Житомирі`);
}

export function buildPropertyImageAlt(
  property: {
    address?: string | null;
    dealType?: string | null;
    type?: string | null;
  },
  photoNumber?: number
) {
  const type = normalizeType(property.type);
  const address = cleanText(property.address);
  const suffix = photoNumber ? `, фото ${photoNumber}` : "";

  if (address) {
    return `${capitalize(type)} за адресою ${address} у Житомирі${suffix}`;
  }

  return `${capitalize(type)} у Житомирі${suffix}`;
}
