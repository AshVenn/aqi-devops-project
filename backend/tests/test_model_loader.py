import json

import joblib
import pytest

import model_loader


@pytest.fixture(autouse=True)
def clear_artifacts_cache():
    model_loader.get_artifacts.cache_clear()
    yield
    model_loader.get_artifacts.cache_clear()


def test_get_artifacts_raises_when_model_file_is_missing(tmp_path, monkeypatch):
    feature_cols_path = tmp_path / "feature_cols.json"
    model_meta_path = tmp_path / "model_meta.json"

    feature_cols_path.write_text(json.dumps(["pm25"]), encoding="utf-8")
    model_meta_path.write_text(json.dumps({"best_model_name": "test-model"}), encoding="utf-8")

    monkeypatch.setattr(model_loader, "MODEL_PATH", tmp_path / "missing.joblib")
    monkeypatch.setattr(model_loader, "FEATURE_COLS_PATH", feature_cols_path)
    monkeypatch.setattr(model_loader, "MODEL_META_PATH", model_meta_path)

    with pytest.raises(FileNotFoundError, match="Model file not found"):
        model_loader.get_artifacts()


def test_get_artifacts_does_not_cache_failed_loads(tmp_path, monkeypatch):
    model_path = tmp_path / "aqi_estimator.joblib"
    feature_cols_path = tmp_path / "feature_cols.json"
    model_meta_path = tmp_path / "model_meta.json"

    feature_cols_path.write_text(json.dumps(["pm25"]), encoding="utf-8")
    model_meta_path.write_text(json.dumps({"best_model_name": "test-model"}), encoding="utf-8")
    model_path.write_text("not-a-valid-joblib-file", encoding="utf-8")

    monkeypatch.setattr(model_loader, "MODEL_PATH", model_path)
    monkeypatch.setattr(model_loader, "FEATURE_COLS_PATH", feature_cols_path)
    monkeypatch.setattr(model_loader, "MODEL_META_PATH", model_meta_path)

    with pytest.raises(RuntimeError, match="Failed to load model"):
        model_loader.get_artifacts()

    joblib.dump({"loaded": True}, model_path)

    artifacts = model_loader.get_artifacts()

    assert artifacts.model == {"loaded": True}
    assert artifacts.feature_cols == ["pm25"]
    assert artifacts.meta["best_model_name"] == "test-model"
