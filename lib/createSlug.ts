type SlugPropertyInput = {
  id?: number | null;
  title?: string | null;
  type?: string | null;
  deal_type?: "Оренда" | "Продаж" | string | null;
  dealType?: "Оренда" | "Продаж" | string | null;
  area?: string | null;
  address?: string | null;
};

const cyrillicMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ie",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ю: "iu",
  я: "ia",
  ы: "y",
  э: "e",
  ё: "io",
  ъ: "",
};

function transliterate(value: string) {
  return value
    .toLowerCase()
    .split("")
    .map((char) => cyrillicMap[char] ?? char)
    .join("");
}

function slugify(value: string) {
  return transliterate(value)
    .trim()
    .replace(/['’`]/g, "")
    .replace(/м²|м2|кв\.?\s?м/gi, "m2")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function getDealSlug(dealType?: string | null) {
  if (dealType?.toLowerCase().includes("прод")) {
    return "prodazh";
  }

  return "investal";
}

function getTypeSlug(type?: string | null) {
  const normalized = type?.toLowerCase() || "";

  if (normalized.includes("офіс") || normalized.includes("офис")) {
    return "ofisu";
  }

  if (normalized.includes("склад")) {
    return "skladu";
  }

  if (normalized.includes("кварт")) {
    return "kvartyry";
  }

  if (normalized.includes("буд")) {
    return "budynku";
  }

  if (normalized.includes("маф") || normalized.includes("кіоск")) {
    return "maf-kiosku";
  }

  if (normalized.includes("комер")) {
    return "komertsiyi";
  }

  return slugify(type || "nerukhomist");
}

function getLocationSlug(address?: string | null) {
  if (!address) {
    return "zhytomyr";
  }

  if (address.toLowerCase().includes("житомир")) {
    return "zhytomyr";
  }

  return slugify(address).split("-").filter(Boolean).slice(0, 3).join("-");
}

function getAreaSlug(area?: string | null) {
  const areaMatch = area?.match(/\d+(?:[,.]\d+)?/);

  if (!areaMatch) {
    return "";
  }

  return `${areaMatch[0].replace(",", ".")}m2`;
}

export function createSlug(title: string, id?: number): string;
export function createSlug(property: SlugPropertyInput): string;
export function createSlug(input: string | SlugPropertyInput, id?: number) {
  if (typeof input === "string") {
    const slug = slugify(input);

    return id ? `${slug}-${id}` : slug;
  }

  const deal = getDealSlug(input.deal_type || input.dealType);
  const type = getTypeSlug(input.type);
  const location = getLocationSlug(input.address);
  const area = getAreaSlug(input.area);
  const fallbackTitle = slugify(input.title || "object");
  const parts = [deal, type, location, area || fallbackTitle, input.id]
    .filter(Boolean)
    .map(String);

  return parts.join("-");
}
