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

