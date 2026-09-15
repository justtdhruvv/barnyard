import { frameOf, metaFor } from "@/lib/drawings";
import { bulb, vine } from "@/lib/draw/glyphs";
import { curve, ellipse, line, polyline } from "@/lib/draw/primitives";
import type { Drawing, Glow, P, Stroke } from "@/lib/draw/types";

/** Evenly spaced points along a polyline, by arc length, ends included. */
function along(path: P[], count: number): P[] {
  const segs = path.slice(1).map((b, i) => ({ a: path[i], b, len: Math.hypot(b[0] - path[i][0], b[1] - path[i][1]) }));
  const total = segs.reduce((s, x) => s + x.len, 0);
  const out: P[] = [];
  for (let k = 0; k < count; k++) {
    let at = count === 1 ? 0 : (k / (count - 1)) * total;
    let placed = false;
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      if (at <= s.len || i === segs.length - 1) {
        const t = s.len ? Math.min(1, at / s.len) : 0;
        out.push([s.a[0] + (s.b[0] - s.a[0]) * t, s.a[1] + (s.b[1] - s.a[1]) * t]);
        placed = true;
        break;
      }
      at -= s.len;
    }
    if (!placed) out.push(path[path.length - 1]);
  }
  return out;
}

/** Points on an elliptical arc, degrees clockwise from +x. */
function arcPts(c: P, rx: number, ry: number, from: number, to: number, steps = 16): P[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = ((from + ((to - from) * i) / steps) * Math.PI) / 180;
    return [c[0] + Math.cos(a) * rx, c[1] + Math.sin(a) * ry] as P;
  });
}

/** Point in a quadrilateral [TL, TR, BR, BL] at (u, v). */
function inQuad(q: P[], u: number, v: number): P {
  const top: P = [q[0][0] + (q[1][0] - q[0][0]) * u, q[0][1] + (q[1][1] - q[0][1]) * u];
  const bot: P = [q[3][0] + (q[2][0] - q[3][0]) * u, q[3][1] + (q[2][1] - q[3][1]) * u];
  return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
}

/** y on the line through a and b at x. */
function yAt(a: P, b: P, x: number): number {
  return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
}

/** Where the segment a-b crosses the line through c and d (a is assumed above). */
function cross(a: P, b: P, c: P, d: P): P {
  const r: P = [b[0] - a[0], b[1] - a[1]];
  const s: P = [d[0] - c[0], d[1] - c[1]];
  const den = r[0] * s[1] - r[1] * s[0];
  const t = den ? ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den : 0;
  return [a[0] + r[0] * t, a[1] + r[1] * t];
}

