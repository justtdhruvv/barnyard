import { frameOf, metaFor } from "@/lib/drawings";
import { arc, circle, ellipse, line, polyline, rect, repeat } from "@/lib/draw/primitives";
import { leaf, vine } from "@/lib/draw/glyphs";
import type { Drawing, Glow, P, Stroke } from "@/lib/draw/types";

/** Deterministic 0..1 jitter so the strip rhythm is irregular but stable. */
const jit = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** The lower half of an ellipse (the hoop line seen from above the barrel's middle). */
const hoop = (cx: number, cy: number, rx: number, ry: number): Stroke => ({
  d: `M${cx - rx} ${cy}A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`,
  layer: "detail",
});

/** The entry hall, drawn from the reel still: crate strips overhead, black band, mezzanine, the steel stair, curtains, the barrel. */
export function entryDrawing(): Drawing {
  const strokes: Stroke[] = [];
  const glows: Glow[] = [];
  const S = (...s: Stroke[]) => strokes.push(...s);

  // Ceiling: hanging fruit-crate strips, a rhythm of verticals of uneven length.
  S(...repeat(42, (i) => line([14 + i * 19, 0], [14 + i * 19, 150 + jit(i) * 155], "detail")));
  // The vent box top right.
  S(rect(870, 60, 170, 170, "structure"), ...repeat(4, (i) => line([900 + i * 32, 75], [880 + i * 32, 215], "detail")));

  // Black beam band with its duct.
  S(line([0, 300], [1080, 300]), line([0, 370], [680, 370]), line([0, 440], [590, 440]), line([0, 482], [590, 482]), ellipse([590, 461], 9, 21, "structure"), line([0, 545], [665, 545]));
  // Pendant lamps under the band.
  for (const [x, y] of [[105, 490], [368, 482], [520, 478]] as P[]) {
    S(polyline([[x - 8, y], [x - 8, y + 14], [x - 18, y + 36], [x + 18, y + 36], [x + 8, y + 14], [x + 8, y]], "lamp"));
    glows.push({ x, y: y + 44, r: 70 });
  }

  // Mezzanine: the bright opening, its railing, the slab edge.
  S(line([360, 545], [360, 748]), line([0, 645], [360, 645]), ...repeat(12, (i) => line([15 + i * 30, 645], [15 + i * 30, 748], "detail")));
  S(line([0, 748], [690, 748]), line([0, 766], [690, 766]));
  // Landing railing.
  S(line([545, 630], [690, 630]), line([690, 630], [690, 748]), ...repeat(9, (i) => line([560 + i * 15, 630], [560 + i * 15, 748], "detail")));

  // The steel stair: handrail, balusters, stringer, open treads, one post.
  const yR = (x: number) => 1020 - 0.712 * x;
  const yS = (x: number) => 1135 - 0.712 * x;
  S(line([0, yR(0)], [545, yR(545)]));
  S(...repeat(18, (i) => { const x = 12 + i * 30; return line([x, yR(x)], [x, yR(x) + 100], "detail"); }));
  S(line([0, yS(0)], [560, yS(560)]), line([0, yS(0) + 26], [535, yS(535) + 26]));
  const zig: P[] = [[0, yS(0)]];
  for (let x = 0; x + 53 <= 560; x += 53) { zig.push([x, yS(x) - 38], [x + 53, yS(x) - 38]); }
  S(polyline(zig, "structure"));
  S(line([318, yS(318) + 24], [318, 1150]), line([330, yS(330) + 24], [330, 1150]));

  // Brick wall: the planter ledge, the painting, the small frame.
  S(line([0, 1150], [660, 1150]));
  S(rect(35, 790, 125, 168, "detail"), rect(47, 802, 101, 144, "detail"));
  S(rect(518, 915, 72, 50, "detail"), rect(527, 923, 54, 34, "detail"));

  // Right wall: corner, wall top, tall window, mirror panel, the sheer curtain.
  S(line([665, 370], [665, 780]), line([680, 372], [850, 372]));
  S(rect(845, 600, 67, 660), rect(858, 622, 41, 616, "detail"), line([858, 850], [899, 850], "detail"), line([858, 1130], [899, 1130], "detail"));
  S(polyline([[740, 870], [826, 842], [830, 1210], [742, 1180]], "detail", true));
  S(...[660, 690, 718].map((x) => line([x, 790], [x, 1170], "detail")));
  // Wall fans.
  S(ellipse([745, 615], 42, 50), circle([745, 615], 8), line([787, 606], [832, 612], "detail"));
  S(ellipse([672, 745], 32, 38), circle([672, 745], 6), line([704, 740], [730, 710], "detail"));
  // The wall light under the second fan.
  S(line([722, 770], [722, 786], "lamp"), arc([700, 804], 22, 180, 360, "lamp"), line([676, 804], [724, 804], "lamp"));
  glows.push({ x: 700, y: 816, r: 80 });

  // The tall curtain on the right, pleats from the beam to the floor.
  S(...[935, 972, 1008, 1044].map((x, i) => line([x, 304], [x, i < 2 ? 1490 : 1440], "detail")));

  // Tables.
  S(polyline([[378, 1216], [582, 1218], [592, 1274], [324, 1272]], "detail", true), line([456, 1274], [456, 1468], "detail"), line([470, 1274], [470, 1468], "detail"), polyline([[425, 1468], [525, 1468], [520, 1504], [400, 1504]], "detail", true));
  S(polyline([[388, 1164], [566, 1164], [574, 1194], [382, 1194]], "detail", true));
  S(polyline([[28, 1126], [236, 1124], [236, 1140], [22, 1142]], "detail", true), line([105, 1142], [105, 1228], "detail"), line([62, 1230], [150, 1230], "detail"));
  // Chairs.
  S(polyline([[318, 1345], [300, 1214], [346, 1210], [362, 1340]], "detail"), line([310, 1280], [352, 1276], "detail"));
  S(polyline([[312, 1346], [440, 1340], [446, 1390], [320, 1394]], "detail", true), line([322, 1394], [294, 1505], "detail"), line([444, 1390], [436, 1510], "detail"), line([380, 1392], [372, 1470], "detail"));
  S(polyline([[150, 1182], [232, 1176], [236, 1190], [148, 1196]], "detail", true), line([152, 1196], [140, 1235], "detail"), line([234, 1190], [238, 1232], "detail"), polyline([[200, 1178], [214, 1128], [236, 1130], [232, 1176]], "detail"));
  S(polyline([[0, 1212], [58, 1206], [62, 1222], [0, 1230]], "detail"), line([48, 1222], [62, 1320], "detail"), line([10, 1230], [6, 1300], "detail"));

  // Floor stripe.
  S(rect(15, 1685, 365, 12, "detail"));

  // The barrel: rim, staves' profile, hoops, bung.
  S(ellipse([738, 1335], 142, 22), ellipse([738, 1337], 126, 15));
  S({ d: "M597 1335C582 1420 568 1500 570 1560C572 1650 582 1740 596 1800", layer: "structure" });
  S({ d: "M880 1335C896 1420 910 1500 910 1560C910 1650 900 1740 888 1800", layer: "structure" });
  S(hoop(738, 1400, 152, 26), hoop(738, 1444, 160, 28), hoop(740, 1585, 170, 32), hoop(740, 1760, 157, 34));
  S(circle([815, 1640], 12));

  // Ferns along the ledge and the palm in the bottom right.
  const ferns: [number, number, number, number][] = [[360, 1150, 62, -128], [360, 1150, 76, -92], [360, 1150, 62, -56], [490, 1150, 70, -112], [490, 1150, 70, -70], [612, 1150, 60, -126], [612, 1150, 74, -88], [612, 1150, 60, -52]];
  ferns.forEach(([x, y, len, ang], i) => strokes.push({ ...leaf([x, y], len, ang), id: `leaf-${i}` }));
  S(...vine([[1080, 1760], [960, 1702], [850, 1700], [764, 1728]], 9, 7, 50));
  S(...vine([[1080, 1690], [1034, 1596], [1012, 1482]], 6, 11, 44));

  return { id: "entry", title: metaFor("entry").title, ...frameOf("entry"), strokes, glows };
}
