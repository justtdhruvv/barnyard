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