export function alleySignDrawing(): Drawing {
  const strokes: Stroke[] = [];
  const glows: Glow[] = [];

  // ---- the marquee: a steel column with the letter panels hung on its face
  const colTop = 428;
  const colFoot = 1300;
  strokes.push(line([362, colTop], [362, 846]), line([362, 992], [362, 1080]), line([432, colTop], [432, colFoot]), line([362, colTop], [432, colTop]));
  strokes.push(polyline([[362, colTop], [144, colTop], [144, 1080], [362, 1080]]));
  strokes.push(line([144, 620], [362, 620]), line([144, 822], [362, 822]));
  strokes.push(polyline([[156, 1080], [432, 1080], [432, colFoot], [156, colFoot]], "structure", true));

  // ---- the lightbox quad (used to hide what passes behind it)
  const boxQ: P[] = [[300, 1625], [855, 1565], [885, 1790], [310, 1850]];

  // ---- two ribbed steel posts under the column, splaying slightly, passing behind the lightbox
  const posts: [P, P][] = [
    [[330, colFoot], [404, 1900]],
    [[372, colFoot], [452, 1900]],
    [[392, colFoot], [480, 1900]],
    [[432, colFoot], [532, 1900]],
  ];
  for (const [a, b] of posts) {
    strokes.push(line(a, cross(a, b, boxQ[0], boxQ[1])));
    strokes.push(line(cross(a, b, boxQ[3], boxQ[2]), b));
  }
  for (const [i, j] of [[0, 1], [2, 3]] as const) {
    const a: P = [(posts[i][0][0] + posts[j][0][0]) / 2, colFoot + 16];
    const b: P = [(posts[i][1][0] + posts[j][1][0]) / 2, 1900];
    strokes.push(line(a, cross(a, b, boxQ[0], boxQ[1]), "detail"));
  }

  // ---- BOWL in bulbs, along each letter's constructed skeleton, in reading order
  // the letter faces: a single outline each, offset evenly either side of the skeleton the bulbs sit on
  const side = (path: P[], h: number): P[] =>
    path.map((p, i) => {
      const dir = (a: P, b: P): P => {
        const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        return [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
      };
      const d1 = i > 0 ? dir(path[i - 1], p) : dir(p, path[i + 1]);
      const d2 = i < path.length - 1 ? dir(p, path[i + 1]) : d1;
      const m: P = [-d1[1] - d2[1], d1[0] + d2[0]];
      const ml = Math.hypot(m[0], m[1]) || 1;
      const cos = (m[0] * -d1[1] + m[1] * d1[0]) / ml;
      const s = h / Math.max(0.45, cos);
      return [p[0] + (m[0] / ml) * s, p[1] + (m[1] / ml) * s];
    });
  const face = (path: P[], h: number): Stroke => polyline([...side(path, h), ...side(path, -h).reverse()], "detail", true);
  strokes.push({ d: "M192 452L258 452A34 34 0 0 1 258 520L262 520A32 32 0 0 1 262 584L192 584Z", layer: "detail" });
  strokes.push({ d: "M236 474L256 474A12 12 0 0 1 256 498L236 498Z", layer: "detail" });
  strokes.push({ d: "M236 534L256 534A13 13 0 0 1 256 560L236 560Z", layer: "detail" });
  strokes.push(ellipse([268, 708], 73, 68, "detail"), ellipse([268, 708], 31, 28, "detail"));
  strokes.push(face([[193, 853], [240, 980], [281, 892], [322, 980], [369, 853]], 17));
  strokes.push(face([[262, 1095], [262, 1250], [360, 1250]], 22));

  const bUpper: P[] = [[214, 574], [214, 463], [257, 463], ...arcPts([257, 486], 23, 23, -90, 90, 10), [236, 509]];
  const bLower: P[] = [...arcPts([260, 549], 24, 24, -55, 90, 10), [248, 573]];
  const letters: { pts: P[]; glow: Glow }[] = [
    { pts: [...along(bUpper, 12), ...along(bLower, 5)], glow: { x: 250, y: 518, r: 95 } },
    { pts: along(arcPts([268, 708], 52, 48, -90, 242, 40), 13), glow: { x: 268, y: 708, r: 100 } },
    { pts: along([[200, 872], [240, 980], [281, 892], [322, 980], [362, 872]], 19), glow: { x: 281, y: 926, r: 105 } },
    { pts: along([[262, 1117], [262, 1250], [338, 1250]], 10), glow: { x: 290, y: 1180, r: 95 } },
  ];
  let nb = 0;
  for (const L of letters) {
    for (const p of L.pts) strokes.push({ ...bulb(p, 6.5), id: `bulb-${nb++}` });
    glows.push(L.glow);
  }

  // ---- the giant pin: one smooth symmetric profile standing on a flat base
  const ax = 690;
  const prof: [number, number][] = [[95, 1270], [120, 1150], [130, 1060], [124, 990], [96, 905], [60, 835], [46, 790], [50, 745], [60, 695], [55, 650], [36, 622], [0, 614]];
  const right = prof.map(([w, y]) => [ax + w, y] as P);
  const left = [...prof].reverse().slice(1).map(([w, y]) => [ax - w, y] as P);
  strokes.push(curve([...right, ...left], "structure"));
  strokes.push(line([ax - 95, 1270], [ax + 95, 1270]));
  strokes.push(polyline([[654, 742], [736, 755], [734, 775], [652, 762]], "lamp", true));
  strokes.push(polyline([[652, 790], [736, 803], [736, 821], [650, 808]], "lamp", true));
  glows.push({ x: 696, y: 782, r: 70 });

  // ---- OPEN, plain neon letters on a slightly falling line
  const tilt = (x: number, y: number): P => [x, y + (x - 610) * 0.09];
  const oy = 928;
  const oh = 40;
  strokes.push(ellipse(tilt(632, oy + oh / 2), 18, oh / 2, "lamp"));
  strokes.push(curve([tilt(662, oy + oh), tilt(662, oy), tilt(680, oy + 1), tilt(689, oy + 11), tilt(680, oy + 21), tilt(662, oy + 22)], "lamp", 0.4));
  strokes.push(polyline([tilt(724, oy), tilt(700, oy), tilt(700, oy + oh), tilt(724, oy + oh)], "lamp"));
  strokes.push(line(tilt(700, oy + oh / 2), tilt(720, oy + oh / 2), "lamp"));
  strokes.push(polyline([tilt(736, oy + oh), tilt(736, oy), tilt(764, oy + oh), tilt(764, oy)], "lamp"));
  glows.push({ x: 692, y: 955, r: 85 });

  // ---- the pin's post down to the lightbox
  strokes.push(line([672, 1270], [672, yAt(boxQ[0], boxQ[1], 672)]), line([704, 1270], [704, yAt(boxQ[0], boxQ[1], 704)]));

  // ---- the lightbox: a tilted trapezoid, split in two, three ruled lines per panel
  strokes.push(polyline(boxQ, "structure", true));
  strokes.push(line(inQuad(boxQ, 0.52, 0), inQuad(boxQ, 0.53, 1)));
  for (const [u0, u1] of [[0.08, 0.44], [0.6, 0.94]]) {
    for (const v of [0.3, 0.52, 0.74]) strokes.push(line(inQuad(boxQ, u0, v), inQuad(boxQ, u1, v), "detail"));
  }

  // ---- a tree at the right edge
  strokes.push(...vine([[1072, 1900], [1052, 1760], [1030, 1620], [1004, 1500], [990, 1400]], 7, 11, 34));
  strokes.push(...vine([[1040, 1680], [990, 1620], [950, 1580]], 3, 23, 30));
  strokes.push(...vine([[1020, 1560], [1050, 1470], [1080, 1420]], 3, 37, 30));

  return { id: "alley-sign", title: metaFor("alley-sign").title, ...frameOf("alley-sign"), strokes, glows };
}
