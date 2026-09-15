# "The drawn house" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Barnyard Co. site as a house drawn in the logo's single line: the logo draws itself and opens into six rooms, every room is a construction drawing made in code over the café's own photographs, and holding a drawing lifts it like tracing paper to show the photograph.

**Architecture:** Next.js 15 App Router renders every page as HTML with inline SVG drawings. Drawings are TypeScript modules that build strokes from a small construction library (`lib/draw`) in the logo's grammar, measured over guide layers produced offline by the tracing spike's pipeline; a review script renders each drawing alone and over its photo for a visual gate. GSAP (DrawSVG, MorphSVG, MotionPath, ScrollTrigger, CustomEase), loaded after first paint, draws the lines, opens the house and runs the few restrained loops; everything is complete at rest under reduced motion.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, Tailwind v4, GSAP 3.15 with `@gsap/react`, Lenis (fine pointers only), zod, Vitest, tsx, Playwright, sharp, `@resvg/resvg-js`, svgo, simplify-js, svg-path-properties; offline guide tools from `D:\barnyard-source\spikes\lineart` (onnxruntime-node, Python OpenCV).

**Spec:** `docs/spec.md` (read it first; this plan argues from it).

## Global Constraints

- Facts only from `content/cafe.json`; `fact()` guards every optional field; `UNKNOWN` and `CONFIRM` never render.
- Every drawing has an entry in `content/drawings.json` naming its source photo (under `D:\barnyard-source\ig`) or `null` for the brand mark and the games still life, and its credit.
- Drawings: single weight, round caps and joins; no faces, no crowds, no invented people; guide traces never ship; guided contours only for hands and food silhouettes, at most eight curves per drawing.
- Line weight on screen: 1.25 CSS px below 64rem, 1.5 CSS px from 64rem.
- Photos only at honest size: at most 1.25x source pixels on device pixels; credited.
- Mobile first: judge every drawing and page at 390x844 before 1440x900; day `?at=14:00` and night `?at=01:00`.
- Reduced motion: every drawing complete at rest; no loops; transitions become 150 ms crossfades; the arrival shows the finished house.
- No more than 300 strokes animating at once; no SVG turbulence filters; architecture never wobbles.
- Palette (hex exact): paper `#E9E8E4`, ink `#1F1C1A`, ink 2 `#5A5650`, corten `#8E4B2A`, night `#17191C`, night ink `#DAD6CE`, night ink 2 `#9C978F`, lamp `#E7A64F`, corten night `#D08A5C`, hairline `#B9B6AF` (decorative only).
- Type: Ysabeau Office (display 300 to 350, UI 450 to 500) and Hedvig Letters Serif (reading 400), both via `next/font/google`. Sentence case; no tracked capitals; no arrows glued to links.
- Budgets: initial JS under 180 KB gzipped; each room drawing under 40 KB gzipped; Lighthouse mobile 95+ on all four scores; LCP under 2.5 s.
- Ports: dev 3021, production 3022. Never touch `D:\barnyard` or `D:\barnyard-arch`; `D:\barnyard-source` is read-only.
- No `localStorage`/`sessionStorage`; no backend; enquiries compose WhatsApp messages.
- Commits: one per task; message ends with the co-author line the harness provides.

## Shared names (every task uses exactly these)

| Module | Exports |
|---|---|
| `lib/cafe.ts` | `cafe`, `fact`, `rooms`, `roomWord`, `phoneHref`, `whatsappHref`, `whatsappWith`, `mapsHref`, `addressLines`, `pressDate`, `eventDate`, `siteUrl`, `enquiryEmail`, `architectName`, `capitalise` |
| `lib/daylight.ts` | `LightState`, `Regime`, `stateFor`, `nowHour`, `houseNowHour`, `parseAt`, `formatHour`, `formatClock`, `isOpenAt`, `OPEN_HOUR`, `CLOSE_HOUR`, `REGIME_FLIP` |
| `lib/mark.ts` | option one's mark geometry (`MARK_VIEWBOX`, `ARCH_PATH`, `DIVIDER_PATHS`, `SUN_CENTER`, `SUN_RADIUS`, `SUN_RAYS`, `WINDOW_PATHS`, `STEAM_PATHS`, `DROPS`, `PLANT_PATHS`, `HOUSE_PATHS`, `ALL_PATHS`) |
| `lib/draw/types.ts` | `Layer`, `P`, `Stroke`, `Glow`, `Drawing`, `LAYER_ORDER` |
| `lib/draw/primitives.ts` | `n`, `line`, `polyline`, `rect`, `arc`, `circle`, `ellipse`, `arch`, `curve`, `repeat`, `repeatMany` |
| `lib/draw/perspective.ts` | `toward`, `perspectiveSteps`, `along` |
| `lib/draw/glyphs.ts` | `leaf`, `vine`, `steam`, `sunRays`, `bulb`, `jar`, `brush`, `cup`, `laptop`, `pin`, `ball` |
| `lib/draw/render.ts` | `toSvg(drawing, options)`, `strokeWidthFor(drawingWidth, cssWidth, cssStroke)` |
| `lib/random.ts` | `mulberry32(seed)` |
| `lib/drawings.ts` | `DrawingMeta`, `drawingsMeta`, `metaFor(id)`, `frameOf(id)` |
| `drawings/index.ts` | `DRAWINGS: Record<string, () => Drawing>`, `drawingFor(id)` |
| `lib/motion/gsap.ts` | `loadGsap(): Promise<GsapKit>`, `GsapKit`, `motionAllowed()` |
| `components/draw/Drawing.tsx` | `Drawing`, `DrawMode` |
| `drawings/<id>.ts` | `facadeDrawing`, `entryDrawing`, `mainFloorDrawing`, `wallLampDrawing`, `mezzanineStairDrawing`, `mezzanineNightDrawing`, `courtyardDrawing`, `gamesDrawing`, `alleySignDrawing`, `hoodieDrawing`, `nocatchDrawing`, `pizzaDrawing`, `doughDrawing` |
| `lib/photos.ts` | `photoFor(id)`, `honestScale(sourceWidth, cssWidth, dpr)` |
| `components/draw/Sheet.tsx` | `Sheet` (drawing plus the photograph under tracing paper) |
| `components/draw/life.ts` | `startLife(svg, drawing, kit)`, `rollBall(svg, drawing, kit)`, `chaseGroups(ids, size)`, `leafSchedule(seed, count)` |
| `lib/house.ts` | `RoomSlug`, `ROOM_ORDER`, `houseGeometry(width, height)`, `sunOnArch(clockT, geometry)`, `VIGNETTES` |
| `components/house/House.tsx` | `House` |
| `components/house/flight.ts` | `flyToRoom(pane, slug, push)` |
| `lib/annotations.ts` | `Annotation`, `ANNOTATIONS`, `resolveSource(path)` |
| `components/nav/PenLine.tsx` | `PenLineProvider`, `usePenLine()` |
| `components/nav/PenLink.tsx` | `PenLink` |
| `components/ui.tsx` | `TextLink`, `ButtonLink`, `FactFile`, `ExtGlyph` |

**Frames.** Every drawing is measured in the 1080-wide frame of its whole source photo; its crop in `content/drawings.json` is its viewBox (`x`, `y`, `width`, `height`). Drawings without a photograph use `0 0 1080 1350`.

**Stroke ids for life.** Steam `steam-<g>-<k>` with `morphs` holding variants 1 and 2; swaying leaves `leaf-<n>` with one alternate in `morphs`; bulbs `bulb-<n>` in reading order (chase after dark); lamps and lit signs as `glows`; the games cue ball `cue-ball` with `roll.path`. Architecture never animates.

---

### Task 1: Tooling and the ported core

**Files:**
- Modify: `package.json`, `.gitignore`
- Create: `vitest.config.ts`, `lib/daylight.ts`, `lib/cafe.ts`, `lib/mark.ts`, `lib/random.ts`
- Test: `tests/daylight.test.ts`, `tests/cafe.test.ts`, `tests/random.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: the `lib/cafe.ts`, `lib/daylight.ts`, `lib/mark.ts` exports in the table; `mulberry32(seed: number): () => number`.

- [ ] **Step 1: Install tooling and set scripts**

```bash
npm install zod@latest
npm install -D vitest@latest vite-tsconfig-paths@latest tsx@latest playwright@latest
npx playwright install chromium
npm pkg set scripts.dev="next dev --turbopack -p 3021"
npm pkg set scripts.start="next start -p 3022"
npm pkg set scripts.test="vitest run"
printf '\n# guide layers and review renders (reproducible, never shipped)\n/guides/\n/review/\n' >> .gitignore
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
});
```

- [ ] **Step 3: Copy the ported modules**

```bash
mkdir -p lib tests
cp docs/reference/barnyard-v1/lib/daylight.ts lib/daylight.ts
cp docs/reference/barnyard-v1/lib/cafe.ts lib/cafe.ts
cp docs/reference/barnyard-v1/lib/mark.ts lib/mark.ts
```

- [ ] **Step 4: Write the failing tests**

`tests/daylight.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatClock, isOpenAt, parseAt, stateFor } from "@/lib/daylight";

describe("daylight", () => {
  it("is day at 2 PM and night at 1 AM", () => {
    expect(stateFor(14).regime).toBe("day");
    expect(stateFor(1).regime).toBe("night");
  });
  it("is open from 11 AM to 3 AM", () => {
    expect(isOpenAt(10.99)).toBe(false);
    expect(isOpenAt(2.5)).toBe(true);
    expect(isOpenAt(3)).toBe(false);
  });
  it("reads ?at= and formats hours", () => {
    expect(parseAt("?at=01:00")).toBe(25);
    expect(formatClock("03:00")).toBe("3 AM");
  });
});
```

`tests/cafe.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { cafe, fact, roomWord } from "@/lib/cafe";

describe("cafe", () => {
  it("drops flagged values", () => {
    expect(fact("UNKNOWN")).toBeUndefined();
    expect(fact("CONFIRM — x")).toBeUndefined();
    expect(fact(cafe.meta.geo)).toBeUndefined();
    expect(fact("Ample parking")).toBe("Ample parking");
  });
  it("counts six rooms", () => {
    expect(roomWord).toBe("six");
  });
});
```

`tests/random.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { mulberry32 } from "@/lib/random";

describe("mulberry32", () => {
  it("is deterministic and within 0..1", () => {
    const a = mulberry32(7), b = mulberry32(7);
    for (let i = 0; i < 100; i++) {
      const v = a();
      expect(v).toBe(b());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
```

- [ ] **Step 5: Run to verify `random` fails**

Run: `npm test`
Expected: `daylight` and `cafe` PASS; `random` FAILS (module missing).

- [ ] **Step 6: Implement `lib/random.ts`**

```ts
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- [ ] **Step 7: Run to verify all pass**

Run: `npm test`
Expected: 3 files PASS.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib tests .gitignore
git commit -m "chore: tooling and ported daylight, cafe and mark modules"
```

---

### Task 2: The construction library (`lib/draw`)

**Files:**
- Create: `lib/draw/types.ts`, `lib/draw/primitives.ts`, `lib/draw/perspective.ts`, `lib/draw/glyphs.ts`, `lib/draw/render.ts`
- Test: `tests/draw-primitives.test.ts`, `tests/draw-glyphs.test.ts`, `tests/draw-render.test.ts`

**Interfaces:**
- Consumes: `mulberry32` (Task 1), `STEAM_PATHS` is not used (steam is generated so it can vary).
- Produces (SVG coordinates: x right, y down, measured in the 1080-wide frame of the whole source photo, which is the frame of `guides/<id>/grid.png`; a drawing's `x`, `y`, `width` and `height` are its crop in that frame and become the viewBox, so measured points are pasted unchanged):
  - `type Layer = "structure" | "detail" | "life" | "lamp"`; `type P = [number, number]`; `interface Stroke { d: string; layer: Layer; id?: string }`; `interface Glow { x: number; y: number; r: number }`; `interface Drawing { id: string; title: string; x?: number; y?: number; width: number; height: number; strokes: Stroke[]; glows?: Glow[]; morphs?: Record<string, string[]>; roll?: { ball: string; path: string } }`; `LAYER_ORDER`.
  - `n(v)`: one-decimal number formatting with no `-0`.
  - `line(a, b, layer?)`, `polyline(points, layer?, closed?)`, `rect(x, y, w, h, layer?)`, `arc(centre, r, fromDeg, toDeg, layer?)` (degrees clockwise from +x on screen), `circle(c, r, layer?)`, `ellipse(c, rx, ry, layer?)`, `arch(base, span, height?, layer?)` (the mark's arch standing on its bottom centre), `curve(points, layer?, tension?)` (smooth cubic through points), `repeat(count, fn)`, `repeatMany(count, fn)`.
  - `toward(p, vp, t)`, `perspectiveSteps(count, nearZ?, farZ?)`, `along(a, b, ts)`.
  - Glyphs returning `Stroke[]` unless noted: `leaf(base, length, angleDeg, layer?)` returns `Stroke`; `vine(path, leaves, seed, leafLength?)`; `steam(base, height, variant)`; `sunRays(c, r, count?)`; `bulb(c, r?)` returns `Stroke`; `jar(x, y, w, h)`; `brush(from, to)`; `cup(base, w, h)`; `laptop(x, y, w, h)`; `pin(base, h)`; `ball(c, r)` returns `Stroke`.
  - `toSvg(d: Drawing, o?: { stroke?: number; color?: string; background?: string; photo?: { href: string; opacity: number } }): string` and `strokeWidthFor(drawingWidth, cssWidth, cssStroke): number`.

- [ ] **Step 1: Write the failing tests**

`tests/draw-primitives.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { perspectiveSteps } from "@/lib/draw/perspective";
import { arch, circle, curve, line, n, polyline, rect, repeat, repeatMany } from "@/lib/draw/primitives";

describe("primitives", () => {
  it("formats numbers to one decimal without -0", () => {
    expect(n(1.26)).toBe("1.3");
    expect(n(-0.01)).toBe("0");
  });
  it("draws a line", () => {
    expect(line([0, 0], [10, 5]).d).toBe("M0 0L10 5");
  });
  it("closes polylines and rects", () => {
    expect(polyline([[0, 0], [1, 0], [1, 1]], "detail", true).d.endsWith("Z")).toBe(true);
    expect(rect(0, 0, 2, 3).d).toBe("M0 0L2 0L2 3L0 3Z");
  });
  it("draws the mark's arch on its base", () => {
    expect(arch([540, 1000], 400).d).toBe("M340 1000L340 800A200 200 0 0 1 740 800L740 1000");
  });
  it("returns to the start of a circle", () => {
    const d = circle([10, 10], 5).d;
    expect(d.startsWith("M15 10")).toBe(true);
    expect(d.endsWith("15 10")).toBe(true);
  });
  it("draws a smooth curve that starts and ends on its points", () => {
    const d = curve([[0, 0], [50, 20], [100, 0]]).d;
    expect(d.startsWith("M0 0C")).toBe(true);
    expect(d.endsWith("100 0")).toBe(true);
  });
  it("repeats with t from 0 to 1, and flattens with repeatMany", () => {
    const ts = repeat(5, (_, t) => t);
    expect(ts[0]).toBe(0);
    expect(ts[4]).toBe(1);
    expect(repeatMany(3, (i) => [i, i])).toEqual([0, 0, 1, 1, 2, 2]);
  });
  it("foreshortens receding steps", () => {
    const s = perspectiveSteps(6, 1, 4);
    expect(s[0]).toBe(0);
    expect(s[5]).toBeCloseTo(1);
    for (let i = 2; i < s.length; i++) expect(s[i] - s[i - 1]).toBeLessThan(s[i - 1] - s[i - 2]);
  });
});
```

`tests/draw-glyphs.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ball, bulb, cup, jar, laptop, leaf, pin, steam, sunRays, vine } from "@/lib/draw/glyphs";

const valid = (d: string) => !/NaN|undefined/.test(d);

describe("glyphs", () => {
  it("closes a leaf", () => {
    expect(leaf([0, 0], 20, -90).d.endsWith("Z")).toBe(true);
  });
  it("makes three steam lines that differ by variant", () => {
    const a = steam([100, 100], 60, 0);
    const b = steam([100, 100], 60, 1);
    expect(a).toHaveLength(3);
    expect(a[0].d).not.toBe(b[0].d);
  });
  it("is deterministic for a seed", () => {
    expect(vine([[0, 0], [100, 50], [200, 0]], 8, 3)).toEqual(vine([[0, 0], [100, 50], [200, 0]], 8, 3));
  });
  it("produces valid paths for every glyph", () => {
    const all = [
      ...sunRays([50, 50], 20), bulb([10, 10]), ...jar(0, 0, 40, 60), ...cup([50, 100], 30, 40),
      ...laptop(0, 0, 120, 80), ...pin([50, 200], 120), ball([10, 10], 6), ...vine([[0, 0], [60, 30]], 4, 1),
    ];
    for (const s of all) expect(valid(s.d), s.d).toBe(true);
  });
});
```

`tests/draw-render.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { strokeWidthFor, toSvg } from "@/lib/draw/render";
import { line } from "@/lib/draw/primitives";

describe("render", () => {
  it("groups strokes by layer in drawing order", () => {
    const svg = toSvg({ id: "t", title: "Test", width: 100, height: 100, strokes: [line([0, 0], [1, 1], "life"), line([0, 0], [2, 2], "structure")] });
    expect(svg.indexOf('class="layer-structure"')).toBeLessThan(svg.indexOf('class="layer-life"'));
    expect(svg).toContain('stroke-linecap="round"');
    expect(svg).not.toMatch(/NaN/);
  });
  it("converts a CSS stroke into drawing units", () => {
    expect(strokeWidthFor(1080, 390, 1.25)).toBeCloseTo(3.46, 2);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm test -- draw`
Expected: FAIL, modules missing.

- [ ] **Step 3: Implement `lib/draw/types.ts`**

```ts
export type Layer = "structure" | "detail" | "life" | "lamp";
export type P = [number, number];
export interface Stroke { d: string; layer: Layer; id?: string }
export interface Glow { x: number; y: number; r: number }
export interface Drawing { id: string; title: string; x?: number; y?: number; width: number; height: number; strokes: Stroke[]; glows?: Glow[]; morphs?: Record<string, string[]>; roll?: { ball: string; path: string } }
export const LAYER_ORDER: Layer[] = ["structure", "detail", "life", "lamp"];
```

- [ ] **Step 4: Implement `lib/draw/primitives.ts`**

```ts
import type { Layer, P, Stroke } from "./types";

export function n(v: number): string {
  const r = Math.round(v * 10) / 10;
  return Object.is(r, -0) || r === 0 ? "0" : String(r);
}
const pt = ([x, y]: P) => `${n(x)} ${n(y)}`;

export function line(a: P, b: P, layer: Layer = "structure"): Stroke {
  return { d: `M${pt(a)}L${pt(b)}`, layer };
}

export function polyline(points: P[], layer: Layer = "structure", closed = false): Stroke {
  if (points.length < 2) throw new Error("polyline needs at least two points");
  return { d: `M${pt(points[0])}${points.slice(1).map((p) => `L${pt(p)}`).join("")}${closed ? "Z" : ""}`, layer };
}

export function rect(x: number, y: number, w: number, h: number, layer: Layer = "structure"): Stroke {
  return polyline([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], layer, true);
}

export function circle(c: P, r: number, layer: Layer = "detail"): Stroke {
  return { d: `M${n(c[0] + r)} ${n(c[1])}A${n(r)} ${n(r)} 0 1 1 ${n(c[0] - r)} ${n(c[1])}A${n(r)} ${n(r)} 0 1 1 ${n(c[0] + r)} ${n(c[1])}`, layer };
}

export function ellipse(c: P, rx: number, ry: number, layer: Layer = "detail"): Stroke {
  return { d: `M${n(c[0] + rx)} ${n(c[1])}A${n(rx)} ${n(ry)} 0 1 1 ${n(c[0] - rx)} ${n(c[1])}A${n(rx)} ${n(ry)} 0 1 1 ${n(c[0] + rx)} ${n(c[1])}`, layer };
}

/** Degrees, clockwise from +x on screen (y down). */
export function arc(c: P, r: number, fromDeg: number, toDeg: number, layer: Layer = "detail"): Stroke {
  const sweep = toDeg - fromDeg;
  if (Math.abs(sweep) >= 360) return circle(c, r, layer);
  const rad = (d: number) => (d * Math.PI) / 180;
  const a: P = [c[0] + Math.cos(rad(fromDeg)) * r, c[1] + Math.sin(rad(fromDeg)) * r];
  const b: P = [c[0] + Math.cos(rad(toDeg)) * r, c[1] + Math.sin(rad(toDeg)) * r];
  return { d: `M${pt(a)}A${n(r)} ${n(r)} 0 ${Math.abs(sweep) > 180 ? 1 : 0} ${sweep > 0 ? 1 : 0} ${pt(b)}`, layer };
}

/** The mark's arch standing on `base` (bottom centre): straight jambs, semicircular head. Height defaults to span, as in the mark. */
export function arch(base: P, span: number, height = span, layer: Layer = "structure"): Stroke {
  const r = span / 2;
  const spring = base[1] - (height - r);
  return { d: `M${pt([base[0] - r, base[1]])}L${pt([base[0] - r, spring])}A${n(r)} ${n(r)} 0 0 1 ${pt([base[0] + r, spring])}L${pt([base[0] + r, base[1]])}`, layer };
}

/** A smooth curve through the points (Catmull-Rom as cubic Béziers). tension 0.5 is the classic spline. */
export function curve(points: P[], layer: Layer = "life", tension = 0.5): Stroke {
  if (points.length < 2) throw new Error("curve needs at least two points");
  if (points.length === 2) return line(points[0], points[1], layer);
  const k = tension / 3;
  let d = `M${pt(points[0])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1: P = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2: P = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return { d, layer };
}

export function repeat<T>(count: number, fn: (i: number, t: number) => T): T[] {
  return Array.from({ length: count }, (_, i) => fn(i, count === 1 ? 0 : i / (count - 1)));
}

export function repeatMany<T>(count: number, fn: (i: number, t: number) => T[]): T[] {
  return repeat(count, fn).flat();
}
```

- [ ] **Step 5: Implement `lib/draw/perspective.ts`**

```ts
import type { P } from "./types";

export const toward = (p: P, vp: P, t: number): P => [p[0] + (vp[0] - p[0]) * t, p[1] + (vp[1] - p[1]) * t];

/** 0..1 positions of `count` evenly spaced items receding from nearZ to farZ, as projected (1/z). */
export function perspectiveSteps(count: number, nearZ = 1, farZ = 4): number[] {
  if (count <= 1) return [0];
  const span = 1 / nearZ - 1 / farZ;
  return Array.from({ length: count }, (_, i) => {
    const z = nearZ + ((farZ - nearZ) * i) / (count - 1);
    return (1 / nearZ - 1 / z) / span;
  });
}

export const along = (a: P, b: P, ts: number[]): P[] => ts.map((t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
```

- [ ] **Step 6: Implement `lib/draw/glyphs.ts`**

```ts
import { mulberry32 } from "@/lib/random";
import { arc, circle, curve, ellipse, line, n, polyline, repeat } from "./primitives";
import type { Layer, P, Stroke } from "./types";

const pt = ([x, y]: P) => `${n(x)} ${n(y)}`;

/** The mark's almond leaf. angleDeg is the direction from base to tip, clockwise from +x. */
export function leaf(base: P, length: number, angleDeg: number, layer: Layer = "life"): Stroke {
  const a = (angleDeg * Math.PI) / 180;
  const tip: P = [base[0] + Math.cos(a) * length, base[1] + Math.sin(a) * length];
  const mid: P = [(base[0] + tip[0]) / 2, (base[1] + tip[1]) / 2];
  const nx = -Math.sin(a) * length * 0.28;
  const ny = Math.cos(a) * length * 0.28;
  return { d: `M${pt(base)}Q${pt([mid[0] + nx, mid[1] + ny])} ${pt(tip)}Q${pt([mid[0] - nx, mid[1] - ny])} ${pt(base)}Z`, layer };
}

/** A stem through `path` with leaves alternating sides along it. */
export function vine(path: P[], leaves: number, seed: number, leafLength = 18): Stroke[] {
  const r = mulberry32(seed);
  const out: Stroke[] = [curve(path, "life")];
  const segs = path.slice(1).map((p, i) => ({ a: path[i], b: p, len: Math.hypot(p[0] - path[i][0], p[1] - path[i][1]) }));
  const total = segs.reduce((s, x) => s + x.len, 0);
  for (let i = 0; i < leaves; i++) {
    let at = ((i + 0.5) / leaves) * total;
    const seg = segs.find((s) => (at -= s.len) <= 0) ?? segs[segs.length - 1];
    const t = seg.len ? 1 + at / seg.len : 0;
    const base: P = [seg.a[0] + (seg.b[0] - seg.a[0]) * t, seg.a[1] + (seg.b[1] - seg.a[1]) * t];
    const dir = (Math.atan2(seg.b[1] - seg.a[1], seg.b[0] - seg.a[0]) * 180) / Math.PI;
    const side = i % 2 ? 1 : -1;
    out.push(leaf(base, leafLength * (0.8 + r() * 0.4), dir + side * (55 + r() * 20)));
  }
  return out;
}

/** Three rising lines like the mark's steam. Variants shift the wave so steam can morph between them. */
export function steam(base: P, height: number, variant: 0 | 1 | 2 = 0, layer: Layer = "life"): Stroke[] {
  const phase = [0, 0.33, 0.66][variant];
  return [-1, 0, 1].map((k) =>
    curve(
      repeat(7, (_, t) => [base[0] + k * height * 0.18 + Math.sin((t * 2.2 + phase + k * 0.2) * Math.PI * 2) * height * 0.06, base[1] - t * height] as P),
      layer,
    ),
  );
}

export function sunRays(c: P, r: number, count = 8): Stroke[] {
  return repeat(count, (i) => {
    const a = (i / count) * Math.PI * 2;
    return line([c[0] + Math.cos(a) * r * 1.35, c[1] + Math.sin(a) * r * 1.35], [c[0] + Math.cos(a) * r * 1.85, c[1] + Math.sin(a) * r * 1.85], "detail");
  });
}

export function bulb(c: P, r = 3): Stroke {
  return circle(c, r, "lamp");
}

export function jar(x: number, y: number, w: number, h: number): Stroke[] {
  return [polyline([[x, y + h * 0.12], [x, y + h], [x + w, y + h], [x + w, y + h * 0.12]], "detail"), ellipse([x + w / 2, y + h * 0.12], w / 2, h * 0.08, "detail")];
}

export function brush(from: P, to: P): Stroke[] {
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const ferrule: P = [from[0] + dx * 0.82, from[1] + dy * 0.82];
  const nx = -uy * 3, ny = ux * 3;
  return [
    line(from, ferrule, "detail"),
    polyline([[ferrule[0] + nx, ferrule[1] + ny], [to[0], to[1]], [ferrule[0] - nx, ferrule[1] - ny]], "detail"),
  ];
}

export function cup(base: P, w: number, h: number): Stroke[] {
  const [x, y] = base;
  return [
    polyline([[x - w / 2, y - h], [x - w * 0.38, y], [x + w * 0.38, y], [x + w / 2, y - h]], "detail"),
    arc([x + w * 0.52, y - h * 0.55], h * 0.22, -80, 80, "detail"),
  ];
}

export function laptop(x: number, y: number, w: number, h: number): Stroke[] {
  return [
    polyline([[x, y + h], [x + w, y + h], [x + w * 0.9, y + h * 0.82], [x + w * 0.1, y + h * 0.82]], "detail", true),
    polyline([[x + w * 0.12, y + h * 0.82], [x + w * 0.18, y], [x + w * 0.82, y], [x + w * 0.88, y + h * 0.82]], "detail"),
  ];
}

/** A bowling pin standing on `base`, height h, with its two bands. */
export function pin(base: P, h: number): Stroke[] {
  const [x, y] = base;
  const prof: [number, number][] = [[0.14, 0], [0.24, 0.12], [0.28, 0.3], [0.24, 0.5], [0.14, 0.64], [0.11, 0.74], [0.14, 0.85], [0.14, 0.93], [0.08, 0.99], [0, 1]];
  const right = prof.map(([px, py]) => [x + px * h * 0.5, y - py * h] as P);
  const left = [...prof].reverse().map(([px, py]) => [x - px * h * 0.5, y - py * h] as P);
  return [
    curve([...right, ...left.slice(1)], "structure"),
    line([x - h * 0.06, y - h * 0.7], [x + h * 0.06, y - h * 0.7], "lamp"),
    line([x - h * 0.065, y - h * 0.66], [x + h * 0.065, y - h * 0.66], "lamp"),
  ];
}

export function ball(c: P, r: number): Stroke {
  return circle(c, r, "life");
}
```

- [ ] **Step 7: Implement `lib/draw/render.ts`**

```ts
import { LAYER_ORDER, type Drawing } from "./types";

/** Stroke width in drawing units that shows as `cssStroke` px when the drawing is `cssWidth` px wide. */
export function strokeWidthFor(drawingWidth: number, cssWidth: number, cssStroke: number): number {
  return (cssStroke * drawingWidth) / cssWidth;
}

export function toSvg(d: Drawing, o: { stroke?: number; color?: string; background?: string; photo?: { href: string; opacity: number } } = {}): string {
  const stroke = o.stroke ?? 1.5;
  const color = o.color ?? "#1F1C1A";
  const x = d.x ?? 0;
  const y = d.y ?? 0;
  const bg = o.background ? `<rect x="${x}" y="${y}" width="${d.width}" height="${d.height}" fill="${o.background}"/>` : "";
  const photo = o.photo ? `<image href="${o.photo.href}" x="${x}" y="${y}" width="${d.width}" height="${d.height}" opacity="${o.photo.opacity}" preserveAspectRatio="xMidYMid slice"/>` : "";
  const layers = LAYER_ORDER.map((layer) => {
    const paths = d.strokes.filter((s) => s.layer === layer).map((s) => `<path d="${s.d}"${s.id ? ` id="${s.id}"` : ""}/>`).join("");
    return paths ? `<g class="layer-${layer}">${paths}</g>` : "";
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${d.width} ${d.height}" width="${d.width}" height="${d.height}">${bg}${photo}<g fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${layers}</g></svg>`;
}
```

- [ ] **Step 8: Run to verify they pass**

Run: `npm test -- draw`
Expected: PASS. If `perspectiveSteps` spacing is not decreasing, check the `1/z` formula, not the test.

- [ ] **Step 9: Commit**

```bash
git add lib/draw tests/draw-*.test.ts
git commit -m "feat: construction library for drawings in the logo's grammar"
```

---

### Task 3: The drawings manifest, registry, the mark drawing and the review renderer

**Files:**
- Create: `content/drawings.json`, `lib/drawings.ts`, `drawings/index.ts`, `drawings/mark.ts`, `scripts/review.ts`
- Test: `tests/drawings.test.ts`

**Interfaces:**
- Consumes: `lib/draw/*` (Task 2), `lib/mark.ts` (Task 1), `content/media.json`.
- Produces:
  - `interface DrawingMeta { id: string; title: string; source: string | null; crop: [number, number, number, number] | null; ignore: [number, number, number, number][]; credit: string | null; routes: string[]; strokeBudget: number; lift: boolean }`, `drawingsMeta: DrawingMeta[]`, `metaFor(id): DrawingMeta`, `frameOf(id): { x: number; y: number; width: number; height: number }` (the crop as a frame; drawings without a source use `0 0 1080 1350`). Crop and ignore rectangles are `[x0, y0, x1, y1]` in the 1080-wide frame of the whole source.
  - `DRAWINGS: Record<string, () => Drawing>` and `drawingFor(id): Drawing` in `drawings/index.ts` (each later task adds one entry).
  - `drawings/mark.ts`: `markDrawing(): Drawing` (id `mark`, 320 x 320).
  - `npx tsx scripts/review.ts <id> [--css=390]`: writes `review/<id>-drawing.png` (drawing alone at 1080 wide), `review/<id>-phone.png` (as a 390 CSS px wide phone shows it at 3x), and `review/<id>-overlay.png` (over `guides/<id>/photo.jpg` at 30% when a guide exists); prints stroke counts per layer; exits 1 if over `strokeBudget`.

- [ ] **Step 1: Write `content/drawings.json`**

```json
{
  "_README": "Every drawing on the site. source is relative to D:/barnyard-source/ig (null for the brand mark and for the games still life, which has no photograph). crop and ignore rectangles are [x0, y0, x1, y1] in the 1080-wide frame of the whole source (the frame of guides/<id>/grid.png); crop becomes the drawing's viewBox and the photograph's crop; ignore blanks Instagram overlays in the guide layers only. credit comes from the matching slot in content/media.json. strokeBudget is the most strokes the drawing may have. lift is true when the photograph may be shown under the drawing (false where a reel caption crosses the subject).",
  "drawings": [
    { "id": "mark", "title": "The Barnyard Co. mark: an arch with a sun, steam, a plant and a small house", "source": null, "crop": null, "ignore": [], "credit": null, "routes": ["/"], "strokeBudget": 40, "lift": false },
    { "id": "facade", "title": "The corten sign with the lit logo and lettering, creepers falling over it and string lights above", "source": "stills/sign-corten.jpg", "crop": [0, 0, 1080, 1000], "ignore": [], "credit": "Still from a reel by @thebarnyard.co", "routes": ["/", "/spaces", "/visit"], "strokeBudget": 260, "lift": true },
    { "id": "entry", "title": "The entry hall: fruit-crate strips overhead, the steel stair, the barrel, chairs and tall curtains", "source": "stills/entry-ceiling.jpg", "crop": [0, 0, 1080, 1800], "ignore": [], "credit": "Still from a reel by @suryaabrew, via @thebarnyard.co", "routes": ["/spaces", "/press"], "strokeBudget": 300, "lift": true },
    { "id": "main-floor", "title": "The main floor: brick, black steel, the mezzanine above and the stair, tables and plants", "source": "raw/ad-1.jpg", "crop": [250, 0, 1080, 625], "ignore": [], "credit": "Photograph via @thebarnyard.co", "routes": ["/", "/spaces"], "strokeBudget": 300, "lift": true },
    { "id": "wall-lamp", "title": "A wall lamp over a framed mirror, a table lamp, a rotary phone and a wooden box against brick", "source": "stills/brick-lamp.jpg", "crop": [0, 150, 1080, 1580], "ignore": [], "credit": "Still from a reel by @suryaabrew, via @thebarnyard.co", "routes": ["/spaces"], "strokeBudget": 140, "lift": true },
    { "id": "mezzanine-stair", "title": "The steel stair against the tall windows, with tables below", "source": "raw/ad-2.jpg", "crop": [70, 50, 726, 1032], "ignore": [], "credit": "Photograph via @thebarnyard.co", "routes": ["/", "/spaces", "/press", "/shoot"], "strokeBudget": 260, "lift": true },
    { "id": "mezzanine-night", "title": "The mezzanine after dark: a long shared table, pendant lamps and the city through the window", "source": "stills/night-city-window.jpg", "crop": [0, 60, 1080, 1400], "ignore": [], "credit": "Still from a reel by @anushhkagautam, via @thebarnyard.co", "routes": ["/spaces"], "strokeBudget": 240, "lift": true },
    { "id": "courtyard", "title": "The courtyard: a canopy of vines and palms, a railing, a table with two chairs", "source": "stills/courtyard-vines.jpg", "crop": [0, 240, 1080, 1920], "ignore": [], "credit": "Still from a reel by @suryaabrew, via @thebarnyard.co", "routes": ["/spaces", "/host"], "strokeBudget": 260, "lift": true },
    { "id": "games", "title": "A pool table, a shelf of board games and a shelf of books", "source": null, "crop": null, "ignore": [], "credit": null, "routes": ["/spaces"], "strokeBudget": 180, "lift": false },
    { "id": "alley-sign", "title": "The alley's sign at night: the BOWL marquee in bulbs, the giant pin with OPEN, and the lightbox", "source": "stills/bowl-sign.jpg", "crop": [60, 380, 1080, 1900], "ignore": [[270, 1000, 812, 1114]], "credit": "Still from a reel by @thebarnyard.co", "routes": ["/", "/spaces", "/bowl"], "strokeBudget": 260, "lift": false },
    { "id": "hoodie", "title": "The hoodie workshop: a paint jar with a brush, brushes on the table and a painted hoodie", "source": "stills/host-hoodie-painting.jpg", "crop": [0, 72, 1080, 1500], "ignore": [], "credit": "Still from a reel by @paulsartgallery98, via @thebarnyard.co", "routes": ["/host"], "strokeBudget": 140, "lift": true },
    { "id": "nocatch", "title": "Where the NoCatch film was shot: a barrel by sheer curtains, a table and a palm", "source": "stills/shoot-nocatch-table.jpg", "crop": [0, 0, 1080, 1500], "ignore": [], "credit": "Still from the NoCatch film by @nocatch.in, via @thebarnyard.co", "routes": ["/shoot"], "strokeBudget": 160, "lift": true },
    { "id": "pizza", "title": "A handmade pizza, cut, on its board", "source": "stills/menu-pizza-board.jpg", "crop": [0, 420, 1080, 1690], "ignore": [], "credit": "Still from a reel by @thebarnyard.co", "routes": ["/menu"], "strokeBudget": 120, "lift": true },
    { "id": "dough", "title": "Hands stretching pizza dough on a floured counter", "source": "stills/menu-dough-hands.jpg", "crop": [0, 60, 1080, 1690], "ignore": [], "credit": "Still from a reel by @thebarnyard.co", "routes": ["/menu"], "strokeBudget": 60, "lift": true }
  ]
}
```

Before committing, open `content/media.json` and confirm each `credit` above matches the credit of the slot made from the same still (`facade-corten`, `entry-ceiling`, `home-hero`, `ship-lamp`, `mezzanine-overlook`, `mezzanine-tables`, `courtyard`, `bowl-hero`, `host-hoodie-workshop`, `shoot-nocatch`, `menu-curriza`). The dough reel is the café's own. Correct any mismatch in `drawings.json`, never in `media.json`.

- [ ] **Step 2: Write the failing test `tests/drawings.test.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DRAWINGS, drawingFor } from "@/drawings";
import { drawingsMeta, metaFor } from "@/lib/drawings";
import { LAYER_ORDER } from "@/lib/draw/types";

const SOURCE = "D:/barnyard-source/ig";

describe("drawings manifest", () => {
  it("has unique ids and valid routes", () => {
    const ids = drawingsMeta.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    const routes = ["/", "/spaces", "/host", "/shoot", "/bowl", "/press", "/menu", "/visit"];
    for (const d of drawingsMeta) for (const r of d.routes) expect(routes, d.id).toContain(r);
  });
  it("crops every sourced drawing and lifts only drawings with a source", () => {
    for (const d of drawingsMeta) {
      if (d.source) expect(d.crop, d.id).not.toBeNull();
      if (d.lift) expect(d.source, d.id).toBeTruthy();
    }
  });
  it("credits every drawing that has a source, and the source exists", () => {
    for (const d of drawingsMeta.filter((x) => x.source)) {
      expect(d.credit, d.id).toBeTruthy();
      if (fs.existsSync(SOURCE)) expect(fs.existsSync(path.join(SOURCE, d.source!)), d.source!).toBe(true);
    }
  });
});

describe("drawing modules", () => {
  for (const id of Object.keys(DRAWINGS)) {
    it(`${id} is valid and within budget`, () => {
      const d = drawingFor(id);
      expect(d.id).toBe(id);
      expect(d.strokes.length).toBeGreaterThan(0);
      expect(d.strokes.length).toBeLessThanOrEqual(metaFor(id).strokeBudget);
      const crop = metaFor(id).crop;
      if (crop) expect([d.x ?? 0, d.y ?? 0, (d.x ?? 0) + d.width, (d.y ?? 0) + d.height]).toEqual(crop);
      for (const s of d.strokes) {
        expect(LAYER_ORDER).toContain(s.layer);
        expect(s.d).not.toMatch(/NaN|undefined|Infinity/);
      }
    });
  }
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- drawings`
Expected: FAIL, modules missing.

- [ ] **Step 4: Implement `lib/drawings.ts`**

```ts
import { z } from "zod";
import data from "@/content/drawings.json";

const Rect = z.tuple([z.number(), z.number(), z.number(), z.number()]);
const Meta = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(10),
  source: z.string().nullable(),
  crop: Rect.nullable(),
  ignore: z.array(Rect),
  credit: z.string().nullable(),
  routes: z.array(z.string()),
  strokeBudget: z.number().int().positive(),
  lift: z.boolean(),
});
export type DrawingMeta = z.infer<typeof Meta>;

export const drawingsMeta: DrawingMeta[] = z.object({ drawings: z.array(Meta) }).parse(data).drawings;

export function metaFor(id: string): DrawingMeta {
  const m = drawingsMeta.find((d) => d.id === id);
  if (!m) throw new Error(`No drawing "${id}" in content/drawings.json`);
  return m;
}

/** The drawing's frame: its crop in the 1080-wide frame of the whole source. */
export function frameOf(id: string): { x: number; y: number; width: number; height: number } {
  const [x0, y0, x1, y1] = metaFor(id).crop ?? [0, 0, 1080, 1350];
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}
```

- [ ] **Step 5: Implement `drawings/mark.ts` and `drawings/index.ts`**

`drawings/mark.ts`:

```ts
import { DIVIDER_PATHS, DROPS, HOUSE_PATHS, PLANT_PATHS, STEAM_PATHS, SUN_CENTER, SUN_RADIUS, SUN_RAYS, WINDOW_PATHS, ARCH_PATH } from "@/lib/mark";
import { circle } from "@/lib/draw/primitives";
import type { Drawing, Stroke } from "@/lib/draw/types";

/** The brand mark as a drawing, in the order an architect would draw it. Ids let the arrival morph the dividers. */
export function markDrawing(): Drawing {
  const strokes: Stroke[] = [
    { d: ARCH_PATH, layer: "structure", id: "mark-arch" },
    ...DIVIDER_PATHS.map((d, i) => ({ d, layer: "structure" as const, id: `mark-divider-${i}` })),
    ...WINDOW_PATHS.map((d) => ({ d, layer: "detail" as const })),
    { ...circle([SUN_CENTER.x, SUN_CENTER.y], SUN_RADIUS, "detail"), id: "mark-sun" },
    ...SUN_RAYS.map((d) => ({ d, layer: "detail" as const })),
    ...STEAM_PATHS.map((d, i) => ({ d, layer: "life" as const, id: `mark-steam-${i}` })),
    ...PLANT_PATHS.map((d) => ({ d, layer: "life" as const })),
    ...DROPS.map((p) => circle([p.x, p.y], p.r, "life")),
    ...HOUSE_PATHS.map((d) => ({ d, layer: "structure" as const })),
  ];
  return { id: "mark", title: "The Barnyard Co. mark", width: 320, height: 320, strokes };
}
```

`drawings/index.ts`:

```ts
import type { Drawing } from "@/lib/draw/types";
import { markDrawing } from "./mark";

export const DRAWINGS: Record<string, () => Drawing> = {
  mark: markDrawing,
};

export function drawingFor(id: string): Drawing {
  const make = DRAWINGS[id];
  if (!make) throw new Error(`No drawing module for "${id}"`);
  return make();
}
```

Check `tsconfig.json` has `"@/*": ["./*"]` so `@/drawings` resolves to `drawings/index.ts`.

- [ ] **Step 6: Run to verify it passes**

Run: `npm test -- drawings`
Expected: PASS (the `mark` module is within its 40-stroke budget).

- [ ] **Step 7: Write `scripts/review.ts`**

```bash
npm install -D @resvg/resvg-js@2.6.2 sharp@0.35.4
```

```ts
// Renders a drawing for review. Run: npx tsx scripts/review.ts <id> [--css=390]
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { drawingFor } from "../drawings";
import { metaFor } from "../lib/drawings";
import { LAYER_ORDER } from "../lib/draw/types";
import { strokeWidthFor, toSvg } from "../lib/draw/render";

const id = process.argv[2];
if (!id) { console.error("usage: npx tsx scripts/review.ts <id> [--css=390]"); process.exit(2); }
const cssArg = process.argv.find((a) => a.startsWith("--css="));
const css = cssArg ? Number(cssArg.slice(6)) : 390;

const d = drawingFor(id);
const meta = metaFor(id);
fs.mkdirSync("review", { recursive: true });

const counts = Object.fromEntries(LAYER_ORDER.map((l) => [l, d.strokes.filter((s) => s.layer === l).length]));
console.log(`${id}: ${d.strokes.length} strokes (budget ${meta.strokeBudget})`, counts);

const render = (svg: string, width: number) => new Resvg(svg, { fitTo: { mode: "width", value: width }, background: "#E9E8E4" }).render().asPng();

fs.writeFileSync(`review/${id}-drawing.png`, render(toSvg(d, { stroke: strokeWidthFor(d.width, 1080, 1.5), background: "#E9E8E4" }), 1080));
fs.writeFileSync(`review/${id}-phone.png`, render(toSvg(d, { stroke: strokeWidthFor(d.width, css, 1.25), background: "#E9E8E4" }), css * 3));

const photo = path.join("guides", id, "photo.jpg");
if (fs.existsSync(photo)) {
  const drawingPng = render(toSvg(d, { stroke: strokeWidthFor(d.width, 1080, 2), color: "#8E4B2A" }), d.width);
  const base = await sharp(photo).extract({ left: d.x ?? 0, top: d.y ?? 0, width: d.width, height: d.height }).modulate({ brightness: 1.25 }).composite([{ input: Buffer.from(`<svg width="${d.width}" height="${d.height}"><rect width="100%" height="100%" fill="#ffffff" opacity="0.7"/></svg>`) }]).png().toBuffer();
  await sharp(base).composite([{ input: drawingPng }]).png().toFile(`review/${id}-overlay.png`);
  console.log(`review/${id}-overlay.png`);
}
if (d.strokes.length > meta.strokeBudget) { console.error("over stroke budget"); process.exit(1); }
```

- [ ] **Step 8: Run the review on the mark and look**

Run: `npx tsx scripts/review.ts mark`
Expected: prints `mark: 36 strokes (budget 40)` (or the exact count) and writes two PNGs. Read `review/mark-phone.png`: the mark reads exactly like `assets/brand/logo barnyard.jpg`.

- [ ] **Step 9: Commit**

```bash
git add content/drawings.json lib/drawings.ts drawings scripts/review.ts tests/drawings.test.ts package.json package-lock.json
git commit -m "feat: drawings manifest and registry, the mark drawing, and the review renderer"
```

---

### Task 4: Guide layers (offline tracing as a measuring aid)

**Files:**
- Create: `scripts/guides/lineart/common.mjs`, `b-onnx.mjs`, `c-sed.py`, `combine.mjs`, `vectorize.mjs`, `run.mjs` (copied from `D:\barnyard-source\spikes\lineart\scripts\` and adapted), `scripts/guides/build.mjs`, `scripts/guides/grid.mjs`, `scripts/guides/extract.mjs`

**Interfaces:**
- Consumes: `content/drawings.json` (Task 3); the spike's models (`D:\barnyard-source\spikes\lineart\models`) and Python packages (`D:\barnyard-source\spikes\lineart\pydeps`).
- Produces, per drawing id with a source:
  - `guides/<id>/photo.jpg`: the whole source resized to 1080 wide (the measuring frame), overlays blanked. The crop is not applied here; it is the drawing's viewBox.
  - `guides/<id>/guide-rooms.svg` (consensus BxC) and `guides/<id>/guide-close.svg` (B lineart, longest 70%).
  - `guides/<id>/grid.png`: the photo with a labelled 60 px grid for reading coordinates.
  - `node scripts/guides/extract.mjs <id> --box=x0,y0,x1,y1 [--variant=close|rooms] [--tol=3] [--max=6] [--min=60]` prints JSON arrays of points for the longest guide strokes inside the box, simplified: these are pasted into drawing modules as guided contours and passed to `curve()`.

- [ ] **Step 1: Copy and adapt the spike scripts**

```bash
mkdir -p scripts/guides/lineart
cp D:/barnyard-source/spikes/lineart/scripts/{common.mjs,b-onnx.mjs,c-sed.py,combine.mjs,vectorize.mjs,run.mjs} scripts/guides/lineart/
npm install -D onnxruntime-node@1.30.0 svgo@4.1.0 simplify-js@1.2.4 svg-path-properties@latest
```

Edit `scripts/guides/lineart/common.mjs`:
1. Replace the `ROOT` line with `export const ROOT = path.resolve(process.env.GUIDES_ROOT || "guides/_work");`.
2. Replace the whole `IMAGES` constant with:

```js
export const IMAGES = fs.existsSync(path.join(ROOT, "ignore.json"))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, "ignore.json"), "utf8"))
  : {};
```

(move the `import fs` line above it if needed).

Edit `scripts/guides/lineart/b-onnx.mjs`: replace `p('models', M.file)` with `path.join(process.env.LINEART_MODELS || 'D:/barnyard-source/spikes/lineart/models', M.file)` and add `import path from 'node:path';`.

Edit `scripts/guides/lineart/c-sed.py`:
1. `ROOT = os.environ.get('GUIDES_ROOT', os.path.join(os.getcwd(), 'guides', '_work'))`
2. `sys.path.insert(0, os.environ.get('LINEART_PYDEPS', 'D:/barnyard-source/spikes/lineart/pydeps'))`
3. The model path: `os.path.join(os.environ.get('LINEART_MODELS', 'D:/barnyard-source/spikes/lineart/models'), 'sed-model.yml.gz')`
4. Replace `IGNORE` and `NAMES` with values loaded from `os.path.join(ROOT, 'ignore.json')` (`import json`; `IGNORE = {k: v.get('ignore', []) for k, v in data.items()}`; `NAMES = list(data.keys())`).

- [ ] **Step 2: Write `scripts/guides/build.mjs`**

```js
// Builds guide layers for drawings with a source photo. Run: node scripts/guides/build.mjs [id ...]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "D:/barnyard-source/ig";
const WORK = path.resolve("guides/_work");
const manifest = JSON.parse(fs.readFileSync("content/drawings.json", "utf8")).drawings;
const wanted = process.argv.slice(2);
const items = manifest.filter((d) => d.source && (!wanted.length || wanted.includes(d.id)));
for (const dir of ["in", "work", "out", "shots"]) fs.mkdirSync(path.join(WORK, dir), { recursive: true });

const ignore = {};
for (const d of items) {
  const src = path.join(SRC, d.source);
  // The whole source at 1080 wide: the frame every drawing is measured in. The crop is the drawing's viewBox, not applied here.
  const resized = await sharp(src).resize({ width: 1080 }).toBuffer();
  const { height: h } = await sharp(resized).metadata();
  const rects = d.ignore;
  let img = sharp(resized);
  if (rects.length) {
    const svg = `<svg width="1080" height="${h}">${rects.map(([a, b, c, e]) => `<rect x="${a}" y="${b}" width="${c - a}" height="${e - b}" fill="#808080"/>`).join("")}</svg>`;
    img = img.composite([{ input: Buffer.from(svg) }]);
  }
  await img.jpeg({ quality: 92 }).toFile(path.join(WORK, "in", `${d.id}.jpg`));
  fs.mkdirSync(path.join("guides", d.id), { recursive: true });
  fs.copyFileSync(path.join(WORK, "in", `${d.id}.jpg`), path.join("guides", d.id, "photo.jpg"));
  ignore[d.id] = { ignore: rects };
}
fs.writeFileSync(path.join(WORK, "ignore.json"), JSON.stringify(ignore, null, 2));

const names = `--names=${items.map((d) => d.id).join(",")}`;
const env = { ...process.env, GUIDES_ROOT: WORK };
const node = (script, args) => execFileSync("node", [path.join("scripts/guides/lineart", script), ...args, names], { stdio: "inherit", env });
node("b-onnx.mjs", ["--style=lineart", "--size=1024", "--thr=0.8", "--tag=B"]);
execFileSync("python", [path.join("scripts/guides/lineart", "c-sed.py"), "--tag=C", names], { stdio: "inherit", env });
node("combine.mjs", ["--a=B", "--b=C", "--radius=4", "--tag=BxC"]);
node("run.mjs", ["BxC", "--join=8", "--minLen=40"]);
node("run.mjs", ["B", "--out=B-keep70", "--keep=0.7", "--minLen=40", "--join=8"]);

for (const d of items) {
  fs.copyFileSync(path.join(WORK, "out", `${d.id}.BxC.svg`), path.join("guides", d.id, "guide-rooms.svg"));
  fs.copyFileSync(path.join(WORK, "out", `${d.id}.B-keep70.svg`), path.join("guides", d.id, "guide-close.svg"));
  console.log(`guides/${d.id}: photo.jpg, guide-rooms.svg, guide-close.svg`);
}
```

- [ ] **Step 3: Write `scripts/guides/grid.mjs`**

```js
// Labelled measuring grid over a guide photo. Run: node scripts/guides/grid.mjs <id> [--step=60]
import fs from "node:fs";
import sharp from "sharp";

const id = process.argv[2];
const step = Number((process.argv.find((a) => a.startsWith("--step=")) ?? "--step=60").slice(7));
const photo = `guides/${id}/photo.jpg`;
if (!fs.existsSync(photo)) { console.error(`no ${photo}; run node scripts/guides/build.mjs ${id}`); process.exit(1); }
const { width: w, height: h } = await sharp(photo).metadata();
let svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><g stroke="#ff2a6a" stroke-width="1" opacity="0.55">`;
for (let x = 0; x <= w; x += step) svg += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`;
for (let y = 0; y <= h; y += step) svg += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
svg += `</g><g fill="#ff2a6a" font-family="Arial" font-size="13">`;
for (let x = 0; x <= w; x += step * 2) svg += `<text x="${x + 2}" y="14">${x}</text>`;
for (let y = step * 2; y <= h; y += step * 2) svg += `<text x="2" y="${y - 2}">${y}</text>`;
svg += `</g></svg>`;
await sharp(photo).composite([{ input: Buffer.from(svg) }]).png().toFile(`guides/${id}/grid.png`);
console.log(`guides/${id}/grid.png`);
```

- [ ] **Step 4: Write `scripts/guides/extract.mjs`**

```js
// Prints simplified point lists for the longest guide strokes inside a box.
// node scripts/guides/extract.mjs <id> --box=x0,y0,x1,y1 [--variant=close|rooms] [--tol=3] [--max=6] [--min=60]
import fs from "node:fs";
import simplify from "simplify-js";
import { svgPathProperties } from "svg-path-properties";

const id = process.argv[2];
const opt = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const [x0, y0, x1, y1] = opt("box", "0,0,99999,99999").split(",").map(Number);
const variant = opt("variant", "close");
const tol = Number(opt("tol", "3")), max = Number(opt("max", "6")), min = Number(opt("min", "60"));

const svg = fs.readFileSync(`guides/${id}/guide-${variant}.svg`, "utf8");
const ds = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
const strokes = ds.map((d) => {
  const props = new svgPathProperties(d);
  const len = props.getTotalLength();
  const pts = [];
  for (let s = 0; s <= len; s += 4) { const p = props.getPointAtLength(s); pts.push({ x: p.x, y: p.y }); }
  return { len, pts };
}).filter((s) => s.len >= min && s.pts.every((p) => p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1))
  .sort((a, b) => b.len - a.len)
  .slice(0, max)
  .map((s) => simplify(s.pts, tol, true).map((p) => [Math.round(p.x), Math.round(p.y)]));

console.log(JSON.stringify(strokes));
console.error(`${strokes.length} contour(s), ${strokes.reduce((a, s) => a + s.length, 0)} points`);
```

- [ ] **Step 5: Build guides for every drawing with a source and look at two**

Run: `node scripts/guides/build.mjs`
Expected: per drawing, lines from B, C, combine and run, then `guides/<id>: photo.jpg, guide-rooms.svg, guide-close.svg`. If `python` cannot import cv2, confirm `D:/barnyard-source/spikes/lineart/pydeps` exists; do not install into the system Python.
Then: `node scripts/guides/grid.mjs entry && node scripts/guides/grid.mjs alley-sign`. Read `guides/entry/grid.png` and `guides/alley-sign/grid.png`: the grid labels are legible and the Instagram caption on the alley sign is blanked grey.

- [ ] **Step 6: Commit**

```bash
git add scripts/guides package.json package-lock.json
git commit -m "chore: guide layers from the tracing spike, measuring grid and contour extraction"
```

(`guides/` is git-ignored; it is regenerated with `node scripts/guides/build.mjs`.)

---

### Task 5: Tokens, type, light and the document shell

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`, `app/page.tsx`
- Create: `components/light/LightScript.tsx`, `components/light/LightProvider.tsx`, `components/light/OpenNow.tsx`, `components/chrome/Mark.tsx`, `components/chrome/SiteHeader.tsx`, `scripts/e2e/lib.mjs`, `scripts/e2e/shell.mjs`

**Interfaces:**
- Consumes: `stateFor`, `parseAt`, `nowHour`, `houseNowHour`, `isOpenAt`, `formatClock` (Task 1); `markDrawing` (Task 3); `toSvg` is not used here.
- Produces:
  - CSS tokens on `:root` (day) and `html[data-regime="night"]`: `--paper`, `--ink`, `--ink-2`, `--pen` (corten), `--lamp`, `--hair`, `--line-w` (1.25px, 1.5px from 64rem).
  - Type classes: `.t-display`, `.t-head`, `.t-line`, `.t-body`, `.t-label`, `.t-quote`, `.num`, `.sr-only`; link class `.pen-link`; button `.btn`.
  - `useLight(): { hour: number | null; state: LightState | null; houseOpen: boolean | null; pinned: boolean }`; `html[data-regime]`, `--clock-t`.
  - `<OpenNow open close />` by the house's clock.
  - `<Mark size title? />`; `<SiteHeader />` with a "Rooms" menu.
  - `scripts/e2e/lib.mjs` exports `BASE` (default `http://localhost:3022`), `launch`, `open(browser, path, { width, height, at, reducedMotion })` (merging any query already in `path`), `shot`, `assert`, `report`.

- [ ] **Step 1: Write `scripts/e2e/lib.mjs` and the failing `scripts/e2e/shell.mjs`**

`scripts/e2e/lib.mjs`:

```js
import { chromium } from "playwright";
import fs from "node:fs";

export const BASE = process.env.BASE || "http://localhost:3022";
const failures = [];

export async function launch() {
  return chromium.launch({ headless: !process.env.HEADED });
}

export async function open(browser, path, { width = 390, height = 844, at, reducedMotion = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: width < 800 ? 3 : 2, reducedMotion: reducedMotion ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const [p, qs] = path.split("?");
  const q = new URLSearchParams(qs ?? "");
  if (at) q.set("at", at);
  await page.goto(`${BASE}${p}${q.toString() ? `?${q}` : ""}`, { waitUntil: "networkidle" });
  return { page, ctx, errors };
}

export async function shot(page, name, fullPage = false) {
  fs.mkdirSync("shots", { recursive: true });
  await page.screenshot({ path: `shots/${name}.png`, fullPage });
}

export function assert(cond, msg) {
  if (cond) console.log(`  ok  ${msg}`);
  else { console.log(`  FAIL ${msg}`); failures.push(msg); }
}

export function report() {
  if (failures.length) { console.log(`\n${failures.length} failure(s)`); process.exit(1); }
  console.log("\nall checks passed");
}
```

`scripts/e2e/shell.mjs`:

```js
import { assert, launch, open, report, shot } from "./lib.mjs";

const browser = await launch();
for (const [at, regime] of [["14:00", "day"], ["01:00", "night"]]) {
  const { page, ctx, errors } = await open(browser, "/", { at });
  assert((await page.getAttribute("html", "data-regime")) === regime, `?at=${at} is ${regime}`);
  const font = await page.evaluate(() => getComputedStyle(document.querySelector("h1")).fontFamily);
  assert(/ysabeau/i.test(font), `h1 in Ysabeau Office (${font})`);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert(regime === "day" ? bg === "rgb(233, 232, 228)" : bg === "rgb(23, 25, 28)", `ground is the ${regime} paper (${bg})`);
  assert(await page.locator("a.skip").count() === 1, "skip link present");
  assert(errors.length === 0, `no console errors (${errors.join(" | ")})`);
  await shot(page, `shell-390-${regime}`);
  await ctx.close();
}
await browser.close();
report();
```

Run: `npm run build && (npm start &) && sleep 5 && node scripts/e2e/shell.mjs`
Expected: FAIL.

- [ ] **Step 2: Write `app/globals.css`**

```css
@import "tailwindcss";

@theme inline {
  --font-display: var(--font-ysabeau), "Gill Sans", "Trebuchet MS", sans-serif;
  --font-text: var(--font-hedvig), Georgia, serif;
}

:root {
  --paper: #e9e8e4;
  --ink: #1f1c1a;
  --ink-2: #5a5650;
  --pen: #8e4b2a;
  --lamp: #e7a64f;
  --hair: #b9b6af;
  --line-w: 1.25px;
  --gutter: clamp(20px, 5.5vw, 80px);
  --ease-pen: cubic-bezier(0.3, 0, 0.18, 1);
  --glow: 0;
}
@media (min-width: 64rem) { :root { --line-w: 1.5px; } }

html[data-regime="night"] {
  --paper: #17191c;
  --ink: #dad6ce;
  --ink-2: #9c978f;
  --pen: #d08a5c;
  --hair: #3a3c40;
  --glow: 1;
}

html { background: var(--paper); color: var(--ink); -webkit-text-size-adjust: 100%; }
body { margin: 0; min-height: 100svh; background: var(--paper); font-family: var(--font-text); font-size: 1.0625rem; line-height: 1.6; -webkit-font-smoothing: antialiased; font-synthesis: none; }
::selection { background: var(--pen); color: var(--paper); }
:focus-visible { outline: 2px solid var(--pen); outline-offset: 3px; }

.skip { position: absolute; left: var(--gutter); top: -200px; z-index: 100; background: var(--ink); color: var(--paper); padding: 10px 14px; }
.skip:focus { top: 12px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.wrap { padding-inline: var(--gutter); }

/* Type: the line and the page. Tracking tightens as size grows. */
.t-display { font-family: var(--font-display); font-weight: 320; font-size: clamp(2.6rem, 11vw, 6.5rem); line-height: 0.95; letter-spacing: -0.02em; text-wrap: balance; margin: 0; }
.t-head { font-family: var(--font-display); font-weight: 340; font-size: clamp(1.9rem, 7vw, 3.6rem); line-height: 1; letter-spacing: -0.015em; text-wrap: balance; margin: 0; }
.t-line { font-family: var(--font-text); font-size: clamp(1.15rem, 1rem + 0.8vw, 1.5rem); line-height: 1.35; max-width: 32ch; text-wrap: pretty; margin: 0; }
.t-body { font-family: var(--font-text); font-size: 1.0625rem; line-height: 1.6; max-width: 62ch; text-wrap: pretty; margin: 0; }
.t-label { font-family: var(--font-display); font-weight: 480; font-size: 0.875rem; line-height: 1.3; letter-spacing: 0.005em; color: var(--ink-2); margin: 0; }
.t-quote { font-family: var(--font-display); font-style: italic; font-weight: 320; font-size: clamp(1.4rem, 1rem + 2vw, 2.2rem); line-height: 1.2; max-width: 24ch; text-wrap: balance; margin: 0; }
.num { font-variant-numeric: tabular-nums; }

.pen-link { color: var(--ink); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 6px; text-decoration-color: var(--hair); transition: text-decoration-color 300ms var(--ease-pen); }
.pen-link:hover { text-decoration-color: var(--pen); }
.btn { display: inline-flex; align-items: center; min-height: 44px; padding: 0 18px; border: 1px solid var(--ink); color: var(--ink); background: transparent; font-family: var(--font-display); font-weight: 500; text-decoration: none; border-radius: 22px; }
.btn-primary { background: var(--ink); color: var(--paper); }

/* Drawings: one weight everywhere. */
.drawing { display: block; width: 100%; height: auto; overflow: visible; }
.drawing path { fill: none; stroke: var(--ink); stroke-width: var(--line-w); stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.drawing .layer-lamp path { stroke: var(--ink); }
html[data-motion="on"] .drawing[data-pending] .ln { visibility: hidden; animation: pen-fallback 0s 2.5s forwards; }
@keyframes pen-fallback { to { visibility: visible; } }
.drawing .glow { opacity: calc(var(--glow) * 0.9); transition: opacity 600ms var(--ease-pen); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 150ms !important; }
}
```

- [ ] **Step 3: Port the light**

`components/light/LightScript.tsx` (option one's curve; the arrival view transition is removed; it also sets `data-motion`, which the server markup never sets, so without JavaScript no drawing is ever hidden):

```tsx
/**
 * Runs inline in <head> before first paint: the regime for the visitor's hour (or ?at=HH:MM),
 * the clock position, whether the house is open, and whether motion is allowed.
 * KEEP IN SYNC with lib/daylight.ts (same piecewise curve).
 */
const script = `(function(){try{var D=new Date(),h=D.getHours()+D.getMinutes()/60;var q=/[?&]at=(\\d{1,2})(?::(\\d{2}))?/.exec(location.search);if(q){var qh=+q[1],qm=q[2]?+q[2]:0;if(qh<24&&qm<60)h=qh+qm/60}if(h<3)h+=24;function s(a,b,p,r){return p+(r-p)*((h-a)/(b-a))}var d=h<5.5?0:h<6.5?s(5.5,6.5,0,.5):h<11?s(6.5,11,.5,1):h<15?s(11,15,1,.9):h<18.75?s(15,18.75,.9,.5):h<19.5?s(18.75,19.5,.5,.25):h<25?s(19.5,25,.25,.05):h<27?s(25,27,.05,0):0;var e=document.documentElement,t=Math.min(1,Math.max(0,(h-11)/16));e.style.setProperty('--daylight',d.toFixed(3));e.style.setProperty('--clock-t',t.toFixed(4));e.setAttribute('data-regime',d>=.375?'day':'night');e.setAttribute('data-open',h>=11&&h<27?'1':'0');e.setAttribute('data-motion',matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on')}catch(x){}})();`;

export function LightScript() {
  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />;
}
```

`components/light/LightProvider.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { houseNowHour, isOpenAt, nowHour, parseAt, stateFor, type LightState } from "@/lib/daylight";

interface LightValue { hour: number | null; state: LightState | null; houseOpen: boolean | null; pinned: boolean }
const Ctx = createContext<LightValue | null>(null);

export function LightProvider({ children }: { children: ReactNode }) {
  const [clock, setClock] = useState<number | null>(null);
  const [house, setHouse] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => { setClock(nowHour()); setHouse(houseNowHour()); };
    tick();
    setPinned(parseAt(location.search));
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  const hour = pinned ?? clock;
  const state = useMemo(() => (hour === null ? null : stateFor(hour)), [hour]);
  useEffect(() => {
    if (!state) return;
    const e = document.documentElement;
    e.setAttribute("data-regime", state.regime);
    e.style.setProperty("--clock-t", state.clockT.toFixed(4));
  }, [state]);
  const value = useMemo(() => ({ hour, state, houseOpen: house === null ? null : isOpenAt(house), pinned: pinned !== null }), [hour, state, house, pinned]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLight(): LightValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLight must be used inside <LightProvider>");
  return v;
}
```

`components/light/OpenNow.tsx`:

```tsx
"use client";

import { formatClock } from "@/lib/daylight";
import { useLight } from "./LightProvider";

export function OpenNow({ open, close }: { open: string; close: string }) {
  const { houseOpen, pinned } = useLight();
  const text = houseOpen === null || pinned ? `Open ${formatClock(open)} to ${formatClock(close)}` : houseOpen ? `Open now, until ${formatClock(close)}` : `Opens at ${formatClock(open)}`;
  return <span suppressHydrationWarning>{text}</span>;
}
```

- [ ] **Step 4: Mark and header**

`components/chrome/Mark.tsx`:

```tsx
import { markDrawing } from "@/drawings/mark";

export function Mark({ size = 28, title }: { size?: number; title?: string }) {
  const d = markDrawing();
  return (
    <svg viewBox="0 0 320 320" width={size} height={size} className="drawing" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} style={{ width: size }}>
      {title ? <title>{title}</title> : null}
      {d.strokes.map((s, i) => <path key={i} d={s.d} />)}
    </svg>
  );
}
```

`components/chrome/SiteHeader.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { cafe } from "@/lib/cafe";
import { Mark } from "./Mark";

export const NAV = [
  { href: "/spaces", label: "The rooms" },
  { href: "/host", label: "Host something" },
  { href: "/shoot", label: "Shoot here" },
  { href: "/bowl", label: "Bowl" },
  { href: "/menu", label: "Menu" },
  { href: "/press", label: "Written about" },
  { href: "/visit", label: "Visit" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="site-header wrap">
      <Link href="/" className="site-brand" aria-label={`${cafe.meta.name}, home`}>
        <Mark size={30} />
        <span className="t-label" style={{ color: "var(--ink)" }}>{cafe.meta.name}</span>
      </Link>
      <button type="button" className="site-menu-button t-label" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        {open ? "Close" : "Rooms"}
      </button>
      <nav id={id} className="site-menu" data-open={open ? "" : undefined} aria-label="Site">
        <ul>
          {NAV.map((l) => (
            <li key={l.href}><Link className="t-head" href={l.href} aria-current={pathname === l.href ? "page" : undefined}>{l.label}</Link></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

Append to `app/globals.css`:

```css
.site-header { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; padding-block: 12px; background: color-mix(in oklch, var(--paper) 88%, transparent); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
.site-brand { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; text-decoration: none; color: var(--ink); }
.site-menu-button { min-height: 44px; min-width: 44px; background: none; border: 0; color: var(--ink); text-decoration: underline; text-underline-offset: 6px; cursor: pointer; }
.site-menu { position: fixed; inset: 0; z-index: -1; display: grid; align-items: end; padding: 96px var(--gutter) 48px; background: var(--paper); visibility: hidden; opacity: 0; transition: opacity 400ms var(--ease-pen), visibility 0s 400ms; }
.site-menu[data-open] { visibility: visible; opacity: 1; transition: opacity 400ms var(--ease-pen); }
.site-menu ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.site-menu a { color: var(--ink); text-decoration: none; }
.site-menu a[aria-current="page"] { color: var(--pen); }
```

- [ ] **Step 5: Layout and a temporary page**

`app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import { Hedvig_Letters_Serif, Ysabeau_Office } from "next/font/google";
import { LightProvider } from "@/components/light/LightProvider";
import { LightScript } from "@/components/light/LightScript";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { cafe, siteUrl } from "@/lib/cafe";
import "./globals.css";

const ysabeau = Ysabeau_Office({ subsets: ["latin"], variable: "--font-ysabeau", display: "swap" });
const hedvig = Hedvig_Letters_Serif({ subsets: ["latin"], variable: "--font-hedvig", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${cafe.meta.name}, Chandkheda, Ahmedabad`, template: `%s | ${cafe.meta.name}` },
  description: `The house, drawn in one line: a ${cafe.meta.sizeSqFt.toLocaleString("en-IN")} sq ft loft house in ${cafe.meta.address.area}, Ahmedabad. Eat, host, shoot or bowl there.`,
};

export const viewport: Viewport = { themeColor: "#e9e8e4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ysabeau.variable} ${hedvig.variable}`} data-regime="day" suppressHydrationWarning>
      <head><LightScript /></head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <LightProvider>
          <SiteHeader />
          <main id="main">{children}</main>
        </LightProvider>
      </body>
    </html>
  );
}
```

`app/page.tsx` (Task 7 replaces it):

```tsx
export default function Home() {
  return (
    <section className="wrap" style={{ paddingBlock: "20svh" }}>
      <h1 className="t-display">Stay a little longer.</h1>
    </section>
  );
}
```

- [ ] **Step 6: Run and commit**

Run: `npm run build && (npm start &) && sleep 5 && node scripts/e2e/shell.mjs`
Expected: `all checks passed`. Read both screenshots: the day paper is a neutral grey, never cream; night is cool steel.

```bash
git add app components scripts/e2e
git commit -m "feat: drafting-film palette, Ysabeau and Hedvig type, clock light and the shell"
```

---

### Task 6: The `<Drawing>` component and the motion kit

**Files:**
- Create: `lib/motion/gsap.ts`, `components/draw/Drawing.tsx`, `app/lab/[id]/page.tsx` (development only)
- Test: `scripts/e2e/draw.mjs`

**Interfaces:**
- Consumes: `Drawing`, `LAYER_ORDER` (Task 2); `drawingFor`, `DRAWINGS` (Task 3); the `data-pending` CSS rule and `data-motion` attribute (Task 5).
- Produces:
  - `interface GsapKit { gsap; ScrollTrigger; DrawSVGPlugin; MorphSVGPlugin; MotionPathPlugin }`, `loadGsap(): Promise<GsapKit>` (dynamic import, registered once, CustomEase `pen` = `"M0,0 C0.18,0 0.26,0.62 0.5,0.8 0.74,0.96 0.84,1 1,1"`, `gsap.defaults({ ease: "pen" })`) and `motionAllowed(): boolean`.
  - `<Drawing drawing mode? title? className? onDrawn? />`, `mode: "static" | "draw" | "scrub"` (default `static`). Renders `<svg class="drawing" viewBox role="img" aria-labelledby>` with a `<title>`, glows (radial gradients, class `glow`) behind one `<g class="layer-<name>">` per layer, each stroke a `<path class="ln">` keeping its `id`.
    - `draw`: strokes are hidden (`data-pending`) until GSAP is ready, then draw once in layer order (structure first; stagger budget 1.6 s). When done, dash properties are cleared, `data-drawn` is set and `onDrawn` fires.
    - `scrub`: the same timeline tied to scroll (`top 85%` to `center 55%`, scrub 0.6); `data-drawn` is set when progress first reaches 1.
    - Reduced motion (`data-motion="off"`) or `static`: complete at rest, GSAP never loads. If GSAP has not started within 2.5 s, CSS shows the strokes anyway.
  - `/lab/<id>?mode=draw|scrub|static` shows one drawing in development and returns 404 in production.

- [ ] **Step 1: Write the failing check `scripts/e2e/draw.mjs`**

```js
// Run against the dev server: node scripts/e2e/draw.mjs  (BASE defaults to http://localhost:3021 here)
import { chromium } from "playwright";
import { assert, report } from "./lib.mjs";

const BASE = process.env.BASE || "http://localhost:3021";
const browser = await chromium.launch();

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
const page = await ctx.newPage();
await page.goto(`${BASE}/lab/mark?mode=draw`, { waitUntil: "networkidle" });
const count = await page.locator("svg.drawing path.ln").count();
assert(count >= 30, `mark renders its strokes (${count})`);
const drawn = await page.waitForSelector("svg.drawing[data-drawn]", { timeout: 6000 }).then(() => true, () => false);
assert(drawn, "draw mode finishes and marks the drawing as drawn");
const dashes = await page.locator("svg.drawing path.ln").evaluateAll((els) => els.map((e) => getComputedStyle(e).strokeDasharray));
assert(dashes.every((d) => d === "none"), "after drawing, every stroke is plain and complete");
await ctx.close();

const rctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const rpage = await rctx.newPage();
await rpage.goto(`${BASE}/lab/mark?mode=draw`, { waitUntil: "networkidle" });
const visible = await rpage.locator("svg.drawing path.ln").first().evaluate((e) => getComputedStyle(e).visibility);
assert(visible === "visible", "reduced motion: strokes visible at once");
const loadedGsap = await rpage.evaluate(() => performance.getEntriesByType("resource").some((r) => /gsap/i.test(r.name)));
assert(!loadedGsap, "reduced motion: GSAP is never loaded");
await rctx.close();

await browser.close();
report();
```

Run `npm run dev` in a second terminal (port 3021), then: `node scripts/e2e/draw.mjs`
Expected: FAIL (`/lab/mark` is a 404, so the stroke count is 0).

- [ ] **Step 2: Install GSAP and write `lib/motion/gsap.ts`**

```bash
npm install -E gsap@3.15.0 @gsap/react@2.1.2
```

```ts
"use client";

export interface GsapKit {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  DrawSVGPlugin: typeof import("gsap/DrawSVGPlugin").DrawSVGPlugin;
  MorphSVGPlugin: typeof import("gsap/MorphSVGPlugin").MorphSVGPlugin;
  MotionPathPlugin: typeof import("gsap/MotionPathPlugin").MotionPathPlugin;
}

let kit: Promise<GsapKit> | null = null;

/** GSAP and its plugins (all free and bundled in the gsap package since 3.13), loaded after first paint, once. */
export function loadGsap(): Promise<GsapKit> {
  kit ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/DrawSVGPlugin"),
    import("gsap/MorphSVGPlugin"),
    import("gsap/MotionPathPlugin"),
    import("gsap/CustomEase"),
  ]).then(([g, st, draw, morph, motion, ce]) => {
    g.gsap.registerPlugin(st.ScrollTrigger, draw.DrawSVGPlugin, morph.MorphSVGPlugin, motion.MotionPathPlugin, ce.CustomEase);
    ce.CustomEase.create("pen", "M0,0 C0.18,0 0.26,0.62 0.5,0.8 0.74,0.96 0.84,1 1,1");
    g.gsap.defaults({ ease: "pen" });
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger, DrawSVGPlugin: draw.DrawSVGPlugin, MorphSVGPlugin: morph.MorphSVGPlugin, MotionPathPlugin: motion.MotionPathPlugin };
  });
  return kit;
}

/** False under reduced motion (read from the attribute the pre-paint script sets, with the media query as fallback). */
export function motionAllowed(): boolean {
  if (typeof window === "undefined") return false;
  const attr = document.documentElement.getAttribute("data-motion");
  if (attr) return attr === "on";
  return !matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 3: Write `components/draw/Drawing.tsx`**

```tsx
"use client";

import { useEffect, useId, useRef } from "react";
import { LAYER_ORDER, type Drawing as DrawingData } from "@/lib/draw/types";
import { loadGsap, motionAllowed } from "@/lib/motion/gsap";

export type DrawMode = "static" | "draw" | "scrub";

interface Props { drawing: DrawingData; mode?: DrawMode; title?: string; className?: string; onDrawn?: () => void }

export function Drawing({ drawing, mode = "static", title, className, onDrawn }: Props) {
  const root = useRef<SVGSVGElement>(null);
  const done = useRef(onDrawn);
  done.current = onDrawn;
  const titleId = useId();

  useEffect(() => {
    const svg = root.current;
    if (!svg || mode === "static") return;
    if (!motionAllowed()) { svg.removeAttribute("data-pending"); return; }
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const layers = LAYER_ORDER.map((l) => Array.from(svg.querySelectorAll<SVGPathElement>(`.layer-${l} path.ln`))).filter((a) => a.length);
      const all = layers.flat();
      const each = Math.min(0.035, 1.6 / Math.max(1, all.length));
      gsap.set(all, { drawSVG: "0%" });
      svg.removeAttribute("data-pending");
      const finish = () => { svg.setAttribute("data-drawn", ""); done.current?.(); };
      const tl = gsap.timeline({
        paused: mode === "scrub",
        onComplete: mode === "draw" ? () => { gsap.set(all, { clearProps: "strokeDasharray,strokeDashoffset" }); finish(); } : undefined,
      });
      layers.forEach((paths, i) => {
        tl.to(paths, { drawSVG: "100%", duration: i === 0 ? 1.1 : 0.8, stagger: { each, from: "start" } }, i === 0 ? 0 : ">-0.45");
      });
      if (mode === "scrub") {
        let reached = false;
        const st = ScrollTrigger.create({
          trigger: svg, start: "top 85%", end: "center 55%", scrub: 0.6, animation: tl,
          onUpdate: (self) => { if (!reached && self.progress > 0.999) { reached = true; finish(); } },
        });
        cleanup = () => { st.kill(); tl.kill(); };
      } else {
        cleanup = () => tl.kill();
      }
    });
    return () => { cancelled = true; cleanup?.(); };
  }, [mode, drawing.id]);

  return (
    <svg
      ref={root}
      className={`drawing${className ? ` ${className}` : ""}`}
      viewBox={`${drawing.x ?? 0} ${drawing.y ?? 0} ${drawing.width} ${drawing.height}`}
      role="img"
      aria-labelledby={titleId}
      data-pending={mode === "static" ? undefined : ""}
    >
      <title id={titleId}>{title ?? drawing.title}</title>
      {drawing.glows?.length ? (
        <g aria-hidden="true">
          <defs>
            <radialGradient id={`${titleId}-glow`}>
              <stop offset="0" stopColor="var(--lamp)" stopOpacity="0.55" />
              <stop offset="1" stopColor="var(--lamp)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {drawing.glows.map((g, i) => <circle key={i} className="glow" cx={g.x} cy={g.y} r={g.r} fill={`url(#${titleId}-glow)`} />)}
        </g>
      ) : null}
      {LAYER_ORDER.map((layer) => {
        const strokes = drawing.strokes.filter((s) => s.layer === layer);
        return strokes.length ? (
          <g key={layer} className={`layer-${layer}`}>
            {strokes.map((s, i) => <path key={i} className="ln" d={s.d} id={s.id} />)}
          </g>
        ) : null;
      })}
    </svg>
  );
}
```

Note: `useId` returns ids containing colons; `url(#…)` accepts them in Chromium, Firefox and Safari. DrawSVG measures a path through its screen transform when `vector-effect: non-scaling-stroke` is set, so never animate a drawing's size while it draws (see `docs/research/spikes/drawn-stack.md`, section 2).

- [ ] **Step 4: Write the lab route `app/lab/[id]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { Drawing, type DrawMode } from "@/components/draw/Drawing";
import { DRAWINGS, drawingFor } from "@/drawings";

export default async function Lab({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ mode?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { id } = await params;
  const { mode } = await searchParams;
  if (!DRAWINGS[id]) notFound();
  const m: DrawMode = mode === "draw" || mode === "scrub" ? mode : "static";
  return (
    <div className="wrap" style={{ paddingBlock: mode === "scrub" ? "90svh" : "8svh", maxWidth: 720 }}>
      <Drawing drawing={drawingFor(id)} mode={m} />
    </div>
  );
}
```

- [ ] **Step 5: Run the check, look, commit**

Run (dev server on 3021): `node scripts/e2e/draw.mjs`
Expected: `all checks passed`.
With Playwright MCP at 390x844, open `http://localhost:3021/lab/mark?mode=draw` and take screenshots at about 300 ms, 1 s and 3 s. Read them: the arch draws first, then the dividers and details, then the steam and plant; the finished mark matches `assets/brand/logo barnyard.jpg`. Open `?mode=scrub` and scroll: the mark draws with the scroll and undraws when scrolling back.

```bash
git add lib/motion components/draw app/lab scripts/e2e/draw.mjs package.json package-lock.json
git commit -m "feat: Drawing component with draw and scrub modes, motion kit with the pen ease"
```

---

## Cross-task reconciliation (read before Task 7)

Tasks 7 to 23 were written in parallel against a shared contract. Where a writer had to go beyond it, these rules settle the result; they override anything a single task says.

1. **The repo is not at the plan's starting state.** On 15 Sep 2026 a demo cut was built directly on `main` under a deadline (commits after `b30b883`). It covers parts of Tasks 1, 2, 3, 5, 6, 14, 16, 17 and 19 with its own file names. Before Task 1, read `git log` and the demo code. Create a branch `plan/full`, then execute the plan task by task: replace demo modules with the plan's names and code, and keep demo pieces only where they already pass the task's checks. Delete demo files a task supersedes in that task's commit.
2. **Sheet is two files.** Task 14 makes `components/draw/Sheet.tsx` a server component and puts the interactive half in `components/draw/SheetLift.tsx`; `Sheet` accepts optional `children`. Tasks 17, 18, 20 and 21 use `<Sheet>` as the contract describes; their selectors `figure.sheet` and `.sheet-toggle` come from Task 14.
3. **House is two files.** Task 16 makes `components/house/House.tsx` a server component and puts the svg and pane links in `components/house/HouseCanvas.tsx`. Task 19's `flyToRoom` edit to the pane links goes into `HouseCanvas.tsx`, not `House.tsx`.
4. **Games is provisional in two places.** After Task 11, set Task 16's `VIGNETTES.games` crop and Task 18's three games annotation points onto the objects in `drawings/games.ts`. Task 15's check requires `roll.path` to start at the centre of `cue-ball` and `alley-sign` to have at least four `bulb-*` strokes.
5. **Footer sentence.** Task 17's footer line becomes: "The room drawings are made from the café's own photographs; each photograph is credited where it appears." The mark and the games still life are not drawn from photographs.
6. **Configuration edits accumulate.** Task 20 adds `esbuild: { jsx: "automatic" }` to `vitest.config.ts`; Task 23 sends the dev build to `.next-dev` and updates `tsconfig.json`, `eslint.config.mjs` and `.gitignore`. Keep every earlier edit when a later task touches the same file.
7. **Layout.** Task 22 gives the whole `app/layout.tsx`; keep Task 19's `PenLineProvider` placement and Task 17's footer if they differ from it.
8. **Transitions without GSAP.** Task 19's pen line and pane flight use the Web Animations API with the pen curve, so navigation never waits for GSAP.
9. **Demo additions worth keeping.** The demo's home-page "Drawing · Both · Photograph" toggle and the drag-to-wipe comparison were asked for by the studio lead after the spec was written. Carry them into Task 17 (toggle on the house, using Task 14's photos) and Task 21 (wipe on the visit facade), with the same accessibility rules as the Sheet toggle.

---

### Task 7: The facade drawing

The corten sign as the café's own reel shows it from the street: the concrete slab against the sky, the corten plate seen from below and to the right (its top edge falls more steeply than its bottom edge), the lit mark and the lettering THE BARNYARD CO on the plate, creepers cascading over the slab, and two Edison bulbs on a string-light wire. Spec section 4.7 and the facade row of section 5. It shows on `/`, `/spaces` and `/visit`.

Every constant below was measured in the 1080 x 1920 frame of `stills/sign-corten.jpg` when this plan was written. The plate edges and the lettering came from colour masks of the photo (corten, sky, lit yellow). The logo's placement is a least-squares fit of `lib/mark.ts` onto the lit strokes. Everything was checked in an overlay and in a 390 px render. You confirm the constants against the overlay and nudge them. You never add strokes the photo does not show.

Notes on measurement (these supersede the rough observation list):
- The plate's top-left corner is at (139, 600), not (145, 455). The top edge falls at a slope of about -0.73, while the bottom edge falls at -0.39; the point near (145, 455) lies on the concrete slab above the plate.
- `lib/mark.ts` has a squatter arch than the sign's own logo. The fit is therefore weighted to the arch: under 1 unit on the arch, about 4 units on the dividers and the house.
- After the fit, the mark's sun rays are 7.5 to 10 units long and its drops are 3 units. They are the logo's own geometry, so they are exempt from the 12-unit minimum, like bulbs and drops.
- The lettering is drawn as 13 single-line capitals in the lamp layer, because the manifest title and spec section 5 name the lettering. Each letter gets its own affine, so it follows the plate's perspective (the verticals converge upwards and the letters grow to the right).
- No guided contours are used.

**Files:**
- Create: `drawings/facade.ts`
- Modify: `drawings/index.ts` (import `facadeDrawing` and register `facade: facadeDrawing`)
- Test: `tests/drawing-facade.test.ts`

**Interfaces:**
- Consumes: `leaf`, `vine` (`lib/draw/glyphs.ts`); `circle`, `curve`, `line`, `n`, `polyline` (`lib/draw/primitives.ts`); `Drawing`, `Glow`, `P`, `Stroke` (`lib/draw/types.ts`); `frameOf`, `metaFor` (`lib/drawings.ts`); `ARCH_PATH`, `DIVIDER_PATHS`, `DROPS`, `HOUSE_PATHS`, `PLANT_PATHS`, `STEAM_PATHS`, `SUN_CENTER`, `SUN_RADIUS`, `SUN_RAYS`, `WINDOW_PATHS` (`lib/mark.ts`); `DRAWINGS`, `drawingFor` (`drawings/index.ts`); `scripts/guides/build.mjs`, `scripts/guides/grid.mjs`, `scripts/review.ts`; the `facade` entry in `content/drawings.json` (crop `[0, 0, 1080, 1000]`, budget 260, lift true).
- Produces:
  - `facadeDrawing(): Drawing`: id `facade`, frame `x 0, y 0, width 1080, height 1000`, 222 strokes (structure 4, detail 3, life 169, lamp 46).
    - Lamp-layer ids `bulb-0` and `bulb-1`, in reading order, left to right.
    - Life-layer ids `leaf-0` to `leaf-11`, with `morphs["leaf-n"] = [leaf(base, length, angle + 7).d]`.
    - `glows`: three entries, one on each bulb (r 56) and one on the logo (r 140).
    - No other ids. Architecture has none.
  - `type Affine = [number, number, number, number, number, number]` (SVG matrix order: x' = a·x + c·y + e, y' = b·x + d·y + f).
  - `applyAffine(m: Affine, p: P): P`.
  - `affineFrom(src: [P, P, P], dst: [P, P, P]): Affine`.
  - `transformMark(paths: string[], m: Affine): string[]` and `transformMark(points: P[], m: Affine): P[]`. It accepts absolute `M L C A Z` paths; arcs (circular or axis-aligned elliptical) become cubics, so a shear stays exact.
  - `DRAWINGS.facade`.

- [ ] **Step 1: Write the failing test**

`tests/drawing-facade.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { affineFrom, applyAffine, facadeDrawing, transformMark, type Affine } from "@/drawings/facade";
import type { P } from "@/lib/draw/types";
import { frameOf } from "@/lib/drawings";

const IDENTITY: Affine = [1, 0, 0, 1, 0, 0];
const ends = (d: string) => [...d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])] as P);
const straightLength = (d: string) => {
  const p = ends(d);
  return p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
};

describe("transformMark", () => {
  it("leaves straight paths unchanged under the identity", () => {
    expect(transformMark(["M0 0L10 0L10 5Z"], IDENTITY)).toEqual(["M0 0L10 0L10 5Z"]);
  });
  it("moves bare points", () => {
    expect(transformMark([[1, 2]] as P[], [2, 0, 0, 2, 10, 20])).toEqual([[12, 24]]);
  });
  it("turns an arc into cubics that end where the arc ends, even under a shear", () => {
    const [d] = transformMark(["M0 0A10 10 0 0 1 20 0"], [1, 0, 0.5, 1, 5, 5]);
    expect(d.startsWith("M5 5C")).toBe(true);
    expect(d.endsWith("25 5")).toBe(true);
    expect(d).not.toMatch(/A/);
  });
  it("keeps a sheared circle closed", () => {
    const [d] = transformMark(["M30 20A10 10 0 1 1 10 20A10 10 0 1 1 30 20"], [0.8, -0.4, -0.3, 1.3, 200, 500]);
    const nums = (d.match(/-?[\d.]+/g) ?? []).map(Number);
    expect(nums.slice(-2)).toEqual(nums.slice(0, 2));
  });
});

describe("affineFrom", () => {
  it("carries three points exactly", () => {
    const src: [P, P, P] = [[55, 265], [265, 265], [160, 55]];
    const dst: [P, P, P] = [[199, 832], [389, 728], [332, 514]];
    const m = affineFrom(src, dst);
    src.forEach((p, i) => {
      const q = applyAffine(m, p);
      expect(q[0]).toBeCloseTo(dst[i][0], 6);
      expect(q[1]).toBeCloseTo(dst[i][1], 6);
    });
  });
});

describe("facade drawing", () => {
  const d = facadeDrawing();

  it("uses the crop as its frame", () => {
    expect({ x: d.x, y: d.y, width: d.width, height: d.height }).toEqual(frameOf("facade"));
  });
  it("hangs two bulbs in the lamp layer, in reading order", () => {
    const bulbs = d.strokes.filter((s) => s.id?.startsWith("bulb-"));
    expect(bulbs.map((s) => s.id)).toEqual(["bulb-0", "bulb-1"]);
    expect(bulbs.every((s) => s.layer === "lamp")).toBe(true);
  });
  it("lights the mark and the lettering: 31 mark paths and 13 letters in the lamp layer, arcs carried as cubics", () => {
    const lit = d.strokes.filter((s) => s.layer === "lamp" && !s.id);
    expect(lit).toHaveLength(44);
    for (const s of lit) expect(s.d).not.toMatch(/A/);
  });
  it("sways at most twelve leaves, each with one alternate", () => {
    const leaves = d.strokes.filter((s) => s.id?.startsWith("leaf-"));
    expect(leaves.length).toBeGreaterThan(0);
    expect(leaves.length).toBeLessThanOrEqual(12);
    for (const l of leaves) {
      expect(l.layer).toBe("life");
      expect(d.morphs?.[l.id!]).toHaveLength(1);
    }
  });
  it("glows on both bulbs and on the logo, 40 to 140 units", () => {
    expect(d.glows).toHaveLength(3);
    for (const g of d.glows ?? []) {
      expect(g.r).toBeGreaterThanOrEqual(40);
      expect(g.r).toBeLessThanOrEqual(140);
    }
  });
  it("keeps architecture still: no ids outside the bulbs and the swaying leaves", () => {
    for (const s of d.strokes) if (s.id) expect(s.id).toMatch(/^(bulb|leaf)-\d+$/);
    expect(d.strokes.filter((s) => s.layer === "structure" && s.id)).toHaveLength(0);
  });
  it("keeps every line end inside the frame and no straight stroke under 12 units (the lit mark keeps its own short rays)", () => {
    for (const s of d.strokes) {
      for (const [x, y] of ends(s.d)) {
        expect(x).toBeGreaterThanOrEqual(-1);
        expect(x).toBeLessThanOrEqual(1081);
        expect(y).toBeGreaterThanOrEqual(-1);
        expect(y).toBeLessThanOrEqual(1001);
      }
      if (s.layer !== "lamp" && /^[MLZ\d\s.-]+$/.test(s.d)) expect(straightLength(s.d)).toBeGreaterThanOrEqual(12);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- drawing-facade`
Expected: FAIL. `tests/drawing-facade.test.ts` cannot resolve the import `@/drawings/facade`, so no tests run.

- [ ] **Step 3: Implement**

3a. Build the guide and the measuring grid, then read the grid.

```bash
node scripts/guides/build.mjs facade && node scripts/guides/grid.mjs facade
```

Expected: `guides/facade: photo.jpg, guide-rooms.svg, guide-close.svg`, then `guides/facade/grid.png`.

Read `guides/facade/grid.png` and confirm these anchors before writing the module:
- The plate's top-left corner is near (139, 600) and its top edge reaches the creepers near (545, 302).
- The lit arch's left foot is near (199, 832), its right foot near (389, 728), and the top of its head near (332, 514).
- The foot of the T is near (104, 976).
- The wire leaves the left edge at (0, 336).
- The two bulbs hang from sockets near (48, 379) and (139, 477).
- The concrete slab's apex is near (692, 42).

3b. Write `drawings/facade.ts`:

```ts
import { leaf, vine } from "@/lib/draw/glyphs";
import { circle, curve, line, n, polyline } from "@/lib/draw/primitives";
import type { Drawing, Glow, P, Stroke } from "@/lib/draw/types";
import { frameOf, metaFor } from "@/lib/drawings";
import { ARCH_PATH, DIVIDER_PATHS, DROPS, HOUSE_PATHS, PLANT_PATHS, STEAM_PATHS, SUN_CENTER, SUN_RADIUS, SUN_RAYS, WINDOW_PATHS } from "@/lib/mark";

/*
 * The facade, drawn from stills/sign-corten.jpg (measured in its 1080 x 1920 frame; the drawing is the crop 0 0 1080 1000).
 * We stand below and to the right of the corten plate and look up, so its top edge falls more steeply than its
 * bottom edge and the lettering grows towards the creepers. The plate's right end runs under the creepers and is
 * not drawn; the Instagram caption below y 1000 is outside the frame.
 */

// ---------- structure: the concrete slab and the corten plate ----------
const SLAB_TOP_LEFT: P = [147, 497];
const SLAB_APEX: P = [692, 42]; // the slab's right arris is hidden by the creepers from here down
const SLAB_LEFT_AT_PLATE: P = [131, 590]; // the slab's left edge meets the plate's corner here
const PLATE_LEFT_FOOT: P = [77, 1000]; // the plate's left edge leaves the frame
const PLATE_TOP_LEFT: P = [139, 600];
const PLATE_TOP_UNDER_CREEPERS: P = [545, 302];
const PLATE_BOTTOM_FOOT: P = [189, 1000];
const PLATE_BOTTOM_UNDER_CREEPERS: P = [590, 843];
const PLATE_UNDERSIDE: [P, P] = [[326, 1000], [590, 915]]; // the plate stands off the wall; its underside shows

// ---------- detail: the string-light wire ----------
const WIRE: P[] = [[0, 336], [50, 345], [98, 364], [115, 400], [134, 432], [152, 444], [192, 448], [230, 416], [264, 394]];
const DROPS_FROM_WIRE: { knot: P; socket: P; w: number; h: number }[] = [
  { knot: [50, 346], socket: [48, 379], w: 23, h: 45 },
  { knot: [151, 444], socket: [139, 477], w: 20, h: 44 },
];

// ---------- lamp: the lit mark, placed by an affine fitted to the logo's own light ----------
/**
 * Three points of the mark (320 frame: the arch's two feet and the top of its head) and where they land on the plate.
 * Fitted by least squares to the lit strokes, weighted to the arch: under 1 unit on the arch, about 4 on the dividers
 * and the house, where the sign's own proportions differ slightly from lib/mark.ts.
 */
const LOGO_FIT: { mark: [P, P, P]; photo: [P, P, P] } = {
  mark: [[55, 265], [265, 265], [160, 55]],
  photo: [[199, 832], [389, 728], [332, 514]],
};

// ---------- lamp: the lettering, THE BARNYARD CO, in single-line capitals on the plate ----------
const BASELINE_ORIGIN: P = [104, 976]; // the foot of the T
const BASELINE_END: P = [575, 770]; // the feet of the letters, projected on towards the O
/** Each word's extent along the baseline (frame units from BASELINE_ORIGIN) and its cap height square to the baseline at each end. */
const WORDS: { text: string; from: number; to: number; cap: [number, number] }[] = [
  { text: "THE", from: 0, to: 46, cap: [24, 25] },
  { text: "BARNYARD", from: 66, to: 388, cap: [45, 54] },
  { text: "CO", from: 410, to: 498, cap: [50, 52] },
];
/** The plate's verticals lean: x per unit of y at the start and the end of the lettering (they converge upwards). */
const LEAN: [number, number] = [-0.15, -0.02];
const LETTER_GAP = 14;
/** Single-line capitals in a 100-unit cap box: baseline y 0, cap line y -100; straight lines and true arcs only. */
const GLYPHS: Record<string, { w: number; d: string }> = {
  T: { w: 64, d: "M0 -100L64 -100M32 -100L32 0" },
  H: { w: 64, d: "M0 -100L0 0M64 -100L64 0M0 -52L64 -52" },
  E: { w: 54, d: "M54 -100L0 -100L0 0L54 0M0 -52L44 -52" },
  B: { w: 58, d: "M0 0L0 -100L32 -100A24 24 0 0 1 32 -52L0 -52M32 -52A26 26 0 0 1 32 0L0 0" },
  A: { w: 70, d: "M0 0L35 -100L70 0M13 -36L57 -36" },
  R: { w: 60, d: "M0 0L0 -100L32 -100A24 24 0 0 1 32 -52L0 -52M28 -52L60 0" },
  N: { w: 66, d: "M0 0L0 -100L66 0L66 -100" },
  Y: { w: 68, d: "M0 -100L34 -48L68 -100M34 -48L34 0" },
  D: { w: 66, d: "M0 0L0 -100L16 -100A50 50 0 0 1 16 0Z" },
  C: { w: 85, d: "M85.4 -85.4A50 50 0 1 0 85.4 -14.6" },
  O: { w: 100, d: "M100 -50A50 50 0 1 1 0 -50A50 50 0 1 1 100 -50" },
};

// ---------- life: creepers falling over the slab ----------
/** Creepers riding the plate's top edge and the slab's top edge: their stems lie on those edges, so only the leaves add. */
const PLATE_EDGE_VINE: { from: number; to: number } = { from: 0.47, to: 1 }; // fractions along PLATE_TOP_LEFT → PLATE_TOP_UNDER_CREEPERS
const SLAB_EDGE_VINE: { from: number; to: number } = { from: 0.72, to: 0.995 }; // fractions along SLAB_TOP_LEFT → SLAB_APEX
/** The top of the creeper mass, from the apex until it leaves the frame. */
const CANOPY_TOP: P[] = [[692, 44], [760, 50], [822, 44], [872, 22], [902, 4]];
/** Hanging strands, measured where they end in the photo (some stop short over the dark gap near x 780). */
const STRANDS: { path: P[]; leaves: number }[] = [
  { path: [[512, 330], [506, 480], [500, 640], [492, 800], [488, 930]], leaves: 9 },
  { path: [[548, 300], [552, 520], [544, 760], [536, 972]], leaves: 11 },
  { path: [[596, 160], [600, 420], [593, 700], [588, 972]], leaves: 12 },
  { path: [[640, 110], [646, 330], [641, 560], [634, 800]], leaves: 9 },
  { path: [[684, 52], [690, 300], [696, 620], [700, 972]], leaves: 13 },
  { path: [[742, 50], [747, 270], [750, 500], [748, 760]], leaves: 9 },
  { path: [[792, 48], [796, 240], [798, 430], [793, 620]], leaves: 7 },
  { path: [[852, 34], [858, 300], [864, 640], [866, 972]], leaves: 13 },
  { path: [[912, 6], [916, 260], [921, 540], [924, 840]], leaves: 11 },
  { path: [[968, 6], [972, 300], [978, 640], [982, 972]], leaves: 13 },
  { path: [[1036, 6], [1040, 280], [1046, 600], [1050, 972]], leaves: 13 },
];
const HEDGE: P[] = [[34, 640], [44, 760], [36, 880], [48, 975]];
const VINE_LEAF = 22;
/** Leaves that sway (at most 12): the free ends of the strands, where the air moves them. */
const SWAYING: { base: P; length: number; angle: number }[] = [
  { base: [488, 930], length: 24, angle: 100 },
  { base: [536, 972], length: 22, angle: 76 },
  { base: [588, 972], length: 22, angle: 104 },
  { base: [634, 800], length: 24, angle: 80 },
  { base: [700, 972], length: 22, angle: 102 },
  { base: [748, 760], length: 24, angle: 78 },
  { base: [793, 620], length: 24, angle: 98 },
  { base: [866, 972], length: 22, angle: 76 },
  { base: [924, 840], length: 24, angle: 104 },
  { base: [982, 972], length: 22, angle: 80 },
  { base: [1050, 972], length: 22, angle: 100 },
  { base: [48, 975], length: 20, angle: 70 },
];

// ---------- glows (night only) ----------
const LOGO_GLOW_RADIUS = 140;
const BULB_GLOW_RADIUS = 56;

/** An affine map in SVG matrix order [a, b, c, d, e, f]: x' = a·x + c·y + e, y' = b·x + d·y + f. */
export type Affine = [number, number, number, number, number, number];

export function applyAffine(m: Affine, [x, y]: P): P {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

/** The affine that carries three source points exactly onto three target points. */
export function affineFrom(src: [P, P, P], dst: [P, P, P]): Affine {
  const [[x0, y0], [x1, y1], [x2, y2]] = src;
  const det = x0 * (y1 - y2) - y0 * (x1 - x2) + (x1 * y2 - x2 * y1);
  if (Math.abs(det) < 1e-9) throw new Error("affineFrom: source points are collinear");
  const solve = (t0: number, t1: number, t2: number): [number, number, number] => [
    (t0 * (y1 - y2) - y0 * (t1 - t2) + (t1 * y2 - t2 * y1)) / det,
    (x0 * (t1 - t2) - t0 * (x1 - x2) + (x1 * t2 - x2 * t1)) / det,
    (x0 * (y1 * t2 - y2 * t1) - y0 * (x1 * t2 - x2 * t1) + t0 * (x1 * y2 - x2 * y1)) / det,
  ];
  const [a, c, e] = solve(dst[0][0], dst[1][0], dst[2][0]);
  const [b, d, f] = solve(dst[0][1], dst[1][1], dst[2][1]);
  return [a, b, c, d, e, f];
}

const pt = ([x, y]: P) => `${n(x)} ${n(y)}`;
const lerpP = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** A circular or axis-aligned elliptical arc as cubic Béziers (at most 90° each), so it survives a shear. */
function arcToCubics(p0: P, rx: number, ry: number, large: boolean, sweep: boolean, p1: P): [P, P, P][] {
  const sy = ry / rx;
  const a: P = [p0[0], p0[1] / sy];
  const b: P = [p1[0], p1[1] / sy];
  const mx = (a[0] - b[0]) / 2, my = (a[1] - b[1]) / 2;
  const d2 = mx * mx + my * my;
  if (d2 === 0) return [];
  const r = Math.max(rx, Math.sqrt(d2));
  const k = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, (r * r - d2) / d2));
  const c: P = [k * my + (a[0] + b[0]) / 2, -k * mx + (a[1] + b[1]) / 2];
  const t1 = Math.atan2(a[1] - c[1], a[0] - c[0]);
  let dt = Math.atan2(b[1] - c[1], b[0] - c[0]) - t1;
  if (sweep && dt <= 0) dt += Math.PI * 2;
  if (!sweep && dt >= 0) dt -= Math.PI * 2;
  const parts = Math.max(1, Math.ceil(Math.abs(dt) / (Math.PI / 2) - 1e-9));
  const step = dt / parts;
  const h = (4 / 3) * Math.tan(step / 4) * r;
  const back = ([x, y]: P): P => [x, y * sy];
  const out: [P, P, P][] = [];
  for (let i = 0; i < parts; i++) {
    const s = t1 + step * i, e = s + step;
    const q0: P = [c[0] + r * Math.cos(s), c[1] + r * Math.sin(s)];
    const q3: P = [c[0] + r * Math.cos(e), c[1] + r * Math.sin(e)];
    out.push([back([q0[0] - h * Math.sin(s), q0[1] + h * Math.cos(s)]), back([q3[0] + h * Math.sin(e), q3[1] - h * Math.cos(e)]), back(q3)]);
  }
  out[out.length - 1][2] = p1;
  return out;
}

function transformPath(d: string, m: Affine): string {
  const tokens = d.match(/[MLCAZ]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? [];
  let i = 0;
  let cmd = "";
  let cur: P = [0, 0];
  let start: P = [0, 0];
  let out = "";
  const num = () => Number(tokens[i++]);
  const at = (p: P) => pt(applyAffine(m, p));
  while (i < tokens.length) {
    if (/^[a-z]$/i.test(tokens[i])) cmd = tokens[i++];
    if (cmd === "M") { cur = [num(), num()]; start = cur; out += `M${at(cur)}`; cmd = "L"; }
    else if (cmd === "L") { cur = [num(), num()]; out += `L${at(cur)}`; }
    else if (cmd === "C") { const c1: P = [num(), num()], c2: P = [num(), num()]; cur = [num(), num()]; out += `C${at(c1)} ${at(c2)} ${at(cur)}`; }
    else if (cmd === "A") {
      const rx = num(), ry = num(), rot = num(), large = num() === 1, sweep = num() === 1;
      const end: P = [num(), num()];
      if (rot !== 0) throw new Error("transformMark: rotated arcs are not supported");
      for (const [c1, c2, p] of arcToCubics(cur, rx, ry, large, sweep, end)) out += `C${at(c1)} ${at(c2)} ${at(p)}`;
      cur = end;
    } else if (cmd === "Z") { out += "Z"; cur = start; }
    else throw new Error(`transformMark: absolute M, L, C, A and Z only (got "${cmd}")`);
  }
  return out;
}

/** Carries the mark's paths (or bare points) through an affine: lines stay lines, arcs become cubics, so a shear is exact. */
export function transformMark(paths: string[], m: Affine): string[];
export function transformMark(points: P[], m: Affine): P[];
export function transformMark(input: string[] | P[], m: Affine): string[] | P[] {
  if (input.length > 0 && typeof input[0] === "string") return (input as string[]).map((d) => transformPath(d, m));
  return (input as P[]).map((p) => applyAffine(m, p));
}

/** An Edison bulb hanging from its socket: straight shoulders and a true arc for the glass. */
function edison(socket: P, w: number, h: number): string {
  const [x, y] = socket;
  const r = w / 2;
  const neck = w * 0.24;
  return `M${pt([x - neck, y])}L${pt([x - r, y + h - r])}A${n(r)} ${n(r)} 0 0 0 ${pt([x + r, y + h - r])}L${pt([x + neck, y])}Z`;
}

function lettering(): Stroke[] {
  const len = Math.hypot(BASELINE_END[0] - BASELINE_ORIGIN[0], BASELINE_END[1] - BASELINE_ORIGIN[1]);
  const u: P = [(BASELINE_END[0] - BASELINE_ORIGIN[0]) / len, (BASELINE_END[1] - BASELINE_ORIGIN[1]) / len];
  const square: P = [-u[1], u[0]]; // square to the baseline, pointing down the plate
  const span = WORDS[WORDS.length - 1].to;
  const out: Stroke[] = [];
  for (const word of WORDS) {
    const glyphs = [...word.text].map((ch) => GLYPHS[ch]);
    const units = glyphs.reduce((s, g) => s + g.w, 0) + LETTER_GAP * (glyphs.length - 1);
    const kx = (word.to - word.from) / units;
    let cursor = 0;
    for (const g of glyphs) {
      const left = word.from + cursor * kx;
      const mid = left + (g.w / 2) * kx;
      const cap = word.cap[0] + (word.cap[1] - word.cap[0]) * ((mid - word.from) / (word.to - word.from));
      const lean = LEAN[0] + (LEAN[1] - LEAN[0]) * (mid / span);
      const vl = Math.hypot(lean, 1);
      const vertical: P = [lean / vl, 1 / vl];
      const tall = cap / (vertical[0] * square[0] + vertical[1] * square[1]);
      const m: Affine = [u[0] * kx, u[1] * kx, (vertical[0] * tall) / 100, (vertical[1] * tall) / 100, BASELINE_ORIGIN[0] + u[0] * left, BASELINE_ORIGIN[1] + u[1] * left];
      out.push({ d: transformMark([g.d], m)[0], layer: "lamp" });
      cursor += g.w + LETTER_GAP;
    }
  }
  return out;
}

export function facadeDrawing(): Drawing {
  const logo = affineFrom(LOGO_FIT.mark, LOGO_FIT.photo);

  const structure: Stroke[] = [
    polyline([SLAB_LEFT_AT_PLATE, SLAB_TOP_LEFT, SLAB_APEX]),
    polyline([PLATE_LEFT_FOOT, PLATE_TOP_LEFT, PLATE_TOP_UNDER_CREEPERS]),
    line(PLATE_BOTTOM_FOOT, PLATE_BOTTOM_UNDER_CREEPERS),
    line(PLATE_UNDERSIDE[0], PLATE_UNDERSIDE[1]),
  ];

  const detail: Stroke[] = [curve(WIRE, "detail"), ...DROPS_FROM_WIRE.map((b) => line(b.knot, b.socket, "detail"))];

  const markPaths = [
    ARCH_PATH,
    ...DIVIDER_PATHS,
    ...WINDOW_PATHS,
    circle([SUN_CENTER.x, SUN_CENTER.y], SUN_RADIUS).d,
    ...SUN_RAYS,
    ...STEAM_PATHS,
    ...PLANT_PATHS,
    ...DROPS.map((p) => circle([p.x, p.y], p.r).d),
    ...HOUSE_PATHS,
  ];
  const lamp: Stroke[] = [
    ...DROPS_FROM_WIRE.map((b, i) => ({ d: edison(b.socket, b.w, b.h), layer: "lamp" as const, id: `bulb-${i}` })),
    ...transformMark(markPaths, logo).map((d) => ({ d, layer: "lamp" as const })),
    ...lettering(),
  ];

  const onEdge = (a: P, b: P, span: { from: number; to: number }): P[] => [span.from, (span.from + span.to) / 2, span.to].map((t) => lerpP(a, b, t));
  const life: Stroke[] = [
    ...vine(onEdge(PLATE_TOP_LEFT, PLATE_TOP_UNDER_CREEPERS, PLATE_EDGE_VINE), 6, 37, VINE_LEAF),
    ...vine(onEdge(SLAB_TOP_LEFT, SLAB_APEX, SLAB_EDGE_VINE), 5, 38, VINE_LEAF),
    ...vine(CANOPY_TOP, 5, 39, VINE_LEAF),
    ...STRANDS.flatMap((s, i) => vine(s.path, s.leaves, 41 + i, VINE_LEAF)),
    ...vine(HEDGE, 6, 60, VINE_LEAF),
  ];
  const morphs: Record<string, string[]> = {};
  SWAYING.forEach((s, i) => {
    life.push({ ...leaf(s.base, s.length, s.angle), id: `leaf-${i}` });
    morphs[`leaf-${i}`] = [leaf(s.base, s.length, s.angle + 7).d];
  });

  const logoCentre = applyAffine(logo, [160, 170]);
  const glows: Glow[] = [
    ...DROPS_FROM_WIRE.map((b) => ({ x: b.socket[0], y: Math.round(b.socket[1] + b.h * 0.6), r: BULB_GLOW_RADIUS })),
    { x: Math.round(logoCentre[0]), y: Math.round(logoCentre[1]), r: LOGO_GLOW_RADIUS },
  ];

  return { id: "facade", title: metaFor("facade").title, ...frameOf("facade"), strokes: [...structure, ...detail, ...life, ...lamp], glows, morphs };
}
```

The strokes are ordered structure, detail, life, then lamp. `<Drawing>` groups them by layer in that same order, so draw-on traces the slab and plate first, then the wire, then the creepers, and lights the bulbs, the mark and the lettering last.

3c. Register the drawing. `drawings/index.ts` becomes:

```ts
import type { Drawing } from "@/lib/draw/types";
import { facadeDrawing } from "./facade";
import { markDrawing } from "./mark";

export const DRAWINGS: Record<string, () => Drawing> = {
  mark: markDrawing,
  facade: facadeDrawing,
};

export function drawingFor(id: string): Drawing {
  const make = DRAWINGS[id];
  if (!make) throw new Error(`No drawing module for "${id}"`);
  return make();
}
```

If other drawing tasks have already added entries, keep them and add only the `facadeDrawing` import line and the `facade: facadeDrawing,` entry.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- drawing-facade`
Expected: PASS, 12 tests (transformMark 4, affineFrom 1, facade drawing 7).

Run: `npm test -- drawings`
Expected: PASS, including `facade is valid and within budget`.

Run: `npx tsx scripts/review.ts facade`
Expected: `facade: 222 strokes (budget 260) { structure: 4, detail: 3, life: 169, lamp: 46 }`, then `review/facade-overlay.png`. The script writes `review/facade-drawing.png`, `review/facade-phone.png` and `review/facade-overlay.png`, and exits 0.

- [ ] **Step 5: Look**

Read the three review PNGs first.

`review/facade-overlay.png` (corten line over the photo):
- The slab's top edge runs along the sky line from (147, 497) to the apex. The plate's top and left edges sit on the corten's edges within about 15 units.
- The drawn arch lies on the lit arch within a few units. The dividers and the house are within about 5 units.
- The lettering's feet sit on the lit letters' feet. "CO" overlaps the lit C, and the O runs under the creepers as it does in the photo.
- The wire follows the dark cable, and the two bulb outlines sit over the two glass bulbs.
- The strand ends stop where the green stops: near y 930 over "CO", near y 620 and 760 over the dark gap around x 780, and at the frame's foot elsewhere.
- Nothing is drawn where the photo shows only sky or concrete. The reel caption is outside the frame.

`review/facade-phone.png` (390 px at 3x):
- Single weight throughout.
- THE BARNYARD CO reads as three words.
- The mark is recognisable: arch, sun, steam, plant, house and door.
- The creepers read as hanging strands with leaves, not as texture.
- No two lines run closer than about 3 px for more than a short stretch.
- No stroke is shorter than 12 frame units, except the bulbs, the mark's own sun rays and its drops.
- Closed shapes (bulbs, the arch, the sun) are closed.
- No person or face.

If the phone PNG is muddy: the detail layer here is only the wire, so first lower `leaves` by 3 on the four longest strands (indexes 4, 7, 9 and 10, 12 strokes fewer) and rerun Step 4. Never remove structure strokes or the lamp layer's mark and lettering.

Then look in the browser. With `npm run dev` running on 3021, use Playwright MCP (`browser_resize`, `browser_navigate`, `browser_take_screenshot`):

1. 390x844, `http://localhost:3021/lab/facade?at=14:00`, saved as `shots/lab-facade-390-day.png`.
2. 390x844, `http://localhost:3021/lab/facade?at=01:00`, saved as `shots/lab-facade-390-night.png`.
3. 1440x900, `http://localhost:3021/lab/facade?at=14:00`, saved as `shots/lab-facade-1440-day.png`.
4. 1440x900, `http://localhost:3021/lab/facade?at=01:00`, saved as `shots/lab-facade-1440-night.png`.
5. 390x844, `http://localhost:3021/lab/facade?mode=draw&at=14:00`, with screenshots at about 400 ms and 3 s.

Read every screenshot. Checklist:
- Day: paper ground `#E9E8E4` with ink lines. No glow is visible. The whole sign is inside the viewport width at 390.
- Night: the steel ground with night-ink lines. Soft lamp glows sit behind the two bulbs and behind the mark. No glow sits on the creepers.
- 1440: the drawing is capped by the lab's 720 px column, and the line is 1.5 px.
- Draw mode: the slab and plate appear first and the lettering last. The final state matches the static render.
- The console shows no errors.

- [ ] **Step 6: Commit**

```bash
git add drawings/facade.ts drawings/index.ts tests/drawing-facade.test.ts
git commit -m "feat: facade drawing: the corten plate with the lit mark and lettering, creepers and string lights"
```

---

### Task 8: The entry hall drawing

The entry hall from `stills/entry-ceiling.jpg`, the ELLE Decor India room.
- The fruit-crate strips hang over a black steel beam.
- Below them sit ducts, the mezzanine with its window and railing, and the open steel stair against the brick with its railing and landing.
- Framed pictures hang on the brick.
- Tables and chairs are simplified.
- The tall curtains, a window and a leaning mirror stand on the right.
- A barrel with hoops and a palm stands in front of them, and palms grow at the stair's foot.

Spec section 5 (the entry hall row) and section 4.4: on `/`, the strips draw as you scroll (`<Sheet id="entry" mode="scrub" />`). Because of that, the 30 strips are the first strokes in the structure layer.

Every constant below was measured in the 1080 x 1920 frame of the 720 x 1280 source when this plan was written, then checked in an overlay and a 390 px render. You confirm the constants against the overlay and nudge them.
- The strips are straight lines. Their lengths, lean and sawn ends come from `mulberry32(11)` inside a measured depth profile, so they are jagged like the photo but never scribbled.
- The treads are spaced with `perspectiveSteps`. The landing end is nearer the camera, and the measured tread spacing shrinks by about 7 % towards the foot.
- Balusters, mullions and grille slats are made with `repeat`.
- The barrel's hoops are the front halves of ellipses that sag more lower down, because we look down on the barrel.
- The palm fronds are an arching rachis with the mark's `leaf` set alternately along it, spread wide and dropped. Paired upright leaflets were tried and read as wheat, which CLAUDE.md forbids, so they were replaced.
- No lamps are lit in the photograph, so the drawing has no glows. No people appear in this frame. No guided contours are used.

**Files:**
- Create: `drawings/entry.ts`
- Modify: `drawings/index.ts` (import `entryDrawing` and register `entry: entryDrawing`)
- Test: `tests/drawing-entry.test.ts`

**Interfaces:**
- Consumes: `leaf` (`lib/draw/glyphs.ts`); `along`, `perspectiveSteps` (`lib/draw/perspective.ts`); `circle`, `curve`, `ellipse`, `line`, `n`, `polyline`, `rect`, `repeat` (`lib/draw/primitives.ts`); `Drawing`, `P`, `Stroke` (`lib/draw/types.ts`); `frameOf`, `metaFor` (`lib/drawings.ts`); `mulberry32` (`lib/random.ts`); `DRAWINGS`, `drawingFor` (`drawings/index.ts`); `scripts/guides/build.mjs`, `scripts/guides/grid.mjs`, `scripts/review.ts`; the `entry` entry in `content/drawings.json` (crop `[0, 0, 1080, 1800]`, budget 300, lift true).
- Produces:
  - `entryDrawing(): Drawing`: id `entry`, frame `x 0, y 0, width 1080, height 1800`, 239 strokes (structure 128, detail 43, life 68).
    - Strokes 0 to 29 are the ceiling strips, in the structure layer.
    - Life-layer ids `leaf-0` to `leaf-5` sit on the frond tips, with `morphs["leaf-n"] = [leaf(tip, length, angle + 7).d]`.
    - No glows and no lamp strokes.
  - `ceilingStrips(): Stroke[]`: 30 straight polylines, deterministic.
  - `treadNosings(): P[]`: 14 nosing points from the landing to the foot.
  - `DRAWINGS.entry`.

- [ ] **Step 1: Write the failing test**

`tests/drawing-entry.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ceilingStrips, entryDrawing, treadNosings } from "@/drawings/entry";
import type { P } from "@/lib/draw/types";
import { frameOf } from "@/lib/drawings";

const ends = (d: string) => [...d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])] as P);
const straightLength = (d: string) => {
  const p = ends(d);
  return p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
};

describe("entry drawing", () => {
  const d = entryDrawing();

  it("uses the crop as its frame", () => {
    expect({ x: d.x, y: d.y, width: d.width, height: d.height }).toEqual(frameOf("entry"));
  });
  it("hangs the same jagged, straight strips on every render, first in the structure layer", () => {
    const strips = ceilingStrips();
    expect(strips).toEqual(ceilingStrips());
    expect(strips).toHaveLength(30);
    expect(d.strokes.slice(0, 30)).toEqual(strips);
    const tips = strips.map((s) => Math.max(...ends(s.d).map(([, y]) => y)));
    const mean = tips.reduce((s, v) => s + v, 0) / tips.length;
    const spread = Math.sqrt(tips.reduce((s, v) => s + (v - mean) ** 2, 0) / tips.length);
    expect(spread).toBeGreaterThan(20);
    for (const s of strips) {
      expect(s.layer).toBe("structure");
      expect(s.d).not.toMatch(/[CQA]/);
    }
  });
  it("spaces fourteen treads so they tighten towards the foot", () => {
    const t = treadNosings();
    expect(t).toHaveLength(14);
    const gaps = t.slice(1).map((p, i) => Math.hypot(p[0] - t[i][0], p[1] - t[i][1]));
    expect(gaps[0]).toBeGreaterThan(gaps[gaps.length - 1]);
  });
  it("sways at most twelve leaves, each with one alternate, and gives architecture no ids", () => {
    const leaves = d.strokes.filter((s) => s.id?.startsWith("leaf-"));
    expect(leaves.length).toBeGreaterThan(0);
    expect(leaves.length).toBeLessThanOrEqual(12);
    for (const l of leaves) expect(d.morphs?.[l.id!]).toHaveLength(1);
    for (const s of d.strokes) if (s.id) expect(s.layer).toBe("life");
  });
  it("lights nothing: no lamp strokes and no glows (nothing is lit in the photograph)", () => {
    expect(d.strokes.some((s) => s.layer === "lamp")).toBe(false);
    expect(d.glows ?? []).toHaveLength(0);
  });
  it("keeps every line end inside the frame and no straight stroke under 12 units", () => {
    for (const s of d.strokes) {
      for (const [x, y] of ends(s.d)) {
        expect(x).toBeGreaterThanOrEqual(-1);
        expect(x).toBeLessThanOrEqual(1081);
        expect(y).toBeGreaterThanOrEqual(-1);
        expect(y).toBeLessThanOrEqual(1801);
      }
      if (/^[MLZ\d\s.-]+$/.test(s.d)) expect(straightLength(s.d)).toBeGreaterThanOrEqual(12);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- drawing-entry`
Expected: FAIL. `tests/drawing-entry.test.ts` cannot resolve the import `@/drawings/entry`, so no tests run.

- [ ] **Step 3: Implement**

3a. Build the guide and the measuring grid, then read the grid.

```bash
node scripts/guides/build.mjs entry && node scripts/guides/grid.mjs entry
```

Expected: `guides/entry: photo.jpg, guide-rooms.svg, guide-close.svg`, then `guides/entry/grid.png`.

Read `guides/entry/grid.png` and confirm these anchors before writing the module:
- The black beam's top is at y 300.
- The duct runs between y 428 and 484 and ends at x 600.
- The mezzanine slab edge is at y 752 to 776.
- The stair rail runs from (0, 1030) to (544, 631).
- The top tread's nosing is at (529, 781) and the lowest at (79, 1125).
- The painting spans (35 to 162, 789 to 959).
- The barrel's top ellipse is centred at (738, 1348), with rx 141 and ry 28.
- The curtain's left edge is at x 912.
- The tall window spans (854 to 908, 638 to 1330).

3b. Write `drawings/entry.ts`:

```ts
import { leaf } from "@/lib/draw/glyphs";
import { along, perspectiveSteps } from "@/lib/draw/perspective";
import { circle, curve, ellipse, line, n, polyline, rect, repeat } from "@/lib/draw/primitives";
import type { Drawing, P, Stroke } from "@/lib/draw/types";
import { frameOf, metaFor } from "@/lib/drawings";
import { mulberry32 } from "@/lib/random";

/*
 * The entry hall, drawn from stills/entry-ceiling.jpg (720 x 1280 source, measured in its 1080 x 1920 frame;
 * the drawing is the crop 0 0 1080 1800). Fruit-crate strips hang over a black steel beam; below, the mezzanine
 * with its window, the open steel stair against the brick, tables and chairs, the tall curtains on the right
 * and a barrel with a palm in front of them. No people appear in this frame, and none are drawn.
 */

// ---------- structure: the fruit-crate strips ----------
const STRIPS = { count: 30, from: 8, to: 800, seed: 11, lean: 0.15, minWidth: 22, extraWidth: 22 };
/** How far the strips hang at each x: their lowest tips in the photo. */
const STRIP_DEPTH: P[] = [[0, 235], [120, 285], [300, 315], [420, 250], [560, 262], [680, 245], [800, 215]];

// ---------- structure: beams, ducts and the mezzanine ----------
const BEAM_TOP = 300;
const BEAM_BOTTOM = { y: 362, to: 850 };
const DUCT = { top: 428, bottom: 484, to: 600, collars: [188, 288, 446] };
const LOWER_BEAM = { top: 538, bottom: 588, to: 662 };
const MEZZANINE_SLAB = { top: 752, bottom: 776, to: 660 };
const MEZZANINE_WINDOW = { right: 359 }; // its head is the lower beam's bottom edge
const FAR_RAIL = { y: 648, from: 0, to: 545, balusters: 10, balusterTo: 340 };
const LANDING_RAIL = { top: 631, bottom: 740, from: 547, to: 688, balusters: 8 };
const PIER = { outer: 719, inner: 658, top: 372, joint: 590, foot: 780 };

// ---------- structure: the stair ----------
const STAIR_RAIL: [P, P] = [[0, 1030], [544, 631]];
const NOSING_TOP: P = [529, 781];
const NOSING_FOOT: P = [79, 1125];
const TREADS = { count: 14, depth: 38, farZ: 1.04 };
const STRINGER_DEPTH = 22;
const STAIR_BALUSTERS = { count: 25, from: 34, to: 527 };
const STAIR_COLUMN: [P, P] = [[318, 945], [318, 1142]];
const BENCH_TOP: [P, P] = [[40, 1163], [640, 1163]];
const FLOOR_BEHIND_BENCH = 1142;

// ---------- structure: the right wall ----------
const CURTAIN = { edge: 912, top: 310, edgeFoot: 1540, folds: [944, 975, 1006, 1038, 1062], foldFoot: 1455 };
const TALL_WINDOW = { x: 854, y: 638, w: 54, h: 692, transoms: [838, 1131] };
const SHEERS = { top: 780, foot: 1165, folds: [666, 688, 710, 731] };
const MIRROR: P[] = [[738, 873], [831, 838], [831, 1262], [742, 1170]];

// ---------- detail ----------
const GRILLE: [P, P, P, P] = [[877, 58], [1077, 62], [1046, 231], [885, 231]];
const CANS: { x: number; y: number; w: number; h: number }[] = [
  { x: 82, y: 486, w: 44, h: 46 },
  { x: 347, y: 478, w: 44, h: 46 },
];
const PAINTING = { x: 35, y: 789, w: 127, h: 170, mat: 12 };
const SMALL_FRAME = { x: 518, y: 913, w: 72, h: 53, mat: 8 };
const FANS: { c: P; rx: number; ry: number; bracket: [P, P] }[] = [
  { c: [735, 623], rx: 40, ry: 30, bracket: [[770, 638], [826, 612]] },
  { c: [673, 746], rx: 34, ry: 24, bracket: [[702, 752], [720, 732]] },
];
const SPEAKER: P[] = [[850, 373], [938, 373], [938, 461], [850, 461]];

// ---------- structure: the barrel ----------
const BARREL_TOP = { c: [738, 1348] as P, rx: 141, ry: 28 };
const BARREL_HEAD = { c: [740, 1352] as P, rx: 122, ry: 20 };
const BARREL_LEFT: P[] = [[597, 1360], [578, 1460], [571, 1560], [578, 1680], [600, 1798]];
const BARREL_RIGHT: P[] = [[880, 1360], [899, 1460], [907, 1560], [900, 1680], [874, 1798]];
/** Each hoop is the front half of an ellipse: the height where it meets the staves, and how far it sags (we look down on the barrel). */
const HOOPS: { y: number; sag: number }[] = [
  { y: 1385, sag: 22 }, { y: 1432, sag: 25 }, { y: 1482, sag: 28 }, { y: 1535, sag: 31 }, { y: 1650, sag: 36 },
];
const BUNG = { c: [813, 1643] as P, r: 11 };

// ---------- structure: tables and chairs (simplified) ----------
const NEAR_TABLE = {
  top: [[340, 1221], [582, 1218], [590, 1250], [326, 1252]] as P[],
  front: [[326, 1266], [590, 1263]] as [P, P],
  stem: { left: 458, right: 479, top: 1266, foot: 1470 },
  base: [[418, 1470], [512, 1470], [524, 1507], [405, 1507]] as P[],
};
const BACK_TABLES: P[][] = [
  [[410, 1143], [566, 1143], [572, 1163], [404, 1163]],
  [[386, 1170], [574, 1170], [578, 1198], [378, 1198]],
];
const NEAR_CHAIR = {
  back: [[303, 1215], [342, 1207], [346, 1352]] as P[],
  rearLeg: [[303, 1215], [292, 1508]] as [P, P],
  seat: [[330, 1354], [442, 1350], [444, 1377], [320, 1379]] as P[],
  frontLeg: [[436, 1379], [438, 1507]] as [P, P],
  sideLeg: [[322, 1380], [326, 1452]] as [P, P],
};
const SIDE_TABLE = { x: 26, y: 1122, w: 208, h: 14, stem: [[108, 1136], [108, 1222]] as [P, P], base: [[63, 1228], [153, 1228]] as [P, P] };
const SIDE_CHAIR = {
  back: [[187, 1126], [234, 1126], [232, 1165]] as P[],
  seat: [[145, 1158], [222, 1155], [232, 1168], [142, 1172]] as P[],
  legs: [[[150, 1172], [142, 1236]], [[228, 1168], [234, 1220]]] as [P, P][],
};

// ---------- life: palms ----------
/**
 * Palm fronds: an arching rachis with the mark's leaf set alternately along it, opened wide and dropped by their own
 * weight. `leaflets` counts leaves, `length` is the longest leaflet (mid-frond); leaflets shorten towards base and tip.
 */
const BARREL_PALM: { path: P[]; leaflets: number; length: number }[] = [
  { path: [[1044, 1798], [1012, 1640], [978, 1530], [946, 1466]], leaflets: 12, length: 56 },
  { path: [[1004, 1798], [908, 1742], [806, 1730], [722, 1750]], leaflets: 12, length: 50 },
  { path: [[1064, 1798], [1004, 1696], [936, 1622], [890, 1590]], leaflets: 10, length: 46 },
];
const STAIR_FOOT_PALM: { path: P[]; leaflets: number; length: number }[] = [
  { path: [[372, 1160], [350, 1100], [306, 1070], [278, 1084]], leaflets: 8, length: 34 },
  { path: [[450, 1160], [470, 1090], [520, 1060], [556, 1074]], leaflets: 8, length: 34 },
  { path: [[606, 1160], [620, 1106], [652, 1080], [676, 1094]], leaflets: 6, length: 30 },
];
const LEAFLET_SPREAD = 68; // degrees off the rachis
const LEAFLET_DROOP = 0.3; // how far each leaflet turns towards the ground

const profileAt = (profile: P[], x: number): number => {
  if (x <= profile[0][0]) return profile[0][1];
  for (let i = 1; i < profile.length; i++) {
    const [x0, y0] = profile[i - 1], [x1, y1] = profile[i];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return profile[profile.length - 1][1];
};
const lerpP = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const lineY = ([a, b]: [P, P], x: number) => a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);

/** The pallet-wood strips: straight, sawn at an angle, hanging askew; lengths and angles from a fixed seed so every render matches. */
export function ceilingStrips(): Stroke[] {
  const rnd = mulberry32(STRIPS.seed);
  return repeat(STRIPS.count, (_, t) => {
    const x = STRIPS.from + (STRIPS.to - STRIPS.from) * t + (rnd() - 0.5) * 16;
    const w = STRIPS.minWidth + rnd() * STRIPS.extraWidth;
    const drop = profileAt(STRIP_DEPTH, x) * (0.7 + rnd() * 0.3);
    const lean = (rnd() - 0.5) * 2 * STRIPS.lean;
    const cut = (rnd() - 0.5) * w * 1.2;
    return polyline([[x, 0], [x + lean * drop, drop], [x + w + lean * (drop + cut), drop + cut], [x + w, 0]], "structure");
  });
}

/** Tread nosings from the landing down to the foot, spaced as they recede (the landing end is nearer the camera). */
export function treadNosings(): P[] {
  return along(NOSING_TOP, NOSING_FOOT, perspectiveSteps(TREADS.count, 1, TREADS.farZ));
}

/** Turns an angle part of the way towards straight down (90°), the short way round. */
const droop = (deg: number, k: number) => {
  const d = ((((90 - deg) % 360) + 540) % 360) - 180;
  return deg + d * k;
};

function frond(path: P[], leaflets: number, length: number, seed: number): Stroke[] {
  const rnd = mulberry32(seed);
  const segs = path.slice(1).map((b, i) => ({ a: path[i], b, len: Math.hypot(b[0] - path[i][0], b[1] - path[i][1]) }));
  const total = segs.reduce((s, x) => s + x.len, 0);
  const out: Stroke[] = [curve(path, "life")];
  for (let i = 0; i < leaflets; i++) {
    const t = (i + 0.5) / leaflets;
    let at = (0.12 + 0.84 * t) * total;
    const seg = segs.find((s) => (at -= s.len) <= 0) ?? segs[segs.length - 1];
    const base = lerpP(seg.a, seg.b, seg.len ? 1 + at / seg.len : 0);
    const dir = (Math.atan2(seg.b[1] - seg.a[1], seg.b[0] - seg.a[0]) * 180) / Math.PI;
    const side = i % 2 ? 1 : -1;
    const size = length * (0.55 + 0.45 * Math.sin(Math.PI * (0.2 + 0.8 * t))) * (0.9 + rnd() * 0.2);
    out.push(leaf(base, size, droop(dir + side * (LEAFLET_SPREAD + rnd() * 10), LEAFLET_DROOP)));
  }
  return out;
}

function hoop(y: number, sag: number): Stroke {
  const left: P = [profileAt(BARREL_LEFT.map(([x, yy]) => [yy, x] as P), y), y];
  const right: P = [profileAt(BARREL_RIGHT.map(([x, yy]) => [yy, x] as P), y), y];
  const rx = (right[0] - left[0]) / 2;
  return { d: `M${n(left[0])} ${n(left[1])}A${n(rx)} ${n(sag)} 0 0 0 ${n(right[0])} ${n(right[1])}`, layer: "structure" };
}

export function entryDrawing(): Drawing {
  const nosings = treadNosings();
  const nosingLine: [P, P] = [NOSING_TOP, NOSING_FOOT];

  const structure: Stroke[] = [
    ...ceilingStrips(),
    line([0, BEAM_TOP], [1080, BEAM_TOP]),
    line([0, BEAM_BOTTOM.y], [BEAM_BOTTOM.to, BEAM_BOTTOM.y]),
    line([0, DUCT.top], [DUCT.to, DUCT.top]),
    line([0, DUCT.bottom], [DUCT.to, DUCT.bottom]),
    line([0, LOWER_BEAM.top], [LOWER_BEAM.to, LOWER_BEAM.top]),
    line([0, LOWER_BEAM.bottom], [LOWER_BEAM.to, LOWER_BEAM.bottom]),
    line([PIER.outer, PIER.top], [PIER.outer, PIER.foot]),
    line([PIER.inner, PIER.joint], [PIER.inner, PIER.foot]),
    line([MEZZANINE_WINDOW.right, LOWER_BEAM.bottom], [MEZZANINE_WINDOW.right, MEZZANINE_SLAB.top]),
    line([0, MEZZANINE_SLAB.top], [MEZZANINE_SLAB.to, MEZZANINE_SLAB.top]),
    line([0, MEZZANINE_SLAB.bottom], [MEZZANINE_SLAB.to, MEZZANINE_SLAB.bottom]),
    line([FAR_RAIL.from, FAR_RAIL.y], [FAR_RAIL.to, FAR_RAIL.y]),
    ...repeat(FAR_RAIL.balusters, (_, t) => { const x = 18 + (FAR_RAIL.balusterTo - 18) * t; return line([x, FAR_RAIL.y], [x, MEZZANINE_SLAB.top]); }),
    polyline([[LANDING_RAIL.from, MEZZANINE_SLAB.top], [LANDING_RAIL.from, LANDING_RAIL.top], [LANDING_RAIL.to, LANDING_RAIL.top], [LANDING_RAIL.to, MEZZANINE_SLAB.top]]),
    line([LANDING_RAIL.from, LANDING_RAIL.bottom], [LANDING_RAIL.to, LANDING_RAIL.bottom]),
    ...repeat(LANDING_RAIL.balusters, (_, t) => { const x = LANDING_RAIL.from + 15 + (LANDING_RAIL.to - LANDING_RAIL.from - 30) * t; return line([x, LANDING_RAIL.top], [x, LANDING_RAIL.bottom]); }),
    line(STAIR_RAIL[0], STAIR_RAIL[1]),
    ...nosings.map(([x, y]) => line([x, y], [x + TREADS.depth, y])),
    line([NOSING_TOP[0] + TREADS.depth, NOSING_TOP[1]], [NOSING_FOOT[0] + TREADS.depth, NOSING_FOOT[1]]),
    line([NOSING_TOP[0] + TREADS.depth + 8, NOSING_TOP[1] + STRINGER_DEPTH - 6], [NOSING_FOOT[0] + TREADS.depth + 24, FLOOR_BEHIND_BENCH]),
    ...repeat(STAIR_BALUSTERS.count, (_, t) => {
      const x = STAIR_BALUSTERS.from + (STAIR_BALUSTERS.to - STAIR_BALUSTERS.from) * t;
      return line([x, lineY(STAIR_RAIL, x)], [x, Math.min(lineY(nosingLine, x), FLOOR_BEHIND_BENCH)]);
    }),
    line(STAIR_COLUMN[0], STAIR_COLUMN[1]),
    line([CURTAIN.edge, CURTAIN.top], [CURTAIN.edge, CURTAIN.edgeFoot]),
    rect(TALL_WINDOW.x, TALL_WINDOW.y, TALL_WINDOW.w, TALL_WINDOW.h),
    ...TALL_WINDOW.transoms.map((y) => line([TALL_WINDOW.x, y], [TALL_WINDOW.x + TALL_WINDOW.w, y])),
    polyline(MIRROR, "structure", true),
    ellipse(BARREL_TOP.c, BARREL_TOP.rx, BARREL_TOP.ry, "structure"),
    curve(BARREL_LEFT, "structure"),
    curve(BARREL_RIGHT, "structure"),
    ...HOOPS.map((h) => hoop(h.y, h.sag)),
    polyline(NEAR_TABLE.top, "structure", true),
    line(NEAR_TABLE.front[0], NEAR_TABLE.front[1]),
    line([NEAR_TABLE.stem.left, NEAR_TABLE.stem.top], [NEAR_TABLE.stem.left, NEAR_TABLE.stem.foot]),
    line([NEAR_TABLE.stem.right, NEAR_TABLE.stem.top], [NEAR_TABLE.stem.right, NEAR_TABLE.stem.foot]),
    polyline(NEAR_TABLE.base, "structure", true),
    ...BACK_TABLES.map((t) => polyline(t, "structure", true)),
    rect(SIDE_TABLE.x, SIDE_TABLE.y, SIDE_TABLE.w, SIDE_TABLE.h),
    line(SIDE_TABLE.stem[0], SIDE_TABLE.stem[1]),
    line(SIDE_TABLE.base[0], SIDE_TABLE.base[1]),
  ];

  const detail: Stroke[] = [
    polyline(GRILLE, "detail", true),
    ...repeat(6, (_, t) => line(lerpP(GRILLE[3], GRILLE[2], 0.08 + t * 0.5), lerpP(GRILLE[0], GRILLE[1], 0.42 + t * 0.5), "detail")),
    ellipse([DUCT.to, (DUCT.top + DUCT.bottom) / 2], 9, (DUCT.bottom - DUCT.top) / 2),
    ...DUCT.collars.map((x) => line([x, DUCT.top], [x, DUCT.bottom], "detail")),
    ...CANS.map((c) => polyline([[c.x, c.y], [c.x, c.y + c.h], [c.x + c.w, c.y + c.h], [c.x + c.w, c.y]], "detail")),
    rect(PAINTING.x, PAINTING.y, PAINTING.w, PAINTING.h, "detail"),
    rect(PAINTING.x + PAINTING.mat, PAINTING.y + PAINTING.mat, PAINTING.w - PAINTING.mat * 2, PAINTING.h - PAINTING.mat * 2, "detail"),
    rect(SMALL_FRAME.x, SMALL_FRAME.y, SMALL_FRAME.w, SMALL_FRAME.h, "detail"),
    rect(SMALL_FRAME.x + SMALL_FRAME.mat, SMALL_FRAME.y + SMALL_FRAME.mat, SMALL_FRAME.w - SMALL_FRAME.mat * 2, SMALL_FRAME.h - SMALL_FRAME.mat * 2, "detail"),
    ...FANS.flatMap((f) => [ellipse(f.c, f.rx, f.ry), line(f.bracket[0], f.bracket[1], "detail")]),
    polyline(SPEAKER, "detail", true),
    ...CURTAIN.folds.map((x) => line([x, CURTAIN.top], [x, CURTAIN.foldFoot], "detail")),
    ...SHEERS.folds.map((x) => line([x, SHEERS.top], [x, SHEERS.foot], "detail")),
    ellipse(BARREL_HEAD.c, BARREL_HEAD.rx, BARREL_HEAD.ry),
    circle(BUNG.c, BUNG.r),
    line(BENCH_TOP[0], BENCH_TOP[1], "detail"),
    polyline(NEAR_CHAIR.back, "detail"),
    line(NEAR_CHAIR.rearLeg[0], NEAR_CHAIR.rearLeg[1], "detail"),
    polyline(NEAR_CHAIR.seat, "detail", true),
    line(NEAR_CHAIR.frontLeg[0], NEAR_CHAIR.frontLeg[1], "detail"),
    line(NEAR_CHAIR.sideLeg[0], NEAR_CHAIR.sideLeg[1], "detail"),
    polyline(SIDE_CHAIR.back, "detail"),
    polyline(SIDE_CHAIR.seat, "detail", true),
    ...SIDE_CHAIR.legs.map(([a, b]) => line(a, b, "detail")),
  ];

  const life: Stroke[] = [
    ...STAIR_FOOT_PALM.flatMap((f, i) => frond(f.path, f.leaflets, f.length, 70 + i)),
    ...BARREL_PALM.flatMap((f, i) => frond(f.path, f.leaflets, f.length, 80 + i)),
  ];
  const morphs: Record<string, string[]> = {};
  [...BARREL_PALM, ...STAIR_FOOT_PALM].forEach((f, i) => {
    const [a, b] = f.path.slice(-2);
    const angle = droop((Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI, LEAFLET_DROOP);
    const size = f.length * 0.6;
    life.push({ ...leaf(b, size, angle), id: `leaf-${i}` });
    morphs[`leaf-${i}`] = [leaf(b, size, angle + 7).d];
  });

  return { id: "entry", title: metaFor("entry").title, ...frameOf("entry"), strokes: [...structure, ...detail, ...life], morphs };
}
```

3c. Register the drawing. `drawings/index.ts` becomes:

```ts
import type { Drawing } from "@/lib/draw/types";
import { entryDrawing } from "./entry";
import { facadeDrawing } from "./facade";
import { markDrawing } from "./mark";

export const DRAWINGS: Record<string, () => Drawing> = {
  mark: markDrawing,
  facade: facadeDrawing,
  entry: entryDrawing,
};

export function drawingFor(id: string): Drawing {
  const make = DRAWINGS[id];
  if (!make) throw new Error(`No drawing module for "${id}"`);
  return make();
}
```

If other drawing tasks have already added entries, keep them and add only the `entryDrawing` import line and the `entry: entryDrawing,` entry.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- drawing-entry`
Expected: PASS, 6 tests.

Run: `npm test -- drawings`
Expected: PASS, including `entry is valid and within budget`.

Run: `npx tsx scripts/review.ts entry`
Expected: `entry: 239 strokes (budget 300) { structure: 128, detail: 43, life: 68, lamp: 0 }`, then `review/entry-overlay.png`, and exit 0.

- [ ] **Step 5: Look**

Read the three review PNGs first.

`review/entry-overlay.png`:
- The strips band sits over the crates between y 0 and about 320, and no strip reaches the beam line at y 300 by more than a few tips.
- The beam, duct, lower beam and slab lines lie on their dark bands within about 15 units.
- The stair rail lies on the handrail, and each tread line sits on a light tread.
- The balusters follow the railing's rhythm.
- The painting and the small frame outline the real frames.
- The barrel's top ellipse and profiles hug the barrel, and each hoop line lies on or beside a pale hoop.
- The curtain edge, the folds, the tall window and the leaning mirror match the right wall.
- The near table and chair overlay the real table and chair.
- The palm fronds rise where the palms are.
- Nothing is drawn where the photo shows bare floor.

`review/entry-phone.png` (390 px at 3x):
- Single weight throughout.
- At a glance: a ceiling of hanging strips, a steel stair climbing to a landing, a barrel, tall curtains. The room is recognisable.
- The strips read as sawn boards hanging askew, not as hatching or scribble.
- The palms read as palms (arching, leaves dropping), never as wheat sprigs.
- No two long lines merge (the window head is the lower beam's line, drawn once).
- No stroke is shorter than 12 frame units except the bung.
- Closed shapes (frames, the mirror, the table top, the grille) are closed.
- No person or face.

If the phone PNG is muddy, delete detail-layer strokes first, in this order, rerunning Step 4 after each: `SHEERS.folds` (4), the grille slats (6), `DUCT.collars` (3), then `SIDE_CHAIR` (4). Never delete structure strokes.

Then look in the browser. With `npm run dev` running on 3021, use Playwright MCP:

1. 390x844, `http://localhost:3021/lab/entry?at=14:00`, saved as `shots/lab-entry-390-day.png`.
2. 390x844, `http://localhost:3021/lab/entry?at=01:00`, saved as `shots/lab-entry-390-night.png`.
3. 1440x900, `http://localhost:3021/lab/entry?at=14:00`, saved as `shots/lab-entry-1440-day.png`.
4. 1440x900, `http://localhost:3021/lab/entry?at=01:00`, saved as `shots/lab-entry-1440-night.png`.
5. 390x844, `http://localhost:3021/lab/entry?mode=scrub&at=14:00`: one screenshot on arrival and one after scrolling the drawing to the middle of the viewport.

Read every screenshot. Checklist:
- Day: ink on paper, and the full-height drawing scrolls at 390 without clipping.
- Night: the steel ground and night-ink lines, with no glow anywhere (the entry has no lit lamps).
- 1440: capped at the lab's 720 px column with the 1.5 px line.
- Scrub: the strips band draws first as you scroll, before the beam and the stair, and scrolling back undraws it.
- The console shows no errors.

- [ ] **Step 6: Commit**

```bash
git add drawings/entry.ts drawings/index.ts tests/drawing-entry.test.ts
git commit -m "feat: entry hall drawing: crate strips, the steel stair, barrel, curtains and palms"
```

---

### Task 9: The main floor and the wall lamp drawings

Two drawings for the room the magazines photographed. The main floor comes from AD India's wide photograph (`raw/ad-1.jpg`, photo only, no layout): black steel overhead, the far mezzanine, the near mezzanine with its planters, the open steel stair against the brick, the pots at its foot, tables, chairs and the bamboo-leaf plants. The wall lamp is the spec's ship-lamp detail from `stills/brick-lamp.jpg`: the lamp and its bulb, the mirror, the table lamp, the rotary phone and the box on the studded table, with the brick hinted by six staggered courses. Every coordinate below was measured on the whole-source grid (1080-wide frame) and checked by rendering the module over the photograph. The engineer refines against `review/<id>-overlay.png`; the numbers are not placeholders.

Nothing is traced. No guided contours are used (there are no hands or food here). No person appears in either photograph, and none is drawn. On `ad-1` the magazine's thin grey frame rule (y ≈ 18 and x ≈ 1057) is layout, not room, and is never drawn.

**Files:**
- Create: `drawings/main-floor.ts`, `drawings/wall-lamp.ts`
- Modify: `drawings/index.ts` (import `mainFloorDrawing` and `wallLampDrawing`; add the `"main-floor"` and `"wall-lamp"` entries)
- Test: `tests/drawing-main-floor-wall-lamp.test.ts`

**Interfaces:**
- Consumes: `Drawing`, `Glow`, `Layer`, `P`, `Stroke` (`lib/draw/types.ts`); `n`, `line`, `polyline`, `rect`, `circle`, `ellipse`, `arc`, `arch`, `curve`, `repeat` (`lib/draw/primitives.ts`); `along`, `perspectiveSteps` (`lib/draw/perspective.ts`); `leaf`, `bulb` (`lib/draw/glyphs.ts`); `metaFor`, `frameOf` (`lib/drawings.ts`); `DRAWINGS`, `drawingFor` (`drawings/index.ts`); `scripts/review.ts`, `scripts/guides/build.mjs`, `scripts/guides/grid.mjs` (Tasks 3 and 4); `svg-path-properties` (installed in Task 4); `/lab/<id>` (Task 6).
- Produces:
  - `mainFloorDrawing(): Drawing`: id `main-floor`, frame `x 250, y 0, width 830, height 625`, 151 strokes (structure 68, detail 39, life 42, lamp 2), `glows: [{ x: 377, y: 183, r: 40 }]` (the wall light; the far console lamp is drawn in the lamp layer without a glow), `morphs` for `leaf-0` to `leaf-11`, no bulbs.
  - `wallLampDrawing(): Drawing`: id `wall-lamp`, frame `x 0, y 150, width 1080, height 1430`, 78 strokes (structure 11, detail 64, lamp 3), one bulb `bulb-0` (the Edison bulb, centre `[556, 394]`), `glows: [{ x: 556, y: 388, r: 120 }]`, no life layer, no morphs.
  - `DRAWINGS["main-floor"]`, `DRAWINGS["wall-lamp"]`.
  - Measured anchors later tasks can point at (Task 18 annotations, Task 20 viewfinder): main floor stair tread tips `[892, 72]` to `[494, 456]`, stair post `[698, 415]`, framed picture `[975, 279]`, brick face `[860, 300]`, far mezzanine rail `[400, 196]`, black steel beam `[455, 70]`, pots `[590, 476]`, right table `[806, 563]`; wall lamp shade `[554, 340]`, bulb `[556, 394]`, mirror `[553, 756]`, table lamp `[170, 1220]`, phone dial `[545, 1425]`, box `[878, 1416]`, brick course `[175, 190]`, table studs `[510, 1553]`.

- [ ] **Step 1: Write the failing test `tests/drawing-main-floor-wall-lamp.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { svgPathProperties } from "svg-path-properties";
import { DRAWINGS, drawingFor } from "@/drawings";
import { metaFor } from "@/lib/drawings";
import type { Drawing } from "@/lib/draw/types";

const MIN_STROKE = 12; // frame units: nothing shorter except bulbs
const MARGIN = 24; // a stroke may run to the sheet's edge and be clipped, never wander off it

function survey(d: Drawing) {
  const x0 = d.x ?? 0;
  const y0 = d.y ?? 0;
  const x1 = x0 + d.width;
  const y1 = y0 + d.height;
  const tooShort: string[] = [];
  const outside: string[] = [];
  for (const s of d.strokes) {
    const props = new svgPathProperties(s.d);
    const len = props.getTotalLength();
    if (len < MIN_STROKE && !s.id?.startsWith("bulb-")) tooShort.push(s.d);
    for (let at = 0; at <= len; at += 8) {
      const p = props.getPointAtLength(at);
      if (p.x < x0 - MARGIN || p.x > x1 + MARGIN || p.y < y0 - MARGIN || p.y > y1 + MARGIN) {
        outside.push(s.d);
        break;
      }
    }
  }
  return { x0, y0, x1, y1, tooShort, outside };
}

const skeleton = (path: string) => path.replace(/-?[\d.]+/g, "#");

describe.each(["main-floor", "wall-lamp"])("%s drawing", (id) => {
  it("is registered, framed on its crop and within its stroke budget", () => {
    expect(DRAWINGS[id]).toBeTypeOf("function");
    const d = drawingFor(id);
    const meta = metaFor(id);
    expect(d.id).toBe(id);
    expect(d.title).toBe(meta.title);
    expect([d.x, d.y, (d.x ?? 0) + d.width, (d.y ?? 0) + d.height]).toEqual(meta.crop);
    expect(d.strokes.length).toBeLessThanOrEqual(meta.strokeBudget);
  });

  it("has no fragments and keeps every line on the sheet", () => {
    const { tooShort, outside } = survey(drawingFor(id));
    expect(tooShort).toEqual([]);
    expect(outside).toEqual([]);
  });

  it("names its bulbs and leaves the way the life engine expects", () => {
    const d = drawingFor(id);
    const ids = d.strokes.map((s) => s.id).filter((v): v is string => Boolean(v));
    expect(new Set(ids).size).toBe(ids.length);
    const bulbs = d.strokes.filter((s) => s.id?.startsWith("bulb-"));
    bulbs.forEach((s, i) => {
      expect(s.id).toBe(`bulb-${i}`);
      expect(s.layer).toBe("lamp");
    });
    const leaves = d.strokes.filter((s) => s.id?.startsWith("leaf-"));
    const morphs = d.morphs ?? {};
    expect(leaves.length).toBeLessThanOrEqual(12);
    expect(Object.keys(morphs).sort()).toEqual(leaves.map((s) => s.id!).sort());
    for (const s of leaves) {
      expect(s.layer).toBe("life");
      expect(morphs[s.id!]).toHaveLength(1);
      expect(skeleton(morphs[s.id!][0])).toBe(skeleton(s.d));
    }
    expect(ids.every((v) => /^(bulb|leaf)-\d+$/.test(v))).toBe(true);
  });

  it("puts every glow on the sheet at a lamp's radius", () => {
    const d = drawingFor(id);
    const { x0, y0, x1, y1 } = survey(d);
    for (const g of d.glows ?? []) {
      expect(g.x).toBeGreaterThanOrEqual(x0);
      expect(g.x).toBeLessThanOrEqual(x1);
      expect(g.y).toBeGreaterThanOrEqual(y0);
      expect(g.y).toBeLessThanOrEqual(y1);
      expect(g.r).toBeGreaterThanOrEqual(40);
      expect(g.r).toBeLessThanOrEqual(140);
    }
  });
});

describe("what each drawing carries", () => {
  it("main floor: twelve swaying leaves, one glow on the wall light, no bulbs, fourteen treads' worth of structure", () => {
    const d = drawingFor("main-floor");
    expect(Object.keys(d.morphs ?? {})).toHaveLength(12);
    expect(d.glows).toEqual([{ x: 377, y: 183, r: 40 }]);
    expect(d.strokes.some((s) => s.id?.startsWith("bulb-"))).toBe(false);
    expect(d.strokes.filter((s) => s.layer === "structure").length).toBeGreaterThanOrEqual(60);
  });

  it("wall lamp: one bulb under the shade with its glow, no life layer", () => {
    const d = drawingFor("wall-lamp");
    expect(d.strokes.filter((s) => s.id?.startsWith("bulb-")).map((s) => s.id)).toEqual(["bulb-0"]);
    expect(d.glows).toHaveLength(1);
    expect(d.strokes.some((s) => s.layer === "life")).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- drawing-main-floor-wall-lamp`
Expected: FAIL. `expected undefined to be type of function` for both ids, and the other cases throw `No drawing module for "main-floor"` / `No drawing module for "wall-lamp"`.

- [ ] **Step 3: Implement**

3a. Build the guides and the measuring grids, then read both grids before touching the numbers:

```bash
node scripts/guides/build.mjs main-floor wall-lamp
node scripts/guides/grid.mjs main-floor
node scripts/guides/grid.mjs wall-lamp
```

Read `guides/main-floor/grid.png` and `guides/wall-lamp/grid.png`. The main floor photograph fills y 0 to 720 of the 1350-high layout; the crop `[250, 0, 1080, 625]` stops right of the magazine's logo and above its white card. `brick-lamp.jpg` is 720x1280, so its 1080 frame is 1920 high; the crop `[0, 150, 1080, 1580]` runs from above the rail to the table's apron.

3b. Write `drawings/main-floor.ts`. How it is built:
- The overhead steel is five lines: the duct's two edges, the black beam's underside, and three ceiling rails that run from the beam to the near mezzanine's rail.
- Both mezzanines are a fascia (two lines), a top rail and balusters from `repeat`. Each baluster is cut exactly between the rail and the fascia with `yAt`.
- The stair is a closed stringer, fourteen treads and the railing. The tread tips are `along(top, bottom, perspectiveSteps(14, 1, 1.7))`, which is within 2.2 units of all fourteen measured tips. Each tread runs from its tip to the stringer's top edge (`xAt`). Twelve balusters run between the handrail and the bottom rail. The steel post under the stair is one rect.
- Brick is six short courses beside the picture only, clear of the plants.
- The tables are closed polylines with an edge line, a stem and a foot ellipse. Each chair is its arm rail (`curve`), one seat line that runs from the rail round the seat, three legs and a stretcher.
- The bushy plants are tufts: thin stems fan up from one root, with three leaves at each tip. The first twelve leaves carry `leaf-<n>` ids and a +7° morph.

```ts
import { frameOf, metaFor } from "@/lib/drawings";
import { leaf } from "@/lib/draw/glyphs";
import { along, perspectiveSteps } from "@/lib/draw/perspective";
import { circle, curve, ellipse, line, polyline, rect, repeat } from "@/lib/draw/primitives";
import type { Drawing, Glow, P, Stroke } from "@/lib/draw/types";

/*
 * Measured in the 1080-wide frame of raw/ad-1.jpg (the AD India layout, 1080x1350).
 * The drawing's frame is its crop [250, 0, 1080, 625]: the photograph only, right of the magazine's logo and above its white card.
 * The magazine's thin grey frame rule (y 18, x 1057) is layout, not room, and is never drawn.
 */

// ---- Structure: ceiling steel, the two mezzanine edges, the stair, the column, the window.
const DUCT_UPPER: [P, P] = [[250, 44], [372, 0]];
const DUCT_LOWER: [P, P] = [[250, 122], [505, 0]];
const BEAM_UNDERSIDE: [P, P] = [[300, 138], [610, 0]];
const CEILING_RAILS: [P, P][] = [[[578, 8], [672, 46]], [[512, 40], [612, 80]], [[422, 80], [512, 113]]];
const WINDOW_LEFT: P[] = [[250, 160], [271, 160], [271, 264], [250, 264]]; // the window's right jamb; the rest is outside the crop
const COLUMN = { x: 291, y: 136, w: 9, h: 264 };

const LOW_FASCIA_TOP: [P, P] = [[300, 265], [488, 227]];
const LOW_FASCIA_BOTTOM: [P, P] = [[300, 276], [488, 244]];
const LOW_RAIL: [P, P] = [[300, 224], [486, 168]];
const LOW_BALUSTERS = { count: 8, from: 322, to: 464 };

const UP_FASCIA_TOP: P[] = [[490, 190], [700, 142], [905, 86]];
const UP_FASCIA_BOTTOM: P[] = [[490, 204], [700, 156], [905, 100]];
const UP_RAIL: [P, P] = [[490, 122], [850, 0]];
const UP_BALUSTERS = { count: 10, from: 514, to: 760 };
const BRICK_EDGE: [P, P] = [[488, 204], [488, 524]]; // the brick face under the upper mezzanine
const LEDGE_TOP: [P, P] = [[488, 480], [690, 492]]; // the concrete ledge the pots stand on
const LEDGE_FOOT: [P, P] = [[488, 524], [672, 562]];

const STRINGER: P[] = [[530, 452], [1000, 17], [1028, 17], [550, 462]];
const STRINGER_TOP_EDGE: [P, P] = [[560, 427], [1000, 17]]; // treads stop on this line
const TREAD_TIP_TOP: P = [892, 72]; // nearest tread, where it cantilevers out
const TREAD_TIP_BOTTOM: P = [494, 456]; // farthest tread, at the foot by the pots
const TREADS = 14;
const TREAD_FAR_Z = 1.7; // fitted: max error 2.2 units against the fourteen measured tips
const HANDRAIL: [P, P] = [[459, 393], [828, 0]];
const BOTTOM_RAIL: [P, P] = [[474, 457], [915, 5]];
const NEWEL: [P, P] = [[461, 390], [462, 460]];
const STAIR_BALUSTERS = { count: 12, from: 490, to: 798 };
const STAIR_POST = { x: 690, y: 325, w: 16, h: 179 };

// ---- Detail: the picture and a few brick courses beside it, the tables and chairs, the far sofa and console, pots.
const PICTURE_OUTER: P[] = [[922, 242], [1026, 243], [1028, 314], [924, 316]];
const PICTURE_INNER: P[] = [[940, 258], [1010, 258], [1011, 300], [941, 301]];
const COURSES: [P, P][] = [
  [[890, 218], [980, 219]], [[960, 206], [1060, 207]], [[850, 280], [905, 280]],
  [[860, 232], [910, 232]], [[1036, 280], [1076, 280]], [[990, 334], [1070, 335]],
];
const CONSOLE: [P, P] = [[346, 388], [410, 386]];
const FAR_FRAME = { x: 360, y: 320, w: 32, h: 30 };
const SOFA: P[] = [[262, 446], [262, 404], [300, 398], [352, 402], [352, 446]];
const SOFA_SEAT: [P, P] = [[262, 424], [352, 426]];

const TABLE_TOP: P[] = [[336, 462], [497, 471], [434, 505], [323, 482]];
const TABLE_EDGE: P[] = [[323, 489], [434, 512], [497, 478]];
const TABLE_STEM: [P, P] = [[412, 506], [412, 566]];
const TABLE_FOOT = { c: [418, 578] as P, rx: 36, ry: 10 };
const CHAIR_FRONT_LEFT = {
  rail: [[322, 492], [346, 484], [382, 486], [406, 496]] as P[],
  seat: [[322, 494], [326, 522], [336, 540], [414, 538], [420, 520], [406, 498]] as P[],
  legs: [[[340, 540], [308, 606]], [[412, 538], [426, 586]], [[366, 544], [360, 618]], [[322, 561], [381, 580]]] as [P, P][],
};
const CHAIR_FRONT_RIGHT = {
  rail: [[442, 488], [474, 478], [510, 482]] as P[],
  seat: [[442, 490], [430, 510], [440, 532], [506, 528], [512, 508], [510, 484]] as P[],
  legs: [[[438, 532], [434, 580]], [[498, 528], [526, 576]], [[474, 540], [486, 600]], [[437, 549], [500, 555]]] as [P, P][],
};

const RIGHT_TABLE_TOP: P[] = [[724, 510], [944, 540], [884, 620], [668, 564]];
const RIGHT_TABLE_APRON: [P, P] = [[672, 578], [860, 625]];
const RIGHT_TABLE_LEGS: [P, P][] = [[[676, 580], [684, 620]], [[920, 560], [936, 620]]];
const MENU_HOLDER: P[] = [[800, 526], [826, 526], [828, 550], [802, 550]];
const CANE_BACKS: P[][] = [[[676, 556], [668, 524], [720, 504], [724, 536]], [[722, 504], [756, 490], [760, 516]]];
const POTS: P[][] = [
  [[530, 458], [560, 458], [556, 488], [534, 488]],
  [[562, 460], [590, 460], [586, 490], [566, 490]],
  [[586, 464], [620, 464], [614, 496], [592, 496]],
  [[622, 460], [654, 460], [648, 490], [628, 490]],
];

// ---- Lamp: the lamp on the far console and the wall light above the far mezzanine.
// Only the wall light glows (the contract: glows on wall lamps only); the console lamp takes the lamp colour at night without a glow.
const CONSOLE_LAMP: P[] = [[391, 370], [395, 360], [403, 360], [407, 370]];
const SCONCE: P = [377, 183];
const GLOWS: Glow[] = [{ x: 377, y: 183, r: 40 }];

// ---- Life: the plants along the brick wall and in the pots. [base, length, angle] per leaf.
const PLANT_TALL = { stem: [[756, 494], [752, 420], [764, 332]] as P[], leaves: [[[764, 396], 53, -146], [[760, 376], 80, -25], [[754, 440], 44, -150], [[756, 416], 58, -40], [[762, 350], 40, -110], [[752, 466], 40, -30]] as [P, number, number][] };
/** The two bushy plants: thin stems fanning up from one root, a tuft of three leaves at each tip. */
const TUFTS: { base: P; tips: P[] }[] = [
  { base: [812, 522], tips: [[784, 410], [816, 396], [846, 446]] },
  { base: [920, 522], tips: [[892, 392], [934, 380], [968, 420]] },
];
const TUFT_LEAVES: [number, number][] = [[-55, 34], [0, 40], [55, 34]]; // [degrees from the stem's direction, length]
const PALM_EDGE: [P, number, number][] = [[[1080, 418], 60, -165], [[1080, 408], 54, -140], [[1080, 432], 52, -190]];
const POT_LEAVES: [number, number][] = [[-112, 22], [-62, 20]];

const yAt = ([a, b]: [P, P], x: number) => a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
const xAt = ([a, b]: [P, P], y: number) => a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]);
const yOnPolyline = (pts: P[], x: number) => {
  const i = Math.max(0, pts.findIndex((p, k) => k > 0 && x <= p[0]) - 1);
  return yAt([pts[i], pts[i + 1] ?? pts[i]], x);
};

export function mainFloorDrawing(): Drawing {
  const id = "main-floor";

  const treadTips = along(TREAD_TIP_TOP, TREAD_TIP_BOTTOM, perspectiveSteps(TREADS, 1, TREAD_FAR_Z));
  const structure: Stroke[] = [
    line(...DUCT_UPPER), line(...DUCT_LOWER), line(...BEAM_UNDERSIDE),
    ...CEILING_RAILS.map(([a, b]) => line(a, b)),
    polyline(WINDOW_LEFT),
    rect(COLUMN.x, COLUMN.y, COLUMN.w, COLUMN.h),
    line(...LOW_FASCIA_TOP), line(...LOW_FASCIA_BOTTOM), line(...LOW_RAIL),
    line([LOW_RAIL[1][0] - 2, LOW_RAIL[1][1] + 1], [LOW_RAIL[1][0] - 2, yAt(LOW_FASCIA_TOP, LOW_RAIL[1][0] - 2)]),
    ...repeat(LOW_BALUSTERS.count, (_, t) => {
      const x = LOW_BALUSTERS.from + (LOW_BALUSTERS.to - LOW_BALUSTERS.from) * t;
      return line([x, yAt(LOW_RAIL, x)], [x, yAt(LOW_FASCIA_TOP, x)]);
    }),
    polyline(UP_FASCIA_TOP), polyline(UP_FASCIA_BOTTOM), line(...UP_RAIL),
    line(UP_RAIL[0], UP_FASCIA_TOP[0]),
    ...repeat(UP_BALUSTERS.count, (_, t) => {
      const x = UP_BALUSTERS.from + (UP_BALUSTERS.to - UP_BALUSTERS.from) * t;
      return line([x, yAt(UP_RAIL, x)], [x, yOnPolyline(UP_FASCIA_TOP, x)]);
    }),
    line(...BRICK_EDGE), line(...LEDGE_TOP), line(...LEDGE_FOOT),
    polyline(STRINGER, "structure", true),
    ...treadTips.map((tip) => line(tip, [xAt(STRINGER_TOP_EDGE, tip[1]), tip[1]])),
    line(...HANDRAIL), line(...BOTTOM_RAIL), line(...NEWEL),
    ...repeat(STAIR_BALUSTERS.count, (_, t) => {
      const x = STAIR_BALUSTERS.from + (STAIR_BALUSTERS.to - STAIR_BALUSTERS.from) * t;
      return line([x, yAt(HANDRAIL, x)], [x, yAt(BOTTOM_RAIL, x)]);
    }),
    rect(STAIR_POST.x, STAIR_POST.y, STAIR_POST.w, STAIR_POST.h),
  ];

  const chair = (c: { rail: P[]; seat: P[]; legs: [P, P][] }): Stroke[] => [curve(c.rail, "detail"), polyline(c.seat, "detail"), ...c.legs.map(([a, b]) => line(a, b, "detail"))];
  const detail: Stroke[] = [
    polyline(PICTURE_OUTER, "detail", true), polyline(PICTURE_INNER, "detail", true),
    ...COURSES.map(([a, b]) => line(a, b, "detail")),
    line(...CONSOLE, "detail"), rect(FAR_FRAME.x, FAR_FRAME.y, FAR_FRAME.w, FAR_FRAME.h, "detail"),
    polyline(SOFA, "detail"), line(...SOFA_SEAT, "detail"),
    polyline(TABLE_TOP, "detail", true), polyline(TABLE_EDGE, "detail"), line(...TABLE_STEM, "detail"),
    ellipse(TABLE_FOOT.c, TABLE_FOOT.rx, TABLE_FOOT.ry),
    ...chair(CHAIR_FRONT_LEFT), ...chair(CHAIR_FRONT_RIGHT),
    polyline(RIGHT_TABLE_TOP, "detail", true), line(...RIGHT_TABLE_APRON, "detail"),
    ...RIGHT_TABLE_LEGS.map(([a, b]) => line(a, b, "detail")),
    polyline(MENU_HOLDER, "detail", true),
    ...CANE_BACKS.map((b) => polyline(b, "detail")),
    ...POTS.map((p) => polyline(p, "detail", true)),
  ];

  const lamp: Stroke[] = [polyline(CONSOLE_LAMP, "lamp", true), circle(SCONCE, 4, "lamp")];

  const deg = (a: P, b: P) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  const tuftLeaves = TUFTS.flatMap(({ base, tips }) => tips.flatMap((tip) => TUFT_LEAVES.map(([turn, length]) => [tip, length, deg(base, tip) + turn] as [P, number, number])));
  const stems = TUFTS.flatMap(({ base, tips }) => tips.map((tip) => curve([base, [(base[0] + tip[0]) / 2 + (tip[0] - base[0]) * 0.15, (base[1] + tip[1]) / 2], tip])));
  const leaves: [P, number, number][] = [
    ...PLANT_TALL.leaves, ...tuftLeaves, ...PALM_EDGE,
    ...POTS.flatMap((pot) => {
      const top: P = [(pot[0][0] + pot[1][0]) / 2, pot[0][1]];
      return POT_LEAVES.map(([angle, length]) => [top, length, angle] as [P, number, number]);
    }),
  ];
  const morphs: Record<string, string[]> = {};
  const life: Stroke[] = [
    curve(PLANT_TALL.stem), ...stems,
    ...leaves.map(([base, length, angle], i) => {
      if (i >= 12) return leaf(base, length, angle);
      morphs[`leaf-${i}`] = [leaf(base, length, angle + 7).d];
      return { ...leaf(base, length, angle), id: `leaf-${i}` };
    }),
  ];

  return { id, title: metaFor(id).title, ...frameOf(id), strokes: [...structure, ...detail, ...lamp, ...life], glows: GLOWS, morphs };
}
```

3c. Write `drawings/wall-lamp.ts`. How it is built:
- The rail is two lines broken where the bracket stands in front of it.
- The lamp is a bracket plate (rect), a fitting (circle), the socket dome (`arc` 180° to 360°), the shade's crown (`curve`) and its rim (a full `ellipse`, because the inside of the shade shows from below). The Edison bulb is the `bulb` glyph with id `bulb-0` and two neck lines, all in the lamp layer.
- The mirror is two closed quadrilaterals, the frame and the glass.
- The table lamp is a top ellipse, one shade outline (straight sides and a true half-ellipse rim, built with `n()`), a turned base as two mirrored `curve` profiles through measured `[y, half width]` rows, and a plinth.
- The phone is a handset curve, two bell cups, the cradle bell as the mark's own `arch`, a lid, a body and a base, and a dial of two circles and eight finger holes on a ring, leaving the finger-stop gap. Only the free end of the cord is drawn, so it never crosses the dial.
- The box is its body, the lid seam, two feet and a hasp. The table is its back edge (broken between the objects standing on it), front edge, apron, end and eleven studs.
- The brick is six staggered course lines on the measured mortar pitch of 58, falling 19 units across the frame like the rail. Each course has one head joint hanging below it and one standing above it, so the bond reads without drawing every brick.

```ts
import { frameOf, metaFor } from "@/lib/drawings";
import { bulb } from "@/lib/draw/glyphs";
import { arc, arch, circle, curve, ellipse, line, n, polyline, rect, repeat } from "@/lib/draw/primitives";
import type { Drawing, Layer, P, Stroke } from "@/lib/draw/types";

/*
 * Measured in the 1080-wide frame of stills/brick-lamp.jpg (720x1280 source, so 1080x1920 here).
 * The drawing's frame is its crop [0, 150, 1080, 1580].
 */

// Structure: the black rail and the table.
const PIPE_TOP: [P, P] = [[0, 242], [1080, 223]];
const PIPE_BOTTOM: [P, P] = [[0, 258], [1080, 239]];
const PIPE_GAP: [number, number] = [546, 600]; // the bracket stands in front of the rail here
const TABLE_BACK: [P, P] = [[0, 1452], [1060, 1460]]; // where the top meets the wall
const TABLE_BACK_VISIBLE: [number, number][] = [[0, 122], [223, 468], [628, 757], [1003, 1060]]; // between the objects standing on it
const TABLE_FRONT: [P, P] = [[0, 1528], [1060, 1538]];
const APRON_BOTTOM: [P, P] = [[0, 1562], [1060, 1572]];
const STUDS = { count: 11, x0: 42, pitch: 93, y0: 1548, slope: 10 / 1060, r: 5 };

// Detail: the wall lamp (bracket, socket, shade), the mirror, the table lamp, the phone, the box.
const BRACKET_PLATE = { x: 551, y: 195, w: 10, h: 67 };
const BRACKET_FITTING: P = [578, 228];
const BRACKET_FITTING_R = 18;
const SOCKET_CENTRE: P = [562, 296];
const SOCKET_R = 32;
const SHADE_CROWN: P[] = [[422, 372], [440, 330], [476, 298], [560, 294], [644, 298], [680, 330], [686, 370]];
const SHADE_RIM = { c: [554, 373] as P, rx: 132, ry: 39 };
const MIRROR_OUTER: P[] = [[258, 540], [846, 536], [848, 968], [260, 976]];
const MIRROR_GLASS: P[] = [[304, 594], [803, 592], [804, 930], [306, 934]];
const TABLE_LAMP_TOP = { c: [163, 1147] as P, rx: 98, ry: 20 };
const TABLE_LAMP_SHADE = { topLeft: [65, 1147] as P, topRight: [262, 1147] as P, rimCentre: [169, 1292] as P, rimRx: 121, rimRy: 20 };
const TABLE_LAMP_AXIS = 173;
/** [y, half width] down the turned base, from the shade to the plinth. */
const TABLE_LAMP_PROFILE: [number, number][] = [[1312, 22], [1322, 27], [1340, 29], [1356, 11], [1368, 24], [1384, 26], [1402, 20], [1414, 12], [1432, 18], [1444, 34]];
const TABLE_LAMP_PLINTH = { x: 125, y: 1446, w: 95, h: 40 };
const HANDSET: P[] = [[476, 1312], [482, 1296], [512, 1289], [546, 1285], [582, 1289], [612, 1297], [617, 1316]];
const EARPIECE: P[] = [[460, 1330], [466, 1312], [486, 1312], [492, 1330]];
const MOUTHPIECE: P[] = [[602, 1334], [608, 1316], [626, 1316], [632, 1334]];
const CRADLE_BELL = { base: [545, 1362] as P, span: 32, height: 40 };
const PHONE_LID: P[] = [[478, 1360], [600, 1357], [606, 1377], [482, 1379]];
const PHONE_BODY: P[] = [[487, 1379], [476, 1462], [624, 1462], [598, 1377]];
const PHONE_BASE: P[] = [[452, 1466], [628, 1466], [630, 1482], [450, 1482]];
const DIAL = { c: [545, 1425] as P, r: 30, hub: 11, holeRing: 21, holeR: 3.6, holes: 8, fromDeg: 60, toDeg: 330 };
const CORD: P[] = [[630, 1334], [642, 1352], [632, 1372], [612, 1382]];
const BOX: P[] = [[757, 1346], [997, 1348], [1000, 1487], [760, 1487]];
const BOX_LID_SEAM: [P, P] = [[758, 1412], [998, 1415]];
const BOX_FEET: P[][] = [[[762, 1487], [762, 1508], [782, 1508], [782, 1487]], [[976, 1487], [976, 1514], [998, 1514], [998, 1487]]];
const BOX_HASP = { x: 876, y: 1384, w: 16, h: 26 };

// Brick: six staggered course lines on the mortar rhythm (pitch 58, falling 19 units across the frame like the rail).
const COURSE = { y0: 190, pitch: 58, slope: -19 / 1080 };
/** k: course number from COURSE.y0; below/above: x of the head joint hanging under or standing on the course line. */
const COURSES: { k: number; from: number; to: number; below: number; above: number }[] = [
  { k: 0, from: 30, to: 320, below: 118, above: 250 },
  { k: 3, from: 740, to: 1040, below: 950, above: 820 },
  { k: 5, from: 60, to: 300, below: 130, above: 240 },
  { k: 9, from: 880, to: 1060, below: 1010, above: 925 },
  { k: 12, from: 20, to: 220, below: 80, above: 170 },
  { k: 18, from: 360, to: 640, below: 420, above: 510 },
];

// Lamp: the Edison bulb under the shade.
const BULB: P = [556, 394];
const BULB_R = 15;
const BULB_NECK: [P, P][] = [[[549, 342], [549, 380]], [[563, 342], [563, 380]]];
const GLOW = { x: 556, y: 388, r: 120 };

const yOn = ([a, b]: [P, P], x: number) => a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
const segment = (edge: [P, P], from: number, to: number, layer: Layer = "structure") => line([from, yOn(edge, from)], [to, yOn(edge, to)], layer);

/** A lampshade seen from the side: straight sides and the front half of its rim as a true elliptical arc. */
function shadeOutline(s: typeof TABLE_LAMP_SHADE): Stroke {
  const [cx, cy] = s.rimCentre;
  return {
    d: `M${n(s.topLeft[0])} ${n(s.topLeft[1])}L${n(cx - s.rimRx)} ${n(cy)}A${n(s.rimRx)} ${n(s.rimRy)} 0 0 0 ${n(cx + s.rimRx)} ${n(cy)}L${n(s.topRight[0])} ${n(s.topRight[1])}`,
    layer: "detail",
  };
}

export function wallLampDrawing(): Drawing {
  const id = "wall-lamp";
  const structure: Stroke[] = [
    segment(PIPE_TOP, 0, PIPE_GAP[0]), segment(PIPE_TOP, PIPE_GAP[1], 1080),
    segment(PIPE_BOTTOM, 0, PIPE_GAP[0]), segment(PIPE_BOTTOM, PIPE_GAP[1], 1080),
    ...TABLE_BACK_VISIBLE.map(([a, b]) => segment(TABLE_BACK, a, b)),
    line(...TABLE_FRONT),
    line(...APRON_BOTTOM),
    line(TABLE_BACK[1], APRON_BOTTOM[1]),
  ];

  const detail: Stroke[] = [
    rect(BRACKET_PLATE.x, BRACKET_PLATE.y, BRACKET_PLATE.w, BRACKET_PLATE.h, "detail"),
    circle(BRACKET_FITTING, BRACKET_FITTING_R),
    arc(SOCKET_CENTRE, SOCKET_R, 180, 360),
    curve(SHADE_CROWN, "detail"),
    ellipse(SHADE_RIM.c, SHADE_RIM.rx, SHADE_RIM.ry),
    polyline(MIRROR_OUTER, "detail", true),
    polyline(MIRROR_GLASS, "detail", true),
    ellipse(TABLE_LAMP_TOP.c, TABLE_LAMP_TOP.rx, TABLE_LAMP_TOP.ry),
    shadeOutline(TABLE_LAMP_SHADE),
    curve(TABLE_LAMP_PROFILE.map(([y, w]) => [TABLE_LAMP_AXIS - w, y] as P), "detail"),
    curve(TABLE_LAMP_PROFILE.map(([y, w]) => [TABLE_LAMP_AXIS + w, y] as P), "detail"),
    rect(TABLE_LAMP_PLINTH.x, TABLE_LAMP_PLINTH.y, TABLE_LAMP_PLINTH.w, TABLE_LAMP_PLINTH.h, "detail"),
    curve(HANDSET, "detail"),
    polyline(EARPIECE, "detail", true),
    polyline(MOUTHPIECE, "detail", true),
    arch(CRADLE_BELL.base, CRADLE_BELL.span, CRADLE_BELL.height, "detail"),
    polyline(PHONE_LID, "detail", true),
    polyline(PHONE_BODY, "detail"),
    polyline(PHONE_BASE, "detail", true),
    circle(DIAL.c, DIAL.r),
    circle(DIAL.c, DIAL.hub),
    ...repeat(DIAL.holes, (_, t) => {
      const a = ((DIAL.fromDeg + (DIAL.toDeg - DIAL.fromDeg) * t) * Math.PI) / 180;
      return circle([DIAL.c[0] + Math.cos(a) * DIAL.holeRing, DIAL.c[1] + Math.sin(a) * DIAL.holeRing], DIAL.holeR);
    }),
    curve(CORD, "detail"),
    polyline(BOX, "detail", true),
    line(...BOX_LID_SEAM, "detail"),
    ...BOX_FEET.map((f) => polyline(f, "detail")),
    rect(BOX_HASP.x, BOX_HASP.y, BOX_HASP.w, BOX_HASP.h, "detail"),
    ...repeat(STUDS.count, (i) => {
      const x = STUDS.x0 + i * STUDS.pitch;
      return circle([x, STUDS.y0 + x * STUDS.slope], STUDS.r);
    }),
    ...COURSES.flatMap(({ k, from, to, below, above }) => {
      const y = (x: number) => COURSE.y0 + k * COURSE.pitch + COURSE.slope * x;
      return [
        line([from, y(from)], [to, y(to)], "detail"),
        line([below, y(below)], [below, y(below) + COURSE.pitch], "detail"),
        line([above, y(above)], [above, y(above) - COURSE.pitch], "detail"),
      ];
    }),
  ];

  const lamp: Stroke[] = [
    { ...bulb(BULB, BULB_R), id: "bulb-0" },
    ...BULB_NECK.map(([a, b]) => line(a, b, "lamp")),
  ];

  return { id, title: metaFor(id).title, ...frameOf(id), strokes: [...structure, ...detail, ...lamp], glows: [GLOW] };
}
```

3d. Register both in `drawings/index.ts`. Add these two imports beside the existing ones:

```ts
import { mainFloorDrawing } from "./main-floor";
import { wallLampDrawing } from "./wall-lamp";
```

and these two entries at the end of `DRAWINGS`:

```ts
  "main-floor": mainFloorDrawing,
  "wall-lamp": wallLampDrawing,
```

After Tasks 3, 7, 8 and this task the file reads:

```ts
import type { Drawing } from "@/lib/draw/types";
import { entryDrawing } from "./entry";
import { facadeDrawing } from "./facade";
import { mainFloorDrawing } from "./main-floor";
import { markDrawing } from "./mark";
import { wallLampDrawing } from "./wall-lamp";

export const DRAWINGS: Record<string, () => Drawing> = {
  mark: markDrawing,
  facade: facadeDrawing,
  entry: entryDrawing,
  "main-floor": mainFloorDrawing,
  "wall-lamp": wallLampDrawing,
};

export function drawingFor(id: string): Drawing {
  const make = DRAWINGS[id];
  if (!make) throw new Error(`No drawing module for "${id}"`);
  return make();
}
```

- [ ] **Step 4: Run to verify it passes, then review the renders**

Run: `npm test -- drawing-main-floor-wall-lamp`
Expected: PASS, 10 tests (4 per drawing and 2 specifics).

Run: `npm test -- drawings`
Expected: PASS, including `main-floor is valid and within budget` and `wall-lamp is valid and within budget`.

Run: `npx tsc --noEmit`
Expected: no output. Both modules were also checked with `noUnusedLocals`, so they import nothing they do not use.

Run: `npx tsx scripts/review.ts main-floor && npx tsx scripts/review.ts wall-lamp`
Expected:
```
main-floor: 151 strokes (budget 300) { structure: 68, detail: 39, life: 42, lamp: 2 }
review/main-floor-overlay.png
wall-lamp: 78 strokes (budget 140) { structure: 11, detail: 64, life: 0, lamp: 3 }
review/wall-lamp-overlay.png
```

Read all six PNGs (`review/<id>-drawing.png`, `-phone.png`, `-overlay.png`) and check each item:
- One weight everywhere, round caps. No stroke shorter than 12 frame units; the test already guards this, so look for anything that reads as a fragment anyway.
- Closed shapes close: the stringer, the tables, the pots, the picture, the mirror, the phone base, the box, the plinth.
- Overlay, main floor: the stringer band sits on the black stringer, and each tread line lies on a tread plate. The handrail and bottom rail follow the photograph's rails. The near mezzanine's balusters stand between its rail and its grey fascia. The column, the stair post and the window jamb sit within about 15 units of the photograph's edges. The two tables and four chairs sit on their photographed positions.
- Overlay, wall lamp: the rim ellipse traces the shade's lower edge, and the bulb sits in the bulb. The mirror's two quadrilaterals trace the outer moulding and the glass. The table lamp's profile follows the turned green base. The dial circle sits on the dial. The box outline and seam match. The course lines lie on mortar joints; move `COURSE.y0` a few units if they sit on brick faces.
- Phone PNG, main floor: at 390 px you can tell at a glance that it is a tall room with an open steel stair rising right, a railed mezzanine, a picture on brick, pots and plants at the stair's foot, and a table in front.
- Phone PNG, wall lamp: the lamp over a mirror, and a table lamp, a phone and a box standing on a studded table.
- Nothing is drawn that the photograph does not show. No person, and no magazine layout line.
- If a phone PNG is muddy, delete detail strokes in this order and rerun the review. Wall lamp: the eight dial holes (`DIAL.holes = 0`), then the studs. Main floor: `FAR_FRAME` and `CONSOLE`, then `SOFA_SEAT`. Never delete structure.

- [ ] **Step 5: Look**

Run `npm run dev` (port 3021). With Playwright MCP, open each URL, take a screenshot and Read it:
- `http://localhost:3021/lab/main-floor?mode=static&at=14:00` at 390x844 and at 1440x900
- `http://localhost:3021/lab/main-floor?mode=static&at=01:00` at 390x844 and at 1440x900
- `http://localhost:3021/lab/wall-lamp?mode=static&at=14:00` at 390x844 and at 1440x900
- `http://localhost:3021/lab/wall-lamp?mode=static&at=01:00` at 390x844 and at 1440x900
- `http://localhost:3021/lab/main-floor?mode=draw&at=14:00` at 390x844, shot at 0.4 s and at 3 s

Checklist:
- 390 day: the whole main floor fits the column width. Its lines are ink on the neutral paper, 1.25 px wide and never thicker at any zoom. The stair, the mezzanine railing, the picture, the pots, the plants and the front table are all distinguishable.
- 390 day, wall lamp: the drawing is taller than the screen, so scroll once. The lamp, mirror, table lamp, phone dial, box and studs all read. The brick courses read as brick, not as stray dashes.
- 1440: same weight (1.5 px). Nothing looks sparse or clumsy at the larger size, and no dial hole or stud turns into a blob.
- 01:00: night ground and night ink. On the main floor a soft lamp glow sits on the wall light above the far mezzanine, and nowhere else. On the wall lamp a warm glow of about a third of the shade's width surrounds the bulb, and the bulb and its neck take the lamp colour.
- `mode=draw` at 0.4 s: structure is drawing first (steel, mezzanines, stair). At 3 s everything is complete, and the svg has `data-drawn`.
- No console errors in any of the screenshots' pages.

- [ ] **Step 6: Commit**

```bash
git add drawings/main-floor.ts drawings/wall-lamp.ts drawings/index.ts tests/drawing-main-floor-wall-lamp.test.ts
git commit -m "feat: main floor and wall lamp drawings"
```

---

### Task 10: The mezzanine drawings

Two drawings of the mezzanine, one by day and one at night. By day it is the AD India photograph (`raw/ad-2.jpg`, photo only): the open steel stair coming down toward you past the tall double-hung windows, the black column and transom beam, the two wall lamps, the shared tables below. At night it is `stills/night-city-window.jpg`: the black beams converging on the glazing, three pendants over the long shared table, woven chairs round it, the brick wall with its frames, and the city lit through the glass. Every coordinate below was measured on the whole-source grid (1080-wide frame) and checked by rendering the module over the photograph. The engineer refines against `review/<id>-overlay.png`.

Things left out on purpose. No laptop glyph: no laptop is visible in the night still. No person. On the night still, the white sculpture on the brick wall is not drawn (it is a figure), nor the grey cushion on the sofa, nor the foreground chair below the crop. The neon lettering outside becomes a point of light, not text. No guided contours are used. On `ad-2` nothing from the magazine's text or logos falls inside the crop.

**Files:**
- Create: `drawings/mezzanine-stair.ts`, `drawings/mezzanine-night.ts`
- Modify: `drawings/index.ts` (import `mezzanineStairDrawing` and `mezzanineNightDrawing`; add the `"mezzanine-stair"` and `"mezzanine-night"` entries)
- Test: `tests/drawing-mezzanine.test.ts`

**Interfaces:**
- Consumes: `Drawing`, `Glow`, `P`, `Stroke` (`lib/draw/types.ts`); `line`, `polyline`, `rect`, `circle`, `ellipse`, `arc`, `curve`, `repeat`, `repeatMany` (`lib/draw/primitives.ts`); `along`, `perspectiveSteps` (`lib/draw/perspective.ts`); `leaf`, `bulb` (`lib/draw/glyphs.ts`); `metaFor`, `frameOf` (`lib/drawings.ts`); `DRAWINGS`, `drawingFor` (`drawings/index.ts`, with Task 9's entries); `scripts/review.ts`, `scripts/guides/build.mjs`, `scripts/guides/grid.mjs`; `svg-path-properties`; `/lab/<id>` (Task 6).
- Produces:
  - `mezzanineStairDrawing(): Drawing`: id `mezzanine-stair`, frame `x 70, y 50, width 656, height 982`, 112 strokes (structure 71, detail 30, life 5, lamp 6), bulbs `bulb-0` (left wall lamp) and `bulb-1` (right wall lamp), `glows: [{ x: 452, y: 466, r: 60 }, { x: 649, y: 476, r: 60 }]`, `morphs` for `leaf-0` to `leaf-3` (the banana plant at the stair's foot).
  - `mezzanineNightDrawing(): Drawing`: id `mezzanine-night`, frame `x 0, y 60, width 1080, height 1340`, 89 strokes (structure 19, detail 51, life 7, lamp 12), bulbs `bulb-0` to `bulb-2` (the pendants, left to right), 12 glows (pendants at `[464.5, 654]` r 110, `[518.5, 645]` r 90, `[584, 633]` r 110, and nine city lights of r 40 or 60), `morphs` for `leaf-0` to `leaf-5`.
  - `DRAWINGS["mezzanine-stair"]`, `DRAWINGS["mezzanine-night"]`.
  - Measured anchors later tasks can point at (Task 16 vignettes, Task 18 annotations): stair day: tall windows `[455, 290]`, transom beam `[470, 398]`, black column `[610, 400]`, open treads `[240, 600]`, concrete steps `[200, 940]`, wall lamps `[452, 458]` and `[649, 468]`, shared table `[590, 760]`, duct `[296, 100]`, upper railing `[200, 200]`; night: pendants `[520, 600]`, glazing `[830, 760]`, long table `[600, 960]`, brick wall `[300, 800]`, frames `[265, 706]`, sofa `[120, 895]`, beams `[540, 355]`, track lights `[830, 171]`.

- [ ] **Step 1: Write the failing test `tests/drawing-mezzanine.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { svgPathProperties } from "svg-path-properties";
import { DRAWINGS, drawingFor } from "@/drawings";
import { metaFor } from "@/lib/drawings";
import type { Drawing } from "@/lib/draw/types";

const MIN_STROKE = 12; // frame units: nothing shorter except bulbs
const MARGIN = 24; // a stroke may run to the sheet's edge and be clipped, never wander off it

function survey(d: Drawing) {
  const x0 = d.x ?? 0;
  const y0 = d.y ?? 0;
  const x1 = x0 + d.width;
  const y1 = y0 + d.height;
  const tooShort: string[] = [];
  const outside: string[] = [];
  for (const s of d.strokes) {
    const props = new svgPathProperties(s.d);
    const len = props.getTotalLength();
    if (len < MIN_STROKE && !s.id?.startsWith("bulb-")) tooShort.push(s.d);
    for (let at = 0; at <= len; at += 8) {
      const p = props.getPointAtLength(at);
      if (p.x < x0 - MARGIN || p.x > x1 + MARGIN || p.y < y0 - MARGIN || p.y > y1 + MARGIN) {
        outside.push(s.d);
        break;
      }
    }
  }
  return { x0, y0, x1, y1, tooShort, outside };
}

const skeleton = (path: string) => path.replace(/-?[\d.]+/g, "#");

describe.each(["mezzanine-stair", "mezzanine-night"])("%s drawing", (id) => {
  it("is registered, framed on its crop and within its stroke budget", () => {
    expect(DRAWINGS[id]).toBeTypeOf("function");
    const d = drawingFor(id);
    const meta = metaFor(id);
    expect(d.id).toBe(id);
    expect(d.title).toBe(meta.title);
    expect([d.x, d.y, (d.x ?? 0) + d.width, (d.y ?? 0) + d.height]).toEqual(meta.crop);
    expect(d.strokes.length).toBeLessThanOrEqual(meta.strokeBudget);
  });

  it("has no fragments and keeps every line on the sheet", () => {
    const { tooShort, outside } = survey(drawingFor(id));
    expect(tooShort).toEqual([]);
    expect(outside).toEqual([]);
  });

  it("names its bulbs and leaves the way the life engine expects", () => {
    const d = drawingFor(id);
    const ids = d.strokes.map((s) => s.id).filter((v): v is string => Boolean(v));
    expect(new Set(ids).size).toBe(ids.length);
    const bulbs = d.strokes.filter((s) => s.id?.startsWith("bulb-"));
    bulbs.forEach((s, i) => {
      expect(s.id).toBe(`bulb-${i}`);
      expect(s.layer).toBe("lamp");
    });
    const leaves = d.strokes.filter((s) => s.id?.startsWith("leaf-"));
    const morphs = d.morphs ?? {};
    expect(leaves.length).toBeLessThanOrEqual(12);
    expect(Object.keys(morphs).sort()).toEqual(leaves.map((s) => s.id!).sort());
    for (const s of leaves) {
      expect(s.layer).toBe("life");
      expect(morphs[s.id!]).toHaveLength(1);
      expect(skeleton(morphs[s.id!][0])).toBe(skeleton(s.d));
    }
    expect(ids.every((v) => /^(bulb|leaf)-\d+$/.test(v))).toBe(true);
  });

  it("puts every glow on the sheet at a lamp's radius", () => {
    const d = drawingFor(id);
    const { x0, y0, x1, y1 } = survey(d);
    expect((d.glows ?? []).length).toBeGreaterThan(0);
    for (const g of d.glows ?? []) {
      expect(g.x).toBeGreaterThanOrEqual(x0);
      expect(g.x).toBeLessThanOrEqual(x1);
      expect(g.y).toBeGreaterThanOrEqual(y0);
      expect(g.y).toBeLessThanOrEqual(y1);
      expect(g.r).toBeGreaterThanOrEqual(40);
      expect(g.r).toBeLessThanOrEqual(140);
    }
  });
});

describe("what each drawing carries", () => {
  it("stair by day: the two wall lamps are the bulbs and the glows", () => {
    const d = drawingFor("mezzanine-stair");
    expect(d.strokes.filter((s) => s.id?.startsWith("bulb-")).map((s) => s.id)).toEqual(["bulb-0", "bulb-1"]);
    expect(d.glows).toHaveLength(2);
    expect(d.strokes.filter((s) => s.layer === "structure").length).toBeGreaterThanOrEqual(60);
  });

  it("night: three pendant bulbs, six to ten city lights, a glow for each, and no laptop", () => {
    const d = drawingFor("mezzanine-night");
    const lamp = d.strokes.filter((s) => s.layer === "lamp");
    const bulbs = lamp.filter((s) => s.id?.startsWith("bulb-"));
    const city = lamp.filter((s) => !s.id);
    expect(bulbs.map((s) => s.id)).toEqual(["bulb-0", "bulb-1", "bulb-2"]);
    expect(city.length).toBeGreaterThanOrEqual(6);
    expect(city.length).toBeLessThanOrEqual(10);
    expect(city.every((s) => /A/.test(s.d))).toBe(true); // city lights are circles
    expect(d.glows).toHaveLength(bulbs.length + city.length);
    expect(d.strokes.some((s) => s.id?.includes("laptop"))).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- drawing-mezzanine`
Expected: FAIL. `expected undefined to be type of function` for both ids, and the other cases throw `No drawing module for "mezzanine-stair"` / `No drawing module for "mezzanine-night"`.

- [ ] **Step 3: Implement**

3a. Build the guides and grids, then read both grids:

```bash
node scripts/guides/build.mjs mezzanine-stair mezzanine-night
node scripts/guides/grid.mjs mezzanine-stair
node scripts/guides/grid.mjs mezzanine-night
```

Read `guides/mezzanine-stair/grid.png` and `guides/mezzanine-night/grid.png`. In `ad-2` the photograph occupies x 68 to 728 and y 50 to 1035 of the layout; the crop `[70, 50, 726, 1032]` stays inside it. The night still is 1080x1650; the crop `[0, 60, 1080, 1400]` starts below the reel's logo and stops above the foreground chair.

3b. Write `drawings/mezzanine-stair.ts`. How it is built:
- The four tall sashes come from one `sash()` builder: jambs and head (or sill) as one polyline, left open where the transom beam closes them, a vertical muntin, and two horizontal bars. The third window at the right edge is cut by the crop.
- The column is a rect. The transom beam and the ceiling beam are pairs of horizontal lines, broken where the column and the duct stand in front of them.
- The stair comes toward the camera, so its fourteen open treads are horizontal lines. Their heights come from `perspectiveSteps(14, 1, 1.85)` (within 2.3 units of the measured treads), with each end interpolated by `along` from the near tread to the far one. The stringer is two lines. The thin handrail and the black newel post (a closed polyline) stand on the open side.
- The upper flight's edge along the brick wall, its rail, six balusters and the landing are straight lines.
- The concrete steps at the bottom are six horizontal edges and a side line.
- The shared tables are closed tops, edges, stems and a foot ellipse. The bentwood chairs are arm rails (`curve`), with one seat line running from the rail round the seat and legs that start on the seat.
- The two wall lamps are trapezoid shades with bulb glyphs. The banana plant is a stem and four leaves with morphs.

```ts
import { frameOf, metaFor } from "@/lib/drawings";
import { bulb, leaf } from "@/lib/draw/glyphs";
import { along, perspectiveSteps } from "@/lib/draw/perspective";
import { arc, curve, ellipse, line, polyline, rect, repeat, repeatMany } from "@/lib/draw/primitives";
import type { Drawing, Glow, P, Stroke } from "@/lib/draw/types";

/*
 * Measured in the 1080-wide frame of raw/ad-2.jpg (the AD India layout, 1080x1350).
 * The drawing's frame is its crop [70, 50, 726, 1032]: the photograph only, without the magazine's text and logos.
 */

// ---- Structure: ceiling beam, gable rafter, column, transom beam and the tall windows.
const BEAM_TOP = 98;
const BEAM_BOTTOM = 117;
const BEAM_SPAN: [number, number] = [182, 600];
const DUCT_GAP: [number, number] = [264, 330]; // the duct hangs in front of the beam here
const RAFTER: [P, P][] = [[[610, 95], [726, 170]], [[610, 115], [726, 200]]];
const COLUMN = { x: 600, y: 104, w: 20, h: 593 };
const TRANSOM_TOP = 387;
const TRANSOM_BOTTOM = 410;
const TRANSOM_SPAN: [number, number] = [338, 726];

/** One tall window: left and right jambs, vertical muntin, and the y of its horizontal muntins. */
interface Sash { x0: number; x1: number; y0: number; y1: number; muntin: number; bars: number[]; open: "top" | "bottom" }
const SASHES: Sash[] = [
  { x0: 342, x1: 437, y0: 185, y1: TRANSOM_TOP, muntin: 387, bars: [257, 322], open: "bottom" },
  { x0: 472, x1: 567, y0: 185, y1: TRANSOM_TOP, muntin: 518, bars: [257, 322], open: "bottom" },
  { x0: 340, x1: 435, y0: TRANSOM_BOTTOM, y1: 640, muntin: 387, bars: [490, 565], open: "top" },
  { x0: 470, x1: 566, y0: TRANSOM_BOTTOM, y1: 640, muntin: 516, bars: [490, 565], open: "top" },
];
const RIGHT_WINDOW = { outline: [[726, 464], [667, 464], [667, 640], [726, 640]] as P[], muntin: 710, bar: 565 };

// ---- Structure: the upper flight's edge and railing along the brick wall, the landing, the open stair, the concrete steps.
const FLIGHT_EDGE_TOP: [P, P] = [[70, 60], [252, 355]];
const FLIGHT_EDGE_BOTTOM: [P, P] = [[70, 80], [252, 375]];
const UPPER_RAIL: [P, P] = [[165, 50], [252, 252]];
const UPPER_BALUSTERS = [88, 118, 148, 178, 208, 238];
const LANDING: [P, P][] = [[[252, 360], [334, 360]], [[252, 375], [334, 375]]];

const TREADS = 14;
const TREAD_NEAR = { y: 789, left: 130, right: 304 };
const TREAD_FAR = { y: 383, left: 250, right: 329 };
const TREAD_FAR_Z = 1.85; // fitted to the fourteen measured tread heights
const STRINGER: [P, P][] = [[[292, 372], [212, 840]], [[312, 372], [240, 840]]];
const HANDRAIL: [P, P] = [[346, 262], [332, 700]];
const NEWEL: P[] = [[309, 450], [329, 450], [321, 915], [301, 915]];

const STEP_LINES: { y: number; from: number; to: number }[] = [
  { y: 841, from: 118, to: 330 }, // first step, back edge
  { y: 872, from: 104, to: 329 }, // nosing
  { y: 907, from: 90, to: 328 },
  { y: 942, from: 79, to: 326 },
  { y: 978, from: 72, to: 326 },
  { y: 1018, from: 70, to: 326 },
];
const STEPS_SIDE: [P, P] = [[330, 841], [326, 1032]];
const LEDGE: [P, P][] = [[[322, 700], [350, 700]], [[350, 700], [350, 1032]]];
const PLATFORM: [P, P][] = [[[350, 697], [726, 701]], [[352, 722], [726, 730]]];

// ---- Detail: the duct, the tables and chairs.
const DUCT_EDGES: [P, P][] = [[[268, 50], [286, 150]], [[316, 50], [326, 150]]];
const DUCT_DISCS: { c: P; rx: number; ry: number }[] = [{ c: [290, 70], rx: 28, ry: 9 }, { c: [304, 132], rx: 24, ry: 12 }];

const BACK_TABLE = { top: [[417, 673], [572, 680]] as [P, P], legs: [[[422, 686], [426, 776]], [[565, 690], [568, 738]]] as [P, P][] };
const BACK_CHAIRS: P[][] = [[[442, 722], [442, 672], [497, 673], [496, 722]], [[500, 722], [500, 673], [557, 673], [556, 722]]];
const RIGHT_BACK_TABLE = { top: [[661, 673], [726, 676]] as [P, P], leg: [[666, 682], [665, 728]] as [P, P] };

const TABLE_TOP: P[] = [[472, 741], [650, 735], [713, 775], [495, 779]];
const TABLE_EDGE: [P, P] = [[495, 790], [712, 786]];
const TABLE_STEM: [P, P] = [[580, 790], [580, 884]];
const TABLE_FOOT = { c: [577, 905] as P, rx: 58, ry: 22 };
const CONDIMENTS = { x: 559, y: 723, w: 25, h: 32 };

/** Bentwood chairs: the curved arm rail, the back post and seat edge as one line, and legs that start on the seat. */
const CHAIRS: { rail: P[]; seat?: P[]; legs: [P, P][] }[] = [
  { rail: [[430, 778], [434, 758], [470, 750], [518, 768]], seat: [[436, 790], [456, 812], [548, 834]], legs: [[[456, 812], [416, 900]], [[500, 823], [470, 934]], [[548, 834], [556, 880]]] },
  { rail: [[561, 784], [580, 780], [668, 784], [690, 798]], seat: [[561, 786], [556, 828], [672, 844], [690, 800]], legs: [[[558, 828], [542, 925]], [[600, 834], [592, 986]], [[672, 844], [690, 894]]] },
  { rail: [[634, 878], [649, 855], [726, 853]], legs: [[[645, 902], [626, 1025]]] },
  { rail: [[490, 734], [503, 725], [557, 727]], legs: [] },
  { rail: [[641, 742], [688, 738], [726, 752]], legs: [] },
];

// ---- Lamp: the two wall lamps on the brick piers.
const LEFT_LAMP = { shade: [[434, 464], [444, 452], [460, 452], [470, 464]] as P[], bracket: [452, 447] as P, bulb: [452, 468] as P };
const RIGHT_LAMP = { rod: [[638, 450], [726, 451]] as [P, P], shade: [[632, 474], [641, 462], [657, 462], [667, 474]] as P[], bulb: [649, 478] as P };
const GLOWS: Glow[] = [{ x: 452, y: 466, r: 60 }, { x: 649, y: 476, r: 60 }];

// ---- Life: the banana plant at the foot of the open stair. [base, length, angle]
const BANANA_STEM: P[] = [[338, 700], [336, 640], [344, 598]];
const BANANA_LEAVES: [P, number, number][] = [[[344, 600], 48, -25], [[340, 620], 40, 15], [[337, 640], 34, -150], [[336, 612], 36, -80]];

const hLine = (y: number, from: number, to: number): Stroke => line([from, y], [to, y]);
const yAt = ([a, b]: [P, P], x: number) => a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);

function sash(s: Sash): Stroke[] {
  const outline: P[] = s.open === "bottom"
    ? [[s.x0, s.y1], [s.x0, s.y0], [s.x1, s.y0], [s.x1, s.y1]]
    : [[s.x0, s.y0], [s.x0, s.y1], [s.x1, s.y1], [s.x1, s.y0]];
  return [polyline(outline), line([s.muntin, s.y0], [s.muntin, s.y1]), ...s.bars.map((y) => hLine(y, s.x0, s.x1))];
}

export function mezzanineStairDrawing(): Drawing {
  const id = "mezzanine-stair";
  const steps = perspectiveSteps(TREADS, 1, TREAD_FAR_Z);
  const lefts = along([TREAD_NEAR.left, TREAD_NEAR.y], [TREAD_FAR.left, TREAD_FAR.y], steps);
  const rights = along([TREAD_NEAR.right, TREAD_NEAR.y], [TREAD_FAR.right, TREAD_FAR.y], steps);

  const structure: Stroke[] = [
    ...repeatMany(2, (i) => {
      const y = i ? BEAM_BOTTOM : BEAM_TOP;
      return [hLine(y, BEAM_SPAN[0], DUCT_GAP[0]), hLine(y, DUCT_GAP[1], BEAM_SPAN[1])];
    }),
    ...RAFTER.map(([a, b]) => line(a, b)),
    rect(COLUMN.x, COLUMN.y, COLUMN.w, COLUMN.h),
    ...[TRANSOM_TOP, TRANSOM_BOTTOM].flatMap((y) => [hLine(y, TRANSOM_SPAN[0], COLUMN.x), hLine(y, COLUMN.x + COLUMN.w, TRANSOM_SPAN[1])]),
    ...SASHES.flatMap(sash),
    polyline(RIGHT_WINDOW.outline),
    line([RIGHT_WINDOW.muntin, RIGHT_WINDOW.outline[1][1]], [RIGHT_WINDOW.muntin, RIGHT_WINDOW.outline[2][1]]),
    hLine(RIGHT_WINDOW.bar, RIGHT_WINDOW.outline[1][0], 726),
    line(...FLIGHT_EDGE_TOP), line(...FLIGHT_EDGE_BOTTOM),
    line(...UPPER_RAIL), line(UPPER_RAIL[1], [UPPER_RAIL[1][0], LANDING[0][0][1]]),
    ...UPPER_BALUSTERS.map((x) => line([x, x < UPPER_RAIL[0][0] ? 50 : yAt(UPPER_RAIL, x)], [x, yAt(FLIGHT_EDGE_TOP, x)])),
    ...LANDING.map(([a, b]) => line(a, b)),
    ...repeat(TREADS, (i) => line(lefts[i], rights[i])),
    ...STRINGER.map(([a, b]) => line(a, b)),
    line(...HANDRAIL),
    polyline(NEWEL, "structure", true),
    ...STEP_LINES.map(({ y, from, to }) => hLine(y, from, to)),
    line(...STEPS_SIDE),
    ...LEDGE.map(([a, b]) => line(a, b)),
    ...PLATFORM.map(([a, b]) => line(a, b)),
  ];

  const detail: Stroke[] = [
    ...DUCT_EDGES.map(([a, b]) => line(a, b, "detail")),
    ...DUCT_DISCS.map(({ c, rx, ry }) => ellipse(c, rx, ry)),
    line(...BACK_TABLE.top, "detail"),
    ...BACK_TABLE.legs.map(([a, b]) => line(a, b, "detail")),
    ...BACK_CHAIRS.map((c) => polyline(c, "detail")),
    line(...RIGHT_BACK_TABLE.top, "detail"), line(...RIGHT_BACK_TABLE.leg, "detail"),
    polyline(TABLE_TOP, "detail", true), line(...TABLE_EDGE, "detail"), line(...TABLE_STEM, "detail"),
    ellipse(TABLE_FOOT.c, TABLE_FOOT.rx, TABLE_FOOT.ry),
    rect(CONDIMENTS.x, CONDIMENTS.y, CONDIMENTS.w, CONDIMENTS.h, "detail"),
    ...CHAIRS.flatMap((c) => [curve(c.rail, "detail"), ...(c.seat ? [polyline(c.seat, "detail")] : []), ...c.legs.map(([a, b]) => line(a, b, "detail"))]),
  ];

  const lamp: Stroke[] = [
    polyline(LEFT_LAMP.shade, "lamp", true), arc(LEFT_LAMP.bracket, 6, 180, 360, "lamp"), { ...bulb(LEFT_LAMP.bulb, 4), id: "bulb-0" },
    line(...RIGHT_LAMP.rod, "lamp"), polyline(RIGHT_LAMP.shade, "lamp", true), { ...bulb(RIGHT_LAMP.bulb, 4), id: "bulb-1" },
  ];

  const morphs: Record<string, string[]> = {};
  const life: Stroke[] = [
    curve(BANANA_STEM),
    ...BANANA_LEAVES.map(([base, length, angle], i) => {
      morphs[`leaf-${i}`] = [leaf(base, length, angle + 7).d];
      return { ...leaf(base, length, angle), id: `leaf-${i}` };
    }),
  ];

  return { id, title: metaFor(id).title, ...frameOf(id), strokes: [...structure, ...detail, ...lamp, ...life], glows: GLOWS, morphs };
}
```

3c. Write `drawings/mezzanine-night.ts`. How it is built:
- The ceiling is five beam polylines that converge on the glazing (measured with the frame's slight lens bow), a bulkhead edge, six track-light rects, and the header over the glass.
- The glazing is a jamb, four mullions that start on the window head (one starts on the upper transom, where the photograph shows it) and are lost behind the chair backs, and two transoms.
- The brick wall is its top, its corner and its end, with five frame rects.
- Each pendant is its cord from the ceiling rose, a dome `curve` through the rim and the cap, a rim line, and a bulb glyph under the rim (`bulb-0` to `bulb-2`) with a glow.
- The long table is a closed four-corner top seen from its left end, a front edge and three legs.
- The chairs are simplified arcs, as the contract asks: six woven backs as single `curve`s round the table. The two nearest chairs add a seat edge and frame lines from the rail or seat to the floor.
- The sofa corner, round coffee table and striped pouf (a circle and one meridian ellipse) sit on the left, with four plank seams receding on the floor.
- The city is nine small lamp-layer circles, one on each bright light in the glass, each with a glow. The palm by the wall and the plant beyond the table are six leaves with morphs.

```ts
import { frameOf, metaFor } from "@/lib/drawings";
import { bulb, leaf } from "@/lib/draw/glyphs";
import { circle, curve, ellipse, line, polyline, rect } from "@/lib/draw/primitives";
import type { Drawing, Glow, P, Stroke } from "@/lib/draw/types";

/*
 * Measured in the 1080-wide frame of stills/night-city-window.jpg (1080x1650).
 * The drawing's frame is its crop [0, 60, 1080, 1400]: below the reel's logo, above the foreground chair.
 * Not drawn: the white sculpture on the brick wall (it is a figure), the cat-shaped cushion on the sofa, any person.
 * No laptop is drawn: none is visible in this still.
 */

// ---- Structure: the ceiling's black beams converging to the right, the header over the glazing, the glazing grid, the brick wall.
const BULKHEAD: [P, P] = [[0, 262], [92, 60]];
const BEAMS: P[][] = [
  [[400, 60], [1080, 186]],
  [[40, 180], [540, 250], [1040, 310]],
  [[0, 295], [540, 355], [840, 380]],
  [[0, 372], [540, 420], [690, 432]],
  [[0, 425], [540, 460], [600, 468]],
];
const HEADER: [P, P][] = [[[380, 546], [1080, 302]], [[560, 544], [1080, 448]]];
const WINDOW_HEAD: [P, P] = [[600, 578], [1080, 476]];
const WALL_TOP: [P, P] = [[0, 558], [376, 560]];
const WALL_CORNER: [P, P] = [[380, 562], [380, 830]];
const BRICK_END: [P, P] = [[588, 616], [588, 905]];
const JAMB: [P, P] = [[600, 578], [600, 930]];
/** Mullions: x, and where each is lost behind the chairs. Tops sit on the window head; the one at 770 starts at the upper transom. */
const MULLIONS: { x: number; to: number; fromTransom?: boolean }[] = [
  { x: 672, to: 915 }, { x: 770, to: 975, fromTransom: true }, { x: 888, to: 958 }, { x: 1047, to: 1056 },
];
const TRANSOMS: [P, P][] = [[[600, 698], [1080, 664]], [[600, 826], [1080, 857]]];

// ---- Detail: pendant cords, track lights, picture frames, the long table and chairs, the sofa corner, the floor.
const TRACK_LIGHTS: [number, number, number, number][] = [[178, 398, 10, 32], [367, 412, 10, 34], [430, 462, 10, 30], [565, 118, 11, 50], [825, 142, 11, 58], [1040, 188, 11, 46]];
const FRAMES: [number, number, number, number][] = [[224, 671, 83, 70], [232, 678, 68, 56], [226, 743, 38, 28], [476, 668, 43, 69], [12, 664, 59, 41]];

/** Three pendants: the ceiling rose, the top of the shade (where the cord ends) and the rim. */
const PENDANTS: { rose: P; top: [number, number, number]; rim: [number, number, number] }[] = [
  { rose: [461, 340], top: [452, 470, 580], rim: [424, 505, 640] },
  { rose: [514, 306], top: [505, 530, 600], rim: [474, 563, 631] },
  { rose: [579, 270], top: [576, 597, 548], rim: [536, 632, 619] },
];

const TABLE_TOP: P[] = [[337, 930], [560, 918], [870, 986], [596, 1016]];
const TABLE_EDGE: P[] = [[337, 938], [596, 1024], [870, 994]];
const TABLE_LEGS: [P, P][] = [[[598, 1024], [592, 1270]], [[440, 986], [452, 1250]], [[776, 1004], [790, 1215]]];

/** Chair backs seen over the table and round its ends, drawn as single arcs of the woven back. */
const CHAIR_BACKS: P[][] = [
  [[300, 904], [360, 900], [418, 927]],
  [[596, 904], [648, 890], [685, 912]],
  [[685, 930], [730, 916], [774, 934]],
  [[774, 952], [818, 941], [878, 964]],
  [[868, 985], [918, 972], [993, 997]],
  [[300, 860], [370, 830], [440, 850]],
];
/** The two chairs nearest the camera: arm rail, seat edge, and frame lines that run from the rail or seat to the floor. */
const CHAIR_FRONT_LEFT = { rail: [[285, 1025], [380, 1015], [500, 1035]] as P[], seat: [[320, 1105], [495, 1105]] as [P, P], frame: [[[290, 1030], [278, 1250]], [[360, 1105], [345, 1280]], [[500, 1035], [494, 1105], [515, 1260]]] as P[][] };
const CHAIR_FRONT_RIGHT = { rail: [[662, 1065], [750, 1048], [925, 1050]] as P[], seat: [[665, 1144], [910, 1165]] as [P, P], frame: [[[662, 1065], [665, 1190], [675, 1320]], [[925, 1050], [908, 1164], [940, 1350]], [[750, 1152], [795, 1390]]] as P[][] };

const SOFA: P[] = [[0, 878], [250, 872], [270, 905]];
const SOFA_SEAT: [P, P] = [[0, 918], [180, 918]];
const COFFEE_TABLE = { c: [160, 932] as P, rx: 75, ry: 9 };
const POUF = { c: [105, 990] as P, r: 42, stripeRx: 18 };
const POT: P[] = [[10, 1062], [60, 1062], [55, 1210], [15, 1210]];
const PLANKS: [P, P][] = [[[0, 1100], [300, 1340]], [[120, 1150], [420, 1400]], [[420, 1290], [700, 1400]], [[820, 1330], [1080, 1395]]];

// ---- Lamp: pendant bulbs and the city through the glass.
const CITY_LIGHTS: [number, number, number][] = [[1004, 632, 7], [901, 561, 4], [941, 579, 4], [804, 586, 4], [910, 607, 4], [1000, 726, 6], [906, 876, 7], [740, 760, 6], [895, 770, 5]];

// ---- Life: the palm by the wall and the plant beyond the table. [base, length, angle]
const PALM_STEM: P[] = [[20, 900], [40, 840], [60, 785]];
const LEAVES: [P, number, number][] = [
  [[60, 780], 90, -60], [[60, 780], 80, -20], [[60, 790], 70, -100], [[60, 790], 64, 20],
  [[826, 962], 50, -80], [[834, 960], 42, -40],
];

const yAt = ([a, b]: [P, P], x: number) => a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);

export function mezzanineNightDrawing(): Drawing {
  const id = "mezzanine-night";

  const structure: Stroke[] = [
    line(...BULKHEAD),
    ...BEAMS.map((b) => polyline(b)),
    ...HEADER.map(([a, b]) => line(a, b)),
    line(...WINDOW_HEAD), line(...WALL_TOP), line(...WALL_CORNER), line(...BRICK_END), line(...JAMB),
    ...MULLIONS.map(({ x, to, fromTransom }) => line([x, fromTransom ? yAt(TRANSOMS[0], x) : yAt(WINDOW_HEAD, x)], [x, to])),
    ...TRANSOMS.map(([a, b]) => line(a, b)),
  ];

  const detail: Stroke[] = [
    ...TRACK_LIGHTS.map(([x, y, w, h]) => rect(x, y, w, h, "detail")),
    ...FRAMES.map(([x, y, w, h]) => rect(x, y, w, h, "detail")),
    ...PENDANTS.flatMap(({ rose, top: [tl, tr, ty], rim: [rl, rr, ry] }) => {
      const cx = (tl + tr) / 2;
      const w = rr - rl;
      return [
        line(rose, [cx, ty], "detail"),
        curve([[rl, ry], [rl + w * 0.1, ry - (ry - ty) * 0.5], [tl, ty], [tr, ty], [rr - w * 0.1, ry - (ry - ty) * 0.5], [rr, ry]], "detail"),
        line([rl, ry], [rr, ry], "detail"),
      ];
    }),
    polyline(TABLE_TOP, "detail", true), polyline(TABLE_EDGE, "detail"),
    ...TABLE_LEGS.map(([a, b]) => line(a, b, "detail")),
    ...CHAIR_BACKS.map((c) => curve(c, "detail")),
    ...[CHAIR_FRONT_LEFT, CHAIR_FRONT_RIGHT].flatMap((c) => [curve(c.rail, "detail"), line(...c.seat, "detail"), ...c.frame.map((p) => polyline(p, "detail"))]),
    polyline(SOFA, "detail"), line(...SOFA_SEAT, "detail"),
    ellipse(COFFEE_TABLE.c, COFFEE_TABLE.rx, COFFEE_TABLE.ry),
    circle(POUF.c, POUF.r), ellipse(POUF.c, POUF.stripeRx, POUF.r),
    polyline(POT, "detail"),
    ...PLANKS.map(([a, b]) => line(a, b, "detail")),
  ];

  const glows: Glow[] = [];
  const lamp: Stroke[] = [
    ...PENDANTS.map(({ rim: [rl, rr, ry] }, i) => {
      const c: P = [(rl + rr) / 2, ry + 6];
      glows.push({ x: c[0], y: c[1] + 8, r: i === 1 ? 90 : 110 });
      return { ...bulb(c, 5), id: `bulb-${i}` };
    }),
    ...CITY_LIGHTS.map(([x, y, r]) => {
      glows.push({ x, y, r: r >= 6 ? 60 : 40 });
      return circle([x, y], r, "lamp");
    }),
  ];

  const morphs: Record<string, string[]> = {};
  const life: Stroke[] = [
    curve(PALM_STEM),
    ...LEAVES.map(([base, length, angle], i) => {
      morphs[`leaf-${i}`] = [leaf(base, length, angle + 7).d];
      return { ...leaf(base, length, angle), id: `leaf-${i}` };
    }),
  ];

  return { id, title: metaFor(id).title, ...frameOf(id), strokes: [...structure, ...detail, ...lamp, ...life], glows, morphs };
}
```

3d. Register both in `drawings/index.ts`. Add these two imports beside the existing ones:

```ts
import { mezzanineNightDrawing } from "./mezzanine-night";
import { mezzanineStairDrawing } from "./mezzanine-stair";
```

and these two entries at the end of `DRAWINGS`:

```ts
  "mezzanine-stair": mezzanineStairDrawing,
  "mezzanine-night": mezzanineNightDrawing,
```

After Tasks 3, 7, 8, 9 and this task the file reads:

```ts
import type { Drawing } from "@/lib/draw/types";
import { entryDrawing } from "./entry";
import { facadeDrawing } from "./facade";
import { mainFloorDrawing } from "./main-floor";
import { markDrawing } from "./mark";
import { mezzanineNightDrawing } from "./mezzanine-night";
import { mezzanineStairDrawing } from "./mezzanine-stair";
import { wallLampDrawing } from "./wall-lamp";

export const DRAWINGS: Record<string, () => Drawing> = {
  mark: markDrawing,
  facade: facadeDrawing,
  entry: entryDrawing,
  "main-floor": mainFloorDrawing,
  "wall-lamp": wallLampDrawing,
  "mezzanine-stair": mezzanineStairDrawing,
  "mezzanine-night": mezzanineNightDrawing,
};

export function drawingFor(id: string): Drawing {
  const make = DRAWINGS[id];
  if (!make) throw new Error(`No drawing module for "${id}"`);
  return make();
}
```

- [ ] **Step 4: Run to verify it passes, then review the renders**

Run: `npm test -- drawing-mezzanine`
Expected: PASS, 10 tests (4 per drawing and 2 specifics).

Run: `npm test -- drawings`
Expected: PASS, including `mezzanine-stair is valid and within budget` and `mezzanine-night is valid and within budget`.

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npx tsx scripts/review.ts mezzanine-stair && npx tsx scripts/review.ts mezzanine-night`
Expected:
```
mezzanine-stair: 112 strokes (budget 260) { structure: 71, detail: 30, life: 5, lamp: 6 }
review/mezzanine-stair-overlay.png
mezzanine-night: 89 strokes (budget 240) { structure: 19, detail: 51, life: 7, lamp: 12 }
review/mezzanine-night-overlay.png
```

Read all six PNGs and check each item:
- One weight, round caps, no fragments. Closed shapes close: the column, the newel, the table tops, the shades, the frames, the track lights.
- Overlay, stair by day: every sash line lies on a window frame or muntin, and the transom beam and column sit within about 15 units of the photograph's steel. Each tread line lies on a tread plate, and the concrete steps' edges on the step nosings. The newel sits on the black post, and the upper railing's rail and balusters on the photographed railing. The shades sit on the two wall lamps. The table top traces the wooden top.
- Overlay, night: the beams lie on the black beams and the track-light rects on the fittings. The cords run down the chains, and the domes and rims trace the three shades. The mullions and transoms lie on the glazing bars. The frames trace the pictures. The table's left corner, near corner and right corner sit on the table top's corners. The front chairs' rails follow the woven backs. The city-light circles sit on bright points in the glass.
- Phone PNG, stair: at 390 px it reads as a steel stair coming down beside tall windows, with lamps on the brick and a table below.
- Phone PNG, night: it reads as a long table under three pendants beside a wall of glass.
- Nothing drawn that the photograph does not show. No laptop, no sculpture, no person.
- If a phone PNG is muddy, delete detail strokes in this order and rerun the review. Stair: the last two `CHAIRS` entries (the arm rails seen behind the table), then `RIGHT_BACK_TABLE`, then `DUCT_DISCS`. Night: `PLANKS`, then the last `CHAIR_BACKS` entry (the striped chair), then `TRACK_LIGHTS`. Never delete structure.

- [ ] **Step 5: Look**

Run `npm run dev` (port 3021). With Playwright MCP, open each URL, take a screenshot and Read it:
- `http://localhost:3021/lab/mezzanine-stair?mode=static&at=14:00` at 390x844 and at 1440x900
- `http://localhost:3021/lab/mezzanine-stair?mode=static&at=01:00` at 390x844 and at 1440x900
- `http://localhost:3021/lab/mezzanine-night?mode=static&at=14:00` at 390x844 and at 1440x900
- `http://localhost:3021/lab/mezzanine-night?mode=static&at=01:00` at 390x844 and at 1440x900
- `http://localhost:3021/lab/mezzanine-stair?mode=scrub&at=14:00` at 390x844: scroll a third of the way and shoot, then scroll past and shoot again (the home page uses this drawing in scrub mode)

Checklist:
- 390 day, stair: the drawing is taller than the screen (656x982 frame). On the first screen the windows' grid is crisp and evenly spaced. The treads read as a rhythm that tightens upward. The wall lamps are recognisable as shades, not dots.
- 390 day, night drawing: pendants, glazing grid and table read, and the city-light circles are small, clean rings with no smudge.
- 1440: the same 1.5 px weight. The stair drawing does not look sparse, and the night drawing's ceiling lines do not overpower the table.
- 01:00, stair: two warm glows sit on the wall lamps, and the bulbs take the lamp colour.
- 01:00, night: three pendant glows sit under the shades (the middle one smaller), and nine smaller glows sit on the city lights in the glass. No glow lands on the brick wall except the pendants' spill.
- Scrub: at a third of the scroll, some structure is drawn and the rest is not; past the end, the drawing is complete and has `data-drawn`.
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add drawings/mezzanine-stair.ts drawings/mezzanine-night.ts drawings/index.ts tests/drawing-mezzanine.test.ts
git commit -m "feat: mezzanine drawings by day and at night"
```

---

### Task 11: The courtyard and the games still life

**Files:**
- Create: `drawings/courtyard.ts`, `drawings/games.ts`
- Modify: `drawings/index.ts` (import and register `courtyardDrawing` and `gamesDrawing`)
- Test: `tests/drawings-courtyard-games.test.ts`

**Interfaces:**
- Consumes: `bulb`, `leaf`, `vine`, `ball` (`lib/draw/glyphs.ts`); `along` (`lib/draw/perspective.ts`); `circle`, `curve`, `ellipse`, `line`, `polyline`, `rect` (`lib/draw/primitives.ts`); `Drawing`, `Glow`, `P`, `Stroke` (`lib/draw/types.ts`); `frameOf`, `metaFor` (`lib/drawings.ts`); `mulberry32` (`lib/random.ts`); `DRAWINGS`, `drawingFor` (`drawings/index.ts`); `scripts/guides/build.mjs`, `scripts/guides/grid.mjs` (Task 4); `scripts/review.ts` (Task 3); `/lab/<id>` (Task 6).
- Produces:
  - `courtyardDrawing(): Drawing`: id `courtyard`, frame `x 0, y 240, width 1080, height 1680` (the crop `[0, 240, 1080, 1920]`), 238 strokes. Life ids `leaf-0` to `leaf-11`, each with `morphs["leaf-n"] = [leaf(base, len, angle + 7).d]`; lamp ids `bulb-0`, `bulb-1` (the two garden lights among the palms, reading order); `glows`: 4 (the two garden lights, the two pendant shades).
  - `gamesDrawing(): Drawing`: id `games`, frame `x 0, y 0, width 1080, height 1350` (no source), 71 strokes, life id `cue-ball`, `roll = { ball: "cue-ball", path: "M330 965C440 1025 570 1025 650 970" }` (starts at the cue ball's centre and stays on the felt), no glows, no morphs.
  - Registry keys `courtyard` and `games` in `DRAWINGS`. Task 15 animates the ids and the roll; Task 16 draws the structure layers as vignettes; Task 18 annotates points in these frames and adds the "Roll the cue ball" button.

**The games corner is a still life, not a floor plan.** It has no photograph. `cafe.json` documents "A pool table, board games and a shelf of books", so the drawing composes exactly those three things on one sheet: a pool table in plain elevation with a raised view of its felt (pockets, a rack with three balls, the cue ball, a cue lying across the rail), a shelf of game boxes (rects with lid lines) and a shelf of books (widths and heights from `mulberry32(7)`). It claims nothing about the room's layout, size or what stands next to what. Do not add a lamp, a window, chairs or people.

- [ ] **Step 1: Write the failing test**

`tests/drawings-courtyard-games.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { drawingFor } from "@/drawings";
import { metaFor } from "@/lib/drawings";
import type { P } from "@/lib/draw/types";

/** On-curve points of a path built from M, L, C and Q commands (paths with arcs return none). */
function onCurvePoints(d: string): P[] {
  if (d.includes("A")) return [];
  return d
    .split(/(?=[MLCQ])/)
    .map((seg) => seg.replace(/[MLCQZ]/g, " ").trim().split(/[\s,]+/).map(Number))
    .filter((v) => v.length >= 2)
    .map((v) => [v[v.length - 2], v[v.length - 1]] as P);
}

/** Points along a path made of one M and any number of C commands. */
function sampleCubicPath(d: string, steps = 24): P[] {
  const nums = d.replace(/[MC]/g, " ").trim().split(/[\s,]+/).map(Number);
  let p0: P = [nums[0], nums[1]];
  const out: P[] = [p0];
  for (let i = 2; i + 6 <= nums.length; i += 6) {
    const [c1x, c1y, c2x, c2y, x, y] = nums.slice(i, i + 6);
    for (let k = 1; k <= steps; k++) {
      const t = k / steps, u = 1 - t;
      out.push([
        u * u * u * p0[0] + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x,
        u * u * u * p0[1] + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * y,
      ]);
    }
    p0 = [x, y];
  }
  return out;
}

describe("courtyard drawing", () => {
  const d = drawingFor("courtyard");

  it("sits on its crop and stays within its budget", () => {
    expect({ x: d.x, y: d.y, width: d.width, height: d.height }).toEqual({ x: 0, y: 240, width: 1080, height: 1680 });
    expect(d.strokes.length).toBeLessThanOrEqual(metaFor("courtyard").strokeBudget);
  });

  it("sways at most twelve leaves, each with one alternate", () => {
    const leaves = d.strokes.filter((s) => s.id?.startsWith("leaf-"));
    expect(leaves.length).toBeGreaterThan(0);
    expect(leaves.length).toBeLessThanOrEqual(12);
    for (const l of leaves) {
      expect(l.layer).toBe("life");
      expect(d.morphs?.[l.id!], l.id).toHaveLength(1);
      expect(d.morphs![l.id!][0]).not.toBe(l.d);
    }
  });

  it("gives ids only to leaves and bulbs, so architecture never moves", () => {
    for (const s of d.strokes.filter((x) => x.id)) expect(s.id!, s.id).toMatch(/^(leaf|bulb)-\d+$/);
    for (const s of d.strokes.filter((x) => x.layer === "structure")) expect(s.id).toBeUndefined();
  });

  it("lights its garden lamps after dark", () => {
    const bulbs = d.strokes.filter((s) => s.id?.startsWith("bulb-"));
    expect(bulbs.length).toBeGreaterThan(0);
    for (const b of bulbs) expect(b.layer).toBe("lamp");
    expect((d.glows ?? []).length).toBeGreaterThanOrEqual(bulbs.length);
  });

  it("keeps every line on the sheet", () => {
    for (const s of d.strokes) for (const [x, y] of onCurvePoints(s.d)) {
      expect(x >= -40 && x <= 1120 && y >= 200 && y <= 1960, `${s.d.slice(0, 40)} at ${x},${y}`).toBe(true);
    }
  });
});

describe("games still life", () => {
  const d = drawingFor("games");
  const FELT = { x0: 150, y0: 890, x1: 930, y1: 1040 };

  it("is a still life on a 1080 by 1350 sheet, with no photograph to lift", () => {
    expect(metaFor("games").source).toBeNull();
    expect(metaFor("games").lift).toBe(false);
    expect({ x: d.x, y: d.y, width: d.width, height: d.height }).toEqual({ x: 0, y: 0, width: 1080, height: 1350 });
    expect(d.strokes.length).toBeLessThanOrEqual(metaFor("games").strokeBudget);
    expect(d.glows).toBeUndefined();
  });

  it("has exactly one cue ball, and its roll starts where it rests", () => {
    const cue = d.strokes.filter((s) => s.id === "cue-ball");
    expect(cue).toHaveLength(1);
    expect(d.roll?.ball).toBe("cue-ball");
    const [mx, my, r] = cue[0].d.replace(/[MA]/g, " ").trim().split(/[\s,]+/).map(Number);
    const start = sampleCubicPath(d.roll!.path)[0];
    expect(start).toEqual([mx - r, my]);
  });

  it("rolls the cue ball along the felt without leaving it", () => {
    const r = 16;
    const points = sampleCubicPath(d.roll!.path);
    expect(points.length).toBeGreaterThan(10);
    for (const [x, y] of points) {
      expect(x >= FELT.x0 + r && x <= FELT.x1 - r && y >= FELT.y0 + r && y <= FELT.y1 - r, `roll at ${x.toFixed(1)},${y.toFixed(1)}`).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- drawings-courtyard-games`
Expected: FAIL. The file fails while collecting (the `describe` blocks call `drawingFor`), with `Error: No drawing module for "courtyard"`.

- [ ] **Step 3: Implement**

**3a. Guides and grid for the courtyard** (the games still life has no source and no guide):

```bash
node scripts/guides/build.mjs courtyard && node scripts/guides/grid.mjs courtyard
```

Expected: `guides/courtyard: photo.jpg, guide-rooms.svg, guide-close.svg` and `guides/courtyard/grid.png`. Read `guides/courtyard/grid.png` (1080 x 1920, lines every 60, labels every 120) and confirm the measured constants below before writing the module: the beam band's underside at y 405 and 480; the four ceiling downlights centred at x 105, 450, 692, 933 with rims at y 296; the left railing's top rail at y 545 and the mezzanine railing's top rail at y 492 from x 665; the painting at x 797 to 985, y 697 to 952; the stair handrail from (800, 1115) to (1080, 878); the table top corners (300, 1515), (772, 1510), (800, 1672), (258, 1660); the garden lights at (238, 1392) and (805, 1390). A constant more than 15 units off is corrected in the module, never compensated with extra strokes.

**3b. `drawings/courtyard.ts`.** How it is built, so the measurements stay honest:
- Architecture is straight lines in `structure` and `detail`: the duct, the beam band, three ceiling rails, four downlights (two sides and an elliptical rim each), eight glazing mullions, the railings' balusters by rhythm, the painting as a double frame, the stair's handrail and balusters, the courtyard's low rail and posts.
- The canopy hides the lower railing, so each left baluster stops on `CANOPY_TOP` (a polyline measured along the top of the leaf mass) and is skipped when shorter than 18 units; the stair's balusters stop on the right palm's crown the same way. Nothing is drawn behind foliage that the photo does not show.
- The person standing at the mezzanine railing is not drawn; only the balusters in front of them are.
- The creeper is five `vine()` calls with 46-unit leaves; the palms are ten fronds from `curve()` ribs with pairs of `leaf()` leaflets swept toward the tip; twelve further canopy-edge leaves carry `leaf-<n>` ids and one alternate each for Task 15's sway.
- Each chair is a bent crest rail (`curve` through eight measured points), its front leg, three slats, the cushion quadrilateral and three stripes placed with `along`. The back legs are left out: they cross the cushions and muddy the phone view.
- The two pendant shades and the two garden lights glow after dark; the garden lights are `bulb-0` and `bulb-1`.

```ts
import { bulb, leaf, vine } from "@/lib/draw/glyphs";
import { along } from "@/lib/draw/perspective";
import { curve, ellipse, line, polyline, rect } from "@/lib/draw/primitives";
import type { Drawing, Glow, P, Stroke } from "@/lib/draw/types";
import { frameOf, metaFor } from "@/lib/drawings";

/*
 * The courtyard, drawn from stills/courtyard-vines.jpg (720x1280 source, measured in its 1080x1920 frame).
 * Crop [0, 240, 1080, 1920]. Every point below was read from guides/courtyard/grid.png.
 */

// ---- structure: ceiling, beam, window band, railings ----
const DUCT: P[] = [[0, 262], [255, 262], [290, 250], [1080, 250]];
const BEAM_TOP = 405;
const BEAM_BOTTOM = 480;
const PURLINS: [P, P][] = [[[115, 262], [180, 405]], [[270, 262], [305, 405]], [[1000, 262], [890, 405]]];
const DOWNLIGHTS_X = [105, 450, 692, 933];
const DOWNLIGHT = { top: 252, bottom: 296, half: 27, rimRx: 36, rimRy: 9 };
const WINDOW_JAMB: [P, P] = [[145, 480], [145, 655]];
const MULLIONS_X = [205, 262, 320, 378, 436, 494, 552, 610];
const MULLION_TOP = 480;
const LEFT_RAIL_Y = 545;
const LEFT_RAIL_END = 665;
const LEFT_BALUSTER_BOTTOM = 655;
/** The top of the leaf mass that hides the lower railing; balusters stop on it. */
const CANOPY_TOP: P[] = [[0, 565], [110, 590], [200, 600], [260, 570], [330, 560], [420, 585], [500, 605], [600, 640], [665, 655]];
const MEZZ = { x0: 665, x1: 1080, rail: 492, post: 675, slabTop: 650, slabBottom: 668 };
const MEZZ_BALUSTERS_X = [712, 744, 776, 808, 840, 872, 904, 936, 968, 1000, 1032, 1064];

// ---- detail: wall, painting, doorway, stair, garden rail ----
const PAINTING = { x: 797, y: 697, w: 188, h: 255, inset: 12 };
const STAIR_RAIL: [P, P] = [[800, 1115], [1080, 878]];
const STAIR_STRINGER: [P, P] = [[900, 1285], [1080, 1133]];
const STAIR_BALUSTERS_X = [860, 900, 940, 980, 1020, 1060];
/** The right palm's crown hides the stair's lower balusters. */
const RIGHT_PALM_TOP: P[] = [[820, 1180], [900, 1160], [960, 1150], [1080, 1150]];
const PENDANTS: { cord: [P, P]; shade: P; rx: number; ry: number }[] = [
  { cord: [[545, 320], [545, 432]], shade: [545, 448], rx: 30, ry: 16 },
  { cord: [[615, 405], [615, 447]], shade: [615, 460], rx: 25, ry: 13 },
];
const GARDEN_RAIL: [P, P] = [[150, 1432], [1080, 1428]];
const GARDEN_POSTS: [P, P][] = [[[180, 1432], [180, 1540]], [[600, 1430], [600, 1505]], [[835, 1429], [835, 1600]], [[1000, 1428], [1000, 1590]]];
const LEDGE: [P, P][] = [[[0, 1590], [262, 1578]], [[1012, 1575], [1080, 1572]]];

// ---- structure: table and chairs ----
const TABLE_TOP: P[] = [[300, 1515], [772, 1510], [800, 1672], [258, 1660]];
const TABLE_EDGE: [P, P] = [[262, 1682], [797, 1694]];
const PEDESTAL_X = [488, 532];
const PEDESTAL: [number, number] = [1696, 1920];
const HOLDER = { x: 462, y: 1486, w: 68, h: 38 };
const NAPKIN: P[] = [[438, 1486], [462, 1446], [496, 1470], [528, 1444], [548, 1486]];

interface Chair { crest: P[]; legs: [P, P][]; slats: [P, P][]; cushion: [P, P, P, P] }
const LEFT_CHAIR: Chair = {
  crest: [[330, 1578], [200, 1545], [95, 1540], [62, 1572], [82, 1628], [160, 1686], [280, 1722], [395, 1732]],
  legs: [[[350, 1740], [240, 1920]]],
  slats: [[[112, 1552], [175, 1690]], [[165, 1546], [215, 1702]], [[225, 1550], [252, 1716]]],
  cushion: [[205, 1750], [470, 1738], [478, 1895], [215, 1905]],
};
const RIGHT_CHAIR: Chair = {
  crest: [[770, 1572], [860, 1535], [960, 1527], [1012, 1548], [1018, 1602], [975, 1652], [860, 1700], [710, 1735]],
  legs: [[[740, 1742], [860, 1920]]],
  slats: [[[965, 1534], [920, 1690]], [[915, 1531], [885, 1702]], [[868, 1536], [855, 1712]]],
  cushion: [[612, 1752], [865, 1738], [905, 1880], [618, 1905]],
};
const STRIPES_T = [0.3, 0.55, 0.8];

// ---- life: the creeper canopy, palms, swaying leaves ----
const CANOPY: { path: P[]; leaves: number; seed: number }[] = [
  { path: [[540, 1480], [575, 1250], [545, 1020], [500, 830], [430, 640], [360, 560]], leaves: 11, seed: 31 },
  { path: [[470, 760], [330, 700], [200, 650], [60, 690]], leaves: 8, seed: 32 },
  { path: [[500, 800], [620, 720], [720, 700], [800, 770]], leaves: 7, seed: 33 },
  { path: [[420, 700], [300, 820], [170, 870], [70, 840]], leaves: 6, seed: 34 },
  { path: [[560, 980], [640, 1080], [625, 1230]], leaves: 5, seed: 35 },
];
const CANOPY_LEAF = 46;
const LEFT_PALM: P = [240, 1470];
const RIGHT_PALM: P = [840, 1452];
/** Palm fronds arch up from the crown and droop at the tip, as in the photo. */
const FRONDS: { rib: P[]; pairs: number }[] = [
  { rib: [LEFT_PALM, [190, 1320], [140, 1220], [95, 1195]], pairs: 4 },
  { rib: [LEFT_PALM, [320, 1320], [420, 1300], [465, 1395]], pairs: 4 },
  { rib: [LEFT_PALM, [140, 1370], [50, 1390], [5, 1450]], pairs: 4 },
  { rib: [LEFT_PALM, [120, 1300], [40, 1270], [0, 1300]], pairs: 3 },
  { rib: [LEFT_PALM, [300, 1400], [335, 1520]], pairs: 3 },
  { rib: [RIGHT_PALM, [780, 1300], [720, 1190], [680, 1175]], pairs: 4 },
  { rib: [RIGHT_PALM, [900, 1300], [950, 1210], [985, 1215]], pairs: 3 },
  { rib: [RIGHT_PALM, [970, 1310], [1050, 1300], [1080, 1340]], pairs: 4 },
  { rib: [RIGHT_PALM, [730, 1330], [640, 1345], [610, 1395]], pairs: 3 },
  { rib: [RIGHT_PALM, [980, 1395], [1060, 1480]], pairs: 3 },
];
const FROND_LEAF = 44;
/** Leaves on the canopy's outer edge that sway: [base, length, angle]. */
const SWAY: [P, number, number][] = [
  [[360, 560], 50, -120], [[250, 615], 48, -100], [[140, 655], 46, -150], [[60, 690], 48, 180],
  [[70, 840], 46, 150], [[170, 870], 44, 110], [[800, 770], 48, 40], [[760, 700], 46, -30],
  [[660, 705], 46, -80], [[625, 1230], 44, 110], [[655, 1090], 44, 10], [[455, 650], 48, -95],
];

// ---- lamp: the two garden lights among the palms ----
const GARDEN_LIGHTS: P[] = [[238, 1392], [805, 1390]];

/** The y of a polyline at x (clamped to its ends). */
function yOn(poly: P[], x: number): number {
  if (x <= poly[0][0]) return poly[0][1];
  for (let i = 1; i < poly.length; i++) {
    const [ax, ay] = poly[i - 1];
    const [bx, by] = poly[i];
    if (x <= bx) return ay + ((by - ay) * (x - ax)) / (bx - ax);
  }
  return poly[poly.length - 1][1];
}

/** Position and direction (degrees) at fraction t along a polyline. */
function pointAt(path: P[], t: number): { p: P; dir: number } {
  const segs = path.slice(1).map((b, i) => ({ a: path[i], b, len: Math.hypot(b[0] - path[i][0], b[1] - path[i][1]) }));
  let at = t * segs.reduce((s, x) => s + x.len, 0);
  for (const s of segs) {
    if (at <= s.len || s === segs[segs.length - 1]) {
      const k = s.len ? Math.min(1, at / s.len) : 0;
      return { p: [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k], dir: (Math.atan2(s.b[1] - s.a[1], s.b[0] - s.a[0]) * 180) / Math.PI };
    }
    at -= s.len;
  }
  return { p: path[path.length - 1], dir: 0 };
}

/** A palm frond: the rib and pairs of leaflets swept toward its tip, shorter toward the tip. */
function frond(rib: P[], pairs: number, length: number): Stroke[] {
  const out: Stroke[] = [curve(rib, "life")];
  for (let i = 0; i < pairs; i++) {
    const t = 0.4 + (0.55 * (i + 0.5)) / pairs;
    const { p, dir } = pointAt(rib, t);
    const len = length * (1 - 0.35 * (i / Math.max(1, pairs - 1)));
    out.push(leaf(p, len, dir - 42), leaf(p, len, dir + 42));
  }
  return out;
}

function chair(c: Chair): Stroke[] {
  const [tl, tr, br, bl] = c.cushion;
  return [
    curve(c.crest, "structure"),
    ...c.legs.map(([a, b]) => line(a, b, "structure")),
    ...c.slats.map(([a, b]) => line(a, b, "detail")),
    polyline([tl, tr, br, bl], "structure", true),
    ...STRIPES_T.map((t) => line(along(tl, bl, [t])[0], along(tr, br, [t])[0], "detail")),
  ];
}

export function courtyardDrawing(): Drawing {
  const structure: Stroke[] = [
    polyline(DUCT),
    line([0, BEAM_TOP], [1080, BEAM_TOP]),
    line([0, BEAM_BOTTOM], [1080, BEAM_BOTTOM]),
    ...PURLINS.map(([a, b]) => line(a, b)),
    line(...WINDOW_JAMB),
    line([0, LEFT_RAIL_Y], [LEFT_RAIL_END, LEFT_RAIL_Y]),
    line([MEZZ.x0, MEZZ.rail], [MEZZ.x1, MEZZ.rail]),
    line([MEZZ.post, MEZZ.rail], [MEZZ.post, MEZZ.slabBottom]),
    line([MEZZ.x0, MEZZ.slabTop], [MEZZ.x1, MEZZ.slabTop]),
    line([MEZZ.x0, MEZZ.slabBottom], [MEZZ.x1, MEZZ.slabBottom]),
    line(...STAIR_RAIL),
    polyline(TABLE_TOP, "structure", true),
    line(...TABLE_EDGE),
    ...PEDESTAL_X.map((x) => line([x, PEDESTAL[0]], [x, PEDESTAL[1]])),
    ...chair(LEFT_CHAIR),
    ...chair(RIGHT_CHAIR),
  ];

  const leftBalusters: Stroke[] = [];
  for (let x = 24; x <= 640; x += 44) {
    const bottom = Math.min(LEFT_BALUSTER_BOTTOM, yOn(CANOPY_TOP, x));
    if (bottom - LEFT_RAIL_Y >= 18) leftBalusters.push(line([x, LEFT_RAIL_Y], [x, bottom], "detail"));
  }
  const railSlope = (STAIR_RAIL[1][1] - STAIR_RAIL[0][1]) / (STAIR_RAIL[1][0] - STAIR_RAIL[0][0]);
  const stringerSlope = (STAIR_STRINGER[1][1] - STAIR_STRINGER[0][1]) / (STAIR_STRINGER[1][0] - STAIR_STRINGER[0][0]);
  const stairBalusters = STAIR_BALUSTERS_X.map((x) => {
    const top = STAIR_RAIL[0][1] + railSlope * (x - STAIR_RAIL[0][0]);
    const foot = STAIR_STRINGER[0][1] + stringerSlope * (x - STAIR_STRINGER[0][0]);
    return line([x, top], [x, Math.min(foot, yOn(RIGHT_PALM_TOP, x))], "detail");
  });

  const detail: Stroke[] = [
    ...DOWNLIGHTS_X.flatMap((cx) => [
      line([cx - DOWNLIGHT.half, DOWNLIGHT.top], [cx - DOWNLIGHT.half, DOWNLIGHT.bottom], "detail"),
      line([cx + DOWNLIGHT.half, DOWNLIGHT.top], [cx + DOWNLIGHT.half, DOWNLIGHT.bottom], "detail"),
      ellipse([cx, DOWNLIGHT.bottom], DOWNLIGHT.rimRx, DOWNLIGHT.rimRy, "detail"),
    ]),
    ...PENDANTS.flatMap((l) => [line(l.cord[0], l.cord[1], "detail"), ellipse(l.shade, l.rx, l.ry, "detail")]),
    ...MULLIONS_X.map((x) => line([x, MULLION_TOP], [x, LEFT_RAIL_Y], "detail")),
    ...leftBalusters,
    ...MEZZ_BALUSTERS_X.map((x) => line([x, MEZZ.rail], [x, MEZZ.slabTop], "detail")),
    rect(PAINTING.x, PAINTING.y, PAINTING.w, PAINTING.h, "detail"),
    rect(PAINTING.x + PAINTING.inset, PAINTING.y + PAINTING.inset, PAINTING.w - 2 * PAINTING.inset, PAINTING.h - 2 * PAINTING.inset, "detail"),
    ...stairBalusters,
    line(...GARDEN_RAIL, "detail"),
    ...GARDEN_POSTS.map(([a, b]) => line(a, b, "detail")),
    ...LEDGE.map(([a, b]) => line(a, b, "detail")),
    rect(HOLDER.x, HOLDER.y, HOLDER.w, HOLDER.h, "detail"),
    polyline(NAPKIN, "detail"),
  ];

  const sway = SWAY.map(([base, len, angle], i) => ({ ...leaf(base, len, angle), id: `leaf-${i}` }));
  const life: Stroke[] = [
    ...CANOPY.flatMap((v) => vine(v.path, v.leaves, v.seed, CANOPY_LEAF)),
    ...FRONDS.flatMap((f) => frond(f.rib, f.pairs, FROND_LEAF)),
    ...sway,
  ];
  const morphs: Record<string, string[]> = Object.fromEntries(SWAY.map(([base, len, angle], i) => [`leaf-${i}`, [leaf(base, len, angle + 7).d]]));

  const lamp: Stroke[] = GARDEN_LIGHTS.map((c, i) => ({ ...bulb(c, 7), id: `bulb-${i}` }));
  const glows: Glow[] = [
    ...GARDEN_LIGHTS.map(([x, y]) => ({ x, y, r: 70 })),
    ...PENDANTS.map((l) => ({ x: l.shade[0], y: l.shade[1], r: 60 })),
  ];

  return { id: "courtyard", title: metaFor("courtyard").title, ...frameOf("courtyard"), strokes: [...structure, ...detail, ...life, ...lamp], glows, morphs };
}
```

**3c. `drawings/games.ts`:**

```ts
import { ball } from "@/lib/draw/glyphs";
import { circle, line, polyline, rect } from "@/lib/draw/primitives";
import type { Drawing, P, Stroke } from "@/lib/draw/types";
import { frameOf, metaFor } from "@/lib/drawings";
import { mulberry32 } from "@/lib/random";

/*
 * The games corner has no photograph. This is a still life of the three things cafe.json documents
 * ("A pool table, board games and a shelf of books"), composed on a 1080x1350 sheet.
 * It is not a floor plan and claims nothing about where the objects stand in the house.
 */

// ---- structure: the shelf case and the pool table ----
const CASE = { x0: 120, x1: 960, top: 120, bottom: 736 };
const BOOK_BOARD = { y: 420, h: 16 };
const GAMES_BOARD = { y: 720, h: 16 };
const TABLE_RAIL = { x: 110, y: 860, w: 860, h: 210 };
const FELT = { x: 150, y: 890, w: 780, h: 150 };
const APRON: P[] = [[110, 1070], [970, 1070], [950, 1140], [130, 1140]];
const LEG_PROFILE: [number, number][] = [[20, 1140], [14, 1180], [24, 1230], [14, 1290], [16, 1310]];
const LEG_CENTRES = [190, 890];
const FLOOR: [P, P] = [[40, 1310], [1040, 1310]];

// ---- detail: books, game boxes, pockets, rack, cue ----
const BOOKS = { x0: 140, x1: 846, minW: 24, maxW: 50, minH: 170, maxH: 262, seed: 7 };
/** The last book leans right against the case; negative lean tips it right. */
const LEANING_BOOK = { foot: [852, 420] as P, w: 28, h: 205, lean: -14 };
interface Box { x: number; w: number; h: number }
const PILE_A: Box[] = [
  { x: 150, w: 300, h: 42 }, { x: 160, w: 280, h: 34 }, { x: 142, w: 320, h: 46 }, { x: 175, w: 260, h: 38 }, { x: 158, w: 290, h: 40 },
];
const PILE_B: Box[] = [
  { x: 520, w: 360, h: 50 }, { x: 545, w: 300, h: 36 }, { x: 510, w: 350, h: 44 }, { x: 560, w: 250, h: 40 },
];
const LID_AT = 0.3; // the lid's lower edge, as a fraction of the box height from its top
const POCKETS: P[] = [[140, 880], [540, 874], [940, 880], [140, 1050], [540, 1056], [940, 1050]];
const POCKET_R = 16;
const RACK: P[] = [[680, 965], [800, 900], [800, 1030]];
const BALL_R = 15;
const OBJECT_BALLS: P[] = [[714, 965], [744, 947], [744, 983]];
const CUE_BALL: P = [330, 965];
const CUE = { tip: [300, 973] as P, butt: [30, 1012] as P, tipHalf: 2.5, buttHalf: 8, wrapAt: 0.22 };
/** The cue ball's roll: from where it rests, along the felt, stopping short of the rack. */
const ROLL = "M330 965C440 1025 570 1025 650 970";

function turnedLeg(cx: number): Stroke {
  const right = LEG_PROFILE.map(([dx, y]) => [cx + dx, y] as P);
  const left = [...LEG_PROFILE].reverse().map(([dx, y]) => [cx - dx, y] as P);
  return polyline([...right, ...left], "structure", true);
}

function books(): Stroke[] {
  const r = mulberry32(BOOKS.seed);
  const out: Stroke[] = [];
  let x = BOOKS.x0;
  while (x < BOOKS.x1 - BOOKS.minW) {
    const w = Math.min(BOOKS.minW + r() * (BOOKS.maxW - BOOKS.minW), BOOKS.x1 - x);
    const h = BOOKS.minH + r() * (BOOKS.maxH - BOOKS.minH);
    const top = BOOK_BOARD.y - h;
    out.push(rect(x, top, w, h, "detail"));
    if (r() < 0.35) out.push(line([x, top + 26], [x + w, top + 26], "detail"));
    x += w;
  }
  const { foot, w, h, lean } = LEANING_BOOK;
  const a = (lean * Math.PI) / 180;
  const up: P = [-Math.sin(a) * h, -Math.cos(a) * h];
  const across: P = [Math.cos(a) * w, -Math.sin(a) * w];
  const p0: P = foot;
  const p1: P = [foot[0] + across[0], foot[1] + across[1]];
  out.push(polyline([p0, p1, [p1[0] + up[0], p1[1] + up[1]], [p0[0] + up[0], p0[1] + up[1]]], "detail", true));
  return out;
}

function pile(boxes: Box[]): Stroke[] {
  let base = GAMES_BOARD.y;
  return boxes.flatMap((b) => {
    const top = base - b.h;
    base = top;
    return [rect(b.x, top, b.w, b.h, "detail"), line([b.x, top + b.h * LID_AT], [b.x + b.w, top + b.h * LID_AT], "detail")];
  });
}

function cue(): Stroke[] {
  const { tip, butt, tipHalf, buttHalf, wrapAt } = CUE;
  const dx = butt[0] - tip[0], dy = butt[1] - tip[1];
  const len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;
  const wrap: P = [butt[0] - dx * wrapAt, butt[1] - dy * wrapAt];
  const wrapHalf = buttHalf - (buttHalf - tipHalf) * wrapAt;
  return [
    polyline([[tip[0] + nx * tipHalf, tip[1] + ny * tipHalf], [butt[0] + nx * buttHalf, butt[1] + ny * buttHalf], [butt[0] - nx * buttHalf, butt[1] - ny * buttHalf], [tip[0] - nx * tipHalf, tip[1] - ny * tipHalf]], "detail", true),
    line([wrap[0] + nx * wrapHalf, wrap[1] + ny * wrapHalf], [wrap[0] - nx * wrapHalf, wrap[1] - ny * wrapHalf], "detail"),
  ];
}

export function gamesDrawing(): Drawing {
  const structure: Stroke[] = [
    line([CASE.x0, CASE.top], [CASE.x1, CASE.top]),
    line([CASE.x0, CASE.top], [CASE.x0, CASE.bottom]),
    line([CASE.x1, CASE.top], [CASE.x1, CASE.bottom]),
    rect(CASE.x0, BOOK_BOARD.y, CASE.x1 - CASE.x0, BOOK_BOARD.h),
    rect(CASE.x0, GAMES_BOARD.y, CASE.x1 - CASE.x0, GAMES_BOARD.h),
    rect(TABLE_RAIL.x, TABLE_RAIL.y, TABLE_RAIL.w, TABLE_RAIL.h),
    rect(FELT.x, FELT.y, FELT.w, FELT.h),
    polyline(APRON, "structure", true),
    ...LEG_CENTRES.map(turnedLeg),
    line(...FLOOR),
  ];
  const detail: Stroke[] = [
    ...books(),
    ...pile(PILE_A),
    ...pile(PILE_B),
    ...POCKETS.map((p) => circle(p, POCKET_R, "detail")),
    polyline(RACK, "detail", true),
    ...cue(),
  ];
  const life: Stroke[] = [
    ...OBJECT_BALLS.map((c) => ball(c, BALL_R)),
    { ...ball(CUE_BALL, BALL_R + 1), id: "cue-ball" },
  ];
  return {
    id: "games",
    title: metaFor("games").title,
    ...frameOf("games"),
    strokes: [...structure, ...detail, ...life],
    roll: { ball: "cue-ball", path: ROLL },
  };
}
```

**3d. Register both in `drawings/index.ts`** (the whole file after this task):

```ts
import type { Drawing } from "@/lib/draw/types";
import { courtyardDrawing } from "./courtyard";
import { entryDrawing } from "./entry";
import { facadeDrawing } from "./facade";
import { gamesDrawing } from "./games";
import { mainFloorDrawing } from "./main-floor";
import { markDrawing } from "./mark";
import { mezzanineNightDrawing } from "./mezzanine-night";
import { mezzanineStairDrawing } from "./mezzanine-stair";
import { wallLampDrawing } from "./wall-lamp";

export const DRAWINGS: Record<string, () => Drawing> = {
  mark: markDrawing,
  facade: facadeDrawing,
  entry: entryDrawing,
  "main-floor": mainFloorDrawing,
  "wall-lamp": wallLampDrawing,
  "mezzanine-stair": mezzanineStairDrawing,
  "mezzanine-night": mezzanineNightDrawing,
  courtyard: courtyardDrawing,
  games: gamesDrawing,
};

export function drawingFor(id: string): Drawing {
  const make = DRAWINGS[id];
  if (!make) throw new Error(`No drawing module for "${id}"`);
  return make();
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- drawings`
Expected: PASS. `tests/drawings.test.ts` (manifest, and every module valid, within budget and on its crop, including `courtyard` and `games`) and `tests/drawings-courtyard-games.test.ts` (8 tests).

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

Run: `npx tsx scripts/review.ts courtyard`
Expected: `courtyard: 238 strokes (budget 260) { structure: 23, detail: 79, life: 134, lamp: 2 }`, then `review/courtyard-overlay.png`; exit 0.

Run: `npx tsx scripts/review.ts games`
Expected: `games: 71 strokes (budget 180) { structure: 11, detail: 56, life: 4, lamp: 0 }`; no overlay (no guide); exit 0.

- [ ] **Step 5: Look**

Read `review/courtyard-drawing.png`, `review/courtyard-phone.png` and `review/courtyard-overlay.png`. Checklist:
- One weight throughout; round caps; no stroke shorter than 12 units except the two garden-light bulbs.
- Overlay: the beam band, the downlights, both railings, the painting frame, the stair rail, the table top and both cushions sit within about 15 units of the photo's edges. If one is off, change that constant only.
- Phone PNG: at a glance it reads as a court under a mezzanine: the ceiling band with its four downlights, the railing band, a tall creeper rising from behind the table, palms either side, a table with two bent-back chairs and striped cushions.
- Nothing is drawn that the photo does not show, and no person: the figure at the mezzanine railing is absent.
- 238 strokes, within 260.
- If the phone PNG is muddy, delete `detail` strokes first (the ceiling rails, then the garden posts, then chair slats), never `structure`, and rerun the review.

Read `review/games-drawing.png` and `review/games-phone.png`. Checklist:
- Reads as three things on one sheet: a bookcase of standing books over a shelf of stacked game boxes, and a pool table with six pockets, a racked triangle of three balls, the cue ball and a cue.
- Books vary in width and height; every third or so has a band near its top; the last book leans right against the case without crossing its neighbour.
- Every box has a lid line; the piles sit on the lower board.
- No room, wall, window, lamp or person is drawn.

Then with the dev server on 3021 and Playwright MCP, for each of `courtyard` and `games`, open `http://localhost:3021/lab/<id>?mode=draw&at=14:00` at 390x844 and at 1440x900, wait for `svg.drawing[data-drawn]`, and take a screenshot; then `http://localhost:3021/lab/<id>?mode=static&at=01:00` at both sizes. Read all eight screenshots. Checklist:
- Day: ink lines on the drafting-film paper, drawn structure first, then detail, then life; no stroke is missing when `data-drawn` is set.
- Night (courtyard): lines in night ink on steel; soft lamp glows behind the two garden lights and the two pendant shades, nowhere else.
- Night (games): no glows at all.
- 390 px: the courtyard's chairs and table and the games table's rack and cue ball are distinct, not a smudge; 1440 px: the line weight is 1.5 px and nothing looks thin or broken.
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add drawings/courtyard.ts drawings/games.ts drawings/index.ts tests/drawings-courtyard-games.test.ts
git commit -m "feat: courtyard drawing and the games still life"
```

---


### Task 12: The alley sign drawing

**Files:**
- Create: `drawings/alley-sign.ts`
- Modify: `drawings/index.ts` (import and register `alleySignDrawing`)
- Test: `tests/drawings-alley-sign.test.ts`

**Interfaces:**
- Consumes: `bulb`, `leaf` (`lib/draw/glyphs.ts`); `curve`, `ellipse`, `line`, `polyline` (`lib/draw/primitives.ts`); `Drawing`, `Glow`, `P`, `Stroke` (`lib/draw/types.ts`); `frameOf`, `metaFor` (`lib/drawings.ts`); `DRAWINGS`, `drawingFor` (`drawings/index.ts`); the guide and review scripts (Tasks 3 and 4); `/lab/<id>` (Task 6).
- Produces:
  - `alleySignDrawing(): Drawing`: id `alley-sign`, frame `x 60, y 380, width 1020, height 1520` (the crop `[60, 380, 1080, 1900]`), 116 strokes. Lamp ids `bulb-0` to `bulb-61`: 62 bulbs spelling B, O, W, L in reading order (each letter's bulbs in drawing order along its centre line, about 22 units apart, radius 6). `glows`: 8 (one per marquee letter, the pin's bands, OPEN, the two lightbox panels). No morphs, no other ids.
  - Registry key `alley-sign`. `lift` stays `false` in `content/drawings.json` (a reel caption crosses the pin), so Task 14 builds no photograph for it and Task 20's `<Sheet>` shows no toggle. Task 15 chases the bulbs after dark; Task 16 uses the structure layer as the bowling pane's vignette.

How this task resolves the contract's options, from the photograph:
- **The letters are bulbs, not lines.** Each letter's centre line (`B_TOP`, `B_LOWER`, `O_RING`, `W_LINE`, `L_LINE`) is a construction path that places the bulbs every 22 units; the path itself is not drawn. Drawn, a line through ring bulbs reads as a chain at 390 px; the rings alone read as the marquee.
- **OPEN is drawn** as six simple stroked letterforms in the lamp layer, on the sign's own sloping baseline.
- **"The Alley" script neon is omitted**: it is a script that cannot be built from lines, and the reel caption crosses it.
- **The lightbox words are not drawn.** The lightbox is its trapezoid, its divider, the rule under "The Alley" with two short text lines standing for the words in the left panel, and the three real rules of the right panel. The wording is not in `content/cafe.json`, so no page prints it unless the café confirms it; add that question to `docs/OPEN-QUESTIONS.md` if a page wants the words.
- **The pin is a custom outline** of 24 measured points, not the small `pin()` glyph; its two bands are closed shapes in the lamp layer.
- The reel caption across y 1010 to 1100 is never traced; the guide layer has it blanked by the manifest's `ignore` rectangle.

- [ ] **Step 1: Write the failing test**

`tests/drawings-alley-sign.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { drawingFor } from "@/drawings";
import { metaFor } from "@/lib/drawings";
import type { P } from "@/lib/draw/types";

/** The centre of a circle stroke drawn as "M cx+r cy A r r ...". */
function circleCentre(d: string): P {
  const [mx, my, r] = d.replace(/[MA]/g, " ").trim().split(/[\s,]+/).map(Number);
  return [mx - r, my];
}

describe("alley sign drawing", () => {
  const d = drawingFor("alley-sign");
  const bulbs = d.strokes.filter((s) => s.id?.startsWith("bulb-"));

  it("sits on its crop, within budget, and never lifts (a reel caption crosses the pin)", () => {
    expect({ x: d.x, y: d.y, width: d.width, height: d.height }).toEqual({ x: 60, y: 380, width: 1020, height: 1520 });
    expect(d.strokes.length).toBeLessThanOrEqual(metaFor("alley-sign").strokeBudget);
    expect(metaFor("alley-sign").lift).toBe(false);
  });

  it("spells BOWL in lamp-layer bulbs numbered in reading order", () => {
    expect(bulbs.length).toBeGreaterThanOrEqual(50);
    expect(bulbs.length).toBeLessThanOrEqual(90);
    bulbs.forEach((b, i) => {
      expect(b.id).toBe(`bulb-${i}`);
      expect(b.layer).toBe("lamp");
    });
    const ys = bulbs.map((b) => circleCentre(b.d)[1]);
    const quarter = Math.floor(ys.length / 4);
    const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
    expect(mean(ys.slice(0, quarter))).toBeLessThan(mean(ys.slice(-quarter)));
  });

  it("spaces the bulbs about 22 units apart and never lets two touch", () => {
    const c = bulbs.map((b) => circleCentre(b.d));
    for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) {
      expect(Math.hypot(c[i][0] - c[j][0], c[i][1] - c[j][1]), `bulb-${i} and bulb-${j}`).toBeGreaterThanOrEqual(11);
    }
    const steps = c.slice(1).map((p, i) => Math.hypot(p[0] - c[i][0], p[1] - c[i][1])).filter((v) => v < 40).sort((a, b) => a - b);
    const median = steps[Math.floor(steps.length / 2)];
    expect(median).toBeGreaterThanOrEqual(18);
    expect(median).toBeLessThanOrEqual(26);
  });

  it("glows on the marquee, the pin's bands, OPEN and the lightbox, and nothing else carries an id", () => {
    expect((d.glows ?? []).length).toBeGreaterThanOrEqual(7);
    for (const s of d.strokes.filter((x) => x.id)) expect(s.id!).toMatch(/^bulb-\d+$/);
    expect(d.strokes.filter((s) => s.layer === "lamp" && !s.id).length).toBeGreaterThanOrEqual(8);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- drawings-alley-sign`
Expected: FAIL. The file fails while collecting (the `describe` block calls `drawingFor`), with `Error: No drawing module for "alley-sign"`.

- [ ] **Step 3: Implement**

**3a. Guides and grid:**

```bash
node scripts/guides/build.mjs alley-sign && node scripts/guides/grid.mjs alley-sign
```

Expected: `guides/alley-sign: photo.jpg, guide-rooms.svg, guide-close.svg` and `guides/alley-sign/grid.png`, with the caption blanked grey. Read `guides/alley-sign/grid.png` (1080 x 1920) and confirm these constants before writing: the marquee's front face from (142, 425) and (362, 425) down to (158, 1300) and (432, 1300), panel joints at y 612, 822 and 1078; the letters B within x 190 to 315, y 445 to 580, O centred at (268, 708), W from (200, 872) to (356, 872) with its lower points at y 978, L's corner at (258, 1250); the pin's crown at (682, 614), its neck at x 632 to 745 near y 700 to 745, its belly at x 560 and 820 near y 1000 to 1100 and its foot at y 1270; the bands at y 744 to 770 and 788 to 816; OPEN's baseline from (612, 962) falling 0.156 per unit to the right; the lightbox corners (300, 1625), (855, 1565), (872, 1772), (310, 1858) and its divider from (587, 1594) to (605, 1830). A constant more than 15 units off is corrected in the module.

**3b. `drawings/alley-sign.ts`:**

```ts
import { bulb, leaf } from "@/lib/draw/glyphs";
import { curve, ellipse, line, polyline } from "@/lib/draw/primitives";
import type { Drawing, Glow, P, Stroke } from "@/lib/draw/types";
import { frameOf, metaFor } from "@/lib/drawings";

/*
 * The alley's sign pylon, drawn from stills/bowl-sign.jpg (1080x1920, measured in its own frame).
 * Crop [60, 380, 1080, 1900]. The reel caption across y 1010-1100 is never drawn, and the "The Alley"
 * script neon under OPEN (crossed by that caption) is left out.
 */

// ---- structure: the marquee column, the steel posts, the pin, the lightbox ----
const PANEL = { topLeft: [142, 425] as P, topRight: [362, 425] as P, bottomLeft: [158, 1300] as P, bottomRight: [432, 1300] as P };
const PANEL_SIDE: [P, P] = [[420, 440], [480, 1300]];
const PANEL_JOINTS_Y = [612, 822, 1078];
const LIGHTBOX = { tl: [300, 1625] as P, tr: [855, 1565] as P, br: [872, 1772] as P, bl: [310, 1858] as P };
const LIGHTBOX_DIVIDER: [P, P] = [[587, 1594], [605, 1830]];
/** Steel posts under the marquee: [top x, bottom x at the lightbox] per line, top at y 1300. */
const POST_LINES: [number, number][] = [[325, 355], [360, 390], [395, 425], [430, 460], [455, 485], [480, 505]];
const POST_TOP = 1300;
const PIN_POST_LINES: [P, P][] = [[[672, 1272], [690, 1590]], [[712, 1272], [730, 1590]]];
/** The pin's silhouette, clockwise from the crown. */
const PIN_OUTLINE: P[] = [
  [682, 614], [728, 625], [750, 660], [745, 705], [735, 745], [738, 790], [760, 850], [800, 930], [820, 1020], [818, 1120], [800, 1210], [785, 1270],
  [600, 1270], [575, 1190], [560, 1100], [562, 1000], [580, 915], [615, 840], [640, 790], [645, 745], [632, 700], [630, 655], [650, 622], [682, 614],
];

// ---- lamp: letter centre lines (construction paths for the bulbs; not drawn, a line through the bulbs reads as a chain) ----
const B_TOP: P[] = [[210, 510], [210, 465], [262, 465], ...ovalPoints([262, 487.5], 28, 22.5, -90, 90, 6), [210, 510]];
const B_LOWER: P[] = [[210, 510], [266, 510], ...ovalPoints([266, 535], 30, 25, -90, 90, 6), [210, 560], [210, 510]];
const O_RING: P[] = ovalPoints([268, 708], 52, 46, -90, 270, 24);
const W_LINE: P[] = [[200, 872], [238, 978], [278, 900], [318, 978], [356, 872]];
const L_LINE: P[] = [[258, 1100], [258, 1250], [350, 1250]];
const LETTERS: P[][][] = [[B_TOP, B_LOWER], [O_RING], [W_LINE], [L_LINE]];
const BULB_SPACING = 22;
const BULB_R = 6;
// ---- detail: lightbox rules and text lines ----
const LEFT_RULE: [P, P] = [[302, 1712], [592, 1680]];
const LEFT_TEXT: [P, P][] = [[[350, 1660], [540, 1640]], [[360, 1780], [560, 1756]]];
const RIGHT_RULES: [P, P][] = [[[600, 1630], [852, 1612]], [[606, 1690], [858, 1668]], [[611, 1750], [864, 1722]]];

// ---- lamp: pin bands and OPEN ----
const PIN_BANDS: P[][] = [
  [[650, 744], [740, 752], [738, 770], [648, 762]],
  [[648, 788], [742, 796], [740, 816], [646, 808]],
];
const OPEN = { x0: 612, baseline: 962, cap: 44, slope: 0.156 };

// ---- life: the tree at the right edge ----
const TREE_BRANCHES: P[][] = [
  [[1040, 1900], [1030, 1750], [1000, 1600], [985, 1460], [1000, 1370]],
  [[1012, 1680], [1040, 1630], [1060, 1600]],
];
const TREE_CLUSTERS: P[] = [[1000, 1370], [955, 1470], [1050, 1450], [985, 1565], [1060, 1600]];
const TREE_LEAF = 34;
const CLUSTER_ANGLES = [-150, -95, -35, 150];

/** Points on an elliptical arc, degrees clockwise from +x. */
function ovalPoints(c: P, rx: number, ry: number, fromDeg: number, toDeg: number, steps: number): P[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = ((fromDeg + ((toDeg - fromDeg) * i) / steps) * Math.PI) / 180;
    return [c[0] + Math.cos(a) * rx, c[1] + Math.sin(a) * ry] as P;
  });
}

/** Points every `spacing` units along a polyline, starting at its first point. */
function beads(path: P[], spacing: number): P[] {
  const segs = path.slice(1).map((b, i) => ({ a: path[i], b, len: Math.hypot(b[0] - path[i][0], b[1] - path[i][1]) }));
  const total = segs.reduce((s, x) => s + x.len, 0);
  const count = Math.max(1, Math.round(total / spacing));
  const out: P[] = [];
  for (let k = 0; k <= count; k++) {
    let at = (k / count) * total;
    for (const s of segs) {
      if (at <= s.len || s === segs[segs.length - 1]) {
        const t = s.len ? Math.min(1, at / s.len) : 0;
        out.push([s.a[0] + (s.b[0] - s.a[0]) * t, s.a[1] + (s.b[1] - s.a[1]) * t]);
        break;
      }
      at -= s.len;
    }
  }
  return out;
}

/** Bulb centres for one letter, in drawing order, never two closer than half the spacing. */
function letterBulbs(paths: P[][]): P[] {
  const out: P[] = [];
  for (const p of paths) for (const b of beads(p, BULB_SPACING)) if (out.every((o) => Math.hypot(o[0] - b[0], o[1] - b[1]) >= BULB_SPACING / 2)) out.push(b);
  return out;
}

/** The y of the lightbox's top edge at x. */
function lightboxTopAt(x: number): number {
  const { tl, tr } = LIGHTBOX;
  return tl[1] + ((tr[1] - tl[1]) * (x - tl[0])) / (tr[0] - tl[0]);
}

function openLetters(): Stroke[] {
  const { x0, baseline, cap, slope } = OPEN;
  const s = (x: number, y: number): P => [x, y + (x - x0) * slope];
  const top = baseline - cap;
  const mid = baseline - cap / 2;
  return [
    ellipse(s(630, mid), 16, cap / 2, "lamp"),
    line(s(656, baseline), s(656, top), "lamp"),
    curve([s(656, top), s(672, top), s(683, top + 7), s(683, mid - 6), s(672, mid), s(656, mid)], "lamp"),
    polyline([s(718, top), s(696, top), s(696, baseline), s(718, baseline)], "lamp"),
    line(s(696, mid), s(714, mid), "lamp"),
    polyline([s(732, baseline), s(732, top), s(762, baseline), s(762, top)], "lamp"),
  ];
}

export function alleySignDrawing(): Drawing {
  const { topLeft, topRight, bottomLeft, bottomRight } = PANEL;
  const jointAt = (y: number): [P, P] => {
    const t = (y - topLeft[1]) / (bottomLeft[1] - topLeft[1]);
    return [[topLeft[0] + (bottomLeft[0] - topLeft[0]) * t, y], [topRight[0] + (bottomRight[0] - topRight[0]) * t, y]];
  };
  const structure: Stroke[] = [
    polyline([bottomLeft, topLeft, topRight, PANEL_SIDE[0]]),
    line(topRight, bottomRight),
    line(...PANEL_SIDE),
    line(bottomLeft, [PANEL_SIDE[1][0], PANEL_SIDE[1][1]]),
    ...PANEL_JOINTS_Y.map((y) => line(...jointAt(y))),
    ...POST_LINES.map(([x0, x1]) => line([x0, POST_TOP], [x1, lightboxTopAt(x1)])),
    ...PIN_POST_LINES.map(([a, b]) => line(a, [b[0], lightboxTopAt(b[0])])),
    curve(PIN_OUTLINE, "structure"),
    polyline([LIGHTBOX.tl, LIGHTBOX.tr, LIGHTBOX.br, LIGHTBOX.bl], "structure", true),
    line(...LIGHTBOX_DIVIDER),
  ];
  const detail: Stroke[] = [
    line(...LEFT_RULE, "detail"),
    ...LEFT_TEXT.map(([a, b]) => line(a, b, "detail")),
    ...RIGHT_RULES.map(([a, b]) => line(a, b, "detail")),
  ];
  const life: Stroke[] = [
    ...TREE_BRANCHES.map((b) => curve(b, "life")),
    ...TREE_CLUSTERS.flatMap((c, i) => CLUSTER_ANGLES.map((a) => leaf(c, TREE_LEAF, a + i * 11))),
  ];
  const bulbs = LETTERS.flatMap(letterBulbs).map((c, i) => ({ ...bulb(c, BULB_R), id: `bulb-${i}` }));
  const lamp: Stroke[] = [...PIN_BANDS.map((b) => polyline(b, "lamp", true)), ...openLetters(), ...bulbs];
  const glows: Glow[] = [
    { x: 262, y: 512, r: 120 }, { x: 268, y: 708, r: 120 }, { x: 278, y: 925, r: 125 }, { x: 290, y: 1178, r: 125 },
    { x: 695, y: 780, r: 75 },
    { x: 692, y: 945, r: 95 },
    { x: 445, y: 1735, r: 140 }, { x: 735, y: 1690, r: 140 },
  ];
  return { id: "alley-sign", title: metaFor("alley-sign").title, ...frameOf("alley-sign"), strokes: [...structure, ...detail, ...life, ...lamp], glows };
}
```

**3c. Register it in `drawings/index.ts`** (the whole file after this task):

```ts
import type { Drawing } from "@/lib/draw/types";
import { alleySignDrawing } from "./alley-sign";
import { courtyardDrawing } from "./courtyard";
import { entryDrawing } from "./entry";
import { facadeDrawing } from "./facade";
import { gamesDrawing } from "./games";
import { mainFloorDrawing } from "./main-floor";
import { markDrawing } from "./mark";
import { mezzanineNightDrawing } from "./mezzanine-night";
import { mezzanineStairDrawing } from "./mezzanine-stair";
import { wallLampDrawing } from "./wall-lamp";

export const DRAWINGS: Record<string, () => Drawing> = {
  mark: markDrawing,
  facade: facadeDrawing,
  entry: entryDrawing,
  "main-floor": mainFloorDrawing,
  "wall-lamp": wallLampDrawing,
  "mezzanine-stair": mezzanineStairDrawing,
  "mezzanine-night": mezzanineNightDrawing,
  courtyard: courtyardDrawing,
  games: gamesDrawing,
  "alley-sign": alleySignDrawing,
};

export function drawingFor(id: string): Drawing {
  const make = DRAWINGS[id];
  if (!make) throw new Error(`No drawing module for "${id}"`);
  return make();
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- drawings`
Expected: PASS, including `alley-sign is valid and within budget` in `tests/drawings.test.ts` and the 4 tests in `tests/drawings-alley-sign.test.ts`.

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

Run: `npx tsx scripts/review.ts alley-sign`
Expected: `alley-sign: 116 strokes (budget 260) { structure: 18, detail: 6, life: 22, lamp: 70 }`, then `review/alley-sign-overlay.png`; exit 0. (The overlay is a review aid only; `lift: false` keeps the photograph off the site.)

- [ ] **Step 5: Look**

Read `review/alley-sign-drawing.png`, `review/alley-sign-phone.png` and `review/alley-sign-overlay.png`. Checklist:
- One weight; round caps; no stroke shorter than 12 units (the bulb rings are exempt).
- Phone PNG: BOWL reads top to bottom in ring bulbs inside the four panels of the column; no two bulbs touch; the pin stands to the right with two bands at its neck and OPEN across its body; the lightbox sits under both on its posts; the tree's leaves show at the right edge.
- Overlay: the column's edges, the panel joints, the pin's silhouette, the bands, OPEN and the lightbox's corners and divider sit within about 15 units of the photo; the bulbs follow the letters' strokes.
- Not drawn: the reel caption, the script "The Alley" neon, any lightbox lettering.
- 116 strokes, within 260.
- If the phone PNG is muddy, delete `detail` strokes first (the two left-panel text lines), never `structure`, and rerun.

Then with the dev server on 3021 and Playwright MCP, open `http://localhost:3021/lab/alley-sign?mode=draw&at=14:00` at 390x844 and at 1440x900 (wait for `svg.drawing[data-drawn]`, screenshot), and `http://localhost:3021/lab/alley-sign?mode=static&at=01:00` at both sizes. Read the four screenshots. Checklist:
- Day: the column, posts, pin and lightbox draw first, then the lightbox rules, then the tree, then the bands, OPEN and the bulbs.
- Night: warm glows sit behind each of the four letters, the pin's bands, OPEN and both lightbox panels; nothing else glows. (Until Task 15, the bulbs themselves are drawn in night ink.)
- 390 px: the word BOWL is legible without zooming; 1440 px: the rings are round and even.
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add drawings/alley-sign.ts drawings/index.ts tests/drawings-alley-sign.test.ts
git commit -m "feat: the alley sign drawing, BOWL in bulbs, the pin and the lightbox"
```

---


### Task 13: The close-ups: hoodie, NoCatch table, pizza and dough

**Files:**
- Create: `drawings/hoodie.ts`, `drawings/nocatch.ts`, `drawings/pizza.ts`, `drawings/dough.ts`
- Modify: `drawings/index.ts` (import and register the four)
- Test: `tests/drawings-close-ups.test.ts`

**Interfaces:**
- Consumes: `brush`, `leaf` (`lib/draw/glyphs.ts`); `circle`, `curve`, `ellipse`, `line`, `n`, `polyline`, `rect` (`lib/draw/primitives.ts`); `Drawing`, `Layer`, `P`, `Stroke` (`lib/draw/types.ts`); `frameOf`, `metaFor` (`lib/drawings.ts`); `DRAWINGS`, `drawingFor` (`drawings/index.ts`); `scripts/guides/build.mjs`, `grid.mjs`, `extract.mjs` (Task 4); `scripts/review.ts` (Task 3); `/lab/<id>` (Task 6).
- Produces (all four are still: no ids, no morphs, no glows):
  - `hoodieDrawing(): Drawing`: id `hoodie`, frame `x 0, y 72, width 1080, height 1428`, 25 strokes. Used by `/host` (Task 20).
  - `nocatchDrawing(): Drawing`: id `nocatch`, frame `x 0, y 0, width 1080, height 1500`, 88 strokes. Used by `/shoot` (Task 20).
  - `pizzaDrawing(): Drawing`: id `pizza`, frame `x 0, y 420, width 1080, height 1270`, 31 strokes. Used by `/menu` beside Curriza (Task 21).
  - `doughDrawing(): Drawing`: id `dough`, frame `x 0, y 60, width 1080, height 1630`, 16 strokes. Used by `/menu` beside the fixed brunch (Task 21).
  - Registry keys `hoodie`, `nocatch`, `pizza`, `dough`. All four are `lift: true`, so Task 14 builds their photographs.

Rules these drawings keep:
- **No people.** The gloved hand holding the brush in the hoodie still is not drawn. The two people at the NoCatch table are not drawn, and nothing is drawn where they sit: the curtain folds stop above the man's head, the palm's fronds are routed above it, and the pot's right side (behind him) is left out. The test checks two boxes around the people's heads.
- **Hands only in the dough drawing**, only as guided contours: six outlines that turn at the fingertips, no knuckles, nails or creases, refined from `extract.mjs` in Step 3. No other drawing here has a guided contour except the pizza's rim and crust (a food silhouette, four curves).
- **No steam.** No cup is in any of these frames, so no `steam-*` strokes are emitted.
- The pizza's toppings are drawn only as rings, small circles and the mark's leaf: 17 strokes, within the 20 allowed.

- [ ] **Step 1: Write the failing test**

`tests/drawings-close-ups.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { drawingFor } from "@/drawings";
import { metaFor } from "@/lib/drawings";
import type { P } from "@/lib/draw/types";

/** On-curve points of a path built from M, L, C and Q commands (paths with arcs return none). */
function onCurvePoints(d: string): P[] {
  if (d.includes("A")) return [];
  return d
    .split(/(?=[MLCQ])/)
    .map((seg) => seg.replace(/[MLCQZ]/g, " ").trim().split(/[\s,]+/).map(Number))
    .filter((v) => v.length >= 2)
    .map((v) => [v[v.length - 2], v[v.length - 1]] as P);
}

const CROPS: Record<string, { x: number; y: number; width: number; height: number }> = {
  hoodie: { x: 0, y: 72, width: 1080, height: 1428 },
  nocatch: { x: 0, y: 0, width: 1080, height: 1500 },
  pizza: { x: 0, y: 420, width: 1080, height: 1270 },
  dough: { x: 0, y: 60, width: 1080, height: 1630 },
};

describe("close-up drawings", () => {
  for (const id of Object.keys(CROPS)) {
    it(`${id} sits on its crop, within budget, still: no ids, no steam, no glows`, () => {
      const d = drawingFor(id);
      expect({ x: d.x, y: d.y, width: d.width, height: d.height }).toEqual(CROPS[id]);
      expect(d.strokes.length).toBeLessThanOrEqual(metaFor(id).strokeBudget);
      expect(d.strokes.filter((s) => s.id)).toHaveLength(0);
      expect(d.glows).toBeUndefined();
      expect(d.morphs).toBeUndefined();
    });
  }

  it("dough draws its hands as at most eight smooth guided contours and nothing leafy", () => {
    const d = drawingFor("dough");
    const life = d.strokes.filter((s) => s.layer === "life");
    expect(life.length).toBeGreaterThan(0);
    expect(life.length).toBeLessThanOrEqual(8);
    for (const s of life) expect(s.d).toMatch(/^M[^C]*C/);
    expect(d.strokes.some((s) => s.d.includes("Q"))).toBe(false);
  });

  it("pizza keeps its toppings to twenty strokes at most", () => {
    const d = drawingFor("pizza");
    const toppings = d.strokes.filter((s) => s.layer === "life" || (s.layer === "detail" && s.d.includes("A")));
    expect(toppings.length).toBeGreaterThan(0);
    expect(toppings.length).toBeLessThanOrEqual(20);
  });

  it("nocatch draws nothing where the two people sit", () => {
    const d = drawingFor("nocatch");
    const people: [number, number, number, number][] = [[850, 890, 970, 1060], [20, 1030, 190, 1230]];
    for (const s of d.strokes) for (const [x, y] of onCurvePoints(s.d)) {
      for (const [x0, y0, x1, y1] of people) expect(x > x0 && x < x1 && y > y0 && y < y1, `${s.d.slice(0, 40)} at ${x},${y}`).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- drawings-close-ups`
Expected: FAIL, 7 tests, with `Error: No drawing module for "hoodie"` (and `"nocatch"`, `"pizza"`, `"dough"`).

- [ ] **Step 3: Implement**

**3a. Guides and grids:**

```bash
node scripts/guides/build.mjs hoodie nocatch pizza dough
for id in hoodie nocatch pizza dough; do node scripts/guides/grid.mjs $id; done
```

Expected: four `guides/<id>: photo.jpg, guide-rooms.svg, guide-close.svg` lines and four `grid.png` files. Read each grid and confirm, before writing the modules:
- `guides/hoodie/grid.png` (1080 x 1500): the jar's mouth centred at (485, 607), 160 wide; the neck's foot at y 640, the shoulder at y 668, the body 186 wide down to y 836; the label's left edge at x 450 from y 700 to 828; the brush leaving the mouth at (476, 600) toward (405, 440); the hoodie's lower edge at (305, 690) and (1080, 772); the top brush handle's end at (290, 1122), the bottom one's at (280, 1500).
- `guides/nocatch/grid.png` (1080 x 1920): the barrel's top rim at y 778 from x 362 to 628, hoops at y 848, 938 and 1058, the barrel's foot at y 1190; the window frame's post at x 215; the pot's rim centred at (768, 998); the table's front edge from (150, 1318) to (1080, 1268); the glass at x 336 to 402, the can at x 508 to 552, the cutlery holder at x 580 to 675.
- `guides/pizza/grid.png` (1080 x 1690): the rim's top near y 510 to 540 across the middle, its bottom near y 1320; the cut notch at the bottom near (700, 1310); the board's handle leaving the frame between x 622 and 770.
- `guides/dough/grid.png` (1080 x 1690): the bowl's rim top at y 190 (outer) and 243 (inner); the upper hand's top fingertip at (345, 390) and second at (320, 488); the lower hand's fingertip at (410, 610); the V where the hands meet near (590, 870).

**3b. Refine the guided contours from the guide.**

For the dough's hands:

```bash
node scripts/guides/extract.mjs dough --box=0,340,1080,1320 --variant=close --tol=6 --max=8 --min=150
```

Expected: one JSON array of up to eight point arrays, and `N contour(s), M points` on stderr. The module below already holds starting arrays measured from the grid (`UPPER_HAND`, `LOWER_HAND`: three contours each). For each of the six, find a printed array that runs along the same edge (its ends within about 40 units of the starting array's ends); if there is one, replace the starting array's points with it, trimmed to at most 12 points, but keep the starting array's three fingertip points where the extracted contour cuts the turn short (a contour without its fingertip turn no longer reads as a finger). Where no printed array matches, keep the starting array. Never add a seventh hand contour.

For the pizza's rim and crust:

```bash
node scripts/guides/extract.mjs pizza --box=0,460,1080,1340 --variant=close --tol=5 --max=6 --min=200
```

Replace `RIM_UPPER`, `RIM_LOWER`, `CRUST_UPPER` and `CRUST_LOWER` the same way, each with the printed array that follows the same edge, trimmed to at most 12 points; keep the starting array where none matches.

Stroke counts do not change with these replacements.

**3c. `drawings/hoodie.ts`:**

```ts
import { brush } from "@/lib/draw/glyphs";
import { curve, ellipse, line, n, polyline } from "@/lib/draw/primitives";
import type { Drawing, Layer, P, Stroke } from "@/lib/draw/types";
import { frameOf, metaFor } from "@/lib/drawings";

/*
 * The hoodie workshop, drawn from stills/host-hoodie-painting.jpg (1080x1500, measured in its own frame).
 * Crop [0, 72, 1080, 1500]: the date caption above y 72 is outside it. The gloved hand holding the brush
 * (top left) is a person and is not drawn; the brush's handle ends where the glove holds it.
 */

// ---- structure: the paint jar ----
const JAR_AXIS = 485;
const MOUTH = { c: [JAR_AXIS, 607] as P, rx: 80, ry: 17 };
const NECK_BOTTOM = 640;
const SHOULDER = 668;
const BODY_HALF = 93;
const BASE = { y: 836, ry: 18 };
const LABEL: P[] = [[578, 692], [450, 700], [450, 828], [578, 820]];
const LABEL_TEXT: [P, P][] = [[[464, 726], [562, 721]], [[464, 748], [562, 743]], [[464, 770], [540, 766]]];

// ---- detail: the brush in the jar, the brushes on the table ----
const JAR_BRUSH = { handle: [405, 440] as P, tip: [476, 600] as P };
/** Four of the brushes lying on the table, rising to the right (the most distinct; six packed together read as hatching). Centre line left to right, half-widths at each end. */
const HANDLES: { from: P; to: P; w0: number; w1: number; end: boolean }[] = [
  { from: [290, 1122], to: [1080, 985], w0: 16, w1: 8, end: true },
  { from: [-20, 1312], to: [1080, 1112], w0: 18, w1: 9, end: false },
  { from: [-20, 1452], to: [1080, 1290], w0: 18, w1: 10, end: false },
  { from: [280, 1500], to: [1080, 1392], w0: 16, w1: 9, end: true },
];

// ---- life: the folded hoodie (soft contours, constructed as curves through measured points) ----
const HOODIE: P[][] = [
  [[430, 470], [470, 330], [600, 262], [800, 215], [980, 225], [1080, 262]],
  [[430, 470], [360, 560], [312, 640], [305, 690]],
  [[305, 690], [392, 694]],
  [[578, 713], [700, 722], [900, 748], [1080, 772]],
  [[430, 470], [560, 500], [665, 520], [800, 500], [930, 470]],
  [[665, 520], [658, 610], [672, 712]],
  [[930, 470], [962, 432], [1030, 418], [1080, 425]],
  [[900, 580], [960, 602], [1012, 640]],
];

/** An elliptical arc, degrees clockwise from +x (screen), as one SVG arc command. */
function ellipseArc(c: P, rx: number, ry: number, fromDeg: number, toDeg: number, layer: Layer = "detail"): Stroke {
  const at = (deg: number): P => [c[0] + Math.cos((deg * Math.PI) / 180) * rx, c[1] + Math.sin((deg * Math.PI) / 180) * ry];
  const [a, b] = [at(fromDeg), at(toDeg)];
  const sweep = toDeg - fromDeg;
  return { d: `M${n(a[0])} ${n(a[1])}A${n(rx)} ${n(ry)} 0 ${Math.abs(sweep) > 180 ? 1 : 0} ${sweep > 0 ? 1 : 0} ${n(b[0])} ${n(b[1])}`, layer };
}

function handle(h: (typeof HANDLES)[number]): Stroke {
  const dx = h.to[0] - h.from[0], dy = h.to[1] - h.from[1];
  const len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;
  const a0: P = [h.from[0] + nx * h.w0, h.from[1] + ny * h.w0];
  const b0: P = [h.from[0] - nx * h.w0, h.from[1] - ny * h.w0];
  const a1: P = [h.to[0] + nx * h.w1, h.to[1] + ny * h.w1];
  const b1: P = [h.to[0] - nx * h.w1, h.to[1] - ny * h.w1];
  // A handle whose end lies inside the frame is drawn with its rounded-off end; the others run out of the frame.
  return h.end ? polyline([a1, a0, b0, b1], "detail") : polyline([a0, a1], "detail");
}

function handleLower(h: (typeof HANDLES)[number]): Stroke | null {
  if (h.end) return null;
  const dx = h.to[0] - h.from[0], dy = h.to[1] - h.from[1];
  const len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;
  return line([h.from[0] - nx * h.w0, h.from[1] - ny * h.w0], [h.to[0] - nx * h.w1, h.to[1] - ny * h.w1], "detail");
}

export function hoodieDrawing(): Drawing {
  const l = JAR_AXIS - MOUTH.rx, r = JAR_AXIS + MOUTH.rx;
  const bl = JAR_AXIS - BODY_HALF, br = JAR_AXIS + BODY_HALF;
  const structure: Stroke[] = [
    ellipse(MOUTH.c, MOUTH.rx, MOUTH.ry, "structure"),
    ellipseArc([JAR_AXIS, NECK_BOTTOM], MOUTH.rx, MOUTH.ry, 0, 180, "structure"),
    polyline([[l, MOUTH.c[1]], [l, NECK_BOTTOM], [bl, SHOULDER], [bl, BASE.y]]),
    polyline([[r, MOUTH.c[1]], [r, NECK_BOTTOM], [br, SHOULDER], [br, BASE.y]]),
    ellipseArc([JAR_AXIS, BASE.y], BODY_HALF, BASE.ry, 0, 180, "structure"),
  ];
  const detail: Stroke[] = [
    polyline(LABEL, "detail"),
    ...LABEL_TEXT.map(([a, b]) => line(a, b, "detail")),
    ...brush(JAR_BRUSH.handle, JAR_BRUSH.tip),
    ...HANDLES.map(handle),
    ...HANDLES.map(handleLower).filter((s): s is Stroke => s !== null),
  ];
  const life: Stroke[] = HOODIE.map((p) => curve(p, "life"));
  return { id: "hoodie", title: metaFor("hoodie").title, ...frameOf("hoodie"), strokes: [...structure, ...detail, ...life] };
}
```

**3d. `drawings/nocatch.ts`:**

```ts
import { leaf } from "@/lib/draw/glyphs";
import { curve, ellipse, line, n, polyline, rect } from "@/lib/draw/primitives";
import type { Drawing, Layer, P, Stroke } from "@/lib/draw/types";
import { frameOf, metaFor } from "@/lib/drawings";

/*
 * Where the NoCatch film was shot, drawn from stills/shoot-nocatch-table.jpg (1080x1920, measured in its own frame).
 * Crop [0, 0, 1080, 1500]. Two people sit at this table in the film still; they are not drawn, and nothing
 * is drawn where they sit (curtain folds stop above the man's head). Only the barrel, the sheer curtains,
 * the window frame, the palm in its pot, the table and what stands on it.
 */

// ---- structure: window frame, barrel, table ----
const WINDOW_LINES: [P, P][] = [
  [[215, 0], [215, 1000]], [[0, 275], [215, 275]], [[0, 740], [215, 740]],
  [[68, 0], [68, 275]], [[0, 205], [68, 205]], [[0, 800], [72, 800]], [[72, 800], [72, 1010]], [[0, 925], [72, 925]],
];
const BARREL = {
  axis: 495, top: 778, topRx: 133, topRy: 10, bottom: 1190, bottomRx: 142, bottomRy: 12,
  left: [[362, 780], [338, 880], [334, 980], [345, 1100], [360, 1190]] as P[],
  right: [[628, 780], [652, 880], [658, 980], [648, 1100], [632, 1190]] as P[],
  hoops: [[848, 150], [938, 161], [1058, 156]] as [number, number][],
  hoopRy: 12,
  staves: [[[420, 786], [408, 980], [418, 1188]], [[570, 786], [582, 980], [572, 1188]]] as P[][],
};
const TABLE = { back: [[320, 1212], [790, 1205]] as [P, P], front: [[150, 1318], [1080, 1268]] as [P, P], edge: [[170, 1348], [1080, 1298]] as [P, P], legsX: [548, 590], legTop: 1345 };

// ---- detail: curtains, pot, what stands on the table ----
const CURTAIN = { x0: 240, x1: 1015, step: 45 };
const CURTAIN_LEFT_EDGE: P[] = [[222, 0], [232, 300], [245, 620], [285, 860], [335, 1000]];
/** Where each fold stops: the barrel's top, the palm's crown, or above the seated man. */
const FOLD_STOPS: { x0: number; x1: number; y: P[] }[] = [
  { x0: 0, x1: 335, y: [[240, 1000], [335, 1000]] },
  { x0: 335, x1: 650, y: [[335, 772], [650, 772]] },
  { x0: 650, x1: 1080, y: [[640, 800], [700, 690], [760, 650], [820, 700], [880, 740], [960, 760], [1040, 790]] },
];
/** Only the pot's rim and left side: its right side is behind the seated man. */
const POT = { c: [768, 998] as P, rx: 72, ry: 10, bottom: 1168, taper: 14 };
const GLASS: P[] = [[336, 1212], [346, 1300], [392, 1300], [402, 1212]];
const GLASS_RIM = { c: [369, 1212] as P, rx: 33, ry: 6 };
const CAN = { x: 508, top: 1196, bottom: 1296, w: 44, ry: 5 };
const HOLDER = { x: 580, y: 1186, w: 95, h: 80 };
const HOLDER_BASE: [P, P] = [[568, 1272], [690, 1272]];
const CUTLERY: [P, P][] = [[[602, 1186], [588, 1140]], [[626, 1186], [630, 1128]], [[652, 1186], [690, 1124]]];
const SHAKE = { bowl: [[786, 1120], [794, 1226], [815, 1242], [836, 1226], [844, 1120]] as P[], stem: [[815, 1242], [815, 1258]] as [P, P], base: { c: [815, 1262] as P, rx: 26, ry: 6 } };

// ---- life: the palm ----
const PALM_CROWN: P = [768, 985];
const FRONDS: { rib: P[]; pairs: number }[] = [
  { rib: [PALM_CROWN, [740, 820], [710, 700], [712, 655]], pairs: 3 },
  { rib: [PALM_CROWN, [800, 850], [860, 760], [900, 720]], pairs: 3 },
  { rib: [PALM_CROWN, [860, 860], [960, 800], [1045, 790]], pairs: 3 },
  { rib: [PALM_CROWN, [700, 890], [650, 830], [630, 805]], pairs: 2 },
  { rib: [PALM_CROWN, [780, 780], [800, 690], [830, 655]], pairs: 3 },
];
const FROND_LEAF = 46;

function ellipseArc(c: P, rx: number, ry: number, fromDeg: number, toDeg: number, layer: Layer = "detail"): Stroke {
  const at = (deg: number): P => [c[0] + Math.cos((deg * Math.PI) / 180) * rx, c[1] + Math.sin((deg * Math.PI) / 180) * ry];
  const [a, b] = [at(fromDeg), at(toDeg)];
  const sweep = toDeg - fromDeg;
  return { d: `M${n(a[0])} ${n(a[1])}A${n(rx)} ${n(ry)} 0 ${Math.abs(sweep) > 180 ? 1 : 0} ${sweep > 0 ? 1 : 0} ${n(b[0])} ${n(b[1])}`, layer };
}

function yOn(poly: P[], x: number): number {
  if (x <= poly[0][0]) return poly[0][1];
  for (let i = 1; i < poly.length; i++) {
    const [ax, ay] = poly[i - 1];
    const [bx, by] = poly[i];
    if (x <= bx) return ay + ((by - ay) * (x - ax)) / (bx - ax);
  }
  return poly[poly.length - 1][1];
}

function pointAt(path: P[], t: number): { p: P; dir: number } {
  const segs = path.slice(1).map((b, i) => ({ a: path[i], b, len: Math.hypot(b[0] - path[i][0], b[1] - path[i][1]) }));
  let at = t * segs.reduce((s, x) => s + x.len, 0);
  for (const s of segs) {
    if (at <= s.len || s === segs[segs.length - 1]) {
      const k = s.len ? Math.min(1, at / s.len) : 0;
      return { p: [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k], dir: (Math.atan2(s.b[1] - s.a[1], s.b[0] - s.a[0]) * 180) / Math.PI };
    }
    at -= s.len;
  }
  return { p: path[path.length - 1], dir: 0 };
}

function frond(rib: P[], pairs: number, length: number): Stroke[] {
  const out: Stroke[] = [curve(rib, "life")];
  for (let i = 0; i < pairs; i++) {
    const { p, dir } = pointAt(rib, 0.4 + (0.55 * (i + 0.5)) / pairs);
    const len = length * (1 - 0.35 * (i / Math.max(1, pairs - 1)));
    out.push(leaf(p, len, dir - 42), leaf(p, len, dir + 42));
  }
  return out;
}

export function nocatchDrawing(): Drawing {
  const structure: Stroke[] = [
    ...WINDOW_LINES.map(([a, b]) => line(a, b)),
    ellipse([BARREL.axis, BARREL.top], BARREL.topRx, BARREL.topRy, "structure"),
    curve(BARREL.left, "structure"),
    curve(BARREL.right, "structure"),
    ...BARREL.hoops.map(([y, rx]) => ellipseArc([BARREL.axis, y], rx, BARREL.hoopRy, 0, 180, "structure")),
    ellipseArc([BARREL.axis, BARREL.bottom], BARREL.bottomRx, BARREL.bottomRy, 0, 180, "structure"),
    line(...TABLE.back),
    line(...TABLE.front),
    line(...TABLE.edge),
    ...TABLE.legsX.map((x) => line([x, TABLE.legTop], [x, 1500])),
  ];

  const folds: Stroke[] = [];
  for (let x = CURTAIN.x0; x <= CURTAIN.x1; x += CURTAIN.step) {
    const stop = FOLD_STOPS.find((s) => x >= s.x0 && x < s.x1)!;
    folds.push(line([x, 0], [x, yOn(stop.y, x)], "detail"));
  }
  const detail: Stroke[] = [
    curve(CURTAIN_LEFT_EDGE, "detail"),
    ...folds,
    ...BARREL.staves.map((s) => curve(s, "detail")),
    ellipse(POT.c, POT.rx, POT.ry, "detail"),
    line([POT.c[0] - POT.rx, POT.c[1]], [POT.c[0] - POT.rx + POT.taper, POT.bottom], "detail"),
    polyline(GLASS, "detail"),
    ellipse(GLASS_RIM.c, GLASS_RIM.rx, GLASS_RIM.ry, "detail"),
    polyline([[CAN.x, CAN.top], [CAN.x, CAN.bottom], [CAN.x + CAN.w, CAN.bottom], [CAN.x + CAN.w, CAN.top]], "detail"),
    ellipse([CAN.x + CAN.w / 2, CAN.top], CAN.w / 2, CAN.ry, "detail"),
    rect(HOLDER.x, HOLDER.y, HOLDER.w, HOLDER.h, "detail"),
    line(...HOLDER_BASE, "detail"),
    ...CUTLERY.map(([a, b]) => line(a, b, "detail")),
    polyline(SHAKE.bowl, "detail"),
    line(...SHAKE.stem, "detail"),
    ellipse(SHAKE.base.c, SHAKE.base.rx, SHAKE.base.ry, "detail"),
  ];
  const life: Stroke[] = FRONDS.flatMap((f) => frond(f.rib, f.pairs, FROND_LEAF));
  return { id: "nocatch", title: metaFor("nocatch").title, ...frameOf("nocatch"), strokes: [...structure, ...detail, ...life] };
}
```

**3e. `drawings/pizza.ts`:**

```ts
import { leaf } from "@/lib/draw/glyphs";
import { circle, curve, line } from "@/lib/draw/primitives";
import type { Drawing, P, Stroke } from "@/lib/draw/types";
import { frameOf, metaFor } from "@/lib/drawings";

/*
 * The Curriza on its board, drawn from stills/menu-pizza-board.jpg (1080x1690, measured in its own frame).
 * Crop [0, 420, 1080, 1690]: the logo overlay and the hand above the pizza are outside it.
 * The rim and crust are guided contours (a food silhouette, allowed by the spec): four curves,
 * refined with `node scripts/guides/extract.mjs pizza --box=0,460,1080,1340 --variant=close --tol=5 --max=6 --min=200`.
 */

// ---- structure: rim, crust, board ----
const RIM_UPPER: P[] = [[0, 640], [100, 585], [250, 540], [420, 510], [560, 522], [700, 515], [850, 535], [960, 570], [1060, 625], [1080, 650]];
const RIM_LOWER: P[] = [[0, 1182], [100, 1222], [250, 1260], [400, 1292], [540, 1312], [700, 1320], [800, 1302], [960, 1252], [1080, 1185]];
const CRUST_UPPER: P[] = [[0, 690], [200, 598], [400, 552], [560, 560], [700, 548], [900, 585], [1080, 660]];
const CRUST_LOWER: P[] = [[0, 1130], [250, 1195], [450, 1228], [650, 1238], [850, 1208], [1000, 1160], [1080, 1120]];
const BOARD_LEFT: P[] = [[0, 1196], [180, 1272], [360, 1328], [470, 1385], [560, 1455], [600, 1560], [622, 1690]];
const BOARD_RIGHT: P[] = [[1080, 1212], [1000, 1272], [900, 1325], [840, 1380], [800, 1450], [778, 1560], [770, 1690]];

// ---- detail: the cuts, the grain of the handle, the toppings ----
const CENTRE: P = [560, 800];
const CUT_ENDS: P[] = [[505, 556], [990, 592], [1080, 960], [690, 1236], [240, 1200], [0, 880]];
const GRAIN: P[][] = [[[650, 1420], [680, 1560], [690, 1680]], [[740, 1400], [728, 1540], [725, 1660]]];
const RINGS: P[] = [[300, 770], [720, 930], [880, 1100], [180, 1090], [420, 1110]];
const RING_R = 24;
const OLIVES: P[] = [[140, 665], [640, 600], [1000, 760], [380, 900], [600, 1080], [850, 800]];
const OLIVE_R = 14;

// ---- life: broccoli florets as the mark's leaf ----
const FLORETS: [P, number, number][] = [
  [[250, 630], 40, -60], [[455, 650], 40, -120], [[800, 740], 40, -40], [[560, 1150], 38, -100], [[90, 990], 36, -70], [[950, 870], 38, -130],
];

export function pizzaDrawing(): Drawing {
  const structure: Stroke[] = [
    curve(RIM_UPPER, "structure"),
    curve(RIM_LOWER, "structure"),
    curve(CRUST_UPPER, "structure"),
    curve(CRUST_LOWER, "structure"),
    curve(BOARD_LEFT, "structure"),
    curve(BOARD_RIGHT, "structure"),
  ];
  const detail: Stroke[] = [
    ...CUT_ENDS.map((end) => line(CENTRE, end, "detail")),
    ...GRAIN.map((g) => curve(g, "detail")),
    ...RINGS.map((c) => circle(c, RING_R, "detail")),
    ...OLIVES.map((c) => circle(c, OLIVE_R, "detail")),
  ];
  const life: Stroke[] = FLORETS.map(([base, len, angle]) => leaf(base, len, angle));
  return { id: "pizza", title: metaFor("pizza").title, ...frameOf("pizza"), strokes: [...structure, ...detail, ...life] };
}
```

**3f. `drawings/dough.ts`:**

```ts
import { circle, curve, n } from "@/lib/draw/primitives";
import type { Drawing, Layer, P, Stroke } from "@/lib/draw/types";
import { frameOf, metaFor } from "@/lib/drawings";

/*
 * Hands stretching dough, drawn from stills/menu-dough-hands.jpg (1080x1690, measured in its own frame).
 * Crop [0, 60, 1080, 1690]: the logo overlay above y 40 is outside it.
 * The hands are six guided contours (the spec allows hands): outlines that turn at the fingertips, no knuckles, nails or creases.
 * Refine them with `node scripts/guides/extract.mjs dough --box=0,340,1080,1320 --variant=close --tol=6 --max=8 --min=150`.
 * No cup is in the frame, so there is no steam.
 */

// ---- structure: the bowl rim, as true ellipse arcs in perspective ----
const BOWL_CENTRE: P = [540, 900];
const RIM_OUTER = { rx: 760, ry: 710 };
const RIM_INNER = { rx: 700, ry: 657 };
const RIM_FROM = 218;
const RIM_TO = 322;

// ---- detail: the dough's edge, its fold, flour ----
const DOUGH_EDGE: P[] = [[40, 1330], [120, 1400], [300, 1500], [540, 1545], [800, 1510], [980, 1400], [1080, 1300]];
const DOUGH_FOLD: P[] = [[480, 1110], [700, 1090], [900, 1120], [1060, 1200]];
const FLOUR: P[] = [[90, 1600], [210, 1640], [420, 1620], [640, 1655], [860, 1610], [1000, 1650]];
const FLOUR_R = 5;

// ---- life: the hands (guided contours) ----
/** The upper hand, lying palm down with its fingers toward the top left. */
const UPPER_HAND: P[][] = [
  [[1080, 610], [900, 520], [760, 420], [620, 362], [470, 372], [362, 380], [340, 398], [356, 420], [470, 428], [600, 440]],
  [[720, 520], [600, 470], [450, 462], [338, 468], [318, 488], [336, 506], [460, 512], [600, 540]],
  [[395, 600], [480, 680], [560, 780], [605, 870], [700, 960], [850, 1010], [1080, 1040]],
];
/** The lower hand, coming in from the bottom left under the upper one. */
const LOWER_HAND: P[][] = [
  [[0, 985], [120, 880], [250, 740], [360, 640], [400, 608], [425, 618], [420, 645], [380, 700]],
  [[300, 770], [420, 740], [520, 800], [580, 860]],
  [[0, 1290], [200, 1180], [400, 1110], [560, 1070], [700, 1060]],
];

function ellipseArc(c: P, rx: number, ry: number, fromDeg: number, toDeg: number, layer: Layer): Stroke {
  const at = (deg: number): P => [c[0] + Math.cos((deg * Math.PI) / 180) * rx, c[1] + Math.sin((deg * Math.PI) / 180) * ry];
  const [a, b] = [at(fromDeg), at(toDeg)];
  const sweep = toDeg - fromDeg;
  return { d: `M${n(a[0])} ${n(a[1])}A${n(rx)} ${n(ry)} 0 ${Math.abs(sweep) > 180 ? 1 : 0} ${sweep > 0 ? 1 : 0} ${n(b[0])} ${n(b[1])}`, layer };
}

export function doughDrawing(): Drawing {
  const structure: Stroke[] = [
    ellipseArc(BOWL_CENTRE, RIM_OUTER.rx, RIM_OUTER.ry, RIM_FROM, RIM_TO, "structure"),
    ellipseArc(BOWL_CENTRE, RIM_INNER.rx, RIM_INNER.ry, RIM_FROM, RIM_TO, "structure"),
  ];
  const detail: Stroke[] = [
    curve(DOUGH_EDGE, "detail"),
    curve(DOUGH_FOLD, "detail"),
    ...FLOUR.map((c) => circle(c, FLOUR_R, "detail")),
  ];
  const life: Stroke[] = [...UPPER_HAND, ...LOWER_HAND].map((p) => curve(p, "life"));
  return { id: "dough", title: metaFor("dough").title, ...frameOf("dough"), strokes: [...structure, ...detail, ...life] };
}
```

**3g. Register them in `drawings/index.ts`** (the whole file after this task):

```ts
import type { Drawing } from "@/lib/draw/types";
import { alleySignDrawing } from "./alley-sign";
import { courtyardDrawing } from "./courtyard";
import { doughDrawing } from "./dough";
import { entryDrawing } from "./entry";
import { facadeDrawing } from "./facade";
import { gamesDrawing } from "./games";
import { hoodieDrawing } from "./hoodie";
import { mainFloorDrawing } from "./main-floor";
import { markDrawing } from "./mark";
import { mezzanineNightDrawing } from "./mezzanine-night";
import { mezzanineStairDrawing } from "./mezzanine-stair";
import { nocatchDrawing } from "./nocatch";
import { pizzaDrawing } from "./pizza";
import { wallLampDrawing } from "./wall-lamp";

export const DRAWINGS: Record<string, () => Drawing> = {
  mark: markDrawing,
  facade: facadeDrawing,
  entry: entryDrawing,
  "main-floor": mainFloorDrawing,
  "wall-lamp": wallLampDrawing,
  "mezzanine-stair": mezzanineStairDrawing,
  "mezzanine-night": mezzanineNightDrawing,
  courtyard: courtyardDrawing,
  games: gamesDrawing,
  "alley-sign": alleySignDrawing,
  hoodie: hoodieDrawing,
  nocatch: nocatchDrawing,
  pizza: pizzaDrawing,
  dough: doughDrawing,
};

export function drawingFor(id: string): Drawing {
  const make = DRAWINGS[id];
  if (!make) throw new Error(`No drawing module for "${id}"`);
  return make();
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- drawings`
Expected: PASS: `tests/drawings.test.ts` (every module valid, within budget and on its crop, now 14 modules), `tests/drawings-courtyard-games.test.ts` (8), `tests/drawings-alley-sign.test.ts` (4) and `tests/drawings-close-ups.test.ts` (7).

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

Run: `for id in hoodie nocatch pizza dough; do npx tsx scripts/review.ts $id; done`
Expected, each followed by its `review/<id>-overlay.png` line, exit 0:
```
hoodie: 25 strokes (budget 140) { structure: 5, detail: 12, life: 8, lamp: 0 }
nocatch: 88 strokes (budget 160) { structure: 20, detail: 35, life: 33, lamp: 0 }
pizza: 31 strokes (budget 120) { structure: 6, detail: 19, life: 6, lamp: 0 }
dough: 16 strokes (budget 60) { structure: 2, detail: 8, life: 6, lamp: 0 }
```

- [ ] **Step 5: Look**

For each id, read `review/<id>-drawing.png`, `review/<id>-phone.png` and `review/<id>-overlay.png`. Common checklist: one weight; round caps; no stroke shorter than 12 units except the dough's flour specks; the overlay's edges within about 15 units of the photo; within budget; nothing drawn that the photo does not show; no person, no face. If a phone PNG is muddy, delete `detail` strokes first, never `structure`, and rerun.
- **hoodie:** reads as a small paint jar with a label and a brush standing in it, a folded hoodie behind with its fold and cuff, and four brush handles lying diagonally across the table in front; the two handles whose ends are in the frame show their ends. No glove or hand.
- **nocatch:** reads as a barrel with three hoops in front of sheer curtains, a window frame at the left, a palm in a pot, and a table with a glass, a can, a cutlery holder and a tall glass. The places where the two people sit are empty paper, with no stray line through them.
- **pizza:** reads as a whole pizza, cut into six, with a thick crust and a few toppings, on a board whose handle runs out of the bottom of the frame. The rim follows the photo's crust within 15 units after 3b.
- **dough:** reads as two hands pressing dough in a bowl: the bowl's double rim as true arcs, the upper hand's two fingers turning at their tips, the lower hand coming in from the left with its fingertip, the dough's fold and its lower edge, a few flour specks on the counter. No knuckles, nails or creases.

Then with the dev server on 3021 and Playwright MCP, for each id open `http://localhost:3021/lab/<id>?mode=draw&at=14:00` at 390x844 and at 1440x900 (wait for `svg.drawing[data-drawn]`, screenshot), and `http://localhost:3021/lab/<id>?mode=static&at=01:00` at both sizes. Read the sixteen screenshots. Checklist:
- Day: ink on paper; each drawing completes with every stroke present when `data-drawn` is set.
- Night: night ink on steel and no glow anywhere (none of these has a lamp).
- 390 px: the jar, the barrel, the cut pizza and the two hands are each recognisable at a glance; 1440 px: curves are smooth, with no kinks where contour points meet.
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add drawings/hoodie.ts drawings/nocatch.ts drawings/pizza.ts drawings/dough.ts drawings/index.ts tests/drawings-close-ups.test.ts
git commit -m "feat: close-up drawings of the hoodie workshop, the NoCatch table, the pizza and the dough"
```

---

### Task 14: Photographs under the tracing paper

**Files:**
- Create: `scripts/build-photos.mjs`, `lib/photos.ts`, `content/photos.json` (generated, committed), `public/photos/<id>.jpg` (generated, committed: `facade`, `entry`, `main-floor`, `wall-lamp`, `mezzanine-stair`, `mezzanine-night`, `courtyard`, `hoodie`, `nocatch`, `pizza`, `dough`)
- Create: `components/draw/Sheet.tsx` (server component), `components/draw/SheetLift.tsx` (its client half: the lift, the hold, the toggle), `components/draw/sheet.css`
- Create: `app/lab/sheet/[id]/page.tsx` (development only)
- Test: `tests/photos.test.ts`, `scripts/e2e/lift.mjs`

**Interfaces:**
- Consumes: `drawingsMeta`, `metaFor(id)` (Task 3; `lift`, `crop`, `source`, `credit`); `DRAWINGS`, `drawingFor(id)` (Task 3); `Drawing`, `DrawMode` (Task 6); tokens `--ink`, `--ink-2`, `--pen`, `--hair`, `--ease-pen` and the class `.t-label` (Task 5); `open`, `assert`, `report`, `shot` from `scripts/e2e/lib.mjs` (Task 5); sharp 0.35.4 (Task 3).
- Produces:
  - `content/photos.json`: `{ "<id>": { "src": "/photos/<id>.jpg", "width": number, "height": number } }` for every drawing with `lift: true`, and `public/photos/<id>.jpg` (the crop from the source at its own resolution, never enlarged, width capped at 1600, mozjpeg quality 80, progressive).
  - `lib/photos.ts`: `interface Photo { src: string; width: number; height: number }`, `photoFor(id: string): Photo | null`, `honestScale(sourceWidth: number, cssWidth: number, dpr: number): number` = `min(1, 1.25 × sourceWidth ÷ (cssWidth × dpr))` (1 before layout).
  - `components/draw/Sheet.tsx`: `interface SheetProps { id: string; mode?: DrawMode; title?: string; caption?: string; className?: string; children?: ReactNode }` and `<Sheet … />`. It is a server component: render it from pages and server sections, never import it into a `"use client"` module (that would ship every drawing module to the browser). `children` are overlays laid in the same box above the drawing (Task 18's annotations); they fade with the drawing when the paper lifts.
  - DOM contract: `figure.sheet[data-sheet="<id>"]`, `[data-lifted]` while lifted; `.sheet-stack` (the scaled box), `img.sheet-photo`, `.sheet-drawing`, `figcaption.sheet-caption` with `.sheet-text` and `.sheet-credit`, `button.sheet-toggle[aria-pressed]`; CSS custom properties `--sheet-ratio` (height ÷ width) and `--lift-scale`.
  - `/lab/sheet/<id>?mode=static|draw|scrub&at=HH:MM` in development; 404 in production.

Why the design is this way (spec 2.4, 5, 9): the photograph is the evidence behind the drawing, so it is only ever shown at honest size (at most 1.25 device pixels per source pixel). The box shrinks from its top centre rather than stretching the photo; the caption row rides up with the photo's bottom edge using a transform, so nothing below it reflows. The file is not fetched until someone asks to see it. Keyboard users get the toggle button; press-and-hold adds nothing only a pointer could reach.

- [ ] **Step 1: Write the failing tests**

`tests/photos.test.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { drawingsMeta } from "@/lib/drawings";
import { honestScale, photoFor } from "@/lib/photos";

const SOURCE = "D:/barnyard-source/ig";

describe("honestScale", () => {
  it("never enlarges a photograph that has pixels to spare", () => {
    expect(honestScale(1080, 390, 1)).toBe(1);
    expect(honestScale(830, 347, 2)).toBe(1);
  });
  it("shrinks a 720 px still in a 347 px phone column at 3x", () => {
    expect(honestScale(720, 347, 3)).toBeCloseTo(0.8646, 3);
  });
  it("shrinks it to 0.625 in a 720 px column at 2x", () => {
    expect(honestScale(720, 720, 2)).toBe(0.625);
  });
  it("keeps device pixels within 1.25 times source pixels", () => {
    const cases: [number, number, number][] = [[656, 347, 3], [720, 662, 2], [1080, 1200, 2], [830, 390, 2.625], [1080, 347, 3]];
    for (const [source, css, dpr] of cases) {
      expect(css * dpr * honestScale(source, css, dpr)).toBeLessThanOrEqual(1.25 * source + 1e-9);
    }
  });
  it("does not scale before layout or with a missing pixel ratio", () => {
    expect(honestScale(720, 0, 3)).toBe(1);
    expect(honestScale(720, 347, 0)).toBe(1);
  });
});

describe("photographs under the tracing paper", () => {
  it("has a photograph for every drawing that lifts, and none for the rest", () => {
    for (const d of drawingsMeta) {
      if (d.lift) expect(photoFor(d.id), d.id).not.toBeNull();
      else expect(photoFor(d.id), d.id).toBeNull();
    }
    expect(photoFor("no-such-drawing")).toBeNull();
  });

  for (const d of drawingsMeta.filter((m) => m.lift)) {
    it(`${d.id}: the file matches the manifest, keeps the crop's shape and is never enlarged`, async () => {
      const p = photoFor(d.id)!;
      expect(p.src).toBe(`/photos/${d.id}.jpg`);
      const file = path.join("public", p.src);
      expect(fs.existsSync(file), file).toBe(true);
      const meta = await sharp(file).metadata();
      expect([meta.width, meta.height]).toEqual([p.width, p.height]);
      expect(meta.isProgressive).toBe(true);
      expect(p.width).toBeLessThanOrEqual(1600);
      const [x0, y0, x1, y1] = d.crop!;
      expect(p.width / p.height).toBeCloseTo((x1 - x0) / (y1 - y0), 2);
      if (fs.existsSync(SOURCE)) {
        const source = await sharp(path.join(SOURCE, d.source!)).metadata();
        expect(p.width).toBeLessThanOrEqual(Math.round(((x1 - x0) * source.width!) / 1080));
      }
    });
  }
});
```

`scripts/e2e/lift.mjs`:

```js
// The tracing paper, checked against the dev server (the /lab routes exist only in development).
// Run `npm run dev` (port 3021) in a second terminal, then: node scripts/e2e/lift.mjs
process.env.BASE ||= "http://localhost:3021";
const { assert, launch, open, report, shot } = await import("./lib.mjs");

const browser = await launch();

/** Everything the checks read about the first sheet on the page. */
const state = (page) =>
  page.evaluate(() => {
    const fig = document.querySelector("figure.sheet");
    const img = fig.querySelector("img.sheet-photo");
    const stack = fig.querySelector(".sheet-stack");
    const btn = fig.querySelector("button.sheet-toggle");
    const cap = fig.querySelector("figcaption.sheet-caption");
    const r = img ? img.getBoundingClientRect() : null;
    return {
      lifted: fig.hasAttribute("data-lifted"),
      hasImg: Boolean(img),
      hasButton: Boolean(btn),
      pressed: btn?.getAttribute("aria-pressed") ?? null,
      label: btn?.textContent ?? null,
      src: img?.getAttribute("src") ?? null,
      natural: img?.naturalWidth ?? 0,
      shownDevicePx: r ? r.width * devicePixelRatio : 0,
      photoOpacity: img ? Number(getComputedStyle(img).opacity) : 0,
      drawingOpacity: Number(getComputedStyle(fig.querySelector(".sheet-drawing") ?? stack).opacity),
      credit: fig.querySelector(".sheet-credit")?.textContent ?? "",
      captionGap: r && cap ? Math.round(cap.getBoundingClientRect().top - r.bottom) : 0,
      transform: getComputedStyle(stack).transform,
      stackTransition: getComputedStyle(stack).transitionDuration,
      photoTransition: img ? getComputedStyle(img).transitionDuration : "",
      requested: performance.getEntriesByType("resource").some((e) => e.name.includes("/photos/")),
    };
  });

/** A synthetic touch pointer on the centre of the stack (dx, dy offset in CSS px). */
const touch = (page, type, dx = 0, dy = 0) =>
  page.evaluate(([type, dx, dy]) => {
    const el = document.querySelector("figure.sheet .sheet-stack");
    const r = el.getBoundingClientRect();
    el.dispatchEvent(new PointerEvent(type, {
      bubbles: true, cancelable: true, composed: true, pointerId: 7, pointerType: "touch", isPrimary: true,
      button: type === "pointermove" ? -1 : 0, buttons: type === "pointerdown" || type === "pointermove" ? 1 : 0,
      clientX: r.left + r.width / 2 + dx, clientY: r.top + r.height / 2 + dy,
    }));
  }, [type, dx, dy]);

const waitForPhoto = (page) =>
  page.waitForFunction(() => { const i = document.querySelector("img.sheet-photo"); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 8000 }).then(() => true, () => false);

for (const id of ["entry", "main-floor"]) {
  for (const [width, height] of [[390, 844], [1440, 900]]) {
    const tag = `${id} ${width}`;
    const { page, ctx, errors } = await open(browser, `/lab/sheet/${id}`, { width, height, at: "14:00" });
    const found = await page.locator("figure.sheet").count();
    assert(found === 1, `${tag}: the sheet renders (${found})`);
    if (!found) { await ctx.close(); continue; }

    let s = await state(page);
    assert(!s.lifted && s.pressed === "false" && s.label === "Show the photograph", `${tag}: at rest the toggle offers the photograph`);
    assert(s.src === null && !s.requested, `${tag}: the photograph is not fetched before the first lift`);
    assert(s.credit === "", `${tag}: no credit while the photograph is hidden`);

    await page.click("button.sheet-toggle");
    assert(await waitForPhoto(page), `${tag}: the photograph loads on the first lift`);
    await page.waitForTimeout(700);
    s = await state(page);
    assert(s.lifted && s.pressed === "true" && s.label === "Show the drawing", `${tag}: the toggle is pressed and offers the drawing back`);
    assert(s.src === `/photos/${id}.jpg`, `${tag}: src is set on the first lift (${s.src})`);
    assert(Math.abs(s.photoOpacity - 1) < 0.01, `${tag}: photograph fully shown (${s.photoOpacity})`);
    assert(Math.abs(s.drawingOpacity - 0.12) < 0.01, `${tag}: drawing ghosted to 0.12 (${s.drawingOpacity})`);
    assert(s.shownDevicePx <= 1.25 * s.natural + 1, `${tag}: honest size, ${Math.round(s.shownDevicePx)} device px for ${s.natural} source px`);
    assert(/@/.test(s.credit), `${tag}: the credit shows (${s.credit})`);
    assert(Math.abs(s.captionGap) <= 24, `${tag}: the caption follows the photograph's bottom edge (gap ${s.captionGap} px)`);
    await shot(page, `lift-${id}-${width}-day`);

    await page.click("button.sheet-toggle");
    await page.waitForTimeout(700);
    s = await state(page);
    assert(!s.lifted && s.drawingOpacity === 1 && s.photoOpacity === 0 && s.credit === "", `${tag}: toggling again lays the paper back down`);
    assert(s.src === `/photos/${id}.jpg`, `${tag}: the photograph stays loaded for the next lift`);

    if (width === 390) {
      const box = await page.locator("figure.sheet .sheet-stack").boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(200);
      assert(!(await state(page)).lifted, `${tag}: a short press does not lift`);
      await page.waitForTimeout(300);
      assert((await state(page)).lifted, `${tag}: holding for 350 ms lifts the paper`);
      await page.mouse.up();
      await page.waitForTimeout(50);
      assert(!(await state(page)).lifted, `${tag}: letting go lays it back down`);

      await touch(page, "pointerdown");
      await touch(page, "pointermove", 0, 12);
      await page.waitForTimeout(450);
      assert(!(await state(page)).lifted, `${tag}: moving more than 8 px cancels the hold, so scrolling is never hijacked`);
      await touch(page, "pointercancel", 0, 12);

      await touch(page, "pointerdown");
      await page.waitForTimeout(450);
      assert((await state(page)).lifted, `${tag}: a touch hold lifts too`);
      await touch(page, "pointercancel");
      await page.waitForTimeout(50);
      assert(!(await state(page)).lifted, `${tag}: a cancelled touch lays it back down`);
    }
    assert(errors.length === 0, `${tag}: no console errors (${errors.join(" | ")})`);
    await ctx.close();
  }
}

{
  const { page, ctx, errors } = await open(browser, "/lab/sheet/entry", { at: "01:00", reducedMotion: true });
  await page.click("button.sheet-toggle");
  const s0 = await state(page);
  assert(s0.stackTransition === "0s", `reduced motion: the scale does not animate (${s0.stackTransition})`);
  assert(s0.photoTransition === "0.15s", `reduced motion: a 150 ms crossfade (${s0.photoTransition})`);
  await waitForPhoto(page);
  await page.waitForTimeout(250);
  const s = await state(page);
  assert(s.lifted && s.photoOpacity === 1, "reduced motion: the photograph is shown");
  assert(s.transform !== "none" && s.shownDevicePx <= 1.25 * s.natural + 1, `reduced motion: the honest scale still applies (${s.transform})`);
  await shot(page, "lift-entry-390-night-reduced");
  assert(errors.length === 0, `reduced motion: no console errors (${errors.join(" | ")})`);
  await ctx.close();
}

{
  const { page, ctx } = await open(browser, "/lab/sheet/alley-sign", { at: "01:00" });
  const s = await state(page);
  assert(!s.hasButton && !s.hasImg, "alley-sign (lift: false): no toggle and no photograph");
  await ctx.close();
}

await browser.close();
report();
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- photos`
Expected: FAIL with `Error: Failed to resolve import "@/lib/photos" from "tests/photos.test.ts". Does the file exist?`

Run `npm run dev` in a second terminal (port 3021), then: `node scripts/e2e/lift.mjs`
Expected: four lines `FAIL entry 390: the sheet renders (0)` … `FAIL main-floor 1440: the sheet renders (0)`, then `FAIL alley-sign …` (the evaluate finds no figure and throws: `TypeError: Cannot read properties of null`). Either way the script exits non-zero.

- [ ] **Step 3: Implement**

`scripts/build-photos.mjs`:

```js
// Photographs under the tracing paper: one JPEG per drawing that lifts, cropped to the drawing's frame
// from the source at its own resolution (never enlarged, width capped at 1600), plus content/photos.json.
// Run: node scripts/build-photos.mjs      (PHOTOS_SRC overrides D:/barnyard-source/ig)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = process.env.PHOTOS_SRC || "D:/barnyard-source/ig";
const OUT = path.join("public", "photos");
const FRAME_WIDTH = 1080; // every crop in content/drawings.json is measured in a 1080-wide frame of the whole source
const MAX_WIDTH = 1600;

const manifest = JSON.parse(fs.readFileSync("content/drawings.json", "utf8")).drawings;
const lifts = manifest.filter((d) => d.lift);
fs.mkdirSync(OUT, { recursive: true });

const photos = {};
let failed = false;

for (const d of lifts) {
  if (!d.source || !d.crop) { console.error(`${d.id}: a drawing that lifts needs a source and a crop`); failed = true; continue; }
  const file = path.join(SRC, d.source);
  if (!fs.existsSync(file)) { console.error(`${d.id}: missing ${file}`); failed = true; continue; }

  const { width: sw, height: sh } = await sharp(file).metadata();
  // The frame is 1080 wide; a 720 px reel still has 1.5 frame units per source pixel. Map the crop back to source pixels.
  const unitsPerPx = FRAME_WIDTH / sw;
  const [x0, y0, x1, y1] = d.crop;
  const left = Math.max(0, Math.round(x0 / unitsPerPx));
  const top = Math.max(0, Math.round(y0 / unitsPerPx));
  const width = Math.min(Math.round((x1 - x0) / unitsPerPx), sw - left);
  const height = Math.min(Math.round((y1 - y0) / unitsPerPx), sh - top);

  let img = sharp(file).extract({ left, top, width, height });
  if (width > MAX_WIDTH) img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const info = await img.jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(path.join(OUT, `${d.id}.jpg`));

  photos[d.id] = { src: `/photos/${d.id}.jpg`, width: info.width, height: info.height };
  console.log(`${d.id}.jpg  ${info.width}x${info.height}  from ${sw}x${sh} at [${left},${top},${width},${height}]  ${Math.round(info.size / 1024)} KB`);
}

if (failed) process.exit(1);

for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith(".jpg") && !photos[f.slice(0, -4)]) {
    fs.unlinkSync(path.join(OUT, f));
    console.log(`removed stale ${f}`);
  }
}

const sorted = Object.fromEntries(Object.keys(photos).sort().map((k) => [k, photos[k]]));
fs.writeFileSync("content/photos.json", `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`content/photos.json: ${Object.keys(sorted).length} photographs`);
```

Run: `node scripts/build-photos.mjs`
Expected (sizes measured with sharp 0.35.4 on these sources; KB may differ by one or two):

```
facade.jpg  1080x1000  from 1080x1920 at [0,0,1080,1000]  111 KB
entry.jpg  720x1200  from 720x1280 at [0,0,720,1200]  125 KB
main-floor.jpg  830x625  from 1080x1350 at [250,0,830,625]  120 KB
wall-lamp.jpg  720x953  from 720x1280 at [0,100,720,953]  121 KB
mezzanine-stair.jpg  656x982  from 1080x1350 at [70,50,656,982]  116 KB
mezzanine-night.jpg  1080x1340  from 1080x1650 at [0,60,1080,1340]  112 KB
courtyard.jpg  720x1120  from 720x1280 at [0,160,720,1120]  134 KB
hoodie.jpg  1080x1428  from 1080x1500 at [0,72,1080,1428]  93 KB
nocatch.jpg  1080x1500  from 1080x1920 at [0,0,1080,1500]  169 KB
pizza.jpg  1080x1270  from 1080x1690 at [0,420,1080,1270]  99 KB
dough.jpg  1080x1630  from 1080x1690 at [0,60,1080,1630]  68 KB
content/photos.json: 11 photographs
```

The three 720 px reel stills (`entry`, `wall-lamp`, `courtyard`) come out 720 wide, not 1080: that is the honest size. Nothing is enlarged. `alley-sign` is absent because its reel caption crosses the pin (`lift: false`).

`lib/photos.ts`:

```ts
import data from "@/content/photos.json";

export interface Photo { src: string; width: number; height: number }

const PHOTOS = data as Record<string, Photo>;

/** The photograph a drawing was made from, cropped to its frame, or null when the drawing does not lift. */
export function photoFor(id: string): Photo | null {
  return Object.prototype.hasOwnProperty.call(PHOTOS, id) ? PHOTOS[id] : null;
}

/**
 * The largest scale (at most 1) at which a photograph `sourceWidth` pixels wide, laid across `cssWidth` CSS px
 * on a screen with `dpr` device pixels per CSS px, uses no more than 1.25 device pixels per source pixel.
 * Before layout (cssWidth 0) it returns 1; a missing ratio counts as 1.
 */
export function honestScale(sourceWidth: number, cssWidth: number, dpr: number): number {
  if (!(cssWidth > 0)) return 1;
  const ratio = dpr > 0 ? dpr : 1;
  return Math.min(1, Math.max(0, (1.25 * sourceWidth) / (cssWidth * ratio)));
}
```

`components/draw/Sheet.tsx`:

```tsx
import type { CSSProperties, ReactNode } from "react";
import { drawingFor } from "@/drawings";
import { metaFor } from "@/lib/drawings";
import { photoFor } from "@/lib/photos";
import { Drawing, type DrawMode } from "./Drawing";
import { SheetLift } from "./SheetLift";
import "./sheet.css";

export interface SheetProps {
  id: string;
  mode?: DrawMode;
  title?: string;
  caption?: string;
  className?: string;
  /** Overlays laid over the drawing in the same box (annotations). They fade with the drawing when the paper lifts. */
  children?: ReactNode;
}

/**
 * A drawing on its sheet of tracing paper. Where the drawing may lift and its photograph exists, the photograph
 * waits underneath: press and hold, or use the toggle, to see it at honest size with its credit.
 * Server component: the drawing's data is built here and never ships as a module to the browser.
 */
export function Sheet({ id, mode = "static", title, caption, className, children }: SheetProps) {
  const drawing = drawingFor(id);
  const meta = metaFor(id);
  const photo = meta.lift ? photoFor(id) : null;
  const ratio = drawing.height / drawing.width;
  const cls = `sheet${className ? ` ${className}` : ""}`;
  const art = <Drawing drawing={drawing} mode={mode} title={title} />;

  if (!photo) {
    return (
      <figure className={cls} data-sheet={id} style={{ "--sheet-ratio": ratio } as CSSProperties}>
        <div className="sheet-stack">
          <div className="sheet-drawing">{art}{children}</div>
        </div>
        {caption ? (
          <figcaption className="sheet-caption">
            <span className="t-label sheet-text">{caption}</span>
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <SheetLift id={id} className={cls} ratio={ratio} photo={photo} alt={title ?? drawing.title} credit={meta.credit} caption={caption}>
      {art}
      {children}
    </SheetLift>
  );
}
```

`components/draw/SheetLift.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { honestScale, type Photo } from "@/lib/photos";

/** A press must last this long before the paper lifts, and may wander this far first (beyond it, the finger is scrolling). */
const HOLD_MS = 350;
const SLOP_PX = 8;

interface Props {
  id: string;
  className: string;
  ratio: number;
  photo: Photo;
  alt: string;
  credit: string | null;
  caption?: string;
  children: ReactNode;
}

export function SheetLift({ id, className, ratio, photo, alt, credit, caption, children }: Props) {
  const stack = useRef<HTMLDivElement>(null);
  const hold = useRef<{ timer: number; x: number; y: number; pointerId: number } | null>(null);
  const [pinned, setPinned] = useState(false); // the toggle
  const [held, setHeld] = useState(false); // press and hold
  const [requested, setRequested] = useState(false); // src is set on the first lift and kept
  const [scale, setScale] = useState(1);
  const lifted = pinned || held;

  const measure = useCallback(() => {
    const el = stack.current;
    // offsetWidth is the layout width, untouched by the lift transform
    if (el) setScale(honestScale(photo.width, el.offsetWidth, window.devicePixelRatio || 1));
  }, [photo.width]);

  const prepare = useCallback(() => {
    measure();
    setRequested(true);
  }, [measure]);

  const cancelHold = useCallback(() => {
    if (hold.current) window.clearTimeout(hold.current.timer);
    hold.current = null;
  }, []);

  useEffect(() => cancelHold, [cancelHold]);

  // While lifted, keep the scale honest through resizes and pixel-ratio changes (zoom, moving between screens).
  useEffect(() => {
    if (!lifted) return;
    const el = stack.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const dpr = matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    dpr.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      dpr.removeEventListener("change", measure);
    };
  }, [lifted, measure]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pinned || e.button !== 0 || !e.isPrimary) return;
    cancelHold();
    const timer = window.setTimeout(() => {
      prepare();
      setHeld(true);
    }, HOLD_MS);
    hold.current = { timer, x: e.clientX, y: e.clientY, pointerId: e.pointerId };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const h = hold.current;
    if (h && e.pointerId === h.pointerId && Math.hypot(e.clientX - h.x, e.clientY - h.y) > SLOP_PX) {
      cancelHold();
      setHeld(false);
    }
  };

  const release = () => {
    cancelHold();
    setHeld(false);
  };

  const toggle = () => {
    if (!pinned) prepare();
    setPinned((v) => !v);
  };

  return (
    <figure
      className={className}
      data-sheet={id}
      data-lifted={lifted ? "" : undefined}
      style={{ "--sheet-ratio": ratio, "--lift-scale": scale } as CSSProperties}
    >
      <div
        ref={stack}
        className="sheet-stack"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        onContextMenu={(e) => {
          if (hold.current) e.preventDefault();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- shown at its own pixels (never re-encoded or resized by the image optimiser) and fetched only on the first lift */}
        <img
          className="sheet-photo"
          src={requested ? photo.src : undefined}
          width={photo.width}
          height={photo.height}
          alt={lifted ? alt : ""}
          aria-hidden={lifted ? undefined : true}
          decoding="async"
          draggable={false}
        />
        <div className="sheet-drawing">{children}</div>
      </div>
      <button type="button" className="sheet-toggle t-label" aria-pressed={pinned} onClick={toggle}>
        {pinned ? "Show the drawing" : "Show the photograph"}
      </button>
      <figcaption className="sheet-caption">
        {caption ? <span className="t-label sheet-text">{caption}</span> : null}
        <span className="t-label sheet-credit" aria-live="polite">{lifted && credit ? credit : ""}</span>
      </figcaption>
    </figure>
  );
}
```

The `figcaption` is the figure's last child (valid HTML) and the grid areas in the CSS place the toggle beside it. In the tab order, the toggle comes straight after the drawing.

`components/draw/sheet.css`:

```css
/* The tracing paper: a drawing laid over the photograph it was made from. */
.sheet {
  margin: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas: "stack stack" "cap toggle";
  column-gap: 16px;
  align-items: start;
  container-type: inline-size;
}

.sheet-stack {
  grid-area: stack;
  position: relative;
  aspect-ratio: 1 / var(--sheet-ratio, 1);
  transform-origin: 50% 0;
  transition: transform 600ms var(--ease-pen);
  touch-action: manipulation;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

.sheet-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  pointer-events: none;
  transition: opacity 600ms var(--ease-pen);
}

.sheet-drawing {
  position: relative;
  height: 100%;
  transition: opacity 600ms var(--ease-pen);
}

/* Lifted: the photograph shows, the drawing stays as a faint trace, and the whole sheet takes its honest size from the top centre. */
.sheet[data-lifted] .sheet-stack { transform: scale(var(--lift-scale, 1)); }
.sheet[data-lifted] .sheet-photo { opacity: 1; }
.sheet[data-lifted] .sheet-drawing { opacity: 0.12; }

/* The caption row rides up with the photograph's bottom edge; a transform, so the page below never reflows. */
.sheet-caption,
.sheet-toggle {
  margin-top: 10px;
  transition: transform 600ms var(--ease-pen), text-decoration-color 300ms var(--ease-pen);
}
.sheet[data-lifted] .sheet-caption,
.sheet[data-lifted] .sheet-toggle {
  transform: translateY(calc((var(--lift-scale, 1) - 1) * 100cqw * var(--sheet-ratio, 1)));
}

.sheet-caption { grid-area: cap; display: grid; align-content: start; gap: 2px; min-height: 44px; }
.sheet-text { color: var(--ink); }
.sheet-credit { min-height: 1.3em; }

.sheet-toggle {
  grid-area: toggle;
  min-height: 44px;
  padding: 0 2px;
  background: none;
  border: 0;
  color: var(--ink);
  text-align: right;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 6px;
  text-decoration-color: var(--hair);
}
.sheet-toggle:hover,
.sheet-toggle[aria-pressed="true"] { text-decoration-color: var(--pen); }

/* Reduced motion: a 150 ms crossfade; the honest scale is applied at once, never animated. */
@media (prefers-reduced-motion: reduce) {
  .sheet-stack,
  .sheet-caption,
  .sheet-toggle { transition: none !important; }
  .sheet-photo,
  .sheet-drawing { transition: opacity 150ms linear !important; }
}
```

`app/lab/sheet/[id]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { DrawMode } from "@/components/draw/Drawing";
import { Sheet } from "@/components/draw/Sheet";
import { DRAWINGS } from "@/drawings";

export default async function LabSheet({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ mode?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { id } = await params;
  const { mode } = await searchParams;
  if (!DRAWINGS[id]) notFound();
  const m: DrawMode = mode === "draw" || mode === "scrub" ? mode : "static";
  return (
    <div className="wrap" style={{ paddingBlock: "8svh", maxWidth: 820, marginInline: "auto" }}>
      <Sheet id={id} mode={m} caption={`Sheet: ${id}`} />
    </div>
  );
}
```

- [ ] **Step 4: Run to verify they pass**

Run: `npm test -- photos`
Expected: `✓ tests/photos.test.ts (17 tests)` and `Test Files  1 passed (1)`.

Run: `npm run lint`
Expected: no errors and no warnings from `components/draw/*`, `lib/photos.ts`, `scripts/build-photos.mjs` or `app/lab/sheet`.

With the dev server on 3021: `node scripts/e2e/lift.mjs`
Expected: every line `ok`, including `entry 390: honest size, 900 device px for 720 source px` (347 CSS px column × 3 × 0.8646), `entry 1440: honest size, 900 device px for 720 source px` (662 px column × 2 × 0.680), `main-floor 390: honest size, 1038 device px for 830 source px` (scale 0.9964; 1.25 × 830 = 1037.5, so the rounded figure may read 1037 or 1038) and `alley-sign (lift: false): no toggle and no photograph`. The script ends `all checks passed`.

If an honest-size line fails, fix `measure()` or the CSS (the stack must span the figure's full width), never the 1.25 factor.

- [ ] **Step 5: Look**

With Playwright MCP (dev server on 3021):
1. `browser_resize` 390x844, open `http://localhost:3021/lab/sheet/entry?at=14:00`, take a screenshot. It must show: the drawing complete on the grey drafting-film ground; under it "Sheet: entry" on the left and "Show the photograph" on the right with a hairline underline; no broken-image icon; no credit.
2. Click "Show the photograph", wait 1 s, take a screenshot. Check:
   - The photograph fills the drawing's box exactly.
   - The stair stringer, the barrel hoops and the curtain edges sit under their faint drawn lines. A gap of more than about 5 CSS px means the drawing's measured points are off: fix `drawings/entry.ts`, never the photo crop.
   - The box is about 86% wide, centred, with its top edge where it was.
   - The caption and "Still from a reel by @suryaabrew, via @thebarnyard.co" sit directly under the photo's bottom edge.
   - The toggle reads "Show the drawing", underlined in corten.
   - The photo is sharp, not soft.
3. Repeat 1 and 2 at `?at=01:00`: steel ground, ink turned light, the photograph itself unchanged, the drawing's 12% trace still visible over the dark parts of the photo.
4. `browser_resize` 1440x900 and repeat 1 and 2 at `?at=14:00` and `?at=01:00`. The sheet shrinks to about 68% on lifting and stays centred under the page's column; the caption row moves up with it; nothing below the figure jumps.
5. `/lab/sheet/main-floor` at 390 and 1440: at 390 the lift barely shrinks (99.7%); at 1440 it shrinks to about 78%. The windows, stair and railing line up.
6. `/lab/sheet/alley-sign` at 390: no toggle, no photograph, no gap where the button would be.
7. Press and hold with `browser_run_code_unsafe`: `await page.mouse.move(195, 400); await page.mouse.down(); await page.waitForTimeout(900); await page.screenshot({ path: "shots/lift-hold.png" }); await page.mouse.up();`. Read the screenshot: lifted exactly as in step 2, with the toggle still reading "Show the photograph" (a hold is not a toggle).
8. Read `shots/lift-entry-390-night-reduced.png` from the e2e run: lifted, at its honest scale, no half-faded frame.

- [ ] **Step 6: Commit**

```bash
git add scripts/build-photos.mjs lib/photos.ts content/photos.json public/photos components/draw/Sheet.tsx components/draw/SheetLift.tsx components/draw/sheet.css app/lab/sheet tests/photos.test.ts scripts/e2e/lift.mjs
git commit -m "feat: photographs under the tracing paper at honest size, with press-and-hold and a toggle"
```

---

### Task 15: Life: steam, leaves, bulbs, lamps and the cue ball

**Files:**
- Create: `components/draw/life.ts`
- Create: `app/lab/life/page.tsx` (development only: a fixture sheet carrying every kind of life, so the loops can be checked even though no café drawing has steam; see Task 13)
- Modify: `components/draw/Drawing.tsx` (after `data-drawn`, or once idle in `static` mode when motion is allowed, start life; listen for `drawing:roll`; full file below)
- Modify: `app/globals.css` (replace the Task 5 lamp and glow lines with the lamp, chase and roll-track block below)
- Test: `tests/life.test.ts`, `scripts/e2e/life.mjs`

**Interfaces:**
- Consumes:
  - `Drawing`, `Stroke`, `P` (Task 2); `line`, `rect`, `repeat` (Task 2); `leaf`, `steam`, `cup`, `bulb`, `ball` (Task 2); `mulberry32` (Task 1).
  - `DRAWINGS`, `drawingFor` (Task 3); `GsapKit`, `loadGsap`, `motionAllowed` (Task 6).
  - The life ids the drawing tasks emit (Tasks 7 to 13): `steam-<g>-<k>` with `morphs[id] = [variant1, variant2]`; `leaf-<n>` with `morphs[id] = [alternate]`; lamp-layer `bulb-<n>`; `glows`; `cue-ball` with `roll.path`.
  - `/lab/[id]` (Task 6); `open`, `assert`, `report`, `shot` (Task 5).
- Produces (`components/draw/life.ts`):
  - `startLife(svg: SVGSVGElement, drawing: Drawing, kit: GsapKit): () => void`. Steam lines morph variant 0→1→2→0, one step every `STEAM_STEP` (2.4 s), with lines staggered by group and line. All `leaf-*` swap to their alternate and back at `LEAF_FPS` (6 fps) for 1 s; the gaps between sways are 5 to 9 s from `leafSchedule(seed of drawing.id, 12)`. `bulb-*` chase in groups of `CHASE_SIZE` (3), one step every `CHASE_STEP` (0.16 s), only while `html[data-regime="night"]`. Life pauses while the svg is off-screen (IntersectionObserver, 64 px margin) or the tab is hidden. It returns a cleanup that restores every original `d`. It is a no-op under reduced motion.
  - `rollBall(svg: SVGSVGElement, drawing: Drawing, kit: GsapKit): Promise<void>`. MotionPath along `drawing.roll.path` in 1.4 s with an authored roll-out ease. The ball's centre is aligned to the track, so it stays on the felt. Rolls alternate there and back, and a roll already in flight returns the same promise.
  - Helpers: `chaseGroups(ids: string[], size: number): string[][]` (ordered by trailing number, consecutive groups of `size`), `leafSchedule(seed: number, count: number): number[]` (seconds, each in [5, 9]), `hasLife(drawing: Drawing): boolean`, `settleBall(svg: SVGSVGElement, drawing: Drawing): void` (the reduced-motion roll: the ball is simply at the other end).
  - Constants `STEAM_STEP`, `LEAF_FPS`, `LEAF_SWAY`, `CHASE_STEP`, `CHASE_SIZE`.
  - DOM hooks: `svg[data-life="on"|"paused"]`, `svg[data-chase]`, `path[data-lit="on"|"trail"]`, the ball's `data-at="start"|"end"`, a hidden `path.roll-track`; the event `CustomEvent("drawing:roll")` dispatched on the drawing's svg (Task 18's "Roll the cue ball" button).
  - `components/draw/Drawing.tsx` keeps exactly `Drawing` and `DrawMode` and all Task 6 behaviour.

Why (spec 7, 2.6): loops are restrained and live only in the logo's glyphs. Architecture never moves, and the test below fails if a structure stroke carries a life id. GSAP loads only when a drawing actually has life, after first paint. The steam is a true morph between constructed variants. Leaves are a 6 fps swap of two baked shapes, like a flip book. Bulbs light at night only. Nothing runs off-screen, in a hidden tab, or under reduced motion.

- [ ] **Step 1: Write the failing tests**

`tests/life.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { chaseGroups, hasLife, leafSchedule } from "@/components/draw/life";
import { DRAWINGS, drawingFor } from "@/drawings";
import { bulb, leaf, steam } from "@/lib/draw/glyphs";
import { line } from "@/lib/draw/primitives";

describe("chaseGroups", () => {
  it("orders bulbs by their number, not as text, and groups them in threes", () => {
    expect(chaseGroups(["bulb-10", "bulb-2", "bulb-0", "bulb-1", "bulb-3"], 3)).toEqual([
      ["bulb-0", "bulb-1", "bulb-2"],
      ["bulb-3", "bulb-10"],
    ]);
  });
  it("keeps every bulb exactly once", () => {
    const ids = Array.from({ length: 40 }, (_, i) => `bulb-${39 - i}`);
    const groups = chaseGroups([...ids, "bulb-5"], 3);
    expect(groups.flat()).toHaveLength(40);
    expect(new Set(groups.flat()).size).toBe(40);
    expect(groups).toHaveLength(14);
    expect(groups.slice(0, -1).every((g) => g.length === 3)).toBe(true);
  });
  it("handles no bulbs and rejects a size below one", () => {
    expect(chaseGroups([], 3)).toEqual([]);
    expect(() => chaseGroups(["bulb-0"], 0)).toThrow(RangeError);
  });
});

describe("leafSchedule", () => {
  it("waits between 5 and 9 s before each sway", () => {
    const s = leafSchedule(42, 200);
    expect(s).toHaveLength(200);
    for (const v of s) {
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(9);
    }
    expect(Math.max(...s) - Math.min(...s)).toBeGreaterThan(2);
  });
  it("is the same for a seed and differs between seeds", () => {
    expect(leafSchedule(7, 12)).toEqual(leafSchedule(7, 12));
    expect(leafSchedule(7, 12)).not.toEqual(leafSchedule(8, 12));
  });
  it("returns nothing for a count of zero", () => {
    expect(leafSchedule(1, 0)).toEqual([]);
  });
});

describe("hasLife", () => {
  const base = { id: "t", title: "Test drawing", width: 100, height: 100 };
  it("is false for architecture alone", () => {
    expect(hasLife({ ...base, strokes: [line([0, 0], [10, 10])] })).toBe(false);
  });
  it("is true for steam, a swaying leaf or a bulb", () => {
    const s = steam([50, 90], 40, 0);
    expect(hasLife({ ...base, strokes: [{ ...s[0], id: "steam-0-0" }], morphs: { "steam-0-0": [steam([50, 90], 40, 1)[0].d, steam([50, 90], 40, 2)[0].d] } })).toBe(true);
    expect(hasLife({ ...base, strokes: [{ ...leaf([10, 10], 20, -90), id: "leaf-0" }], morphs: { "leaf-0": [leaf([10, 10], 20, -83).d] } })).toBe(true);
    expect(hasLife({ ...base, strokes: [{ ...bulb([10, 10]), id: "bulb-0" }] })).toBe(true);
  });
  it("ignores a cue ball, which moves only when asked", () => {
    expect(hasLife({ ...base, strokes: [{ ...line([0, 0], [1, 1], "life"), id: "cue-ball" }], roll: { ball: "cue-ball", path: "M0 0L50 0" } })).toBe(false);
  });
});

const commands = (d: string) => (d.match(/[MLHVCSQTAZ]/gi) ?? []).join("");

describe("life in every registered drawing is well formed", () => {
  for (const id of Object.keys(DRAWINGS)) {
    it(id, () => {
      const d = drawingFor(id);
      const byId = new Map(d.strokes.filter((s) => s.id).map((s) => [s.id!, s]));
      for (const [key, alts] of Object.entries(d.morphs ?? {})) {
        const stroke = byId.get(key);
        expect(stroke, `${id}: morph ${key} has a stroke`).toBeTruthy();
        if (/^steam-\d+-\d+$/.test(key)) expect(alts, `${id}: ${key} has variants 1 and 2`).toHaveLength(2);
        else if (/^leaf-\d+$/.test(key)) expect(alts, `${id}: ${key} has one alternate`).toHaveLength(1);
        for (const a of alts) {
          expect(a).not.toMatch(/NaN|undefined|Infinity/);
          expect(commands(a), `${id}: ${key} morphs between shapes of the same construction`).toBe(commands(stroke!.d));
        }
      }
      expect([...byId.keys()].filter((k) => /^leaf-\d+$/.test(k)).length, `${id}: at most 12 swaying leaves`).toBeLessThanOrEqual(12);
      for (const s of d.strokes) {
        if (s.id && /^bulb-\d+$/.test(s.id)) expect(s.layer, `${id}: ${s.id} is in the lamp layer`).toBe("lamp");
        if (s.layer === "structure") expect(s.id ?? "", `${id}: architecture never animates`).not.toMatch(/^(steam|leaf|bulb)-|^cue-ball$/);
      }
      if (d.roll) {
        expect(byId.has(d.roll.ball), `${id}: the roll's ball exists`).toBe(true);
        expect(d.roll.path).toMatch(/^M/);
      }
    });
  }
});
```

`scripts/e2e/life.mjs`:

```js
// Life checks, against the dev server (the /lab routes exist only in development).
// Run `npm run dev` (port 3021) in a second terminal, then: node scripts/e2e/life.mjs
process.env.BASE ||= "http://localhost:3021";
const { assert, launch, open, report, shot } = await import("./lib.mjs");

const browser = await launch();
const ds = (page, sel) => page.$$eval(sel, (els) => els.map((e) => e.getAttribute("d")));
const waitFor = (page, sel, timeout) => page.waitForSelector(sel, { timeout, state: "attached" }).then(() => true, () => false);

/** Rolls the cue ball once and samples its centre every frame until it rests. */
const roll = (page) =>
  page.evaluate(() => new Promise((resolve) => {
    const svg = document.querySelector("svg.drawing");
    const ball = svg?.querySelector('path[id="cue-ball"]');
    if (!ball) return resolve(null);
    const target = ball.getAttribute("data-at") === "end" ? "start" : "end";
    const centre = () => {
      const b = ball.getBBox();
      const m = ball.transform.baseVal.consolidate()?.matrix;
      return [b.x + b.width / 2 + (m ? m.e : 0), b.y + b.height / 2 + (m ? m.f : 0)];
    };
    const from = centre();
    const samples = [];
    const t0 = performance.now();
    let moved = null;
    const loop = () => {
      const c = centre();
      samples.push(c);
      if (moved === null && Math.hypot(c[0] - from[0], c[1] - from[1]) > 0.5) moved = performance.now();
      if (ball.getAttribute("data-at") === target) {
        const track = svg.querySelector("path.roll-track");
        const tb = track.getBBox();
        const L = track.getTotalLength();
        const s = track.getPointAtLength(0);
        const e = track.getPointAtLength(L);
        return resolve({ from, to: centre(), samples, box: [tb.x, tb.y, tb.x + tb.width, tb.y + tb.height], start: [s.x, s.y], end: [e.x, e.y], seconds: (performance.now() - (moved ?? performance.now())) / 1000 });
      }
      if (performance.now() - t0 > 15000) return resolve(null);
      requestAnimationFrame(loop);
    };
    svg.dispatchEvent(new CustomEvent("drawing:roll"));
    requestAnimationFrame(loop);
  }));
const near = (a, b, tol) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= tol;

// 1. Steam, leaves and pausing, on the development fixture at noon.
{
  const { page, ctx, errors } = await open(browser, "/lab/life", { at: "12:00" });
  const steamCount = await page.locator('svg.drawing path[id^="steam-"]').count();
  assert(steamCount === 3, `the fixture has three steam lines (${steamCount})`);
  assert(await waitFor(page, 'svg.drawing[data-life="on"]', 15000), "life starts once the page is idle");
  const before = await ds(page, 'path[id^="steam-"]');
  await page.waitForTimeout(3000);
  const after = await ds(page, 'path[id^="steam-"]');
  assert(before.length > 0 && before.some((d, i) => d !== after[i]), "steam d changes over 3 s at noon");
  assert((await page.locator("path[data-lit]").count()) === 0, "no bulb chases by day");
  const leavesBefore = await ds(page, 'path[id^="leaf-"]');
  const swayed = await page
    .waitForFunction((b) => [...document.querySelectorAll('path[id^="leaf-"]')].some((e, i) => e.getAttribute("d") !== b[i]), leavesBefore, { timeout: 10000, polling: 50 })
    .then(() => true, () => false);
  assert(swayed, "leaves swap to their alternate within 10 s");
  await shot(page, "life-fixture-390-day");

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  assert(await waitFor(page, 'svg.drawing[data-life="paused"]', 3000), "life pauses when the drawing leaves the viewport");
  const offA = await ds(page, 'path[id^="steam-"]');
  await page.waitForTimeout(1500);
  const offB = await ds(page, 'path[id^="steam-"]');
  assert(offA.every((d, i) => d === offB[i]), "steam holds still while off-screen");
  await page.evaluate(() => window.scrollTo(0, 0));
  assert(await waitFor(page, 'svg.drawing[data-life="on"]', 3000), "life resumes when the drawing returns");

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  assert((await page.locator('svg.drawing[data-life="paused"]').count()) === 1, "life pauses when the tab is hidden");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  assert((await page.locator('svg.drawing[data-life="on"]').count()) === 1, "life resumes when the tab returns");
  assert(errors.length === 0, `fixture: no console errors (${errors.join(" | ")})`);
  await ctx.close();
}

// 2. The BOWL bulbs chase after dark, and only after dark.
for (const [width, height] of [[390, 844], [1440, 900]]) {
  const { page, ctx, errors } = await open(browser, "/lab/alley-sign", { width, height, at: "01:00" });
  const bulbs = await page.locator('svg.drawing path[id^="bulb-"]').count();
  assert(bulbs >= 4, `alley-sign ${width}: the marquee has bulbs to chase (${bulbs})`);
  assert(await waitFor(page, "svg.drawing[data-chase]", 15000), `alley-sign ${width}: the chase starts at 01:00`);
  const svg = page.locator("svg.drawing").first();
  const a = await svg.screenshot();
  await page.waitForTimeout(250);
  const b = await svg.screenshot();
  assert(!a.equals(b), `alley-sign ${width}: bulbs differ between two screenshots 250 ms apart at 01:00`);
  const lit = await page.$$eval('path[data-lit="on"]', (els) => els.length);
  assert(lit >= 1 && lit <= 3, `alley-sign ${width}: one group of up to three bulbs is lit (${lit})`);
  const stroke = await page.$eval('svg.drawing path[id^="bulb-"]', (e) => getComputedStyle(e).stroke);
  assert(stroke === "rgb(231, 166, 79)", `alley-sign ${width}: bulbs are drawn in lamp at night (${stroke})`);
  const glow = await page.$eval("svg.drawing .glow", (e) => Number(getComputedStyle(e).opacity)).catch(() => 0);
  assert(glow > 0.5, `alley-sign ${width}: glows are on at night (${glow})`);
  await shot(page, `life-alley-${width}-night`);
  assert(errors.length === 0, `alley-sign ${width} night: no console errors (${errors.join(" | ")})`);
  await ctx.close();
}
{
  const { page, ctx } = await open(browser, "/lab/alley-sign", { at: "14:00" });
  await page.waitForTimeout(2500);
  assert((await page.locator("svg.drawing[data-chase]").count()) === 0, "alley-sign day: no chase at 14:00");
  const stroke = await page.$eval('svg.drawing path[id^="bulb-"]', (e) => getComputedStyle(e).stroke);
  assert(stroke === "rgb(31, 28, 26)", `alley-sign day: bulbs are drawn in ink (${stroke})`);
  const glow = await page.$eval("svg.drawing .glow", (e) => Number(getComputedStyle(e).opacity)).catch(() => 0);
  assert(glow === 0, `alley-sign day: glows are off (${glow})`);
  await ctx.close();
}

// 3. The cue ball rolls along the felt and back.
{
  const { page, ctx, errors } = await open(browser, "/lab/games", { at: "14:00" });
  const there = await roll(page);
  assert(there, "games: the cue ball finishes its roll");
  if (there) {
    assert(near(there.from, there.start, 3), "games: the ball starts where its track starts (else fix roll.path in drawings/games.ts)");
    assert(near(there.to, there.end, 3), "games: it comes to rest at the end of its track");
    assert(there.samples.every(([x, y]) => x >= there.box[0] - 2 && x <= there.box[2] + 2 && y >= there.box[1] - 2 && y <= there.box[3] + 2), "games: it never leaves its track on the felt");
    assert(there.seconds > 1.1 && there.seconds < 1.8, `games: the roll takes about 1.4 s (${there.seconds.toFixed(2)} s)`);
  }
  const back = await roll(page);
  assert(back && near(back.to, back.start, 3), "games: a second roll brings it back");
  assert(errors.length === 0, `games: no console errors (${errors.join(" | ")})`);
  await ctx.close();
}

// 4. Reduced motion: nothing changes, GSAP never loads, and the roll is a plain change of place.
{
  const { page, ctx, errors } = await open(browser, "/lab/life", { at: "01:00", reducedMotion: true });
  await page.waitForTimeout(600);
  const snap = () => page.evaluate(() => [...document.querySelectorAll("svg.drawing path")].map((e) => `${e.id}|${e.getAttribute("d")}|${e.getAttribute("data-lit") ?? ""}|${e.getAttribute("transform") ?? ""}`).join("\n"));
  const svg = page.locator("svg.drawing").first();
  const a = await snap();
  const shotA = await svg.screenshot();
  await page.waitForTimeout(3000);
  const b = await snap();
  const shotB = await svg.screenshot();
  assert(a === b, "reduced motion: no path changes over 3 s");
  assert(shotA.equals(shotB), "reduced motion: two screenshots 3 s apart are identical");
  assert((await page.locator("svg.drawing[data-life]").count()) === 0, "reduced motion: life never starts");
  const gsap = await page.evaluate(() => performance.getEntriesByType("resource").some((r) => /gsap/i.test(r.name)));
  assert(!gsap, "reduced motion: GSAP is never loaded");
  assert(errors.length === 0, `reduced motion: no console errors (${errors.join(" | ")})`);
  await ctx.close();
}
{
  const { page, ctx } = await open(browser, "/lab/games", { at: "14:00", reducedMotion: true });
  const r = await roll(page);
  assert(r && near(r.to, r.end, 3) && r.samples.length <= 3, "reduced motion: the cue ball is simply at the far end, with no travel");
  const gsap = await page.evaluate(() => performance.getEntriesByType("resource").some((x) => /gsap/i.test(x.name)));
  assert(!gsap, "reduced motion: rolling does not load GSAP");
  await ctx.close();
}

await browser.close();
report();
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- life`
Expected: FAIL with `Error: Failed to resolve import "@/components/draw/life" from "tests/life.test.ts". Does the file exist?`

With the dev server on 3021: `node scripts/e2e/life.mjs`
Expected: `FAIL the fixture has three steam lines (0)` (`/lab/life` is a 404), `FAIL life starts once the page is idle`, `FAIL alley-sign 390: the chase starts at 01:00`, `FAIL games: the cue ball finishes its roll`, and more. It ends with `N failure(s)` and exit code 1. The reduced-motion checks already pass, since nothing moves yet.

- [ ] **Step 3: Implement**

`components/draw/life.ts`:

```ts
import type { Drawing } from "@/lib/draw/types";
import { motionAllowed, type GsapKit } from "@/lib/motion/gsap";
import { mulberry32 } from "@/lib/random";

/** Seconds from one steam variant to the next (0 → 1 → 2 → 0). */
export const STEAM_STEP = 2.4;
/** Leaves swap between their two baked shapes at this rate, for LEAF_SWAY seconds. */
export const LEAF_FPS = 6;
export const LEAF_SWAY = 1;
/** The marquee: groups of CHASE_SIZE bulbs, one step every CHASE_STEP seconds, after dark only. */
export const CHASE_STEP = 0.16;
export const CHASE_SIZE = 3;

const ROLL_SECONDS = 1.4;
/** Struck hard, then a long roll-out on the felt. */
const ROLL_CURVE = "M0,0 C0.16,0.5 0.34,0.88 1,1";

const STEAM = /^steam-(\d+)-(\d+)$/;
const LEAF = /^leaf-\d+$/;
const BULB = /^bulb-\d+$/;
const SVG_NS = "http://www.w3.org/2000/svg";

type Timeline = ReturnType<GsapKit["gsap"]["timeline"]>;

const trailing = (id: string): number => {
  const m = /(\d+)$/.exec(id);
  return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
};

/** Bulb ids in reading order (by their trailing number), in consecutive groups of `size`. */
export function chaseGroups(ids: string[], size: number): string[][] {
  if (!Number.isInteger(size) || size < 1) throw new RangeError(`chase group size must be a positive integer, got ${size}`);
  const ordered = [...new Set(ids)].sort((a, b) => trailing(a) - trailing(b) || 0);
  const groups: string[][] = [];
  for (let i = 0; i < ordered.length; i += size) groups.push(ordered.slice(i, i + size));
  return groups;
}

/** Seconds to wait before each sway, each between 5 and 9, the same for the same seed. */
export function leafSchedule(seed: number, count: number): number[] {
  const random = mulberry32(seed);
  return Array.from({ length: Math.max(0, Math.floor(count)) }, () => Math.round((5 + random() * 4) * 100) / 100);
}

/** True when the drawing carries a loop (steam, a swaying leaf or a bulb). A cue ball is not a loop. */
export function hasLife(drawing: Drawing): boolean {
  const keys = Object.keys(drawing.morphs ?? {});
  return keys.some((id) => STEAM.test(id) || LEAF.test(id)) || drawing.strokes.some((s) => Boolean(s.id && BULB.test(s.id)));
}

function seedOf(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const byId = (svg: SVGSVGElement, id: string) => svg.querySelector<SVGPathElement>(`path[id="${id}"]`);

/**
 * Starts the drawing's loops and returns a cleanup. Never runs under reduced motion.
 * Pauses while the svg is off-screen or the tab is hidden. Architecture is never touched: only ids named by the
 * life conventions (steam-g-k, leaf-n, bulb-n) are read.
 */
export function startLife(svg: SVGSVGElement, drawing: Drawing, kit: GsapKit): () => void {
  if (!motionAllowed() || !hasLife(drawing)) return () => {};
  const { gsap } = kit;
  const morphs = drawing.morphs ?? {};
  const html = document.documentElement;
  const originals = new Map<SVGPathElement, string>();
  const remember = (el: SVGPathElement): string => {
    if (!originals.has(el)) originals.set(el, el.getAttribute("d") ?? "");
    return originals.get(el)!;
  };

  // Steam: a true morph between the three constructed variants, lines staggered so the column breathes.
  const steamLoops: Timeline[] = Object.keys(morphs)
    .filter((id) => STEAM.test(id))
    .flatMap((id) => {
      const el = byId(svg, id);
      const alts = morphs[id];
      if (!el || !alts || alts.length < 2) return [];
      const base = remember(el);
      const [, g, k] = STEAM.exec(id)!;
      const tl = gsap.timeline({ repeat: -1, paused: true, delay: Number(g) * 0.8 + Number(k) * 0.35 });
      for (const shape of [alts[0], alts[1], base]) tl.to(el, { morphSVG: { shape, shapeIndex: 0 }, duration: STEAM_STEP });
      return [tl];
    });

  // Leaves: a flip-book swap between two baked shapes; odd leaves trail by one frame.
  const leaves = Object.keys(morphs)
    .filter((id) => LEAF.test(id))
    .flatMap((id, i) => {
      const el = byId(svg, id);
      const alt = morphs[id]?.[0];
      return el && alt ? [{ el, base: remember(el), alt, lag: i % 2, showing: "base" as "base" | "alt" }] : [];
    });
  const gaps = leafSchedule(seedOf(drawing.id), 12);
  let gust = 0;
  let nextGust = gaps[0] ?? Number.POSITIVE_INFINITY;
  const show = (leaf: (typeof leaves)[number], which: "base" | "alt") => {
    if (leaf.showing === which) return;
    leaf.showing = which;
    leaf.el.setAttribute("d", which === "alt" ? leaf.alt : leaf.base);
  };
  const sway = (clock: number) => {
    if (!leaves.length || clock < nextGust) return;
    const t = clock - nextGust;
    if (t >= LEAF_SWAY + 1 / LEAF_FPS) {
      for (const leaf of leaves) show(leaf, "base");
      gust += 1;
      nextGust = clock + gaps[gust % gaps.length];
      return;
    }
    for (const leaf of leaves) {
      const frame = Math.floor(t * LEAF_FPS) - leaf.lag;
      show(leaf, frame >= 0 && frame < LEAF_FPS * LEAF_SWAY && frame % 2 === 0 ? "alt" : "base");
    }
  };

  // Bulbs: after dark, a lit group of three runs through the letters in reading order with a softer group behind it.
  const bulbIds = drawing.strokes.map((s) => s.id).filter((id): id is string => Boolean(id && BULB.test(id)));
  const groups = chaseGroups(bulbIds, CHASE_SIZE)
    .map((g) => g.map((id) => byId(svg, id)).filter((el): el is SVGPathElement => Boolean(el)))
    .filter((g) => g.length);
  let lastStep = -1;
  const clearChase = () => {
    lastStep = -1;
    svg.removeAttribute("data-chase");
    for (const el of groups.flat()) el.removeAttribute("data-lit");
  };
  const chase = (clock: number) => {
    if (groups.length < 2) return;
    if (html.getAttribute("data-regime") !== "night") {
      if (lastStep !== -1) clearChase();
      return;
    }
    const step = Math.floor(clock / CHASE_STEP) % groups.length;
    if (step === lastStep) return;
    lastStep = step;
    svg.setAttribute("data-chase", "");
    const trail = (step - 1 + groups.length) % groups.length;
    groups.forEach((group, i) => {
      for (const el of group) {
        if (i === step) el.setAttribute("data-lit", "on");
        else if (i === trail) el.setAttribute("data-lit", "trail");
        else el.removeAttribute("data-lit");
      }
    });
  };

  // One clock that only advances while the drawing is visible.
  let clock = 0;
  let inView = false;
  let running = false;
  const tick = (_time: number, deltaTime: number) => {
    clock += Math.min(deltaTime, 100) / 1000;
    sway(clock);
    chase(clock);
  };
  const sync = () => {
    const next = inView && !document.hidden;
    if (next === running) return;
    running = next;
    svg.setAttribute("data-life", running ? "on" : "paused");
    if (running) {
      for (const tl of steamLoops) tl.resume();
      gsap.ticker.add(tick);
    } else {
      for (const tl of steamLoops) tl.pause();
      gsap.ticker.remove(tick);
    }
  };

  svg.setAttribute("data-life", "paused");
  const io = new IntersectionObserver((entries) => {
    inView = entries[entries.length - 1].isIntersecting;
    sync();
  }, { rootMargin: "64px" });
  io.observe(svg);
  const onVisibility = () => sync();
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    gsap.ticker.remove(tick);
    for (const tl of steamLoops) tl.kill();
    originals.forEach((d, el) => {
      el.setAttribute("d", d);
      el.removeAttribute("data-original");
    });
    clearChase();
    svg.removeAttribute("data-life");
  };
}

/** The invisible path the ball travels: geometry for MotionPath, in the drawing's own coordinates. */
function rollTrack(svg: SVGSVGElement, d: string): SVGPathElement {
  let track = svg.querySelector<SVGPathElement>("path.roll-track");
  if (!track) {
    track = document.createElementNS(SVG_NS, "path");
    track.setAttribute("class", "roll-track");
    track.setAttribute("aria-hidden", "true");
    svg.appendChild(track);
  }
  track.setAttribute("d", d);
  return track;
}

/** Reduced motion: the ball is simply at the other end of its track (no travel, no GSAP). */
export function settleBall(svg: SVGSVGElement, drawing: Drawing): void {
  const roll = drawing.roll;
  const ball = roll ? byId(svg, roll.ball) : null;
  if (!roll || !ball) return;
  const track = rollTrack(svg, roll.path);
  const toEnd = ball.getAttribute("data-at") !== "end";
  const point = track.getPointAtLength(toEnd ? track.getTotalLength() : 0);
  const box = ball.getBBox(); // untransformed: the ball as drawn
  ball.setAttribute("transform", `translate(${point.x - (box.x + box.width / 2)} ${point.y - (box.y + box.height / 2)})`);
  ball.setAttribute("data-at", toEnd ? "end" : "start");
}

const inFlight = new WeakMap<SVGSVGElement, Promise<void>>();

/** Rolls the cue ball along drawing.roll.path (there, then back on the next call). Resolves when it rests. */
export function rollBall(svg: SVGSVGElement, drawing: Drawing, kit: GsapKit): Promise<void> {
  const roll = drawing.roll;
  const ball = roll ? byId(svg, roll.ball) : null;
  if (!roll || !ball) return Promise.resolve();
  if (!motionAllowed()) {
    settleBall(svg, drawing);
    return Promise.resolve();
  }
  const current = inFlight.get(svg);
  if (current) return current;
  const track = rollTrack(svg, roll.path);
  const back = ball.getAttribute("data-at") === "end";
  const run = import("gsap/CustomEase")
    .then(({ CustomEase }) => new Promise<void>((resolve) => {
      if (!CustomEase.get("roll")) CustomEase.create("roll", ROLL_CURVE);
      kit.gsap.to(ball, {
        // align + alignOrigin put the ball's centre on the track in the svg's own coordinates, so it stays on the felt
        motionPath: { path: track, align: track, alignOrigin: [0.5, 0.5], start: back ? 1 : 0, end: back ? 0 : 1 },
        duration: ROLL_SECONDS,
        ease: "roll",
        overwrite: "auto",
        onComplete: () => {
          ball.setAttribute("data-at", back ? "start" : "end");
          resolve();
        },
      });
    }))
    .finally(() => inFlight.delete(svg));
  inFlight.set(svg, run);
  return run;
}
```

API notes, verified against `gsap` 3.15.0:
- `MorphSVGPlugin.js` treats a `shape` string holding three or more numbers as path data, not a selector. It saves the start as `data-original`, which the cleanup removes. `shapeIndex: 0` neither offsets nor reverses the open steam lines (the `"auto"` default may reverse them).
- `MotionPathPlugin.js` `_align` builds an align matrix when `align` is an element other than the target, and `sliceRawPath` reverses when `start > end`.
- `ticker.add(callback: (time, deltaTime, frame, elapsed) => void)`, `CustomEase.get(id)` and `CustomEase.create(id, data)` match `types/gsap-core.d.ts` and `types/custom-ease.d.ts`.
- `gsap/CustomEase` is already in the chunk `loadGsap()` imports, so rolling fetches nothing new.

`components/draw/Drawing.tsx` (replace the whole file):

```tsx
"use client";

import { useEffect, useId, useRef } from "react";
import { LAYER_ORDER, type Drawing as DrawingData } from "@/lib/draw/types";
import { loadGsap, motionAllowed, type GsapKit } from "@/lib/motion/gsap";
import { hasLife, rollBall, settleBall, startLife } from "./life";

export type DrawMode = "static" | "draw" | "scrub";

interface Props { drawing: DrawingData; mode?: DrawMode; title?: string; className?: string; onDrawn?: () => void }

/** Runs `fn` once the browser is idle (or after `timeout` ms), so loops never compete with first paint. Returns a cancel. */
function whenIdle(fn: () => void, timeout = 1500): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fn, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 600);
  return () => window.clearTimeout(id);
}

export function Drawing({ drawing, mode = "static", title, className, onDrawn }: Props) {
  const root = useRef<SVGSVGElement>(null);
  const done = useRef(onDrawn);
  done.current = onDrawn;
  const data = useRef(drawing);
  data.current = drawing;
  const titleId = useId();
  const canRoll = Boolean(drawing.roll);

  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const motion = motionAllowed();
    const live = motion && hasLife(data.current);
    let cancelled = false;
    let stopDraw: (() => void) | undefined;
    let stopLife: (() => void) | undefined;
    const beginLife = (kit: GsapKit) => {
      if (!cancelled && live && !stopLife) stopLife = startLife(svg, data.current, kit);
    };

    if (mode === "static") {
      // Complete at rest. Only a drawing with life loads GSAP, and only once the page is idle.
      if (!live) return;
      const cancelIdle = whenIdle(() => {
        loadGsap().then(beginLife);
      });
      return () => {
        cancelled = true;
        cancelIdle();
        stopLife?.();
      };
    }

    if (!motion) {
      svg.removeAttribute("data-pending");
      return;
    }

    loadGsap().then((kit) => {
      if (cancelled) return;
      const { gsap, ScrollTrigger } = kit;
      const layers = LAYER_ORDER.map((l) => Array.from(svg.querySelectorAll<SVGPathElement>(`.layer-${l} path.ln`))).filter((a) => a.length);
      const all = layers.flat();
      const each = Math.min(0.035, 1.6 / Math.max(1, all.length));
      gsap.set(all, { drawSVG: "0%" });
      svg.removeAttribute("data-pending");
      const finish = () => {
        svg.setAttribute("data-drawn", "");
        done.current?.();
        beginLife(kit);
      };
      const tl = gsap.timeline({
        paused: mode === "scrub",
        onComplete: mode === "draw" ? () => { gsap.set(all, { clearProps: "strokeDasharray,strokeDashoffset" }); finish(); } : undefined,
      });
      layers.forEach((paths, i) => {
        tl.to(paths, { drawSVG: "100%", duration: i === 0 ? 1.1 : 0.8, stagger: { each, from: "start" } }, i === 0 ? 0 : ">-0.45");
      });
      if (mode === "scrub") {
        let reached = false;
        const st = ScrollTrigger.create({
          trigger: svg, start: "top 85%", end: "center 55%", scrub: 0.6, animation: tl,
          onUpdate: (self) => { if (!reached && self.progress > 0.999) { reached = true; finish(); } },
        });
        stopDraw = () => { st.kill(); tl.kill(); };
      } else {
        stopDraw = () => tl.kill();
      }
    });
    return () => {
      cancelled = true;
      stopDraw?.();
      stopLife?.();
    };
  }, [mode, drawing.id]);

  // The cue ball rolls when asked: Task 18's button dispatches CustomEvent("drawing:roll") on this svg.
  useEffect(() => {
    const svg = root.current;
    if (!svg || !canRoll) return;
    const onRoll = () => {
      if (!motionAllowed()) {
        settleBall(svg, data.current);
        return;
      }
      loadGsap().then((kit) => rollBall(svg, data.current, kit));
    };
    svg.addEventListener("drawing:roll", onRoll);
    return () => svg.removeEventListener("drawing:roll", onRoll);
  }, [canRoll]);

  return (
    <svg
      ref={root}
      className={`drawing${className ? ` ${className}` : ""}`}
      viewBox={`${drawing.x ?? 0} ${drawing.y ?? 0} ${drawing.width} ${drawing.height}`}
      role="img"
      aria-labelledby={titleId}
      data-pending={mode === "static" ? undefined : ""}
    >
      <title id={titleId}>{title ?? drawing.title}</title>
      {drawing.glows?.length ? (
        <g aria-hidden="true">
          <defs>
            <radialGradient id={`${titleId}-glow`}>
              <stop offset="0" stopColor="var(--lamp)" stopOpacity="0.55" />
              <stop offset="1" stopColor="var(--lamp)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {drawing.glows.map((g, i) => <circle key={i} className="glow" cx={g.x} cy={g.y} r={g.r} fill={`url(#${titleId}-glow)`} />)}
        </g>
      ) : null}
      {LAYER_ORDER.map((layer) => {
        const strokes = drawing.strokes.filter((s) => s.layer === layer);
        return strokes.length ? (
          <g key={layer} className={`layer-${layer}`}>
            {strokes.map((s, i) => <path key={i} className="ln" d={s.d} id={s.id} />)}
          </g>
        ) : null;
      })}
    </svg>
  );
}
```

`typeof window.requestIdleCallback === "function"` is deliberate: an `in` check would narrow `window` to `never` in the fallback branch and fail type-checking. In `scrub` mode the draw's dash values stay on the paths after `finish()`. That is harmless for life: the leaf alternates have the same length, and the steam variants are phase-shifted waves of equal amplitude.

`app/globals.css`: replace these two Task 5 lines

```css
.drawing .layer-lamp path { stroke: var(--ink); }
```

```css
.drawing .glow { opacity: calc(var(--glow) * 0.9); transition: opacity 600ms var(--ease-pen); }
```

with:

```css
/* Lamps: the lamp layer (bulbs, pin bands, lit letters) is ink by day and lamp after dark; glows follow --glow (0 by day, 1 at night). */
.drawing .layer-lamp path { stroke: var(--ink); transition: stroke 600ms var(--ease-pen), opacity 140ms linear; }
html[data-regime="night"] .drawing .layer-lamp path,
.night-scope .drawing .layer-lamp path { stroke: var(--lamp); }
.drawing .glow { opacity: calc(var(--glow) * 0.9); transition: opacity 600ms var(--ease-pen); pointer-events: none; }

/* The marquee after dark: the lit group of three, the group behind it, the rest resting low. */
.drawing[data-chase] .layer-lamp path[id^="bulb-"] { opacity: 0.3; }
.drawing[data-chase] .layer-lamp path[id^="bulb-"][data-lit="trail"] { opacity: 0.6; }
.drawing[data-chase] .layer-lamp path[id^="bulb-"][data-lit="on"] { opacity: 1; }

/* The cue ball's track is geometry for MotionPath, never drawn. */
.drawing path.roll-track { visibility: hidden; stroke: none; }
```

(`.night-scope` arrives in Task 17; the selector is inert until then. The chase itself follows `html[data-regime]` only.)

`app/lab/life/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { Drawing } from "@/components/draw/Drawing";
import { ball, bulb, cup, leaf, steam } from "@/lib/draw/glyphs";
import { line, rect, repeat } from "@/lib/draw/primitives";
import type { Drawing as DrawingData, P, Stroke } from "@/lib/draw/types";

export const dynamic = "force-dynamic";

/** Development only: one sheet carrying every kind of life, so the loops can be checked in isolation. Never linked; 404 in production. */
const CUP_BASE: P = [330, 1000];
const STEAM_BASE: P = [330, 780];
const STEAM_HEIGHT = 230;
const PLANT: [P, number, number][] = [
  [[760, 930], 90, -150],
  [[760, 880], 90, -30],
  [[760, 820], 80, -140],
  [[760, 770], 80, -45],
];
const BALL: P = [260, 1185];

function lifeFixture(): DrawingData {
  const rest = steam(STEAM_BASE, STEAM_HEIGHT, 0);
  const one = steam(STEAM_BASE, STEAM_HEIGHT, 1);
  const two = steam(STEAM_BASE, STEAM_HEIGHT, 2);
  const morphs: Record<string, string[]> = {};
  const strokes: Stroke[] = [
    line([120, 1000], [960, 1000]),
    rect(150, 1090, 780, 190),
    line([760, 1000], [760, 740], "detail"),
    ...cup(CUP_BASE, 150, 190),
  ];
  rest.forEach((s, k) => {
    strokes.push({ ...s, id: `steam-0-${k}` });
    morphs[`steam-0-${k}`] = [one[k].d, two[k].d];
  });
  PLANT.forEach(([base, length, angle], i) => {
    strokes.push({ ...leaf(base, length, angle), id: `leaf-${i}` });
    morphs[`leaf-${i}`] = [leaf(base, length, angle + 7).d];
  });
  strokes.push(...repeat(9, (i, t) => ({ ...bulb([180 + t * 720, 170], 9), id: `bulb-${i}` })));
  strokes.push({ ...ball(BALL, 18), id: "cue-ball" });
  return {
    id: "life",
    title: "Life fixture: steam over a cup, a plant, a string of bulbs and a cue ball (development only)",
    x: 0, y: 0, width: 1080, height: 1350,
    strokes,
    glows: [{ x: 540, y: 170, r: 140 }],
    morphs,
    roll: { ball: "cue-ball", path: `M${BALL[0]} ${BALL[1]}L820 ${BALL[1]}` },
  };
}

export default function LabLife() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className="wrap" style={{ paddingBlock: "8svh", maxWidth: 720 }}>
      <Drawing drawing={lifeFixture()} />
      <div style={{ height: "250svh" }} aria-hidden="true" />
    </div>
  );
}
```

- [ ] **Step 4: Run to verify they pass**

Run: `npm test -- life`
Expected: `✓ tests/life.test.ts (23 tests)`: 3 chaseGroups, 3 leafSchedule, 3 hasLife and one per registered drawing (mark, facade, entry, main-floor, wall-lamp, mezzanine-stair, mezzanine-night, courtyard, games, alley-sign, hoodie, nocatch, pizza, dough). If a drawing test fails, fix that drawing module (a missing alternate, a bulb outside the lamp layer, more than 12 leaves), not the test.

Run: `npm test && npm run lint`
Expected: every test file passes, including `draw-*`, `drawings`, `photos` and `life`; lint reports no errors.

With the dev server on 3021: `node scripts/e2e/draw.mjs && node scripts/e2e/life.mjs`
Expected: `draw.mjs` still ends `all checks passed` (the draw-on is unchanged and GSAP is still never loaded under reduced motion). `life.mjs` prints `ok` for every line, among them:
- `steam d changes over 3 s at noon`
- `leaves swap to their alternate within 10 s`
- `life pauses when the drawing leaves the viewport`
- `alley-sign 390: bulbs differ between two screenshots 250 ms apart at 01:00`
- `alley-sign day: no chase at 14:00`
- `games: the roll takes about 1.4 s (1.4x s)`
- `reduced motion: two screenshots 3 s apart are identical`
- `reduced motion: rolling does not load GSAP`

It ends `all checks passed`. If `games: the ball starts where its track starts` fails, start `roll.path` in `drawings/games.ts` at the cue ball's centre.

- [ ] **Step 5: Look**

With Playwright MCP (dev server on 3021), at 390x844 first, then 1440x900:
1. `http://localhost:3021/lab/alley-sign?at=01:00`: take two screenshots about 200 ms apart and read both.
   - A bright group of three bulbs has moved one group along B, O, W, L, with a softer group behind it.
   - The other bulbs are dim but still visible in lamp amber.
   - Warm glows sit behind the marquee, the pin bands, OPEN and the lightbox.
   - The panels, posts, pin outline and lightbox are pixel-identical in both shots (architecture never moves).
   - On the phone the chase reads as a marquee, not a flicker.
2. `http://localhost:3021/lab/alley-sign?at=14:00`: bulbs in ink, no glows, nothing moving in two shots 1 s apart.
3. `http://localhost:3021/lab/life?at=14:00`: take shots at 0, 1.2 and 2.4 s.
   - The three steam lines drift smoothly above the cup and never cross, kink or detach from their start points.
   - For the sway, take a burst of 7 shots about 170 ms apart starting 9 s after load: in some frames the leaves tip 7 degrees, odd leaves one frame behind, and they settle back on their drawn shapes.
4. `http://localhost:3021/lab/facade?at=01:00` and `http://localhost:3021/lab/courtyard?at=14:00`.
   - Facade: the two string-light bulbs are amber with their glows, the logo glow is on, and the creeper leaves sway now and then.
   - Courtyard: leaves sway, while the railing balusters, table and chairs stay still.
5. `http://localhost:3021/lab/games?at=14:00`: run `document.querySelector("svg.drawing").dispatchEvent(new CustomEvent("drawing:roll"))` with `browser_evaluate` and take shots at about 0.3 s, 0.8 s and 2 s.
   - The ball leaves fast and slows to rest.
   - It stays inside the table's felt the whole way, never crossing a cushion or pocket line.
   - It keeps its drawn weight.
   - Dispatch again: it rolls back to where it was drawn.
6. Reduced motion: with `browser_run_code_unsafe` run `await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("http://localhost:3021/lab/alley-sign?at=01:00");` and take two shots 500 ms apart. Bulbs and glows are lit, and the two shots are identical. On `/lab/games`, dispatching the roll moves the ball to the far end in one frame.

- [ ] **Step 6: Commit**

```bash
git add components/draw/life.ts components/draw/Drawing.tsx app/globals.css app/lab/life tests/life.test.ts scripts/e2e/life.mjs
git commit -m "feat: life in the line: steam morphs, swaying leaves, the BOWL chase after dark, lamps and the rolling cue ball"
```

---

### Task 16: The house: the logo opens into six rooms

This is the site's signature moment. When the page first loads, the mark draws itself in the order an architect would: arch, dividers, sun, steam, plant, house. Then its arch widens and its three dividers stretch into the grid of six room panes. Each pane holds a small vignette drawn from that room's own drawing. The sun sits on the arch at the visitor's hour, and after dark it hangs there as a lamp. All of the geometry is pure, tested maths in `lib/house.ts`. The component only measures its box, renders, and runs one GSAP timeline.

**Files:**
- Create: `lib/house.ts` (pure: room order, house geometry, the sun on the arch, vignette crops and stroke choice, path scaling, the arrival schedule)
- Create: `components/house/House.tsx` (server entry `<House arrival? />`: picks the vignette strokes and the mark strokes on the server, so no drawing module, zod or `drawings.json` reaches the browser)
- Create: `components/house/HouseCanvas.tsx` (client: measures the stage, renders the svg, runs the arrival, places the sun)
- Create: `components/house/house.css`
- Modify: `app/page.tsx` (puts `<House arrival />` above the temporary heading from Task 5; Task 17 replaces the whole page)
- Test: `tests/house.test.ts`, `scripts/e2e/arrival.mjs`

**Interfaces:**
- Consumes: `cafe`, `roomWord` (`lib/cafe.ts`, Task 1); `stateFor` (`lib/daylight.ts`, Task 1, tests only); `ARCH_PATH` (`lib/mark.ts`, Task 1, tests only); `Drawing`, `Stroke` (`lib/draw/types.ts`, Task 2); `frameOf` (`lib/drawings.ts`, Task 3, tests only); `drawingFor` (`drawings/index.ts`), `markDrawing` (`drawings/mark.ts`, ids `mark-arch`, `mark-divider-0..2`, `mark-sun`, `mark-steam-0..2`) (Task 3); the room drawings `entry`, `main-floor`, `mezzanine-stair`, `courtyard`, `games`, `alley-sign` (Tasks 8 to 12); `useLight()` (`components/light/LightProvider.tsx`, Task 5); the `pen-fallback` keyframes and the `--ink --ink-2 --paper --pen --hair --lamp --glow --line-w --ease-pen` tokens (`app/globals.css`, Task 5); `loadGsap()`, `motionAllowed()` (`lib/motion/gsap.ts`, Task 6); `BASE`, `assert`, `report`, `shot` (`scripts/e2e/lib.mjs`, Task 5).
- Produces (`lib/house.ts`):
  - `type RoomSlug = "entry" | "main-floor" | "mezzanine" | "courtyard" | "games" | "bowling"`
  - `ROOM_ORDER: { slug: RoomSlug; drawing: string; name: string }[]`: the story order entry, main-floor, mezzanine, courtyard, games, bowling, using the drawings `entry`, `main-floor`, `mezzanine-stair`, `courtyard`, `games`, `alley-sign`. Names come from `cafe.spaces`.
  - `houseGeometry(width: number, height: number): HouseGeometry`. `HouseGeometry` is `{ width; height; cx; r; top; spring; floor; left; right; inset; arch: string; lines: [string, string, string]; panes: Pane[]; sun: { cx: number; cy: number; r: number } }`, and `Pane` is `{ slug: RoomSlug; name: string; x: number; y: number; w: number; h: number; d: string; clip: string; inner: { x: number; y: number; w: number; h: number } }`.
    - The arch's span is the width minus the site gutters, capped so the arch fits the height with its head plus two rectangular rows (height at least 1.3 × span).
    - `lines` are the vertical centre line, the line at the springing of the arch, and the line halfway down the jambs.
    - The panes are two columns and three rows in ROOM_ORDER reading order. The top two are exact quarter circles, clipped by the arch head.
    - `d` is the pane region, used as the hit area. `clip` is that region inset by `inset`, used for the vignette clip and the focus ring. `inner` is the inset box that holds the vignette.
    - `sun` is the sun's radius and its position at the crown (clockT 0.5).
  - `sunOnArch(clockT: number, geometry): { cx: number; cy: number }` moves the sun along a circle concentric with the arch head, from low left (11 AM, clockT 0) over the crown to low right (3 AM, clockT 1). It keeps the sun's rays clear of both the arch line and the springing line.
  - `archYAt(geometry, x): number`, `sunGlyph(r): string[]` (a circle and 8 rays, as in the mark), `lampGlyph(r, cordTop): string[]` (cord, shade, bulb).
  - `VIGNETTES: Record<RoomSlug, [number, number, number, number]>`: crops in each room drawing's 1080 frame.
  - `VIGNETTE_MAX_STROKES = 32` and `vignetteStrokes(drawing, crop, max?): Stroke[]` (the longest structure strokes that touch the crop, in drawing order, ids removed).
  - `parsePath(d)`, `formatPath(cmds)`, `scalePath(d, s, tx, ty): string`, `pathBounds(d)`, `approxLength(d)` (absolute `M L C Q A Z` only).
  - `markPlacement(geometry): { s; tx; ty }`; `MarkGroup`, `markGroups(strokes): Record<MarkGroup, number[]>`, `MARK_SCHEDULE`, `ARRIVAL`, `arrivalDuration(markStrokes, vignetteCount?): number` (2.38 s); `arrivalSkipReason({ spent, motion, scrolled }): "reduced" | "repeat" | "scrolled" | null`; `FALLBACK_SIZE`, `gutterFor(width)`.
- Produces (components):
  - `<House arrival?: boolean />` (server), rendering `<HouseCanvas arrival vignettes mark />` (client). `VignetteData` is `{ slug: RoomSlug; crop: [number, number, number, number]; paths: string[] }`.
  - The DOM contract used by later tasks and checks:
    - `div.house-stage > svg.house[data-arrival="pending"|"running"|"done"][data-arrival-reason="complete"|"interrupted"|"reduced"|"repeat"|"scrolled"][data-arrival-duration]`
    - `path[data-stroke="house-arch"]`, `path[data-stroke="house-line-0..2"]`
    - `.house-mark path[data-stroke="mark-*"]` while arriving
    - one `a.house-pane[href="/spaces#<slug>"][aria-label][data-slug]` per pane, containing `path.house-hit`, `g.house-pane-art > svg.house-vignette > path.ln`, `text.house-label` and `path.house-focus`
    - `g.house-sun` with `.house-sun-day` and `.house-sun-night`.
  - Task 19 attaches `flyToRoom` to the `a.house-pane` elements, which are rendered in `HouseCanvas.tsx`.

- [ ] **Step 1: Write the failing tests**

`tests/house.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { drawingFor } from "@/drawings";
import { markDrawing } from "@/drawings/mark";
import { cafe } from "@/lib/cafe";
import { stateFor } from "@/lib/daylight";
import { frameOf } from "@/lib/drawings";
import { ARCH_PATH } from "@/lib/mark";
import type { Drawing } from "@/lib/draw/types";
import {
  ARRIVAL, HOUSE_MIN_RATIO, HOUSE_PAD, MARK_SCHEDULE, ROOM_ORDER, SUN_CLEARANCE, SUN_RAY_REACH, VIGNETTES, VIGNETTE_MAX_STROKES,
  approxLength, archYAt, arrivalDuration, arrivalSkipReason, gutterFor, houseGeometry, lampGlyph, markGroups, markPlacement,
  parsePath, pathBounds, scalePath, sunGlyph, sunOnArch, vignetteStrokes, type MarkGroup,
} from "@/lib/house";

const SIZES: [number, number][] = [[320, 480], [390, 636], [430, 700], [768, 820], [1440, 692], [1920, 1000]];
const nums = (d: string) => parsePath(d).flatMap((c) => c.v);
const close = (a: number, b: number, tol = 0.011) => expect(Math.abs(a - b), `${a} vs ${b}`).toBeLessThanOrEqual(tol);

describe("room order", () => {
  it("tells the house as a story in six rooms, named from cafe.json", () => {
    expect(ROOM_ORDER.map((r) => r.slug)).toEqual(["entry", "main-floor", "mezzanine", "courtyard", "games", "bowling"]);
    expect(ROOM_ORDER.map((r) => r.drawing)).toEqual(["entry", "main-floor", "mezzanine-stair", "courtyard", "games", "alley-sign"]);
    for (const r of ROOM_ORDER) expect(r.name).toBe(cafe.spaces.find((s) => s.slug === r.slug)!.name);
  });
});

describe("gutters", () => {
  it("match the CSS clamp(20px, 5.5vw, 80px)", () => {
    expect(gutterFor(300)).toBe(20);
    close(gutterFor(390), 21.45);
    expect(gutterFor(1600)).toBe(80);
  });
});

describe("houseGeometry", () => {
  it("fills the width minus gutters on a phone, standing on the floor with its apex at the top", () => {
    const g = houseGeometry(390, 636);
    close(g.right - g.left, 390 - 2 * 21.45);
    close(g.cx, 195);
    close(g.r, (390 - 2 * 21.45) / 2);
    close(g.top, HOUSE_PAD);
    close(g.floor, 636 - HOUSE_PAD);
    close(g.spring, g.top + g.r);
  });

  it("caps the span by the height on a wide screen so the head and two rows still fit", () => {
    const g = houseGeometry(1440, 692);
    const span = (692 - 2 * HOUSE_PAD) / HOUSE_MIN_RATIO;
    close(g.right - g.left, span);
    close(g.cx, 720);
    close((g.floor - g.top) / (g.right - g.left), HOUSE_MIN_RATIO);
  });

  it("never exceeds the width minus gutters, nor the height", () => {
    for (const [w, h] of SIZES) {
      const g = houseGeometry(w, h);
      expect(g.right - g.left).toBeLessThanOrEqual(w - 2 * gutterFor(w) + 0.01);
      expect(g.floor - g.top).toBeLessThanOrEqual(h - 2 * HOUSE_PAD + 0.01);
      expect((g.floor - g.top) / (g.right - g.left)).toBeGreaterThanOrEqual(HOUSE_MIN_RATIO - 0.001);
    }
  });

  it("draws the arch in the mark's grammar: floor, jamb, semicircular head, jamb, closed", () => {
    const g = houseGeometry(390, 636);
    const cmds = parsePath(g.arch);
    expect(cmds.map((c) => c.c).join("")).toBe(ARCH_PATH.replace(/[^A-Z]/g, ""));
    const [m, l1, a, l2] = cmds;
    close(m.v[0], g.left); close(m.v[1], g.floor);
    close(l1.v[0], g.left); close(l1.v[1], g.spring);
    close(a.v[0], g.r); close(a.v[1], g.r);
    expect(a.v.slice(2, 5)).toEqual([0, 0, 1]);
    close(a.v[5], g.right); close(a.v[6], g.spring);
    close(l2.v[0], g.right); close(l2.v[1], g.floor);
  });

  it("draws three grid lines: the centre, the springing line and halfway down the jambs", () => {
    const g = houseGeometry(390, 636);
    const [v, h1, h2] = g.lines.map(nums);
    [g.cx, g.top, g.cx, g.floor].forEach((x, i) => close(v[i], x));
    [g.left, g.spring, g.right, g.spring].forEach((x, i) => close(h1[i], x));
    const mid = g.spring + (g.floor - g.spring) / 2;
    [g.left, mid, g.right, mid].forEach((x, i) => close(h2[i], x));
  });

  it("divides the interior into six panes in reading order, tiling the arch's box exactly", () => {
    for (const [w, h] of SIZES) {
      const g = houseGeometry(w, h);
      expect(g.panes.map((p) => p.slug)).toEqual(ROOM_ORDER.map((r) => r.slug));
      for (let i = 1; i < 6; i++) {
        const [a, b] = [g.panes[i - 1], g.panes[i]];
        expect(b.y > a.y + 0.01 || (Math.abs(b.y - a.y) < 0.01 && b.x > a.x)).toBe(true);
      }
      for (const p of g.panes) {
        close(p.w, g.r);
        expect([g.left, g.cx].some((x) => Math.abs(p.x - x) < 0.011)).toBe(true);
      }
      const area = g.panes.reduce((s, p) => s + p.w * p.h, 0);
      close(area, (g.right - g.left) * (g.floor - g.top), 0.5);
      close(g.panes[0].h, g.r);
      close(g.panes[2].y, g.spring);
      close(g.panes[4].y + g.panes[4].h, g.floor);
    }
  });

  it("clips the top two panes by the arch head and leaves the rest rectangular", () => {
    const g = houseGeometry(390, 636);
    for (const p of g.panes.slice(0, 2)) {
      const arc = parsePath(p.d).find((c) => c.c === "A")!;
      close(arc.v[0], g.r);
      const inner = parsePath(p.clip).find((c) => c.c === "A")!;
      close(inner.v[0], g.r - g.inset);
    }
    for (const p of g.panes.slice(2)) expect(parsePath(p.d).some((c) => c.c === "A")).toBe(false);
  });

  it("keeps every pane a comfortable target, at least 44 px each way", () => {
    for (const [w, h] of SIZES) for (const p of houseGeometry(w, h).panes) expect(Math.min(p.w, p.h), `${w}x${h} ${p.slug}`).toBeGreaterThanOrEqual(44);
  });

  it("fits each pane's inner box inside the pane", () => {
    const g = houseGeometry(390, 636);
    for (const p of g.panes) {
      expect(p.inner.x).toBeGreaterThanOrEqual(p.x);
      expect(p.inner.y).toBeGreaterThanOrEqual(p.y);
      expect(p.inner.x + p.inner.w).toBeLessThanOrEqual(p.x + p.w + 0.001);
      expect(p.inner.y + p.inner.h).toBeLessThanOrEqual(p.y + p.h + 0.001);
    }
  });

  it("finds the arch line above any x", () => {
    const g = houseGeometry(390, 636);
    close(archYAt(g, g.cx), g.top);
    close(archYAt(g, g.left), g.spring);
  });

  it("refuses an empty box", () => {
    expect(() => houseGeometry(0, 600)).toThrow();
  });
});

describe("sunOnArch", () => {
  const g = houseGeometry(390, 636);
  const rho = g.spring - g.sun.cy;

  it("sits at the crown at 7 PM, low left at 11 AM and low right at 3 AM", () => {
    const crown = sunOnArch(stateFor(19).clockT, g);
    close(crown.cx, g.cx);
    close(crown.cy, g.spring - rho);
    expect(sunOnArch(stateFor(11).clockT, g).cx).toBeLessThan(g.cx - rho * 0.9);
    expect(sunOnArch(stateFor(3).clockT, g).cx).toBeGreaterThan(g.cx + rho * 0.9);
  });

  it("matches the geometry's resting sun at clockT 0.5", () => {
    const p = sunOnArch(0.5, g);
    close(p.cx, g.sun.cx);
    close(p.cy, g.sun.cy);
  });

  it("travels on a circle concentric with the arch head, left to right, symmetrically", () => {
    let last = -Infinity;
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const p = sunOnArch(t, g);
      close(Math.hypot(p.cx - g.cx, p.cy - g.spring), rho, 1e-6);
      expect(p.cx).toBeGreaterThan(last);
      last = p.cx;
      const q = sunOnArch(1 - t, g);
      close(p.cx - g.cx, -(q.cx - g.cx), 1e-6);
      close(p.cy, q.cy, 1e-6);
    }
  });

  it("keeps the rays clear of the arch line and of the springing line", () => {
    for (const [w, h] of SIZES) {
      const geo = houseGeometry(w, h);
      const reach = geo.sun.r * SUN_RAY_REACH;
      expect(geo.spring - geo.sun.cy + reach).toBeLessThan(geo.r);
      for (const t of [0, 1]) expect(sunOnArch(t, geo).cy + reach).toBeLessThanOrEqual(geo.spring);
    }
  });

  it("clamps the clock", () => {
    expect(sunOnArch(-2, g)).toEqual(sunOnArch(0, g));
    expect(sunOnArch(3, g)).toEqual(sunOnArch(1, g));
  });

  it("draws the sun and the lamp as valid strokes", () => {
    expect(sunGlyph(g.sun.r)).toHaveLength(9);
    const lamp = lampGlyph(g.sun.r, -60);
    expect(lamp).toHaveLength(3);
    for (const d of [...sunGlyph(g.sun.r), ...lamp]) expect(d).not.toMatch(/NaN|undefined|Infinity/);
    expect(SUN_CLEARANCE).toBeGreaterThan(SUN_RAY_REACH);
  });
});

describe("path helpers", () => {
  it("scales the mark's arch without touching arc flags", () => {
    expect(scalePath(ARCH_PATH, 2, 10, 20)).toBe("M120 550L120 340A210 210 0 0 1 540 340L540 550Z");
  });
  it("scales curves and repeated pairs", () => {
    expect(scalePath("M0 0C1 2 3 4 5 6L7 8 9 10", 10, 1, -1)).toBe("M1 -1C11 19 31 39 51 59L71 79L91 99");
  });
  it("rejects relative commands rather than drawing them wrongly", () => {
    expect(() => parsePath("m0 0l10 10")).toThrow();
  });
  it("measures bounds and approximate lengths", () => {
    expect(pathBounds("M10 20L30 5")).toEqual({ x0: 10, y0: 5, x1: 30, y1: 20 });
    expect(approxLength("M0 0L30 40")).toBe(50);
    expect(approxLength("M0 0L10 0L10 10L0 10Z")).toBe(40);
  });
});

describe("vignettes", () => {
  it("crops inside each room drawing's frame, near square", () => {
    for (const r of ROOM_ORDER) {
      const [x0, y0, x1, y1] = VIGNETTES[r.slug];
      const f = frameOf(r.drawing);
      expect(x0, r.slug).toBeGreaterThanOrEqual(f.x);
      expect(y0, r.slug).toBeGreaterThanOrEqual(f.y);
      expect(x1, r.slug).toBeLessThanOrEqual(f.x + f.width);
      expect(y1, r.slug).toBeLessThanOrEqual(f.y + f.height);
      const aspect = (x1 - x0) / (y1 - y0);
      expect(aspect, r.slug).toBeGreaterThanOrEqual(0.75);
      expect(aspect, r.slug).toBeLessThanOrEqual(1.35);
    }
  });

  it("shows enough of each room's structure to read, and no more than the budget", () => {
    let total = markDrawing().strokes.length;
    for (const r of ROOM_ORDER) {
      const crop = VIGNETTES[r.slug];
      const strokes = vignetteStrokes(drawingFor(r.drawing), crop);
      expect(strokes.length, `${r.slug}: move the crop toward the drawing's structure`).toBeGreaterThanOrEqual(8);
      expect(strokes.length).toBeLessThanOrEqual(VIGNETTE_MAX_STROKES);
      for (const s of strokes) {
        expect(s.layer).toBe("structure");
        expect(s.id).toBeUndefined();
        const b = pathBounds(s.d);
        expect(b.x1 >= crop[0] && b.x0 <= crop[2] && b.y1 >= crop[1] && b.y0 <= crop[3], r.slug).toBe(true);
      }
      total += strokes.length;
    }
    expect(total).toBeLessThanOrEqual(300);
  });

  it("keeps the longest strokes, in drawing order", () => {
    const d: Drawing = {
      id: "t", title: "t", width: 100, height: 100,
      strokes: [
        { d: "M0 0L10 0", layer: "structure" },
        { d: "M0 10L90 10", layer: "structure", id: "x" },
        { d: "M0 20L50 20", layer: "structure" },
        { d: "M0 30L99 30", layer: "life" },
      ],
    };
    expect(vignetteStrokes(d, [0, 0, 100, 100], 2).map((s) => s.d)).toEqual(["M0 10L90 10", "M0 20L50 20"]);
  });
});

describe("the arrival", () => {
  const strokes = markDrawing().strokes;

  it("groups the mark as an architect draws it: arch, dividers, sun, steam, plant, house", () => {
    const g = markGroups(strokes);
    expect(Object.fromEntries(Object.entries(g).map(([k, v]) => [k, v.length]))).toEqual({ arch: 1, dividers: 3, sun: 11, steam: 3, plant: 10, house: 3 });
    expect(strokes[g.arch[0]].id).toBe("mark-arch");
    expect(g.dividers.map((i) => strokes[i].id)).toEqual(["mark-divider-0", "mark-divider-1", "mark-divider-2"]);
  });

  it("draws the mark in exactly 1.2 s, in order", () => {
    const g = markGroups(strokes);
    const keys = Object.keys(MARK_SCHEDULE) as MarkGroup[];
    expect(keys).toEqual(["arch", "dividers", "sun", "steam", "plant", "house"]);
    const ends = keys.map((k) => MARK_SCHEDULE[k].at + MARK_SCHEDULE[k].duration + MARK_SCHEDULE[k].stagger * (g[k].length - 1));
    close(Math.max(...ends), 1.2, 1e-9);
    for (let i = 1; i < keys.length; i++) expect(MARK_SCHEDULE[keys[i]].at).toBeGreaterThanOrEqual(MARK_SCHEDULE[keys[i - 1]].at);
  });

  it("morphs for 0.9 s straight after the draw, and finishes under 2.4 s", () => {
    close(ARRIVAL.morphAt, 1.2, 1e-9);
    close(ARRIVAL.morph, 0.9, 1e-9);
    close(ARRIVAL.vignetteStagger, 0.08, 1e-9);
    const total = arrivalDuration(strokes);
    expect(total).toBeLessThan(2.4);
    close(total, 2.38, 1e-9);
  });

  it("places the mark at a legible size, centred inside the house arch", () => {
    for (const [w, h] of SIZES) {
      const g = houseGeometry(w, h);
      const { s, tx, ty } = markPlacement(g);
      const v = nums(scalePath(ARCH_PATH, s, tx, ty));
      const [x0, yFloor, x1] = [v[0], v[1], v[11]];
      close((x0 + x1) / 2, g.cx);
      expect(x1 - x0).toBeGreaterThanOrEqual(120 - 0.01);
      expect(x0).toBeGreaterThan(g.left);
      expect(yFloor).toBeLessThan(g.floor);
    }
  });

  it("skips for reduced motion, a repeat visit in the tab, or a page already scrolled", () => {
    expect(arrivalSkipReason({ spent: true, motion: false, scrolled: true })).toBe("reduced");
    expect(arrivalSkipReason({ spent: true, motion: true, scrolled: false })).toBe("repeat");
    expect(arrivalSkipReason({ spent: false, motion: true, scrolled: true })).toBe("scrolled");
    expect(arrivalSkipReason({ spent: false, motion: true, scrolled: false })).toBeNull();
  });
});
```

`scripts/e2e/arrival.mjs` (run against production; it builds its own contexts because it has to watch the page from the first byte):

```js
// The house's arrival. Run: npm run build && npx next start -p 3022 (second terminal), then node scripts/e2e/arrival.mjs
import fs from "node:fs";
import { chromium } from "playwright";
import { BASE, assert, report, shot } from "./lib.mjs";

const spaces = JSON.parse(fs.readFileSync("content/cafe.json", "utf8")).spaces;
const ORDER = ["entry", "main-floor", "mezzanine", "courtyard", "games", "bowling"];
const CORTEN = "rgb(142, 75, 42)";
const browser = await chromium.launch();

/** Runs in the page before any script: logs every change of data-arrival with its time. */
function record() {
  window.__arrival = [];
  new MutationObserver((muts) => {
    for (const m of muts) {
      const el = m.target;
      if (el instanceof SVGSVGElement && el.classList.contains("house")) window.__arrival.push({ phase: el.getAttribute("data-arrival"), t: performance.now() });
    }
  }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-arrival"] });
}

async function fresh({ width = 390, height = 844, at = "14:00", reducedMotion = false, hasTouch = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, hasTouch, reducedMotion: reducedMotion ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  // Links to rooms built in later tasks may 404 when prefetched; those are not errors of the house.
  page.on("console", (m) => { if (m.type() === "error" && !/404|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.addInitScript(record);
  await page.goto(`${BASE}/?at=${at}`, { waitUntil: "domcontentloaded" });
  return { ctx, page, errors };
}

const reached = (page, phase, timeout) => page.waitForSelector(`svg.house[data-arrival="${phase}"]`, { state: "attached", timeout }).then(() => true, () => false);
const reasonOf = (page) => page.getAttribute("svg.house", "data-arrival-reason");
const dashed = (page) => page.$$eval("svg.house path.ln", (els) => els.filter((e) => !["none", ""].includes(getComputedStyle(e).strokeDasharray)).length);

async function archFits(page, label) {
  const box = await page.evaluate(() => {
    const svg = document.querySelector("svg.house");
    const b = svg.querySelector('[data-stroke="house-arch"]').getBBox();
    const s = svg.getBoundingClientRect();
    return { w: b.width, h: b.height, sw: s.width, sh: s.height };
  });
  const gutter = Math.min(80, Math.max(20, box.sw * 0.055));
  const span = Math.min(box.sw - 2 * gutter, (box.sh - 12) / 1.3);
  assert(Math.abs(box.w - span) < 1.5, `${label}: the arch spans ${box.w.toFixed(1)} px, expected ${span.toFixed(1)}`);
  assert(Math.abs(box.h - (box.sh - 12)) < 1.5, `${label}: the arch stands the full height of its stage (${box.h.toFixed(1)} of ${box.sh - 12})`);
}

async function sunState(page) {
  return page.evaluate(() => {
    const g = document.querySelector("svg.house .house-sun");
    if (!g) return null;
    const m = g.transform.baseVal.consolidate().matrix;
    return {
      x: m.e,
      width: document.querySelector("svg.house").getBoundingClientRect().width,
      day: getComputedStyle(g.querySelector(".house-sun-day")).display,
      night: getComputedStyle(g.querySelector(".house-sun-night")).display,
      glow: Number(getComputedStyle(g.querySelector(".house-lamp-glow")).opacity),
    };
  });
}

// 1. The whole arrival on a phone by day, then a repeat visit in the same tab.
{
  const { ctx, page, errors } = await fresh();
  assert(await reached(page, "running", 8000), "the arrival starts once GSAP has loaded");
  await page.waitForTimeout(400);
  assert((await page.locator('svg.house .house-mark [data-stroke="mark-sun"]').count()) === 1, "the mark's sun is on the page while the mark draws");
  await shot(page, "arrival-390-0400ms");
  await page.waitForTimeout(1200);
  await shot(page, "arrival-390-1600ms");
  assert(await reached(page, "done", 4000), "the arrival finishes");
  const log = await page.evaluate(() => window.__arrival);
  const run = log.find((e) => e.phase === "running");
  const done = log.find((e) => e.phase === "done");
  const duration = Number(await page.getAttribute("svg.house", "data-arrival-duration"));
  assert(duration > 2 && duration < 2.4, `the timeline lasts under 2.4 s (${duration})`);
  assert(run && done && done.t - run.t < 2900, `running to done takes under 2.9 s of real time (${run && done ? Math.round(done.t - run.t) : "n/a"} ms)`);
  assert((await reasonOf(page)) === "complete", "it played to the end rather than being skipped");
  assert((await page.locator("svg.house .house-mark").count()) === 0, "the mark group is gone once the house stands");
  assert((await dashed(page)) === 0, "every stroke is whole after the arrival");
  await archFits(page, "390x844");

  const panes = await page.$$eval("svg.house a.house-pane", (as) => as.map((a) => {
    const r = a.querySelector(".house-hit").getBoundingClientRect();
    return { href: a.getAttribute("href"), label: a.getAttribute("aria-label"), w: r.width, h: r.height, paths: a.querySelectorAll(".house-vignette path").length };
  }));
  assert(JSON.stringify(panes.map((p) => p.href)) === JSON.stringify(ORDER.map((s) => `/spaces#${s}`)), `six panes in story order (${panes.map((p) => p.href).join(", ")})`);
  assert(panes.every((p, i) => p.label === spaces.find((s) => s.slug === ORDER[i]).name), "each pane is named after its room");
  assert(panes.every((p) => p.w >= 44 && p.h >= 44), `every pane is at least 44 px each way (${panes.map((p) => `${Math.round(p.w)}x${Math.round(p.h)}`).join(" ")})`);
  assert(panes.every((p) => p.paths >= 8 && p.paths <= 32), `every vignette has 8 to 32 strokes (${panes.map((p) => p.paths).join(" ")})`);

  const sun = await sunState(page);
  assert(sun && sun.x < sun.width / 2, `at 2 PM the sun is left of the crown (${sun && sun.x.toFixed(1)})`);
  assert(sun && sun.day !== "none" && sun.night === "none", "by day the sun is a sun, not a lamp");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "no sideways scroll");
  await shot(page, "arrival-390-done");

  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    if (await page.evaluate(() => document.activeElement?.classList?.contains("house-pane"))) break;
  }
  const ring = await page.evaluate(() => {
    const a = document.activeElement;
    return a?.classList?.contains("house-pane") ? getComputedStyle(a.querySelector(".house-focus")).stroke : "no pane focused";
  });
  assert(ring === CORTEN, `a focused pane is outlined in corten (${ring})`);
  await shot(page, "arrival-390-focus");

  const before = (await page.evaluate(() => window.__arrival)).length;
  await page.evaluate(() => window.next.router.push("/?at=14:00&again=1"));
  await page.waitForURL(/again=1/);
  const repeat = await page.waitForSelector('svg.house[data-arrival-reason="repeat"]', { state: "attached", timeout: 5000 }).then(() => true, () => false);
  assert(repeat, "a second visit in the same tab shows the finished house");
  const after = (await page.evaluate(() => window.__arrival)).slice(before);
  assert(!after.some((e) => e.phase === "running"), "and does not run the arrival again");
  assert(errors.length === 0, `no console errors (${errors.join(" | ")})`);
  await ctx.close();
}

// 2. The house at night on a wide screen: capped by height, the sun is a lamp with its glow.
{
  const { ctx, page, errors } = await fresh({ width: 1440, height: 900, at: "01:00" });
  assert(await reached(page, "done", 9000), "1440 night: the arrival finishes");
  await archFits(page, "1440x900");
  const sun = await sunState(page);
  assert(sun && sun.x > sun.width / 2, `at 1 AM the lamp hangs right of the crown (${sun && sun.x.toFixed(1)})`);
  assert(sun && sun.day === "none" && sun.night !== "none", "after dark the sun becomes a lamp");
  assert(sun && sun.glow > 0.5, `the lamp glows (${sun && sun.glow})`);
  assert(errors.length === 0, `no console errors (${errors.join(" | ")})`);
  await shot(page, "arrival-1440-night-done");
  await ctx.close();
}

// 3. Any input skips straight to the finished house.
for (const [name, act, options] of [
  ["wheel", async (page) => { await page.mouse.move(195, 780); await page.mouse.wheel(0, 120); }, {}],
  ["key", async (page) => page.keyboard.press("Shift"), {}],
  ["touch", async (page) => page.touchscreen.tap(195, 830), { hasTouch: true }],
]) {
  const { ctx, page } = await fresh(options);
  assert(await reached(page, "running", 8000), `${name}: the arrival starts`);
  await page.waitForTimeout(300);
  await act(page);
  assert(await reached(page, "done", 400), `${name}: skips to the finished house at once`);
  assert((await reasonOf(page)) === "interrupted", `${name}: recorded as interrupted`);
  assert((await page.locator("svg.house .house-mark").count()) === 0, `${name}: the mark is gone`);
  assert((await dashed(page)) === 0, `${name}: no half-drawn strokes left behind`);
  const d = await page.getAttribute('svg.house [data-stroke="house-arch"]', "d");
  assert(/^M[\d.]+ [\d.]+L[\d.]+ [\d.]+A/.test(d), `${name}: the arch is back to its own path data (${d.slice(0, 32)})`);
  await ctx.close();
}

// 4. Reduced motion: the finished house at once, no GSAP.
{
  const { ctx, page, errors } = await fresh({ reducedMotion: true });
  assert(await reached(page, "done", 5000), "reduced motion: the house is finished");
  assert((await reasonOf(page)) === "reduced", "reduced motion: recorded as reduced");
  assert((await page.locator("svg.house .house-mark").count()) === 0, "reduced motion: no mark to draw");
  const visible = await page.evaluate(() => getComputedStyle(document.querySelector("svg.house .house-final")).visibility);
  assert(visible === "visible", "reduced motion: the house is visible");
  assert(await page.evaluate(() => !window.gsapVersions), "reduced motion: GSAP never loads");
  assert(errors.length === 0, `no console errors (${errors.join(" | ")})`);
  await shot(page, "arrival-390-reduced");
  await ctx.close();
}

await browser.close();
report();
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- house`
Expected: FAIL with `Failed to resolve import "@/lib/house"`.

Run: `npm run build`, then `npx next start -p 3022` in a second terminal, then `node scripts/e2e/arrival.mjs`
Expected: `FAIL the arrival starts once GSAP has loaded` (there is no `svg.house` yet), then the failure count and exit code 1.

- [ ] **Step 3: Implement**

`lib/house.ts`:

```ts
import { cafe } from "@/lib/cafe";
import type { Drawing, Stroke } from "@/lib/draw/types";

/* ------------------------------------------------------------------ rooms */

export type RoomSlug = "entry" | "main-floor" | "mezzanine" | "courtyard" | "games" | "bowling";

function spaceName(slug: RoomSlug): string {
  const space = cafe.spaces.find((s) => s.slug === slug);
  if (!space) throw new Error(`content/cafe.json has no space "${slug}"`);
  return space.name;
}

/** The house told as a story. The order is not a plan: no pane claims which room is next to which. */
export const ROOM_ORDER: { slug: RoomSlug; drawing: string; name: string }[] = [
  { slug: "entry", drawing: "entry", name: spaceName("entry") },
  { slug: "main-floor", drawing: "main-floor", name: spaceName("main-floor") },
  { slug: "mezzanine", drawing: "mezzanine-stair", name: spaceName("mezzanine") },
  { slug: "courtyard", drawing: "courtyard", name: spaceName("courtyard") },
  { slug: "games", drawing: "games", name: spaceName("games") },
  { slug: "bowling", drawing: "alley-sign", name: spaceName("bowling") },
];

/**
 * Each pane's crop [x0, y0, x1, y1] in its room drawing's 1080 frame, measured on the guide grids
 * so that the part of the room that reads at a glance fills the pane. The top two panes lose their
 * outer top corner to the arch head, so nothing essential sits in that corner.
 */
export const VIGNETTES: Record<RoomSlug, [number, number, number, number]> = {
  // entry-ceiling: fruit-crate strips overhead (y 0-300), the beam band, the stair rising to the landing (0-690, 630-1130).
  entry: [0, 0, 1080, 1080],
  // ad-1: mezzanine railing (290-490, 180-260), the stair from (470,470) up to (910,30), plants and tables below.
  "main-floor": [300, 0, 925, 625],
  // ad-2: the two tall window pairs (340-570, 185-640), the treads on the left, the steel column at x 600-620.
  mezzanine: [100, 170, 700, 770],
  // courtyard-vines: the table (260-800, 1510-1680) and the two curved-back chairs, under the palms.
  courtyard: [0, 900, 1080, 1920],
  // games (a still life, frame 1080x1350): the pool table and the shelves above it.
  games: [0, 270, 1080, 1350],
  // bowl-sign: the BOWL marquee (145-420, 425-1300) beside the pin (560-820, 615-1270).
  bowling: [100, 420, 880, 1300],
};

/* ------------------------------------------------------------------ paths */

type Command = "M" | "L" | "C" | "Q" | "A" | "Z";
export interface PathCommand { c: Command; v: number[] }

const ARITY: Record<Command, number> = { M: 2, L: 2, C: 6, Q: 4, A: 7, Z: 0 };
const TOKEN = /(-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)|([A-Za-z])/g;

/** Two decimals, no "-0". */
const f = (v: number): string => {
  const r = Math.round(v * 100) / 100;
  return Object.is(r, -0) ? "0" : String(r);
};

/** Absolute M L C Q A Z only (what lib/draw and lib/mark emit). Implicit repeats are split into separate commands. */
export function parsePath(d: string): PathCommand[] {
  const raw: PathCommand[] = [];
  for (const m of d.matchAll(TOKEN)) {
    if (m[2]) {
      if (!(m[2] in ARITY)) throw new Error(`Unsupported path command "${m[2]}" in "${d}"`);
      raw.push({ c: m[2] as Command, v: [] });
    } else {
      const last = raw[raw.length - 1];
      if (!last) throw new Error(`Path data must start with a command: "${d}"`);
      last.v.push(Number(m[1]));
    }
  }
  const out: PathCommand[] = [];
  for (const cmd of raw) {
    const n = ARITY[cmd.c];
    if (n === 0) {
      if (cmd.v.length) throw new Error(`Z takes no numbers in "${d}"`);
      out.push(cmd);
      continue;
    }
    if (cmd.v.length === 0 || cmd.v.length % n) throw new Error(`${cmd.c} expects groups of ${n} numbers in "${d}"`);
    for (let i = 0; i < cmd.v.length; i += n) out.push({ c: i > 0 && cmd.c === "M" ? "L" : cmd.c, v: cmd.v.slice(i, i + n) });
  }
  return out;
}

export function formatPath(cmds: PathCommand[]): string {
  return cmds.map(({ c, v }) => c + v.map(f).join(" ")).join("");
}

/** Uniform scale then translate. Arc radii scale; rotation and flags do not. */
export function scalePath(d: string, s: number, tx: number, ty: number): string {
  return formatPath(
    parsePath(d).map(({ c, v }) =>
      c === "A"
        ? { c, v: [v[0] * s, v[1] * s, v[2], v[3], v[4], v[5] * s + tx, v[6] * s + ty] }
        : { c, v: v.map((n, i) => (i % 2 ? n * s + ty : n * s + tx)) },
    ),
  );
}

/** A box sure to contain the stroke (control points for curves; arcs padded by their diameter). */
export function pathBounds(d: string): { x0: number; y0: number; x1: number; y1: number } {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (x: number, y: number) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
  for (const { c, v } of parsePath(d)) {
    if (c === "Z") continue;
    if (c === "A") {
      add(v[5] - 2 * v[0], v[6] - 2 * v[1]);
      add(v[5] + 2 * v[0], v[6] + 2 * v[1]);
      continue;
    }
    for (let i = 0; i < v.length; i += 2) add(v[i], v[i + 1]);
  }
  return { x0, y0, x1, y1 };
}

/** Length for ranking strokes: exact for lines, control polygon for curves, chord-based for arcs. */
export function approxLength(d: string): number {
  let len = 0, px = 0, py = 0, sx = 0, sy = 0;
  for (const { c, v } of parsePath(d)) {
    if (c === "M") { px = sx = v[0]; py = sy = v[1]; continue; }
    if (c === "Z") { len += Math.hypot(sx - px, sy - py); px = sx; py = sy; continue; }
    const x = v[v.length - 2], y = v[v.length - 1];
    if (c === "A") {
      const chord = Math.hypot(x - px, y - py);
      len += v[3] ? Math.max(chord, 2 * Math.PI * v[0] - chord) : chord * 1.2;
    } else if (c === "L") {
      len += Math.hypot(x - px, y - py);
    } else {
      let qx = px, qy = py;
      for (let i = 0; i < v.length; i += 2) { len += Math.hypot(v[i] - qx, v[i + 1] - qy); qx = v[i]; qy = v[i + 1]; }
    }
    px = x; py = y;
  }
  return len;
}

/* --------------------------------------------------------------- geometry */

export const HOUSE_PAD = 6; // room for the line at the apex and the floor
export const HOUSE_MIN_RATIO = 1.3; // arch height over span: the head (0.5) and two rows of 0.4
export const SUN_RAY_REACH = 1.85; // the mark's rays end at SUN_RADIUS + 17 = 1.85 x 20
export const SUN_CLEARANCE = 2.2; // the sun's centre stays this many radii inside the arch line and above the springing line
export const VIGNETTE_MAX_STROKES = 32; // six vignettes and the mark stay under 300 strokes drawing at once
export const FALLBACK_SIZE = { width: 390, height: 636 }; // server render; replaced by the measured stage before first paint

/** The site gutter, the same clamp as --gutter: clamp(20px, 5.5vw, 80px). */
export function gutterFor(width: number): number {
  return Math.min(80, Math.max(20, width * 0.055));
}

export interface Pane {
  slug: RoomSlug;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** The pane's region: the hit area. */
  d: string;
  /** The region inset by `inset`: clips the vignette and draws the focus ring. */
  clip: string;
  /** The inset box the vignette is fitted into. */
  inner: { x: number; y: number; w: number; h: number };
}

export interface HouseGeometry {
  width: number;
  height: number;
  cx: number;
  r: number;
  top: number;
  spring: number;
  floor: number;
  left: number;
  right: number;
  inset: number;
  arch: string;
  lines: [string, string, string];
  panes: Pane[];
  sun: { cx: number; cy: number; r: number };
}

const rectPath = (x: number, y: number, w: number, h: number) => `M${f(x)} ${f(y)}L${f(x + w)} ${f(y)}L${f(x + w)} ${f(y + h)}L${f(x)} ${f(y + h)}Z`;

/**
 * The mark's arch grown to the stage. Its span is the width minus the gutters, unless the stage is
 * too short to hold the head and two rows, in which case the height sets it. The interior is two
 * columns and three rows: the top two panes are the quarter circles under the head (the springing
 * line is the mark's own left divider), the other four are rectangles halving the jambs.
 */
export function houseGeometry(width: number, height: number): HouseGeometry {
  if (!(width > 0 && height > 0)) throw new Error(`houseGeometry needs a positive size, got ${width}x${height}`);
  const top = HOUSE_PAD;
  const floor = height - HOUSE_PAD;
  const span = Math.max(0, Math.min(width - 2 * gutterFor(width), (floor - top) / HOUSE_MIN_RATIO));
  const r = span / 2;
  const cx = width / 2;
  const left = cx - r;
  const right = cx + r;
  const spring = top + r;
  const mid = spring + (floor - spring) / 2;
  const inset = Math.max(6, r * 0.045);

  const arch = `M${f(left)} ${f(floor)}L${f(left)} ${f(spring)}A${f(r)} ${f(r)} 0 0 1 ${f(right)} ${f(spring)}L${f(right)} ${f(floor)}Z`;
  const lines: [string, string, string] = [
    `M${f(cx)} ${f(top)}L${f(cx)} ${f(floor)}`,
    `M${f(left)} ${f(spring)}L${f(right)} ${f(spring)}`,
    `M${f(left)} ${f(mid)}L${f(right)} ${f(mid)}`,
  ];

  const ri = r - inset;
  const q = Math.sqrt(Math.max(0, ri * ri - inset * inset));
  const topLeft = {
    d: `M${f(cx)} ${f(spring)}L${f(left)} ${f(spring)}A${f(r)} ${f(r)} 0 0 1 ${f(cx)} ${f(top)}Z`,
    clip: `M${f(cx - inset)} ${f(spring - inset)}L${f(cx - q)} ${f(spring - inset)}A${f(ri)} ${f(ri)} 0 0 1 ${f(cx - inset)} ${f(spring - q)}Z`,
  };
  const topRight = {
    d: `M${f(cx)} ${f(spring)}L${f(cx)} ${f(top)}A${f(r)} ${f(r)} 0 0 1 ${f(right)} ${f(spring)}Z`,
    clip: `M${f(cx + inset)} ${f(spring - inset)}L${f(cx + inset)} ${f(spring - q)}A${f(ri)} ${f(ri)} 0 0 1 ${f(cx + q)} ${f(spring - inset)}Z`,
  };
  const boxes = [
    { x: left, y: top, w: r, h: r, ...topLeft },
    { x: cx, y: top, w: r, h: r, ...topRight },
    { x: left, y: spring, w: r, h: mid - spring },
    { x: cx, y: spring, w: r, h: mid - spring },
    { x: left, y: mid, w: r, h: floor - mid },
    { x: cx, y: mid, w: r, h: floor - mid },
  ];
  const panes: Pane[] = boxes.map((b, i) => {
    const inner = { x: b.x + inset, y: b.y + inset, w: b.w - 2 * inset, h: b.h - 2 * inset };
    return {
      slug: ROOM_ORDER[i].slug,
      name: ROOM_ORDER[i].name,
      x: b.x, y: b.y, w: b.w, h: b.h,
      d: b.d ?? rectPath(b.x, b.y, b.w, b.h),
      clip: b.clip ?? rectPath(inner.x, inner.y, inner.w, inner.h),
      inner,
    };
  });

  const sunR = Math.min(20, Math.max(9, r * 0.075));
  const rho = r - sunR * SUN_CLEARANCE;
  return { width, height, cx, r, top, spring, floor, left, right, inset, arch, lines, panes, sun: { cx, cy: spring - rho, r: sunR } };
}

/** The y of the arch line above x (the springing line outside the head). */
export function archYAt(g: Pick<HouseGeometry, "cx" | "r" | "spring">, x: number): number {
  return g.spring - Math.sqrt(Math.max(0, g.r * g.r - (x - g.cx) ** 2));
}

/**
 * The sun on the arch at the visitor's hour: clockT 0 is 11 AM (low left), 0.5 is 7 PM (the crown),
 * 1 is 3 AM (low right). It rides a circle concentric with the head, SUN_CLEARANCE radii inside the
 * arch line, and its lowest positions keep the rays above the springing line.
 */
export function sunOnArch(clockT: number, geometry: Pick<HouseGeometry, "spring" | "sun">): { cx: number; cy: number } {
  const t = Math.min(1, Math.max(0, Number.isFinite(clockT) ? clockT : 0.5));
  const { spring, sun } = geometry;
  const rho = spring - sun.cy;
  const alpha = Math.asin(Math.min(1, (sun.r * SUN_CLEARANCE) / rho));
  const theta = Math.PI + alpha + t * (Math.PI - 2 * alpha);
  return { cx: sun.cx + rho * Math.cos(theta), cy: spring + rho * Math.sin(theta) };
}

const circlePath = (cx: number, cy: number, r: number) =>
  `M${f(cx + r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 1 ${f(cx - r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 1 ${f(cx + r)} ${f(cy)}`;

/** The mark's sun around (0, 0): a circle and eight rays from 1.35 to 1.85 radii. */
export function sunGlyph(r: number): string[] {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return `M${f(Math.cos(a) * r * 1.35)} ${f(Math.sin(a) * r * 1.35)}L${f(Math.cos(a) * r * SUN_RAY_REACH)} ${f(Math.sin(a) * r * SUN_RAY_REACH)}`;
  });
  return [circlePath(0, 0, r), ...rays];
}

/** After dark the sun hangs as a lamp: a cord up to the arch line (cordTop, local y), a domed shade, a bulb. */
export function lampGlyph(r: number, cordTop: number): string[] {
  const shade = r * 1.05;
  return [
    `M0 ${f(Math.min(cordTop, -shade))}L0 ${f(-shade)}`,
    `M${f(-shade)} 0A${f(shade)} ${f(shade)} 0 0 1 ${f(shade)} 0Z`,
    circlePath(0, r * 0.42, r * 0.32),
  ];
}

/* -------------------------------------------------------------- vignettes */

/** The longest structure strokes touching the crop, kept in drawing order, without animation ids. */
export function vignetteStrokes(drawing: Drawing, crop: [number, number, number, number], max = VIGNETTE_MAX_STROKES): Stroke[] {
  const [x0, y0, x1, y1] = crop;
  const candidates = drawing.strokes
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s.layer === "structure")
    .filter(({ s }) => {
      const b = pathBounds(s.d);
      return b.x1 >= x0 && b.x0 <= x1 && b.y1 >= y0 && b.y0 <= y1;
    })
    .map((c) => ({ ...c, len: approxLength(c.s.d) }))
    .sort((a, b) => b.len - a.len)
    .slice(0, max);
  const keep = new Set(candidates.map((c) => c.i));
  return drawing.strokes.filter((_, i) => keep.has(i)).map(({ d, layer }) => ({ d, layer }));
}

/* ---------------------------------------------------------------- arrival */

/** The mark's arch in its 320 frame: centre (160, 160), span 210. */
const MARK_ARCH = { cx: 160, cy: 160, span: 210 };

/** Where the mark draws itself: centred in the stage at a legible 120 to 200 px span. */
export function markPlacement(g: Pick<HouseGeometry, "cx" | "left" | "right" | "top" | "floor">): { s: number; tx: number; ty: number } {
  const span = Math.min(200, Math.max(120, (g.right - g.left) * 0.42));
  const s = span / MARK_ARCH.span;
  return { s, tx: g.cx - MARK_ARCH.cx * s, ty: (g.top + g.floor) / 2 - MARK_ARCH.cy * s };
}

export type MarkGroup = "arch" | "dividers" | "sun" | "steam" | "plant" | "house";

/** The mark's strokes by what an architect draws first. Relies on markDrawing's ids and layers. */
export function markGroups(strokes: Stroke[]): Record<MarkGroup, number[]> {
  const g: Record<MarkGroup, number[]> = { arch: [], dividers: [], sun: [], steam: [], plant: [], house: [] };
  strokes.forEach((s, i) => {
    if (s.id === "mark-arch") g.arch.push(i);
    else if (s.id?.startsWith("mark-divider-")) g.dividers.push(i);
    else if (s.id?.startsWith("mark-steam-")) g.steam.push(i);
    else if (s.layer === "detail") g.sun.push(i); // window mullions, the sun and its rays
    else if (s.layer === "life") g.plant.push(i); // the plant and its three drops
    else g.house.push(i);
  });
  return g;
}

/** Seconds. Each group ends by 1.2 s: arch 0.5, dividers 0.74, sun 1.0, steam 1.06, plant 1.18, house 1.2. */
export const MARK_SCHEDULE: Record<MarkGroup, { at: number; duration: number; stagger: number }> = {
  arch: { at: 0, duration: 0.5, stagger: 0 },
  dividers: { at: 0.3, duration: 0.3, stagger: 0.07 },
  sun: { at: 0.5, duration: 0.3, stagger: 0.02 },
  steam: { at: 0.62, duration: 0.32, stagger: 0.06 },
  plant: { at: 0.72, duration: 0.28, stagger: 0.02 },
  house: { at: 0.82, duration: 0.3, stagger: 0.04 },
};

/**
 * After the draw: the arch and dividers morph into the house for 0.9 s while the rest of the mark
 * fades over 0.4 s. The six vignettes draw on from 1.6 s, 0.08 s apart, each over 0.38 s (their
 * first frames overlap the morph's soft landing). The sun fades in at 1.9 s. Everything ends at 2.38 s.
 */
export const ARRIVAL = { morphAt: 1.2, morph: 0.9, fadeAt: 1.2, fade: 0.4, vignettesAt: 1.6, vignetteStagger: 0.08, vignetteDraw: 0.38, sunAt: 1.9, sun: 0.4 } as const;

export function arrivalDuration(markStrokes: Stroke[], vignetteCount = ROOM_ORDER.length): number {
  const groups = markGroups(markStrokes);
  const markEnd = Math.max(...(Object.keys(MARK_SCHEDULE) as MarkGroup[]).map((k) => {
    const step = MARK_SCHEDULE[k];
    return step.at + step.duration + step.stagger * Math.max(0, groups[k].length - 1);
  }));
  return Math.max(
    markEnd,
    ARRIVAL.morphAt + ARRIVAL.morph,
    ARRIVAL.fadeAt + ARRIVAL.fade,
    ARRIVAL.vignettesAt + ARRIVAL.vignetteStagger * Math.max(0, vignetteCount - 1) + ARRIVAL.vignetteDraw,
    ARRIVAL.sunAt + ARRIVAL.sun,
  );
}

/** Why the arrival will not play: reduced motion, already seen in this tab, or the page opened scrolled. */
export function arrivalSkipReason(o: { spent: boolean; motion: boolean; scrolled: boolean }): "reduced" | "repeat" | "scrolled" | null {
  if (!o.motion) return "reduced";
  if (o.spent) return "repeat";
  if (o.scrolled) return "scrolled";
  return null;
}
```

`components/house/House.tsx`:

```tsx
import { drawingFor } from "@/drawings";
import { markDrawing } from "@/drawings/mark";
import { ROOM_ORDER, VIGNETTES, vignetteStrokes } from "@/lib/house";
import { HouseCanvas, type VignetteData } from "./HouseCanvas";
import "./house.css";

/**
 * The home page's house. The vignette strokes and the mark are chosen here, on the server, so the
 * room drawing modules, zod and drawings.json never ship to the browser: the client gets path strings.
 */
export function House({ arrival = false }: { arrival?: boolean }) {
  const vignettes: VignetteData[] = ROOM_ORDER.map((room) => ({
    slug: room.slug,
    crop: VIGNETTES[room.slug],
    paths: vignetteStrokes(drawingFor(room.drawing), VIGNETTES[room.slug]).map((s) => s.d),
  }));
  const mark = markDrawing().strokes.map(({ d, layer, id }) => (id ? { d, layer, id } : { d, layer }));
  return <HouseCanvas arrival={arrival} vignettes={vignettes} mark={mark} />;
}
```

`components/house/HouseCanvas.tsx`. MorphSVG usage was checked against gsap 3.15.0:
- `types/morph-svg-plugin.d.ts` defines `MorphSVGVars { shape; type?; origin?; shapeIndex?; precompile?; map?; render?; updateTarget? }`, and `shape` accepts raw path data.
- `dist/MorphSVGPlugin.js` treats both paths as open when the start path and the end path differ in closedness. That is why the house arch path ends in `Z`, exactly like `ARCH_PATH`.
- Both arches have the same command sequence (`M L A L Z`). With `shapeIndex: 0`, every point travels to its partner, so the head stays a true semicircle throughout the morph.

```tsx
"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLight } from "@/components/light/LightProvider";
import { roomWord } from "@/lib/cafe";
import type { Stroke } from "@/lib/draw/types";
import {
  ARRIVAL, FALLBACK_SIZE, MARK_SCHEDULE, archYAt, arrivalSkipReason, houseGeometry, lampGlyph, markGroups, markPlacement,
  scalePath, sunGlyph, sunOnArch, type MarkGroup, type RoomSlug,
} from "@/lib/house";
import { loadGsap, motionAllowed } from "@/lib/motion/gsap";

export interface VignetteData { slug: RoomSlug; crop: [number, number, number, number]; paths: string[] }

type Phase = "pending" | "running" | "done";
type Reason = "complete" | "interrupted" | "reduced" | "repeat" | "scrolled";

/** Module scope: survives client-side navigation in this tab, resets on a hard load. Nothing is stored. */
let arrivalSpent = false;

const SKIP_EVENTS = ["scroll", "wheel", "keydown", "touchstart"] as const;

const viewBoxOf = (c: [number, number, number, number]) => `${c[0]} ${c[1]} ${c[2] - c[0]} ${c[3] - c[1]}`;

export function HouseCanvas({ arrival, vignettes, mark }: { arrival: boolean; vignettes: VignetteData[]; mark: Stroke[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [size, setSize] = useState(FALLBACK_SIZE);
  const [measured, setMeasured] = useState(false);
  const [phase, setPhase] = useState<Phase>(arrival ? "pending" : "done");
  const [reason, setReason] = useState<Reason | null>(null);
  const interrupt = useRef<(() => void) | null>(null);
  const { state } = useLight();

  const geo = useMemo(() => houseGeometry(size.width, size.height), [size]);
  const groups = useMemo(() => markGroups(mark), [mark]);
  const placed = useMemo(() => {
    const { s, tx, ty } = markPlacement(geo);
    return mark.map((stroke) => ({ ...stroke, d: scalePath(stroke.d, s, tx, ty) }));
  }, [geo, mark]);
  const placedRef = useRef(placed);
  placedRef.current = placed;
  const groupsRef = useRef(groups);
  groupsRef.current = groups;

  // Measure the stage before first paint; a later resize finishes a running arrival, then redraws the house.
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let last = { width: 0, height: 0 };
    const read = () => {
      const width = Math.round(el.clientWidth);
      const height = Math.round(el.clientHeight);
      if (width <= 0 || height <= 0 || (width === last.width && height === last.height)) return;
      if (last.width) interrupt.current?.();
      last = { width, height };
      setSize({ width, height });
      setMeasured(true);
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!arrival || !measured) return;
    const svg = svgRef.current;
    if (!svg) return;
    const skip = arrivalSkipReason({ spent: arrivalSpent, motion: motionAllowed(), scrolled: window.scrollY > 4 });
    if (skip) {
      arrivalSpent = true;
      setReason(skip);
      setPhase("done");
      return;
    }

    let cancelled = false;
    let kill: (() => void) | null = null;
    const onInput = () => finish("interrupted");
    const unlisten = () => SKIP_EVENTS.forEach((type) => window.removeEventListener(type, onInput));
    // Until GSAP arrives, finishing just shows the house.
    let finish = (why: Reason) => {
      if (cancelled) return;
      cancelled = true;
      arrivalSpent = true;
      unlisten();
      setReason(why);
      setPhase("done");
    };
    SKIP_EVENTS.forEach((type) => window.addEventListener(type, onInput, { passive: true }));
    interrupt.current = () => finish("interrupted");

    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const archEl = svg.querySelector<SVGPathElement>('[data-stroke="house-arch"]');
      const found = [0, 1, 2].map((k) => svg.querySelector<SVGPathElement>(`[data-stroke="house-line-${k}"]`));
      const markGroup = svg.querySelector<SVGGElement>(".house-mark");
      if (!archEl || found.some((el) => !el) || !markGroup) { finish("complete"); return; }
      arrivalSpent = true;
      const lines = found as SVGPathElement[];
      const pl = placedRef.current;
      const gr = groupsRef.current;
      const finalArch = archEl.getAttribute("d") ?? "";
      const finalLines = lines.map((el) => el.getAttribute("d") ?? "");
      const elFor = (i: number): SVGPathElement | null => {
        if (gr.arch[0] === i) return archEl;
        const k = gr.dividers.indexOf(i);
        return k >= 0 ? lines[k] : markGroup.querySelector<SVGPathElement>(`[data-i="${i}"]`);
      };
      const arts = Array.from(svg.querySelectorAll<SVGGElement>(".house-pane-art"));
      const vignettePaths = arts.map((g) => Array.from(g.querySelectorAll<SVGPathElement>(".house-vignette path")));
      const labels = arts.map((g) => g.querySelector<SVGTextElement>(".house-label"));
      const sunSlot = svg.querySelector<SVGGElement>(".house-sun-slot");
      const markPaths = pl.map((_, i) => elFor(i)).filter((el): el is SVGPathElement => el !== null);
      const faded = [...labels.filter((el): el is SVGTextElement => el !== null), ...(sunSlot ? [sunSlot] : [])];

      // Start from the mark: the house's own arch and lines take the mark's arch and dividers.
      archEl.setAttribute("d", pl[gr.arch[0]].d);
      gr.dividers.forEach((i, k) => lines[k].setAttribute("d", pl[i].d));
      gsap.set([...markPaths, ...vignettePaths.flat()], { drawSVG: "0%" });
      gsap.set(faded, { opacity: 0 });

      const tl = gsap.timeline({ onComplete: () => finish("complete") });
      (Object.keys(MARK_SCHEDULE) as MarkGroup[]).forEach((key) => {
        const step = MARK_SCHEDULE[key];
        const targets = gr[key].map(elFor).filter((el): el is SVGPathElement => el !== null);
        tl.to(targets, { drawSVG: "100%", duration: step.duration, stagger: step.stagger, ease: "pen" }, step.at);
      });
      // Lengths change as the paths morph, so the dashes go first.
      tl.set([archEl, ...lines], { clearProps: "strokeDasharray,strokeDashoffset" }, ARRIVAL.morphAt);
      tl.to(archEl, { morphSVG: { shape: finalArch, shapeIndex: 0 }, duration: ARRIVAL.morph, ease: "pen" }, ARRIVAL.morphAt);
      lines.forEach((el, k) => tl.to(el, { morphSVG: { shape: finalLines[k], shapeIndex: 0 }, duration: ARRIVAL.morph, ease: "pen" }, ARRIVAL.morphAt));
      tl.to(markGroup, { opacity: 0, duration: ARRIVAL.fade, ease: "power1.out" }, ARRIVAL.fadeAt);
      arts.forEach((_, i) => {
        const at = ARRIVAL.vignettesAt + i * ARRIVAL.vignetteStagger;
        tl.to(vignettePaths[i], { drawSVG: "100%", duration: ARRIVAL.vignetteDraw, ease: "pen" }, at);
        const label = labels[i];
        if (label) tl.to(label, { opacity: 1, duration: ARRIVAL.vignetteDraw, ease: "power1.out" }, at);
      });
      if (sunSlot) tl.to(sunSlot, { opacity: 1, duration: ARRIVAL.sun, ease: "power1.out" }, ARRIVAL.sunAt);
      svg.setAttribute("data-arrival-duration", tl.duration().toFixed(3));

      kill = () => tl.kill();
      finish = (why: Reason) => {
        if (cancelled) return;
        cancelled = true;
        unlisten();
        tl.kill();
        gsap.set([...markPaths, ...vignettePaths.flat(), archEl, ...lines], { clearProps: "strokeDasharray,strokeDashoffset" });
        gsap.set(faded, { clearProps: "opacity" });
        archEl.setAttribute("d", finalArch);
        lines.forEach((el, k) => el.setAttribute("d", finalLines[k]));
        setReason(why);
        setPhase("done");
      };
      setPhase("running");
    });

    return () => {
      cancelled = true;
      unlisten();
      kill?.();
      interrupt.current = null;
    };
  }, [arrival, measured]);

  const sunPos = state ? sunOnArch(state.clockT, geo) : null;

  return (
    <div ref={stageRef} className="house-stage">
      <svg
        ref={svgRef}
        className="house"
        viewBox={`0 0 ${size.width} ${size.height}`}
        role="group"
        aria-label={`The house, drawn as ${roomWord} rooms`}
        data-arrival={phase}
        data-arrival-reason={reason ?? undefined}
      >
        <defs>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0" style={{ stopColor: "var(--lamp)", stopOpacity: 0.55 }} />
            <stop offset="1" style={{ stopColor: "var(--lamp)", stopOpacity: 0 }} />
          </radialGradient>
          {geo.panes.map((pane, i) => (
            <clipPath key={pane.slug} id={`${uid}-clip-${i}`}>
              <path d={pane.clip} />
            </clipPath>
          ))}
        </defs>

        <g className="house-final">
          {geo.panes.map((pane, i) => {
            const v = vignettes[i];
            return (
              <a key={pane.slug} href={`/spaces#${pane.slug}`} aria-label={pane.name} className="house-pane" data-slug={pane.slug}>
                <path className="house-hit" d={pane.d} />
                <g className="house-pane-art" clipPath={`url(#${uid}-clip-${i})`}>
                  <svg
                    className="house-vignette"
                    x={pane.inner.x}
                    y={pane.inner.y}
                    width={pane.inner.w}
                    height={pane.inner.h}
                    viewBox={viewBoxOf(v.crop)}
                    preserveAspectRatio="xMidYMid slice"
                    aria-hidden="true"
                  >
                    {v.paths.map((d, k) => <path key={k} className="ln" d={d} />)}
                  </svg>
                  <text className="house-label" x={pane.inner.x + 6} y={pane.inner.y + pane.inner.h - 6} aria-hidden="true">{pane.name}</text>
                </g>
                <path className="house-focus" d={pane.clip} />
              </a>
            );
          })}
          <path className="ln" data-stroke="house-arch" d={geo.arch} />
          {geo.lines.map((d, k) => <path key={k} className="ln" data-stroke={`house-line-${k}`} d={d} />)}
          <g className="house-sun-slot" aria-hidden="true">
            {sunPos ? (
              <g className="house-sun" transform={`translate(${sunPos.cx.toFixed(2)} ${sunPos.cy.toFixed(2)})`}>
                <g className="house-sun-day">
                  <circle className="house-sun-ground" r={geo.sun.r * 1.95} />
                  {sunGlyph(geo.sun.r).map((d, k) => <path key={k} className="ln" d={d} />)}
                </g>
                <g className="house-sun-night">
                  <circle className="house-lamp-glow" cy={geo.sun.r * 0.4} r={geo.sun.r * 5} fill={`url(#${uid}-glow)`} />
                  <circle className="house-sun-ground" cy={geo.sun.r * 0.1} r={geo.sun.r * 1.25} />
                  {lampGlyph(geo.sun.r, archYAt(geo, sunPos.cx) - sunPos.cy).map((d, k) => <path key={k} className="ln" d={d} />)}
                </g>
              </g>
            ) : null}
          </g>
        </g>

        {arrival && phase !== "done" ? (
          <g className="house-mark" aria-hidden="true">
            {placed.map((s, i) =>
              groups.arch.includes(i) || groups.dividers.includes(i) ? null : <path key={i} className="ln" data-i={i} data-stroke={s.id} d={s.d} />,
            )}
          </g>
        ) : null}
      </svg>
    </div>
  );
}
```

`components/house/house.css`:

```css
/* The stage is full-bleed: houseGeometry applies the gutters itself. Its height is set here, so measuring it never shifts the layout. */
.house-stage { position: relative; width: 100%; height: clamp(26rem, calc(100svh - 13rem), 58rem); }
.house { display: block; width: 100%; height: 100%; overflow: visible; }

.house .ln { fill: none; stroke: var(--ink); stroke-width: var(--line-w); stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }

.house-pane { cursor: pointer; }
.house-pane:focus { outline: none; }
.house-hit { fill: transparent; stroke: none; pointer-events: all; }
.house-focus { fill: none; stroke: transparent; stroke-width: 2px; vector-effect: non-scaling-stroke; transition: stroke 300ms var(--ease-pen); }
.house-pane:hover .house-focus { stroke: var(--hair); }
.house-pane:focus-visible .house-focus { stroke: var(--pen); }

/* Room names knocked out of the line, as on a drawing sheet. */
.house-label { font-family: var(--font-display); font-weight: 480; font-size: 13px; fill: var(--ink-2); paint-order: stroke; stroke: var(--paper); stroke-width: 4px; stroke-linejoin: round; }
@media (min-width: 64rem) { .house-label { font-size: 14px; } }

/* The sun breaks the lines beneath it; after dark it is a lamp with a glow. */
.house-sun-ground { fill: var(--paper); stroke: none; }
.house-sun-night { display: none; }
html[data-regime="night"] .house-sun-day { display: none; }
html[data-regime="night"] .house-sun-night { display: inline; }
.house-lamp-glow { stroke: none; opacity: calc(var(--glow) * 0.9); transition: opacity 600ms var(--ease-pen); }

/* Arrival: nothing shows until the timeline has set the first frame. Without JavaScript data-motion is absent and the house is simply there. */
html[data-motion="on"] .house[data-arrival="pending"] .house-final { visibility: hidden; animation: pen-fallback 0s 2.5s forwards; }
.house[data-arrival="pending"] .house-mark { visibility: hidden; }
```

`app/page.tsx` (still temporary; Task 17 replaces it):

```tsx
import { House } from "@/components/house/House";

export default function Home() {
  return (
    <>
      <House arrival />
      <section className="wrap" style={{ paddingBlock: "3rem 20svh" }}>
        <h1 className="t-display">Stay a little longer.</h1>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- house`
Expected: `tests/house.test.ts` PASS, 31 tests.
If a test fails, here is where to look:
- `shows enough of each room's structure` names a room: move that entry in `VIGNETTES` toward the drawing's structure strokes (see `review/<drawing>-drawing.png`). Keep the aspect ratio between 0.75 and 1.35.
- A geometry test fails: fix `lib/house.ts`, never the test. The test values are derived by hand in this task.

Run: stop any server on 3022, `npm run build`, `npx next start -p 3022` (second terminal), then `node scripts/e2e/arrival.mjs && node scripts/e2e/shell.mjs`
Expected: every line `ok`, then `all checks passed` twice.
If the arrival never reaches `running`, confirm that `html[data-motion]` is `on` and that `loadGsap` resolves in the browser console. If the head kinks during the morph, confirm that both arch paths end in `Z` and that `shapeIndex: 0` is passed.

- [ ] **Step 5: Look**

Use Playwright MCP against `http://localhost:3022`. To catch frames of the arrival, run `browser_run_code_unsafe` with:

```js
async (page) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3022/?at=14:00", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('svg.house[data-arrival="running"]');
  for (const ms of [300, 700, 700, 300, 1000]) { await page.waitForTimeout(ms); await page.screenshot({ path: `shots/look-arrival-${Date.now()}.png` }); }
}
```

Read every shot in time order, then repeat the run at 1440x900, and again with `?at=01:00`. Checklist:
- [ ] At 0.3 s only the arch is drawing: centred in the stage, 120 to 200 px across, ink on paper.
- [ ] At 1.0 s the mark reads as the logo (compare `assets/brand/logo barnyard.jpg`): sun in its window, steam, plant under three drops, the house with its door.
- [ ] At about 1.7 s the arch is widening and the head is still a true semicircle, with no kink or twist. The dividers are stretching, the rest of the mark has faded, and the first vignettes are drawing.
- [ ] Finished at 390 day:
  - The arch runs from gutter to gutter, with its apex just under the header.
  - The top two panes are quarter circles.
  - Each vignette is recognisable at a glance: the entry's strips and stair, the main floor's stair diagonal and railing, the mezzanine's tall windows, the courtyard's table and two chairs, the games table, and the BOWL letters beside the pin.
  - Labels are legible and knocked out of the lines.
  - The sun sits left of the crown, and its rays touch neither the arch nor the springing line.
  - Every line has one weight.
  - The heading is visible below the house.
- [ ] Finished at 390, 01:00: the night palette. A lamp hangs right of the crown, its cord meets the arch line, and a warm glow sits under the shade. No sun.
- [ ] Finished at 1440x900: the arch is centred and capped by the height (about 520 px wide), labels are at 14 px, nothing overflows.
- [ ] Press Tab until a pane is focused: a corten outline follows the pane's own shape, including the arc on the top two.
- [ ] Emulate reduced motion (`await page.emulateMedia({ reducedMotion: "reduce" })`, then reload): the finished house appears at once, and nothing draws.
- [ ] If the main floor's stair head is lost under the arch, change `VIGNETTES["main-floor"]` to `[250, 0, 875, 625]`. If any vignette reads as noise at 390, tighten its crop around the object named in its comment, keeping the aspect ratio between 0.75 and 1.35. Rerun `npm test -- house` and look again.

- [ ] **Step 6: Commit**

```bash
git add lib/house.ts components/house/House.tsx components/house/HouseCanvas.tsx components/house/house.css app/page.tsx tests/house.test.ts scripts/e2e/arrival.mjs
git commit -m "feat: the logo draws itself and opens into the house of six rooms"
```

---

### Task 17: Home page

The home page runs in this order:
1. The house, from Task 16.
2. Under the arch: the name, one line in the house's voice, whether it is open by its own clock, and one WhatsApp action.
3. The two magazine quotes, each beside the drawing of the room it describes; the drawings draw on with scroll.
4. Four arched doors built from the mark's own door, each opening in line and carrying one proof line.
5. A section that is always night.
6. The facade with the address and the ways to get in touch.
7. A footer on every page.

Every fact comes from `cafe.json`.

**Files:**
- Create: `app/page.tsx` (replaces the temporary page)
- Create: `components/home/UnderArch.tsx`, `components/home/WrittenAbout.tsx`, `components/home/Doors.tsx` (client), `components/home/AfterDark.tsx`, `components/home/VisitBlock.tsx`, `components/home/home.css`
- Create: `components/chrome/SiteFooter.tsx` (client, because `NAV` lives in the client module `SiteHeader.tsx`)
- Modify: `app/layout.tsx` (adds `<SiteFooter />` after `<main>`; the metadata stays as it is)
- Modify: `app/globals.css` (appends the `.night-scope` token block and the footer styles)
- Test: `scripts/e2e/home.mjs`

**Interfaces:**
- Consumes:
  - `cafe`, `fact`, `addressLines`, `eventDate`, `mapsHref`, `phoneHref`, `pressDate`, `whatsappHref`, `whatsappWith` (`lib/cafe.ts`, Task 1)
  - `formatClock` (`lib/daylight.ts`, Task 1); `HOUSE_PATHS` (`lib/mark.ts`, Task 1)
  - `brush`, `jar`, `laptop`, `pin` (`lib/draw/glyphs.ts`, Task 2)
  - `OpenNow`, `Mark`, `NAV`, `LightProvider`, `LightScript`, `SiteHeader` and the Task 5 type and button classes
  - `motionAllowed` (`lib/motion/gsap.ts`, Task 6)
  - `<Sheet id mode? title? caption? className? />` (`components/draw/Sheet.tsx`, Task 14; renders `figure.sheet`)
  - `<House arrival />` and `scalePath` (Task 16)
  - `open`, `launch`, `assert`, `report`, `shot` (`scripts/e2e/lib.mjs`)
- Produces:
  - `<UnderArch />` (`section.under-arch`, the page's only `h1`)
  - `<WrittenAbout />` (`section.written`)
  - `<Doors />` (`section.doors` with four `a.door`, each containing `svg.door-drawing`, `.door-leaf`, `.door-leaf-open`, `h3.door-title`, `p.door-proof`)
  - `<AfterDark />` (`section.after-dark.night-scope`)
  - `<VisitBlock />` (`section.visit-block`)
  - `<SiteFooter />` (`footer.site-footer` with `nav[aria-label="Footer"]`)
  - The CSS class `.night-scope`: it redefines `--paper --ink --ink-2 --pen --hair --glow` to the night values for its subtree, whatever `html[data-regime]` says. Later pages may use it.

- [ ] **Step 1: Write the failing check**

`scripts/e2e/home.mjs`:

```js
// The home page. Run against production (npx next start -p 3022): node scripts/e2e/home.mjs
import fs from "node:fs";
import { assert, launch, open, report, shot } from "./lib.mjs";

const cafe = JSON.parse(fs.readFileSync("content/cafe.json", "utf8"));
const ad = cafe.press.find((p) => p.publication === "Architectural Digest India");
const elle = cafe.press.find((p) => p.publication === "ELLE Decor India");
const FLAGGED = /welcome to|unforgettable|journey|immersive|whimsical|\bexperience\b|UNKNOWN|CONFIRM/i;
const NIGHT_GROUND = "rgb(23, 25, 28)";
const CREDIT = "Every drawing is made from the café's own photographs; each photograph is credited where it appears.";

const browser = await launch();
for (const [width, height] of [[390, 844], [1440, 900]]) {
  for (const at of ["14:00", "01:00"]) {
    const tag = `${width}-${at === "14:00" ? "day" : "night"}`;
    const { page, ctx, errors } = await open(browser, "/", { width, height, at });
    await page.waitForSelector('svg.house[data-arrival="done"]', { state: "attached", timeout: 9000 });

    const h1 = await page.$$eval("h1", (els) => els.map((e) => ({ text: e.textContent.trim(), bottom: e.getBoundingClientRect().bottom })));
    assert(h1.length === 1 && h1[0].text === cafe.meta.name, `${tag}: one h1, the café's name (${h1.map((h) => h.text).join(" | ")})`);
    assert(h1.length === 1 && h1[0].bottom <= height, `${tag}: the name sits in the first screen (bottom ${h1[0] ? Math.round(h1[0].bottom) : "n/a"} of ${height})`);
    const levels = await page.$$eval("main h1, main h2, main h3, main h4", (els) => els.map((e) => Number(e.tagName[1])));
    assert(levels.every((l, i) => i === 0 || l <= levels[i - 1] + 1), `${tag}: headings never skip a level (${levels.join(" ")})`);

    const bg = await page.locator("section.after-dark").evaluate((e) => getComputedStyle(e).backgroundColor);
    assert(bg === NIGHT_GROUND, `${tag}: after dark is always night (${bg})`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${tag}: no sideways scroll`);

    if (tag === "390-day") {
      const wa = await page.locator(".under-arch a.btn-primary").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
      assert(wa.length === 1 && wa[0].startsWith(`https://wa.me/${cafe.meta.phone.replace(/\D/g, "")}?text=`), `one primary WhatsApp action under the arch (${wa.join(" ")})`);
      const under = await page.locator(".under-arch").innerText();
      assert(/Open now|Opens at|Open 11 AM to 3 AM/.test(under), "open-now line under the arch");
      assert(under.includes("11 AM to 3 AM"), "hours under the arch");

      const written = await page.locator("section.written").innerText();
      assert(written.includes(ad.quote) && written.includes("22 Nov 2024") && written.includes(ad.quoteBy), "the AD India quote, attributed and dated");
      assert(written.includes(elle.quote) && written.includes("10 Jun 2025") && written.includes(elle.quoteBy), "the ELLE Decor India quote, attributed and dated");
      const writtenLinks = await page.locator("section.written a").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
      assert([ad.link, elle.link, "/press"].every((h) => writtenLinks.includes(h)), `both pieces and the press page are linked (${writtenLinks.join(" ")})`);
      assert((await page.locator("section.written figure.sheet").count()) === 2, "each quote sits beside its drawing");

      const doors = await page.locator("a.door").evaluateAll((els) => els.map((e) => ({ href: e.getAttribute("href"), text: e.innerText })));
      assert(JSON.stringify(doors.map((d) => d.href)) === JSON.stringify(["/host", "/shoot", "/bowl", "/spaces#mezzanine"]), `four doors: host, shoot, bowl, work late (${doors.map((d) => d.href).join(" ")})`);
      const doorText = doors.map((d) => d.text).join("\n");
      for (const proof of ["Coffee Garba, 6 Sep 2025", "A hoodie painting workshop, 18 Dec 2025", "NoCatch shot their launch film here, 25 Nov 2025", "Recently opened.", "Open until 3 AM."]) {
        assert(doorText.includes(proof), `door proof: ${proof}`);
      }
      assert((await page.locator("a.door svg.door-drawing").count()) === 4, "every door is drawn");

      assert((await page.locator("section.after-dark figure.sheet").count()) === 1, "the mezzanine at night is drawn after dark");
      assert((await page.locator("section.after-dark").innerText()).includes("The nights here are softer."), "the after-dark line");

      const visit = await page.locator("section.visit-block").innerText();
      const visitLinks = await page.locator("section.visit-block a").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
      assert(visit.includes(cafe.meta.address.line1) && visit.includes(cafe.meta.address.postalCode), "the address in full");
      assert(visitLinks.some((h) => h === `tel:${cafe.meta.phone}`) && visitLinks.some((h) => h.startsWith("https://www.google.com/maps/")) && visitLinks.some((h) => h.startsWith("https://wa.me/")), "call, directions and WhatsApp");
      assert((await page.locator("section.visit-block figure.sheet").count()) === 1, "the facade is drawn");

      const footer = await page.locator("footer.site-footer").innerText();
      assert(footer.includes(CREDIT), "the footer's credit line");
      assert(footer.includes(cafe.meta.phoneDisplay) && footer.includes(cafe.meta.instagramHandle) && footer.includes(cafe.meta.address.line2), "the footer's address, phone and Instagram");
      assert((await page.locator('footer.site-footer nav[aria-label="Footer"] a').count()) === 7, "the footer lists every page");

      const body = await page.locator("body").innerText();
      const flagged = body.match(FLAGGED);
      assert(!flagged, `no flagged values or banned words (${flagged ? flagged[0] : "none"})`);
    }

    if (width === 1440 && at === "14:00") {
      const door = page.locator("a.door").first();
      await door.scrollIntoViewIfNeeded();
      await door.hover();
      await page.waitForTimeout(1100);
      const scaleX = await door.locator(".door-leaf").evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a);
      assert(Math.abs(scaleX - 0.3) < 0.02, `the door leaf swings open on hover (scaleX ${scaleX.toFixed(2)})`);
      await shot(page, "home-1440-door-open");
      await page.mouse.move(0, 0);
    }

    await page.waitForTimeout(2600);
    await shot(page, `home-${tag}`, true);
    const real = errors.filter((e) => !/404|Failed to load resource/.test(e));
    assert(real.length === 0, `${tag}: no console errors (${real.join(" | ")})`);
    await ctx.close();
  }
}
await browser.close();
report();
```

The console filter ignores 404s because `/host`, `/shoot`, `/bowl` and `/spaces` only exist from Tasks 18 to 20, and Next prefetches the door links.

- [ ] **Step 2: Run it to verify it fails**

Run: stop any server on 3022, `npm run build`, `npx next start -p 3022` (second terminal), then `node scripts/e2e/home.mjs`
Expected:
- `FAIL 390-day: one h1, the café's name (Stay a little longer.)`
- then the script stops with `locator.evaluate: Timeout 30000ms exceeded` waiting for `section.after-dark`
- exit code 1

- [ ] **Step 3: Implement**

`components/home/UnderArch.tsx`:

```tsx
import { OpenNow } from "@/components/light/OpenNow";
import { cafe, whatsappWith } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";

/** Under the arch: the name (the page's LCP), one line in the house's voice, its hours by its own clock, one way to reach it. */
export function UnderArch() {
  const { meta } = cafe;
  return (
    <section className="under-arch wrap" aria-labelledby="home-title">
      <h1 id="home-title" className="t-display">{meta.name}</h1>
      <p className="t-line">Come in for a coffee, and stay until the lamps come on.</p>
      <p className="under-arch-facts t-label num">
        <span className="under-arch-now"><OpenNow open={meta.hours.open} close={meta.hours.close} /></span>
        <span>Hours {formatClock(meta.hours.open)} to {formatClock(meta.hours.close)}</span>
        <span>{meta.address.area}, {meta.city}</span>
      </p>
      <a className="btn btn-primary" href={whatsappWith(`Hi, I'd like to come by ${meta.name}`)}>
        Message the house on WhatsApp
      </a>
    </section>
  );
}
```

(`meta.name` already ends with a full stop, so the message reads "Hi, I'd like to come by The Barnyard Co.")

`components/home/WrittenAbout.tsx`:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { Sheet } from "@/components/draw/Sheet";
import { cafe, pressDate } from "@/lib/cafe";

interface PressPiece { publication: string; date: string; link: string; linkType: string; quote?: string; quoteBy?: string }
type Quoted = PressPiece & { quote: string; quoteBy: string };

const press = cafe.press as PressPiece[];

function quoted(publication: string): Quoted {
  const piece = press.find((p) => p.publication === publication);
  if (!piece?.quote || !piece.quoteBy) throw new Error(`content/cafe.json has no quote from ${publication}`);
  return piece as Quoted;
}

/** Say honestly where the link goes: the article itself, or the café's post announcing it. */
const linkLabel = (p: PressPiece) => (p.linkType === "article" ? `Read it in ${p.publication}` : `${p.publication}, as announced on Instagram`);

const listOf = (names: string[]) => (names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`);

function Quote({ piece, sheet, flip = false }: { piece: Quoted; sheet: ReactNode; flip?: boolean }) {
  return (
    <div className="written-piece" data-flip={flip ? "" : undefined}>
      <div className="written-sheet">{sheet}</div>
      <figure className="written-quote">
        <blockquote className="t-quote" cite={piece.link}>
          <p>“{piece.quote}”</p>
        </blockquote>
        <figcaption className="t-label">
          {piece.quoteBy}, <time dateTime={piece.date}>{pressDate(piece.date)}</time>.{" "}
          <a className="pen-link" href={piece.link}>{linkLabel(piece)}</a>
        </figcaption>
      </figure>
    </div>
  );
}

/** The two quotes beside the rooms they describe: the stair against the tall windows, and the fruit-crate strips overhead. */
export function WrittenAbout() {
  const ad = quoted("Architectural Digest India");
  const elle = quoted("ELLE Decor India");
  const others = press.filter((p) => p !== ad && p !== elle).map((p) => p.publication);
  return (
    <section className="written wrap" aria-labelledby="written-title">
      <h2 id="written-title" className="t-head">Written about</h2>
      <Quote piece={ad} sheet={<Sheet id="mezzanine-stair" mode="scrub" />} />
      <Quote piece={elle} sheet={<Sheet id="entry" mode="scrub" />} flip />
      <p className="t-body written-more">
        {listOf(others)} have written about the house too.{" "}
        <Link className="pen-link" href="/press">Everything written about it</Link>
      </p>
    </section>
  );
}
```

`components/home/Doors.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { cafe, eventDate } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";
import { brush, jar, laptop, pin } from "@/lib/draw/glyphs";
import { scalePath } from "@/lib/house";
import { HOUSE_PATHS } from "@/lib/mark";
import { motionAllowed } from "@/lib/motion/gsap";

/**
 * The mark's arched door (HOUSE_PATHS[2]: centre x 213, floor 265, span 26, apex 225), scaled into a
 * 120 x 150 sheet. The frame is the door at 3x; the leaf is the same door at 2.7x, closed along the
 * floor and filled with paper so it hides what is inside until it swings open on its left hinge.
 */
const DOOR = HOUSE_PATHS[2];
const FRAME = scalePath(DOOR, 3, 60 - 213 * 3, 138 - 265 * 3);
const LEAF = scalePath(`${DOOR} Z`, 2.7, 60 - 213 * 2.7, 138 - 265 * 2.7);
const THRESHOLD = "M8 138L112 138";
const KNOB = "M87.8 96A1.8 1.8 0 1 1 84.2 96A1.8 1.8 0 1 1 87.8 96";
const HINGE_X = 60 - 13 * 2.7; // 24.9, the leaf's left edge
const OPEN = 0.3; // the leaf's width when open, seen edge-on

function eventBy(slug: string) {
  const event = cafe.events.find((e) => e.slug === slug);
  if (!event) throw new Error(`content/cafe.json has no event "${slug}"`);
  return event;
}
function nameOfUse(slug: string) {
  const use = cafe.uses.find((u) => u.slug === slug);
  if (!use) throw new Error(`content/cafe.json has no use "${slug}"`);
  return use.name;
}

const garba = eventBy("coffee-garba");
const hoodie = eventBy("hoodie-workshop");
const nocatch = eventBy("nocatch");
const bowling = cafe.spaces.find((s) => s.slug === "bowling");
if (!bowling) throw new Error("content/cafe.json has no bowling space");

interface Door { href: string; title: string; proof: string; inside: string[] }

/** What is behind each door is drawn only from documented things: the workshop's jar and brush, a viewfinder, the alley's pin, a laptop. */
const DOORS: Door[] = [
  {
    href: "/host",
    title: nameOfUse("host"),
    proof: `${garba.name}, ${eventDate(garba.date)}. A ${hoodie.name.toLowerCase()}, ${eventDate(hoodie.date)}.`,
    inside: [...jar(44, 88, 30, 44), ...brush([62, 96], [80, 58])].map((s) => s.d),
  },
  {
    href: "/shoot",
    title: nameOfUse("shoot"),
    proof: `${nocatch.name.replace(/ brand film$/, "")} shot their launch film here, ${eventDate(nocatch.date)}.`,
    inside: ["M36 70L36 60L46 60", "M74 60L84 60L84 70", "M84 110L84 120L74 120", "M46 120L36 120L36 110"],
  },
  {
    href: "/bowl",
    title: nameOfUse("bowl"),
    proof: `${bowling.description.split(".")[0]}.`,
    inside: pin([60, 132], 80).map((s) => s.d),
  },
  {
    href: "/spaces#mezzanine",
    title: nameOfUse("work"),
    proof: `Open until ${formatClock(cafe.meta.hours.close)}.`,
    inside: laptop(34, 100, 52, 32).map((s) => s.d),
  },
];

function Leaf() {
  return (
    <>
      <path className="door-leaf-face" d={LEAF} />
      <path d={KNOB} />
    </>
  );
}

function DoorCard({ door }: { door: Door }) {
  const router = useRouter();
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <li>
      <Link
        ref={ref}
        href={door.href}
        className="door"
        onNavigate={(e) => {
          const a = ref.current;
          // With a mouse or keyboard the door is already open (hover, focus). On touch, let it swing before leaving.
          if (!a || !motionAllowed() || matchMedia("(hover: hover)").matches || a.hasAttribute("data-open")) return;
          e.preventDefault();
          a.setAttribute("data-open", "");
          window.setTimeout(() => router.push(door.href), 450);
        }}
      >
        <svg className="door-drawing" viewBox="0 0 120 150" aria-hidden="true">
          <g className="door-inside">{door.inside.map((d, i) => <path key={i} d={d} />)}</g>
          <path d={THRESHOLD} />
          <path d={FRAME} />
          <g className="door-leaf"><Leaf /></g>
          <g className="door-leaf-open" transform={`matrix(${OPEN} 0 0 1 ${(HINGE_X * (1 - OPEN)).toFixed(2)} 0)`}><Leaf /></g>
        </svg>
        <h3 className="door-title">{door.title}</h3>
        <p className="t-body door-proof">{door.proof}</p>
      </Link>
    </li>
  );
}

/** Four ways to borrow the house, as four doors drawn from the mark's own. */
export function Doors() {
  return (
    <section className="doors wrap" aria-labelledby="doors-title">
      <h2 id="doors-title" className="t-head">Four ways to borrow the house</h2>
      <ul className="doors-list">
        {DOORS.map((door) => <DoorCard key={door.href} door={door} />)}
      </ul>
    </section>
  );
}
```

`components/home/AfterDark.tsx`:

```tsx
import { Sheet } from "@/components/draw/Sheet";
import { cafe } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";

/** Always night, whatever the visitor's hour: the mezzanine with its pendants lit. */
export function AfterDark() {
  return (
    <section className="after-dark night-scope" aria-labelledby="after-dark-title">
      <div className="wrap after-dark-inner">
        <div className="after-dark-copy">
          <h2 id="after-dark-title" className="t-head">The nights here are softer.</h2>
          <p className="t-line">The lamps stay on until {formatClock(cafe.meta.hours.close)}.</p>
        </div>
        <Sheet id="mezzanine-night" />
      </div>
    </section>
  );
}
```

`components/home/VisitBlock.tsx`:

```tsx
import { Sheet } from "@/components/draw/Sheet";
import { OpenNow } from "@/components/light/OpenNow";
import { addressLines, cafe, mapsHref, phoneHref, whatsappHref } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";

/** The way in: the corten sign as the café's own photo shows it, then everything needed to arrive. */
export function VisitBlock() {
  const { meta } = cafe;
  return (
    <section className="visit-block wrap" aria-labelledby="visit-title">
      <div className="visit-sheet">
        <Sheet id="facade" />
      </div>
      <div className="visit-copy">
        <h2 id="visit-title" className="t-head">Look for the corten sign.</h2>
        <address className="t-body">
          {addressLines.map((line) => (
            <span key={line}>{line}<br /></span>
          ))}
        </address>
        <p className="t-label num"><OpenNow open={meta.hours.open} close={meta.hours.close} /></p>
        <p className="t-body num">
          Open {formatClock(meta.hours.open)} to {formatClock(meta.hours.close)}. Brunch {formatClock(meta.brunchHours.open)} to {formatClock(meta.brunchHours.close)}.
        </p>
        <div className="visit-actions">
          <a className="btn btn-primary" href={mapsHref}>Get directions</a>
          <a className="btn" href={phoneHref}>Call {meta.phoneDisplay}</a>
          <a className="btn" href={whatsappHref}>WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
```

`components/chrome/SiteFooter.tsx`:

```tsx
"use client";

import Link from "next/link";
import { addressLines, cafe, phoneHref } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";
import { Mark } from "./Mark";
import { NAV } from "./SiteHeader";

const CREDIT = "Every drawing is made from the café's own photographs; each photograph is credited where it appears.";

/** A client component only because NAV lives in the client module SiteHeader; nothing here is interactive. */
export function SiteFooter() {
  const { meta } = cafe;
  return (
    <footer className="site-footer wrap">
      <div className="site-footer-mark" aria-hidden="true">
        <Mark size={64} />
      </div>
      <div className="site-footer-grid">
        <div>
          <p className="t-label">The house</p>
          <p className="t-body">
            {meta.name}
            <br />
            {addressLines.map((line) => (
              <span key={line}>{line}<br /></span>
            ))}
          </p>
        </div>
        <div>
          <p className="t-label">Hours</p>
          <p className="t-body num">
            {formatClock(meta.hours.open)} to {formatClock(meta.hours.close)}
            <br />
            Brunch {formatClock(meta.brunchHours.open)} to {formatClock(meta.brunchHours.close)}
          </p>
          <p className="t-body num site-footer-contact">
            <a className="pen-link" href={phoneHref}>{meta.phoneDisplay}</a>
            <a className="pen-link" href={meta.instagram}>{meta.instagramHandle}</a>
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="t-label">Pages</p>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link className="pen-link" href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="t-label site-footer-credit">{CREDIT}</p>
    </footer>
  );
}
```

`components/home/home.css`:

```css
/* Under the arch. On a phone the text starts on the arch's left jamb (both sit on the gutter); on a wide screen it centres under the arch. */
.under-arch { display: grid; gap: 14px; justify-items: start; padding-block: 20px 88px; }
.under-arch .t-display { font-size: clamp(2.6rem, 11vw, 5rem); }
.under-arch-facts { display: flex; flex-wrap: wrap; gap: 4px 18px; }
.under-arch-now { color: var(--ink); }
.under-arch .btn { margin-top: 10px; }
@media (min-width: 64rem) {
  .under-arch { justify-items: center; text-align: center; }
  .under-arch-facts { justify-content: center; }
}

/* Written about: the quote first on a phone, then the drawing drawing itself as you scroll past. */
.written { display: grid; gap: 72px; padding-block: 96px; }
.written-piece { display: grid; gap: 28px; align-items: center; }
.written-quote { order: 1; margin: 0; display: grid; gap: 16px; }
.written-quote blockquote, .written-quote blockquote p { margin: 0; }
.written-sheet { order: 2; width: 100%; max-width: 30rem; }
.written-more { max-width: 52ch; }
@media (min-width: 64rem) {
  .written-piece { grid-template-columns: minmax(0, 5fr) minmax(0, 4fr); gap: 72px; }
  .written-sheet { order: 1; justify-self: center; }
  .written-quote { order: 2; }
  .written-piece[data-flip] { grid-template-columns: minmax(0, 4fr) minmax(0, 5fr); }
  .written-piece[data-flip] .written-sheet { order: 3; }
}

/* Four doors: the mark's door, opening in line on its left hinge. */
.doors { display: grid; gap: 40px; padding-block: 96px; }
.doors-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 44px 20px; }
@media (min-width: 64rem) { .doors-list { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 40px; } }
.door { display: grid; gap: 10px; align-content: start; min-height: 44px; color: var(--ink); text-decoration: none; }
.door:focus { outline: none; }
.door:focus-visible { outline: 2px solid var(--pen); outline-offset: 6px; }
.door-drawing { display: block; width: 100%; max-width: 10rem; height: auto; overflow: visible; }
.door-drawing path { fill: none; stroke: var(--ink); stroke-width: var(--line-w); stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.door-drawing .door-leaf-face { fill: var(--paper); }
.door-leaf { transform-box: fill-box; transform-origin: 0% 50%; transition: transform 900ms var(--ease-pen); }
.door:is(:hover, :focus-visible, [data-open]) .door-leaf { transform: scaleX(0.3); }
.door-leaf-open { opacity: 0; }
.door-title { margin: 0; font-family: var(--font-display); font-weight: 420; font-size: 1.35rem; line-height: 1.1; letter-spacing: -0.01em; text-wrap: balance; }
.door-proof { font-size: 0.95rem; line-height: 1.45; color: var(--ink-2); }
@media (prefers-reduced-motion: reduce) {
  /* No swing: the closed leaf crossfades to the open one. */
  .door-leaf, .door-leaf-open { transition: opacity 150ms linear; }
  .door:is(:hover, :focus-visible, [data-open]) .door-leaf { transform: none; opacity: 0; }
  .door:is(:hover, :focus-visible, [data-open]) .door-leaf-open { opacity: 1; }
}

/* After dark */
.after-dark { padding-block: 96px; }
.after-dark-inner { display: grid; gap: 32px; }
.after-dark-copy { display: grid; gap: 12px; }
@media (min-width: 64rem) { .after-dark-inner { grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); align-items: center; gap: 72px; } }

/* Visit */
.visit-block { display: grid; gap: 32px; padding-block: 96px; }
.visit-copy { display: grid; gap: 14px; align-content: start; }
.visit-copy address { font-style: normal; }
.visit-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
@media (min-width: 64rem) { .visit-block { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); align-items: center; gap: 72px; } }
```

Append to `app/globals.css`:

```css
/* A section that is always night, whatever the hour. Custom properties inherit, so every drawing, glow and button inside follows. */
.night-scope {
  --paper: #17191c;
  --ink: #dad6ce;
  --ink-2: #9c978f;
  --pen: #d08a5c;
  --hair: #3a3c40;
  --glow: 1;
  color-scheme: dark;
  background: var(--paper);
  color: var(--ink);
}
.night-scope .drawing .layer-lamp path { stroke: var(--lamp); }

/* Footer */
.site-footer { display: grid; gap: 32px; padding-block: 56px 40px; border-top: 1px solid var(--hair); }
.site-footer-grid { display: grid; gap: 28px; }
.site-footer-grid .t-label { margin-bottom: 8px; }
.site-footer ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.site-footer li .pen-link, .site-footer-contact .pen-link { display: inline-block; padding-block: 6px; }
.site-footer-contact { display: grid; justify-items: start; margin-top: 12px; }
.site-footer-credit { max-width: 60ch; }
@media (min-width: 48rem) { .site-footer-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
```

`app/layout.tsx` (Task 5's layout with the footer added after `<main>`):

```tsx
import type { Metadata, Viewport } from "next";
import { Hedvig_Letters_Serif, Ysabeau_Office } from "next/font/google";
import { LightProvider } from "@/components/light/LightProvider";
import { LightScript } from "@/components/light/LightScript";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { cafe, siteUrl } from "@/lib/cafe";
import "./globals.css";

const ysabeau = Ysabeau_Office({ subsets: ["latin"], variable: "--font-ysabeau", display: "swap" });
const hedvig = Hedvig_Letters_Serif({ subsets: ["latin"], variable: "--font-hedvig", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${cafe.meta.name}, Chandkheda, Ahmedabad`, template: `%s | ${cafe.meta.name}` },
  description: `The house, drawn in one line: a ${cafe.meta.sizeSqFt.toLocaleString("en-IN")} sq ft loft house in ${cafe.meta.address.area}, Ahmedabad. Eat, host, shoot or bowl there.`,
};

export const viewport: Viewport = { themeColor: "#e9e8e4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ysabeau.variable} ${hedvig.variable}`} data-regime="day" suppressHydrationWarning>
      <head><LightScript /></head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <LightProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </LightProvider>
      </body>
    </html>
  );
}
```

`app/page.tsx`:

```tsx
import { House } from "@/components/house/House";
import { AfterDark } from "@/components/home/AfterDark";
import { Doors } from "@/components/home/Doors";
import { UnderArch } from "@/components/home/UnderArch";
import { VisitBlock } from "@/components/home/VisitBlock";
import { WrittenAbout } from "@/components/home/WrittenAbout";
import "@/components/home/home.css";

export default function Home() {
  return (
    <>
      <House arrival />
      <UnderArch />
      <WrittenAbout />
      <Doors />
      <AfterDark />
      <VisitBlock />
    </>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test && npm run lint`
Expected: every test file PASS; lint prints no errors.

Run: stop the server on 3022, `npm run build`, `npx next start -p 3022` (second terminal), then `node scripts/e2e/home.mjs && node scripts/e2e/arrival.mjs && node scripts/e2e/shell.mjs`
Expected: every line `ok` and `all checks passed` three times.
If a check fails, here is where to look:
- `the name sits in the first screen` at 1440: lower the stage's `13rem` offset in `components/house/house.css` to `14rem`, never the type size.
- `the door leaf swings open`: confirm that `transform-box: fill-box` is on `.door-leaf`.

- [ ] **Step 5: Look**

With Playwright MCP, open `http://localhost:3022/?at=14:00` and `?at=01:00` at 390x844 and then at 1440x900. Wait for `svg.house[data-arrival="done"]`, take a first-screen screenshot, then scroll in steps of one screen, taking a screenshot at each step so the scrub drawings are caught mid-draw. Read every screenshot. Checklist:
- [ ] First screen, 390:
  - The house, then the café's name on one line, then the line in the house's voice. The name's left edge sits on the arch's left jamb.
  - The open-now line reads "Open 11 AM to 3 AM" when pinned.
  - The ground is neutral drafting film, never cream.
- [ ] First screen, 1440: the name and line centred under the centred arch; the name fully visible above the fold.
- [ ] Written about:
  - Each quote is in Ysabeau italic with a curly-quoted, balanced measure. The attribution and date are in the label style, and the link has a hairline underline.
  - Mid-scroll, the mezzanine stair is half drawn beside the AD quote, and the entry strips are half drawn beside the ELLE quote.
  - On desktop the second pair is mirrored.
  - The sentence naming the other three publications links to `/press`.
- [ ] Doors:
  - Two by two on a phone, four in a row on desktop. Each door has the proportion of the mark's small door, and its line weight matches the drawings.
  - Hover at 1440: the leaf closes to a narrow edge on its left hinge over 0.9 s, revealing the jar and brush, the viewfinder corners, the pin, and the laptop.
  - The proof lines are in ink 2, with no widows.
- [ ] After dark: a steel ground even at 14:00, the pendants glowing, "The nights here are softer." legible (night ink on night).
- [ ] Visit:
  - The facade drawing with its lit logo at night.
  - The address in four lines.
  - Three buttons wrap cleanly at 390, each 44 px tall.
- [ ] Footer:
  - The mark at 64 px.
  - Three columns from 48rem, one column on a phone.
  - The credit sentence, and seven page links with comfortable spacing.
- [ ] 01:00: the whole page is in the night palette, the house's sun is a lamp, and the facade's bulbs glow.
- [ ] Reduced motion (`page.emulateMedia({ reducedMotion: "reduce" })`, then reload): the finished house appears at once, drawings are complete at rest, and hovering a door crossfades to the open leaf with no swing.
- [ ] Nothing says "Welcome to", "experience", "journey", "unforgettable", "immersive" or "whimsical". No price, capacity or lane count appears anywhere.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/layout.tsx app/globals.css components/home/UnderArch.tsx components/home/WrittenAbout.tsx components/home/Doors.tsx components/home/AfterDark.tsx components/home/VisitBlock.tsx components/home/home.css components/chrome/SiteFooter.tsx scripts/e2e/home.mjs
git commit -m "feat: the home page under the arch: quotes beside their rooms, four doors, after dark and the way in"
```

---

### Task 18: The rooms page

**Files:**
- Create: `lib/annotations.ts` (the notes on each drawing, each tied to cafe.json text)
- Create: `lib/annotation-layout.ts` (pure label geometry, kept apart so client code never bundles cafe.json)
- Create: `components/rooms/Room.tsx` (`Room` and `Plate`)
- Create: `components/rooms/Annotations.tsx`
- Create: `components/rooms/RollButton.tsx`
- Create: `components/rooms/rooms.css`
- Create: `app/spaces/page.tsx`
- Create: `scripts/annotations-review.ts` (draws each note's point and label box over the photo, so the measurements can be checked)
- Test: `tests/annotations.test.ts`, `scripts/e2e/spaces.mjs`

**Interfaces:**
- Consumes:
  - Task 14: `Sheet` from `components/draw/Sheet.tsx`, with props `{ id: string; mode?: DrawMode; title?: string; caption?: string; className?: string }`. It renders `<figure class="sheet">` holding `<svg class="drawing">`, plus `<button class="sheet-toggle" aria-pressed>` when the photograph can lift. Lifted, the drawing's opacity is 0.12.
  - Task 6: `DrawMode` from `components/draw/Drawing.tsx`; `loadGsap()` and `motionAllowed()` from `lib/motion/gsap.ts`.
  - Task 16: `ROOM_ORDER` and `RoomSlug` from `lib/house.ts`.
  - Task 15: the `CustomEvent("drawing:roll")` listener on a drawing's svg.
  - Tasks 1 to 3: `cafe`, `architectName` and `roomWord` from `lib/cafe.ts`; `frameOf(id)` from `lib/drawings.ts`; `drawingFor(id)` from `drawings/index.ts`; `n` from `lib/draw/primitives.ts`; `P` from `lib/draw/types.ts`; `toSvg` and `strokeWidthFor` from `lib/draw/render.ts`.
  - Task 5: CSS tokens `--paper --ink --ink-2 --pen --line-w --hair --ease-pen`; classes `.wrap .t-display .t-head .t-line .t-body .t-label .pen-link .btn`; the `pen-fallback` keyframes; the `html[data-motion]` attribute; `scripts/e2e/lib.mjs`.
- Produces:
  - `lib/annotations.ts`:
    - `interface Annotation { at: P; label: string; side: "left" | "right"; source: string }`
    - `interface NotDrawn { text: string; source: string }`
    - `ANNOTATIONS: Record<string, Annotation[]>`, keyed `facade`, `entry`, `main-floor`, `wall-lamp`, `mezzanine-stair`, `mezzanine-night`, `courtyard`, `games`, `alley-sign`
    - `NOT_DRAWN: Record<string, NotDrawn[]>`
    - `resolveSource(path: string): string` (throws when the path does not resolve)
    - `showable(text: string): string` (drops sentences that mention unconfirmed or unknown detail)
  - `lib/annotation-layout.ts`:
    - `LABEL`, `labelLines(label): 1 | 2`
    - `place(a, frame): Placed`, where `Placed = { point: P; anchor: P; box: [x0, y0, x1, y1]; lines }`
    - `percentBox(box, frame): { left; top; width; height }`
    - `leaderD(p, frame): string`, `dotD(p, frame): string`
    - `overlaps(a: Box, b: Box): boolean`, `inside(p: P, b: Box): boolean`
  - `components/rooms/Room.tsx`:
    - `Room({ slug: RoomSlug | "facade"; drawing: string; extra?: ReactNode })` renders `<section id={slug} class="room" aria-labelledby>` with an `h2`.
    - `Plate({ id: string; mode?: DrawMode })` renders `div.plate > div.plate-stage > (Sheet + Annotations)`, followed by a "Not in this drawing" list.
  - `components/rooms/Annotations.tsx`: `Annotations({ frame; items: PlacedLabel[] })`. It renders `div.annotations`, holding `svg.ann-lines` (`g[data-ann] > path.ann-dot + path.ann-leader`) and `ul.ann-labels > li.ann-label[data-ann][data-side] > span`. The root gets `data-lifted` while the photograph shows.
  - `components/rooms/RollButton.tsx`: `RollButton({ room: string })`, a `button.roll-button`.
  - The `/spaces` route: sections `#facade`, `#entry`, `#main-floor`, `#mezzanine`, `#courtyard`, `#games`, `#bowling` in that order, each with one `h2`. `.room` has `scroll-margin-top: 72px`. The page root is a fragment that opens with `<div className="rooms-intro wrap">`; Task 19 inserts `<HashLanding />` before it.

**Notes the engineer needs before starting:**
- **How points are measured.** Every point is in the drawing's own frame: the 1080-wide frame of its whole source photo, the frame of `guides/<id>/grid.png`. The crops are:

  | Drawing | Crop |
  |---|---|
  | `facade` | `0 0 1080 1000` |
  | `entry` | `0 0 1080 1800` |
  | `main-floor` | `250 0 1080 625` |
  | `wall-lamp` | `0 150 1080 1580` |
  | `mezzanine-stair` | `70 50 726 1032` |
  | `mezzanine-night` | `0 60 1080 1400` |
  | `courtyard` | `0 240 1080 1920` |
  | `alley-sign` | `60 380 1080 1900` |
  | `games` | `0 0 1080 1350` (no photograph) |

  The points below were read from those grids.
- **Games points are provisional.** The games still life has no photograph, and Task 11 decides where its table and shelves sit. Step 5 moves the three games points onto the drawn objects.
- **How labels are allowed.** A label may only use words from its `source` text: every word of four letters or more must appear there, and the test enforces this.
- **The wall lamp is not called a ship lamp.** `content/media.json` names that still "A wall lamp and a framed print against the brick", so the lamp gets no label; only the brick is annotated.
- **The alley gets one note.** `cafe.json` documents nothing about it except "Recently opened." That note points at the pin's OPEN sign.
- **How labels sit on the drawing.** A label stands beside its point, never across the drawing. A label on the right starts 8% of the drawing's width to the right of the point; a label on the left ends 8% to its left. Each label is 37% of the width wide. Label text is sized in container units, so this geometry holds at every width: at 390 px a 16-character label fits on one line, and two lines hold up to 34 characters. The test checks that labels stay inside the frame, never overlap each other, and never cover another note's point.
- **Why labels are drawn with scroll.** Annotations draw on as you scroll past them (spec section 7: scroll-linked where it means something). The leader draws from the point, then the label is wiped on from the leader's end, all scrubbed to scroll. Under reduced motion everything is present at rest.

- [ ] **Step 1: Write the failing tests**

`tests/annotations.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ANNOTATIONS, NOT_DRAWN, resolveSource, showable } from "@/lib/annotations";
import { LABEL, inside, overlaps, place } from "@/lib/annotation-layout";
import { frameOf } from "@/lib/drawings";

const IDS = ["facade", "entry", "main-floor", "wall-lamp", "mezzanine-stair", "mezzanine-night", "courtyard", "games", "alley-sign"];

/** Words of four letters or more carry a label's meaning; each must appear in the source text (a plural may match its singular). */
function unsupported(label: string, text: string): string[] {
  const t = text.toLowerCase();
  return label
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 4)
    .filter((w) => !t.includes(w) && !(w.endsWith("s") && t.includes(w.slice(0, -1))));
}

describe("resolveSource", () => {
  it("reads indexed, keyed and list paths from cafe.json", () => {
    expect(resolveSource("design.materials[3]")).toMatch(/pallet wood strips/);
    expect(resolveSource("spaces[slug=entry].description")).toMatch(/^A ceiling of pallet wood strips/);
    expect(resolveSource("menu.cuisines")).toBe("Italian, North Indian, Desserts, Coffee, Mocktails");
  });
  it("throws on a path that does not resolve", () => {
    expect(() => resolveSource("spaces[slug=attic].description")).toThrow();
    expect(() => resolveSource("design.materials[99]")).toThrow();
    expect(() => resolveSource("meta.address")).toThrow();
  });
  it("keeps only confirmed sentences", () => {
    expect(showable("Recently opened. No further detail confirmed.")).toBe("Recently opened.");
    expect(showable("A pool table, board games and a shelf of books.")).toBe("A pool table, board games and a shelf of books.");
  });
});

describe("annotations", () => {
  it("annotates exactly the drawings on the rooms page, each at least once", () => {
    expect(Object.keys(ANNOTATIONS).sort()).toEqual([...IDS].sort());
    for (const id of IDS) expect(ANNOTATIONS[id].length, id).toBeGreaterThan(0);
  });

  for (const id of IDS) {
    describe(id, () => {
      const frame = frameOf(id);
      const items = ANNOTATIONS[id];

      it("labels are short, sentence case and literally supported by their source", () => {
        for (const a of items) {
          const text = resolveSource(a.source);
          expect(showable(text).length, a.source).toBeGreaterThan(0);
          expect(a.label.length, a.label).toBeLessThanOrEqual(LABEL.maxChars);
          expect(a.label.length, a.label).toBeLessThan(40);
          expect(a.label.slice(1), a.label).toBe(a.label.slice(1).toLowerCase());
          expect(unsupported(a.label, text), `${a.label} <- ${a.source}`).toEqual([]);
        }
      });

      it("every point lies inside the drawing's frame", () => {
        for (const a of items) {
          expect(a.at[0], a.label).toBeGreaterThan(frame.x);
          expect(a.at[0], a.label).toBeLessThan(frame.x + frame.width);
          expect(a.at[1], a.label).toBeGreaterThan(frame.y);
          expect(a.at[1], a.label).toBeLessThan(frame.y + frame.height);
        }
      });

      it("labels fit the frame, never overlap and never cover another note's point", () => {
        const m = LABEL.margin * frame.width;
        const placed = items.map((a) => place(a, frame));
        placed.forEach((p, i) => {
          const [x0, y0, x1, y1] = p.box;
          const name = items[i].label;
          expect(x0, name).toBeGreaterThanOrEqual(frame.x + m);
          expect(x1, name).toBeLessThanOrEqual(frame.x + frame.width - m);
          expect(y0, name).toBeGreaterThanOrEqual(frame.y + m);
          expect(y1, name).toBeLessThanOrEqual(frame.y + frame.height - m);
          expect(Math.abs(p.anchor[0] - p.point[0]), name).toBeGreaterThanOrEqual(12);
          placed.forEach((q, j) => {
            if (i === j) return;
            expect(overlaps(p.box, q.box), `${name} overlaps ${items[j].label}`).toBe(false);
            expect(inside(q.point, p.box), `${name} covers the point of ${items[j].label}`).toBe(false);
          });
        });
      });
    });
  }

  it("things listed as not drawn are supported by their source too", () => {
    for (const [id, list] of Object.entries(NOT_DRAWN)) {
      expect(IDS, id).toContain(id);
      for (const item of list) expect(unsupported(item.text, resolveSource(item.source)), `${id}: ${item.text}`).toEqual([]);
    }
  });
});
```

`scripts/e2e/spaces.mjs`:

```js
// Run against production: npm run build && (npm start &) && sleep 6 && node scripts/e2e/spaces.mjs
import { assert, launch, open, report, shot } from "./lib.mjs";

const ORDER = ["facade", "entry", "main-floor", "mezzanine", "courtyard", "games", "bowling"];
const LABELS = 23;
const browser = await launch();

// Phone, day: structure, copy, alignment, scroll-linked notes, lift, roll.
{
  const { page, ctx, errors } = await open(browser, "/spaces", { at: "14:00" });
  assert((await page.locator("h1").count()) === 1, "one h1");
  const ids = await page.locator("main section[id]").evaluateAll((els) => els.map((e) => e.id));
  assert(JSON.stringify(ids) === JSON.stringify(ORDER), `sections in story order (${ids.join(", ")})`);
  const nav = await page.locator(".rooms-nav a").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  assert(JSON.stringify(nav) === JSON.stringify(ORDER.map((s) => `#${s}`)), "plain text nav lists the facade and six rooms");
  for (const id of ORDER) assert((await page.locator(`#${id} h2`).count()) === 1, `#${id} has its heading`);

  const text = await page.locator("main").innerText();
  assert(!/UNKNOWN|CONFIRM|confirmed/i.test(text), "no flagged or unconfirmed text");
  assert(/Recently opened\./.test(text), "the alley says it recently opened");
  assert(/Open until 3 AM, laptop-friendly, quiet corners\./.test(text), "work late line on the mezzanine");
  assert(/A wall of upcycled bottles set into metal mesh/.test(text), "the facade lists what its drawing does not show");
  assert((await page.locator("#main-floor svg.drawing").count()) === 2, "main floor shows the room and the wall lamp");
  assert((await page.locator("#mezzanine svg.drawing").count()) === 2, "mezzanine shows the stair and the table at night");

  const labels = await page.locator(".ann-label").allInnerTexts();
  assert(labels.length === LABELS && labels.every((l) => l.trim().length > 0 && l.length < 40), `annotation labels present and short (${labels.length})`);

  const misaligned = await page.locator(".annotations").evaluateAll((els) => els.filter((el) => {
    const svg = el.parentElement.querySelector("svg.drawing");
    const a = el.getBoundingClientRect();
    const b = svg.getBoundingClientRect();
    return Math.abs(a.left - b.left) > 1 || Math.abs(a.top - b.top) > 1 || Math.abs(a.width - b.width) > 1 || Math.abs(a.height - b.height) > 1;
  }).length);
  assert(misaligned === 0, "every annotation overlay sits exactly on its drawing");
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), "no horizontal overflow at 390");

  const ready = await page.locator("#courtyard .annotations:not([data-pending])").waitFor({ state: "attached", timeout: 6000 }).then(() => true, () => false);
  assert(ready, "annotation motion is set up");
  const before = await page.locator("#courtyard .ann-label span").first().evaluate((e) => {
    const s = getComputedStyle(e);
    return s.visibility === "hidden" ? 0 : Number(s.opacity);
  });
  assert(before < 0.1, `courtyard notes wait until they are reached (${before})`);
  await page.evaluate(() => {
    const stage = document.querySelector("#courtyard .plate-stage");
    window.scrollTo(0, stage.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.3);
  });
  await page.waitForTimeout(1500);
  const after = await page.locator("#courtyard .ann-label span").evaluateAll((els) => els.map((e) => Number(getComputedStyle(e).opacity)));
  assert(after.every((o) => o > 0.9), `courtyard notes drawn once scrolled past (${after.join(", ")})`);

  await page.evaluate(() => document.getElementById("entry").scrollIntoView());
  await page.waitForTimeout(400);
  await page.locator("#entry .sheet-toggle").first().click();
  await page.waitForTimeout(900);
  assert((await page.locator("#entry .annotations").evaluate((e) => getComputedStyle(e).visibility)) === "hidden", "notes step aside while the photograph shows");
  await page.locator("#entry .sheet-toggle").first().click();
  await page.waitForTimeout(900);
  assert((await page.locator("#entry .annotations").evaluate((e) => getComputedStyle(e).visibility)) === "visible", "notes return with the drawing");

  const rolled = await page.evaluate(() => new Promise((resolve) => {
    const svg = document.querySelector("#games svg.drawing");
    svg.addEventListener("drawing:roll", () => resolve(true), { once: true });
    document.querySelector("#games .roll-button").click();
    setTimeout(() => resolve(false), 1000);
  }));
  assert(rolled, "the roll button dispatches drawing:roll on the games drawing");

  assert(errors.length === 0, `no console errors (${errors.join(" | ")})`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, "spaces-390-day");
  await ctx.close();
}

// Phone, night, reduced motion: everything present at rest.
{
  const { page, ctx, errors } = await open(browser, "/spaces", { at: "01:00", reducedMotion: true });
  assert((await page.getAttribute("html", "data-regime")) === "night", "night palette at 01:00");
  const hidden = await page.locator(".ann-label span").evaluateAll((els) => els.filter((e) => {
    const s = getComputedStyle(e);
    return s.visibility === "hidden" || Number(s.opacity) < 0.99;
  }).length);
  assert(hidden === 0, "reduced motion: every note is present at rest");
  const leaders = await page.locator(".ann-lines path").evaluateAll((els) => els.filter((e) => getComputedStyle(e).visibility === "hidden").length);
  assert(leaders === 0, "reduced motion: every leader is present at rest");
  assert(!(await page.locator("#games .roll-button").isVisible()), "reduced motion: no roll button");
  assert(errors.length === 0, `no console errors (${errors.join(" | ")})`);
  await shot(page, "spaces-390-night-reduced");
  await ctx.close();
}

// Desktop, day.
{
  const { page, ctx, errors } = await open(browser, "/spaces", { width: 1440, height: 900, at: "14:00" });
  assert((await page.locator("#entry .room-head").evaluate((e) => getComputedStyle(e).position)) === "sticky", "desktop: the room's heading stays beside its drawing");
  const tall = await page.locator("#entry .plate-stage svg.drawing").evaluate((e) => e.getBoundingClientRect().height);
  assert(tall <= 900 * 0.9, `desktop: a tall drawing stays within the screen (${Math.round(tall)} px)`);
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), "no horizontal overflow at 1440");
  assert(errors.length === 0, `no console errors (${errors.join(" | ")})`);
  await shot(page, "spaces-1440-day");
  await ctx.close();
}

await browser.close();
report();
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- annotations`
Expected: FAIL with `Failed to resolve import "@/lib/annotations"`.

Stop any server on 3022 first, then run: `npm run build && (npm start &) && sleep 6 && node scripts/e2e/spaces.mjs`
Expected: `FAIL sections in story order ()` and further FAIL lines, ending in `n failure(s)` with exit code 1. `/spaces` does not exist yet.

- [ ] **Step 3: Implement**

`lib/annotation-layout.ts`:

```ts
import { n } from "@/lib/draw/primitives";
import type { P } from "@/lib/draw/types";

export interface Frame { x: number; y: number; width: number; height: number }
export type Box = [number, number, number, number];
export interface Placed { point: P; anchor: P; box: Box; lines: 1 | 2 }

/**
 * Label geometry as fractions of the drawing's width, so it holds at every size.
 * Labels are set in container units (rooms.css), so 16 characters fit a line at 390 px.
 */
export const LABEL = {
  width: 0.37,
  leader: 0.08,
  line: 0.055,
  pad: 0.02,
  charsPerLine: 16,
  maxChars: 34,
  margin: 0.01,
  dot: 0.009,
} as const;

export function labelLines(label: string): 1 | 2 {
  return label.length <= LABEL.charsPerLine ? 1 : 2;
}

/** Where a note's leader ends and its label box sits, in the drawing's frame. */
export function place(a: { at: P; label: string; side: "left" | "right" }, f: Frame): Placed {
  const w = f.width;
  const dir = a.side === "right" ? 1 : -1;
  const anchor: P = [a.at[0] + dir * LABEL.leader * w, a.at[1]];
  const lines = labelLines(a.label);
  const bw = LABEL.width * w;
  const h = (LABEL.pad + LABEL.line * lines) * w;
  const x0 = a.side === "right" ? anchor[0] : anchor[0] - bw;
  return { point: a.at, anchor, box: [x0, a.at[1] - h / 2, x0 + bw, a.at[1] + h / 2], lines };
}

export function percentBox(box: Box, f: Frame): { left: number; top: number; width: number; height: number } {
  return {
    left: ((box[0] - f.x) / f.width) * 100,
    top: ((box[1] - f.y) / f.height) * 100,
    width: ((box[2] - box[0]) / f.width) * 100,
    height: ((box[3] - box[1]) / f.height) * 100,
  };
}

/** The leader starts at the dot's edge and runs to the label. */
export function leaderD(p: Placed, f: Frame): string {
  const r = LABEL.dot * f.width;
  const dir = Math.sign(p.anchor[0] - p.point[0]) || 1;
  return `M${n(p.point[0] + dir * r)} ${n(p.point[1])}L${n(p.anchor[0])} ${n(p.anchor[1])}`;
}

export function dotD(p: Placed, f: Frame): string {
  const r = LABEL.dot * f.width;
  const [x, y] = p.point;
  return `M${n(x + r)} ${n(y)}A${n(r)} ${n(r)} 0 1 1 ${n(x - r)} ${n(y)}A${n(r)} ${n(r)} 0 1 1 ${n(x + r)} ${n(y)}`;
}

export const overlaps = (a: Box, b: Box): boolean => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
export const inside = (p: P, b: Box): boolean => p[0] >= b[0] && p[0] <= b[2] && p[1] >= b[1] && p[1] <= b[3];
```

`lib/annotations.ts`:

```ts
import { cafe } from "@/lib/cafe";
import type { P } from "@/lib/draw/types";

/**
 * A hairline leader from an object on a drawing to a short label.
 * `at` is measured in the drawing's frame (the 1080-wide frame of its whole source photo, as on guides/<id>/grid.png).
 * `source` is a path into content/cafe.json whose text literally supports the label.
 */
export interface Annotation { at: P; label: string; side: "left" | "right"; source: string }

/** A documented thing the drawing's photograph does not show: listed in text beside the drawing, never drawn. */
export interface NotDrawn { text: string; source: string }

export const ANNOTATIONS: Record<string, Annotation[]> = {
  // stills/sign-corten.jpg, frame 0 0 1080 1000
  facade: [
    { at: [470, 640], label: "Oxidised corten steel signage", side: "right", source: "design.materials[0]" }, // bare plate between the logo (x 200-410) and the creepers
    { at: [820, 240], label: "Heavy planting", side: "left", source: "design.materials[10]" }, // creepers over the wall's top corner; label sits in the sky
  ],
  // stills/entry-ceiling.jpg, frame 0 0 1080 1800
  entry: [
    { at: [520, 170], label: "Pallet wood strips, fruit crates", side: "right", source: "spaces[slug=entry].description" }, // hanging crate strips
    { at: [98, 875], label: "Salvaged objects and art", side: "right", source: "spaces[slug=entry].description" }, // framed painting (35-160, 790-960)
    { at: [560, 1040], label: "Exposed brick", side: "right", source: "design.materials[2]" }, // brick beside the small frame and extinguisher
    { at: [180, 1580], label: "Raw concrete floors", side: "right", source: "design.materials[4]" }, // open floor, front left
  ],
  // raw/ad-1.jpg, frame 250 0 830 625
  "main-floor": [
    { at: [980, 200], label: "Exposed brick", side: "left", source: "spaces[slug=main-floor].description" }, // right wall above the framed picture
    { at: [296, 420], label: "Black steel structure", side: "right", source: "spaces[slug=main-floor].description" }, // steel column under the mezzanine
    { at: [630, 515], label: "Raw concrete", side: "right", source: "spaces[slug=main-floor].description" }, // floor between the stair plants and the near table
  ],
  // stills/brick-lamp.jpg, frame 0 150 1080 1430
  "wall-lamp": [
    { at: [160, 470], label: "Exposed brick", side: "right", source: "design.materials[2]" }, // brick between the lamp shade and the mirror
  ],
  // raw/ad-2.jpg, frame 70 50 656 982
  "mezzanine-stair": [
    { at: [395, 280], label: "Floor-to-ceiling windows", side: "right", source: "design.materials[5]" }, // upper panes of the left window pair
    { at: [610, 560], label: "Black steel structure", side: "left", source: "spaces[slug=main-floor].description" }, // the black column (600-620)
    { at: [100, 450], label: "Exposed brick", side: "right", source: "design.materials[2]" }, // the wall behind the stair
  ],
  // stills/night-city-window.jpg, frame 0 60 1080 1340
  "mezzanine-night": [
    { at: [660, 965], label: "Shared tables", side: "left", source: "spaces[slug=mezzanine].description" }, // the long table top
    { at: [140, 880], label: "Living area", side: "right", source: "spaces[slug=mezzanine].description" }, // sofa back, left
    { at: [600, 1330], label: "Wooden flooring", side: "left", source: "spaces[slug=mezzanine].description" }, // plank floor, front
  ],
  // stills/courtyard-vines.jpg, frame 0 240 1080 1680
  courtyard: [
    { at: [420, 800], label: "Heavy planting", side: "right", source: "design.materials[10]" }, // the creeper canopy
    { at: [760, 1010], label: "Exposed brick", side: "left", source: "design.materials[2]" }, // brick left of and below the painting
    { at: [240, 1700], label: "Varied seating", side: "right", source: "spaces[slug=courtyard].description" }, // the left chair's frame
  ],
  // no photograph, frame 0 0 1080 1350: provisional until checked against drawings/games.ts in Step 5
  games: [
    { at: [540, 1010], label: "Pool table", side: "right", source: "spaces[slug=games].description" },
    { at: [300, 330], label: "Board games", side: "right", source: "spaces[slug=games].description" },
    { at: [780, 620], label: "Shelf of books", side: "left", source: "spaces[slug=games].description" },
  ],
  // stills/bowl-sign.jpg, frame 60 380 1020 1520
  "alley-sign": [
    { at: [690, 950], label: "Recently opened", side: "left", source: "spaces[slug=bowling].description" }, // the OPEN neon on the pin
  ],
};

export const NOT_DRAWN: Record<string, NotDrawn[]> = {
  facade: [{ text: "A wall of upcycled bottles set into metal mesh", source: "spaces[slug=facade].description" }],
  "main-floor": [{ text: "Floor-to-ceiling windows", source: "spaces[slug=main-floor].description" }],
};

const SEGMENT = /^([A-Za-z]+)(?:\[(\d+)\]|\[([A-Za-z]+)=([^\]]+)\])?$/;

/** Text at a path such as `design.materials[3]` or `spaces[slug=entry].description`. A list of strings joins with commas. */
export function resolveSource(path: string): string {
  let node: unknown = cafe;
  for (const part of path.split(".")) {
    const m = SEGMENT.exec(part);
    if (!m) throw new Error(`Bad segment "${part}" in source "${path}"`);
    const [, key, index, field, value] = m;
    node = (node as Record<string, unknown> | null | undefined)?.[key];
    if (index !== undefined) node = Array.isArray(node) ? node[Number(index)] : undefined;
    if (field !== undefined) node = Array.isArray(node) ? node.find((item) => (item as Record<string, unknown> | null)?.[field] === value) : undefined;
    if (node === undefined) throw new Error(`Source "${path}" does not resolve at "${part}"`);
  }
  if (Array.isArray(node) && node.every((v) => typeof v === "string")) return node.join(", ");
  if (typeof node !== "string") throw new Error(`Source "${path}" is not text`);
  return node;
}

/** Text safe to print: sentences about unconfirmed or unknown detail are dropped. */
export function showable(text: string): string {
  return text
    .split(/(?<=\.)\s+/)
    .filter((sentence) => !/confirm|unknown/i.test(sentence))
    .join(" ")
    .trim();
}
```

`components/rooms/Annotations.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { loadGsap, motionAllowed } from "@/lib/motion/gsap";

export interface PlacedLabel {
  label: string;
  side: "left" | "right";
  leader: string;
  dot: string;
  box: { left: number; top: number; width: number; height: number };
  /** 0..1: how far down the drawing the note sits, used to order the scroll. */
  t: number;
}

interface Frame { x: number; y: number; width: number; height: number }

export function Annotations({ frame, items }: { frame: Frame; items: PlacedLabel[] }) {
  const root = useRef<HTMLDivElement>(null);

  // Keep the overlay exactly on the drawing, and out of the way while the tracing paper is lifted.
  useEffect(() => {
    const el = root.current;
    const stage = el?.parentElement;
    const svg = stage?.querySelector<SVGSVGElement>("svg.drawing");
    if (!el || !stage || !svg) return;
    let raf = 0;
    let until = 0;
    const sync = () => {
      const s = stage.getBoundingClientRect();
      const r = svg.getBoundingClientRect();
      el.style.left = `${r.left - s.left}px`;
      el.style.top = `${r.top - s.top}px`;
      el.style.width = `${r.width}px`;
      el.style.height = `${r.height}px`;
      let opacity = 1;
      for (let node: Element | null = svg; node && node !== stage; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
      el.toggleAttribute("data-lifted", opacity < 0.6);
    };
    const sample = () => {
      sync();
      if (performance.now() < until) raf = requestAnimationFrame(sample);
    };
    const watch = (ms = 900) => {
      until = performance.now() + ms;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sample);
    };
    sync();
    const resize = new ResizeObserver(() => sync());
    resize.observe(stage);
    resize.observe(svg);
    const mutations = new MutationObserver(() => watch());
    for (let node: Element | null = svg; node && node !== stage; node = node.parentElement) {
      mutations.observe(node, { attributes: true, attributeFilter: ["style", "class"] });
    }
    stage.querySelectorAll(".sheet-toggle").forEach((b) => mutations.observe(b, { attributes: true, attributeFilter: ["aria-pressed"] }));
    const onPointer = () => watch(1300);
    const onTransition = (e: Event) => {
      if (!el.contains(e.target as Node)) watch();
    };
    stage.addEventListener("pointerdown", onPointer);
    stage.addEventListener("pointerup", onPointer);
    stage.addEventListener("pointercancel", onPointer);
    stage.addEventListener("transitionrun", onTransition);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      mutations.disconnect();
      stage.removeEventListener("pointerdown", onPointer);
      stage.removeEventListener("pointerup", onPointer);
      stage.removeEventListener("pointercancel", onPointer);
      stage.removeEventListener("transitionrun", onTransition);
    };
  }, []);

  // Leaders draw and labels write on with scroll; complete at rest under reduced motion.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!motionAllowed()) {
      el.removeAttribute("data-pending");
      return;
    }
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 40%", scrub: 0.6, invalidateOnRefresh: true },
      });
      items.forEach((item, i) => {
        const dot = el.querySelector(`g[data-ann="${i}"] .ann-dot`);
        const leader = el.querySelector(`g[data-ann="${i}"] .ann-leader`);
        const label = el.querySelector(`li[data-ann="${i}"] span`);
        if (!dot || !leader || !label) return;
        const at = Math.min(0.86, item.t * 0.86);
        const hidden = item.side === "right" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
        tl.fromTo(dot, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.04 }, at)
          .fromTo(leader, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.06 }, at + 0.03)
          .fromTo(label, { clipPath: hidden, opacity: 0 }, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.06 }, at + 0.08);
      });
      tl.to({}, { duration: 0.01 }, 0.99);
      el.removeAttribute("data-pending");
      cleanup = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [items]);

  return (
    <div ref={root} className="annotations" data-pending="">
      <svg className="ann-lines" viewBox={`${frame.x} ${frame.y} ${frame.width} ${frame.height}`} aria-hidden="true" focusable="false">
        {items.map((item, i) => (
          <g key={i} data-ann={i}>
            <path className="ann-dot" d={item.dot} />
            <path className="ann-leader" d={item.leader} />
          </g>
        ))}
      </svg>
      <ul className="ann-labels" aria-label="Notes on the drawing">
        {items.map((item, i) => (
          <li
            key={i}
            data-ann={i}
            data-side={item.side}
            className="ann-label"
            style={{ left: `${item.box.left}%`, top: `${item.box.top}%`, width: `${item.box.width}%`, height: `${item.box.height}%` }}
          >
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`components/rooms/Room.tsx`:

```tsx
import type { CSSProperties, ReactNode } from "react";
import type { DrawMode } from "@/components/draw/Drawing";
import { Sheet } from "@/components/draw/Sheet";
import { dotD, leaderD, percentBox, place } from "@/lib/annotation-layout";
import { ANNOTATIONS, NOT_DRAWN, showable } from "@/lib/annotations";
import { cafe } from "@/lib/cafe";
import { frameOf } from "@/lib/drawings";
import type { RoomSlug } from "@/lib/house";
import { Annotations, type PlacedLabel } from "./Annotations";
import "./rooms.css";

/** One drawing under tracing paper with its notes, and the documented things its photograph does not show. */
export function Plate({ id, mode = "draw" }: { id: string; mode?: DrawMode }) {
  const frame = frameOf(id);
  const items: PlacedLabel[] = (ANNOTATIONS[id] ?? []).map((a) => {
    const p = place(a, frame);
    return {
      label: a.label,
      side: a.side,
      leader: leaderD(p, frame),
      dot: dotD(p, frame),
      box: percentBox(p.box, frame),
      t: (a.at[1] - frame.y) / frame.height,
    };
  });
  const missing = NOT_DRAWN[id] ?? [];
  return (
    <div className="plate" style={{ "--aspect": frame.width / frame.height } as CSSProperties}>
      <div className="plate-stage">
        <Sheet id={id} mode={mode} className="room-sheet" />
        {items.length ? <Annotations frame={frame} items={items} /> : null}
      </div>
      {missing.length ? (
        <div className="plate-missing">
          <p className="t-label">Not in this drawing</p>
          <ul>
            {missing.map((m) => (
              <li key={m.text} className="t-body">{m.text}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function Room({ slug, drawing, extra }: { slug: RoomSlug | "facade"; drawing: string; extra?: ReactNode }) {
  const space = cafe.spaces.find((s) => s.slug === slug);
  if (!space) throw new Error(`No space "${slug}" in content/cafe.json`);
  const headingId = `${slug}-title`;
  const text = showable(space.description);
  return (
    <section id={slug} className="room wrap" aria-labelledby={headingId}>
      <div className="room-head">
        <h2 id={headingId} className="t-head">{space.name}</h2>
        {text ? <p className="t-body">{text}</p> : null}
      </div>
      <div className="room-plates">
        <Plate id={drawing} />
        {extra}
      </div>
    </section>
  );
}
```

`components/rooms/RollButton.tsx`:

```tsx
"use client";

/** Asks the games drawing to roll its cue ball (components/draw/life.ts listens for drawing:roll on the svg). */
export function RollButton({ room }: { room: string }) {
  return (
    <button
      type="button"
      className="btn roll-button"
      onClick={() => {
        document.getElementById(room)?.querySelector("svg.drawing")?.dispatchEvent(new CustomEvent("drawing:roll"));
      }}
    >
      Roll the cue ball
    </button>
  );
}
```

`components/rooms/rooms.css`:

```css
.rooms-intro { display: grid; gap: 20px; padding-block: clamp(40px, 10vh, 120px) clamp(24px, 5vh, 56px); }
.rooms-nav ol { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0 20px; }
.rooms-nav a { display: inline-flex; align-items: center; min-height: 44px; font-family: var(--font-display); font-weight: 480; }

.room { display: grid; gap: 28px; padding-block: clamp(56px, 12vh, 140px); border-top: 1px solid var(--hair); scroll-margin-top: 72px; }
.room-head { display: grid; gap: 14px; align-content: start; align-self: start; }
.room-plates { display: grid; gap: clamp(48px, 9vh, 96px); min-width: 0; }
@media (min-width: 64rem) {
  .room { grid-template-columns: minmax(16rem, 1fr) minmax(0, 2.4fr); column-gap: clamp(32px, 4vw, 72px); }
  .room-head { position: sticky; top: 96px; }
}

/* A plate: one drawing, as large as the screen allows, never taller than it. */
.plate { width: min(100%, calc(86svh * var(--aspect))); margin-inline: auto; }
.plate-stage { position: relative; }
.plate-missing { display: grid; gap: 6px; margin-top: 18px; }
.plate-missing ul { list-style: none; margin: 0; padding: 0; }

/* Notes: corten leaders over the ink drawing, labels set beside their points. */
.annotations { position: absolute; left: 0; top: 0; width: 100%; aspect-ratio: var(--aspect); pointer-events: none; transition: opacity 300ms var(--ease-pen), visibility 0s; }
.annotations[data-lifted],
.plate-stage:has(.sheet-toggle[aria-pressed="true"]) .annotations { opacity: 0; visibility: hidden; transition: opacity 200ms var(--ease-pen), visibility 0s 200ms; }
.ann-lines { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.ann-lines path { fill: none; stroke: var(--pen); stroke-width: var(--line-w); stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.ann-labels { position: absolute; inset: 0; margin: 0; padding: 0; list-style: none; container-type: inline-size; }
.ann-label { position: absolute; display: flex; align-items: center; justify-content: flex-start; font-family: var(--font-display); font-weight: 480; font-size: clamp(0.75rem, 3.4cqi, 1rem); line-height: 1.2; color: var(--ink); }
.ann-label[data-side="left"] { justify-content: flex-end; text-align: right; }
.ann-label span { padding: 2px 6px; background: color-mix(in oklch, var(--paper) 86%, transparent); text-wrap: balance; }
html[data-motion="on"] .annotations[data-pending] :is(.ann-lines path, .ann-label span) { visibility: hidden; animation: pen-fallback 0s 2.5s forwards; }

.room-actions { display: flex; flex-wrap: wrap; gap: 12px; }
html:not([data-motion="on"]) .roll-button { display: none; }
.work-late { display: grid; gap: 10px; max-width: 62ch; }
```

`app/spaces/page.tsx`:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plate, Room } from "@/components/rooms/Room";
import { RollButton } from "@/components/rooms/RollButton";
import { architectName, cafe, roomWord } from "@/lib/cafe";
import { ROOM_ORDER, type RoomSlug } from "@/lib/house";

export const metadata: Metadata = {
  title: "The rooms",
  description: `The facade and ${roomWord} rooms of ${cafe.meta.name}, a loft house in ${cafe.meta.address.area}, Ahmedabad, by ${architectName} of ${cafe.design.studio}, each drawn in one line.`,
  alternates: { canonical: "/spaces" },
};

const facade = cafe.spaces.find((s) => s.slug === "facade");
const work = cafe.uses.find((u) => u.slug === "work");
/** Only the verifiable first sentence of the work-late note: "Open until 3 AM, laptop-friendly, quiet corners." */
const workLine = work && "detail" in work && work.detail ? `${work.detail.split(". ")[0].trim().replace(/\.$/, "")}.` : null;

function extraFor(slug: RoomSlug): ReactNode {
  if (slug === "main-floor") return <Plate id="wall-lamp" />;
  if (slug === "mezzanine") {
    return (
      <>
        <Plate id="mezzanine-night" />
        {work && workLine ? (
          <div className="work-late">
            <h3 className="t-label">{work.name}</h3>
            <p className="t-line">{workLine}</p>
          </div>
        ) : null}
      </>
    );
  }
  if (slug === "games") {
    return (
      <div className="room-actions">
        <RollButton room="games" />
      </div>
    );
  }
  return null;
}

export default function SpacesPage() {
  return (
    <>
      <div className="rooms-intro wrap">
        <h1 className="t-display">The rooms</h1>
        <p className="t-line">
          {`A ${cafe.meta.sizeSqFt.toLocaleString("en-IN")} sq ft loft house by ${architectName}, drawn room by room. Go slowly; where there is a photograph, hold the drawing to see it.`}
        </p>
        <nav className="rooms-nav" aria-label="Rooms on this page">
          <ol>
            {facade ? (
              <li><a className="pen-link" href="#facade">{facade.name}</a></li>
            ) : null}
            {ROOM_ORDER.map((r) => (
              <li key={r.slug}><a className="pen-link" href={`#${r.slug}`}>{r.name}</a></li>
            ))}
          </ol>
        </nav>
      </div>
      <Room slug="facade" drawing="facade" />
      {ROOM_ORDER.map((r) => (
        <Room key={r.slug} slug={r.slug} drawing={r.drawing} extra={extraFor(r.slug)} />
      ))}
    </>
  );
}
```

`scripts/annotations-review.ts`:

```ts
// Draws each note's dot, leader and label box over its drawing, and over the photo when a guide exists.
// Run: npx tsx scripts/annotations-review.ts [id ...]   → review/<id>-annotations.png
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { drawingFor } from "../drawings";
import { dotD, leaderD, place } from "../lib/annotation-layout";
import { ANNOTATIONS } from "../lib/annotations";
import { strokeWidthFor, toSvg } from "../lib/draw/render";
import { frameOf } from "../lib/drawings";

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ANNOTATIONS);
fs.mkdirSync("review", { recursive: true });

for (const id of ids) {
  const d = drawingFor(id);
  const f = frameOf(id);
  const sw = strokeWidthFor(f.width, 1080, 2);
  const marks = (ANNOTATIONS[id] ?? []).map((a) => {
    const p = place(a, f);
    const [x0, y0, x1, y1] = p.box;
    const tx = a.side === "right" ? x0 + 8 : x1 - 8;
    return `<path d="${dotD(p, f)}"/><path d="${leaderD(p, f)}"/><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" stroke-dasharray="10 8"/><text x="${tx}" y="${(y0 + y1) / 2 + 10}" text-anchor="${a.side === "right" ? "start" : "end"}" font-size="28" font-family="Arial" fill="#8E4B2A" stroke="none">${a.label}</text>`;
  }).join("");
  const svg = toSvg(d, { stroke: sw, color: "#1F1C1A" }).replace("</svg>", `<g fill="none" stroke="#8E4B2A" stroke-width="${sw * 1.5}">${marks}</g></svg>`);
  const png = new Resvg(svg, { fitTo: { mode: "width", value: f.width }, font: { loadSystemFonts: true } }).render().asPng();
  const out = `review/${id}-annotations.png`;
  const photo = path.join("guides", id, "photo.jpg");
  if (fs.existsSync(photo)) {
    const base = await sharp(photo)
      .extract({ left: f.x, top: f.y, width: f.width, height: f.height })
      .composite([{ input: Buffer.from(`<svg width="${f.width}" height="${f.height}"><rect width="100%" height="100%" fill="#ffffff" opacity="0.55"/></svg>`) }])
      .png()
      .toBuffer();
    await sharp(base).composite([{ input: png }]).png().toFile(out);
  } else {
    await sharp(png).flatten({ background: "#E9E8E4" }).png().toFile(out);
  }
  console.log(out);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- annotations`
Expected: PASS. The suite covers `resolveSource`, one `describe` block per drawing (nine, three checks each), and the not-drawn check. If a "covers the point" or "overlaps" line fails after you move a point, move the point along its object or flip its `side`. Never shorten the leader constants.

Stop any server on 3022, then run: `npm run build && (npm start &) && sleep 6 && node scripts/e2e/spaces.mjs`
Expected: every line `ok`, ending `all checks passed`. `shots/spaces-390-day.png`, `shots/spaces-390-night-reduced.png` and `shots/spaces-1440-day.png` are written.

Run: `npm test && npm run lint`
Expected: PASS, with no type errors in the new files.

- [ ] **Step 5: Look**

**A. Check the measured points.** Run `node scripts/guides/build.mjs facade entry main-floor wall-lamp mezzanine-stair mezzanine-night courtyard alley-sign` if `guides/` is missing. Then run `npx tsx scripts/annotations-review.ts` and Read each `review/<id>-annotations.png`:
- Every corten dot sits on the object its label names, within about 20 frame units:
  - facade: the plate, the creepers
  - entry: the strips, the painting, the brick, the floor
  - main floor: the brick, the column, the floor
  - wall lamp: the brick
  - mezzanine stair: the windows, the column, the brick
  - mezzanine at night: the table, the sofa, the planks
  - courtyard: the canopy, the brick, the chair
  - alley: the OPEN neon
- If a dot is off, move `at` in `lib/annotations.ts` onto the object and rerun `npm test -- annotations`.
- Games has no photograph, so read `drawings/games.ts` (Task 11). Put `Pool table` on the table's top rail, `Board games` on a board-game box and `Shelf of books` on a book spine, using that module's constants. Keep the sides and the test green.
- No label box hides the object it names.

**B. Look at the page.** With Playwright MCP, open `http://localhost:3022/spaces?at=14:00` at 390x844 and scroll through, taking a screenshot per section. Read each one:
- **Order and navigation.** The intro has "The rooms", the one-line intro and the seven-link text nav. Sections follow in order: the facade, then the entry hall, main floor, mezzanine, courtyard, games corner and bowling alley.
- **Each section.** The `h2` and description sit above a full-width drawing.
- **Facade.** Two notes: "Oxidised corten steel signage" beside the plate, clear of the logo, and "Heavy planting" in the sky. The section lists "Not in this drawing: A wall of upcycled bottles set into metal mesh".
- **Notes on scroll.** Leaders draw from the dot as each note reaches the middle of the screen, then the label writes on from the leader's end. A label is never cut by the drawing's edge and never runs past two lines.
- **Main floor.** The wall-lamp drawing follows the room drawing, with one "Exposed brick" note.
- **Mezzanine.** The night drawing follows, then "Work late" and "Open until 3 AM, laptop-friendly, quiet corners."
- **Games.** A "Roll the cue ball" button under the still life; tapping it rolls the ball along the felt.
- **Bowling alley.** Only "Recently opened." and the note on the OPEN sign.
- **Lifting the paper.** Tap "Show the photograph" on the entry hall: the notes disappear and the photograph shows with its credit. Tap again: the notes return, aligned.

**C. Night.** Repeat at `?at=01:00`, 390x844:
- Leaders and dots are in night corten on steel.
- Labels sit on a dark tint and read clearly.
- Lamps glow behind the lines on the facade bulbs, the night pendants and the alley sign.
- No pale label chips.

**D. Desktop.** Repeat at 1440x900, `?at=14:00` and `?at=01:00`:
- The heading and description stay sticky in the left column while the drawing scrolls on the right.
- A tall drawing (entry hall, courtyard) is no taller than the screen.
- Labels sit on one line.
- Nothing overflows horizontally.

- [ ] **Step 6: Commit**

```bash
git add lib/annotations.ts lib/annotation-layout.ts components/rooms/Room.tsx components/rooms/Annotations.tsx components/rooms/RollButton.tsx components/rooms/rooms.css app/spaces/page.tsx scripts/annotations-review.ts scripts/e2e/spaces.mjs tests/annotations.test.ts
git commit -m "feat: the rooms page, each drawing annotated in the cafe's own words"
```

---

### Task 19: Moving between pages

**Files:**
- Create: `lib/nav.ts` (`shouldDraw`)
- Create: `components/nav/PenLine.tsx`, `components/nav/pen-line.css`, `components/nav/PenLink.tsx`
- Create: `components/house/flight.ts`
- Create: `components/rooms/HashLanding.tsx`
- Modify: `app/layout.tsx` (wrap the page in `PenLineProvider`)
- Modify: `components/chrome/SiteHeader.tsx` (links become `PenLink`)
- Modify: `components/house/House.tsx` (the pane link's click calls `flyToRoom`)
- Modify: `app/spaces/page.tsx` (renders `HashLanding`)
- Test: `tests/nav.test.ts`, `scripts/e2e/transitions.mjs`

**Interfaces:**
- Consumes:
  - Task 6: `motionAllowed()` from `lib/motion/gsap.ts`.
  - Task 16: `RoomSlug` from `lib/house.ts`; the `House` component in `components/house/House.tsx`, whose panes are `<a href="/spaces#<slug>" aria-label>` elements inside its svg, each nesting a vignette `<svg>`.
  - Task 5: `SiteHeader` and `NAV` from `components/chrome/SiteHeader.tsx`; `app/layout.tsx` with `<LightProvider>` around the header and `<main id="main">` (Task 17 added the footer inside it).
  - Task 18: the `/spaces` sections `section#<slug>` with an `h2`, `.room { scroll-margin-top: 72px }`, and the page root fragment opening with `<div className="rooms-intro wrap">`.
  - Task 5: the tokens `--pen`, `--line-w`, `--paper`, `--ink`, `--ease-pen` and the e2e helpers `BASE`, `launch`, `open`, `shot`, `assert`, `report`.
- Produces:
  - `lib/nav.ts`: `shouldDraw(href: string, pathname: string): boolean`.
  - `components/nav/PenLine.tsx`:
    - `PenLineProvider({ children: ReactNode })`
    - `usePenLine(): { run(): Promise<void> }`
    - the overlay `svg.pen-line[data-state="idle" | "drawing" | "drawn"]`
  - `components/nav/PenLink.tsx`: `PenLink(props: Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & { href: string })`.
  - `components/house/flight.ts`:
    - `flyToRoom(pane: Element, slug: RoomSlug, push: (href: string) => void): Promise<void>`
    - `coverTransform(rect: { left; top; width; height }, vw: number, vh: number): { x: number; y: number; scale: number }`
    - the overlay `div.flight > div` (the flying pane)
  - `components/rooms/HashLanding.tsx`: `HashLanding()`, which renders nothing.

**Notes the engineer needs before starting (verified in `node_modules/next` 15.5.25):**
- **When `onNavigate` fires.** `next/link` calls it inside `linkClicked` (`dist/client/app-dir/link.js`). By then Next has already returned early for modified clicks (`target` other than `_self`, meta, ctrl, shift, alt, middle button), for `download` links and for non-local URLs. It then calls `e.preventDefault()` on the click. If `onNavigate`'s own `preventDefault()` is called, Next does not navigate. So `PenLink` gets modifier-click and external-URL skipping for free, and only adds the same-page check.
- **Types.** `onNavigate?: (event: { preventDefault: () => void }) => void` is typed in `dist/client/link.d.ts`. `useRouter()` from `next/navigation` returns `push(href: string, options?: { scroll?: boolean }): void`.
- **Hash scroll on client navigation.** `router.push("/spaces#courtyard")` records the hash (`navigate-reducer.js` `mutable.hashFragment`), and the layout router calls `scrollIntoView()` on the element with that id after render. `HashLanding` repeats the landing on hard loads and after web fonts settle, and the CSS `scroll-margin-top` keeps the heading below the sticky header.
- **Why WAAPI, not GSAP.** The pen line and the flight use the Web Animations API with the pen curve's CSS form (`cubic-bezier(0.3, 0, 0.18, 1)`, the same value as `--ease-pen`). They then never wait for GSAP to download before a navigation, and they animate only `stroke-dashoffset`, `transform` and `opacity`.
- **Reduced motion.** Every transition becomes a 150 ms crossfade of `#main` (spec section 7).

- [ ] **Step 1: Write the failing tests**

`tests/nav.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { coverTransform } from "@/components/house/flight";
import { shouldDraw } from "@/lib/nav";

describe("shouldDraw", () => {
  it("draws the pen line for another page on the site", () => {
    expect(shouldDraw("/press", "/")).toBe(true);
    expect(shouldDraw("/spaces#games", "/")).toBe(true);
    expect(shouldDraw("/", "/visit")).toBe(true);
  });
  it("skips same-page links and hash links", () => {
    expect(shouldDraw("#games", "/spaces")).toBe(false);
    expect(shouldDraw("/spaces#games", "/spaces")).toBe(false);
    expect(shouldDraw("/visit", "/visit")).toBe(false);
    expect(shouldDraw("?at=01:00", "/visit")).toBe(false);
  });
  it("skips external and scheme links", () => {
    for (const href of ["https://wa.me/918780591708", "tel:+918780591708", "mailto:hello@example.com", "//example.com/x"]) {
      expect(shouldDraw(href, "/"), href).toBe(false);
    }
  });
});

describe("coverTransform", () => {
  it("scales a pane about its centre until it covers the viewport", () => {
    const t = coverTransform({ left: 20, top: 300, width: 175, height: 140 }, 390, 844);
    expect(t.scale).toBeCloseTo(Math.max(390 / 175, 844 / 140), 6);
    expect(t.x).toBeCloseTo(195 - 107.5, 6);
    expect(t.y).toBeCloseTo(422 - 370, 6);
  });
  it("covers both axes for a wide pane", () => {
    const t = coverTransform({ left: 100, top: 100, width: 400, height: 100 }, 1440, 900);
    expect(400 * t.scale).toBeGreaterThanOrEqual(1440);
    expect(100 * t.scale).toBeGreaterThanOrEqual(900);
  });
});
```

`scripts/e2e/transitions.mjs`:

```js
// Run against production: npm run build && (npm start &) && sleep 6 && node scripts/e2e/transitions.mjs
import { BASE, assert, launch, open, report, shot } from "./lib.mjs";

const browser = await launch();
const lineState = (page) => page.locator(".pen-line").getAttribute("data-state", { timeout: 1000 }).catch(() => null);
const mainOpacity = (page) => page.locator("#main").evaluate((e) => Number(getComputedStyle(e).opacity));
const headingInView = (page, id, timeout = 4000) => page.waitForFunction((slug) => {
  const r = document.querySelector(`#${slug} h2`)?.getBoundingClientRect();
  return !!r && r.top >= 0 && r.bottom <= window.innerHeight;
}, id, { timeout }).then(() => true, () => false);

// 1. A header link draws the pen line, then the route changes (phone, day).
{
  const { page, ctx, errors } = await open(browser, "/press", { at: "14:00" });
  await page.locator(".site-menu-button").click();
  await page.locator('.site-menu a[href="/visit"]').click();
  await page.waitForTimeout(150);
  const state = await lineState(page);
  assert(state === "drawing", `the pen line draws first (${state})`);
  assert(new URL(page.url()).pathname === "/press", "the route waits for the line");
  await shot(page, "transition-pen-390-day");
  const arrived = await page.waitForURL("**/visit", { timeout: 5000 }).then(() => true, () => false);
  assert(arrived, "arrives at /visit");
  const cleared = await page.waitForFunction(() => document.querySelector(".pen-line")?.getAttribute("data-state") === "idle", null, { timeout: 3000 }).then(() => true, () => false);
  assert(cleared, "the line fades once the new page is in");

  await page.locator(".site-menu-button").click();
  const [popup] = await Promise.all([
    ctx.waitForEvent("page", { timeout: 5000 }).catch(() => null),
    page.locator('.site-menu a[href="/menu"]').click({ modifiers: ["ControlOrMeta"] }),
  ]);
  assert(!!popup, "a modifier-click opens a new tab");
  assert((await lineState(page)) === "idle", "a modifier-click draws no line");
  assert(new URL(page.url()).pathname === "/visit", "a modifier-click leaves this tab where it is");
  await popup?.close();
  assert(errors.length === 0, `no console errors (${errors.join(" | ")})`);
  await ctx.close();
}

// 2. Reduced motion: a 150 ms crossfade, no line.
{
  const { page, ctx } = await open(browser, "/press", { reducedMotion: true });
  await page.locator(".site-menu-button").click();
  await page.locator('.site-menu a[href="/visit"]').click();
  await page.waitForTimeout(70);
  const o = await mainOpacity(page);
  assert(o < 1, `reduced motion: the page crossfades (${o.toFixed(2)})`);
  assert((await lineState(page)) === "idle", "reduced motion: no pen line");
  await page.waitForURL("**/visit", { timeout: 3000 }).catch(() => null);
  await page.waitForTimeout(500);
  assert((await mainOpacity(page)) === 1, "reduced motion: the new page is fully visible");
  await ctx.close();
}

// 3. Tapping a pane flies into the room (phone, day).
{
  const { page, ctx, errors } = await open(browser, "/", { at: "14:00" });
  await page.keyboard.press("Shift");
  const pane = page.locator('svg a[href="/spaces#courtyard"]').first();
  await pane.waitFor({ state: "visible", timeout: 5000 });
  await page.waitForTimeout(300);
  await pane.click();
  await page.waitForTimeout(400);
  const scale = await page.evaluate(() => {
    const box = document.querySelector(".flight > div");
    return box ? new DOMMatrix(getComputedStyle(box).transform).a : 0;
  });
  assert(scale > 1.2, `the pane flies toward the viewer (scale ${scale.toFixed(2)})`);
  await shot(page, "transition-flight-390-day");
  const url = await page.waitForURL("**/spaces#courtyard", { timeout: 5000 }).then(() => true, () => false);
  assert(url, "the URL becomes /spaces#courtyard");
  assert(await headingInView(page, "courtyard"), "lands with the courtyard heading in view");
  const gone = await page.waitForFunction(() => !document.querySelector(".flight"), null, { timeout: 3000 }).then(() => true, () => false);
  assert(gone, "the flight crossfades away and is removed");
  await shot(page, "transition-landed-390-day");
  assert(errors.length === 0, `no console errors (${errors.join(" | ")})`);
  await ctx.close();
}

// 4. A hard load of /spaces#games lands on the room (phone, night).
{
  const { page, ctx, errors } = await open(browser, "/press", { at: "01:00" });
  await page.goto(`${BASE}/spaces?at=01:00#games`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const top = await page.locator("#games h2").evaluate((e) => e.getBoundingClientRect().top);
  assert(top >= 0 && top < 300, `hard load lands on the games heading (${Math.round(top)} px)`);
  await shot(page, "transition-hash-390-night");
  assert(errors.length === 0, `no console errors (${errors.join(" | ")})`);
  await ctx.close();
}

// 5. Reduced motion: a pane crossfades to its room.
{
  const { page, ctx } = await open(browser, "/", { reducedMotion: true });
  await page.locator('svg a[href="/spaces#entry"]').first().click();
  await page.waitForTimeout(60);
  assert((await page.locator(".flight").count()) === 0, "reduced motion: no flight");
  await page.waitForURL("**/spaces#entry", { timeout: 3000 }).catch(() => null);
  const ok = await page.waitForFunction(() => {
    const r = document.querySelector("#entry h2")?.getBoundingClientRect();
    return !!r && r.top >= 0 && r.bottom <= window.innerHeight && getComputedStyle(document.getElementById("main")).opacity === "1";
  }, null, { timeout: 3000 }).then(() => true, () => false);
  assert(ok, "reduced motion: crossfades to the entry hall heading");
  await ctx.close();
}

// 6. Desktop at night: the line spans the viewport.
{
  const { page, ctx } = await open(browser, "/visit", { width: 1440, height: 900, at: "01:00" });
  await page.locator(".site-menu-button").click();
  await page.locator('.site-menu a[href="/spaces"]').click();
  await page.waitForTimeout(300);
  const d = await page.locator(".pen-line path").getAttribute("d");
  assert(/^M0 \d+L1\d{3} \d+$/.test(d ?? ""), `the line spans the desktop viewport (${d})`);
  await shot(page, "transition-pen-1440-night");
  await ctx.close();
}

await browser.close();
report();
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- nav`
Expected: FAIL with `Failed to resolve import "@/components/house/flight"`.

Stop any server on 3022, then run: `npm run build && (npm start &) && sleep 6 && node scripts/e2e/transitions.mjs`
Expected: `FAIL the pen line draws first (null)`, `FAIL the route waits for the line`, `FAIL the pane flies toward the viewer (scale 0.00)` and more, ending in `n failure(s)` with exit code 1.

- [ ] **Step 3: Implement**

`lib/nav.ts`:

```ts
/** Whether a link should draw the pen line before navigating: only for another page of this site. */
export function shouldDraw(href: string, pathname: string): boolean {
  if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("//")) return false;
  if (href.startsWith("#") || href.startsWith("?")) return false;
  const target = href.split("#")[0].split("?")[0] || pathname;
  return target !== pathname;
}
```

`components/nav/pen-line.css`:

```css
.pen-line { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 80; pointer-events: none; opacity: 0; overflow: visible; }
.pen-line[data-state="drawing"],
.pen-line[data-state="drawn"] { opacity: 1; }
.pen-line path { fill: none; stroke: var(--pen); stroke-width: var(--line-w); stroke-linecap: round; vector-effect: non-scaling-stroke; }
```

`components/nav/PenLine.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { motionAllowed } from "@/lib/motion/gsap";
import "./pen-line.css";

export interface PenLine { run(): Promise<void> }

const Ctx = createContext<PenLine | null>(null);
/** The pen curve as CSS: the same value as --ease-pen in app/globals.css. */
const PEN = "cubic-bezier(0.3, 0, 0.18, 1)";

/**
 * One horizontal pen line drawn across the screen before a page change, faded once the new page is in.
 * Under reduced motion, #main crossfades over 150 ms instead.
 */
export function PenLineProvider({ children }: { children: ReactNode }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const running = useRef<Promise<void> | null>(null);
  const mode = useRef<"line" | "fade" | null>(null);
  const held = useRef<Animation[]>([]);
  const safety = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  const settle = useCallback(() => {
    window.clearTimeout(safety.current);
    const svg = svgRef.current;
    const main = document.getElementById("main");
    const release = () => {
      held.current.forEach((a) => a.cancel());
      held.current = [];
    };
    if (mode.current === "line" && svg) {
      const fade = svg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, easing: PEN, fill: "forwards" });
      fade.onfinish = () => {
        if (mode.current !== null) return;
        svg.setAttribute("data-state", "idle");
        release();
        fade.cancel();
      };
    } else if (mode.current === "fade") {
      release();
      main?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "linear" });
    }
    mode.current = null;
    running.current = null;
  }, []);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    settle();
  }, [pathname, settle]);

  const run = useCallback((): Promise<void> => {
    if (running.current) return running.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    let done: Promise<unknown>;
    if (!motionAllowed() || !svg || !path) {
      mode.current = "fade";
      const main = document.getElementById("main");
      const out = main?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: "linear", fill: "forwards" });
      if (out) held.current.push(out);
      done = out ? out.finished : Promise.resolve();
    } else {
      mode.current = "line";
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;
      const y = Math.round(h / 2);
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      path.setAttribute("d", `M0 ${y}L${w} ${y}`);
      path.style.strokeDasharray = `${w} ${w}`;
      svg.setAttribute("data-state", "drawing");
      const draw = path.animate([{ strokeDashoffset: `${w}` }, { strokeDashoffset: "0" }], { duration: 500, easing: PEN, fill: "forwards" });
      held.current.push(draw);
      done = draw.finished.then(() => svg.setAttribute("data-state", "drawn"));
    }
    safety.current = window.setTimeout(settle, 5000);
    running.current = done.then(() => undefined, () => undefined);
    return running.current;
  }, [settle]);

  const value = useMemo(() => ({ run }), [run]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <svg ref={svgRef} className="pen-line" data-state="idle" aria-hidden="true" focusable="false" viewBox="0 0 390 844" preserveAspectRatio="none">
        <path ref={pathRef} d="M0 422L390 422" />
      </svg>
    </Ctx.Provider>
  );
}

export function usePenLine(): PenLine {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePenLine must be used inside <PenLineProvider>");
  return v;
}
```

`components/nav/PenLink.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { shouldDraw } from "@/lib/nav";
import { usePenLine } from "./PenLine";

type Props = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & { href: string };

/**
 * next/link that draws the pen line before the route changes.
 * Next only calls onNavigate for unmodified, same-origin clicks without `download`
 * (next/dist/client/app-dir/link.js, linkClicked), so modifier-clicks and external URLs
 * keep the browser's behaviour; same-page links are skipped here.
 */
export function PenLink({ href, children, ...rest }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { run } = usePenLine();
  const draw = shouldDraw(href, pathname);
  return (
    <Link
      {...rest}
      href={href}
      onNavigate={
        draw
          ? (e) => {
              e.preventDefault();
              void run().then(() => router.push(href));
            }
          : undefined
      }
    >
      {children}
    </Link>
  );
}
```

`components/house/flight.ts`:

```ts
import type { RoomSlug } from "@/lib/house";
import { motionAllowed } from "@/lib/motion/gsap";

/** The pen curve as CSS: the same value as --ease-pen in app/globals.css. */
const PEN = "cubic-bezier(0.3, 0, 0.18, 1)";

type Rect = { left: number; top: number; width: number; height: number };

/** Translate and scale that carry a pane's centre to the viewport's centre and make it cover the viewport. */
export function coverTransform(rect: Rect, vw: number, vh: number): { x: number; y: number; scale: number } {
  return {
    x: vw / 2 - (rect.left + rect.width / 2),
    y: vh / 2 - (rect.top + rect.height / 2),
    scale: Math.max(vw / rect.width, vh / rect.height),
  };
}

let current: Promise<void> | null = null;

/** Resolves when /spaces is showing and the room's heading is inside the viewport (or after `timeout` ms). */
function roomInView(slug: RoomSlug, timeout = 4000): Promise<void> {
  const started = performance.now();
  return new Promise((resolve) => {
    const tick = () => {
      const r = window.location.pathname === "/spaces" ? document.getElementById(slug)?.querySelector("h2")?.getBoundingClientRect() : undefined;
      if ((r && r.top >= 0 && r.bottom <= window.innerHeight) || performance.now() - started > timeout) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

async function crossfade(slug: RoomSlug, href: string, push: (href: string) => void): Promise<void> {
  const main = document.getElementById("main");
  const out = main?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: "linear", fill: "forwards" });
  await out?.finished.catch(() => undefined);
  push(href);
  await roomInView(slug);
  out?.cancel();
  main?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "linear" });
}

async function fly(pane: Element, slug: RoomSlug, href: string, push: (href: string) => void): Promise<void> {
  const rect = pane.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const overlay = document.createElement("div");
  overlay.className = "flight";
  overlay.setAttribute("aria-hidden", "true");
  Object.assign(overlay.style, { position: "fixed", inset: "0", zIndex: "70", pointerEvents: "none", overflow: "hidden" });
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "absolute",
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    background: "var(--paper)",
    transformOrigin: "50% 50%",
    willChange: "transform",
  });
  const vignette = pane.querySelector("svg");
  if (vignette) {
    const clone = vignette.cloneNode(true) as SVGSVGElement;
    for (const attr of ["x", "y", "width", "height"]) clone.removeAttribute(attr);
    clone.classList.add("drawing");
    Object.assign(clone.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });
    box.appendChild(clone);
  }
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  try {
    const t = coverTransform(rect, vw, vh);
    const grow = box.animate(
      [{ transform: "translate(0px, 0px) scale(1)" }, { transform: `translate(${t.x}px, ${t.y}px) scale(${t.scale})` }],
      { duration: 800, easing: PEN, fill: "forwards" },
    );
    await grow.finished;
    push(href);
    await roomInView(slug);
    const fade = overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, easing: PEN, fill: "forwards" });
    await fade.finished.catch(() => undefined);
  } finally {
    overlay.remove();
  }
}

/**
 * The pane flies in (transform only, 0.8 s), the route becomes /spaces#<slug>, and the overlay crossfades
 * away once the room's heading is in view. Reduced motion: a 150 ms crossfade of #main.
 */
export function flyToRoom(pane: Element, slug: RoomSlug, push: (href: string) => void): Promise<void> {
  if (current) return current;
  const href = `/spaces#${slug}`;
  current = (motionAllowed() ? fly(pane, slug, href, push) : crossfade(slug, href, push)).finally(() => {
    current = null;
  });
  return current;
}
```

`components/rooms/HashLanding.tsx`:

```tsx
"use client";

import { useEffect } from "react";

/** On arrival at /spaces#<room>, puts the room under the header at once, and again when web fonts settle, unless the visitor has already moved. */
export function HashLanding() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let moved = false;
    const stop = () => {
      moved = true;
    };
    const land = () => {
      if (!moved) document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
    };
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchstart", stop, { passive: true, once: true });
    window.addEventListener("keydown", stop, { once: true });
    land();
    const frame = requestAnimationFrame(land);
    void document.fonts.ready.then(land);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, []);
  return null;
}
```

**`app/layout.tsx`: three exact edits.**
1. Add the import after the `SiteHeader` import:

   ```tsx
   import { PenLineProvider } from "@/components/nav/PenLine";
   ```

2. Replace the line `<LightProvider>` with:

   ```tsx
           <LightProvider>
             <PenLineProvider>
   ```

3. Replace the line `</LightProvider>` with:

   ```tsx
             </PenLineProvider>
           </LightProvider>
   ```

Everything that was inside `LightProvider` (the header, `<main id="main">` and the footer from Task 17) is now inside `PenLineProvider`.

`components/chrome/SiteHeader.tsx` (replace the whole file; the only changes from Task 5 are `PenLink` in place of `Link`, and its import):

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { PenLink } from "@/components/nav/PenLink";
import { cafe } from "@/lib/cafe";
import { Mark } from "./Mark";

export const NAV = [
  { href: "/spaces", label: "The rooms" },
  { href: "/host", label: "Host something" },
  { href: "/shoot", label: "Shoot here" },
  { href: "/bowl", label: "Bowl" },
  { href: "/menu", label: "Menu" },
  { href: "/press", label: "Written about" },
  { href: "/visit", label: "Visit" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="site-header wrap">
      <PenLink href="/" className="site-brand" aria-label={`${cafe.meta.name}, home`}>
        <Mark size={30} />
        <span className="t-label" style={{ color: "var(--ink)" }}>{cafe.meta.name}</span>
      </PenLink>
      <button type="button" className="site-menu-button t-label" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        {open ? "Close" : "Rooms"}
      </button>
      <nav id={id} className="site-menu" data-open={open ? "" : undefined} aria-label="Site">
        <ul>
          {NAV.map((l) => (
            <li key={l.href}><PenLink className="t-head" href={l.href} aria-current={pathname === l.href ? "page" : undefined}>{l.label}</PenLink></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

If Task 5's `SiteHeader.tsx` on disk differs from Task 5's text, make only these edits instead:
- Swap `import Link from "next/link";` for `import { PenLink } from "@/components/nav/PenLink";`.
- Rename every `<Link` to `<PenLink` and every `</Link>` to `</PenLink>`.

**`components/house/House.tsx`: the pane link handler (three exact edits to Task 16's file).**

1. **Imports.** Add these to the import block. If the file already imports from `"react"` or `"next/navigation"`, merge the names into those lines instead of adding duplicates.

   ```tsx
   import { useRouter } from "next/navigation";
   import type { MouseEvent } from "react";
   import { flyToRoom } from "./flight";
   ```

2. **The handler.** Add these as the first statements inside `export function House(`. Leave out `const router = useRouter();` if the component already has a `router` from `useRouter()`.

   ```tsx
   const router = useRouter();
   /** A plain click on a pane flies into its room; modified clicks keep the link's own behaviour. */
   const onPane = (event: MouseEvent<HTMLAnchorElement>, slug: RoomSlug) => {
     if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
     event.preventDefault();
     void flyToRoom(event.currentTarget, slug, (href) => router.push(href));
   };
   ```

   `RoomSlug` is already imported in `House.tsx` from `@/lib/house` (Task 16). If it is not, add `type RoomSlug` to that import.

3. **The pane anchor.** Find it with `grep -n 'href={`/spaces#' components/house/House.tsx`: the one `<a` inside the panes `.map(...)`. Add an `onClick` attribute to its opening tag that passes the same slug expression its `href` uses. With the map variable named `pane` (use whatever name the file uses), the tag changes from

   ```tsx
   <a key={pane.slug} href={`/spaces#${pane.slug}`} aria-label={pane.name}>
   ```

   to

   ```tsx
   <a key={pane.slug} href={`/spaces#${pane.slug}`} aria-label={pane.name} onClick={(event) => onPane(event, pane.slug)}>
   ```

   Keep every other attribute of that tag exactly as it is. If the tag already has an `onClick`, move that handler's body into the new arrow function, before `onPane(event, pane.slug)`.

   Check: `grep -n "onPane\|flyToRoom" components/house/House.tsx` prints the import, the handler (two lines) and the `onClick`, at least four lines.

**`app/spaces/page.tsx`: two exact edits to Task 18's file.**
1. Add after `import { RollButton } from "@/components/rooms/RollButton";`:

   ```tsx
   import { HashLanding } from "@/components/rooms/HashLanding";
   ```

2. Replace

   ```tsx
       <>
         <div className="rooms-intro wrap">
   ```

   with

   ```tsx
       <>
         <HashLanding />
         <div className="rooms-intro wrap">
   ```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- nav`
Expected: PASS (5 tests: 3 for `shouldDraw`, 2 for `coverTransform`).

Stop any server on 3022, then run: `npm run build && (npm start &) && sleep 6 && node scripts/e2e/transitions.mjs`
Expected: every line `ok`, ending `all checks passed`. `shots/transition-pen-390-day.png`, `transition-flight-390-day.png`, `transition-landed-390-day.png`, `transition-hash-390-night.png` and `transition-pen-1440-night.png` are written.

Run: `node scripts/e2e/spaces.mjs && npm test && npm run lint`
Expected: `all checks passed` from the rooms page check (the `HashLanding` edit changed nothing visible), then PASS with no lint or type errors.

- [ ] **Step 5: Look**

Use Playwright MCP against `http://localhost:3022`.

**Phone, day.** 390x844, `?at=14:00`.
- **The pen line.** On `/press`, open the menu, tap "Visit" and screenshot about 250 ms later.
  - One corten line, crossing the middle of the screen from the left edge, about half drawn.
  - The line has round caps, the same weight as the drawings and no blur.
  - The page has not moved yet.
  - Screenshot after the route changes: the line fades out over `/visit` and no line is left behind.
- **The flight.** On `/`, press a key to skip the arrival, tap the courtyard pane and screenshot about 450 ms later.
  - The pane has grown from its place toward the whole screen, on a paper ground.
  - The vignette's lines are thicker but it still reads as the courtyard.
  - The rest of the house is still visible around it.
  - Screenshot after landing: the courtyard heading sits just below the header, the room's drawing is below it, and the overlay is gone.
  - At no point does the home page flash through, or the page jump after landing.

**Phone, night.** Repeat both at `?at=01:00`, 390x844.
- The line is night corten on steel.
- The flying pane's ground is the night paper, not a light rectangle, and its lines are night ink.

**Desktop.** Repeat both at 1440x900, day and night.
- The line runs the full width.
- The flying pane scales from its place in the house to cover the screen without distortion.
- The header menu closes as the new page arrives.

**Hard load.** Open `/spaces?at=14:00#mezzanine` directly at 390x844: the mezzanine heading is under the header, not hidden behind it.

- [ ] **Step 6: Commit**

```bash
git add lib/nav.ts components/nav/PenLine.tsx components/nav/pen-line.css components/nav/PenLink.tsx components/house/flight.ts components/rooms/HashLanding.tsx app/layout.tsx components/chrome/SiteHeader.tsx components/house/House.tsx app/spaces/page.tsx tests/nav.test.ts scripts/e2e/transitions.mjs
git commit -m "feat: the pen line between pages and the pane flight into a room"
```

---

### Task 20: Host, shoot and bowl

This task ports the three revenue pages from option one: `docs/reference/barnyard-v1/app/{host,shoot,bowl}/page.tsx`, `components/product/*`, `components/EnquiryForm.tsx` and `components/ui.tsx`. It keeps their honest copy and fact handling and restyles them as drafting film:
- Ysabeau Office for display and labels, Hedvig Letters Serif for reading.
- Hairline fields, a corten focus mark, 44 px targets.
- Every photograph slot of option one (`Figure`, `ProofRow` frames) becomes a `<Sheet>` drawing or text. Nothing on these pages is a stock image or a placeholder.

Enquiries compose a WhatsApp message only (CLAUDE.md), so the ported form drops option one's email branch.

**Files:**
- Modify: `vitest.config.ts` (add `esbuild: { jsx: "automatic" }` so tests can render `.tsx` components; Next's tsconfig sets `jsx: "preserve"`, which esbuild would otherwise follow)
- Create: `components/ui.tsx`, `components/forms/EnquiryForm.tsx`, `components/product/RequestForm.tsx`, `components/product/KeyFacts.tsx`, `components/product/SpecBlock.tsx`, `components/product/StickyBar.tsx`, `components/product/product.css`
- Create: `components/host/LampRow.tsx`
- Create: `components/shoot/frames.ts` (pure frame geometry; a server component cannot call functions exported from a `"use client"` module, so the geometry lives here), `components/shoot/Viewfinder.tsx` (server), `components/shoot/ViewfinderFrames.tsx` (client), `components/shoot/viewfinder.css`
- Create: `app/host/page.tsx`, `app/shoot/page.tsx`, `app/bowl/page.tsx`
- Test: `tests/product.test.ts`, `scripts/e2e/product.mjs`

**Interfaces:**
- Consumes:
  - `lib/cafe.ts` (Task 1): `cafe`, `fact`, `rooms`, `roomWord`, `capitalise`, `eventDate`, `pressDate`, `phoneHref`, `whatsappHref`, `whatsappWith`.
  - `lib/daylight.ts` (Task 1): `formatClock`.
  - `lib/draw/primitives.ts` (Task 2): `n`, `arc`, `curve`, `line`, `repeat`.
  - `lib/draw/glyphs.ts` (Task 2): `bulb`.
  - `lib/draw/types.ts` (Task 2): the `Drawing`, `Glow`, `P` and `Stroke` types.
  - `lib/drawings.ts` (Task 3): `metaFor`, `frameOf`.
  - `drawings/index.ts` (Task 3): `drawingFor`. The drawings used: `main-floor` (Task 9), `alley-sign` (Task 12), `hoodie` and `nocatch` (Task 13).
  - `lib/motion/gsap.ts` (Task 6): `loadGsap`, `motionAllowed`.
  - `components/draw/Drawing.tsx` (Task 6): `Drawing`. After Task 15 it calls `startLife`, so `bulb-*` strokes chase after dark.
  - `components/draw/Sheet.tsx` (Task 14): `<Sheet id mode? title? caption? className? />`. It renders `figure.sheet` and, for `lift` drawings, `button.sheet-toggle`.
  - `components/nav/PenLink.tsx` (Task 19): `PenLink`.
  - CSS tokens and classes (Task 5): `.wrap .t-display .t-head .t-line .t-body .t-label .num .sr-only .pen-link .btn .btn-primary .drawing .glow`.
  - `scripts/e2e/lib.mjs`: `BASE`, `launch`, `open`, `shot`, `assert`, `report`.
- Produces:
  - `components/ui.tsx`:
    - `isPresent(value: unknown): boolean`.
    - `ExtGlyph()`.
    - `TextLink({ href: string; quiet?: boolean; children: ReactNode } & AnchorHTMLAttributes)`: class `pen-link`. Internal links go through `PenLink`. External links open in a new tab, with the stroked glyph kept on the same line as the last word.
    - `ButtonLink({ href: string; primary?: boolean; children: ReactNode } & AnchorHTMLAttributes)`: classes `btn`, `btn-primary`.
    - `interface FactRow { term: string; value?: ReactNode | null | false }`.
    - `FactFile({ rows: FactRow[]; className?: string })`: renders `dl.factfile`; rows without a value are left out, and nothing renders when every row is empty.
    - Importing `ui.tsx` also loads `components/product/product.css`, so every page that uses these components gets the page classes: `.page-head .page-head-copy .section .page-grid .col-side .col-main .stack .pair .actions .links-row .t-title .keyfacts .factfile .specblock .specblock-title .happenings .happening .room-rows .room-row .request .form-grid .field .field-wide .field-optional .form-send .select .sticky-bar .lamp-row .nowrap .ext .pen-link-quiet`.
  - `components/forms/EnquiryForm.tsx`:
    - `interface EnquiryField { name: string; label: string; type?: "text" | "email" | "tel" | "contact" | "date" | "time" | "number" | "select" | "textarea"; options?: string[]; required?: boolean; span?: boolean }`.
    - `composeMessage(subject: string, fields: EnquiryField[], values: Record<string, string>): string`.
    - `EnquiryForm({ subject: string; fields: EnquiryField[]; whatsapp: string })`: opens `whatsapp?text=…` in a new tab and stores nothing.
  - `components/product/RequestForm.tsx`: `type RequestKind = "host" | "shoot" | "bowl"`, `REQUEST_FIELDS: Record<RequestKind, EnquiryField[]>`, `RequestForm({ kind: RequestKind })`.
  - `components/product/KeyFacts.tsx`: `interface KeyFact { label: string; value?: ReactNode | null | false }`, `KeyFacts({ items: KeyFact[] })` rendering `dl.keyfacts`.
  - `components/product/SpecBlock.tsx`: `interface SpecGroup { title: string; rows: FactRow[] }`, `SpecBlock({ groups: SpecGroup[] })`.
  - `components/product/StickyBar.tsx`: `StickyBar({ text: string })` renders `div.sticky-bar`, phones only. It carries `data-hidden` on the first screen and while the page's form is in view.
  - `components/host/LampRow.tsx`:
    - `lampRowDrawing(count?: number): Drawing`: id `lamp-row`, frame 1080 x 260, bulbs `bulb-0` to `bulb-<count-1>` on the lamp layer, one glow per bulb.
    - `LampRow({ count?: number })`: a `div.lamp-row` around a scrub-mode `<Drawing>`.
  - `components/shoot/frames.ts`: `type Frame = [number, number, number, number]`, `MAIN_FLOOR_FRAMES: Frame[]`, `aspectLabel(frame: Frame): string`, `frameInside(frame: Frame, crop: Frame): boolean`, `bracketPath(frame: Frame, arm: number): string`, `mattePath(box: { x: number; y: number; width: number; height: number }, frame: Frame): string`.
  - `components/shoot/Viewfinder.tsx`: `Viewfinder({ id: string; frames: Frame[]; caption?: string })`.
    - The caption defaults to "One house, many sets.".
    - It throws at render if a frame lies outside the drawing's crop.
    - DOM: `figure.viewfinder > div.viewfinder-stage[data-frame]`. The stage holds the drawing, an `svg.viewfinder-overlay` (with `path.viewfinder-matte` and `path.viewfinder-brackets`) and a `span.viewfinder-format`.
  - Routes `/host`, `/shoot` and `/bowl`, each with its own `metadata`.

**The three compositions.** Measured on the grid of `raw/ad-1.jpg`, inside the main floor crop `[250, 0, 1080, 625]`:

| Frame | Aspect | What it holds |
|---|---|---|
| `[270, 20, 1070, 470]` | 16:9 | The whole stair climbing past the mezzanine railing, the potted plants on the upper landing, the plants at the stair's foot and the steel beams overhead |
| `[640, 20, 1060, 545]` | 4:5 | The upper flight against the brick wall, the framed picture (x 920 to 1025, y 245 to 310) and the plants below it |
| `[280, 245, 660, 625]` | 1:1 | Under the mezzanine: the round tables and chairs, the lounge seating and the pots at the foot of the stair |

The server renders the first frame, and reduced motion keeps it. So the page is correct at rest and without JavaScript.

- [ ] **Step 1: Write the failing tests**

`tests/product.test.ts`:

```ts
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { composeMessage } from "@/components/forms/EnquiryForm";
import { lampRowDrawing } from "@/components/host/LampRow";
import { KeyFacts } from "@/components/product/KeyFacts";
import { REQUEST_FIELDS, type RequestKind } from "@/components/product/RequestForm";
import { SpecBlock } from "@/components/product/SpecBlock";
import { MAIN_FLOOR_FRAMES, aspectLabel, bracketPath, frameInside, mattePath, type Frame } from "@/components/shoot/frames";
import { fact } from "@/lib/cafe";
import { metaFor } from "@/lib/drawings";

describe("KeyFacts", () => {
  it("drops empty and flagged values", () => {
    const html = renderToStaticMarkup(
      createElement(KeyFacts, {
        items: [
          { label: "Size", value: "10,000 sq ft" },
          { label: "Capacity", value: fact("UNKNOWN") },
          { label: "Empty", value: "" },
          { label: "False", value: false },
          { label: "Null", value: null },
        ],
      }),
    );
    expect(html).toContain("Size");
    expect(html).not.toMatch(/Capacity|Empty|False|Null|UNKNOWN/);
    expect(html.match(/<dt/g)).toHaveLength(1);
  });
  it("renders nothing when nothing is known", () => {
    expect(renderToStaticMarkup(createElement(KeyFacts, { items: [{ label: "Price", value: fact("UNKNOWN") }] }))).toBe("");
  });
});

describe("SpecBlock", () => {
  it("drops rows without a value and groups with nothing known", () => {
    const html = renderToStaticMarkup(
      createElement(SpecBlock, {
        groups: [
          { title: "Access", rows: [{ term: "Parking", value: "Ample parking" }, { term: "Geo", value: fact("UNKNOWN") }] },
          { title: "Rates", rows: [{ term: "Per day", value: fact("CONFIRM — ask") }, { term: "Per hour", value: undefined }] },
        ],
      }),
    );
    expect(html).toContain("Access");
    expect(html).toContain("Ample parking");
    expect(html).not.toMatch(/Geo|Rates|Per day|Per hour|CONFIRM|UNKNOWN/);
  });
  it("renders nothing when no group has a value", () => {
    expect(renderToStaticMarkup(createElement(SpecBlock, { groups: [{ title: "Rates", rows: [{ term: "Per day", value: null }] }] }))).toBe("");
  });
});

describe("RequestForm fields", () => {
  const names = (k: RequestKind) => REQUEST_FIELDS[k].map((f) => f.name);
  it("asks each kind of visitor for what the house needs first", () => {
    expect(names("host")).toEqual(["name", "contact", "occasion", "date", "guests", "notes"]);
    expect(names("shoot")).toEqual(["name", "contact", "usage", "dates", "crew", "production", "notes"]);
    expect(names("bowl")).toEqual(["name", "contact", "date", "time", "players", "notes"]);
  });
  it("requires a name and a way to reply, and never asks about prices or lanes", () => {
    for (const kind of ["host", "shoot", "bowl"] as RequestKind[]) {
      const byName = Object.fromEntries(REQUEST_FIELDS[kind].map((f) => [f.name, f]));
      expect(byName.name.required, kind).toBe(true);
      expect(byName.contact.required, kind).toBe(true);
      for (const f of REQUEST_FIELDS[kind]) expect(`${f.name} ${f.label}`, kind).not.toMatch(/price|rate|budget|cost|lane/i);
    }
  });
  it("composes a message from filled fields only", () => {
    const msg = composeMessage("Hosting enquiry, The Barnyard Co.", REQUEST_FIELDS.host, {
      name: " Asha ",
      contact: "98765 43210",
      occasion: "Birthday",
      date: "2026-12-01",
      guests: "",
      notes: "   ",
    });
    expect(msg).toBe("Hosting enquiry, The Barnyard Co.\n\nYour name: Asha\nPhone or email: 98765 43210\nThe occasion: Birthday\nThe date: 2026-12-01");
  });
});

describe("viewfinder frames", () => {
  it("keeps three compositions inside the main floor crop", () => {
    const crop = metaFor("main-floor").crop as Frame;
    expect(MAIN_FLOOR_FRAMES).toHaveLength(3);
    for (const f of MAIN_FLOOR_FRAMES) expect(frameInside(f, crop), JSON.stringify(f)).toBe(true);
    expect(frameInside([200, 0, 600, 300], [250, 0, 1080, 625])).toBe(false);
  });
  it("names each composition by its aspect", () => {
    expect(MAIN_FLOOR_FRAMES.map(aspectLabel)).toEqual(["16:9", "4:5", "1:1"]);
  });
  it("draws four corner brackets and a matte with a hole", () => {
    const b = bracketPath([100, 100, 500, 400], 30);
    expect(b.match(/M/g)).toHaveLength(4);
    expect(b).not.toMatch(/NaN/);
    expect(b.startsWith("M100 130L100 100L130 100")).toBe(true);
    const m = mattePath({ x: 250, y: 0, width: 830, height: 625 }, MAIN_FLOOR_FRAMES[0]);
    expect(m.match(/Z/g)).toHaveLength(2);
  });
});

describe("lamp row", () => {
  it("hangs nine bulbs in reading order on the lamp layer, each with a glow", () => {
    const d = lampRowDrawing(9);
    const bulbs = d.strokes.filter((s) => s.id?.startsWith("bulb-"));
    expect(bulbs.map((s) => s.id)).toEqual(Array.from({ length: 9 }, (_, i) => `bulb-${i}`));
    expect(bulbs.every((s) => s.layer === "lamp")).toBe(true);
    expect(d.glows).toHaveLength(9);
    for (const s of d.strokes) expect(s.d).not.toMatch(/NaN|undefined|Infinity/);
  });
});
```

`scripts/e2e/product.mjs`:

```js
// Host, shoot and bowl against production: npm run build && npx next start -p 3022, then node scripts/e2e/product.mjs
import { BASE, assert, launch, open, report, shot } from "./lib.mjs";

const FIELDS = {
  "/host": ["name", "contact", "occasion", "date", "guests", "notes"],
  "/shoot": ["name", "contact", "usage", "dates", "crew", "production", "notes"],
  "/bowl": ["name", "contact", "date", "time", "players", "notes"],
};
const H1 = { "/host": /Borrow the house/, "/shoot": /A set that took/, "/bowl": /The newest room/ };
const KEYFACTS = { "/host": 3, "/shoot": 3, "/bowl": 0 };

const browser = await launch();

for (const path of Object.keys(FIELDS)) {
  for (const [width, height] of [[390, 844], [1440, 900]]) {
    for (const at of ["14:00", "01:00"]) {
      const { page, ctx, errors } = await open(browser, path, { width, height, at });
      const tag = `${path} ${width} ${at}`;
      const res = await ctx.request.get(`${BASE}${path}`);
      assert(res.status() === 200, `${tag}: 200`);
      const h1 = page.locator("h1");
      const h1Text = (await h1.count()) ? await h1.first().innerText() : "";
      assert((await h1.count()) === 1 && H1[path].test(h1Text), `${tag}: one h1 (${h1Text})`);
      const text = await page.locator("body").innerText();
      assert(!/UNKNOWN|CONFIRM/.test(text), `${tag}: no flagged values`);
      assert((await page.locator("main .keyfacts dd").count()) === KEYFACTS[path], `${tag}: ${KEYFACTS[path]} key facts`);
      const names = await page.locator("main form [name]").evaluateAll((els) => els.map((e) => e.getAttribute("name")));
      assert(JSON.stringify(names) === JSON.stringify(FIELDS[path]), `${tag}: form fields (${names.join(",")})`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert(overflow <= 0, `${tag}: no sideways scroll (${overflow})`);
      assert(errors.length === 0, `${tag}: no console errors (${errors.join(" | ")})`);
      await page.waitForTimeout(2500);
      await shot(page, `product${path.replace("/", "-")}-${width}-${at.replace(":", "")}`, true);
      await ctx.close();
    }
  }
}

// Host: the drawing lifts, the lamps, the phone bar, and the form composes a WhatsApp message.
{
  const { page, ctx } = await open(browser, "/host", { at: "14:00" });
  assert((await page.locator("main figure.sheet").count()) >= 1, "host: the hoodie workshop is drawn");
  assert((await page.locator("main .sheet-toggle").count()) === 1, "host: the hoodie drawing lifts to its photograph");
  assert((await page.locator("main .lamp-row path[id^='bulb-']").count()) === 9, "host: a row of nine lamps beside Coffee Garba");
  assert((await page.locator(".sticky-bar[data-hidden]").count()) === 1, "host: phone bar hidden on the first screen");
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
  await page.waitForTimeout(400);
  assert((await page.locator(".sticky-bar[data-hidden]").count()) === 0, "host: phone bar shows once the first screen is read");
  await page.locator("main form").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  assert((await page.locator(".sticky-bar[data-hidden]").count()) === 1, "host: phone bar steps aside for the form");
  await page.evaluate(() => {
    window.__opened = [];
    window.open = (u) => { window.__opened.push(String(u)); return null; };
  });
  await page.getByLabel("Your name").fill("Asha");
  await page.getByLabel("Phone or email").fill("98765 43210");
  await page.getByLabel("The occasion").selectOption("Birthday");
  await page.getByLabel("The date").fill("2030-01-15");
  await page.getByRole("button", { name: "Send on WhatsApp" }).click();
  const opened = await page.evaluate(() => window.__opened);
  const msg = opened[0] ? decodeURIComponent(opened[0].split("?text=")[1] ?? "") : "";
  assert(opened.length === 1 && opened[0].startsWith("https://wa.me/918780591708?text="), `host: the form opens WhatsApp (${opened[0]})`);
  assert(msg.includes("Your name: Asha") && msg.includes("The occasion: Birthday") && !msg.includes("How many people"), "host: the message carries filled fields only");
  assert(await page.getByText("WhatsApp should open with the message.").isVisible(), "host: the form says what happened");
  await ctx.close();
}
{
  const { page, ctx } = await open(browser, "/host", { at: "01:00" });
  await page.locator("main .lamp-row").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const glow = await page.locator("main .lamp-row .glow").first().evaluate((e) => Number(getComputedStyle(e).opacity));
  assert(glow > 0.5, `host at 01:00: the lamps glow (${glow})`);
  await ctx.close();
}

// Shoot: the viewfinder reframes after the room draws, rests off-screen, holds still under reduced motion.
{
  const { page, ctx } = await open(browser, "/shoot", { width: 1440, height: 900, at: "14:00" });
  const brackets = page.locator(".viewfinder-brackets");
  const format = page.locator(".viewfinder-format");
  assert((await format.innerText()) === "16:9", "shoot: the first composition is the wide");
  assert((await page.locator(".viewfinder figcaption").innerText()).includes("One house, many sets."), "shoot: the caption");
  const d0 = await brackets.getAttribute("d");
  await page.waitForSelector(".viewfinder svg.drawing[data-drawn]", { timeout: 8000 });
  await page.waitForTimeout(3600);
  assert((await brackets.getAttribute("d")) !== d0 && (await format.innerText()) === "4:5", `shoot: the frame moves to the portrait (${await format.innerText()})`);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  const p0 = await brackets.getAttribute("d");
  await page.waitForTimeout(3600);
  assert((await brackets.getAttribute("d")) === p0, "shoot: the frame rests while off-screen");
  assert((await page.locator("main figure.sheet .sheet-toggle").count()) >= 1, "shoot: the NoCatch drawing lifts to its photograph");
  assert(/NoCatch brand film/.test(await page.locator("main").innerText()), "shoot: the NoCatch credit from cafe.json");
  await ctx.close();
}
{
  const { page, ctx } = await open(browser, "/shoot", { width: 1440, height: 900, at: "14:00", reducedMotion: true });
  const d0 = await page.locator(".viewfinder-brackets").getAttribute("d");
  await page.waitForTimeout(4500);
  const still = (await page.locator(".viewfinder-brackets").getAttribute("d")) === d0 && (await page.locator(".viewfinder-format").innerText()) === "16:9";
  assert(still, "shoot, reduced motion: the first composition holds still");
  await ctx.close();
}

// Bowl: nothing we do not know.
{
  const { page, ctx } = await open(browser, "/bowl", { at: "14:00" });
  const main = await page.locator("main").innerText();
  assert(!/₹/.test(main), "bowl: no price");
  assert(!/\b\d+\s+lanes?\b/i.test(main), "bowl: no lane count");
  assert(!/\b\d{1,2}(:\d{2})?\s?(AM|PM)\b/.test(main), "bowl: no hours");
  assert(/Recently opened\./.test(main), "bowl: recently opened");
  assert((await page.locator("main figure.sheet").count()) === 1 && (await page.locator("main .sheet-toggle").count()) === 0, "bowl: the sign is drawn and does not lift");
  for (const slug of ["games", "main-floor", "courtyard"]) {
    assert((await page.locator(`main a[href="/spaces#${slug}"]`).count()) === 1, `bowl: links to /spaces#${slug}`);
  }
  await ctx.close();
}

await browser.close();
report();
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- product`
Expected: FAIL with `Failed to resolve import "@/components/forms/EnquiryForm"` (the modules do not exist yet).

Stop any server on 3022, then in a second terminal: `npm run build && npx next start -p 3022`. Then run: `node scripts/e2e/product.mjs`
Expected: `FAIL /host 390 14:00: 200` and more failures (the routes are 404), ending with `N failure(s)` and exit code 1.

- [ ] **Step 3: Implement**

**3a. `vitest.config.ts`.** Replace it with the version below. If an earlier task already added options, keep them and add only the `esbuild` line.

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  // Next's tsconfig says jsx: "preserve"; tests that render components need esbuild to compile JSX with React's automatic runtime.
  esbuild: { jsx: "automatic" },
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
});
```

**3b. `components/ui.tsx`** (ported: hairline links, the stroked external glyph and never an arrow, fact rows that disappear when empty):

```tsx
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { PenLink } from "@/components/nav/PenLink";
import "./product/product.css";

/** A value is shown only if it exists. fact() has already turned UNKNOWN and CONFIRM into undefined. */
export function isPresent(value: unknown): boolean {
  return value !== undefined && value !== null && value !== false && value !== "";
}

const isExternal = (href: string) => /^https?:\/\//.test(href);
const isDirect = (href: string) => href.startsWith("tel:") || href.startsWith("mailto:");

export function ExtGlyph() {
  return (
    <svg className="ext" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M2.5 9.5 L9.5 2.5 M4.5 2.5 H9.5 V7.5" />
    </svg>
  );
}

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  quiet?: boolean;
  children: ReactNode;
}

/** Underlined text. Internal links draw the pen line on the way out (PenLink); external links carry the stroked glyph. */
export function TextLink({ href, quiet, children, className, ...rest }: TextLinkProps) {
  const cls = `pen-link${quiet ? " pen-link-quiet" : ""}${className ? ` ${className}` : ""}`;
  if (isExternal(href)) {
    // Keep the glyph on the same line as the last word so it never sits alone.
    let head: ReactNode = children;
    let tail: ReactNode = null;
    if (typeof children === "string") {
      const i = children.lastIndexOf(" ");
      head = i > 0 ? children.slice(0, i + 1) : null;
      tail = i > 0 ? children.slice(i + 1) : children;
    }
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        {head}
        <span className="nowrap">
          {tail}
          <ExtGlyph />
        </span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (isDirect(href)) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <PenLink href={href} className={cls} {...rest}>
      {children}
    </PenLink>
  );
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  primary?: boolean;
  children: ReactNode;
}

export function ButtonLink({ href, primary, children, className, ...rest }: ButtonLinkProps) {
  const cls = `btn${primary ? " btn-primary" : ""}${className ? ` ${className}` : ""}`;
  if (isExternal(href)) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (isDirect(href)) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <PenLink href={href} className={cls} {...rest}>
      {children}
    </PenLink>
  );
}

export interface FactRow {
  term: string;
  value?: ReactNode | null | false;
}

/** A definition list. Rows with no value simply do not exist. */
export function FactFile({ rows, className }: { rows: FactRow[]; className?: string }) {
  const items = rows.filter((r) => isPresent(r.value));
  if (items.length === 0) return null;
  return (
    <dl className={`factfile${className ? ` ${className}` : ""}`}>
      {items.map((r) => (
        <div key={r.term}>
          <dt className="t-label">{r.term}</dt>
          <dd className="num">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

**3c. `components/forms/EnquiryForm.tsx`** (ported; WhatsApp only; the message is built by a pure function the test checks):

```tsx
"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

export interface EnquiryField {
  name: string;
  label: string;
  /** "contact" takes a phone number or an email address */
  type?: "text" | "email" | "tel" | "contact" | "date" | "time" | "number" | "select" | "textarea";
  options?: string[];
  required?: boolean;
  span?: boolean;
}

/** The message the café receives: the subject, a blank line, then one "Label: value" line per filled field. */
export function composeMessage(subject: string, fields: EnquiryField[], values: Record<string, string>): string {
  const lines = fields
    .map((f) => {
      const v = (values[f.name] ?? "").trim();
      return v ? `${f.label}: ${v}` : null;
    })
    .filter((l): l is string => l !== null);
  return [subject, "", ...lines].join("\n");
}

function isoToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface EnquiryFormProps {
  subject: string;
  fields: EnquiryField[];
  /** https://wa.me/<number> */
  whatsapp: string;
}

export function EnquiryForm({ subject, fields, whatsapp }: EnquiryFormProps) {
  const id = useId();
  const [sent, setSent] = useState<string | null>(null);
  const [today, setToday] = useState<string | undefined>(undefined);

  // Set after mount so the server and the first client render agree.
  useEffect(() => setToday(isoToday()), []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values = Object.fromEntries(fields.map((f) => [f.name, String(data.get(f.name) ?? "")]));
    const href = `${whatsapp}?text=${encodeURIComponent(composeMessage(subject, fields, values))}`;
    window.open(href, "_blank", "noopener");
    setSent(href);
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      {fields.map((f) => {
        const fid = `${id}-${f.name}`;
        const autoComplete =
          f.type === "email" ? "email" : f.type === "tel" || f.type === "contact" ? "tel" : f.name === "name" ? "name" : undefined;
        return (
          <div key={f.name} className={`field${f.span || f.type === "textarea" ? " field-wide" : ""}`}>
            <label htmlFor={fid} className="t-label">
              {f.label}
              {f.required ? null : <span className="field-optional"> (optional)</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea id={fid} name={f.name} rows={3} required={f.required} />
            ) : f.type === "select" ? (
              <span className="select">
                <select id={fid} name={f.name} required={f.required} defaultValue="">
                  <option value="" disabled>
                    Choose
                  </option>
                  {(f.options ?? []).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </span>
            ) : (
              <input
                id={fid}
                name={f.name}
                type={f.type === "contact" ? "text" : (f.type ?? "text")}
                required={f.required}
                autoComplete={autoComplete}
                inputMode={f.type === "number" ? "numeric" : undefined}
                min={f.type === "date" ? today : f.type === "number" ? 1 : undefined}
              />
            )}
          </div>
        );
      })}
      <div className="field-wide form-send">
        <button type="submit" className="btn btn-primary">
          Send on WhatsApp
        </button>
        <p className="t-label" aria-live="polite">
          {sent ? (
            <>
              WhatsApp should open with the message. If it did not,{" "}
              <a className="pen-link" href={sent} target="_blank" rel="noopener noreferrer">
                open it here
              </a>
              .
            </>
          ) : (
            "Composes a WhatsApp message to the café. Nothing is stored here."
          )}
        </p>
      </div>
    </form>
  );
}
```

**3d. `components/product/RequestForm.tsx`.** The fields are ported unchanged. The promises are softened: the house replies, and nothing is "confirmed".

```tsx
import { EnquiryForm, type EnquiryField } from "@/components/forms/EnquiryForm";
import { ButtonLink } from "@/components/ui";
import { cafe, phoneHref, whatsappHref } from "@/lib/cafe";

export type RequestKind = "host" | "shoot" | "bowl";

const { meta } = cafe;

const HEADING: Record<RequestKind, string> = {
  host: "Ask about hosting.",
  shoot: "Ask about a shoot.",
  bowl: "Ask about a lane.",
};

const POLICY: Record<RequestKind, string> = {
  host: "Tell the house the occasion and the date, and it replies on WhatsApp. Nothing is stored here.",
  shoot: "Send the usage, the dates and the crew size, and the house replies on WhatsApp about availability. Nothing is stored here.",
  bowl: "Say when you would like to come and how many of you there are, and the house replies on WhatsApp. Nothing is stored here.",
};

const SUBJECT: Record<RequestKind, string> = {
  host: `Hosting enquiry, ${meta.name}`,
  shoot: `Shoot enquiry, ${meta.name}`,
  bowl: `Lane request, The Alley at ${meta.name}`,
};

export const REQUEST_FIELDS: Record<RequestKind, EnquiryField[]> = {
  host: [
    { name: "name", label: "Your name", required: true },
    { name: "contact", label: "Phone or email", type: "contact", required: true },
    { name: "occasion", label: "The occasion", type: "select", options: ["Birthday", "Ceremony", "Corporate", "Brand launch", "Private dinner", "Something else"], required: true },
    { name: "date", label: "The date", type: "date", required: true },
    { name: "guests", label: "How many people", type: "number" },
    { name: "notes", label: "Anything else", type: "textarea" },
  ],
  shoot: [
    { name: "name", label: "Your name", required: true },
    { name: "contact", label: "Phone or email", type: "contact", required: true },
    { name: "usage", label: "Usage", type: "select", options: ["Photo", "Film", "Brand film", "Social", "Editorial"], required: true },
    { name: "dates", label: "Dates", required: true },
    { name: "crew", label: "Crew size", type: "number" },
    { name: "production", label: "Production or brand" },
    { name: "notes", label: "Setup, strike, night work, anything else", type: "textarea" },
  ],
  bowl: [
    { name: "name", label: "Your name", required: true },
    { name: "contact", label: "Phone or email", type: "contact", required: true },
    { name: "date", label: "The date", type: "date", required: true },
    { name: "time", label: "Around what time", type: "time" },
    { name: "players", label: "How many players", type: "number" },
    { name: "notes", label: "Anything else", type: "textarea" },
  ],
};

/** What the house needs first, then a short form. One primary action (the form); calling and WhatsApp sit beside it. */
export function RequestForm({ kind }: { kind: RequestKind }) {
  return (
    <section className="request page-grid" aria-labelledby={`request-${kind}`}>
      <div className="col-side">
        <h2 id={`request-${kind}`} className="t-head">
          {HEADING[kind]}
        </h2>
        <p className="t-body">{POLICY[kind]}</p>
        <div className="actions">
          <ButtonLink href={phoneHref}>
            <span className="num">Call {meta.phoneDisplay}</span>
          </ButtonLink>
          <ButtonLink href={whatsappHref}>WhatsApp</ButtonLink>
        </div>
      </div>
      <div className="col-main">
        <EnquiryForm subject={SUBJECT[kind]} fields={REQUEST_FIELDS[kind]} whatsapp={whatsappHref} />
      </div>
    </section>
  );
}
```

**3e. `components/product/KeyFacts.tsx`:**

```tsx
import type { ReactNode } from "react";
import { isPresent } from "@/components/ui";

export interface KeyFact {
  label: string;
  value?: ReactNode | null | false;
}

/** The numbers a buyer looks for first, before any prose. Items without a value do not exist. */
export function KeyFacts({ items }: { items: KeyFact[] }) {
  const live = items.filter((i) => isPresent(i.value));
  if (!live.length) return null;
  return (
    <dl className="keyfacts">
      {live.map((i) => (
        <div key={i.label}>
          <dt className="t-label">{i.label}</dt>
          <dd className="num">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

**3f. `components/product/SpecBlock.tsx`:**

```tsx
import { FactFile, isPresent, type FactRow } from "@/components/ui";

export interface SpecGroup {
  title: string;
  rows: FactRow[];
}

/** A location sheet in groups. A group with nothing known does not render. */
export function SpecBlock({ groups }: { groups: SpecGroup[] }) {
  const live = groups.filter((g) => g.rows.some((r) => isPresent(r.value)));
  if (!live.length) return null;
  return (
    <div className="specblock">
      {live.map((g) => (
        <div key={g.title}>
          <h3 className="specblock-title">{g.title}</h3>
          <FactFile rows={g.rows} />
        </div>
      ))}
    </div>
  );
}
```

**3g. `components/product/StickyBar.tsx`** (ported unchanged apart from the classes):

```tsx
"use client";

import { useEffect, useState } from "react";
import { cafe, phoneHref, whatsappWith } from "@/lib/cafe";

/**
 * On phones: WhatsApp and Call within a thumb's reach once the first screen has
 * been read, stepping aside while the form is in view.
 */
export function StickyBar({ text }: { text: string }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const form = document.querySelector("main form");
    let formInView = false;
    const update = () => setHidden(formInView || window.scrollY < window.innerHeight * 0.6);
    const io = form
      ? new IntersectionObserver(
          ([e]) => {
            formInView = e.isIntersecting;
            update();
          },
          { threshold: 0.15 },
        )
      : null;
    if (form && io) io.observe(form);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div className="sticky-bar" data-hidden={hidden ? "" : undefined} inert={hidden}>
      <a className="btn btn-primary" href={whatsappWith(text)} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      <a className="btn num" href={phoneHref}>
        Call {cafe.meta.phoneDisplay}
      </a>
    </div>
  );
}
```

**3h. `components/product/product.css`.** Drafting film: rules instead of boxes, no cards, and one border radius (the button's, from Task 5). Hairlines (`--hair`) are decorative only; field underlines, which carry meaning, use `--ink-2`.

```css
/* The page grammar for pages that sell and inform: head, two-column grid, facts, spec sheets, request forms, the phone bar. */

.nowrap { white-space: nowrap; }
.stack { display: grid; gap: 10px; align-content: start; }
.ext { display: inline-block; width: 0.62em; height: 0.62em; margin-left: 0.28em; vertical-align: 0.06em; overflow: visible; }
.ext path { fill: none; stroke: currentColor; stroke-width: 1.25px; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.pen-link-quiet { color: inherit; }
.t-title { font-family: var(--font-display); font-weight: 420; font-size: clamp(1.3rem, 1.1rem + 0.9vw, 1.7rem); line-height: 1.15; letter-spacing: -0.01em; text-wrap: balance; margin: 0; }

/* Head: the title, one line, the key facts; the drawing beside it from 64rem, below it on a phone. */
.page-head { display: grid; gap: 32px; padding-block: clamp(32px, 8vw, 96px) clamp(48px, 10vw, 112px); }
.page-head-copy { display: grid; gap: 22px; align-content: start; }
@media (min-width: 64rem) {
  .page-head { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 64px; align-items: start; }
}

.section { padding-block: clamp(56px, 12vw, 128px); border-top: 1px solid var(--hair); }
.page-grid { display: grid; gap: 28px; }
.col-side, .col-main { display: grid; gap: 20px; align-content: start; min-width: 0; }
.col-main { gap: 32px; }
@media (min-width: 64rem) {
  .page-grid { grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: 64px; }
  .col-side { position: sticky; top: 88px; align-self: start; }
}
.pair { display: grid; gap: 24px; align-items: start; }
@media (min-width: 48rem) { .pair { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 40px; } }

.actions { display: flex; flex-wrap: wrap; gap: 10px; }
.links-row { display: flex; flex-wrap: wrap; gap: 8px 22px; }

/* Key facts: a ruled strip of three numbers. */
.keyfacts { display: grid; grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr)); margin: 0; border-top: 1px solid var(--ink); }
.keyfacts > div { padding: 12px 16px 4px 0; }
.keyfacts dt { margin: 0 0 6px; }
.keyfacts dd { margin: 0; font-family: var(--font-display); font-weight: 340; font-size: clamp(1.5rem, 1.2rem + 1.4vw, 2.2rem); line-height: 1.05; letter-spacing: -0.015em; }

/* Fact file and spec sheet. */
.factfile { margin: 0; display: grid; }
.factfile > div { display: grid; grid-template-columns: minmax(7rem, 2fr) 5fr; gap: 4px 20px; padding-block: 12px; border-top: 1px solid var(--hair); }
.factfile > div:last-child { border-bottom: 1px solid var(--hair); }
.factfile dt { padding-top: 3px; }
.factfile dd { margin: 0; line-height: 1.45; }
@media (max-width: 30rem) { .factfile > div { grid-template-columns: 1fr; } }
.specblock { display: grid; gap: 36px; }
.specblock-title { font-family: var(--font-display); font-weight: 480; font-size: 1rem; line-height: 1.3; margin: 0 0 10px; }
@media (min-width: 48rem) { .specblock { grid-template-columns: 1fr 1fr; gap: 40px 36px; } }

/* Things that happened; rooms to go with a game. */
.happenings, .room-rows { list-style: none; margin: 0; padding: 0; display: grid; }
.happening, .room-row { display: grid; gap: 10px; padding-block: 28px; border-top: 1px solid var(--hair); }
.happening:last-child, .room-row:last-child { border-bottom: 1px solid var(--hair); }
@media (min-width: 48rem) { .room-row { grid-template-columns: 13rem 1fr; gap: 24px; } }
.lamp-row { max-width: 36rem; margin-top: 8px; }

/* The request: a ruled section, hairline fields, corten focus, 44 px targets. */
.request { padding-block: clamp(56px, 12vw, 128px); border-top: 1px solid var(--ink); }
.form-grid { display: grid; gap: 22px 28px; }
@media (min-width: 40rem) { .form-grid { grid-template-columns: 1fr 1fr; } .field-wide { grid-column: 1 / -1; } }
.field { display: grid; gap: 6px; }
.field-optional { color: var(--ink-2); font-weight: 400; }
.field input, .field select, .field textarea {
  box-sizing: border-box; width: 100%; min-height: 44px; margin: 0; padding: 8px 0;
  border: 0; border-bottom: 1px solid var(--ink-2); border-radius: 0; background: transparent;
  color: var(--ink); font-family: var(--font-text); font-size: 1.0625rem; line-height: 1.4;
  -webkit-appearance: none; appearance: none; transition: border-color 300ms var(--ease-pen);
}
.field textarea { min-height: 96px; resize: vertical; }
.field input:hover, .field select:hover, .field textarea:hover { border-bottom-color: var(--ink); }
.field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible { outline: none; border-bottom: 2px solid var(--pen); padding-bottom: 7px; }
html[data-regime="night"] .field input, html[data-regime="night"] .field select, html[data-regime="night"] .field textarea { color-scheme: dark; }
.select { position: relative; display: block; }
.select::after { content: ""; position: absolute; right: 6px; top: 50%; width: 7px; height: 7px; border-right: 1.25px solid var(--ink); border-bottom: 1.25px solid var(--ink); transform: translateY(-75%) rotate(45deg); pointer-events: none; }
.field select { padding-right: 28px; cursor: pointer; }
.field select:invalid { color: var(--ink-2); }
.form-send { display: grid; gap: 10px; justify-items: start; padding-top: 6px; }
button.btn { font-size: 1rem; cursor: pointer; }
.btn { transition: background-color 300ms var(--ease-pen), color 300ms var(--ease-pen), border-color 300ms var(--ease-pen); }
.btn:hover { border-color: var(--pen); }
.btn-primary:hover { background: var(--pen); border-color: var(--pen); color: var(--paper); }

/* Phones: WhatsApp and Call within reach. */
.sticky-bar {
  position: fixed; inset-inline: 0; bottom: 0; z-index: 30; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  padding: 10px var(--gutter) calc(10px + env(safe-area-inset-bottom)); background: var(--paper); border-top: 1px solid var(--hair);
  transition: transform 600ms var(--ease-pen);
}
.sticky-bar .btn { justify-content: center; }
.sticky-bar[data-hidden] { transform: translateY(110%); }
@media (min-width: 64rem) { .sticky-bar { display: none; } }
```

**3i. `components/host/LampRow.tsx`.** Coffee Garba's only still is too blurred to draw honestly, so the evening is told in text beside a row of lamps drawn in the mark's line.
- The lamps hang from one sagging wire: a cord, a dome shade drawn as a true semicircle, a rim, and a bulb.
- Cords alternate in length to give the row a rhythm.
- Bulbs are `bulb-0..8`, so Task 15's `startLife` chases them after dark, and each bulb has a glow.
- The drawing is not a room and has no source photo, so it is not in `drawings.json` and never lifts.

```tsx
import { Drawing } from "@/components/draw/Drawing";
import { bulb } from "@/lib/draw/glyphs";
import { arc, curve, line, repeat } from "@/lib/draw/primitives";
import type { Drawing as DrawingData, Glow, P, Stroke } from "@/lib/draw/types";

const W = 1080;
const H = 260;
const SHADE = 22;

/** The wire: level ends at y 40, sagging 60 units at the middle. */
const wireY = (x: number) => 40 + 60 * (1 - ((x - W / 2) / (W / 2)) ** 2);

export function lampRowDrawing(count = 9): DrawingData {
  const strokes: Stroke[] = [curve(repeat(9, (_, t) => [t * W, wireY(t * W)] as P), "structure")];
  const glows: Glow[] = [];
  for (let i = 0; i < count; i++) {
    const x = count === 1 ? W / 2 : 60 + (i * (W - 120)) / (count - 1);
    const top = 150 + (i % 2 ? 36 : 0);
    const cy = top + SHADE;
    strokes.push(line([x, wireY(x)], [x, top], "detail"));
    strokes.push(arc([x, cy], SHADE, 180, 360, "detail"));
    strokes.push(line([x - SHADE, cy], [x + SHADE, cy], "detail"));
    strokes.push({ ...bulb([x, cy + 9], 6), id: `bulb-${i}` });
    glows.push({ x, y: cy + 9, r: 70 });
  }
  return { id: "lamp-row", title: "A row of lamps hanging from a wire", width: W, height: H, strokes, glows };
}

export function LampRow({ count = 9 }: { count?: number }) {
  return (
    <div className="lamp-row">
      <Drawing drawing={lampRowDrawing(count)} mode="scrub" />
    </div>
  );
}
```

**3j. `components/shoot/frames.ts`** (pure; used by the server component, the client overlay and the test):

```ts
import { n } from "@/lib/draw/primitives";

/** [x0, y0, x1, y1] in the 1080-wide frame of the drawing's whole source photo. */
export type Frame = [number, number, number, number];

/** Three compositions inside the main floor crop [250, 0, 1080, 625], measured on raw/ad-1.jpg's grid. */
export const MAIN_FLOOR_FRAMES: Frame[] = [
  [270, 20, 1070, 470], // 16:9: the stair climbing past the mezzanine railing, plants above and at its foot, the beams overhead
  [640, 20, 1060, 545], // 4:5: the upper flight against the brick, the framed picture, the plants below it
  [280, 245, 660, 625], // 1:1: under the mezzanine, the round tables and chairs, the pots at the foot of the stair
];

const RATIOS: [string, number][] = [
  ["16:9", 16 / 9],
  ["3:2", 3 / 2],
  ["4:3", 4 / 3],
  ["1:1", 1],
  ["4:5", 4 / 5],
  ["2:3", 2 / 3],
  ["9:16", 9 / 16],
];

/** The nearest common camera aspect, by ratio distance on a log scale. */
export function aspectLabel([x0, y0, x1, y1]: Frame): string {
  const r = (x1 - x0) / (y1 - y0);
  const off = (c: [string, number]) => Math.abs(Math.log(c[1] / r));
  return RATIOS.reduce((best, c) => (off(c) < off(best) ? c : best))[0];
}

export function frameInside([x0, y0, x1, y1]: Frame, [cx0, cy0, cx1, cy1]: Frame): boolean {
  return x1 > x0 && y1 > y0 && x0 >= cx0 && y0 >= cy0 && x1 <= cx1 && y1 <= cy1;
}

/** Four L-shaped corners, each arm `arm` long, clockwise from the top left. */
export function bracketPath([x0, y0, x1, y1]: Frame, arm: number): string {
  const corner = (x: number, y: number, dx: number, dy: number) => `M${n(x)} ${n(y + dy * arm)}L${n(x)} ${n(y)}L${n(x + dx * arm)} ${n(y)}`;
  return corner(x0, y0, 1, 1) + corner(x1, y0, -1, 1) + corner(x1, y1, -1, -1) + corner(x0, y1, 1, -1);
}

/** The whole drawing with the frame cut out (fill-rule evenodd), so everything outside the composition recedes. */
export function mattePath(box: { x: number; y: number; width: number; height: number }, [x0, y0, x1, y1]: Frame): string {
  const { x, y, width, height } = box;
  return `M${n(x)} ${n(y)}H${n(x + width)}V${n(y + height)}H${n(x)}Z M${n(x0)} ${n(y0)}H${n(x1)}V${n(y1)}H${n(x0)}Z`;
}
```

**3k. `components/shoot/ViewfinderFrames.tsx`** (client). How the overlay behaves:
- It waits until the room has drawn itself: `data-drawn` on the sibling drawing, or 4 s if the drawing never reports.
- Each composition rests 2.1 s, then the frame moves to the next over 1.1 s with the pen ease: one composition every 3.2 s.
- It pauses when the stage is off-screen or the tab is hidden.
- Under reduced motion it never loads GSAP, so the first composition stays.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { loadGsap, motionAllowed } from "@/lib/motion/gsap";
import { aspectLabel, bracketPath, mattePath, type Frame } from "./frames";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

const HOLD = 2.1;
const MOVE = 1.1;

function labelPosition(f: Frame, box: Box): { left: string; top: string } {
  return { left: `${((f[0] - box.x) / box.width) * 100}%`, top: `${((f[1] - box.y) / box.height) * 100}%` };
}

export function ViewfinderFrames({ frames, box }: { frames: Frame[]; box: Box }) {
  const overlay = useRef<SVGSVGElement>(null);
  const matte = useRef<SVGPathElement>(null);
  const brackets = useRef<SVGPathElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const arm = Math.min(box.width, box.height) * 0.07;
  const first = frames[0];

  useEffect(() => {
    const svg = overlay.current;
    const stage = svg?.parentElement;
    if (!svg || !stage || frames.length < 2 || !motionAllowed()) return;
    let cancelled = false;
    let stop = () => {};

    const run = async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const now = { x0: first[0], y0: first[1], x1: first[2], y1: first[3] };
      const paint = () => {
        const f: Frame = [now.x0, now.y0, now.x1, now.y1];
        matte.current?.setAttribute("d", mattePath(box, f));
        brackets.current?.setAttribute("d", bracketPath(f, arm));
        if (label.current) Object.assign(label.current.style, labelPosition(f, box));
      };
      const tl = gsap.timeline({ repeat: -1, paused: true });
      [...frames.slice(1), first].forEach((f, i) => {
        tl.to(
          now,
          {
            x0: f[0],
            y0: f[1],
            x1: f[2],
            y1: f[3],
            duration: MOVE,
            ease: "pen",
            onUpdate: paint,
            onStart: () => {
              if (label.current) label.current.textContent = aspectLabel(f);
              stage.setAttribute("data-frame", String((i + 1) % frames.length));
            },
          },
          `+=${HOLD}`,
        );
      });
      let inView = false;
      const sync = () => (inView && !document.hidden ? tl.play() : tl.pause());
      const io = new IntersectionObserver(
        ([e]) => {
          inView = e.isIntersecting;
          sync();
        },
        { threshold: 0.25 },
      );
      io.observe(stage);
      document.addEventListener("visibilitychange", sync);
      stop = () => {
        io.disconnect();
        document.removeEventListener("visibilitychange", sync);
        tl.kill();
      };
    };

    const drawing = stage.querySelector("svg.drawing");
    let mo: MutationObserver | null = null;
    let timer = 0;
    let started = false;
    const begin = () => {
      if (started) return;
      started = true;
      mo?.disconnect();
      window.clearTimeout(timer);
      void run();
    };
    if (!drawing || drawing.hasAttribute("data-drawn")) begin();
    else {
      mo = new MutationObserver(() => drawing.hasAttribute("data-drawn") && begin());
      mo.observe(drawing, { attributes: true, attributeFilter: ["data-drawn"] });
      timer = window.setTimeout(begin, 4000);
    }
    return () => {
      cancelled = true;
      mo?.disconnect();
      window.clearTimeout(timer);
      stop();
    };
  }, [frames, box, arm, first]);

  return (
    <>
      <svg ref={overlay} className="viewfinder-overlay" viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`} aria-hidden="true" focusable="false">
        <path ref={matte} className="viewfinder-matte" d={mattePath(box, first)} />
        <path ref={brackets} className="viewfinder-brackets" d={bracketPath(first, arm)} />
      </svg>
      <span ref={label} className="viewfinder-format" aria-hidden="true" style={labelPosition(first, box)}>
        {aspectLabel(first)}
      </span>
    </>
  );
}
```

**3l. `components/shoot/Viewfinder.tsx`** (server: the drawing data stays out of the client bundle):

```tsx
import { Drawing } from "@/components/draw/Drawing";
import { drawingFor } from "@/drawings";
import { frameOf } from "@/lib/drawings";
import { frameInside, type Frame } from "./frames";
import { ViewfinderFrames } from "./ViewfinderFrames";
import "./viewfinder.css";

interface ViewfinderProps {
  id: string;
  frames: Frame[];
  caption?: string;
}

/** Corten frames over a room drawing, moving between compositions of the same room. */
export function Viewfinder({ id, frames, caption = "One house, many sets." }: ViewfinderProps) {
  const box = frameOf(id);
  const crop: Frame = [box.x, box.y, box.x + box.width, box.y + box.height];
  const outside = frames.find((f) => !frameInside(f, crop));
  if (!frames.length || outside) throw new Error(`Viewfinder frame ${JSON.stringify(outside)} lies outside ${id}'s crop ${JSON.stringify(crop)}`);
  return (
    <figure className="viewfinder">
      <div className="viewfinder-stage" data-frame="0">
        <Drawing drawing={drawingFor(id)} mode="draw" />
        <ViewfinderFrames frames={frames} box={box} />
      </div>
      <figcaption className="t-label">{caption}</figcaption>
    </figure>
  );
}
```

**3m. `components/shoot/viewfinder.css`.**
- The frame is the pen mark in corten, 2 px, the same weight as the focus ring, so it reads as a tool over the drawing rather than part of it.
- The matte is paper at 66%, so the drawing outside the composition recedes but stays legible.

```css
/* /shoot: corten viewfinder frames over the main floor drawing. */
.viewfinder { margin: 0; display: grid; gap: 12px; }
.viewfinder-stage { position: relative; }
.viewfinder-overlay { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.viewfinder-matte { fill: var(--paper); fill-opacity: 0.66; fill-rule: evenodd; stroke: none; }
.viewfinder-brackets { fill: none; stroke: var(--pen); stroke-width: 2px; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.viewfinder-format {
  position: absolute; margin: 10px 0 0 12px; pointer-events: none;
  font-family: var(--font-display); font-weight: 500; font-size: 0.8125rem; line-height: 1; color: var(--pen); font-variant-numeric: tabular-nums;
}
.viewfinder figcaption { color: var(--ink-2); }
```

**3n. `app/host/page.tsx`.** Changes from the reference:
- The hoodie workshop is drawn in the head of the page, and its caption names it.
- Coffee Garba stays in text, with the lamp row beside it.
- Phone-free Sundays stay in text.
- Reach numbers (`events[].reach`, `performance`) are not for display and are never rendered.

```tsx
import type { Metadata } from "next";
import { Sheet } from "@/components/draw/Sheet";
import { LampRow } from "@/components/host/LampRow";
import { KeyFacts } from "@/components/product/KeyFacts";
import { RequestForm } from "@/components/product/RequestForm";
import { SpecBlock } from "@/components/product/SpecBlock";
import { StickyBar } from "@/components/product/StickyBar";
import { TextLink } from "@/components/ui";
import { cafe, capitalise, eventDate, fact, roomWord, rooms } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";

const { meta, events, press } = cafe;
const size = meta.sizeSqFt.toLocaleString("en-IN");
const closeLabel = formatClock(meta.hours.close);
const buildTime = meta.buildDurationYears === 1 ? "a year" : `${meta.buildDurationYears} years`;

export const metadata: Metadata = {
  title: { absolute: `Event venue in Ahmedabad: host at ${meta.name}` },
  description: `Birthdays, ceremonies and private hire at a ${size} sq ft loft house in ${meta.address.area}, ${meta.address.region}: ${roomWord} rooms in one house, open until ${closeLabel}.`,
  alternates: { canonical: "/host" },
};

interface Gathering {
  slug: string;
  name: string;
  date: string;
  description: string;
  partners?: string[];
}

/** Everything the house has hosted. The shoot credit belongs to /shoot. */
const gatherings: Gathering[] = events
  .filter((e) => !("type" in e))
  .map((e) => ({ slug: e.slug, name: e.name, date: e.date, description: e.description, partners: "partners" in e ? e.partners : undefined }));

/** "a, b and c" */
function andList(items: string[]): string {
  return items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** The first sentence of a room description. */
function lead(text: string): string {
  const m = /^(.+?[.!?])(\s|$)/.exec(text.trim());
  return m ? m[1] : text;
}

export default function Host() {
  const hoodie = gatherings.find((g) => g.slug === "hoodie-workshop");
  const diary = press.find((p) => p.publication === "The Architect's Diary");

  return (
    <>
      <section className="wrap page-head" aria-labelledby="host-title">
        <div className="page-head-copy">
          <h1 id="host-title" className="t-display">
            Borrow the house for an evening.
          </h1>
          <p className="t-line">
            Birthdays, ceremonies, a night with people you like. What you borrow is a {meta.buildCostDisplay}, {size} sq ft loft
            house in {meta.address.area}, built over {buildTime} as a home rather than a restaurant.
          </p>
          <KeyFacts
            items={[
              { label: "Size", value: `${size} sq ft` },
              { label: "Rooms", value: `${capitalise(roomWord)} in one house` },
              { label: "Open until", value: closeLabel },
            ]}
          />
        </div>
        <Sheet id="hoodie" mode="draw" caption={hoodie ? `${hoodie.name}, ${eventDate(hoodie.date)}.` : undefined} />
      </section>

      <section className="wrap section" aria-labelledby="happened-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="happened-title" className="t-head">
              Things that have happened here.
            </h2>
          </div>
          <div className="col-main">
            <ul className="happenings">
              {gatherings.map((g) => (
                <li key={g.slug} className="happening">
                  <h3 className="t-title">{g.name}</h3>
                  <p className="t-label num">{eventDate(g.date)}</p>
                  <p className="t-body">{g.description}</p>
                  {g.partners?.length ? <p className="t-label">With {andList(g.partners)}.</p> : null}
                  {g.slug === "coffee-garba" ? <LampRow /> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="borrow-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="borrow-title" className="t-head">
              Brick, lamps and the hours after dark.
            </h2>
          </div>
          <div className="col-main">
            {diary ? (
              <p className="t-line">
                <TextLink quiet href={diary.link}>
                  The Architect&rsquo;s Diary
                </TextLink>{" "}
                described the layout as flexible and multifunctional, hosting pop-ups and performances by night.
              </p>
            ) : null}
            <SpecBlock
              groups={[
                { title: "Rooms", rows: rooms.map((s) => ({ term: s.name, value: fact(lead(s.description)) })) },
                {
                  title: "Access",
                  rows: [
                    { term: "Parking", value: fact(meta.parking)?.split(";")[0] },
                    { term: "Where", value: `${meta.address.landmark}, ${meta.address.line2}` },
                  ],
                },
              ]}
            />
            <p className="t-body">
              <TextLink href="/spaces">Walk through all the rooms</TextLink>
            </p>
          </div>
        </div>
      </section>

      <div className="wrap">
        <RequestForm kind="host" />
      </div>
      <StickyBar text={`Hi, I'd like to host something at ${meta.name}.`} />
    </>
  );
}
```

**3o. `app/shoot/page.tsx`.** Changes from the reference:
- The viewfinder over the main floor drawing opens the page.
- NoCatch is drawn without its two people, with the credit text read from `cafe.events`.
- The reference's "tech pack" is not promised: the page asks the visitor to ask instead.
- The DayArc of option one is not ported.

```tsx
import type { Metadata } from "next";
import { Sheet } from "@/components/draw/Sheet";
import { KeyFacts } from "@/components/product/KeyFacts";
import { RequestForm } from "@/components/product/RequestForm";
import { SpecBlock } from "@/components/product/SpecBlock";
import { StickyBar } from "@/components/product/StickyBar";
import { MAIN_FLOOR_FRAMES } from "@/components/shoot/frames";
import { Viewfinder } from "@/components/shoot/Viewfinder";
import { TextLink } from "@/components/ui";
import { cafe, capitalise, eventDate, fact, pressDate, roomWord, whatsappWith } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";

const { meta, events, press } = cafe;
const size = meta.sizeSqFt.toLocaleString("en-IN");
const openLabel = formatClock(meta.hours.open);
const closeLabel = formatClock(meta.hours.close);
const buildTime = meta.buildDurationYears === 1 ? "a year" : `${meta.buildDurationYears} years`;

export const metadata: Metadata = {
  title: "Shoot location in Ahmedabad: a magazine-published loft house",
  description: `Film, photo and brand shoots in a loft house in ${meta.address.area}, Ahmedabad: ${size} sq ft, ${roomWord} rooms, open until ${closeLabel}, featured by AD India, CNT India and ELLE Decor India.`,
  alternates: { canonical: "/shoot" },
};

/** Shoot credits that have a drawing of their location. */
const CREDIT_DRAWING: Record<string, { id: string; caption: string }> = {
  nocatch: {
    id: "nocatch",
    caption: "Where the film was shot: the barrel, the sheer curtains, the table and the palm, drawn without the two people in the frame.",
  },
};

export default function Shoot() {
  const credits = events.filter((e) => "type" in e && e.type === "shoot-credit");
  const tier1 = press.filter((p) => p.tier === 1).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <section className="wrap page-head" aria-labelledby="shoot-title">
        <div className="page-head-copy">
          <h1 id="shoot-title" className="t-display">
            A set that took {buildTime} to build.
          </h1>
          <p className="t-line">
            A {size} sq ft loft house in {meta.address.area}, {meta.address.region}: {roomWord} rooms of brick, black steel and tall
            glazing, daylight from the skylights, and ship lamps after dark until {closeLabel}. Bring the crew, not the dressing.
          </p>
          <KeyFacts
            items={[
              { label: "Floor area", value: `${size} sq ft` },
              { label: "Rooms", value: capitalise(roomWord) },
              { label: "Hours", value: `${openLabel} to ${closeLabel}` },
            ]}
          />
        </div>
        <Viewfinder id="main-floor" frames={MAIN_FLOOR_FRAMES} />
      </section>

      <section className="wrap section" aria-labelledby="sheet-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="sheet-title" className="t-head">
              What the camera gets.
            </h2>
          </div>
          <div className="col-main">
            <p className="t-line">
              Every room is dressed the way the house is every day: salvaged furniture from Jogeshwari market, Chesterfield couches,
              vintage maps of Ahmedabad, work by regional artists and heavy planting.
            </p>
            <SpecBlock
              groups={[
                {
                  title: "Light",
                  rows: [
                    { term: "By day", value: "Skylights and floor-to-ceiling windows" },
                    { term: "After dark", value: "Ship lamps and layered lighting" },
                    { term: "Night shoots", value: `The house is open until ${closeLabel}` },
                  ],
                },
                {
                  title: "Surfaces",
                  rows: [
                    { term: "Walls", value: "Exposed brick; a facade of upcycled bottles in metal mesh" },
                    { term: "Floors", value: "Raw concrete; wood on the mezzanine" },
                    { term: "Ceiling", value: "Pallet-wood strips from fruit-vendor crates" },
                    { term: "Structure", value: "Black steel; oxidised corten signage and doors" },
                  ],
                },
                {
                  title: "Access",
                  rows: [
                    { term: "Parking", value: fact(meta.parking)?.split(";")[0] },
                    { term: "Where", value: `${meta.address.landmark}, ${meta.address.line2}, ${meta.address.area}` },
                  ],
                },
                {
                  title: "Published",
                  rows: tier1.map((p) => ({
                    term: p.publication,
                    value: (
                      <TextLink quiet href={p.link}>
                        {pressDate(p.date)}
                      </TextLink>
                    ),
                  })),
                },
              ]}
            />
            <p className="t-body">
              For power, load-in and rates,{" "}
              <TextLink href={whatsappWith(`Hi, I'm planning a shoot at ${meta.name}. Could you tell me about power, load-in and rates?`)}>
                ask the house on WhatsApp
              </TextLink>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="shot-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="shot-title" className="t-head">
              Shot here.
            </h2>
          </div>
          <div className="col-main">
            {credits.map((e) => {
              const drawn = CREDIT_DRAWING[e.slug];
              return (
                <article key={e.slug} className="pair">
                  <div className="stack">
                    <h3 className="t-title">{e.name}</h3>
                    <p className="t-label num">{eventDate(e.date)}</p>
                    <p className="t-body">{e.description}</p>
                  </div>
                  {drawn ? <Sheet id={drawn.id} mode="scrub" caption={drawn.caption} /> : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className="wrap">
        <RequestForm kind="shoot" />
      </div>
      <StickyBar text={`Hi, I'd like to enquire about a shoot at ${meta.name}.`} />
    </>
  );
}
```

**3p. `app/bowl/page.tsx`.** The page gives no lane count, price or hours.
- "Recently opened." is read from the bowling space's description.
- The sign's words sit in HTML beside the drawing, because the drawing leaves the lightbox text as ruled lines (Task 12).

```tsx
import type { Metadata } from "next";
import { Sheet } from "@/components/draw/Sheet";
import { RequestForm } from "@/components/product/RequestForm";
import { StickyBar } from "@/components/product/StickyBar";
import { TextLink } from "@/components/ui";
import { cafe, roomWord } from "@/lib/cafe";

const { meta } = cafe;
const sqft = meta.sizeSqFt.toLocaleString("en-IN");

export const metadata: Metadata = {
  title: `Bowling in ${meta.address.area}, ${meta.address.region}`,
  description: `The Alley: a bowling alley, recently opened inside ${meta.name}, a ${sqft} sq ft loft house in ${meta.address.area}, ${meta.address.region}. Message to ask about lanes and timings.`,
  alternates: { canonical: "/bowl" },
};

/** The rooms to go with a game, in this order. Copy comes from cafe.spaces. */
const WITH_A_GAME = ["games", "main-floor", "courtyard"];

/** The first sentence of a room description. */
function lead(text: string): string {
  const m = /^(.+?[.!?])(\s|$)/.exec(text.trim());
  return m ? m[1] : text;
}

export default function Bowl() {
  const bowling = cafe.spaces.find((s) => s.slug === "bowling");
  const around = WITH_A_GAME.map((slug) => cafe.spaces.find((s) => s.slug === slug)).filter((s) => s !== undefined);

  return (
    <>
      <section className="wrap page-head" aria-labelledby="bowl-title">
        <div className="page-head-copy">
          <h1 id="bowl-title" className="t-display">
            The newest room in the house.
          </h1>
          <p className="t-line">
            {bowling ? `${lead(bowling.description)} ` : null}Outside, a sign spells BOWL in bulbs. Lanes and timings: ask the house,
            and someone will know.
          </p>
        </div>
        <div className="stack">
          <Sheet id="alley-sign" mode="draw" />
          <p className="t-label">The lightbox under the sign reads &ldquo;The Alley&rdquo; and &ldquo;{meta.name}&rdquo;</p>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="around-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="around-title" className="t-head">
              Before a game, or after.
            </h2>
          </div>
          <div className="col-main">
            <p className="t-line">
              The alley is one room in a house of {roomWord}. The rest of the evening is already there: a pool table and a shelf of
              books, the main floor under its lamps, the courtyard open to the sky.
            </p>
            <ul className="room-rows">
              {around.map((room) => (
                <li key={room.slug} className="room-row">
                  <h3 className="t-title">{room.name}</h3>
                  <div className="stack">
                    <p className="t-body">{room.description}</p>
                    <p className="t-body">
                      <TextLink href={`/spaces#${room.slug}`}>More about {room.name.replace(/^The /, "the ")}</TextLink>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="wrap">
        <RequestForm kind="bowl" />
      </div>
      <StickyBar text="Hi, I'd like to ask about a lane at The Alley." />
    </>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- product`
Expected: `Test Files  1 passed (1)` and `Tests  11 passed (11)`.

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Stop the server on 3022, then in a second terminal: `npm run build && npx next start -p 3022`. The build must list `/host`, `/shoot` and `/bowl` as static routes. Then run: `node scripts/e2e/product.mjs`
Expected: every line `ok`, ending with `all checks passed`.

- [ ] **Step 5: Look**

With Playwright MCP, take screenshots at 390x844 and 1440x900, each at `?at=14:00` and `?at=01:00`, of `http://localhost:3022/host`, `/shoot` and `/bowl`. Scroll through each page and take a full-page screenshot as well. Read every screenshot at 390 before 1440. Checklist:

`/host`, 390:
- The h1 sits on balanced lines with no single-word last line.
- The lede reads in Hedvig at under 70 characters a line.
- The key facts are one ruled strip: "10,000 sq ft", "Six in one house", "3 AM", with no number wrapping.
- The hoodie drawing sits under the facts in one line weight, with the "Show the photograph" toggle.
- Press and hold the drawing: the photograph appears at honest size with the credit "Still from a reel by @paulsartgallery98, via @thebarnyard.co".

`/host`, the events:
- Three rows between hairlines, dated "6 Sep 2025", "18 Dec 2025" and "Apr 2025 to May 2025".
- Partners are joined with "and".
- The lamp row under Coffee Garba draws as it scrolls in: nine lamps on a sagging wire, alternating cord lengths, no lamp cut off at either edge.
- No reach numbers appear anywhere.

`/host`, at 01:00:
- The ground is cool steel and the text is night ink.
- The lamps glow amber behind their bulbs, and the bulbs step in threes.
- The form fields and the date picker use the dark colour scheme.

`/host`, the form:
- Labels are in Ysabeau; fields are underlines, not boxes; "(optional)" is in ink 2; the select shows its drawn chevron.
- Tabbing through shows a 2 px corten underline on each field and the corten focus ring on the buttons.
- Each target is at least 44 px tall.
- The phone bar appears after the first screen and slides away when the form is in view.

`/host`, 1440: the head is two columns with the drawing on the right, top-aligned with the h1. The side headings stay put while their section scrolls.

`/shoot`, the viewfinder:
- It sits in the head: corten corner brackets over the main floor drawing, the drawing outside the frame receding under the paper matte, and "16:9" inside the frame's top-left corner.
- After the room draws, the frame reframes to 4:5 around the upper flight, the framed picture and the plants, then to 1:1 around the round tables under the mezzanine, then back to the wide. Each move is slow, eases in and lands softly.
- The frame never leaves the drawing.
- The brackets read as a tool, heavier than the 1.25 px ink line.
- The caption reads "One house, many sets.".
- With reduced motion emulated in DevTools, the 16:9 frame holds still.

`/shoot`, the rest:
- The spec block shows Light, Surfaces, Access and Published; the Published dates link out with the stroked glyph.
- The NoCatch drawing shows the barrel, the curtains, the table and the palm, and no people.
- Lifting it shows "Still from the NoCatch film by @nocatch.in, via @thebarnyard.co".

`/bowl`:
- The sign is drawn with no lift toggle, and the lightbox words are set beneath it.
- At 01:00 the BOWL bulbs chase and the pin's bands and OPEN glow.
- No hours, prices or lane counts appear in the page body.
- The three rooms are listed with links to `/spaces#games`, `/spaces#main-floor` and `/spaces#courtyard`.

Every route, both widths:
- No sideways scroll.
- No text sits on a drawing.
- No card boxes or rounded panels, apart from the buttons.
- No arrows glued to links.

If anything fails, fix it and rerun Steps 4 and 5.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts components/ui.tsx components/forms/EnquiryForm.tsx components/product/RequestForm.tsx components/product/KeyFacts.tsx components/product/SpecBlock.tsx components/product/StickyBar.tsx components/product/product.css components/host/LampRow.tsx components/shoot/frames.ts components/shoot/Viewfinder.tsx components/shoot/ViewfinderFrames.tsx components/shoot/viewfinder.css app/host/page.tsx app/shoot/page.tsx app/bowl/page.tsx tests/product.test.ts scripts/e2e/product.mjs
git commit -m "feat: host, shoot and bowl pages with drawn proof, the viewfinder and WhatsApp request forms"
```

---

### Task 21: Menu, press, visit and the 404

This task ports the three quiet routes from option one (`docs/reference/barnyard-v1/app/{menu,press,visit}/page.tsx`, plus option one's `PressWall` for the press list) and gives the site its own 404.
- Photographs become `<Sheet>` drawings, and only where a still shows the subject: the pizza and the dough on `/menu`, the mezzanine stair and the entry strips beside the two quotes on `/press`, the facade on `/visit`.
- A dish without a still gets no drawing.
- A price renders only where `fact(price)` returns one.

**Files:**
- Create: `app/menu/page.tsx`, `app/menu/menu.css`, `app/press/page.tsx`, `app/visit/page.tsx`, `app/not-found.tsx`
- Modify: `app/globals.css` (append the press list, the quote pairs, the visit address and the empty-house block; the 404 renders on every unmatched URL, so its CSS must be global)
- Test: `scripts/e2e/pages.mjs`

**Interfaces:**
- Consumes:
  - `lib/cafe.ts` (Task 1): `cafe`, `fact`, `roomWord`, `architectName`, `addressLines`, `mapsHref`, `phoneHref`, `whatsappHref`, `pressDate`.
  - `lib/daylight.ts` (Task 1): `formatClock`.
  - `lib/mark.ts` (Task 1): `HOUSE_PATHS`.
  - `lib/draw/types.ts` (Task 2): the `Drawing` and `Stroke` types.
  - `components/draw/Drawing.tsx` (Task 6): `Drawing`.
  - `components/light/OpenNow.tsx` (Task 5): `OpenNow`.
  - `components/draw/Sheet.tsx` (Task 14): `Sheet` (`figure.sheet`). The drawings used: `pizza` and `dough` (Task 13), `mezzanine-stair` (Task 10), `entry` (Task 8), `facade` (Task 7).
  - `lib/house.ts` (Task 16): `ROOM_ORDER`.
  - Task 20: `TextLink`, `ButtonLink`, `FactFile` (`components/ui.tsx`, which also loads the page classes `.page-head .page-head-copy .section .page-grid .col-side .col-main .stack .pair .actions .links-row .t-title .factfile`) and `StickyBar` (`components/product/StickyBar.tsx`).
  - Task 5 classes `.wrap .t-display .t-head .t-line .t-body .t-label .t-quote .num`.
  - `scripts/e2e/lib.mjs`.
- Produces:
  - Routes `/menu`, `/press` and `/visit`, each with its own `metadata`.
  - The site's not-found page, returned with status 404 for every unmatched URL.
  - CSS classes:
    - menu: `.menu-list .menu-item .menu-item-drawn .menu-cat .menu-name .menu-price .menu-drawing`
    - global: `.press-list .press-item .press-quotes .quote-pair .press-quote .address .lost .lost-house .lost-rooms`
  - DOM hooks used by the check: the h1 ids `menu-title`, `press-title`, `visit-title` and `lost-title`, and `section[aria-labelledby="brunch-title"]`.

- [ ] **Step 1: Write the failing check `scripts/e2e/pages.mjs`**

```js
// Menu, press, visit and the 404 against production: npm run build && npx next start -p 3022, then node scripts/e2e/pages.mjs
import { BASE, assert, launch, open, report, shot } from "./lib.mjs";

const ROUTES = {
  "/menu": /Order something, then stay a while/,
  "/press": /Three magazines, one house/,
  "/visit": /Find the house/,
};
const PRICED = ["Curriza", "Patatas Bravas", "Avocado croissant"];
const PRESS_ORDER = ["ELLE Decor India", "Architectural Digest India", "Condé Nast Traveller India", "Knocksense", "The Architect's Diary"];
const ROOMS = ["entry", "main-floor", "mezzanine", "courtyard", "games", "bowling"];

const browser = await launch();

for (const [path, h1Pattern] of Object.entries(ROUTES)) {
  for (const [width, height] of [[390, 844], [1440, 900]]) {
    for (const at of ["14:00", "01:00"]) {
      const { page, ctx, errors } = await open(browser, path, { width, height, at });
      const tag = `${path} ${width} ${at}`;
      const res = await ctx.request.get(`${BASE}${path}`);
      assert(res.status() === 200, `${tag}: 200`);
      const h1 = page.locator("h1");
      const h1Text = (await h1.count()) ? await h1.first().innerText() : "";
      assert((await h1.count()) === 1 && h1Pattern.test(h1Text), `${tag}: one h1 (${h1Text})`);
      const levels = await page.locator("main h1, main h2, main h3").evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
      assert(levels[0] === 1 && levels.every((l, i) => i === 0 || l <= levels[i - 1] + 1), `${tag}: headings never skip a level (${levels.join("")})`);
      assert(!/UNKNOWN|CONFIRM/.test(await page.locator("body").innerText()), `${tag}: no flagged values`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert(overflow <= 0, `${tag}: no sideways scroll (${overflow})`);
      assert(errors.length === 0, `${tag}: no console errors (${errors.join(" | ")})`);
      await page.waitForTimeout(2500);
      await shot(page, `pages${path.replace("/", "-")}-${width}-${at.replace(":", "")}`, true);
      await ctx.close();
    }
  }
}

// Menu: prices only where cafe.json has them; drawings only where a still shows the dish.
{
  const { page, ctx } = await open(browser, "/menu", { at: "14:00" });
  assert((await page.locator("main .menu-item").count()) === 9, "menu: nine signatures");
  const priced = await page.locator("main .menu-item:has(.menu-price)").evaluateAll((els) =>
    els.map((e) => ({ name: e.querySelector(".menu-name").textContent.trim(), price: e.querySelector(".menu-price").textContent.trim() })),
  );
  assert(JSON.stringify(priced.map((p) => p.name)) === JSON.stringify(PRICED), `menu: prices only for the three priced items (${priced.map((p) => p.name).join(", ")})`);
  assert(priced.every((p) => /^₹[\d,]+$/.test(p.price)), `menu: prices in rupees (${priced.map((p) => p.price).join(", ")})`);
  const rupees = ((await page.locator("main").innerText()).match(/₹/g) ?? []).length;
  assert(rupees === 3, `menu: exactly three prices on the page (${rupees})`);
  assert((await page.locator("main figure.sheet").count()) === 2, "menu: two drawings, the pizza and the dough");
  assert((await page.locator("main .menu-item").filter({ hasText: "Curriza" }).locator("figure.sheet").count()) === 1, "menu: the pizza is drawn beside Curriza");
  assert((await page.locator("section[aria-labelledby='brunch-title'] figure.sheet").count()) === 1, "menu: the dough is drawn beside the fixed brunch");
  await ctx.close();
}

// Press: five pieces, tier then newest first, each dated and linked; two quotes with their drawings; credits.
{
  const { page, ctx } = await open(browser, "/press", { at: "14:00" });
  const rows = await page.locator("main .press-item").evaluateAll((els) =>
    els.map((e) => ({
      name: e.querySelector("h3").textContent.trim(),
      date: e.querySelector("time")?.getAttribute("datetime") ?? "",
      href: e.querySelector("h3 a")?.getAttribute("href") ?? "",
    })),
  );
  assert(rows.length === 5, `press: five pieces (${rows.length})`);
  assert(rows.every((r, i) => r.name.startsWith(PRESS_ORDER[i])), `press: tier one first, newest first (${rows.map((r) => r.name).join(" | ")})`);
  assert(rows.every((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && /^https:\/\//.test(r.href)), "press: every piece dated and linked");
  const pairs = await page.locator("main .quote-pair").evaluateAll((els) =>
    els.map((e) => ({ cite: e.querySelector("cite")?.textContent ?? "", drawing: e.querySelector("svg.drawing title")?.textContent ?? "" })),
  );
  assert(pairs.length === 2, `press: two quotes (${pairs.length})`);
  assert(/Architectural Digest India/.test(pairs[0]?.cite) && /stair/i.test(pairs[0]?.drawing), `press: AD's quote beside the stair (${pairs[0]?.drawing})`);
  assert(/ELLE Decor India/.test(pairs[1]?.cite) && /strips/i.test(pairs[1]?.drawing), `press: ELLE's quote beside the ceiling strips (${pairs[1]?.drawing})`);
  const terms = await page.locator("main .factfile dt").allInnerTexts();
  assert(["Architect", "Studio", "Design team", "Photographer", "Completed"].every((t) => terms.includes(t)), `press: credits fact file (${terms.join(", ")})`);
  await ctx.close();
}

// Visit: the address, parking from cafe.json, and every way to get in touch.
{
  const { page, ctx } = await open(browser, "/visit", { at: "14:00" });
  const main = page.locator("main");
  const text = await main.innerText();
  assert(text.includes("Plot No. 208, FP 36/2") && text.includes("382424"), "visit: the address");
  assert(/Ample parking/.test(text), "visit: parking");
  assert(/Open 11 AM to 3 AM/.test(text), "visit: the hours (pinned clock shows the hours rather than open now)");
  for (const [sel, what] of [
    ['a[href="tel:+918780591708"]', "call"],
    ['a[href^="https://wa.me/918780591708"]', "WhatsApp"],
    ['a[href^="https://www.google.com/maps/search/"]', "directions"],
    ['a[href="https://www.instagram.com/thebarnyard.co/"]', "Instagram"],
  ]) {
    assert((await main.locator(sel).count()) >= 1, `visit: ${what} link`);
  }
  assert((await main.locator("figure.sheet").count()) === 1, "visit: the facade drawing");
  await ctx.close();
}

// 404: the empty house, the status, and a way into every room in story order.
for (const [width, height, at] of [[390, 844, "14:00"], [1440, 900, "01:00"]]) {
  const { page, ctx, errors } = await open(browser, "/no-such-room", { width, height, at });
  const res = await ctx.request.get(`${BASE}/no-such-room`);
  assert(res.status() === 404, `404 ${width}: status (${res.status()})`);
  assert(/There.s no room by that name/.test(await page.locator("h1").innerText()), `404 ${width}: the line`);
  const hrefs = await page.locator("main .lost-rooms a").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  assert(JSON.stringify(hrefs) === JSON.stringify(ROOMS.map((s) => `/spaces#${s}`)), `404 ${width}: links to every room in story order (${hrefs.join(", ")})`);
  assert((await page.locator("main a[href='/']").count()) >= 1, `404 ${width}: a way back to the house`);
  assert((await page.locator("main .lost-house svg.drawing path.ln").count()) >= 6, `404 ${width}: the small house is drawn`);
  assert(errors.filter((e) => !/404|Not Found/i.test(e)).length === 0, `404 ${width}: no console errors beyond the 404 itself`);
  await page.waitForTimeout(2500);
  await shot(page, `pages-404-${width}-${at.replace(":", "")}`);
  await ctx.close();
}

await browser.close();
report();
```

- [ ] **Step 2: Run it to verify it fails**

Stop any server on 3022, then in a second terminal: `npm run build && npx next start -p 3022`. Then run: `node scripts/e2e/pages.mjs`
Expected: failures, including `FAIL /menu 390 14:00: 200` (the route does not exist yet) and `FAIL 404 390: the line` (Next's default not-found page), ending with `N failure(s)` and exit code 1.

- [ ] **Step 3: Implement**

**3a. `app/menu/page.tsx`.** The signatures are typeset as a ruled list: category, name, and a price only where `fact(item.price)` returns one.
- The pizza drawing sits inside Curriza's row, and the dough drawing beside the fixed brunch.
- No other dish gets a drawing.
- Captions say what the still shows ("a handmade pizza") and never claim which dish it is.
- The brunch price is `UNKNOWN`, so its fact row disappears.

```tsx
import type { Metadata } from "next";
import { Sheet } from "@/components/draw/Sheet";
import { OpenNow } from "@/components/light/OpenNow";
import { FactFile, TextLink } from "@/components/ui";
import { cafe, fact, phoneHref, whatsappHref } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";
import "./menu.css";

const { meta, menu } = cafe;
const closeLabel = formatClock(meta.hours.close);
const brunchOpen = formatClock(meta.brunchHours.open);
const brunchClose = formatClock(meta.brunchHours.close);
const brunchDays = meta.brunchHours.days === "Mon-Sun" ? "every day" : meta.brunchHours.days;

export const metadata: Metadata = {
  title: `Menu: a few things to order at ${meta.name}`,
  description: `${menu.cuisines.join(", ")}. A handful of signatures and a fixed brunch, ${brunchOpen} to ${brunchClose}, at a loft house in ${meta.address.area}, Ahmedabad. Open until ${closeLabel}.`,
  alternates: { canonical: "/menu" },
};

/** "Italian and North Indian cooking, with desserts, coffee and mocktails." */
function cuisineLine(list: string[]): string {
  const [a, b, ...rest] = list;
  const tail = rest.map((c) => c.toLowerCase());
  const tailText = tail.length ? `, with ${tail.slice(0, -1).join(", ")}${tail.length > 1 ? " and " : ""}${tail[tail.length - 1]}` : "";
  return `${a} and ${b} cooking${tailText}.`;
}

/** Dishes a café still shows exactly. Every other dish is set in type alone. */
const DRAWN: Record<string, { id: string; caption: string }> = {
  Curriza: { id: "pizza", caption: "A handmade pizza, cut on its board, drawn from the café's own reel." },
};

export default function Menu() {
  const brunch = menu.brunch;
  return (
    <>
      <section className="wrap page-head menu-head" aria-labelledby="menu-title">
        <div className="page-head-copy">
          <h1 id="menu-title" className="t-display">
            Order something, then stay a while.
          </h1>
          <p className="t-line">
            {cuisineLine(menu.cuisines)} A fixed brunch, {brunchOpen} to {brunchClose}.
          </p>
          <p className="t-label num">
            <OpenNow open={meta.hours.open} close={meta.hours.close} />
          </p>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="signatures-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="signatures-title" className="t-head">
              A few things to order.
            </h2>
            <p className="t-body">Signatures only. A price appears where it is known.</p>
          </div>
          <div className="col-main">
            <ul className="menu-list">
              {menu.signatures.map((item) => {
                const price = fact(item.price);
                const drawn = DRAWN[item.name];
                return (
                  <li key={item.name} className={`menu-item${drawn ? " menu-item-drawn" : ""}`}>
                    <span className="menu-cat t-label">{item.category}</span>
                    <span className="menu-name">{item.name}</span>
                    {price ? <span className="menu-price num">{price}</span> : null}
                    {drawn ? (
                      <div className="menu-drawing">
                        <Sheet id={drawn.id} mode="scrub" caption={drawn.caption} />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="brunch-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="brunch-title" className="t-head">
              {brunch.name}.
            </h2>
          </div>
          <div className="col-main">
            <div className="pair">
              <div className="stack">
                {brunch.includes.length ? <p className="t-line">A set spread: {brunch.includes.join(", ")}.</p> : null}
                <FactFile
                  rows={[
                    { term: "Hours", value: `${brunchOpen} to ${brunchClose}, ${brunchDays}` },
                    { term: "Price", value: fact(brunch.price) },
                  ]}
                />
              </div>
              <Sheet id="dough" mode="scrub" caption="Hands stretching dough, drawn from the café's own reel." />
            </div>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="comeby-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="comeby-title" className="t-head">
              Come by.
            </h2>
          </div>
          <div className="col-main">
            <p className="t-body">
              {meta.address.landmark}, {meta.address.line2}, {meta.address.area}, {meta.city} {meta.address.postalCode}.
            </p>
            <p className="t-body links-row">
              <a className="pen-link num" href={phoneHref}>
                Call {meta.phoneDisplay}
              </a>
              <TextLink href={whatsappHref}>WhatsApp</TextLink>
              <TextLink href="/visit">Directions and parking</TextLink>
            </p>
            <p className="t-label">
              For a big table, or the whole house, <TextLink quiet href="/host">host something</TextLink>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
```

**3b. `app/menu/menu.css`:**

```css
/* /menu only. Signatures set like a drawing's legend: the name large in Ysabeau, the category and price small, ruled by hairlines. */

@media (min-width: 64rem) {
  .menu-head { grid-template-columns: minmax(0, 1fr); }
  .menu-head .page-head-copy { max-width: 52rem; }
}

.menu-list { list-style: none; margin: 0; padding: 0; display: grid; }
.menu-item {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: "cat price" "name name";
  gap: 4px 16px;
  padding-block: 18px;
  border-top: 1px solid var(--hair);
}
.menu-item:last-child { border-bottom: 1px solid var(--hair); }
.menu-cat { grid-area: cat; }
.menu-price { grid-area: price; justify-self: end; font-family: var(--font-display); font-weight: 480; font-size: 1rem; line-height: 1.3; }
.menu-name { grid-area: name; font-family: var(--font-display); font-weight: 320; font-size: clamp(1.75rem, 1.3rem + 2.2vw, 2.6rem); line-height: 1.05; letter-spacing: -0.02em; text-wrap: balance; }
.menu-item-drawn { grid-template-areas: "cat price" "name name" "drawing drawing"; }
.menu-drawing { grid-area: drawing; margin-top: 16px; max-width: 22rem; }

@media (min-width: 48rem) {
  .menu-item { grid-template-columns: 9rem 1fr auto; grid-template-areas: "cat name price"; align-items: baseline; }
  .menu-item-drawn { grid-template-areas: "cat name price" ". drawing drawing"; }
}
```

**3c. `app/press/page.tsx`.**
- The five pieces are sorted by tier, then newest first, as option one's `PressWall` did. Each is dated with `<time datetime>` and linked. Instagram announcements say so, and `canonicalLink: "UNKNOWN"` is never read.
- The two quotes appear in the order the home page tells them (AD, then ELLE), each beside the drawing of the room it speaks about.
- The credits fact file is ported from the reference.

```tsx
import type { Metadata } from "next";
import { Sheet } from "@/components/draw/Sheet";
import { ButtonLink, FactFile, TextLink } from "@/components/ui";
import { architectName, cafe, fact, phoneHref, pressDate, whatsappHref } from "@/lib/cafe";

const { meta, design } = cafe;

interface Piece {
  publication: string;
  date: string;
  angle: string;
  link: string;
  linkType: string;
  tier: number;
  author?: string;
  quote?: string;
  quoteBy?: string;
}

/** Tier one first, newest first within a tier. */
const pieces = ([...cafe.press] as Piece[]).sort((a, b) => a.tier - b.tier || b.date.localeCompare(a.date));

/** Each quote and the drawing of the room it is about, in story order. */
const QUOTE_DRAWING: Record<string, string> = {
  "Architectural Digest India": "mezzanine-stair",
  "ELLE Decor India": "entry",
};

export const metadata: Metadata = {
  title: "Press: a cafe in Ahmedabad written about by AD India, CNT India and ELLE Decor India",
  description: `Every feature on ${meta.name}, dated and linked: Architectural Digest India, Condé Nast Traveller India, ELLE Decor India, The Architect's Diary and Knocksense. Project credits for anyone writing about the building.`,
  alternates: { canonical: "/press" },
};

export default function Press() {
  const magazines = pieces.filter((p) => p.tier === 1).sort((a, b) => a.date.localeCompare(b.date)).map((p) => p.publication);
  const others = pieces.filter((p) => p.tier !== 1).map((p) => p.publication);
  const quoted = Object.keys(QUOTE_DRAWING)
    .map((publication) => pieces.find((p) => p.publication === publication))
    .filter((p): p is Piece => Boolean(p && fact(p.quote)));

  return (
    <>
      <section className="wrap page-head" aria-labelledby="press-title">
        <div className="page-head-copy">
          <h1 id="press-title" className="t-display">
            Three magazines, one house.
          </h1>
          <p className="t-line">
            {magazines.slice(0, -1).join(", ")} and {magazines[magazines.length - 1]} have each written about the house; so have{" "}
            {others.join(" and ")}. Every piece is below, dated and linked. The building was designed by {architectName} of {design.studio} and
            photographed by {design.photographer}.
          </p>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="pieces-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="pieces-title" className="t-head">
              Every piece, dated and linked.
            </h2>
          </div>
          <div className="col-main">
            <ul className="press-list">
              {pieces.map((p) => (
                <li key={p.publication} className="press-item">
                  <h3 className={`t-title${p.tier === 1 ? "" : " press-minor"}`}>
                    <TextLink quiet href={p.link}>
                      {p.publication}
                    </TextLink>
                  </h3>
                  <p className="t-label num">
                    <time dateTime={p.date}>{pressDate(p.date)}</time>
                    {p.author ? `, by ${p.author}` : ""}
                    {p.linkType === "instagram-announcement" ? ", announced on Instagram" : ""}
                  </p>
                  <p className="t-body">{p.angle}.</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="quotes-title">
        <h2 id="quotes-title" className="t-head">
          In their words.
        </h2>
        <div className="press-quotes">
          {quoted.map((p) => (
            <div key={p.publication} className="quote-pair pair">
              <blockquote className="press-quote">
                <p className="t-quote">&ldquo;{p.quote}&rdquo;</p>
                <footer className="t-label">
                  <cite>{p.quoteBy ?? p.publication}</cite>, <time dateTime={p.date}>{pressDate(p.date)}</time>.{" "}
                  <TextLink quiet href={p.link}>
                    {p.linkType === "instagram-announcement" ? "The announcement" : "The article"}
                  </TextLink>
                </footer>
              </blockquote>
              <Sheet id={QUOTE_DRAWING[p.publication]} mode="scrub" />
            </div>
          ))}
        </div>
      </section>

      <section className="wrap section" aria-labelledby="project-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="project-title" className="t-head">
              Credits, for anyone writing about it.
            </h2>
          </div>
          <div className="col-main">
            <FactFile
              rows={[
                { term: "Architect", value: design.architect },
                {
                  term: "Studio",
                  value: (
                    <TextLink quiet href={design.studioInstagram}>
                      {design.studio}
                    </TextLink>
                  ),
                },
                { term: "Design team", value: design.designTeam.join(", ") },
                {
                  term: "Photographer",
                  value: (
                    <TextLink quiet href={design.photographerInstagram}>
                      {design.photographer}
                    </TextLink>
                  ),
                },
                { term: "Lighting", value: fact(design.lightingDesigner) },
                { term: "Structural engineers", value: fact(design.structuralEngineers) },
                { term: "Area", value: `${meta.sizeSqFt.toLocaleString("en-IN")} sq ft` },
                { term: "Completed", value: String(meta.yearBuilt) },
                { term: "Build", value: meta.buildDurationYears === 1 ? "One year" : `${meta.buildDurationYears} years` },
                { term: "Cost", value: meta.buildCostDisplay },
              ]}
            />
            <p className="t-body">
              <TextLink href="/shoot">Shoot at the house</TextLink>
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="media-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="media-title" className="t-head">
              Come and see it.
            </h2>
          </div>
          <div className="col-main">
            <p className="t-body">To request images or arrange a visit, call or WhatsApp.</p>
            <div className="actions">
              <ButtonLink href={phoneHref} primary>
                <span className="num">Call {meta.phoneDisplay}</span>
              </ButtonLink>
              <ButtonLink href={whatsappHref}>WhatsApp</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
```

**3d. `app/visit/page.tsx`.** Ported from the reference, with changes:
- The facade drawing replaces the night exterior photograph.
- Parking reads through `fact`.
- Call, WhatsApp, directions and Instagram are all present.

```tsx
import type { Metadata } from "next";
import { Sheet } from "@/components/draw/Sheet";
import { OpenNow } from "@/components/light/OpenNow";
import { StickyBar } from "@/components/product/StickyBar";
import { ButtonLink, FactFile, TextLink } from "@/components/ui";
import { addressLines, cafe, fact, mapsHref, phoneHref, whatsappHref } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";

const { meta } = cafe;
const openLabel = formatClock(meta.hours.open);
const closeLabel = formatClock(meta.hours.close);
const brunchLabel = `${formatClock(meta.brunchHours.open)} to ${formatClock(meta.brunchHours.close)}, ${meta.brunchHours.days === "Mon-Sun" ? "every day" : meta.brunchHours.days}`;

export const metadata: Metadata = {
  title: `Visit ${meta.name}: ${meta.address.area}, ${meta.address.region}`,
  description: `${meta.address.landmark}, ${meta.address.line2}, ${meta.address.area}, ${meta.city}. Open ${openLabel} to ${closeLabel}; brunch from ${formatClock(meta.brunchHours.open)}. Call or WhatsApp ${meta.phoneDisplay}.`,
  alternates: { canonical: "/visit" },
};

export default function Visit() {
  const parking = fact(meta.parking)?.split(";")[0];
  const landmark = meta.address.landmark.replace(/^Near /, "");

  return (
    <>
      <section className="wrap page-head" aria-labelledby="visit-title">
        <div className="page-head-copy">
          <h1 id="visit-title" className="t-display">
            Find the house.
          </h1>
          <p className="t-line">
            A loft house in {meta.address.area}, {meta.address.region}, open late. Ask for {landmark} on {meta.address.line2}.
          </p>
          <p className="t-label num">
            <OpenNow open={meta.hours.open} close={meta.hours.close} />
          </p>
          <div className="actions">
            <ButtonLink href={mapsHref} primary>
              Get directions
            </ButtonLink>
            <ButtonLink href={whatsappHref}>WhatsApp</ButtonLink>
            <ButtonLink href={phoneHref}>
              <span className="num">Call {meta.phoneDisplay}</span>
            </ButtonLink>
          </div>
        </div>
        <Sheet id="facade" mode="draw" caption="The corten sign on the wall outside, under the creepers: the first thing you see." />
      </section>

      <section className="wrap section" aria-labelledby="address-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="address-title" className="t-head">
              {meta.address.landmark}.
            </h2>
          </div>
          <div className="col-main">
            <address className="address t-line">
              {addressLines.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < addressLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </address>
            <FactFile
              rows={[
                { term: "Getting there", value: `Ask for ${landmark}, on ${meta.address.line2} in ${meta.address.area}` },
                { term: "Parking", value: parking },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="hours-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="hours-title" className="t-head">
              Days slow down here. Nights run late.
            </h2>
          </div>
          <div className="col-main">
            <FactFile
              rows={[
                { term: "Open", value: `${openLabel} to ${closeLabel}` },
                { term: "Brunch", value: brunchLabel },
              ]}
            />
            <p className="t-body">
              <TextLink href="/menu">The menu</TextLink>
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="contact-title">
        <div className="page-grid">
          <div className="col-side">
            <h2 id="contact-title" className="t-head">
              One number, for calls and WhatsApp.
            </h2>
          </div>
          <div className="col-main">
            <div className="actions">
              <ButtonLink href={phoneHref} primary>
                <span className="num">Call {meta.phoneDisplay}</span>
              </ButtonLink>
              <ButtonLink href={whatsappHref}>WhatsApp</ButtonLink>
            </div>
            <p className="t-body">
              <TextLink href={meta.instagram}>{`${meta.instagramHandle} on Instagram`}</TextLink>
            </p>
            <p className="t-label">
              For an event or a shoot, start with <TextLink quiet href="/host">Host</TextLink> or{" "}
              <TextLink quiet href="/shoot">Shoot</TextLink>.
            </p>
          </div>
        </div>
      </section>
      <StickyBar text={`Hi, I'd like a table at ${meta.name}.`} />
    </>
  );
}
```

**3e. `app/not-found.tsx`.** The mark's small house, taken from `HOUSE_PATHS` in the mark's 320 frame and scaled up through its viewBox.
- In the mark the pane edges stand in for the house's walls. Standing alone, it gets two walls and a ground line in the same line.
- The door is drawn open: the leaf has swung out on its left jamb, so it reads as a narrow arched leaf (an elliptical arc, rx 4.5, ry 13) beside an empty doorway.
- Nothing is drawn inside.
- Every room is linked in `ROOM_ORDER` story order.

```tsx
import { Drawing } from "@/components/draw/Drawing";
import { TextLink } from "@/components/ui";
import { roomWord } from "@/lib/cafe";
import type { Drawing as DrawingData, Stroke } from "@/lib/draw/types";
import { ROOM_ORDER } from "@/lib/house";
import { HOUSE_PATHS } from "@/lib/mark";

function emptyHouse(): DrawingData {
  const [gable, eave, doorway] = HOUSE_PATHS;
  const strokes: Stroke[] = [
    { d: gable, layer: "structure" },
    { d: eave, layer: "structure" },
    { d: "M 172 212 L 172 265", layer: "structure" },
    { d: "M 254 212 L 254 265", layer: "structure" },
    { d: "M 150 265 L 276 265", layer: "structure" },
    { d: doorway, layer: "detail" },
    { d: "M 200 265 L 200 238 A 4.5 13 0 0 0 191 238 L 191 265 Z", layer: "detail" },
  ];
  return {
    id: "empty-house",
    title: "The small house from the mark, its door open and nothing inside",
    x: 140,
    y: 160,
    width: 146,
    height: 115,
    strokes,
  };
}

export default function NotFound() {
  return (
    <section className="wrap lost" aria-labelledby="lost-title">
      <div className="lost-house">
        <Drawing drawing={emptyHouse()} mode="draw" />
      </div>
      <div className="lost-copy">
        <h1 id="lost-title" className="t-display">
          There&rsquo;s no room by that name.
        </h1>
        <p className="t-line">The house has {roomWord} rooms. Try one of these.</p>
        <ul className="lost-rooms">
          {ROOM_ORDER.map((room) => (
            <li key={room.slug}>
              <TextLink href={`/spaces#${room.slug}`}>{room.name}</TextLink>
            </li>
          ))}
        </ul>
        <p className="t-body">
          Or go back to <TextLink href="/">the house</TextLink>.
        </p>
      </div>
    </section>
  );
}
```

**3f. Append to `app/globals.css`:**

```css
/* Press list, quotes, the visit address and the empty house (Task 21). */
.press-list { list-style: none; margin: 0; padding: 0; display: grid; }
.press-item { display: grid; gap: 8px; padding-block: 24px; border-top: 1px solid var(--hair); }
.press-item:last-child { border-bottom: 1px solid var(--hair); }
.press-item .t-title { font-size: clamp(1.5rem, 1.2rem + 1.4vw, 2.2rem); font-weight: 340; letter-spacing: -0.015em; }
.press-item .t-title.press-minor { font-size: clamp(1.25rem, 1.1rem + 0.7vw, 1.6rem); font-weight: 420; }
.press-quotes { display: grid; gap: clamp(56px, 10vw, 112px); margin-top: clamp(28px, 6vw, 56px); }
.press-quote { margin: 0; display: grid; gap: 16px; align-content: center; }
.press-quote cite { font-style: normal; }
@media (min-width: 64rem) { .quote-pair:nth-child(even) .press-quote { order: 2; } }

.address { font-style: normal; }

.lost { display: grid; gap: 32px; align-items: center; min-height: 70svh; padding-block: clamp(40px, 10vw, 120px); }
.lost-house { width: min(72vw, 360px); }
.lost-copy { display: grid; gap: 20px; align-content: start; }
.lost-rooms { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.lost-rooms a { display: inline-flex; align-items: center; min-height: 44px; font-family: var(--font-display); font-weight: 340; font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2.3rem); line-height: 1.1; letter-spacing: -0.015em; }
@media (min-width: 64rem) {
  .lost { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 80px; }
  .lost-house { width: 100%; max-width: 440px; justify-self: end; }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Stop the server on 3022, then in a second terminal: `npm run build && npx next start -p 3022`. The build lists `/menu`, `/press` and `/visit` as static routes. Then run: `node scripts/e2e/pages.mjs`
Expected: every line `ok`, ending with `all checks passed`.

Run `node scripts/e2e/product.mjs` again, because this task shares `ui.tsx` and adds global CSS.
Expected: `all checks passed`.

- [ ] **Step 5: Look**

With Playwright MCP, take screenshots at 390x844 and 1440x900, each at `?at=14:00` and `?at=01:00`, of `http://localhost:3022/menu`, `/press`, `/visit` and `/no-such-room`, and scroll each page fully. Read them at 390 first. Checklist:

`/menu`:
- The h1 is balanced, and the lede names the cuisines in one sentence.
- Nine signatures sit between hairlines, names large in Ysabeau Light, categories small in ink 2.
- Only Curriza (₹545), Patatas Bravas (₹335) and Avocado croissant (₹310) show a price, right-aligned in tabular figures. The other six rows have an empty price column and no dash or placeholder.
- The pizza drawing sits inside Curriza's row, no wider than 22rem, and draws as it scrolls in.
- The dough drawing sits beside the fixed brunch: the hands only, no faces, no knuckle detail.
- The brunch fact file shows Hours and no Price row.
- Lifting either drawing credits "Still from a reel by @thebarnyard.co".

`/press`:
- Five pieces: ELLE Decor India, Architectural Digest India and Condé Nast Traveller India set larger, then Knocksense and The Architect's Diary set smaller.
- Each has a date. The author appears where known, and "announced on Instagram" on AD.
- Each publication name links out, with the stroked glyph on the same line as its last word.
- The two quotes are set in Ysabeau italic, AD's beside the stair drawing and ELLE's beside the entry strips, alternating sides at 1440.
- The credits fact file shows no empty rows.

`/visit`:
- The facade drawing sits in the head, with the corten plate, the logo and the creepers.
- At 01:00 the string-light bulbs and the logo glow.
- The address is set on four lines, parking reads "Ample parking", and the hours and brunch hours are both shown.
- The buttons read Get directions (primary), WhatsApp and Call 87805 91708, each at least 44 px and wrapping cleanly at 390.
- The Instagram link is present.

`/no-such-room`:
- The small house from the mark is drawn large in one line weight, with the door leaf standing open beside an empty doorway and nothing inside.
- "There’s no room by that name." sits on balanced lines.
- Six room names are listed in story order (the entry hall to the bowling alley), each a 44 px target.
- "Or go back to the house" is present.
- At 01:00 the page is in the night palette.
- The tab shows a 404 in DevTools' network panel.

Every route:
- No sideways scroll.
- Headings step h1 to h2 to h3.
- No card boxes, no tracked capitals, no arrows glued to links, no UNKNOWN or CONFIRM anywhere.

If anything fails, fix it and rerun Steps 4 and 5.

- [ ] **Step 6: Commit**

```bash
git add app/menu/page.tsx app/menu/menu.css app/press/page.tsx app/visit/page.tsx app/not-found.tsx app/globals.css scripts/e2e/pages.mjs
git commit -m "feat: menu, press, visit and the empty-house 404"
```

---

### Task 22: The detail floor

The craft standard's detail list is where the money is visible: a favicon set built from the mark, a real OG card per route, a selection colour and focus ring from the palette, structured data, and a site that reads well in search. This task also adds Lenis on fine pointers (spec section 7) and the content check that guards the hard rules on the built HTML.

Verified facts this task relies on (15 Sep 2026):
- google/fonts ships only variable files for both families: `ofl/ysabeauoffice/YsabeauOffice[wght].ttf` (401,964 bytes) and `ofl/hedviglettersserif/HedvigLettersSerif[opsz].ttf` (122,240 bytes). The Google Fonts CSS API snaps `wght@320` to static 300 and 400 faces, so a true 320 instance is cut locally with fontTools `varLib.instancer` (fonttools 4.65.0 installs into a scratch folder with `pip --target`). Satori cannot read variations, so both files must be static (no `fvar`, no `gvar`). After subsetting to Latin, the Ysabeau instance is about 55 KB and the Hedvig instance about 51 KB. Hedvig Letters Serif has no rupee sign (U+20B9), so OG fact lines never use ₹.
- Satori's font `weight` accepts only 100 to 900 in hundreds: the 320 instance registers as weight 300 and the card sets `fontWeight: 300`.
- Next 15.5.25 metadata files: `app/icon.tsx` and `app/apple-icon.tsx` export `size` and `contentType` and are served at `/icon` and `/apple-icon` (linked as `<link rel="icon" href="/icon?<hash>" type="image/png" sizes="32x32">`); `opengraph-image.tsx` exports `alt`, `size`, `contentType` and a default function returning `ImageResponse` from `next/og`, applies to its segment and children, and is prerendered at build (reading fonts with `readFile(join(process.cwd(), "assets", "fonts", ...))` works under `next build --turbopack`, as option one's build shows).
- Next 15.5 metadata merging (`next/dist/lib/metadata/resolve-metadata.js`): a page that sets only `title` and `description` keeps the layout's `openGraph` object, and `og:title`/`og:description` are filled from the page's resolved title and description; `twitter` inherits title, description and images from `openGraph`; a file-based `opengraph-image` fills `openGraph.images` whenever the page does not set `openGraph.images`. So pages set title, description and canonical only.
- Lenis 1.3.26 (`lenis` package, ESM, exports `.` and `./dist/*`): `new Lenis({ autoRaf, lerp, anchors, stopInertiaOnNavigate, ... })`, `lenis.on("scroll", cb)` returns an unsubscribe function, `lenis.raf(ms)`, `lenis.destroy()`, and the recommended stylesheet `lenis/dist/lenis.css` (it keys off `html.lenis`, the class Lenis adds while running). The documented ScrollTrigger sync is `lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)`.

**Files:**
- Create: `assets/fonts/ysabeau-office-320.ttf`, `assets/fonts/hedvig-letters-serif-400.ttf` (generated in Step 3)
- Create: `lib/seo.ts` (route copy, page metadata and JSON-LD data in one place, so the pages, the OG cards and the tests read the same words)
- Create: `app/icon.tsx`, `app/apple-icon.tsx`, `app/manifest.ts`, `app/robots.ts`, `app/sitemap.ts`
- Create: `components/JsonLd.tsx`, `components/og/Template.tsx`, `components/og/fonts.ts`
- Create: `app/opengraph-image.tsx`, `app/spaces/opengraph-image.tsx`, `app/host/opengraph-image.tsx`, `app/shoot/opengraph-image.tsx`, `app/bowl/opengraph-image.tsx`, `app/menu/opengraph-image.tsx`, `app/press/opengraph-image.tsx`, `app/visit/opengraph-image.tsx`
- Create: `components/motion/SmoothScroll.tsx`, `scripts/check-content.mjs`
- Modify: `app/layout.tsx` (site metadata from `lib/seo.ts`, `openGraph` and `twitter` defaults, `<SmoothScroll />` and `<JsonLd />`)
- Modify: `app/page.tsx`, `app/spaces/page.tsx`, `app/host/page.tsx`, `app/shoot/page.tsx`, `app/bowl/page.tsx`, `app/menu/page.tsx`, `app/press/page.tsx`, `app/visit/page.tsx` (replace each page's `metadata` export with `pageMetadata(path)`)
- Modify: `package.json` (`lenis@1.3.26`; `scripts.check`), `.gitignore` (`/.cache/`)
- Test: `tests/seo.test.ts`, `tests/og-fonts.test.ts`, `scripts/e2e/detail.mjs`

**Interfaces:**
- Consumes: `cafe`, `fact`, `siteUrl`, `mapsHref`, `eventDate`, `roomWord`, `capitalise` (`lib/cafe.ts`, Task 1); `formatClock` (`lib/daylight.ts`, Task 1); `MARK_VIEWBOX`, `ARCH_PATH`, `DIVIDER_PATHS`, `SUN_CENTER`, `SUN_RADIUS`, `ALL_PATHS`, `DROPS` (`lib/mark.ts`, Task 1); `ROOM_ORDER` (`lib/house.ts`, Task 16); `loadGsap`, `motionAllowed` (`lib/motion/gsap.ts`, Task 6); `LightProvider`, `LightScript`, `SiteHeader` (Task 5); `SiteFooter` (Task 17); `PenLineProvider` (Task 19); `BASE`, `launch`, `open`, `shot`, `assert`, `report` (`scripts/e2e/lib.mjs`, Task 5); the `.skip` link, `::selection` and `:focus-visible` rules and `--pen` token (Task 5).
- Produces:
  - `lib/seo.ts`: `ROUTES` (`readonly ["/", "/spaces", "/host", "/shoot", "/bowl", "/menu", "/press", "/visit"]`), `type RoutePath`, `interface RouteCopy { title: string; description: string; ogTitle: string; ogFact: string; alt: string }`, `ROUTE_COPY: Record<RoutePath, RouteCopy>`, `pageMetadata(path: RoutePath): Metadata`, `restaurantJsonLd(): Record<string, unknown>`, `BANNED_COPY: RegExp`.
  - `components/og/Template.tsx`: `OG_SIZE = { width: 1200, height: 630 }`, `<OgTemplate title: string fact: string />`.
  - `components/og/fonts.ts`: `OG_FONT_FILES`, `interface OgFont { name: string; data: ArrayBuffer; weight: 300 | 400; style: "normal" }`, `ogFonts(): Promise<OgFont[]>`.
  - `<JsonLd />`, `<SmoothScroll />` (client; renders nothing).
  - Routes `/icon` (32x32 PNG), `/apple-icon` (180x180 PNG), `/manifest.webmanifest`, `/robots.txt`, `/sitemap.xml`, `/<route>/opengraph-image` (1200x630 PNG) for the eight routes.
  - `npm run check` (`node scripts/check-content.mjs`): exits 1 on a flagged value or banned word in the built HTML, a drawing without a credit, a lifted drawing without a photograph, or a press date/link mismatch.

- [ ] **Step 1: Write the failing tests**

`tests/seo.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { cafe, siteUrl } from "@/lib/cafe";
import { BANNED_COPY, ROUTE_COPY, ROUTES, pageMetadata, restaurantJsonLd } from "@/lib/seo";

describe("route copy", () => {
  it("covers the eight routes", () => {
    expect([...ROUTES]).toEqual(["/", "/spaces", "/host", "/shoot", "/bowl", "/menu", "/press", "/visit"]);
    for (const r of ROUTES) expect(ROUTE_COPY[r], r).toBeDefined();
  });

  it("fits search results and the OG card", () => {
    for (const r of ROUTES) {
      const c = ROUTE_COPY[r];
      const full = r === "/" ? c.title : `${c.title} | ${cafe.meta.name}`;
      expect(full.length, `${r} title: ${full}`).toBeLessThanOrEqual(60);
      expect(c.description.length, `${r} description: ${c.description}`).toBeGreaterThanOrEqual(70);
      expect(c.description.length, `${r} description: ${c.description}`).toBeLessThanOrEqual(160);
      expect(c.ogTitle.length, `${r} ogTitle`).toBeLessThanOrEqual(40);
      expect(c.ogFact.length, `${r} ogFact`).toBeLessThanOrEqual(120);
    }
  });

  it("is different on every route", () => {
    for (const key of ["title", "description", "ogTitle", "ogFact"] as const) {
      expect(new Set(ROUTES.map((r) => ROUTE_COPY[r][key])).size, key).toBe(ROUTES.length);
    }
  });

  it("never carries flagged values, banned words, or a glyph the OG fonts lack", () => {
    for (const r of ROUTES) {
      for (const text of Object.values(ROUTE_COPY[r])) {
        expect(text, r).not.toMatch(/UNKNOWN|CONFIRM/);
        expect(text, r).not.toMatch(BANNED_COPY);
      }
      expect(`${ROUTE_COPY[r].ogTitle} ${ROUTE_COPY[r].ogFact}`, r).not.toMatch(/₹/);
    }
  });

  it("targets local intent on the revenue pages (BRIEF section 9)", () => {
    expect(ROUTE_COPY["/host"].title).toMatch(/Ahmedabad/);
    expect(ROUTE_COPY["/shoot"].title).toMatch(/Ahmedabad/);
    expect(ROUTE_COPY["/bowl"].title).toMatch(/Chandkheda/);
  });

  it("builds page metadata", () => {
    expect(pageMetadata("/").title).toEqual({ absolute: ROUTE_COPY["/"].title });
    expect(pageMetadata("/host")).toMatchObject({ title: ROUTE_COPY["/host"].title, description: ROUTE_COPY["/host"].description, alternates: { canonical: "/host" } });
  });
});

describe("structured data and metadata files", () => {
  it("describes the restaurant from cafe.json only", () => {
    const d = restaurantJsonLd();
    expect(d["@type"]).toBe("Restaurant");
    expect(d.name).toBe(cafe.meta.name);
    expect(d.telephone).toBe(cafe.meta.phone);
    expect(d).not.toHaveProperty("geo");
    expect(JSON.stringify(d)).not.toMatch(/UNKNOWN|CONFIRM/);
  });

  it("paints the manifest in paper and points at the mark icons", () => {
    const m = manifest();
    expect(m.background_color).toBe("#E9E8E4");
    expect(m.theme_color).toBe("#E9E8E4");
    expect(m.icons?.map((i) => i.src)).toEqual(["/icon", "/apple-icon"]);
  });

  it("lists the eight routes in the sitemap and points robots at it", () => {
    const s = sitemap();
    expect(s).toHaveLength(8);
    for (const e of s) expect(e.url.startsWith(siteUrl)).toBe(true);
    expect(robots().sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });
});
```

`tests/og-fonts.test.ts`:

```ts
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { OG_FONT_FILES, ogFonts } from "@/components/og/fonts";

/** Table tags from an sfnt header: numTables at offset 4, 16-byte records from offset 12. */
function tables(buf: Buffer): string[] {
  const count = buf.readUInt16BE(4);
  return Array.from({ length: count }, (_, i) => buf.toString("latin1", 12 + i * 16, 16 + i * 16));
}

describe("OG fonts", () => {
  for (const name of Object.values(OG_FONT_FILES)) {
    it(`${name} is a small static TrueType instance`, () => {
      const file = `assets/fonts/${name}`;
      expect(fs.existsSync(file), file).toBe(true);
      const buf = fs.readFileSync(file);
      expect(buf.readUInt32BE(0)).toBe(0x00010000);
      expect(buf.length).toBeLessThan(120_000);
      const t = tables(buf);
      expect(t).toContain("glyf");
      expect(t).not.toContain("fvar");
      expect(t).not.toContain("gvar");
    });
  }

  it("registers both families for Satori", async () => {
    const fonts = await ogFonts();
    expect(fonts.map((f) => [f.name, f.weight])).toEqual([["Ysabeau Office", 300], ["Hedvig Letters Serif", 400]]);
    expect(fonts.every((f) => f.data.byteLength > 10_000)).toBe(true);
  });
});
```

`scripts/e2e/detail.mjs`:

```js
// The detail floor on the production build (port 3022): an OG card per route, JSON-LD, titles and descriptions,
// the favicon set, manifest, robots and sitemap, the selection colour, the first focus ring, and where Lenis runs.
// Run: npm run build && npx next start -p 3022, then: node scripts/e2e/detail.mjs
import { createHash } from "node:crypto";
import { BASE, assert, launch, open, report, shot } from "./lib.mjs";

const ROUTES = ["/", "/spaces", "/host", "/shoot", "/bowl", "/menu", "/press", "/visit"];
const PAPER = "#E9E8E4";

async function fetchLocal(href) {
  const u = new URL(href, BASE);
  const res = await fetch(`${BASE}${u.pathname}${u.search}`);
  return { res, buf: Buffer.from(await res.arrayBuffer()) };
}

function png(buf) {
  const ok = buf.length > 24 && buf.toString("latin1", 1, 4) === "PNG";
  return ok ? { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) } : { width: 0, height: 0 };
}

const browser = await launch();

// 1. Every route: its own OG card, one JSON-LD block, a title, a description and a canonical link.
const cards = new Set();
const titles = new Set();
for (const route of ROUTES) {
  const { page, ctx, errors } = await open(browser, route, { at: "14:00" });
  const og = await page.getAttribute('meta[property="og:image"]', "content");
  assert(!!og, `${route}: og:image is set`);
  if (og) {
    const { res, buf } = await fetchLocal(og);
    const { width, height } = png(buf);
    const type = res.headers.get("content-type") ?? "";
    assert(res.status === 200 && type.startsWith("image/png") && width === 1200 && height === 630, `${route}: OG card is 200 image/png 1200x630 (${res.status} ${type} ${width}x${height})`);
    const own = route === "/" ? "/opengraph-image" : `${route}/opengraph-image`;
    assert(new URL(og).pathname === own, `${route}: OG card is the route's own (${new URL(og).pathname})`);
    cards.add(createHash("sha1").update(buf).digest("hex"));
  }
  const ogAlt = await page.getAttribute('meta[property="og:image:alt"]', "content");
  assert(!!ogAlt && ogAlt.length > 20, `${route}: OG card has alt text`);
  assert((await page.getAttribute('meta[name="twitter:card"]', "content")) === "summary_large_image", `${route}: large twitter card`);
  const title = await page.title();
  titles.add(title);
  assert(title.length > 0 && title.length <= 60 && !/UNKNOWN|CONFIRM/.test(title), `${route}: title fits (${title})`);
  const description = (await page.getAttribute('meta[name="description"]', "content")) ?? "";
  assert(description.length >= 70 && description.length <= 160, `${route}: description is 70 to 160 characters (${description.length})`);
  assert(!!(await page.getAttribute('link[rel="canonical"]', "href")), `${route}: canonical link`);
  const ld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => e.textContent ?? ""));
  let data = null;
  try { data = JSON.parse(ld[0] ?? ""); } catch { data = null; }
  assert(ld.length === 1 && data?.["@type"] === "Restaurant" && data?.address?.postalCode === "382424" && !("geo" in data), `${route}: one Restaurant JSON-LD block that parses`);
  assert(errors.length === 0, `${route}: no console errors (${errors.join(" | ")})`);
  await ctx.close();
}
assert(cards.size === ROUTES.length, `every route has a different OG card (${cards.size} distinct)`);
assert(titles.size === ROUTES.length, `every route has a different title (${titles.size} distinct)`);

// 2. Favicon set, manifest, robots and sitemap; 3. the selection colour.
{
  const { page, ctx } = await open(browser, "/visit", { at: "14:00" });
  const icon = await page.getAttribute('link[rel="icon"][type="image/png"]', "href");
  const apple = await page.getAttribute('link[rel="apple-touch-icon"]', "href");
  for (const [label, href, side] of [["favicon", icon, 32], ["apple touch icon", apple, 180]]) {
    assert(!!href, `${label} is linked`);
    if (!href) continue;
    const { res, buf } = await fetchLocal(href);
    const { width, height } = png(buf);
    assert(res.status === 200 && width === side && height === side, `${label} is a ${side}x${side} PNG (${res.status} ${width}x${height})`);
  }
  const manifestHref = await page.getAttribute('link[rel="manifest"]', "href");
  assert(!!manifestHref, "manifest is linked");
  if (manifestHref) {
    const { res, buf } = await fetchLocal(manifestHref);
    const m = JSON.parse(buf.toString("utf8"));
    assert(res.status === 200 && m.name === "The Barnyard Co." && m.background_color === PAPER && m.theme_color === PAPER, `manifest names the house on paper (${m.background_color})`);
    for (const i of m.icons ?? []) assert((await fetchLocal(i.src)).res.status === 200, `manifest icon ${i.src} is served`);
  }
  const robots = (await fetchLocal("/robots.txt")).buf.toString("utf8");
  assert(/Allow: \//.test(robots) && /Sitemap: .*\/sitemap\.xml/.test(robots), "robots.txt allows crawling and names the sitemap");
  const sitemap = (await fetchLocal("/sitemap.xml")).buf.toString("utf8");
  assert((sitemap.match(/<loc>/g) ?? []).length === ROUTES.length, "sitemap lists the eight routes");

  const selection = await page.evaluate(() => {
    const found = [];
    const walk = (rules) => {
      for (const r of rules) {
        if (r.selectorText && r.selectorText.includes("::selection")) found.push(r.style.cssText);
        if (r.cssRules) walk(r.cssRules);
      }
    };
    for (const s of document.styleSheets) { try { walk(s.cssRules); } catch { /* cross-origin sheet */ } }
    return { found, pen: getComputedStyle(document.documentElement).getPropertyValue("--pen").trim().toLowerCase() };
  });
  assert(selection.found.some((css) => css.includes("--pen")), `::selection paints with the pen (${selection.found.join(" / ")})`);
  assert(selection.pen === "#8e4b2a", `the day pen is corten (${selection.pen})`);
  await ctx.close();
}
{
  const { page, ctx } = await open(browser, "/visit", { at: "01:00" });
  const pen = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--pen").trim().toLowerCase());
  assert(pen === "#d08a5c", `the night pen is lit corten (${pen})`);
  await ctx.close();
}

// 4. The first Tab lands on the skip link, ringed in the pen colour, by day and after dark.
for (const [at, color] of [["14:00", "rgb(142, 75, 42)"], ["01:00", "rgb(208, 138, 92)"]]) {
  const { page, ctx } = await open(browser, "/visit", { at });
  await page.keyboard.press("Tab");
  const f = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { skip: el.classList.contains("skip"), style: cs.outlineStyle, width: parseFloat(cs.outlineWidth), color: cs.outlineColor, top: r.top, height: r.height };
  });
  assert(f.skip, `${at}: the first Tab focuses the skip link`);
  assert(f.style === "solid" && f.width >= 2 && f.color === color, `${at}: the focus ring is a ${color} line (${f.style} ${f.width}px ${f.color})`);
  assert(f.top >= 0 && f.height >= 20, `${at}: the focused skip link is on screen`);
  await shot(page, `detail-focus-${at.slice(0, 2)}`);
  await ctx.close();
}

// 5. Lenis only on a fine pointer with motion allowed.
{
  const { page, ctx } = await open(browser, "/spaces", { width: 1440, height: 900, at: "14:00" });
  const on = await page.waitForFunction(() => document.documentElement.classList.contains("lenis"), null, { timeout: 6000 }).then(() => true, () => false);
  assert(on, "1440 with a fine pointer: Lenis runs");
  await ctx.close();
}
{
  const { page, ctx } = await open(browser, "/spaces", { width: 1440, height: 900, at: "14:00", reducedMotion: true });
  await page.waitForTimeout(3500);
  assert(!(await page.evaluate(() => document.documentElement.classList.contains("lenis"))), "reduced motion: no Lenis");
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/spaces?at=14:00`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  assert(!(await page.evaluate(() => document.documentElement.classList.contains("lenis"))), "390 with touch: no Lenis");
  await ctx.close();
}

await browser.close();
report();
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- seo og-fonts`
Expected: FAIL. `tests/seo.test.ts` fails with `Failed to resolve import "@/app/manifest"` (or `@/lib/seo`), and `tests/og-fonts.test.ts` fails with `Failed to resolve import "@/components/og/fonts"`.

Run (stop any server on 3022 first): `npm run build && (npx next start -p 3022 > /dev/null 2>&1 &) && sleep 6 && node scripts/e2e/detail.mjs`
Expected: `FAIL /: og:image is set` and further FAIL lines, ending `N failure(s)` with exit code 1.

- [ ] **Step 3: Cut the two static OG fonts**

Both families exist on google/fonts only as variable fonts, so download them and cut static instances with fontTools in a git-ignored scratch folder (never into the system Python). Run in Git Bash from the repo root:

```bash
printf '\n# font tooling scratch (fontTools, variable sources)\n/.cache/\n' >> .gitignore
mkdir -p assets/fonts .cache/fonts
curl -fL -o .cache/fonts/YsabeauOffice-wght.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/ysabeauoffice/YsabeauOffice%5Bwght%5D.ttf"
curl -fL -o .cache/fonts/HedvigLettersSerif-opsz.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/hedviglettersserif/HedvigLettersSerif%5Bopsz%5D.ttf"
ls -l .cache/fonts
python -m pip install --target .cache/fonttools fonttools==4.65.0
PYTHONPATH=.cache/fonttools python -m fontTools.varLib.instancer .cache/fonts/YsabeauOffice-wght.ttf wght=320 -o .cache/fonts/ysabeau-320-full.ttf
PYTHONPATH=.cache/fonttools python -m fontTools.varLib.instancer .cache/fonts/HedvigLettersSerif-opsz.ttf opsz=24 -o .cache/fonts/hedvig-24-full.ttf
U="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2039-203A,U+20B9,U+2122"
PYTHONPATH=.cache/fonttools python -m fontTools.subset .cache/fonts/ysabeau-320-full.ttf --unicodes="$U" --layout-features='*' --output-file=assets/fonts/ysabeau-office-320.ttf
PYTHONPATH=.cache/fonttools python -m fontTools.subset .cache/fonts/hedvig-24-full.ttf --unicodes="$U" --layout-features='*' --output-file=assets/fonts/hedvig-letters-serif-400.ttf
PYTHONPATH=.cache/fonttools python -c "
from fontTools.ttLib import TTFont
import os
for f in ['assets/fonts/ysabeau-office-320.ttf', 'assets/fonts/hedvig-letters-serif-400.ttf']:
    t = TTFont(f); cmap = t.getBestCmap()
    print(f, os.path.getsize(f), 'static' if 'fvar' not in t else 'VARIABLE', t['OS/2'].usWeightClass, ''.join(chr(c) for c in (0xe9, 0x2019, 0x20b9) if c in cmap))
"
```

Expected:
- `ls -l` shows `YsabeauOffice-wght.ttf` at 401964 bytes and `HedvigLettersSerif-opsz.ttf` at 122240 bytes. A `curl: (22)` error means the upstream path moved: find the file under https://github.com/google/fonts/tree/main/ofl and correct the URL.
- The instancer prints `Dropping fvar table` and `Saving instance font` for each font.
- The check prints about `assets/fonts/ysabeau-office-320.ttf 54632 static 320 é’₹` and `assets/fonts/hedvig-letters-serif-400.ttf 50628 static 400 é’`. Hedvig has no ₹, which is why no OG line may use it.

opsz 24 is the largest optical size, drawn for display settings; the card sets the fact line at 28 px.

- [ ] **Step 4: Write `lib/seo.ts`**

Every string reads its facts from `cafe.json`. Lengths were measured against the current `cafe.json`: titles are 23 to 58 characters including the template, and descriptions are 131 to 160.

```ts
import type { Metadata } from "next";
import { cafe, capitalise, eventDate, fact, mapsHref, roomWord, siteUrl } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";
import { ROOM_ORDER } from "@/lib/house";

export const ROUTES = ["/", "/spaces", "/host", "/shoot", "/bowl", "/menu", "/press", "/visit"] as const;
export type RoutePath = (typeof ROUTES)[number];

export interface RouteCopy {
  /** Page title without the "| The Barnyard Co." template (the home title is absolute). */
  title: string;
  description: string;
  /** The OG card's headline and its one fact line (no ₹: the card's text face has no rupee sign). */
  ogTitle: string;
  ogFact: string;
  alt: string;
}

/** Words the café's register never uses (CLAUDE.md). */
export const BANNED_COPY = /\b(welcome to|unforgettable|journey|experience|immersive|whimsical)\b/i;

const { meta } = cafe;

function find<T>(items: T[], ok: (item: T) => boolean, what: string): T {
  const item = items.find(ok);
  if (!item) throw new Error(`cafe.json has no ${what}`);
  return item;
}
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const list = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`);

const size = meta.sizeSqFt.toLocaleString("en-IN");
const open = formatClock(meta.hours.open);
const close = formatClock(meta.hours.close);
const place = `${meta.address.area}, ${meta.city}`;
const landmark = lower(meta.address.landmark);
const parking = fact(meta.parking)?.split(";")[0];

const publication = (name: string) => find(cafe.press, (p) => p.publication === name, `press piece "${name}"`).publication;
const event = (slug: string) => find(cafe.events, (e) => e.slug === slug, `event "${slug}"`);
const dish = (name: string) => find(cafe.menu.signatures, (s) => s.name === name, `signature "${name}"`).name;

const garba = event("coffee-garba");
const hoodie = event("hoodie-workshop");
const nocatch = event("nocatch");
const recently = lower(find(cafe.spaces, (s) => s.slug === "bowling", "bowling space").description.split(".")[0]);
const roomNames = ROOM_ORDER.map((r, i) => (i === 0 ? r.name : lower(r.name)));
const tierOne = cafe.press.filter((p) => p.tier === 1).map((p) => p.publication);
const brunchFrom = `${formatClock(meta.brunchHours.open)} to ${formatClock(meta.brunchHours.close)}`;
const brunch = cafe.menu.brunch.name.toLowerCase();

const copy = (title: string, description: string, ogTitle: string, ogFact: string): RouteCopy => ({ title, description, ogTitle, ogFact, alt: `${ogTitle} ${ogFact}` });

export const ROUTE_COPY: Record<RoutePath, RouteCopy> = {
  "/": copy(
    `${meta.name}, a loft house in ${place}`,
    `A ${size} sq ft loft house café in ${meta.address.area}, ${meta.address.region}, written about by ${list([publication("Architectural Digest India"), publication("ELLE Decor India")])}. Open ${open} to ${close}.`,
    "The house, drawn in one line.",
    `A ${size} sq ft loft house in ${place}. Open ${open} to ${close}.`,
  ),
  "/spaces": copy(
    "The rooms",
    `The facade and ${roomWord} rooms of a ${size} sq ft loft house in ${place}, each drawn in one line from the café’s own photographs.`,
    `${capitalise(roomWord)} rooms, one line.`,
    `${list(roomNames)}.`,
  ),
  "/host": copy(
    `Host an event in ${place}`,
    `Birthdays, ceremonies and private hire in a ${size} sq ft loft house in ${place}. ${garba.name} and a ${hoodie.name.toLowerCase()} were held here.`,
    "Borrow the house for an evening.",
    `${garba.name}, ${eventDate(garba.date)}. ${capitalise(hoodie.name.toLowerCase())}, ${eventDate(hoodie.date)}.`,
  ),
  "/shoot": copy(
    `Shoot location in ${meta.city}`,
    `Film, photo and brand shoots in a magazine-published ${size} sq ft loft house in ${place}, with ${roomWord} rooms. The ${nocatch.name} was shot here.`,
    "One house, many sets.",
    `${capitalise(roomWord)} rooms in a ${size} sq ft loft house. The ${nocatch.name} was shot here.`,
  ),
  "/bowl": copy(
    `Bowling in ${place}`,
    `A bowling alley, ${recently} at ${meta.name} in ${meta.address.area}, ${meta.address.region}. Ask the house about lanes and timings on WhatsApp.`,
    `${capitalise(recently)}.`,
    `A bowling alley at ${meta.name}, ${meta.address.area}. Ask the house about lanes and timings.`,
  ),
  "/menu": copy(
    "Menu",
    `A few signatures from ${meta.name}: ${dish("Curriza")}, ${dish("Patatas Bravas").toLowerCase()}, an ${dish("Avocado croissant").toLowerCase()}, ${dish("Tiramisu").toLowerCase()} and a ${brunch} from ${brunchFrom}.`,
    "A few signatures.",
    `${dish("Curriza")}, ${dish("Patatas Bravas").toLowerCase()}, an ${dish("Avocado croissant").toLowerCase()} and a ${brunch} from ${brunchFrom}.`,
  ),
  "/press": copy(
    "Written about",
    `${meta.name} in ${list(cafe.press.map((p) => p.publication))}, each piece dated and linked.`,
    "Written about.",
    `${list(tierOne)}.`,
  ),
  "/visit": copy(
    `Find the house in ${place}`,
    `${meta.address.line1}, ${meta.address.line2}, ${landmark}, ${place} ${meta.address.postalCode}. Open ${open} to ${close}.${parking ? ` ${parking}.` : ""}`,
    "Find the house.",
    `${meta.address.line2}, ${landmark}, ${meta.address.area}. Open ${open} to ${close}.`,
  ),
};

/** A page's metadata: title, description and canonical. og:title, og:description and the twitter card inherit from these (Next 15.5 resolve-metadata). */
export function pageMetadata(path: RoutePath): Metadata {
  const c = ROUTE_COPY[path];
  return { title: path === "/" ? { absolute: c.title } : c.title, description: c.description, alternates: { canonical: path } };
}

/**
 * Restaurant structured data from cafe.json only. Hours that cross midnight are one specification
 * (schema.org: closes earlier than opens spans the next day). geo is omitted while unknown.
 */
export function restaurantJsonLd(): Record<string, unknown> {
  const { address } = meta;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: meta.name,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    telephone: meta.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.line1}, ${address.line2}, ${address.landmark}`,
      addressLocality: `${address.area}, ${meta.city}`,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    hasMap: mapsHref,
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", opens: meta.hours.open, closes: meta.hours.close }],
    servesCuisine: cafe.menu.cuisines,
    sameAs: [meta.instagram],
  };
  const geo = fact(meta.geo);
  if (geo) data.geo = geo;
  return data;
}
```

- [ ] **Step 5: The favicon set, manifest, robots, sitemap and JSON-LD**

`app/icon.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { ARCH_PATH, DIVIDER_PATHS, SUN_CENTER, SUN_RADIUS } from "@/lib/mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * At 32 px the whole mark is noise, so the favicon keeps the arch, the dividers and the sun, cropped close
 * (viewBox 45..275) with the stroke thickened to about 2 px so the line survives. Ink on paper.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#E9E8E4" }}>
        <svg viewBox="45 45 230 230" width={32} height={32} fill="none" stroke="#1F1C1A" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round">
          <path d={ARCH_PATH} />
          {DIVIDER_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
          <circle cx={SUN_CENTER.x} cy={SUN_CENTER.y} r={SUN_RADIUS + 4} />
        </svg>
      </div>
    ),
    size,
  );
}
```

`app/apple-icon.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { ALL_PATHS, DROPS, MARK_VIEWBOX, SUN_CENTER, SUN_RADIUS } from "@/lib/mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The whole mark on drafting film, given room: 132 px inside 180, a 2 px line. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#E9E8E4" }}>
        <svg viewBox={MARK_VIEWBOX} width={132} height={132} fill="none" stroke="#1F1C1A" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
          {ALL_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
          <circle cx={SUN_CENTER.x} cy={SUN_CENTER.y} r={SUN_RADIUS} />
          {DROPS.map((d) => (
            <circle key={d.x} cx={d.x} cy={d.y} r={4} fill="#1F1C1A" stroke="none" />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
```

`app/manifest.ts`:

```ts
import type { MetadataRoute } from "next";
import { cafe } from "@/lib/cafe";
import { ROUTE_COPY } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: cafe.meta.name,
    short_name: cafe.meta.shortName,
    description: ROUTE_COPY["/"].description,
    start_url: "/",
    display: "standalone",
    background_color: "#E9E8E4",
    theme_color: "#E9E8E4",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
```

`app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/cafe";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/lab/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

`app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/cafe";
import { ROUTES } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-15");
  return ROUTES.map((r) => ({
    url: `${siteUrl}${r === "/" ? "" : r}`,
    lastModified,
    changeFrequency: r === "/" ? "weekly" : "monthly",
    priority: r === "/" ? 1 : r === "/host" || r === "/shoot" || r === "/bowl" ? 0.9 : 0.7,
  }));
}
```

`components/JsonLd.tsx`:

```tsx
import { restaurantJsonLd } from "@/lib/seo";

/** Restaurant structured data, rendered once in the layout. `<` is escaped so the JSON can never close the script. */
export function JsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()).replace(/</g, "\\u003c") }} />;
}
```

- [ ] **Step 6: The OG card and one per route**

`components/og/fonts.ts`:

```ts
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_FONT_FILES = { display: "ysabeau-office-320.ttf", text: "hedvig-letters-serif-400.ttf" } as const;

export interface OgFont { name: string; data: ArrayBuffer; weight: 300 | 400; style: "normal" }

let cache: Promise<OgFont[]> | null = null;

/**
 * Fonts for ImageResponse, read from disk on the Node runtime when the cards prerender at build.
 * Static instances cut in Step 3: Ysabeau Office at wght 320 (registered as 300, because Satori accepts
 * weights in hundreds only) and Hedvig Letters Serif at opsz 24. Satori needs at least one font.
 */
export function ogFonts(): Promise<OgFont[]> {
  cache ??= (async (): Promise<OgFont[]> => {
    const dir = join(process.cwd(), "assets", "fonts");
    const [display, text] = await Promise.all([readFile(join(dir, OG_FONT_FILES.display)), readFile(join(dir, OG_FONT_FILES.text))]);
    const toArrayBuffer = (b: Buffer) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
    return [
      { name: "Ysabeau Office", data: toArrayBuffer(display), weight: 300, style: "normal" },
      { name: "Hedvig Letters Serif", data: toArrayBuffer(text), weight: 400, style: "normal" },
    ];
  })();
  return cache;
}
```

`components/og/Template.tsx` (a drafting-film card: paper ground, the ink mark with the name, the title in light Ysabeau, one fact line in Hedvig, and the mark's arch drawn thin at card scale with the sun on its head at 2 PM, as the house shows it):

```tsx
import { cafe } from "@/lib/cafe";
import { ALL_PATHS, DROPS, MARK_VIEWBOX, SUN_CENTER, SUN_RADIUS } from "@/lib/mark";

export const OG_SIZE = { width: 1200, height: 630 };

const PAPER = "#E9E8E4";
const INK = "#1F1C1A";
const INK_2 = "#5A5650";
const HAIR = "#B9B6AF";

/* The mark's arch at card scale: span 420, standing on the bottom edge, its head reaching y 90. */
const ARCH = { left: 760, right: 1180, centre: 970, spring: 300, r: 210 };
/* The sun on the arch head at 2 PM: clockT = (14 - 11) / 16, from the left springing (11 AM) to the right (3 AM). */
const T = (14 - 11) / 16;
const SUN = { x: ARCH.centre - Math.cos(Math.PI * T) * ARCH.r, y: ARCH.spring - Math.sin(Math.PI * T) * ARCH.r };

/** One template, eight routes. Satori: flexbox only; every div with more than one child sets display flex. */
export function OgTemplate({ title, fact }: { title: string; fact: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: PAPER, color: INK, fontFamily: "Ysabeau Office" }}>
      <svg viewBox="0 0 1200 630" width={1200} height={630} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={64} y1={566} x2={1136} y2={566} stroke={HAIR} strokeWidth={1} />
        <line x1={ARCH.centre} y1={ARCH.spring - ARCH.r} x2={ARCH.centre} y2={630} stroke={HAIR} strokeWidth={1} />
        <path d={`M ${ARCH.left} 630 L ${ARCH.left} ${ARCH.spring} A ${ARCH.r} ${ARCH.r} 0 0 1 ${ARCH.right} ${ARCH.spring} L ${ARCH.right} 630`} stroke={INK} strokeWidth={1.5} />
        <circle cx={SUN.x} cy={SUN.y} r={13} stroke={INK} strokeWidth={1.5} fill={PAPER} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "56px 64px 96px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg viewBox={MARK_VIEWBOX} width={64} height={64} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
            {ALL_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
            <circle cx={SUN_CENTER.x} cy={SUN_CENTER.y} r={SUN_RADIUS} />
            {DROPS.map((d) => (
              <circle key={d.x} cx={d.x} cy={d.y} r={4} fill={INK} stroke="none" />
            ))}
          </svg>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 300, letterSpacing: -0.3 }}>{cafe.meta.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 640 }}>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1, fontWeight: 300, letterSpacing: -1.5 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 28, lineHeight: 1.35, color: INK_2, fontFamily: "Hedvig Letters Serif", fontWeight: 400 }}>{fact}</div>
        </div>
      </div>
    </div>
  );
}
```

The text column stops at 704 px (64 + 640) and the arch starts at 760, so no title can run into the line.

`app/opengraph-image.tsx` (the home card; also inherited by the 404):

```tsx
import { ImageResponse } from "next/og";
import { ogFonts } from "@/components/og/fonts";
import { OG_SIZE, OgTemplate } from "@/components/og/Template";
import { ROUTE_COPY } from "@/lib/seo";

const copy = ROUTE_COPY["/"];

export const alt = copy.alt;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<OgTemplate title={copy.ogTitle} fact={copy.ogFact} />, { ...size, fonts: await ogFonts() });
}
```

`app/spaces/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { ogFonts } from "@/components/og/fonts";
import { OG_SIZE, OgTemplate } from "@/components/og/Template";
import { ROUTE_COPY } from "@/lib/seo";

const copy = ROUTE_COPY["/spaces"];

export const alt = copy.alt;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<OgTemplate title={copy.ogTitle} fact={copy.ogFact} />, { ...size, fonts: await ogFonts() });
}
```

`app/host/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { ogFonts } from "@/components/og/fonts";
import { OG_SIZE, OgTemplate } from "@/components/og/Template";
import { ROUTE_COPY } from "@/lib/seo";

const copy = ROUTE_COPY["/host"];

export const alt = copy.alt;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<OgTemplate title={copy.ogTitle} fact={copy.ogFact} />, { ...size, fonts: await ogFonts() });
}
```

`app/shoot/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { ogFonts } from "@/components/og/fonts";
import { OG_SIZE, OgTemplate } from "@/components/og/Template";
import { ROUTE_COPY } from "@/lib/seo";

const copy = ROUTE_COPY["/shoot"];

export const alt = copy.alt;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<OgTemplate title={copy.ogTitle} fact={copy.ogFact} />, { ...size, fonts: await ogFonts() });
}
```

`app/bowl/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { ogFonts } from "@/components/og/fonts";
import { OG_SIZE, OgTemplate } from "@/components/og/Template";
import { ROUTE_COPY } from "@/lib/seo";

const copy = ROUTE_COPY["/bowl"];

export const alt = copy.alt;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<OgTemplate title={copy.ogTitle} fact={copy.ogFact} />, { ...size, fonts: await ogFonts() });
}
```

`app/menu/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { ogFonts } from "@/components/og/fonts";
import { OG_SIZE, OgTemplate } from "@/components/og/Template";
import { ROUTE_COPY } from "@/lib/seo";

const copy = ROUTE_COPY["/menu"];

export const alt = copy.alt;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<OgTemplate title={copy.ogTitle} fact={copy.ogFact} />, { ...size, fonts: await ogFonts() });
}
```

`app/press/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { ogFonts } from "@/components/og/fonts";
import { OG_SIZE, OgTemplate } from "@/components/og/Template";
import { ROUTE_COPY } from "@/lib/seo";

const copy = ROUTE_COPY["/press"];

export const alt = copy.alt;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<OgTemplate title={copy.ogTitle} fact={copy.ogFact} />, { ...size, fonts: await ogFonts() });
}
```

`app/visit/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { ogFonts } from "@/components/og/fonts";
import { OG_SIZE, OgTemplate } from "@/components/og/Template";
import { ROUTE_COPY } from "@/lib/seo";

const copy = ROUTE_COPY["/visit"];

export const alt = copy.alt;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<OgTemplate title={copy.ogTitle} fact={copy.ogFact} />, { ...size, fonts: await ogFonts() });
}
```

- [ ] **Step 7: Smooth scrolling, the layout and per-route metadata**

```bash
npm install -E lenis@1.3.26
```

`components/motion/SmoothScroll.tsx`:

```tsx
"use client";

import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { loadGsap, motionAllowed } from "@/lib/motion/gsap";

/**
 * Lenis on fine pointers only, with motion allowed (spec section 7). It loads when the browser is idle after
 * first paint and runs on GSAP's ticker, so ScrollTrigger scrubs (drawings, annotations, the ELLE strips)
 * stay in step with the smoothed scroll. `anchors` stays off: the skip link and the /spaces room list keep
 * native hash jumps, which also move keyboard focus.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!motionAllowed() || !matchMedia("(pointer: fine)").matches) return;
    let cancelled = false;
    let teardown: (() => void) | undefined;
    const start = () => {
      Promise.all([import("lenis"), loadGsap()]).then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
        if (cancelled) return;
        const lenis = new Lenis({ lerp: 0.09, autoRaf: false, anchors: false, stopInertiaOnNavigate: true });
        const off = lenis.on("scroll", () => ScrollTrigger.update());
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        teardown = () => {
          off();
          gsap.ticker.remove(tick);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
        };
      });
    };
    const idle = typeof window.requestIdleCallback === "function";
    const handle = idle ? window.requestIdleCallback(start, { timeout: 2000 }) : window.setTimeout(start, 1200);
    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      teardown?.();
    };
  }, []);
  return null;
}
```

`app/layout.tsx`: the whole file as it stands after Tasks 5, 17, 19 and this task. This task changes only four things: the `metadata` object, the imports of `JsonLd`, `SmoothScroll` and `ROUTE_COPY`, and the `<SmoothScroll />` and `<JsonLd />` elements after `</LightProvider>`. If Task 19 placed `PenLineProvider` somewhere else, keep its placement and make only those four changes.

```tsx
import type { Metadata, Viewport } from "next";
import { Hedvig_Letters_Serif, Ysabeau_Office } from "next/font/google";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { JsonLd } from "@/components/JsonLd";
import { LightProvider } from "@/components/light/LightProvider";
import { LightScript } from "@/components/light/LightScript";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PenLineProvider } from "@/components/nav/PenLine";
import { cafe, siteUrl } from "@/lib/cafe";
import { ROUTE_COPY } from "@/lib/seo";
import "./globals.css";

const ysabeau = Ysabeau_Office({ subsets: ["latin"], variable: "--font-ysabeau", display: "swap" });
const hedvig = Hedvig_Letters_Serif({ subsets: ["latin"], variable: "--font-hedvig", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: ROUTE_COPY["/"].title, template: `%s | ${cafe.meta.name}` },
  description: ROUTE_COPY["/"].description,
  applicationName: cafe.meta.name,
  openGraph: { siteName: cafe.meta.name, locale: "en_IN", type: "website" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#e9e8e4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ysabeau.variable} ${hedvig.variable}`} data-regime="day" suppressHydrationWarning>
      <head><LightScript /></head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <LightProvider>
          <PenLineProvider>
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
          </PenLineProvider>
        </LightProvider>
        <SmoothScroll />
        <JsonLd />
      </body>
    </html>
  );
}
```

Per-route metadata. In each page below, delete its existing `export const metadata` (or `generateMetadata`) block, add the two imports if they are missing, and add the one line. The words live in `lib/seo.ts` and are reviewed by `tests/seo.test.ts`, so the OG card, the page title and the description never drift apart.

```tsx
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
```

| File | Line to add |
|---|---|
| `app/page.tsx` | `export const metadata: Metadata = pageMetadata("/");` |
| `app/spaces/page.tsx` | `export const metadata: Metadata = pageMetadata("/spaces");` |
| `app/host/page.tsx` | `export const metadata: Metadata = pageMetadata("/host");` |
| `app/shoot/page.tsx` | `export const metadata: Metadata = pageMetadata("/shoot");` |
| `app/bowl/page.tsx` | `export const metadata: Metadata = pageMetadata("/bowl");` |
| `app/menu/page.tsx` | `export const metadata: Metadata = pageMetadata("/menu");` |
| `app/press/page.tsx` | `export const metadata: Metadata = pageMetadata("/press");` |
| `app/visit/page.tsx` | `export const metadata: Metadata = pageMetadata("/visit");` |

Check: `grep -n "metadata" app/page.tsx app/*/page.tsx`
Expected: exactly one `export const metadata: Metadata = pageMetadata(...)` line per page (eight) and no other metadata exports. A page marked `"use client"` cannot export metadata: move its client parts into a child component and keep the page a server component.

- [ ] **Step 8: The content check**

`scripts/check-content.mjs` (ported from option one and extended to the built HTML, the drawings and the photographs):

```js
// Guards the demo's rules on the production build: verified press facts; every drawing credited; every
// lifted drawing has its photograph; no UNKNOWN/CONFIRM value and no banned word in any built page.
// Run after `npm run build`: npm run check
import fs from "node:fs";
import path from "node:path";

const cafe = JSON.parse(fs.readFileSync("content/cafe.json", "utf8"));
const drawings = JSON.parse(fs.readFileSync("content/drawings.json", "utf8")).drawings;
const photos = fs.existsSync("content/photos.json") ? JSON.parse(fs.readFileSync("content/photos.json", "utf8")) : {};
const failures = [];
const fail = (msg) => failures.push(msg);

// 1. Press: the dates and links verified by the research (14 Sep 2026), and every piece dated and linked.
const press = Object.fromEntries(cafe.press.map((p) => [p.publication, p]));
const verified = {
  "Condé Nast Traveller India": { date: "2024-09-12", link: "https://www.cntraveller.in/story/cafes-in-ahmedabad/" },
  "ELLE Decor India": { date: "2025-06-10", link: "https://elledecor.in/12-design-oriented-restaurants-delhi-bengaluru-amritsar-hyderabad/" },
};
for (const [pub, v] of Object.entries(verified)) {
  const p = press[pub];
  if (!p) { fail(`press: ${pub} is missing`); continue; }
  if (p.date !== v.date) fail(`press: ${pub} date ${p.date} is not ${v.date}`);
  if (p.link !== v.link) fail(`press: ${pub} link ${p.link} is not ${v.link}`);
}
for (const p of cafe.press) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) fail(`press: ${p.publication} date "${p.date}" is not YYYY-MM-DD`);
  if (!/^https:\/\//.test(p.link)) fail(`press: ${p.publication} link "${p.link}" is not https`);
}

// 2. Drawings: a credit wherever there is a source photograph; a photograph wherever the paper lifts.
for (const d of drawings) {
  if (d.source && !d.credit?.trim()) fail(`drawing ${d.id}: has a source photograph but no credit`);
  if (d.credit && !/@[\w.]+/.test(d.credit)) fail(`drawing ${d.id}: credit "${d.credit}" names no handle`);
  if (!d.lift) continue;
  const p = photos[d.id];
  if (!p) { fail(`drawing ${d.id}: lift is true but content/photos.json has no entry (run node scripts/build-photos.mjs)`); continue; }
  const file = path.join("public", p.src);
  if (!fs.existsSync(file)) fail(`drawing ${d.id}: ${file} is missing`);
  if (!(p.width > 0 && p.width <= 1600 && p.height > 0)) fail(`drawing ${d.id}: photograph ${p.width}x${p.height} is not 1 to 1600 px wide`);
}
for (const id of Object.keys(photos)) {
  if (!drawings.some((d) => d.id === id && d.lift)) fail(`photos.json: ${id} is not a drawing that lifts`);
}

// 3. Built pages: flagged values anywhere in the markup (scripts removed, so serialized props do not count);
//    banned words in the visible copy, after removing text quoted from cafe.json.
const APP = path.join(".next", "server", "app");
const BANNED = /\b(welcome to|unforgettable|journey|experience|immersive|whimsical)\b/i;
const quoted = [];
const collect = (v) => {
  if (typeof v === "string") {
    for (const part of [v, ...v.split(/(?<=[.;])\s+/)]) if (part.length >= 12) quoted.push(part);
  } else if (v && typeof v === "object") Object.values(v).forEach(collect);
};
collect(cafe);
quoted.sort((a, b) => b.length - a.length);

if (!fs.existsSync(APP)) {
  fail(`${APP} does not exist: run npm run build first`);
} else {
  const pages = fs.readdirSync(APP, { recursive: true }).map(String).filter((f) => f.endsWith(".html"));
  if (pages.length < 9) fail(`expected at least 9 built pages in ${APP} (eight routes and the 404), found ${pages.length}`);
  for (const f of pages) {
    const markup = fs.readFileSync(path.join(APP, f), "utf8").replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");
    const flagged = markup.match(/.{0,50}\b(UNKNOWN|CONFIRM)\b.{0,50}/);
    if (flagged) fail(`${f}: renders a flagged value: ...${flagged[0]}...`);
    let text = markup
      .replace(/<[^>]+>/g, " ")
      .replace(/&#x27;|&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ");
    for (const q of quoted) text = text.split(q).join(" ");
    const banned = text.match(new RegExp(`.{0,50}${BANNED.source}.{0,50}`, "i"));
    if (banned) fail(`${f}: copy uses a banned word: ...${banned[0]}...`);
  }
  console.log(`scanned ${pages.length} built pages`);
}

if (failures.length) {
  for (const m of failures) console.error(`FAIL ${m}`);
  process.exit(1);
}
console.log("content ok");
```

```bash
npm pkg set scripts.check="node scripts/check-content.mjs"
```

- [ ] **Step 9: Run to verify it passes**

Run: `npm test -- seo og-fonts`
Expected: PASS, `Test Files  2 passed`, 12 tests.

Run: `npm run lint`
Expected: exits 0 with no errors.

Stop any server on 3022, then run: `npm run build`
Expected: the route table lists `/opengraph-image`, `/spaces/opengraph-image`, `/host/opengraph-image`, `/shoot/opengraph-image`, `/bowl/opengraph-image`, `/menu/opengraph-image`, `/press/opengraph-image`, `/visit/opengraph-image`, `/icon`, `/apple-icon`, `/manifest.webmanifest`, `/robots.txt` and `/sitemap.xml` as static (○). A Satori error such as `Expected <div> to have explicit "display: flex"` means a div with more than one child lost its `display: flex`.

Run: `npm run check`
Expected: `scanned 9 built pages` (or more) then `content ok`, exit 0. Any `FAIL` line names the page or drawing: fix the content or the page, never the check.

Run: `(npx next start -p 3022 > /dev/null 2>&1 &) && sleep 6 && node scripts/e2e/detail.mjs`
Expected: every line `ok`, ending `all checks passed`.

- [ ] **Step 10: Look**

With Playwright MCP against `http://localhost:3022`:

1. Resize to 1200x630 and screenshot `/opengraph-image`, `/spaces/opengraph-image`, `/host/opengraph-image`, `/bowl/opengraph-image` and `/press/opengraph-image`. Read each one:
   - The ground is neutral grey drafting film (#E9E8E4), not cream.
   - The mark at top left is complete in one ink line (arch, sun and rays, steam, plant with three drops, the house with its door) beside "The Barnyard Co.".
   - The title is light Ysabeau Office, with the calligraphic terminals on "a" and "y". If it shows the even geometric strokes of Noto Sans, the fonts did not load.
   - The title wraps to at most two lines and leaves no single-word last line.
   - The fact line is Hedvig Letters Serif in ink 2, on at most three lines. On the press card, "Condé" shows its é.
   - The thin arch stands on the bottom edge at the right, with the sun ring on its head left of centre. No text touches it.
2. Screenshot `/icon` and `/apple-icon` (open each at 390x844 and zoom the screenshot). The favicon shows the arch, the three dividers and the sun, legible at 32 px. The apple icon shows the whole mark centred with room around it.
3. At 390x844, open `/visit?at=14:00`, press Tab and screenshot. The skip link sits at top left with a 2 px corten ring, offset from the box. Triple-click a paragraph and screenshot: the selection is corten with paper-coloured text. Repeat at `?at=01:00`: the ring and selection use lit corten (#D08A5C) on the steel ground, and the text stays readable.
4. At 1440x900, open `/spaces?at=14:00` and scroll with the mouse wheel through two rooms, screenshotting midway and at rest.
   - The scroll glides and stops softly.
   - Scrubbed drawings and annotation leaders stay in step with the page, with no lag and no jump.
   - `document.documentElement.classList.contains("lenis")` is `true`.
   - Tab to a room in the plain text room list and press Enter: the page jumps to that room and focus lands in it.
   - Repeat at `?at=01:00`.
5. At 390x844 (touch emulation), open `/spaces?at=14:00`. Scrolling is native and `html` has no `lenis` class.

- [ ] **Step 11: Commit**

```bash
git add .gitignore assets/fonts/ysabeau-office-320.ttf assets/fonts/hedvig-letters-serif-400.ttf lib/seo.ts \
  app/icon.tsx app/apple-icon.tsx app/manifest.ts app/robots.ts app/sitemap.ts app/layout.tsx \
  app/opengraph-image.tsx app/spaces/opengraph-image.tsx app/host/opengraph-image.tsx app/shoot/opengraph-image.tsx \
  app/bowl/opengraph-image.tsx app/menu/opengraph-image.tsx app/press/opengraph-image.tsx app/visit/opengraph-image.tsx \
  app/page.tsx app/spaces/page.tsx app/host/page.tsx app/shoot/page.tsx app/bowl/page.tsx app/menu/page.tsx app/press/page.tsx app/visit/page.tsx \
  components/JsonLd.tsx components/og/Template.tsx components/og/fonts.ts components/motion/SmoothScroll.tsx \
  scripts/check-content.mjs scripts/e2e/detail.mjs tests/seo.test.ts tests/og-fonts.test.ts package.json package-lock.json
git commit -m "feat: detail floor: favicon set, an OG card per route, JSON-LD, route metadata, Lenis on fine pointers, content check"
```

---

### Task 23: Verification, critique and handover

This task proves the site against the spec and hands it over.
- One command runs every browser check.
- axe runs on every route by day and after dark.
- Lighthouse covers mobile scores.
- A budget script enforces spec section 9.
- A screenshot set feeds a written critique and its fixes.
- A README explains how the drawings are made and reviewed, and how an illustrator's SVG replaces one (spec section 3.5).
- This option's open questions are appended to `docs/OPEN-QUESTIONS.md`.

Two facts shape the scripts, both verified on 15 Sep 2026:
- **Dev and production cannot share `.next` in Next 15.5.** A dev compile rewrites `.next/app-build-manifest.json` and `build-manifest.json` with dev chunks. Option one's `.next` shows exactly this: its manifests list `hmr-client` chunks while its prerendered HTML still loads hashed production chunks. The `/lab` checks need the dev server and the rest need `next start`. So `next.config.ts` sends the dev server to `.next-dev`, using Next's documented config function `(phase) => config` with `PHASE_DEVELOPMENT_SERVER` from `next/constants`. `normalizeConfig(phase, config)` in `next/dist/server/config-shared.js` calls it. Both servers can then run at once. Next adds `${distDir}/types/**/*.ts` to `tsconfig.json` on its own (`writeConfigurationDefaults`), so this task adds the `.next-dev` entry up front.
- **First-load JS is measured from the build's own HTML.** `next build --turbopack` prerenders every route to `.next/server/app/<route>.html` (`index.html`, `spaces.html`, ..., `_not-found.html`). Each page's first-load JavaScript is exactly its `<script src="/_next/static/chunks/<hash>.js" async>` tags; the `noModule` polyfill never runs in modern browsers. The chunk files live in `.next/static/chunks/`. On the untouched scaffold that set is 5 files totalling 113.7 KB gzipped, which leaves about 66 KB of the 180 KB budget for the site. Dynamic imports (GSAP, Lenis) are not in those tags, which matches the spec's "initial JS". `.next/app-build-manifest.json` is not used, because a dev run can overwrite it.

**Files:**
- Create: `lib/draw/illustration.ts`, `scripts/illustrations.ts`, `scripts/export-drawing.ts`, `drawings/illustrated.ts` (generated, committed), `tests/illustration.test.ts`
- Create: `scripts/e2e/all.mjs`, `scripts/e2e/axe.mjs`, `scripts/lighthouse-all.mjs`, `scripts/budget.mjs`, `scripts/e2e/shots.mjs`, `docs/critique.md`
- Modify: `drawings/index.ts` (prefers `drawings/<id>.svg` through `ILLUSTRATED`; adds `pickDrawing`)
- Modify: `next.config.ts` (the dev server builds into `.next-dev`), `tsconfig.json` (include `.next-dev/types/**/*.ts`), `eslint.config.mjs` (ignore `.next-dev/**`), `.gitignore` (`/.next-dev/`)
- Modify: `package.json` (devDependencies `axe-core@4.13.0`, `lighthouse@13.4.1`; scripts `illustrations`, `predev`, `prebuild`)
- Modify: `README.md` (replace), `docs/OPEN-QUESTIONS.md` (append this option's questions)
- Test: `tests/illustration.test.ts`; the final full run in Step 12

**Interfaces:**
- Consumes:
  - `DRAWINGS`, `drawingFor` (Task 3) and the drawing modules `markDrawing` (`./mark`), `facadeDrawing` (`./facade`, Task 7), `entryDrawing` (`./entry`, Task 8), `mainFloorDrawing` (`./main-floor`), `wallLampDrawing` (`./wall-lamp`, Task 9), `mezzanineStairDrawing` (`./mezzanine-stair`), `mezzanineNightDrawing` (`./mezzanine-night`, Task 10), `courtyardDrawing` (`./courtyard`), `gamesDrawing` (`./games`, Task 11), `alleySignDrawing` (`./alley-sign`, Task 12), `hoodieDrawing` (`./hoodie`), `nocatchDrawing` (`./nocatch`), `pizzaDrawing` (`./pizza`), `doughDrawing` (`./dough`, Task 13).
  - `metaFor`, `frameOf`, `drawingsMeta` (Task 3); `toSvg`, `n`, `Drawing`, `Stroke`, `Glow`, `Layer`, `LAYER_ORDER` (Task 2).
  - `scripts/e2e/lib.mjs` (Task 5); the `data-pending` and `data-drawn` attributes (Task 6); `npm run check` (Task 22).
  - The e2e scripts in task order: `shell` (5), `draw` (6, dev), `lift` (14, dev), `life` (15, dev), `arrival` (16), `home` (17), `spaces` (18), `transitions` (19), `product` (20), `pages` (21), `detail` (22).
- Produces:
  - `lib/draw/illustration.ts`: `interface IllustrationFrame { id: string; title: string; x: number; y: number; width: number; height: number }` and `parseIllustration(svg: string, frame: IllustrationFrame): Drawing`. It throws on a viewBox that is not the drawing's crop, a `transform` attribute, nested groups inside a layer group, rounded rect corners, or no strokes.
  - `drawings/illustrated.ts`: `ILLUSTRATED: Record<string, Drawing>`, generated by `npm run illustrations`, which also runs before `dev` and `build`.
  - `drawings/index.ts`: `pickDrawing(id: string, illustrated: Record<string, Drawing>, modules: Record<string, () => Drawing>): Drawing`. `drawingFor(id)` keeps its signature and now returns the illustration when one exists.
  - `npx tsx scripts/export-drawing.ts <id>` writes `review/<id>-start.svg`.
  - `node scripts/e2e/all.mjs` runs all 11 scripts in order, each against the right server, and stops at the first failure. It starts `next start -p 3022` and `next dev --turbopack -p 3021` if they are not running and stops what it started.
  - `node scripts/e2e/axe.mjs` covers 9 routes × 2 widths × 2 hours and exits 1 on any violation.
  - `node scripts/lighthouse-all.mjs [base]` exits 1 on a score under 95 or an LCP over 2.5 s.
  - `node scripts/budget.mjs` exits 1 when a route's first-load JS exceeds 180 KB gzipped or a drawing exceeds 40 KB gzipped.
  - `node scripts/e2e/shots.mjs` writes `shots/<name>-<390|1440>-<day|night>-fold.png` and `shots/<name>-<390|1440>-<day|night>.png` (full page).

- [ ] **Step 1: Write the failing test `tests/illustration.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { DRAWINGS, drawingFor, pickDrawing } from "@/drawings";
import { ILLUSTRATED } from "@/drawings/illustrated";
import { parseIllustration } from "@/lib/draw/illustration";
import { frameOf, metaFor } from "@/lib/drawings";

const frame = { id: "mark", title: "The Barnyard Co. mark", x: 0, y: 0, width: 320, height: 320 };
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320">
  <circle class="glow" cx="108" cy="108" r="60"/>
  <g fill="none" stroke="#1F1C1A">
  <g class="layer-structure"><path d="M 55 265 L 55 160 A 105 105 0 0 1 265 160 L 265 265 Z"/><line x1="160" y1="55" x2="160" y2="265"/></g>
  <g class="layer-detail"><rect x="84" y="71" width="48" height="89"/><circle id="mark-sun" cx="108" cy="108" r="20"/></g>
  <g class="layer-life"><polyline points="190,158 186,140 194,122"/></g>
  </g>
</svg>`;

describe("illustrator SVGs", () => {
  it("reads strokes by layer class, converts shapes to paths, and keeps ids and glows", () => {
    const d = parseIllustration(SVG, frame);
    expect(d.strokes.map((s) => s.layer)).toEqual(["structure", "structure", "detail", "detail", "life"]);
    expect(d.strokes[0].d).toBe("M 55 265 L 55 160 A 105 105 0 0 1 265 160 L 265 265 Z");
    expect(d.strokes[1].d).toBe("M160 55L160 265");
    expect(d.strokes[2].d).toBe("M84 71L132 71L132 160L84 160Z");
    expect(d.strokes[3]).toMatchObject({ id: "mark-sun" });
    expect(d.strokes[3].d.startsWith("M128 108A20 20 0 1 1 88 108")).toBe(true);
    expect(d.strokes[4].d).toBe("M190 158L186 140L194 122");
    expect(d.glows).toEqual([{ x: 108, y: 108, r: 60 }]);
    expect([d.id, d.x, d.y, d.width, d.height]).toEqual(["mark", 0, 0, 320, 320]);
  });

  it("refuses a viewBox that is not the drawing's crop", () => {
    expect(() => parseIllustration(SVG.replace('viewBox="0 0 320 320"', 'viewBox="0 0 640 640"'), frame)).toThrow(/viewBox/);
  });

  it("refuses transforms and nested groups inside a layer", () => {
    expect(() => parseIllustration(SVG.replace("<line ", '<line transform="translate(2 0)" '), frame)).toThrow(/transform/);
    const nested = SVG.replace('<g class="layer-life">', '<g class="layer-life"><g>').replace('122"/></g>', '122"/></g></g>');
    expect(() => parseIllustration(nested, frame)).toThrow(/nested/);
  });

  it("prefers an illustration over the code module", () => {
    const fromSvg = parseIllustration(SVG, frame);
    expect(pickDrawing("mark", { mark: fromSvg }, DRAWINGS)).toBe(fromSvg);
    expect(pickDrawing("mark", {}, DRAWINGS).strokes).toEqual(DRAWINGS.mark().strokes);
    expect(() => pickDrawing("no-such-drawing", {}, DRAWINGS)).toThrow(/no-such-drawing/);
  });

  it("routes drawingFor through the generated illustrations", () => {
    for (const id of Object.keys(ILLUSTRATED)) {
      expect(drawingFor(id)).toBe(ILLUSTRATED[id]);
      const f = frameOf(id);
      expect([ILLUSTRATED[id].x, ILLUSTRATED[id].y, ILLUSTRATED[id].width, ILLUSTRATED[id].height]).toEqual([f.x, f.y, f.width, f.height]);
      expect(ILLUSTRATED[id].strokes.length).toBeLessThanOrEqual(metaFor(id).strokeBudget);
    }
    for (const id of Object.keys(DRAWINGS).filter((k) => !ILLUSTRATED[k])) expect(drawingFor(id).id).toBe(id);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- illustration`
Expected: FAIL with `Failed to resolve import "@/drawings/illustrated"`.

- [ ] **Step 3: Implement the SVG preference**

`lib/draw/illustration.ts`:

```ts
import { n } from "./primitives";
import { LAYER_ORDER, type Drawing, type Glow, type Layer, type Stroke } from "./types";

export interface IllustrationFrame { id: string; title: string; x: number; y: number; width: number; height: number }

const SHAPES = "path|line|polyline|polygon|rect|circle|ellipse";

function attr(tag: string, name: string): string | undefined {
  return new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
}

function num(tag: string, name: string, file: string, fallback?: number): number {
  const raw = attr(tag, name);
  if (raw === undefined && fallback !== undefined) return fallback;
  const v = Number(raw);
  if (raw === undefined || !Number.isFinite(v)) throw new Error(`${file}: ${name} is missing or not a number in ${tag}`);
  return v;
}

function points(tag: string, file: string): [number, number][] {
  const values = (attr(tag, "points") ?? "").trim().split(/[\s,]+/).filter(Boolean).map(Number);
  if (values.length < 4 || values.length % 2 !== 0 || values.some((v) => !Number.isFinite(v))) throw new Error(`${file}: bad points in ${tag}`);
  return Array.from({ length: values.length / 2 }, (_, i) => [values[i * 2], values[i * 2 + 1]]);
}

const ring = (cx: number, cy: number, rx: number, ry: number) =>
  `M${n(cx + rx)} ${n(cy)}A${n(rx)} ${n(ry)} 0 1 1 ${n(cx - rx)} ${n(cy)}A${n(rx)} ${n(ry)} 0 1 1 ${n(cx + rx)} ${n(cy)}`;

function toPath(tag: string, shape: string, file: string): string {
  switch (shape) {
    case "path": {
      const d = attr(tag, "d")?.trim();
      if (!d) throw new Error(`${file}: empty path in ${tag}`);
      return d;
    }
    case "line":
      return `M${n(num(tag, "x1", file))} ${n(num(tag, "y1", file))}L${n(num(tag, "x2", file))} ${n(num(tag, "y2", file))}`;
    case "polyline":
    case "polygon":
      return `M${points(tag, file).map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}${shape === "polygon" ? "Z" : ""}`;
    case "rect": {
      if (attr(tag, "rx") || attr(tag, "ry")) throw new Error(`${file}: rounded rect corners are not in the line's grammar; draw the corners as arcs`);
      const x = num(tag, "x", file, 0), y = num(tag, "y", file, 0), w = num(tag, "width", file), h = num(tag, "height", file);
      return `M${n(x)} ${n(y)}L${n(x + w)} ${n(y)}L${n(x + w)} ${n(y + h)}L${n(x)} ${n(y + h)}Z`;
    }
    case "circle": {
      const r = num(tag, "r", file);
      return ring(num(tag, "cx", file, 0), num(tag, "cy", file, 0), r, r);
    }
    default:
      return ring(num(tag, "cx", file, 0), num(tag, "cy", file, 0), num(tag, "rx", file), num(tag, "ry", file));
  }
}

/**
 * An illustrator's drawing (spec section 3.5) as a Drawing: strokes come from shapes inside
 * <g class="layer-structure|layer-detail|layer-life|layer-lamp">, in document order; ids are kept so life
 * can find steam, leaves, bulbs and the cue ball; <circle class="glow"> anywhere becomes a glow.
 * Fill and stroke attributes are ignored: the site draws every stroke in its one weight.
 */
export function parseIllustration(svg: string, frame: IllustrationFrame): Drawing {
  const file = `drawings/${frame.id}.svg`;
  if (/\stransform="/.test(svg)) throw new Error(`${file}: flatten transforms before exporting (found a transform attribute)`);
  const root = /<svg\b[^>]*>/.exec(svg)?.[0];
  if (!root) throw new Error(`${file}: no <svg> element`);
  const expected = [frame.x, frame.y, frame.width, frame.height];
  const box = (attr(root, "viewBox") ?? "").trim().split(/[\s,]+/).map(Number);
  if (box.length !== 4 || box.some((v, i) => !(Math.abs(v - expected[i]) <= 0.5))) {
    throw new Error(`${file}: viewBox must be "${expected.join(" ")}" (the crop in content/drawings.json), found "${attr(root, "viewBox") ?? ""}"`);
  }

  const isGlow = (tag: string) => (attr(tag, "class") ?? "").split(/\s+/).includes("glow");
  const glows: Glow[] = [...svg.matchAll(/<circle\b[^>]*>/g)]
    .map((m) => m[0])
    .filter(isGlow)
    .map((tag) => ({ x: num(tag, "cx", file), y: num(tag, "cy", file), r: num(tag, "r", file) }));

  const strokes: Stroke[] = [];
  const groups = new RegExp(`<g\\b[^>]*\\sclass="[^"]*\\blayer-(${LAYER_ORDER.join("|")})\\b[^"]*"[^>]*>([\\s\\S]*?)</g>`, "g");
  for (const g of svg.matchAll(groups)) {
    const layer = g[1] as Layer;
    if (/<g\b/.test(g[2])) throw new Error(`${file}: nested groups inside layer-${layer}; ungroup before exporting`);
    for (const s of g[2].matchAll(new RegExp(`<(${SHAPES})\\b[^>]*>`, "g"))) {
      if (isGlow(s[0])) continue;
      const id = attr(s[0], "id");
      strokes.push({ d: toPath(s[0], s[1], file), layer, ...(id ? { id } : {}) });
    }
  }
  if (!strokes.length) throw new Error(`${file}: no strokes inside <g class="layer-structure|layer-detail|layer-life|layer-lamp">`);
  return { id: frame.id, title: frame.title, x: frame.x, y: frame.y, width: frame.width, height: frame.height, strokes, ...(glows.length ? { glows } : {}) };
}
```

The nested-group case in the test: the `layer-life` group's first `</g>` ends the match early, so its captured content starts with `<g>` and the parser throws.

`scripts/illustrations.ts`:

```ts
// Turns illustrator drawings (drawings/<id>.svg) into drawings/illustrated.ts, which drawingFor prefers over the code module.
// Run: npm run illustrations   (it also runs before npm run dev and npm run build)
import fs from "node:fs";
import path from "node:path";
import { parseIllustration } from "../lib/draw/illustration";
import { frameOf, metaFor } from "../lib/drawings";
import type { Drawing } from "../lib/draw/types";

const dir = "drawings";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".svg")).sort();
const out: Record<string, Drawing> = {};
for (const f of files) {
  const id = f.slice(0, -4);
  const meta = metaFor(id); // throws for an id that is not in content/drawings.json
  const drawing = parseIllustration(fs.readFileSync(path.join(dir, f), "utf8"), { id, title: meta.title, ...frameOf(id) });
  if (drawing.strokes.length > meta.strokeBudget) throw new Error(`${f}: ${drawing.strokes.length} strokes, over the budget of ${meta.strokeBudget}`);
  out[id] = drawing;
  console.log(`${f}: ${drawing.strokes.length} strokes`);
}
const body = `// Generated by scripts/illustrations.ts from drawings/*.svg. Do not edit: run npm run illustrations.
import type { Drawing } from "@/lib/draw/types";

export const ILLUSTRATED: Record<string, Drawing> = ${JSON.stringify(out, null, 2)};
`;
fs.writeFileSync(path.join(dir, "illustrated.ts"), body);
console.log(`drawings/illustrated.ts: ${files.length} illustration(s)`);
```

`scripts/export-drawing.ts`:

```ts
// Writes a drawing as an editable SVG an illustrator can start from, already in layer groups at the right viewBox.
// Run: npx tsx scripts/export-drawing.ts <id>   ->  review/<id>-start.svg
import fs from "node:fs";
import { drawingFor } from "../drawings";
import { toSvg } from "../lib/draw/render";

const id = process.argv[2];
if (!id) {
  console.error("usage: npx tsx scripts/export-drawing.ts <id>");
  process.exit(2);
}
const d = drawingFor(id);
const glows = (d.glows ?? []).map((g) => `<circle class="glow" cx="${g.x}" cy="${g.y}" r="${g.r}" fill="none" stroke="#E7A64F" stroke-dasharray="6 6"/>`).join("");
fs.mkdirSync("review", { recursive: true });
fs.writeFileSync(`review/${id}-start.svg`, toSvg(d, { stroke: 3 }).replace("</svg>", `${glows}</svg>`));
console.log(`review/${id}-start.svg (${d.strokes.length} strokes)`);
```

`drawings/index.ts` (the whole file; the registrations are those added by Tasks 3 and 7 to 13):

```ts
import type { Drawing } from "@/lib/draw/types";
import { alleySignDrawing } from "./alley-sign";
import { courtyardDrawing } from "./courtyard";
import { doughDrawing } from "./dough";
import { entryDrawing } from "./entry";
import { facadeDrawing } from "./facade";
import { gamesDrawing } from "./games";
import { hoodieDrawing } from "./hoodie";
import { ILLUSTRATED } from "./illustrated";
import { mainFloorDrawing } from "./main-floor";
import { markDrawing } from "./mark";
import { mezzanineNightDrawing } from "./mezzanine-night";
import { mezzanineStairDrawing } from "./mezzanine-stair";
import { nocatchDrawing } from "./nocatch";
import { pizzaDrawing } from "./pizza";
import { wallLampDrawing } from "./wall-lamp";

export const DRAWINGS: Record<string, () => Drawing> = {
  mark: markDrawing,
  facade: facadeDrawing,
  entry: entryDrawing,
  "main-floor": mainFloorDrawing,
  "wall-lamp": wallLampDrawing,
  "mezzanine-stair": mezzanineStairDrawing,
  "mezzanine-night": mezzanineNightDrawing,
  courtyard: courtyardDrawing,
  games: gamesDrawing,
  "alley-sign": alleySignDrawing,
  hoodie: hoodieDrawing,
  nocatch: nocatchDrawing,
  pizza: pizzaDrawing,
  dough: doughDrawing,
};

/** An illustrator's SVG (drawings/<id>.svg, compiled into ILLUSTRATED) wins over the code module (spec section 3.5). */
export function pickDrawing(id: string, illustrated: Record<string, Drawing>, modules: Record<string, () => Drawing>): Drawing {
  const svg = illustrated[id];
  if (svg) return svg;
  const make = modules[id];
  if (!make) throw new Error(`No drawing module for "${id}"`);
  return make();
}

export function drawingFor(id: string): Drawing {
  return pickDrawing(id, ILLUSTRATED, DRAWINGS);
}
```

The SVG is compiled into a module, never read at runtime: `drawingFor` also runs in client components (the house), where `fs` does not exist.

```bash
npm pkg set scripts.illustrations="tsx scripts/illustrations.ts" scripts.predev="npm run illustrations" scripts.prebuild="npm run illustrations"
npm run illustrations
```

Expected: `drawings/illustrated.ts: 0 illustration(s)`. The generated file reads:

```ts
// Generated by scripts/illustrations.ts from drawings/*.svg. Do not edit: run npm run illustrations.
import type { Drawing } from "@/lib/draw/types";

export const ILLUSTRATED: Record<string, Drawing> = {};
```

- [ ] **Step 4: Run to verify it passes, then prove the preference end to end**

Run: `npm test -- illustration drawings`
Expected: PASS (`tests/illustration.test.ts` 5 tests; `tests/drawings.test.ts` unchanged).

Round trip with a real drawing:

```bash
npx tsx scripts/export-drawing.ts pizza
cp review/pizza-start.svg drawings/pizza.svg
npm run illustrations
npm test -- illustration drawings
```

Expected:
- `review/pizza-start.svg (N strokes)`, then `pizza.svg: N strokes` and `drawings/illustrated.ts: 1 illustration(s)`, with the same N.
- The tests PASS: the "routes drawingFor through the generated illustrations" test now covers `pizza`.

With `npm run dev` running, open `http://localhost:3021/lab/pizza` in Playwright MCP at 390x844 and screenshot. It must match the code drawing exactly, because the SVG was exported from it.

Then restore:

```bash
rm drawings/pizza.svg
npm run illustrations
```

Expected: `drawings/illustrated.ts: 0 illustration(s)`.

- [ ] **Step 5: Let the dev server and the production server run side by side**

`next.config.ts` (the whole file; if an earlier task added options, keep them inside the returned object):

```ts
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * The dev server builds into .next-dev so it can run beside `next start` serving the production build in .next.
 * Next 15.5 otherwise shares one distDir, and a dev compile overwrites the production manifests.
 */
export default function config(phase: string): NextConfig {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  };
}
```

In `tsconfig.json`, change the `include` array to:

```json
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next-dev/types/**/*.ts"
  ],
```

In `eslint.config.mjs`, change the `ignores` array to:

```js
    ignores: [
      "node_modules/**",
      "docs/**",
      ".next/**",
      ".next-dev/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
```

```bash
printf '\n# the dev server build (next.config.ts)\n/.next-dev/\n' >> .gitignore
```

Check it:

```bash
npm run build
(npx next start -p 3022 > /dev/null 2>&1 &)
cat .next/BUILD_ID
(npm run dev > /dev/null 2>&1 &)
sleep 20
curl -s -o /dev/null -w "dev %{http_code}\n" http://localhost:3021/
curl -s -o /dev/null -w "prod %{http_code}\n" http://localhost:3022/host
cat .next/BUILD_ID
ls -d .next-dev
```

Expected:
- `dev 200` and `prod 200`.
- `BUILD_ID` prints the same value before and after the dev server started.
- `.next-dev` exists.

Stop the dev server afterwards (`npx kill-port 3021`, or close its terminal).

- [ ] **Step 6: One command for every browser check**

`scripts/e2e/all.mjs`:

```js
// Every browser check in task order, each against the server it needs, stopping at the first failure.
// Production checks use http://localhost:3022 (next start on the build in .next); the /lab checks need the dev
// server on http://localhost:3021 (next dev builds into .next-dev, so both run at once: see next.config.ts).
// A server that is not already running is started here and stopped at the end.
// Run after `npm run build`: node scripts/e2e/all.mjs
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const NEXT = require.resolve("next/dist/bin/next");
const PROD = "http://localhost:3022";
const DEV = "http://localhost:3021";

/** [script, server, task that wrote it] */
const SCRIPTS = [
  ["shell", PROD, 5],
  ["draw", DEV, 6],
  ["lift", DEV, 14],
  ["life", DEV, 15],
  ["arrival", PROD, 16],
  ["home", PROD, 17],
  ["spaces", PROD, 18],
  ["transitions", PROD, 19],
  ["product", PROD, 20],
  ["pages", PROD, 21],
  ["detail", PROD, 22],
];

const started = [];

async function up(base) {
  try {
    const res = await fetch(base, { redirect: "manual" });
    return res.status < 500;
  } catch {
    return false;
  }
}

async function ensure(base, args) {
  if (await up(base)) return;
  console.log(`starting next ${args.join(" ")}`);
  const child = spawn(process.execPath, [NEXT, ...args], { stdio: ["ignore", "ignore", "inherit"], env: process.env });
  started.push(child);
  const until = Date.now() + 120_000;
  while (Date.now() < until) {
    if (await up(base)) return;
    if (child.exitCode !== null) break;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`${base} did not come up (next ${args.join(" ")})`);
}

function stopStarted() {
  for (const child of started) {
    if (child.exitCode !== null) continue;
    // next dev forks a worker; on Windows only a tree kill stops both.
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    else child.kill("SIGTERM");
  }
}

let code = 0;
try {
  if (!fs.existsSync(".next/BUILD_ID")) throw new Error("no production build in .next: run npm run build first");
  for (const [name, , task] of SCRIPTS) {
    if (!fs.existsSync(`scripts/e2e/${name}.mjs`)) throw new Error(`scripts/e2e/${name}.mjs is missing (Task ${task})`);
  }
  await ensure(PROD, ["start", "-p", "3022"]);
  await ensure(DEV, ["dev", "--turbopack", "-p", "3021"]);
  for (const [i, [name, base]] of SCRIPTS.entries()) {
    console.log(`\n== ${i + 1}/${SCRIPTS.length} ${name} (${base})`);
    const run = spawnSync(process.execPath, [`scripts/e2e/${name}.mjs`], { stdio: "inherit", env: { ...process.env, BASE: base } });
    if (run.status !== 0) {
      console.error(`\nFAILED at ${name}; the remaining ${SCRIPTS.length - i - 1} script(s) did not run`);
      code = 1;
      break;
    }
  }
  if (code === 0) console.log(`\nall ${SCRIPTS.length} e2e scripts passed`);
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  code = 1;
} finally {
  stopStarted();
}
process.exit(code);
```

- [ ] **Step 7: Accessibility, Lighthouse, budgets and screenshots**

```bash
npm install -D -E axe-core@4.13.0 lighthouse@13.4.1
```

`scripts/e2e/axe.mjs` (ported from option one):

```js
// Accessibility: axe-core on every route and the 404, at 390 and 1440, by day (13:00) and after dark (01:00).
// Each page waits for its drawings to settle (data-drawn, or 3 s after navigation) so contrast is judged at rest.
// Any violation fails. Run against the production server: node scripts/e2e/axe.mjs
import { createRequire } from "node:module";
import { launch, open } from "./lib.mjs";

const require = createRequire(import.meta.url);
const AXE = require.resolve("axe-core/axe.min.js");
const ROUTES = ["/", "/spaces", "/host", "/shoot", "/bowl", "/press", "/menu", "/visit", "/no-such-room"];
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

const browser = await launch();
let failed = 0;
let checked = 0;

for (const [width, height] of [[390, 844], [1440, 900]]) {
  for (const at of ["13:00", "01:00"]) {
    for (const route of ROUTES) {
      const { page, ctx } = await open(browser, route, { width, height, at });
      await page
        .waitForFunction(() => !document.querySelector("svg.drawing[data-pending]") && (!!document.querySelector("svg.drawing[data-drawn]") || performance.now() > 3000), null, { timeout: 10_000 })
        .catch(() => {});
      await page.addScriptTag({ path: AXE });
      const violations = await page.evaluate(async (tags) => {
        const res = await window.axe.run(document, { runOnly: { type: "tag", values: tags } });
        return res.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((x) => x.target.join(" ")) }));
      }, TAGS);
      checked++;
      const label = `${route} ${width} ${at}`;
      if (violations.length) {
        failed++;
        console.error(`FAIL ${label}`);
        for (const v of violations) console.error(`  ${v.impact} ${v.id}: ${v.help} -> ${v.nodes.join(" | ")}`);
      } else {
        console.log(`ok   ${label}`);
      }
      await ctx.close();
    }
  }
}
await browser.close();
console.log(failed ? `\n${failed} of ${checked} pages have violations` : `\nno violations on ${checked} pages`);
process.exit(failed ? 1 : 0);
```

`scripts/lighthouse-all.mjs` (ported; runs the pinned Lighthouse CLI with Node directly, no shell, so the Chrome flags stay one argument; Chrome is Playwright's Chromium unless `CHROME_PATH` is set):

```js
// Lighthouse (mobile preset, simulated throttling) on every route. Prints a table; exits 1 when any score is
// under 95 or LCP is over 2.5 s (spec section 9).
// Run against the production server: node scripts/lighthouse-all.mjs [base=http://localhost:3022]   (LH_DESKTOP=1 for desktop)
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3022";
const desktop = !!process.env.LH_DESKTOP;
const routes = ["/", "/spaces", "/host", "/shoot", "/bowl", "/press", "/menu", "/visit"];
const cli = path.join("node_modules", "lighthouse", "cli", "index.js");
const chrome = process.env.CHROME_PATH || chromium.executablePath();
fs.mkdirSync("lh", { recursive: true });

const rows = [];
let failed = 0;
for (const r of routes) {
  const out = path.join("lh", `${desktop ? "d-" : ""}${r === "/" ? "home" : r.slice(1)}.json`);
  fs.rmSync(out, { force: true });
  const run = spawnSync(
    process.execPath,
    [cli, `${base}${r}`, "--output=json", `--output-path=${out}`, "--chrome-flags=--headless=new --no-sandbox", "--only-categories=performance,accessibility,best-practices,seo", "--quiet", ...(desktop ? ["--preset=desktop"] : [])],
    { stdio: ["ignore", "ignore", "inherit"], env: { ...process.env, CHROME_PATH: chrome } },
  );
  try {
    const j = JSON.parse(fs.readFileSync(out, "utf8"));
    const c = j.categories;
    const a = j.audits;
    const score = (k) => Math.round(c[k].score * 100);
    const row = {
      route: r,
      perf: score("performance"),
      a11y: score("accessibility"),
      bp: score("best-practices"),
      seo: score("seo"),
      lcp: a["largest-contentful-paint"].displayValue,
      tbt: a["total-blocking-time"].displayValue,
      cls: a["cumulative-layout-shift"].displayValue,
      below90: Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && !["informative", "notApplicable", "manual"].includes(x.scoreDisplayMode)).map((x) => x.id).join(","),
    };
    if ([row.perf, row.a11y, row.bp, row.seo].some((s) => s < 95) || a["largest-contentful-paint"].numericValue > 2500) failed++;
    rows.push(row);
  } catch (e) {
    failed++;
    rows.push({ route: r, error: `lighthouse exit ${run.status}: ${String(e).slice(0, 80)}` });
  }
}
console.table(rows);
process.exit(failed ? 1 : 0);
```

`scripts/budget.mjs`:

```js
// Budgets from docs/spec.md section 9, measured on the production build:
//   first-load JS per route under 180 KB gzipped: every <script src> the prerendered page loads (noModule polyfills excluded);
//   every drawing under 40 KB gzipped: its SVG as toSvg(drawingFor(id)) renders it.
// Run after `npm run build`: node scripts/budget.mjs
import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { tsImport } from "tsx/esm/api";

const JS_BUDGET = 180 * 1024;
const DRAWING_BUDGET = 40 * 1024;
const APP = path.join(".next", "server", "app");
const PAGES = {
  "/": "index.html",
  "/spaces": "spaces.html",
  "/host": "host.html",
  "/shoot": "shoot.html",
  "/bowl": "bowl.html",
  "/menu": "menu.html",
  "/press": "press.html",
  "/visit": "visit.html",
  "404": "_not-found.html",
};
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const gz = (buf) => gzipSync(buf, { level: 9 }).length;
let failed = 0;

if (!fs.existsSync(path.join(".next", "BUILD_ID"))) {
  console.error("no production build in .next: run npm run build first");
  process.exit(1);
}

console.log("First-load JS per route (gzip, budget 180 KB)");
const sizes = new Map();
for (const [route, file] of Object.entries(PAGES)) {
  const htmlPath = path.join(APP, file);
  if (!fs.existsSync(htmlPath)) {
    console.log(`  FAIL ${route.padEnd(8)} ${htmlPath} is missing (the route must prerender)`);
    failed++;
    continue;
  }
  const html = fs.readFileSync(htmlPath, "utf8");
  const srcs = [
    ...new Set(
      [...html.matchAll(/<script\b([^>]*)>/g)]
        .map((m) => m[1])
        .filter((attrs) => !/\bnomodule\b/i.test(attrs))
        .map((attrs) => /\bsrc="([^"]+)"/.exec(attrs)?.[1])
        .filter((src) => src?.startsWith("/_next/static/")),
    ),
  ];
  let total = 0;
  for (const src of srcs) {
    const chunk = path.join(".next", src.slice("/_next/".length).split("?")[0]);
    if (!sizes.has(chunk)) sizes.set(chunk, gz(fs.readFileSync(chunk)));
    total += sizes.get(chunk);
  }
  const ok = total <= JS_BUDGET;
  if (!ok) failed++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${route.padEnd(8)} ${kb(total).padStart(9)}  (${srcs.length} scripts)`);
}

const { drawingFor } = await tsImport("../drawings/index.ts", import.meta.url);
const { drawingsMeta } = await tsImport("../lib/drawings.ts", import.meta.url);
const { toSvg } = await tsImport("../lib/draw/render.ts", import.meta.url);

console.log("\nDrawings (gzip of the rendered SVG, budget 40 KB each)");
const perRoute = {};
for (const meta of drawingsMeta) {
  const drawing = drawingFor(meta.id);
  const size = gz(Buffer.from(toSvg(drawing)));
  const ok = size <= DRAWING_BUDGET;
  if (!ok) failed++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${meta.id.padEnd(16)} ${kb(size).padStart(8)}  ${drawing.strokes.length} strokes`);
  for (const r of meta.routes) perRoute[r] = (perRoute[r] ?? 0) + size;
}
console.log("\nDrawing markup per route (gzip, for information)");
for (const [r, size] of Object.entries(perRoute)) console.log(`       ${r.padEnd(8)} ${kb(size).padStart(8)}`);

console.log(failed ? `\n${failed} budget(s) exceeded` : "\nbudgets ok");
process.exit(failed ? 1 : 0);
```

`tsImport` (tsx 4.23, `tsx/esm/api`) loads the TypeScript modules with the project's tsconfig paths, the same way `npx tsx scripts/review.ts` does.

`scripts/e2e/shots.mjs`:

```js
// Screenshots of every route for the critique: 390x844 and 1440x900, day (14:00) and night (01:00).
// For each: the fold after the arrival settles, then the full page after scrolling through so scroll-drawn lines have drawn.
// Output: shots/<name>-<width>-<day|night>-fold.png and shots/<name>-<width>-<day|night>.png
// Run against the production server: node scripts/e2e/shots.mjs
import { launch, open, shot } from "./lib.mjs";

const ROUTES = [["/", "home"], ["/spaces", "spaces"], ["/host", "host"], ["/shoot", "shoot"], ["/bowl", "bowl"], ["/menu", "menu"], ["/press", "press"], ["/visit", "visit"], ["/no-such-room", "404"]];
const browser = await launch();

for (const [width, height] of [[390, 844], [1440, 900]]) {
  for (const [at, regime] of [["14:00", "day"], ["01:00", "night"]]) {
    for (const [route, name] of ROUTES) {
      const { page, ctx, errors } = await open(browser, route, { width, height, at });
      await page.waitForTimeout(2600); // the arrival finishes within 2.4 s
      await shot(page, `${name}-${width}-${regime}-fold`);
      for (let i = 0; i < 300; i++) {
        const end = await page.evaluate(() => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2);
        if (end) break;
        await page.mouse.wheel(0, Math.round(height * 0.6));
        await page.waitForTimeout(90);
      }
      await page.waitForTimeout(1200);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      await shot(page, `${name}-${width}-${regime}`, true);
      console.log(`shots/${name}-${width}-${regime}.png${errors.length ? `  (console errors: ${errors.join(" | ")})` : ""}`);
      await ctx.close();
    }
  }
}
await browser.close();
```

- [ ] **Step 8: Run the checks and fix what fails**

With `npm run build` done and `(npx next start -p 3022 > /dev/null 2>&1 &)` running:

Run: `node scripts/budget.mjs`
Expected: nine `ok` route lines, each at most 180 KB (the empty scaffold measured 113.7 KB, so a route well above about 160 KB deserves a look even when it passes), fourteen `ok` drawing lines each under 40 KB, then `budgets ok`.
- If a route fails, find the static import of GSAP, Lenis or a drawing module in a component that renders above the fold (`grep -rn "from \"gsap" components app`). Move it behind `loadGsap()` or a dynamic import.
- If a drawing fails, delete detail-layer strokes (never structure) and rerun `npx tsx scripts/review.ts <id>`.

Run: `node scripts/e2e/all.mjs`
Expected: `== 1/11 shell` through `== 11/11 detail`, each ending `all checks passed`, then `all 11 e2e scripts passed`.

Run: `node scripts/e2e/axe.mjs`
Expected: 36 `ok` lines, then `no violations on 36 pages`. Fix each violation in the component axe names, then rerun:
- `color-contrast`: a token misused, for example `--hair` on text or `--lamp` on paper.
- `target-size`: a link or button under 24 px.
- `svg-img-alt`: a drawing without a title.

Run: `node scripts/lighthouse-all.mjs`
Expected: a table with perf, a11y, bp and seo at 95 or above for all eight routes and LCP under 2.5 s, exit 0. The `below90` column lists the audits to fix first.

Run: `node scripts/e2e/shots.mjs`
Expected: 72 lines (`shots/home-390-day.png` ... `shots/404-1440-night.png`) with no console errors reported.

- [ ] **Step 9: Critique: read every screenshot, then check the motion live**

Read all 72 PNGs in `shots/` with the Read tool, phone shots first, and judge each drawing at 100% on the phone shot. Then run the motion checks with Playwright MCP against `http://localhost:3022`. Record every finding in `docs/critique.md` as a row. For each row:
1. Fix the named file.
2. Rerun the check the row names.
3. Re-shoot that route with `node scripts/e2e/shots.mjs`, or with MCP at the same size and hour.
4. Close the row.

The step is done when no row is open and each page has had one thing removed (BRIEF section 10.6), each removal recorded as its own row.

`docs/critique.md` starts as:

```markdown
# Critique, Task 23

Screenshots come from `node scripts/e2e/shots.mjs` on the production build (`shots/<route>-<390|1440>-<day|night>[-fold].png`). Motion checks were run live with Playwright MCP. Check ids refer to the list in `docs/plan.md`, Task 23, Step 9. A row is closed only when its check passes again after the fix.

| # | Shot or URL | Check | Finding | Fix (file) | Verified by | State |
|---|---|---|---|---|---|---|
```

Checks. Each is pass or fail; a fail becomes a row.

**A. Spec section 2 (every full-page shot)**
- A1: No text reads UNKNOWN or CONFIRM. There is no capacity, lane count, testimonial or floor plan anywhere. The only prices are ₹545, ₹335 and ₹310, all on the menu shots. The eye also catches phrasing the scripts cannot, such as "seats", "lanes" or "guests".
- A2: No person or face is drawn. The only body parts are the dough hands: at most eight smooth contours, with no knuckles. The hoodie drawing has no glove and the NoCatch drawing has no figures.
- A3: On every phone shot at 100%, the line has one weight across all drawings. There are no fragments shorter than about 4 px, no scribble in foliage or brick, and closed shapes are closed.
- A4: Cover a room's heading on its phone shot and name the room from the drawing alone. If you cannot, delete detail-layer strokes in `drawings/<id>.ts` and rerun `npx tsx scripts/review.ts <id>`.
- A5: No copy places one room relative to another. Run `grep -rniE "next to|beyond|upstairs|downstairs|adjacent|opens onto" app components lib`; every hit must be about something other than room positions.
- A6: With MCP, at 390x844 and 1440x900, open `/spaces#entry` and press "Show the photograph". Screenshot and check:
  - the credit is visible;
  - the photograph is sharp (honest size, never upscaled);
  - the drawing stays as a faint 12% ghost over it;
  - "Show the drawing" returns it.

**B. Spec section 4, the house (`home-*` shots)**
- B1: `home-390-day-fold` shows the finished house: six panes, each with a recognisable vignette, and the sun on the arch left of the crown (2 PM). `home-390-night-fold` shows the sun as a lamp glyph with a glow.
- B2: Under the arch sit the café name as the h1, one line in the café's register, the open-now text, the hours, and exactly one primary WhatsApp button.
- B3: "Written about" has two quotes:
  - the Architectural Digest India quote, attributed to Rohan Bhargade, Mudra Design Studio, dated 22 Nov 2024 and linked, beside the mezzanine stair drawing;
  - the ELLE Decor India quote, dated 10 Jun 2025 and linked, beside the entry strips drawing.
  Both drawings are complete in the full-page shot.
- B4: Four doors, each a link with one proof line:
  - host: Coffee Garba, 6 Sep 2025, and the hoodie painting workshop, 18 Dec 2025;
  - shoot: the NoCatch film;
  - bowl: "Recently opened.";
  - work late: "Open until 3 AM."
- B5: The after-dark section is in the night palette in the day shots too.
- B6: The visit block has the facade drawing, address, hours, call, WhatsApp and directions.

**C. Spec section 7, motion (Playwright MCP, live)**
- C1: At 390x844, load `/?at=14:00` and screenshot at about 0.3 s, 1.2 s and 2.4 s.
  - The arch draws first, then the dividers, sun, steam, plant and house.
  - The arch widens into six panes.
  - Everything is finished by 2.4 s.
  - Reload and scroll within 0.5 s: the finished house appears at once.
- C2: With `prefers-reduced-motion: reduce` emulated, the first screenshot of `/` already shows the finished house. On `/spaces#courtyard`, two screenshots 3 s apart are identical: no steam, no leaves, no bulbs moving.
- C3: On `/host` at 1440x900, click "Visit" in the header and screenshot at about 0.25 s: a single pen line crosses the screen. The visit page's first drawing then draws on.
- C4: Scroll `/host` and `/press` slowly with four screenshots each: nothing fades or slides up merely because it entered the viewport.
- C5: At `?at=01:00` on `/spaces#bowling`, two screenshots 160 ms apart show different lit bulbs. At `?at=14:00` the bulbs do not chase.

**D. Spec section 8, palette and type**
- D1: Run the ground sampler below. Day rows read about `233 232 228` and night rows about `23 25 28`. A different row is acceptable only where a full-bleed night section or a drawing reaches the bottom-left corner; confirm that by eye.

```bash
node --input-type=module -e '
import fs from "node:fs";
import sharp from "sharp";
for (const f of fs.readdirSync("shots").filter((n) => /-(day|night)-fold\.png$/.test(n)).sort()) {
  const { data, info } = await sharp(`shots/${f}`).raw().toBuffer({ resolveWithObject: true });
  const x = 2, y = Math.floor(info.height * 0.98), i = (y * info.width + x) * info.channels;
  console.log(f.padEnd(30), data[i], data[i + 1], data[i + 2]);
}'
```

- D2: Only Ysabeau Office and Hedvig Letters Serif appear. There are no tracked capitals, and every heading and button is in sentence case.
- D3: No heading ends with a single word on its own line, at 390 or at 1440.
- D4: Body text runs under 70 characters per line at 1440. Count one full line on `host-1440-day`.
- D5: Corten appears only as the current nav item, the focus ring, the selection and the viewfinder frames. Lamp amber is never used for text on paper.
- D6: None of the section 6 defaults appear: no cream, no terracotta, no identical rounded cards, no arrows glued to links, no farm clichés.

**E. The craft standard's detail list**
- E1: Selection colour: corten by day and lit corten at night (`shots/detail-focus-14.png`, `shots/detail-focus-01.png` and Task 22's look).
- E2: Tab through `/host` at 390x844 and screenshot every stop. Every stop shows the corten ring: header, menu button, key facts links, the sheet toggle, every form field, the WhatsApp button and the footer.
- E3: Open the eight `/…/opengraph-image` URLs. Each card is different, legible, and correct for its route.
- E4: The favicon (`/icon`) reads as the arch at 32 px, and `/apple-icon` shows the whole mark.
- E5: On `404-390-day` and `404-1440-night`, the 404 shows the mark's small house with its door drawn open and nothing inside, "There's no room by that name.", and links to all six rooms.
- E6: First load under a slow network. Run this with `browser_run_code_unsafe`, then screenshot at 0.5 s, 1.5 s and 3 s:

  ```js
  async (page) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await page.goto("http://localhost:3022/?at=14:00");
  }
  ```

  The text under the arch paints first, there is no spinner, and after 2.5 s no drawing is still hidden.
- E7: At 1440x900, hover a `.pen-link`: its underline turns corten. Every `.btn` measures at least 44 px tall (`getBoundingClientRect().height`).

- [ ] **Step 10: Replace `README.md`**

````markdown
# The Barnyard Co.: the drawn house

Design option three of three for The Barnyard Co., a 10,000 sq ft loft house café in Chandkheda, Ahmedabad. The whole site is drawn in the single, even line of the café's own mark:
- the mark draws itself and opens into six rooms;
- every room is a construction drawing made in code over the café's own photographs;
- holding a drawing lifts it like tracing paper to show the photograph beneath, credited.

Option one (editorial light) lives at `D:\barnyard`; option two (the 3D arch) lives at `D:\barnyard-arch`.

Read first: `CLAUDE.md` (hard rules), `docs/BRIEF.md`, `docs/craft-standard.md`, `docs/spec.md`, `docs/plan.md`.

## Run it

You need Node 25 and npm. Python 3 is needed only to regenerate the OG fonts or the guide layers.

```bash
npm install
npx playwright install chromium
npm run dev              # http://localhost:3021 (builds into .next-dev)
npm run build            # production build into .next
npx next start -p 3022   # http://localhost:3022
```

- Ports: 3021 is dev and 3022 is production. 3000 belongs to an unrelated project, 3001/3002 to option one and 3011/3012 to option two.
- `?at=HH:MM` pins the house's clock, for example `/?at=01:00` for the night.
- The dev server and the production server can run at the same time, because `next.config.ts` sends the dev build to `.next-dev`.
- Stop the 3022 server before `npm run build`.

## Checks

| Command | What it proves |
|---|---|
| `npm test` | Unit tests: the clock, facts, construction library, drawings (budgets, crops), photographs, life helpers, the house geometry, annotations, product blocks, route copy, OG fonts, illustrator SVGs |
| `npm run lint` | ESLint |
| `npm run check` | On the build: no UNKNOWN/CONFIRM value or banned word in any page, every drawing credited, every lifted drawing has its photograph, verified press dates and links |
| `node scripts/e2e/all.mjs` | Every browser check in task order; starts the servers it needs and stops at the first failure |
| `node scripts/e2e/axe.mjs` | axe-core on every route and the 404, at 390 and 1440, by day and at night |
| `node scripts/budget.mjs` | First-load JS per route under 180 KB gzipped; each drawing under 40 KB gzipped |
| `node scripts/lighthouse-all.mjs` | Lighthouse mobile: 95 or above on all four scores, LCP under 2.5 s |
| `node scripts/e2e/shots.mjs` | Screenshots of every route at 390 and 1440, day and night, into `shots/` |

The full run before handing over:

```bash
npm test && npm run lint && npm run build && npm run check
(npx next start -p 3022 > .cache/next-start.log 2>&1 &)
node scripts/e2e/all.mjs && node scripts/e2e/axe.mjs && node scripts/budget.mjs
```

## Where things are

- `content/cafe.json`: every fact, copied from option one, which stays the source of truth. `content/media.json`: photograph credits. `content/drawings.json`: every drawing's source still, crop, credit, routes, stroke budget and whether it may lift. `content/photos.json`: the photographs under the drawings (generated).
- `lib/draw/`: the construction library (primitives, perspective, glyphs, render) and the illustrator SVG reader.
- `drawings/<id>.ts`: one module per drawing. `drawings/index.ts` is the registry; `drawings/illustrated.ts` is generated from `drawings/*.svg`.
- `lib/house.ts`, `components/house/`: the mark opening into the house. `components/draw/`: `<Drawing>`, `<Sheet>` (tracing paper) and life (steam, leaves, bulbs, the cue ball).
- `lib/daylight.ts`, `components/light/`: day and night by the visitor's clock. `lib/seo.ts`: route titles, descriptions, OG card lines and JSON-LD.
- `scripts/guides/`: offline guide layers, measuring grids and contour extraction. The tracing is a placement aid and never ships.

## How a drawing is made

Every drawing is constructed in code, in the logo's grammar, over the café's own photograph. Coordinates are measured in the 1080-wide frame of the whole source photo, and the crop in `content/drawings.json` is the drawing's viewBox.

1. `node scripts/guides/build.mjs <id> && node scripts/guides/grid.mjs <id>`, then open `guides/<id>/grid.png` and read the coordinates off the grid.
2. Write `drawings/<id>.ts`, exporting `<camelCaseId>Drawing(): Drawing`:
   - use named constants for every measured point, grouped into structure, detail, life and lamp;
   - build with `line`, `polyline`, `rect`, `arc`, `circle`, `ellipse`, `arch`, `curve`, `repeat` and the glyphs;
   - guided contours are allowed only for hands and food silhouettes, at most eight per drawing, pasted from `node scripts/guides/extract.mjs <id> --box=x0,y0,x1,y1`;
   - no people, no faces.
3. Register it in `drawings/index.ts`.
4. `npm test -- drawings`: budget, crop and path validity.
5. `npx tsx scripts/review.ts <id>`, then read `review/<id>-drawing.png`, `review/<id>-phone.png` and `review/<id>-overlay.png`. The review checklist:
   - one weight;
   - no stroke shorter than 12 frame units except bulbs and drops;
   - closed shapes closed;
   - structure within about 15 units of the photograph's edges in the overlay;
   - the room recognisable at a glance on the phone render;
   - within budget;
   - nothing drawn that the photograph does not show;
   - no person or face.
6. If the phone render is muddy, delete detail strokes first (never structure) and review again.
7. Life follows id conventions that `components/draw/life.ts` animates:
   - steam is `steam-<g>-<k>`, with `morphs` for variants 1 and 2;
   - swaying leaves are `leaf-<n>` (at most 12), each with one alternate in `morphs`;
   - bulbs are `bulb-<n>` in reading order;
   - glows are circles on each lamp;
   - the cue ball is `cue-ball`, with a `roll` path on the felt.
   Architecture never gets an animation id.

Photographs under the drawings: `node scripts/build-photos.mjs` crops every `lift: true` source at native resolution into `public/photos/<id>.jpg` and writes `content/photos.json`. On screen a photograph is never shown above 1.25x its source pixels, and its credit shows when the paper lifts.

## Replacing a drawing with an illustrator's SVG

An illustrator can redraw any drawing by hand (spec section 3.5). When `drawings/<id>.svg` exists, `drawingFor(id)` uses it everywhere instead of `drawings/<id>.ts`: the house, the rooms, the pages, the review renderer and the budget.

1. Start from the current drawing: `npx tsx scripts/export-drawing.ts <id>` writes `review/<id>-start.svg`. It is already in layer groups at the right viewBox, with glows as dashed circles. Starting from the photograph crop in `review/<id>-overlay.png` also works.
2. Keep to these rules. `npm run illustrations` stops with the file name and the reason if one is broken.
   - The root `viewBox` is exactly the drawing's crop from `content/drawings.json`, as `x y width height`. For example, `pizza` with crop `[0, 420, 1080, 1690]` needs `viewBox="0 420 1080 1270"`.
   - Every stroke sits inside exactly one `<g class="layer-structure">`, `layer-detail`, `layer-life` or `layer-lamp`, with no groups nested inside a layer group. The layer order is the drawing order.
   - Allowed shapes are `path`, `line`, `polyline`, `polygon`, `rect` (no rounded corners), `circle` and `ellipse`. Fill, stroke colour and stroke width are ignored, because the site draws every stroke in one weight with round caps.
   - No `transform` attributes: flatten them on export.
   - Keep ids where life should move: `steam-<g>-<k>`, `leaf-<n>`, `bulb-<n>` and `cue-ball`. Steam and leaf alternates and the cue ball's path exist only in code modules, so in an SVG drawing steam and leaves stay still, while bulbs still chase.
   - Glows are `<circle class="glow" cx cy r>`, anywhere in the file.
   - Stay within the drawing's `strokeBudget`. No faces, no invented people, nothing the photograph does not show.
3. Save it as `drawings/<id>.svg`, then run `npm run illustrations`, which also runs before `npm run dev` and `npm run build`. It prints `<id>.svg: N strokes` and regenerates `drawings/illustrated.ts`.
4. Check it:
   - `npm test -- illustration drawings`;
   - `npx tsx scripts/review.ts <id>`, then read the three renders;
   - `node scripts/budget.mjs` after a build;
   - `/lab/<id>` in dev at 390 px.
5. Commit `drawings/<id>.svg` together with `drawings/illustrated.ts`. To return to the code drawing, delete the SVG and run `npm run illustrations`.

## Rules that never bend

- Nothing invented: facts come only from `content/cafe.json`, and UNKNOWN or CONFIRM values never render. No capacities, prices (except the three priced signatures), lane counts, testimonials, floor plans or room adjacencies.
- Drawings show only what the café's photographs show, or objects `cafe.json` documents. Every photograph is credited by handle.
- Mobile first: judge at 390 px before desktop. Reduced motion: every drawing is complete at rest, with no loops.
- No `localStorage` or `sessionStorage`, and no backend: enquiries compose a WhatsApp message.
- Copy is in the café's register (`voice` in `cafe.json`), in sentence case.
````

- [ ] **Step 11: Append this option's questions to `docs/OPEN-QUESTIONS.md`**

Add this section at the end of the file:

```markdown
## Raised by option three, the drawn house (15 Sep 2026)

- **The mark.** May the logo be animated on the website and opened into a house of six rooms? The site draws it on arrival and reuses its arch, sun and door for the favicon, the OG cards and the 404. It is only ever drawn in ink (black steel by day, concrete at night) and never recoloured.
- **An illustrator's pass.** Would the studio like an illustrator to redraw any construction drawing by hand before the pitch? The site already prefers `drawings/<id>.svg` over the code drawing when the file exists (README, "Replacing a drawing with an illustrator's SVG").
- **Coffee Garba.** A sharper still from Coffee Garba would let the event be drawn. It is told in text with a row of lamps, because its only still is too blurred to draw honestly.
- **The games corner.** A photograph of the games corner would let it be drawn as a room. Until then it is a still life of the objects `cafe.json` documents (a pool table, board games and a shelf of books), not a floor plan.
- **The BOWL sign.** A clean still of the BOWL sign without the reel caption would let the alley drawing lift to its photograph. Today `alley-sign` has `lift: false`, because the caption crosses the pin.
- **Showing the photographs.** Can the studio confirm that the café's own photographs, and those of the creators it reposted (@suryaabrew, @anushhkagautam, @paulsartgallery98, @nocatch.in), may be shown under the drawings with handle credits?
```

- [ ] **Step 12: Final full run**

Stop anything on the two ports, then run the whole chain from a clean build:

```bash
npx kill-port 3021 3022
npm test && npm run lint && npm run build && npm run check
(npx next start -p 3022 > .cache/next-start.log 2>&1 &)
sleep 6
node scripts/e2e/all.mjs && node scripts/e2e/axe.mjs && node scripts/budget.mjs
```

Expected, in order (report the real output, not this list):
1. `npm test`: `Test Files  15 passed (15)`, 0 failed. The files are daylight, cafe, random, draw-primitives, draw-glyphs, draw-render, drawings, photos, life, house, annotations, product, seo, og-fonts and illustration.
2. `npm run lint`: exit 0, no errors.
3. `npm run build`: `> npm run illustrations`, `drawings/illustrated.ts: 0 illustration(s)`, `✓ Compiled successfully`, and `✓ Generating static pages`. The route table shows the eight routes, the eight `opengraph-image` routes, `/icon`, `/apple-icon`, `/manifest.webmanifest`, `/robots.txt` and `/sitemap.xml` as static.
4. `npm run check`: `scanned 9 built pages` (or more), then `content ok`.
5. `node scripts/e2e/all.mjs`: `starting next dev --turbopack -p 3021`, `== 1/11 shell` through `== 11/11 detail`, each ending `all checks passed`, then `all 11 e2e scripts passed`.
6. `node scripts/e2e/axe.mjs`: 36 `ok` lines, then `no violations on 36 pages`.
7. `node scripts/budget.mjs`: 9 route lines and 14 drawing lines, all `ok`, then `budgets ok`.

Then, with the server still running: `node scripts/lighthouse-all.mjs`. Expected: every row at 95 or above on perf, a11y, bp and seo, LCP under 2.5 s, exit 0. Paste the table into `docs/critique.md` under a heading "Lighthouse (mobile)".

Any failure sends you back to the step that owns it. Fix it, rerun the whole chain from the top, and only then commit.

- [ ] **Step 13: Commit**

Stage the files below and every file named in the "Fix (file)" column of `docs/critique.md`, listed by path:

```bash
git add lib/draw/illustration.ts scripts/illustrations.ts scripts/export-drawing.ts drawings/index.ts drawings/illustrated.ts tests/illustration.test.ts \
  scripts/e2e/all.mjs scripts/e2e/axe.mjs scripts/e2e/shots.mjs scripts/lighthouse-all.mjs scripts/budget.mjs \
  next.config.ts tsconfig.json eslint.config.mjs .gitignore package.json package-lock.json \
  README.md docs/OPEN-QUESTIONS.md docs/critique.md
git status --short
git commit -m "chore: verification suite, budgets, illustrator SVG preference, critique fixes and handover"
```

`git status --short` must show no modified tracked file left unstaged before committing. `shots/`, `lh/`, `review/`, `.cache/` and `.next-dev/` are git-ignored.

---

## Self-review

**Spec coverage.**

| Spec section | Tasks |
|---|---|
| 2. Non-negotiables | Global constraints; Task 3 (manifest, credits); Task 14 (honest size); Task 22 (content check); Task 23 (critique) |
| 3. How drawings are made | Tasks 2, 3, 4 (library, manifest, guides, review); Tasks 7 to 13 (every drawing); Task 23 (illustrator SVG preference) |
| 4. The house | Task 16 (arrival, panes, sun); Task 17 (under the arch, written about, doors, after dark, visit); Task 19 (pane flight) |
| 5. The rooms | Task 18 (rooms, annotations, lift, night glows); Task 15 (life) |
| 6. Other routes | Task 20 (host, shoot, bowl); Task 21 (menu, press, visit, 404) |
| 7. Motion | Task 6 (pen ease, draw-on, scrub); Task 15 (loops); Task 19 (transitions); Task 22 (Lenis) |
| 8. Palette and type | Task 5 |
| 9. Performance and accessibility | Tasks 6, 14, 15 (reduced motion); Task 23 (axe, Lighthouse, budgets) |
| 10. Content | Tasks 3, 14, 22 |
| 11. Open questions | Task 23 |

**Placeholder scan.** No "TBD", "TODO" or "similar to Task" remains in the plan; the provisional games values in item 4 have a named task and a rule.

**Names.** The shared names table at the top lists every module later tasks import; items 2 and 3 above record the two files that were split.
