import { describe, expect, it } from "vitest";
import { REGIME_FLIP, stateFor } from "@/lib/daylight";
import { effectiveDaylight, MOON_FROM, MOON_TO, RAYS_FROM, RAYS_TO, skyFor } from "@/lib/sky";

const at = (h: number) => skyFor(stateFor(h).daylight);

describe("skyFor: the sun becomes the moon through dusk", () => {
  it("is a sun with its full rays through the day (11 AM, 2 PM, 5 PM)", () => {
    for (const h of [11, 14, 17]) {
      expect(at(h)).toEqual({ moon: 0, rays: 1 });
    }
  });

  it("starts retracting the rays before the shadow touches the disc (6:45 PM)", () => {
    const s = at(18.75);
    expect(s.moon).toBe(0);
    expect(s.rays).toBeGreaterThan(0);
    expect(s.rays).toBeLessThan(1);
  });

  it("has no rays left and a half-formed crescent when the house flips to night", () => {
    const s = skyFor(REGIME_FLIP);
    expect(s.rays).toBe(0);
    expect(s.moon).toBeCloseTo(0.5, 5);
  });

  it("is a full crescent moon from 7:30 PM through the night (10 PM, 1 AM)", () => {
    for (const h of [19.5, 22, 25]) {
      expect(at(h)).toEqual({ moon: 1, rays: 0 });
    }
  });

  it("changes monotonically with daylight, so nothing flickers back through dusk", () => {
    let prev = skyFor(0);
    for (let d = 0.01; d <= 1.0001; d += 0.01) {
      const s = skyFor(d);
      expect(s.moon).toBeLessThanOrEqual(prev.moon + 1e-9);
      expect(s.rays).toBeGreaterThanOrEqual(prev.rays - 1e-9);
      prev = s;
    }
  });

  it("clamps daylight outside 0..1", () => {
    expect(skyFor(-1)).toEqual(skyFor(0));
    expect(skyFor(2)).toEqual(skyFor(1));
  });

  it("publishes the thresholds the CSS is built from, in dusk order", () => {
    expect(RAYS_FROM).toBeGreaterThan(MOON_FROM);
    expect(MOON_FROM).toBeGreaterThan(RAYS_TO);
    expect(RAYS_TO).toBe(REGIME_FLIP);
    expect(RAYS_TO).toBeGreaterThan(MOON_TO);
  });
});

describe("effectiveDaylight: the header switch", () => {
  it("leaves the clock's daylight alone without an override", () => {
    expect(effectiveDaylight(0.9, null)).toBe(0.9);
    expect(effectiveDaylight(0.05, null)).toBe(0.05);
  });

  it("makes deep night of any hour when switched to night", () => {
    expect(skyFor(effectiveDaylight(0.9, "night"))).toEqual({ moon: 1, rays: 0 });
    expect(effectiveDaylight(0.02, "night")).toBe(0.02);
  });

  it("makes full day of any hour when switched to day", () => {
    expect(skyFor(effectiveDaylight(0.05, "day"))).toEqual({ moon: 0, rays: 1 });
    expect(effectiveDaylight(0.95, "day")).toBe(0.95);
  });
});
