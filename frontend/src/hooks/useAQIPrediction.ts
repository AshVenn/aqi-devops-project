import { useState, useCallback } from 'react';
import { predictAQI, type PredictPayload } from '@/lib/apiClient';
import {
  LATITUDE_MAX,
  LATITUDE_MIN,
  LONGITUDE_MAX,
  LONGITUDE_MIN,
  isValidLatitude,
  isValidLongitude,
} from '@/lib/coordinates';
import type { AQIResult } from '@/types/aqi';

interface UseAQIPredictionReturn {
  result: AQIResult | null;
  isLoading: boolean;
  error: string | null;
  predict: (payload: PredictPayload) => Promise<void>;
  reset: () => void;
}

export function useAQIPrediction(): UseAQIPredictionReturn {
  const [result, setResult] = useState<AQIResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(async (payload: PredictPayload) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!isValidLatitude(payload.latitude)) {
        throw new Error(`Latitude must be between ${LATITUDE_MIN} and ${LATITUDE_MAX}`);
      }
      if (!isValidLongitude(payload.longitude)) {
        throw new Error(`Longitude must be between ${LONGITUDE_MIN} and ${LONGITUDE_MAX}`);
      }
      if (!payload.timestamp || !payload.timestamp.includes('T')) {
        throw new Error('Timestamp must be a valid ISO 8601 string');
      }

      const response = await predictAQI(payload);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { result, isLoading, error, predict, reset };
}
