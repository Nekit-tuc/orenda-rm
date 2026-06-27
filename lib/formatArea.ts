const SQUARE_METERS = "\u043c\u00b2";

export function formatArea(area?: string | number | null) {
  const value = String(area ?? "").trim();

  if (!value) {
    return "";
  }

  if (
    /(\u043c\s*(\u00b2|2|\u043a\u0432)|m\s*(\u00b2|2|sq)|\u043a\u0432\.?\s*\u043c)/i.test(
      value
    )
  ) {
    return value;
  }

  return `${value}${SQUARE_METERS}`;
}
