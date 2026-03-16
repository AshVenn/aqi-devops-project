from pytest import approx

from src.aqi import aqi_category, compute_aqi_row, convert_to_standard


def test_convert_to_standard_converts_o3_ugm3_to_ppm():
    converted, unit = convert_to_standard("o3", 98.0, "ug/m3")

    assert unit == "ppm"
    assert converted == approx((98.0 * 24.45) / (48.0 * 1000.0))


def test_compute_aqi_row_uses_highest_available_pollutant():
    aqi = compute_aqi_row({"pm25": 20.0, "pm10": 40.0})

    assert aqi == approx(67.61373390557941)
    assert aqi_category(aqi) == "Moderate"
