import { cafe } from "@/lib/cafe";

export type RoomSlug = "entry" | "main-floor" | "mezzanine" | "courtyard" | "games" | "bowling";

const nameOf = (slug: string) => cafe.spaces.find((s) => s.slug === slug)?.name ?? slug;

/** The house's story order. It is not a plan: it never claims which room is next to which. */
export const ROOM_ORDER: { slug: RoomSlug; drawing: string; name: string }[] = [
  { slug: "entry", drawing: "entry", name: nameOf("entry") },
  { slug: "main-floor", drawing: "main-floor", name: nameOf("main-floor") },
  { slug: "mezzanine", drawing: "mezzanine-stair", name: nameOf("mezzanine") },
  { slug: "courtyard", drawing: "courtyard", name: nameOf("courtyard") },
  { slug: "games", drawing: "games", name: nameOf("games") },
  { slug: "bowling", drawing: "alley-sign", name: nameOf("bowling") },
];

export interface Pane { slug: RoomSlug; drawing: string; name: string; x: number; y: number; w: number; h: number }
export interface HouseGeometry {
  width: number; height: number; pad: number;
  x0: number; x1: number; cx: number; r: number; spring: number; base: number;
  cols: number; rows: number;
  panes: Pane[];
  /** grid lines as [x1, y1, x2, y2] in drawing order: the first three are the mark's dividers grown into the house */
  lines: [number, number, number, number][];
}

/** The mark's arch grown to `width`: a semicircular head for the sky, and the rooms below the springing line. */
export function houseGeometry(width: number, cols: number, rows: number, rowH: number): HouseGeometry {
  const pad = 2;
  const x0 = pad, x1 = width - pad;
  const span = x1 - x0;
  const r = span / 2;
  const cx = x0 + r;
  const spring = pad + r;
  const base = spring + rows * rowH;
  const colW = span / cols;
  const panes = ROOM_ORDER.map((room, i) => ({ ...room, x: x0 + (i % cols) * colW, y: spring + Math.floor(i / cols) * rowH, w: colW, h: rowH }));
  const verticals: [number, number, number, number][] = Array.from({ length: cols - 1 }, (_, i) => [x0 + colW * (i + 1), spring, x0 + colW * (i + 1), base]);
  const rowLines: [number, number, number, number][] = Array.from({ length: rows - 1 }, (_, i) => [x0, spring + rowH * (i + 1), x1, spring + rowH * (i + 1)]);
  const lines: [number, number, number, number][] = [verticals[0], [x0, spring, x1, spring], rowLines[0], ...verticals.slice(1), ...rowLines.slice(1)];
  return { width, height: base + pad, pad, x0, x1, cx, r, spring, base, cols, rows, panes, lines };
}

export function archPath(x0: number, x1: number, spring: number, base: number): string {
  const r = (x1 - x0) / 2;
  const f = (v: number) => Math.round(v * 10) / 10;
  return `M${f(x0)} ${f(base)}L${f(x0)} ${f(spring)}A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(spring)}L${f(x1)} ${f(base)}Z`;
}

/** The radius of the sun's track, concentric with the arch head. */
export function sunTrack(g: Pick<HouseGeometry, "r">): number {
  return g.r * 0.7;
}

/** The sun on its track inside the arch head: 11 AM at the left springing, 3 AM at the right. */
export function sunOnArch(clockT: number, g: HouseGeometry): { cx: number; cy: number; track: number } {
  const track = sunTrack(g);
  const a = Math.PI + Math.PI * Math.min(1, Math.max(0, clockT));
  return { cx: g.cx + Math.cos(a) * track, cy: g.spring + Math.sin(a) * track, track };
}

/** A crop inside each room drawing's frame for its pane (x, y, w, h in the drawing's frame). null shows the whole frame, sliced to fill. */
export const VIGNETTES: Record<RoomSlug, [number, number, number, number] | null> = {
  entry: null,
  "main-floor": null,
  mezzanine: null,
  courtyard: null,
  games: null,
  bowling: null,
};
