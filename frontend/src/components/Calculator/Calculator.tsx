import { useState, useEffect, useCallback } from 'react';
import { MapPanel } from '@/components/MapPanel/MapPanel';
import { PollutantForm } from '@/components/PollutantForm/PollutantForm';
import { ResultsCard } from '@/components/ResultsCard/ResultsCard';
import { useAQIPrediction } from '@/hooks/useAQIPrediction';
import { checkHealth } from '@/lib/apiClient';
import { sanitizeCoordinates } from '@/lib/coordinates';
import type { Coordinates, PredictFormData } from '@/types/aqi';

export function Calculator() {
  const [marker, setMarker] = useState<Coordinates | null>(null);
  const [modelHealth, setModelHealth] = useState<'checking' | 'ready' | 'unavailable'>('checking');
  const [modelName, setModelName] = useState<string | null>(null);
  
  // AQI Prediction
  const { result, isLoading: isPredicting, error: predictionError, predict, reset } = useAQIPrediction();

  useEffect(() => {
    let isMounted = true;

    const loadHealth = async () => {
      try {
        const health = await checkHealth();
        if (!isMounted) return;

        setModelHealth(health.ok && health.model_loaded ? 'ready' : 'unavailable');
        setModelName(health.model_name);
      } catch {
        if (!isMounted) return;
        setModelHealth('unavailable');
      }
    };

    void loadHealth();

    return () => {
      isMounted = false;
    };
  }, []);
  
  const handleMapClick = useCallback((coords: Coordinates) => {
    setMarker(sanitizeCoordinates(coords));
  }, []);

  const handleClearMarker = useCallback(() => {
    setMarker(null);
    reset();
  }, [reset]);

  const handleSubmit = useCallback(async (data: PredictFormData) => {
    await predict(data);
  }, [predict]);

  return (
    <div className="min-h-screen bg-background">
      {/* Calculator Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Map Panel */}
        <div className="flex-1 relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-0">
          <MapPanel marker={marker} onMapClick={handleMapClick} />
        </div>

        {/* Side Panel */}
        <aside className="w-full lg:w-104 border-t lg:border-t-0 lg:border-l bg-card flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
            {/* Form Section */}
            <div className="panel">
              <div className="panel-header">
                <h2 className="text-sm font-semibold text-foreground">Prediction Input</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select a location and enter pollutant values
                </p>
              </div>
              <div className="panel-body">
                <PollutantForm
                  coordinates={marker}
                  onSubmit={handleSubmit}
                  onClearMarker={handleClearMarker}
                  isLoading={isPredicting}
                />
              </div>
            </div>

            {/* Results Section */}
            <ResultsCard
              result={result}
              isLoading={isPredicting}
              error={predictionError}
            />

          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              AI model:{' '}
              <span
                className={
                  modelHealth === 'ready'
                    ? 'text-green-600'
                    : modelHealth === 'checking'
                      ? 'text-muted-foreground'
                      : 'text-destructive'
                }
              >
                {modelHealth === 'ready' ? 'Ready' : modelHealth === 'checking' ? 'Checking...' : 'Unavailable'}
              </span>
              {modelName ? (
                <>
                  {' '}
                  <span className="text-foreground">({modelName})</span>
                </>
              ) : null}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
