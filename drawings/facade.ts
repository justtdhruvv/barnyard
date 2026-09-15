import { frameOf, metaFor } from "@/lib/drawings";
import { bulb, leaf } from "@/lib/draw/glyphs";
import { circle, curve, line, n, polyline } from "@/lib/draw/primitives";
import type { Drawing, Glow, Layer, P, Stroke } from "@/lib/draw/types";
import { ARCH_PATH, DIVIDER_PATHS, DROPS, HOUSE_PATHS, PLANT_PATHS, STEAM_PATHS, SUN_CENTER, SUN_RADIUS, SUN_RAYS, WINDOW_PATHS } from "@/lib/mark";

/** An affine map from the mark's 320 box onto the skewed plate. */
type Affine = (p: P) => P;

function affineFrom(origin: P, u: P, v: P, markOrigin: P): Affine {
  return ([x, y]) => {
    const dx = x - markOrigin[0];
    const dy = y - markOrigin[1];
    return [origin[0] + u[0] * dx + v[0] * dy, origin[1] + u[1] * dx + v[1] * dy];
  };
}

const pt = (p: P) => `${n(p[0])} ${n(p[1])}`;

/** Circular arc from a to b as cubic Béziers (exact under an affine map), SVG arc flags. */
function arcToCubics(a: P, b: P, r: number, large: number, sweep: number): P[][] {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const hx = (b[0] - a[0]) / 2;
  const hy = (b[1] - a[1]) / 2;
  const d = Math.hypot(hx, hy);
  const rr = Math.max(r, d);
  const h = Math.sqrt(Math.max(0, rr * rr - d * d));
  const sign = large === sweep ? -1 : 1;
  const ux = d ? -hy / d : 0;
  const uy = d ? hx / d : 0;
  const c: P = [mx + sign * h * ux, my + sign * h * uy];
  let t0 = Math.atan2(a[1] - c[1], a[0] - c[0]);
  let t1 = Math.atan2(b[1] - c[1], b[0] - c[0]);
  if (sweep && t1 < t0) t1 += Math.PI * 2;
  if (!sweep && t1 > t0) t1 -= Math.PI * 2;
  const segs = Math.max(1, Math.ceil(Math.abs(t1 - t0) / (Math.PI / 2) - 1e-9));
  const step = (t1 - t0) / segs;
  const k = (4 / 3) * Math.tan(step / 4);
  const out: P[][] = [];
  for (let i = 0; i < segs; i++) {
    const s = t0 + step * i;
    const e = s + step;
    const p0: P = [c[0] + rr * Math.cos(s), c[1] + rr * Math.sin(s)];
    const p3: P = [c[0] + rr * Math.cos(e), c[1] + rr * Math.sin(e)];
    const p1: P = [p0[0] - k * rr * Math.sin(s), p0[1] + k * rr * Math.cos(s)];
    const p2: P = [p3[0] + k * rr * Math.sin(e), p3[1] - k * rr * Math.cos(e)];
    out.push([p1, p2, p3]);
  }
  return out;
}

