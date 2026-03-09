// AQI Types and Utilities

export type AQICategory =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

export interface AQIResult {
  aqi_pred: number;
  aqi_category_pred: string;
  aqi_exact?: number | null;
  aqi_category_exact?: string | null;
  used_model?: boolean | string;
  used_exact?: boolean;
  model_info?: {
    best_model_name?: string | null;
  };
}

export type PollutantKey = 'pm25' | 'pm10' | 'no2' | 'o3' | 'co' | 'so2';

export type PollutantValues = Record<PollutantKey, number | null>;

export type PollutantUnits = Partial<Record<PollutantKey, string | null>>;

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface PredictFormData {
  latitude: number;
  longitude: number;
  timestamp: string;
  pollutants: PollutantValues;
  units?: PollutantUnits;
}

// Pollutant configuration
export interface PollutantConfig {
  key: PollutantKey;
  label: string;
  unit: string;
  description: string;
  placeholder: string;
  max?: number;
}

export const POLLUTANTS: PollutantConfig[] = [
  {
    key: 'pm25',
    label: 'PM2.5',
    unit: 'ug/m3',
    description: 'Fine particulate matter',
    placeholder: 'e.g., 12.5',
    max: 500,
  },
  {
    key: 'pm10',
    label: 'PM10',
    unit: 'ug/m3',
    description: 'Coarse particulate matter',
    placeholder: 'e.g., 45',
    max: 600,
  },
  {
    key: 'no2',
    label: 'NO2',
    unit: 'ppb',
    description: 'Nitrogen dioxide',
    placeholder: 'e.g., 18',
    max: 200,
  },
  {
    key: 'o3',
    label: 'O3',
    unit: 'ppb',
    description: 'Ozone',
    placeholder: 'e.g., 55',
    max: 200,
  },
  {
    key: 'co',
    label: 'CO',
    unit: 'ppm',
    description: 'Carbon monoxide',
    placeholder: 'e.g., 0.5',
    max: 50,
  },
  {
    key: 'so2',
    label: 'SO2',
    unit: 'ppb',
    description: 'Sulfur dioxide',
    placeholder: 'e.g., 10',
    max: 200,
  },
];

// Get AQI badge class based on category
export function getAQICategoryClass(category: string): string {
  const normalized = category.toLowerCase();

  if (normalized.includes('good') && !normalized.includes('unhealthy')) {
    return 'aqi-good';
  }
  if (normalized.includes('moderate')) {
    return 'aqi-moderate';
  }
  if (normalized.includes('sensitive')) {
    return 'aqi-unhealthy-sensitive';
  }
  if (normalized.includes('very unhealthy')) {
    return 'aqi-very-unhealthy';
  }
  if (normalized.includes('unhealthy')) {
    return 'aqi-unhealthy';
  }
  if (normalized.includes('hazardous')) {
    return 'aqi-hazardous';
  }

  return 'aqi-moderate';
}

// Get AQI color for numeric value
export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return 'hsl(var(--aqi-good))';
  if (aqi <= 100) return 'hsl(var(--aqi-moderate))';
  if (aqi <= 150) return 'hsl(var(--aqi-unhealthy-sensitive))';
  if (aqi <= 200) return 'hsl(var(--aqi-unhealthy))';
  if (aqi <= 300) return 'hsl(var(--aqi-very-unhealthy))';
  return 'hsl(var(--aqi-hazardous))';
}

// Get description for AQI category
export function getAQICategoryDescription(category: string): string {
  const normalized = category.toLowerCase();

  if (normalized.includes('good') && !normalized.includes('unhealthy')) {
    return 'Air quality is satisfactory and poses little or no health risk.';
  }
  if (normalized.includes('moderate')) {
    return 'Air quality is acceptable. However, there may be a risk for some people.';
  }
  if (normalized.includes('sensitive')) {
    return 'Members of sensitive groups may experience health effects.';
  }
  if (normalized.includes('very unhealthy')) {
    return 'Health alert: The risk of health effects is increased for everyone.';
  }
  if (normalized.includes('unhealthy')) {
    return 'Some members of the general public may experience health effects.';
  }
  if (normalized.includes('hazardous')) {
    return 'Health warning of emergency conditions: everyone is more likely to be affected.';
  }

  return '';
}
