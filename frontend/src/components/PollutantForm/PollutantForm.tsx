import { useMemo, useState } from 'react';
import { MapPin, Clock, Wind, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LATITUDE_MAX,
  LATITUDE_MIN,
  LONGITUDE_MAX,
  LONGITUDE_MIN,
  isValidLatitude,
  isValidLongitude,
  sanitizeCoordinates,
} from '@/lib/coordinates';
import {
  POLLUTANTS,
  type Coordinates,
  type PollutantKey,
  type PollutantUnits,
  type PollutantValues,
  type PredictFormData,
} from '@/types/aqi';

interface PollutantFormProps {
  coordinates: Coordinates | null;
  onSubmit: (data: PredictFormData) => void;
  onClearMarker: () => void;
  isLoading: boolean;
}

interface FormErrors {
  latitude?: string;
  longitude?: string;
  timestamp?: string;
  pollutants?: string;
  [key: string]: string | undefined;
}

const emptyPollutants = (): Record<PollutantKey, string> => ({
  pm25: '',
  pm10: '',
  no2: '',
  o3: '',
  co: '',
  so2: '',
});

const normalizeTimestamp = (value: string) => {
  if (!value) return '';
  if (value.length === 16) return `${value}:00`;
  return value;
};

const isIsoLike = (value: string) =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value);

