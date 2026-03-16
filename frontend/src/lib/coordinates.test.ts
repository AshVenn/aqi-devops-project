import { describe, expect, it } from 'vitest';

import { clampLatitude, normalizeLongitude, sanitizeCoordinates } from './coordinates';

describe('coordinates utilities', () => {
  it('clamps latitude to the valid range', () => {
    expect(clampLatitude(95)).toBe(90);
    expect(clampLatitude(-95)).toBe(-90);
  });

  it('wraps longitude into the valid range', () => {
    expect(normalizeLongitude(190)).toBe(-170);
    expect(normalizeLongitude(-190)).toBe(170);
  });

  it('sanitizes a coordinate pair together', () => {
    expect(sanitizeCoordinates({ lat: 91, lon: 540 })).toEqual({
      lat: 90,
      lon: 180,
    });
  });
});
