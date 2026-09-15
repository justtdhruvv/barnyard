import { ellipse, line, n, polyline, rect, repeat } from "@/lib/draw/primitives";
import { leaf, vine } from "@/lib/draw/glyphs";
import type { Drawing, Glow, Layer, P, Stroke } from "@/lib/draw/types";
import { frameOf, metaFor } from "@/lib/drawings";

const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
/** y on the line through a and b at x. */
const yAt = (a: P, b: P, x: number) => a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);

/** A true circular arc from a to b bowing by `sag` (positive bows up on screen). */
function bow(a: P, b: P, sag: number, layer: Layer = "detail"): Stroke {
  const c = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const r = (c * c) / (8 * Math.abs(sag)) + Math.abs(sag) / 2;
  return { d: `M${n(a[0])} ${n(a[1])}A${n(r)} ${n(r)} 0 0 ${sag > 0 ? 1 : 0} ${n(b[0])} ${n(b[1])}`, layer };
}

/** A bentwood chair seen from behind: a bowed back rail, two posts running down to the floor, the seat between them. */
function chair(l: P, r: P, seatY: number, footL: P, footR: P): Stroke[] {
  const tl: P = [l[0] + 6, l[1] + 2], tr: P = [r[0] - 6, r[1] + 2];
  const xl = tl[0] + ((footL[0] - tl[0]) * (seatY - tl[1])) / (footL[1] - tl[1]);
  const xr = tr[0] + ((footR[0] - tr[0]) * (seatY - tr[1])) / (footR[1] - tr[1]);
  return [bow(l, r, 9), line(tl, footL, "detail"), line(tr, footR, "detail"), line([xl, seatY], [xr, seatY], "detail")];
}

/** A fan of leaves springing from one root. */
function clump(root: P, specs: [number, number][]): Stroke[] {
  return specs.map(([len, ang]) => leaf(root, len, ang));
}