export function PollutantForm({ coordinates, onSubmit, onClearMarker, isLoading }: PollutantFormProps) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [pollutants, setPollutants] = useState<Record<PollutantKey, string>>(emptyPollutants);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isManualLocation, setIsManualLocation] = useState(false);

  const pollutantMax = useMemo(() => {
    return POLLUTANTS.reduce((acc, pollutant) => {
      acc[pollutant.key] = pollutant.max;
      return acc;
    }, {} as Record<PollutantKey, number | undefined>);
  }, []);

  const normalizedCoordinates = useMemo(() => {
    if (!coordinates) {
      return null;
    }

    return sanitizeCoordinates(coordinates);
  }, [coordinates]);

  const handlePollutantChange = (key: PollutantKey, value: string) => {
    setPollutants((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validateForm = (): { payload: PredictFormData | null } => {
    const newErrors: FormErrors = {};

    const resolvedLatitude = isManualLocation
      ? latitude
      : normalizedCoordinates
        ? normalizedCoordinates.lat.toFixed(6)
        : latitude;
    const resolvedLongitude = isManualLocation
      ? longitude
      : normalizedCoordinates
        ? normalizedCoordinates.lon.toFixed(6)
        : longitude;

    const latValue = resolvedLatitude.trim();
    const lonValue = resolvedLongitude.trim();

    if (!latValue) {
      newErrors.latitude = 'Latitude is required';
    }
    if (!lonValue) {
      newErrors.longitude = 'Longitude is required';
    }

    const parsedLat = latValue ? Number(latValue) : NaN;
    const parsedLon = lonValue ? Number(lonValue) : NaN;

    if (latValue && !isValidLatitude(parsedLat)) {
      newErrors.latitude = `Latitude must be between ${LATITUDE_MIN} and ${LATITUDE_MAX}`;
    }

    if (lonValue && !isValidLongitude(parsedLon)) {
      newErrors.longitude = `Longitude must be between ${LONGITUDE_MIN} and ${LONGITUDE_MAX}`;
    }

    if (!timestamp) {
      newErrors.timestamp = 'Timestamp is required';
    }

    const normalizedTimestamp = normalizeTimestamp(timestamp);
    if (timestamp && !isIsoLike(normalizedTimestamp)) {
      newErrors.timestamp = 'Timestamp must be ISO 8601 (YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS)';
    }

    const providedPollutants = Object.entries(pollutants).filter(([, v]) => v.trim() !== '');

    if (providedPollutants.length === 0) {
      newErrors.pollutants = 'At least one pollutant value is required';
    }

    const pollutantPayload: PollutantValues = {
      pm25: null,
      pm10: null,
      no2: null,
      o3: null,
      co: null,
      so2: null,
    };

    const unitsPayload: PollutantUnits = {};

    for (const pollutant of POLLUTANTS) {
      const rawValue = pollutants[pollutant.key].trim();
      if (!rawValue) {
        pollutantPayload[pollutant.key] = null;
        continue;
      }

      const numericValue = Number(rawValue);
      if (!Number.isFinite(numericValue)) {
        newErrors[pollutant.key] = 'Must be a valid number';
        continue;
      }
      if (numericValue < 0) {
        newErrors[pollutant.key] = 'Must be a positive number';
        continue;
      }
      const maxValue = pollutantMax[pollutant.key];
      if (maxValue !== undefined && numericValue > maxValue) {
        newErrors[pollutant.key] = `Max value is ${maxValue}`;
        continue;
      }

      pollutantPayload[pollutant.key] = numericValue;
      unitsPayload[pollutant.key] = pollutant.unit;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return { payload: null };
    }

    const payload: PredictFormData = {
      latitude: parsedLat,
      longitude: parsedLon,
      timestamp: normalizedTimestamp,
      pollutants: pollutantPayload,
      units: Object.keys(unitsPayload).length > 0 ? unitsPayload : undefined,
    };

    return { payload };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { payload } = validateForm();
    if (!payload) return;

    onSubmit(payload);
  };

  const handleClear = () => {
    setPollutants(emptyPollutants());
    setTimestamp('');
    setLatitude('');
    setLongitude('');
    setIsManualLocation(false);
    setErrors({});
    onClearMarker();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Location Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          Location
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="lat" className="text-xs text-muted-foreground">Latitude</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              min={LATITUDE_MIN}
              max={LATITUDE_MAX}
              value={isManualLocation ? latitude : normalizedCoordinates ? normalizedCoordinates.lat.toFixed(6) : latitude}
              onChange={(e) => {
                setIsManualLocation(true);
                setLatitude(e.target.value);
                if (errors.latitude) {
                  setErrors((prev) => ({ ...prev, latitude: undefined }));
                }
              }}
              placeholder="e.g., 37.7749"
              className="input-focus text-sm"
            />
            {errors.latitude && (
              <p className="text-xs text-destructive mt-1">{errors.latitude}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lon" className="text-xs text-muted-foreground">Longitude</Label>
            <Input
              id="lon"
              type="number"
              step="any"
              min={LONGITUDE_MIN}
              max={LONGITUDE_MAX}
              value={isManualLocation ? longitude : normalizedCoordinates ? normalizedCoordinates.lon.toFixed(6) : longitude}
              onChange={(e) => {
                setIsManualLocation(true);
                setLongitude(e.target.value);
                if (errors.longitude) {
                  setErrors((prev) => ({ ...prev, longitude: undefined }));
                }
              }}
              placeholder="e.g., -122.4194"
              className="input-focus text-sm"
            />
            {errors.longitude && (
              <p className="text-xs text-destructive mt-1">{errors.longitude}</p>
            )}
          </div>
        </div>

        {normalizedCoordinates && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="w-full text-xs"
          >
            Clear Marker & Form
          </Button>
        )}
      </div>

      {/* Timestamp Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Clock className="h-4 w-4 text-primary" />
          Timestamp
        </div>

        <div>
          <Input
            type="datetime-local"
            value={timestamp}
            onChange={(e) => {
              setTimestamp(e.target.value);
              if (errors.timestamp) {
                setErrors((prev) => ({ ...prev, timestamp: undefined }));
              }
            }}
            className="input-focus"
          />
          {errors.timestamp && (
            <p className="text-xs text-destructive mt-1">{errors.timestamp}</p>
          )}
        </div>
      </div>

      {/* Pollutants Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Wind className="h-4 w-4 text-primary" />
          Pollutants
          <span className="text-xs text-muted-foreground font-normal">(at least one required)</span>
        </div>

        {errors.pollutants && (
          <p className="text-xs text-destructive">{errors.pollutants}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          {POLLUTANTS.map((pollutant) => (
            <div key={pollutant.key} className="space-y-1">
              <Label htmlFor={pollutant.key} className="text-xs flex items-center gap-1">
                <span className="font-medium">{pollutant.label}</span>
                <span className="text-muted-foreground">({pollutant.unit})</span>
              </Label>
              <Input
                id={pollutant.key}
                type="number"
                step="any"
                min="0"
                max={pollutant.max}
                placeholder={pollutant.placeholder}
                value={pollutants[pollutant.key]}
                onChange={(e) => handlePollutantChange(pollutant.key, e.target.value)}
                className={`input-focus text-sm ${errors[pollutant.key] ? 'border-destructive' : ''}`}
              />
              {errors[pollutant.key] && (
                <p className="text-xs text-destructive">{errors[pollutant.key]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Predicting...
          </>
        ) : (
          'Predict AQI'
        )}
      </Button>
    </form>
  );
}
