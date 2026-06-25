type RouteProperty = {
  latitude?: number | string | null;
  longitude?: number | string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  address?: string | null;
};

function toValidCoordinate(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const coordinate = Number(value);

  return Number.isFinite(coordinate) ? coordinate : null;
}

export function getRouteUrl(property: RouteProperty) {
  const lat = toValidCoordinate(property.latitude ?? property.lat);
  const lng = toValidCoordinate(property.longitude ?? property.lng);

  if (lat !== null && lng !== null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  const address = property.address?.trim();

  if (address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      address
    )}`;
  }

  return null;
}
