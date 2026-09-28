/**
 * The sun on the house's arch becomes a crescent moon through dusk.
 *
 * Everything hangs off `daylight` from lib/daylight.ts (1 at skylit noon, 0 at deep night), so the
 * arch's sun follows the same curve as the ground and the lamps. The CSS in components/house/house.css
 * evaluates the same two ramps from `--daylight` so the sky is right before hydration and at rest under
 * reduced motion; these constants are handed to it as custom properties, so this file is the one source.
 */
import { REGIME_FLIP, type Regime } from "./daylight";

/** The shadow starts across the disc at this much daylight (about 6:45 PM) ... */
export const MOON_FROM = 0.5;
/** ... and the crescent is complete at this much (7:15 PM). */
export const MOON_TO = 0.25;
/** The rays are full above this much daylight (about 5:45 PM) ... */
export const RAYS_FROM = 0.6;
/** ... and gone when the house flips to night (7 PM), with the shadow halfway across. */
export const RAYS_TO = REGIME_FLIP;

export interface Sky {
  /** 0 = the sun's whole disc, 1 = the crescent moon */
  moon: number;
  /** 1 = the rays at full length, 0 = retracted into the disc */
  rays: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 1 at `from`, 0 at `to`, linear between (from > to). */
const ramp = (v: number, from: number, to: number) => clamp01((v - to) / (from - to));

export function skyFor(daylight: number): Sky {
  const d = clamp01(daylight);
  return { moon: 1 - ramp(d, MOON_FROM, MOON_TO), rays: ramp(d, RAYS_FROM, RAYS_TO) };
}

/** The header switch: night makes deep night of any hour, day makes full day; without it the clock rules. */
export function effectiveDaylight(daylight: number, override: Regime | null): number {
  if (override === "night") return Math.min(daylight, 0.05);
  if (override === "day") return Math.max(daylight, 0.9);
  return daylight;
}
