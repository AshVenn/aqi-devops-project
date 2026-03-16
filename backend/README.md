# AQI Estimation API

FastAPI service that loads the exported AQI estimator and serves predictions.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
```

The backend pins `scikit-learn==1.6.1` to match the exported model artifacts.

## Configuration

Create `backend/.env` if you need to override runtime configuration (auto-loaded on startup):

```bash
AQI_ALLOWED_ORIGINS=http://localhost:5173
```

You can start from `backend/.env.example`.

Optional:
- `AQI_ALLOWED_ORIGINS` accepts comma-separated frontend origins.
- `AQI_ALLOWED_ORIGIN_REGEX` accepts a regex for dynamic origins (defaults to `*.***.***.****.***.sslip.io`).

## Model artifacts

Place the exported artifacts in `backend/models/`:
- `aqi_estimator.joblib`
- `feature_cols.json`
- `model_meta.json`

Alternatively, set environment variables:
- `AQI_MODEL_PATH`
- `AQI_FEATURE_COLS_PATH`
- `AQI_MODEL_META_PATH`

## Run

From the project root:

```bash
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

## Run with Docker

Build from the project root:

```bash
docker build -f backend/Dockerfile -t aqi-api:latest .
```

Run:

```bash
docker run -d --name aqi-api \
  --restart unless-stopped \
  -p 8000:8000 \
  aqi-api:latest
```

## Example request

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 37.7749,
    "longitude": -122.4194,
    "timestamp": "2025-01-01T12:00:00",
    "pollutants": {
      "pm25": 12.5,
      "pm10": null,
      "no2": 8.2,
      "o3": null,
      "co": null,
      "so2": null
    },
    "units": {
      "pm25": "ug/m3",
      "no2": "ppb"
    }
  }'
```

## Frontend API call example

```js
const API_BASE_URL = "http://localhost:8000";

async function predictAqi(payload) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Predict failed: ${response.status}`);
  }

  return response.json();
}
```