/** The main floor, drawn as an architect would: steel and brick first, then the stair, then the furniture, then the plants. */
export function mainFloorDrawing(): Drawing {
  const s: Stroke[] = [];
  const glows: Glow[] = [];

  // Roof: the long duct and the black steel beam under it; the beam at the top right.
  const dA: P = [250, 83], dB: P = [407, 0], dC: P = [250, 127], dD: P = [515, 0];
  s.push(line(dA, dB), line(dC, dD));
  s.push(...[0.3, 0.62].map((t) => bow(lerp(dA, dB, t), lerp(dC, dD, t), 5, "structure")));
  s.push(line([293, 125], [552, 22]), line([293, 141], [560, 36]));
  s.push(line([958, 34], [1080, 18]));

  // Left: the window, the column, the mezzanine slab and its railing.
  s.push(polyline([[250, 160], [271, 160], [271, 265], [250, 265]]));
  s.push(line([293, 141], [293, 404]));
  const lmA: P = [293, 227], lmB: P = [490, 172], lsA: P = [293, 265], lsB: P = [490, 230];
  s.push(line(lmA, lmB), line(lsA, lsB), line([293, 278], [490, 242]));
  s.push(...repeat(9, (i) => { const x = 312 + i * 21; return line([x, yAt(lmA, lmB, x)], [x, yAt(lsA, lsB, x)]); }));

  // Upper mezzanine behind the stair: rail, balusters, slab edge.
  const urA: P = [490, 123], urB: P = [870, 13];
  const ubA: P = [490, 183], ubB: P = [877, 93];
  s.push(line(urA, urB), line(ubA, [712, yAt(ubA, ubB, 712)]), line([490, 200], [690, 153]));
  s.push(...repeat(8, (i) => { const x = 514 + i * 24; return line([x, yAt(urA, urB, x)], [x, yAt(ubA, ubB, x)]); }));

  // Brick wall: its near edge and the plinth along its foot, passing behind the table.
  const pA: P = [490, 481], pB: P = [1080, 580];
  s.push(line([490, 200], [490, 481]));
  s.push(line(pA, [662, yAt(pA, pB, 662)]), line([952, yAt(pA, pB, 952)], pB), line([503, 527], [664, 558]));

  // A few bricks in stretcher bond, one place only, as a hint of the whole wall.
  const bricks: [number, number][] = [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [1, 2], [2, 2], [2, 3]];
  for (const [col, row] of bricks) s.push(rect(962 + col * 30 + (row % 2) * 15, 136 + row * 13, 26, 9));

  // Framed picture.
  s.push(rect(923, 243, 104, 70, "detail"), rect(934, 253, 82, 50, "detail"));

  // The stair: a steel stringer, cantilevered wedge treads, one post, the railing.
  const A: P = [500, 455], B: P = [935, 70];
  s.push(polyline([[995, 95], [602, 443], [560, 455], [995, 70]]));
  s.push(...repeat(13, (_, t) => { const [x, y] = lerp(A, B, t); return polyline([[x, y], [x + 58, y], [x + 47, y + 10]], "structure", true); }));
  s.push(line([700, 322], [700, 500]));
  const hA: P = [457, 393], hB: P = [817, 7];
  const bA: P = [463, 457], bB: P = [770, 200];
  s.push(line(hA, hB), line([457, 393], [457, 462]));
  s.push(...repeat(13, (i) => { const x = 482 + i * 24; return line([x, yAt(hA, hB, x)], [x, yAt(bA, bB, x)]); }));

  // Table lamp in the far room.
  s.push(polyline([[388, 372], [406, 372], [401, 358], [393, 358]], "lamp", true));
  glows.push({ x: 397, y: 368, r: 22 });

  // Far room: sofa and a floor cushion.
  s.push(polyline([[273, 450], [273, 406], [352, 406], [352, 450]], "detail"), line([273, 430], [352, 430], "detail"));
  s.push(ellipse([388, 422], 20, 6, "detail"));

  // Front left: table on a pedestal, two bentwood chairs.
  s.push(polyline([[343, 463], [483, 463], [497, 492], [330, 496]], "detail", true));
  s.push(line([417, 496], [417, 578], "detail"), line([404, 578], [432, 578], "detail"));
  s.push(...chair([320, 494], [414, 489], 556, [314, 603], [400, 603]));
  s.push(...chair([427, 481], [507, 484], 516, [446, 572], [523, 578]));

  // Front right: square table, two cane-backed chairs, napkin holder and menu card.
  s.push(polyline([[705, 513], [915, 515], [945, 557], [668, 562]], "detail", true));
  s.push(line([668, 570], [945, 565], "detail"));
  s.push(line([676, 570], [679, 625], "detail"), line([936, 565], [940, 625], "detail"));
  s.push(polyline([[672, 540], [668, 508], [714, 500], [716, 512]], "detail"));
  s.push(polyline([[724, 510], [722, 497], [766, 490], [768, 512]], "detail"));
  s.push(rect(805, 520, 24, 28, "detail"), rect(808, 497, 17, 22, "detail"));

  // Pots on the plinth, each with a small fan of leaves.
  for (const x of [548, 578, 606, 638]) {
    s.push(polyline([[x - 13, 464], [x - 10, 494], [x + 10, 494], [x + 13, 464]], "detail", true));
    s.push(...clump([x, 462], [[18, 235], [22, 270], [18, 305]]));
  }

  // Plants against the brick: two tall stems, clumps at their feet.
  s.push(...vine([[757, 506], [752, 440], [742, 365]], 6, 11, 36));
  s.push(...vine([[935, 540], [942, 470], [952, 390]], 6, 37, 34));
  s.push(...vine([[1078, 470], [1062, 425], [1050, 385]], 3, 5, 24));
  const fan: [P, number, number][] = [
    [[852, 508], 40, 200], [[852, 508], 44, 235], [[852, 508], 46, 275], [[852, 508], 40, 312],
    [[970, 540], 38, 250], [[970, 540], 42, 300], [[970, 540], 34, 335], [[852, 508], 34, 345],
  ];
  fan.forEach(([b, len, ang], i) => s.push({ ...leaf(b, len, ang), id: `leaf-${i + 1}` }));

  return { id: "main-floor", title: metaFor("main-floor").title, ...frameOf("main-floor"), strokes: s, glows };
}
