export interface Coordinates {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export const parseCoordinates = (
  latitude?: string | number | null,
  longitude?: string | number | null
): Coordinates | null => {
  if (latitude === null || latitude === undefined || latitude === "")
    return null;
  if (longitude === null || longitude === undefined || longitude === "")
    return null;

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;

  return { latitude: lat, longitude: lng };
};

export const calculateDistanceKm = (
  from: Coordinates,
  to: Coordinates
): number => {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLng = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(dLng / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const formatDistance = (km: number | null): string | null => {
  if (km === null) return null;
  if (km < 1) return `${Math.max(100, Math.round((km * 1000) / 100) * 100)} m`;
  if (km < 10) return `${km.toFixed(1).replace(".", ",")} km`;
  return `${Math.round(km)} km`;
};

export const getDistanceKm = (
  userLocation: Coordinates | null,
  latitude?: string | number | null,
  longitude?: string | number | null
): number | null => {
  const target = parseCoordinates(latitude, longitude);
  if (!userLocation || !target) return null;
  return calculateDistanceKm(userLocation, target);
};