/** Map an SVG path (M, L, C, A with equal radii, Z; absolute) through the affine. */
function mapPath(d: string, f: Affine): string {
  const tok = d.match(/[MLCAZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
  let i = 0;
  let cmd = "";
  let cur: P = [0, 0];
  let start: P = [0, 0];
  let out = "";
  const num = () => Number(tok[i++]);
  while (i < tok.length) {
    if (/^[MLCAZ]$/i.test(tok[i])) cmd = tok[i++].toUpperCase();
    if (cmd === "Z") {
      out += "Z";
      cur = start;
      continue;
    }
    if (cmd === "M") {
      cur = [num(), num()];
      start = cur;
      out += `M${pt(f(cur))}`;
      cmd = "L";
    } else if (cmd === "L") {
      cur = [num(), num()];
      out += `L${pt(f(cur))}`;
    } else if (cmd === "C") {
      const c1: P = [num(), num()];
      const c2: P = [num(), num()];
      cur = [num(), num()];
      out += `C${pt(f(c1))} ${pt(f(c2))} ${pt(f(cur))}`;
    } else if (cmd === "A") {
      const r = num();
      num();
      num();
      const large = num();
      const sweep = num();
      const to: P = [num(), num()];
      for (const [c1, c2, e] of arcToCubics(cur, to, r, large, sweep)) out += `C${pt(f(c1))} ${pt(f(c2))} ${pt(f(e))}`;
      cur = to;
    } else {
      i++;
    }
  }
  return out;
}

function mappedCircle(c: P, r: number, f: Affine, layer: Layer): Stroke {
  const a: P = [c[0] + r, c[1]];
  const b: P = [c[0] - r, c[1]];
  return { d: mapPath(`M ${a[0]} ${a[1]} A ${r} ${r} 0 0 1 ${b[0]} ${b[1]} A ${r} ${r} 0 0 1 ${a[0]} ${a[1]}`, f), layer };
}

/** A hanging creeper strand: a gently swaying stem with leaves alternating down it. */
function strand(top: P, length: number, sway: number, leaves: number, leafLen: number, phase: number): { stem: Stroke; leaves: { base: P; angle: number; len: number }[] } {
  const pts: P[] = Array.from({ length: 5 }, (_, k) => {
    const t = k / 4;
    return [top[0] + Math.sin((t * 1.6 + phase) * Math.PI) * sway, top[1] + t * length] as P;
  });
  const out: { base: P; angle: number; len: number }[] = [];
  for (let k = 0; k < leaves; k++) {
    const t = (k + 0.6) / (leaves + 0.2);
    const base: P = [top[0] + Math.sin((t * 1.6 + phase) * Math.PI) * sway, top[1] + t * length];
    const side = (k + Math.round(phase * 10)) % 2 ? 1 : -1;
    out.push({ base, angle: 90 - side * 52, len: leafLen * (0.85 + ((k * 37) % 7) / 20) });
  }
  return { stem: curve(pts, "life"), leaves: out };
}

/** Single-line capitals on a 100-high box (y down, baseline at 100). [path, width, x-compression]. */
const GLYPHS: Record<string, [string, number, number]> = {
  T: ["M 0 0 L 60 0 M 30 0 L 30 100", 60, 1],
  H: ["M 0 0 L 0 100 M 60 0 L 60 100 M 0 50 L 60 50", 60, 1],
  E: ["M 55 0 L 0 0 L 0 100 L 55 100 M 0 50 L 44 50", 55, 1],
  B: ["M 0 100 L 0 0 L 32 0 A 25 25 0 0 1 32 50 L 0 50 M 32 50 A 25 25 0 0 1 32 100 L 0 100", 57, 1],
  A: ["M 0 100 L 32 0 L 64 100 M 13 60 L 51 60", 64, 1],
  R: ["M 0 100 L 0 0 L 32 0 A 25 25 0 0 1 32 50 L 0 50 M 28 50 L 58 100", 58, 1],
  N: ["M 0 100 L 0 0 L 60 100 L 60 0", 60, 1],
  Y: ["M 0 0 L 32 50 L 64 0 M 32 50 L 32 100", 64, 1],
  D: ["M 0 0 L 0 100 L 20 100 A 50 50 0 0 0 20 0 Z", 70, 1],
  C: ["M 85.4 14.6 A 50 50 0 1 0 85.4 85.4", 100, 0.72],
  O: ["M 100 50 A 50 50 0 1 1 0 50 A 50 50 0 1 1 100 50", 100, 0.72],
};

/** Set a word along a rising baseline: `base` is the first letter's bottom-left, `u` one glyph unit along the baseline, `v` one glyph unit down the letter. */
function word(text: string, base: P, u: P, v: P, gap: number, layer: Layer): Stroke[] {
  const out: Stroke[] = [];
  let at = 0;
  for (const ch of text) {
    const g = GLYPHS[ch];
    if (!g) continue;
    const [d, w, xs] = g;
    const o = at;
    const f: Affine = ([x, y]) => [base[0] + u[0] * (o + x * xs) + v[0] * (y - 100), base[1] + u[1] * (o + x * xs) + v[1] * (y - 100)];
    out.push({ d: mapPath(d, f), layer });
    at += w * xs + gap;
  }
  return out;
}

export function facadeDrawing(): Drawing {
  const strokes: Stroke[] = [];
  const glows: Glow[] = [];
  const morphs: Record<string, string[]> = {};

  // ---- the concrete wall: its top edge climbing to the corner, its far edge dropping behind the creepers
  const wallA: P = [148, 449];
  const wallB: P = [690, 68];
  strokes.push(line(wallA, wallB));
  strokes.push(line(wallB, [724, 1000]));
  const wallTopAt = (x: number) => wallA[1] + ((wallB[1] - wallA[1]) * (x - wallA[0])) / (wallB[0] - wallA[0]);

  // ---- the corten plate, a skewed quadrilateral with its bottom edge thickness
  const TL: P = [148, 468];
  const TR: P = [592, 305];
  const BR: P = [602, 860];
  const BL: P = [65, 1050];
  strokes.push(polyline([TL, TR, BR, BL], "structure", true));
  strokes.push(line([75, 1066], [606, 876], "structure"));

  // ---- THE BARNYARD CO, single-line capitals rising with the plate
  const slope = -0.449;
  strokes.push(...word("THE", [102, 974], [0.24, 0.24 * slope], [-0.09, 0.33], 12, "detail"));
  strokes.push(...word("BARNYARD", [165, 945], [0.484, 0.484 * slope], [-0.16, 0.53], 14, "detail"));
  strokes.push(...word("CO", [474, 806], [0.42, 0.42 * slope], [-0.12, 0.42], 14, "detail"));

  // ---- the mark on the plate, lamp-lit
  const f = affineFrom([202, 822], [0.943, -0.476], [-0.2, 1.45], [55, 265]);
  strokes.push(
    { d: mapPath(ARCH_PATH, f), layer: "lamp", id: "mark-arch" },
    ...DIVIDER_PATHS.map((d) => ({ d: mapPath(d, f), layer: "lamp" as const })),
    ...WINDOW_PATHS.map((d) => ({ d: mapPath(d, f), layer: "lamp" as const })),
    mappedCircle([SUN_CENTER.x, SUN_CENTER.y], SUN_RADIUS, f, "lamp"),
    ...SUN_RAYS.map((d) => ({ d: mapPath(d, f), layer: "lamp" as const })),
    ...STEAM_PATHS.map((d) => ({ d: mapPath(d, f), layer: "lamp" as const })),
    ...PLANT_PATHS.map((d) => ({ d: mapPath(d, f), layer: "lamp" as const })),
    ...DROPS.map((p) => mappedCircle([p.x, p.y], p.r + 0.5, f, "lamp")),
    ...HOUSE_PATHS.map((d) => ({ d: mapPath(d, f), layer: "lamp" as const })),
  );
  glows.push({ x: 305, y: 650, r: 175 });

  // ---- string lights: a sagging wire, two pendant bulbs
  strokes.push(curve([[0, 330], [52, 348], [98, 410], [135, 452], [192, 428], [260, 395]], "detail"));
  const pendants: [P, P][] = [
    [[50, 350], [45, 392]],
    [[133, 450], [137, 490]],
  ];
  pendants.forEach(([hang, c], k) => {
    strokes.push(line(hang, [c[0], c[1] - 14], "detail"));
    strokes.push({ ...bulb(c, 14), id: `bulb-${k}` });
    glows.push({ x: c[0], y: c[1], r: 55 });
  });
  strokes.push(line([586, 36], [834, 0], "detail"));

  // ---- the creepers, hanging from the wall's top edge and the green mass beyond the corner
  const specs: [number, number, number, number, number][] = [
    // x, bottom y, sway, leaves, phase
    [500, 900, 10, 5, 0.1],
    [556, 1000, 14, 6, 0.35],
    [618, 880, 12, 5, 0.6],
    [676, 700, 10, 4, 0.2],
    [748, 1000, 16, 7, 0.5],
    [822, 660, 12, 5, 0.8],
    [888, 920, 14, 6, 0.3],
    [956, 780, 12, 5, 0.7],
    [1024, 1000, 16, 7, 0.15],
    [1072, 560, 8, 4, 0.55],
  ];
  let nl = 0;
  specs.forEach(([x, bottom, sway, count, phase]) => {
    const top: P = [x, x < wallB[0] ? wallTopAt(x) : Math.max(0, 68 - (x - 690) * 0.5)];
    const s = strand(top, bottom - top[1], sway, count, 32, phase);
    strokes.push(s.stem);
    s.leaves.forEach((L, li) => {
      const st = leaf(L.base, L.len, L.angle, "life");
      if (nl < 8 && li === 1) {
        const id = `leaf-${nl++}`;
        strokes.push({ ...st, id });
        morphs[id] = [leaf(L.base, L.len, L.angle + (L.angle < 90 ? 14 : -14), "life").d];
      } else {
        strokes.push(st);
      }
    });
  });

  return { id: "facade", title: metaFor("facade").title, ...frameOf("facade"), strokes, glows, morphs };
}
