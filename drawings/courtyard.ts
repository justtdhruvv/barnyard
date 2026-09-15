import { frameOf, metaFor } from "@/lib/drawings";
import { bulb, leaf, vine } from "@/lib/draw/glyphs";
import { arc, ellipse, line, n, polyline, rect, repeat } from "@/lib/draw/primitives";
import type { Drawing, Layer, P, Stroke } from "@/lib/draw/types";

const pt = ([x, y]: P) => `${n(x)} ${n(y)}`;

/** A palm frond: one quadratic rib with leaflets paired along it, swept toward the tip. */
function frond(base: P, tip: P, bend: number, pairs: number, len: number): Stroke[] {
  const mx = (base[0] + tip[0]) / 2, my = (base[1] + tip[1]) / 2;
  const dx = tip[0] - base[0], dy = tip[1] - base[1];
  const L = Math.hypot(dx, dy) || 1;
  const ctrl: P = [mx - (dy / L) * bend, my + (dx / L) * bend];
  const out: Stroke[] = [{ d: `M${pt(base)}Q${pt(ctrl)} ${pt(tip)}`, layer: "life" }];
  for (let i = 0; i < pairs; i++) {
    const t = 0.3 + (0.6 * i) / Math.max(1, pairs - 1);
    const u = 1 - t;
    const p: P = [u * u * base[0] + 2 * u * t * ctrl[0] + t * t * tip[0], u * u * base[1] + 2 * u * t * ctrl[1] + t * t * tip[1]];
    const tx = 2 * u * (ctrl[0] - base[0]) + 2 * t * (tip[0] - ctrl[0]);
    const ty = 2 * u * (ctrl[1] - base[1]) + 2 * t * (tip[1] - ctrl[1]);
    const dir = (Math.atan2(ty, tx) * 180) / Math.PI;
    const l = len * (1.1 - 0.4 * t);
    out.push(leaf(p, l, dir - 30), leaf(p, l, dir + 30));
  }
  return out;
}

/** A bent-wood chair seen from behind: true arcs for the back, straight spindles, a striped seat. */
function chair(mirror: boolean): Stroke[] {
  const X = (x: number) => (mirror ? 1080 - x : x);
  const Q = (p: P): P => [X(p[0]), p[1]];
  const A = (c: P, r: number, from: number, to: number, layer: Layer = "detail") =>
    mirror ? arc(Q(c), r, 180 - to, 180 - from, layer) : arc(c, r, from, to, layer);
  const c: P = [300, 1790];
  const on = (r: number, deg: number): P => [c[0] + Math.cos((deg * Math.PI) / 180) * r, c[1] + Math.sin((deg * Math.PI) / 180) * r];
  const out: Stroke[] = [A(c, 250, 196, 268), A(c, 228, 202, 266)];
  // Spindles from the back rail down to the back of the seat.
  for (const [deg, to] of [[214, [236, 1748]], [240, [330, 1748]]] as [number, P][]) out.push(line(Q(on(228, deg)), Q(to), "detail"));
  // Rear leg from the end of the rail.
  out.push(line(Q(on(250, 196)), Q([112, 1920]), "detail"));
  // Seat and its stripes.
  const seat: P[] = [[196, 1748], [468, 1748], [486, 1900], [214, 1900]];
  out.push(polyline(seat.map(Q), "detail", true));
  repeat(4, (i) => {
    const y = 1780 + i * 30;
    const t = (y - 1748) / 152;
    out.push(line(Q([196 + 18 * t, y + 6]), Q([468 + 18 * t, y - 6]), "detail"));
  });
  return out;
}

