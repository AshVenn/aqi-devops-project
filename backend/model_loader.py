from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib

from config import FEATURE_COLS_PATH, MODEL_META_PATH, MODEL_PATH


@dataclass(frozen=True)
class ModelArtifacts:
    model: Optional[Any]
    feature_cols: List[str]
    meta: Dict[str, Any]


def _load_json(path: Path, default: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    if default is None:
        default = {}
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def _load_feature_cols(path: Path) -> List[str]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    return list(data)


def _load_model(path: Path) -> Any:
    if not path.exists():
        raise FileNotFoundError(f"Model file not found: {path}")

    try:
        return joblib.load(path)
    except Exception as exc:
        raise RuntimeError(f"Failed to load model from {path}: {exc}") from exc


@lru_cache(maxsize=1)
def get_artifacts() -> ModelArtifacts:
    model = _load_model(MODEL_PATH)
    feature_cols = _load_feature_cols(FEATURE_COLS_PATH)
    meta = _load_json(MODEL_META_PATH, default={})

    return ModelArtifacts(model=model, feature_cols=feature_cols, meta=meta)
