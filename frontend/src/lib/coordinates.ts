import type { Coordinates } from '@/types/aqi';

export const LATITUDE_MIN = -90;
export const LATITUDE_MAX = 90;
export const LONGITUDE_MIN = -180;
export const LONGITUDE_MAX = 180;

export function clampLatitude(latitude: number): number {
  if (!Number.isFinite(latitude)) {
    return latitude;
  }

  return Math.min(LATITUDE_MAX, Math.max(LATITUDE_MIN, latitude));
}

export function normalizeLongitude(longitude: number): number {
  if (!Number.isFinite(longitude)) {
    return longitude;
  }

  const wrapped = ((longitude + 180) % 360 + 360) % 360 - 180;
  return wrapped === LONGITUDE_MIN && longitude > 0 ? LONGITUDE_MAX : wrapped;
}

export function sanitizeCoordinates(coords: Coordinates): Coordinates {
  return {
    lat: clampLatitude(coords.lat),
    lon: normalizeLongitude(coords.lon),
  };
}

export function isValidLatitude(latitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    latitude >= LATITUDE_MIN &&
    latitude <= LATITUDE_MAX
  );
}

export function isValidLongitude(longitude: number): boolean {
  return (
    Number.isFinite(longitude) &&
    longitude >= LONGITUDE_MIN &&
    longitude <= LONGITUDE_MAX
  );
}