/** The courtyard under the vines: mezzanine rail and window above, brick wall and stair to the right, palms and one table between two chairs. */
export function courtyardDrawing(): Drawing {
  const s: Stroke[] = [];

  // Ceiling: beam line, the four round ducts, the mezzanine edge.
  s.push(line([0, 252], [1080, 252]));
  for (const x of [100, 452, 692, 936]) {
    s.push(polyline([[x - 32, 252], [x - 32, 290], [x + 32, 290], [x + 32, 252]]));
    s.push(ellipse([x, 290], 32, 9, "structure"));
  }
  s.push(line([0, 404], [1080, 404]));

  // Window and railings on the mezzanine.
  s.push(rect(146, 484, 526, 162));
  s.push(...repeat(4, (i) => line([146 + (526 * (i + 1)) / 5, 484], [146 + (526 * (i + 1)) / 5, 546])));
  s.push(line([0, 546], [672, 546]));
  s.push(...repeat(13, (i) => line([182 + i * 38, 546], [182 + i * 38, 646])));
  s.push(rect(672, 484, 408, 172));
  s.push(...repeat(15, (i) => line([700 + i * 26, 484], [700 + i * 26, 656])));
  s.push(line([672, 674], [1080, 674]));

  // Brick wall, painting, doorway, stair.
  s.push(line([672, 674], [672, 1160]));
  s.push(rect(800, 696, 184, 254));
  s.push(rect(816, 712, 152, 222));
  s.push(rect(538, 886, 72, 124));
  s.push(line([804, 1118], [1080, 876]));
  s.push(line([840, 1190], [1080, 980]));
  s.push(...repeat(6, (i) => {
    const x = 850 + i * 42;
    const yTop = 1118 - ((x - 804) * 242) / 276;
    const yBot = 1190 - ((x - 840) * 210) / 240;
    return line([x, yTop], [x, yBot]);
  }));

  // The ledge behind the table.
  s.push(line([0, 1452], [250, 1452]));
  s.push(line([820, 1452], [1080, 1452]));

  // The creeper canopy: two arching branches, stems hanging from them, one trunk from the planter.
  const vines: [P[], number, number][] = [
    [[[50, 740], [180, 620], [360, 560], [520, 540]], 6, 11],
    [[[520, 540], [660, 580], [780, 660], [820, 760]], 5, 12],
    [[[110, 680], [96, 820], [120, 960]], 3, 13],
    [[[220, 612], [232, 780], [210, 940], [232, 1080]], 4, 14],
    [[[330, 572], [318, 740], [340, 900]], 3, 15],
    [[[450, 545], [440, 700], [462, 860], [440, 1000], [470, 1130]], 5, 16],
    [[[562, 548], [574, 700], [554, 830]], 3, 17],
    [[[650, 580], [638, 720], [656, 860], [640, 990]], 4, 18],
    [[[762, 672], [738, 800], [752, 910]], 3, 19],
    [[[570, 1440], [560, 1300], [510, 1190], [470, 1130]], 4, 20],
  ];
  const leafStrokes: Stroke[] = [];
  for (const [path, count, seed] of vines) {
    const [stem, ...ls] = vine(path, count, seed, 58);
    s.push(stem);
    leafStrokes.push(...ls);
  }
  const pick = new Set(repeat(10, (i) => Math.round((i * (leafStrokes.length - 1)) / 9)));
  let k = 0;
  leafStrokes.forEach((st, i) => s.push(pick.has(i) ? { ...st, id: `leaf-${++k}` } : st));

  // Palms, left and right.
  const leftBase: P = [250, 1470];
  for (const [tip, bend] of [[[20, 1370], 70], [[110, 1190], 50], [[370, 1180], -50], [[480, 1390], -70]] as [P, number][]) {
    s.push(...frond(leftBase, tip, bend, 4, 62));
  }
  const rightBase: P = [840, 1440];
  for (const [tip, bend] of [[[610, 1340], 70], [[730, 1170], 50], [[990, 1180], -50], [[1080, 1370], -70]] as [P, number][]) {
    s.push(...frond(rightBase, tip, bend, 4, 62));
  }

  // The table and the napkin holder on it.
  s.push(polyline([[296, 1512], [744, 1512], [800, 1664], [258, 1664]], "detail", true));
  s.push(polyline([[258, 1664], [258, 1682], [800, 1682], [800, 1664]], "detail"));
  s.push(line([508, 1682], [508, 1920], "detail"));
  s.push(line([544, 1682], [544, 1920], "detail"));
  s.push(rect(464, 1476, 64, 50, "detail"));
  s.push(polyline([[472, 1476], [496, 1436], [520, 1476]], "detail"));

  // Chairs.
  s.push(...chair(false), ...chair(true));

  // Lights: two pendants off the mezzanine, two garden lamps.
  for (const [x, drop] of [[520, 440], [616, 456]] as [number, number][]) {
    s.push(line([x, 404], [x, drop - 22], "lamp"));
    s.push(arc([x, drop], 22, 180, 360, "lamp"));
    s.push(line([x - 22, drop], [x + 22, drop], "lamp"));
  }
  s.push(bulb([236, 1402], 10), bulb([806, 1400], 10));

  return {
    id: "courtyard",
    title: metaFor("courtyard").title,
    ...frameOf("courtyard"),
    strokes: s,
    glows: [
      { x: 520, y: 450, r: 60 },
      { x: 616, y: 466, r: 60 },
      { x: 236, y: 1402, r: 90 },
      { x: 806, y: 1400, r: 90 },
    ],
  };
}
