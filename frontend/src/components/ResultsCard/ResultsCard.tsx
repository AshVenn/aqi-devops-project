import { Activity, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  getAQICategoryClass, 
  getAQIColor, 
  getAQICategoryDescription,
  type AQIResult 
} from '@/types/aqi';

interface ResultsCardProps {
  result: AQIResult | null;
  isLoading: boolean;
  error: string | null;
}

export function ResultsCard({ result, isLoading, error }: ResultsCardProps) {
  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive whitespace-pre-line">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            Analyzing...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-16 bg-muted rounded-lg" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No prediction yet</p>
            <p className="text-xs mt-1">Fill the form and click Predict AQI</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const predictedValue = result.aqi_pred;
  const predictedCategory = result.aqi_category_pred;
  const exactValue = result.aqi_exact ?? null;
  const exactCategory = result.aqi_category_exact ?? null;

  const useCalculatedPrimary =
    result.used_model === false && exactValue !== null && !!exactCategory;
  const displayValue = useCalculatedPrimary ? exactValue : predictedValue;
  const displayCategory = useCalculatedPrimary ? exactCategory : predictedCategory;

  const categoryClass = getAQICategoryClass(displayCategory);
  const aqiColor = getAQIColor(displayValue);
  const description = getAQICategoryDescription(displayCategory);

  return (
    <Card className="overflow-hidden fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Prediction Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AQI Score Display */}
        <div 
          className="rounded-lg p-4 text-center"
          style={{ backgroundColor: `${aqiColor}15` }}
        >
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {useCalculatedPrimary ? 'Calculated AQI (max IAQI)' : 'Predicted AQI'}
          </div>
          <div 
            className="text-4xl font-bold"
            style={{ color: aqiColor }}
          >
            {Math.round(displayValue)}
          </div>
          
          {exactValue !== null && !useCalculatedPrimary && (
            <div className="text-sm text-muted-foreground mt-1">
              Exact: {exactValue.toFixed(1)}
            </div>
          )}
        </div>

        {/* Category Badge */}
        <div className="text-center">
          <span className={`aqi-badge ${categoryClass}`}>
            {displayCategory}
          </span>
        </div>

        {/* Description */}
        {description && (
          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Exact Category */}
        {exactValue !== null && exactCategory && !useCalculatedPrimary && (
          <div className="text-center text-sm text-muted-foreground">
            Exact category: <span className="text-foreground">{exactCategory}</span>
          </div>
        )}

        {/* Model Info */}
        {(result.model_info?.best_model_name ||
          typeof result.used_model !== 'undefined' ||
          typeof result.used_exact !== 'undefined') && (
          <div className="rounded-lg border border-border/50 p-3 text-xs text-muted-foreground space-y-1">
            {result.model_info?.best_model_name && (
              <div>
                <span className="text-foreground">Best model:</span> {result.model_info.best_model_name}
              </div>
            )}
            {typeof result.used_model !== 'undefined' && (
              <div>
                <span className="text-foreground">Model used:</span>{' '}
                {typeof result.used_model === 'boolean' ? (result.used_model ? 'Yes' : 'No') : result.used_model}
              </div>
            )}
            {typeof result.used_exact !== 'undefined' && (
              <div>
                <span className="text-foreground">Exact used:</span> {result.used_exact ? 'Yes' : 'No'}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
