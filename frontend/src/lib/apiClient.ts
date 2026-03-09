// AQI Backend API Client

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const API_BEARER_TOKEN = import.meta.env.VITE_AQI_API_BEARER_TOKEN?.trim();

function getAuthHeaders(): HeadersInit {
  if (!API_BEARER_TOKEN) {
    throw new Error('Missing VITE_AQI_API_BEARER_TOKEN environment variable');
  }

  return {
    Authorization: `Bearer ${API_BEARER_TOKEN}`,
  };
}

export interface PredictPayload {
  latitude: number;
  longitude: number;
  timestamp: string;
  pollutants: {
    pm25: number | null;
    pm10: number | null;
    no2: number | null;
    o3: number | null;
    co: number | null;
    so2: number | null;
  };
  units?: {
    pm25?: string | null;
    pm10?: string | null;
    no2?: string | null;
    o3?: string | null;
    co?: string | null;
    so2?: string | null;
  };
}

export interface PredictResponse {
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

export interface ApiError {
  detail: string | { loc: string[]; msg: string; type: string }[];
}

export interface HealthResponse {
  ok: boolean;
  model_loaded: boolean;
  model_name: string | null;
}

export async function predictAQI(payload: PredictPayload): Promise<PredictResponse> {
  const response = await fetch(`${BACKEND_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      detail: 'An unexpected error occurred',
    }));
    
    // Handle validation errors from FastAPI
    if (Array.isArray(errorData.detail)) {
      const messages = errorData.detail.map((err) => {
        const field = err.loc[err.loc.length - 1];
        return `${field}: ${err.msg}`;
      });
      throw new Error(messages.join('\n'));
    }
    
    throw new Error(typeof errorData.detail === 'string' ? errorData.detail : 'Request failed');
  }

  return response.json();
}

// Health check endpoint
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${BACKEND_URL}/health`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      detail: 'Health check failed',
    }));

    throw new Error(typeof errorData.detail === 'string' ? errorData.detail : 'Health check failed');
  }

  const data = (await response.json()) as Partial<HealthResponse>;

  return {
    ok: Boolean(data.ok),
    model_loaded: Boolean(data.model_loaded),
    model_name: data.model_name ?? null,
  };
}
