/**
 * The house keeps its own hours.
 *
 * One scalar, `daylight` (1 = full noon, 0 = deep night), drives every colour on
 * the site. Colour interpolates inside two regimes (day / night) with a single
 * flip at "lamps on", because interpolating ink and ground through the middle
 * would pass through a zero-contrast grey.
 *
 * KEEP IN SYNC with the inline pre-paint script in components/light/LightScript.tsx.
 */

export type Regime = "day" | "night";

export interface LightState {
  /** 0..1, 1 = skylit noon, 0 = deep night */
  daylight: number;
  regime: Regime;
  /** 0..1 position of the sun along the opening-hours arch (11:00 -> 03:00) */
  clockT: number;
  /** inside opening hours */
  open: boolean;
  /** house hour, 3..27 (00:00-02:59 are 24..26.99) */
  hour: number;
}

export const OPEN_HOUR = 11;
export const CLOSE_HOUR = 27; // 03:00 next day
export const REGIME_FLIP = 0.375;

/** 0..24 local hour -> 3..27 house hour so the night is continuous. */
export function houseHour(hourRaw: number): number {
  const h = ((hourRaw % 24) + 24) % 24;
  return h < 3 ? h + 24 : h;
}

function seg(h: number, a: number, b: number, va: number, vb: number) {
  return va + (vb - va) * ((h - a) / (b - a));
}

export function daylightFor(hourRaw: number): number {
  const h = houseHour(hourRaw);
  if (h < 5.5) return 0;
  if (h < 6.5) return seg(h, 5.5, 6.5, 0, 0.5);
  if (h < 11) return seg(h, 6.5, 11, 0.5, 1);
  if (h < 15) return seg(h, 11, 15, 1, 0.9);
  if (h < 18.75) return seg(h, 15, 18.75, 0.9, 0.5);
  if (h < 19.5) return seg(h, 18.75, 19.5, 0.5, 0.25);
  if (h < 25) return seg(h, 19.5, 25, 0.25, 0.05);
  if (h < 27) return seg(h, 25, 27, 0.05, 0);
  return 0;
}

export function regimeFor(daylight: number): Regime {
  return daylight >= REGIME_FLIP ? "day" : "night";
}

export function clockTFor(hourRaw: number): number {
  const h = houseHour(hourRaw);
  return Math.min(1, Math.max(0, (h - OPEN_HOUR) / (CLOSE_HOUR - OPEN_HOUR)));
}

export function isOpenAt(hourRaw: number): boolean {
  const h = houseHour(hourRaw);
  return h >= OPEN_HOUR && h < CLOSE_HOUR;
}

export function stateFor(hourRaw: number): LightState {
  const daylight = daylightFor(hourRaw);
  return {
    daylight,
    regime: regimeFor(daylight),
    clockT: clockTFor(hourRaw),
    open: isOpenAt(hourRaw),
    hour: houseHour(hourRaw),
  };
}

export function nowHour(date = new Date()): number {
  return date.getHours() + date.getMinutes() / 60;
}

/** The house's own clock (Asia/Kolkata), for anything that claims "open now". */
export function houseNowHour(date = new Date()): number {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(date);
    const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
    const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
    return h + m / 60;
  } catch {
    return nowHour(date);
  }
}

/** "?at=HH:MM" pins the house to an hour for a walkthrough. Never stored. */
export function parseAt(search: string): number | null {
  const m = /[?&]at=(\d{1,2})(?::(\d{2}))?/.exec(search);
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2] ?? 0);
  if (h > 23 || mm > 59) return null;
  return houseHour(h + mm / 60);
}

/** "1:12 AM" from a fractional hour (3..27 or 0..24) */
export function formatHour(hourRaw: number): string {
  const h24 = ((hourRaw % 24) + 24) % 24;
  const hours = Math.floor(h24);
  const minutes = Math.round((h24 - hours) * 60) % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${h12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

/** "3 AM" / "11 AM" from an "HH:MM" string */
export function formatClock(hhmm: string): string {
  const [hs, ms] = hhmm.split(":");
  const hours = Number(hs);
  const minutes = Number(ms ?? 0);
  const suffix = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return minutes ? `${h12}:${ms} ${suffix}` : `${h12} ${suffix}`;
}
