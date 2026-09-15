import { frameOf, metaFor } from "@/lib/drawings";
import { arc, curve, ellipse, line, polyline, rect, repeat } from "@/lib/draw/primitives";
import { bulb, leaf } from "@/lib/draw/glyphs";
import type { Drawing, Glow, P, Stroke } from "@/lib/draw/types";

/** A double-hung steel window in two sashes split by the beam: centre mullion and two glazing bars in each sash. */
function tallWindow(x0: number, x1: number): Stroke[] {
  const mid = (x0 + x1) / 2;
  return [
    rect(x0, 187, x1 - x0, 198, "structure"),
    rect(x0, 412, x1 - x0, 228, "structure"),
    line([mid, 187], [mid, 385], "detail"),
    line([mid, 412], [mid, 640], "detail"),
    line([x0, 253], [x1, 253], "detail"),
    line([x0, 319], [x1, 319], "detail"),
    line([x0, 488], [x1, 488], "detail"),
    line([x0, 564], [x1, 564], "detail"),
  ];
}

/** A wall lamp: bracket, dome shade, bulb. */
function wallLamp(x: number, y: number): Stroke[] {
  return [
    polyline([[x - 14, y - 22], [x, y - 22], [x, y - 12]], "lamp"),
    arc([x, y + 2], 14, 180, 360, "lamp"),
    line([x - 16, y + 2], [x + 16, y + 2], "lamp"),
    bulb([x, y + 8], 3),
  ];
}

/** The steel stair against the tall windows (Architectural Digest photograph), tables below. */
export function mezzanineStairDrawing(): Drawing {
  const strokes: Stroke[] = [];
  const glows: Glow[] = [];
  const S = (...s: Stroke[]) => strokes.push(...s);

  // Roof and wall head.
  S(line([312, 112], [600, 112]), line([620, 64], [726, 142]));
  // Upper railing along the mezzanine edge, receding.
  S(line([70, 56], [250, 244]), line([70, 110], [250, 346]));
  S(...repeat(11, (i) => { const t = i / 10; const x = 78 + t * 164; return line([x, 56 + ((x - 70) * 188) / 180], [x, 110 + ((x - 70) * 236) / 180], "detail"); }));

  // The stair: handrail and stringer near edge-on, open treads widening as they come down, a central spine.
  S(line([348, 266], [322, 906]), line([334, 300], [308, 910]));
  const treads = 17;
  S(...repeat(treads, (i) => {
    const t = i / (treads - 1);
    const y = 358 + 432 * (t * 0.75 + t * t * 0.25);
    const xl = 240 - 110 * t;
    const xr = 338 - 36 * t;
    return line([xl, y], [xr, y], "structure");
  }));
  S(polyline([[300, 374], [246, 690], [246, 842]], "structure"));
  // Concrete bottom steps.
  S(rect(105, 842, 195, 28), rect(82, 905, 248, 30), rect(70, 968, 260, 34));

  // The steel frame: beam across, black column, windows.
  S(line([330, 385], [726, 385]), line([330, 412], [726, 412]));
  S(line([600, 112], [600, 385]), line([620, 96], [620, 385]), line([600, 412], [600, 700]), line([620, 412], [620, 700]));
  S(...tallWindow(340, 435), ...tallWindow(470, 570));
  S(polyline([[726, 465], [665, 465], [665, 640], [726, 640]], "structure"), line([665, 552], [726, 552], "detail"));

  // Ceiling light drum on its duct.
  S(line([272, 50], [272, 146], "detail"), line([310, 50], [310, 146], "detail"), ellipse([291, 146], 19, 6, "detail"), line([272, 108], [310, 108], "detail"));

  // Wall lamps between the windows, lit at night.
  S(...wallLamp(452, 455), ...wallLamp(646, 460));
  glows.push({ x: 452, y: 470, r: 90 }, { x: 646, y: 474, r: 90 });

  // Raised platform and the back tables.
  S(line([345, 700], [726, 700]), line([352, 720], [726, 720]));
  S(line([415, 678], [570, 678], "detail"), line([420, 690], [572, 690], "detail"), rect(440, 664, 52, 28, "detail"), rect(500, 664, 54, 28, "detail"), line([660, 678], [726, 678], "detail"), line([664, 690], [726, 690], "detail"));

  // Front table: top, pedestal, foot.
  S(polyline([[478, 745], [676, 738], [720, 766], [540, 788]], "detail", true), line([584, 788], [584, 886], "detail"), line([596, 787], [596, 886], "detail"), ellipse([590, 898], 64, 14, "detail"));

  // Cane chairs around it.
  S(curve([[430, 764], [470, 748], [516, 756]], "detail"), line([433, 766], [452, 832], "detail"), line([514, 758], [526, 818], "detail"));
  S(polyline([[444, 832], [540, 822], [562, 846], [458, 860]], "detail", true), line([458, 860], [438, 985], "detail"), line([560, 846], [556, 985], "detail"), line([444, 832], [436, 905], "detail"));
  S(curve([[640, 752], [690, 740], [726, 750]], "detail"), line([648, 756], [664, 830], "detail"), polyline([[664, 830], [726, 824]], "detail"));
  S(curve([[636, 884], [676, 852], [726, 858]], "detail"), polyline([[650, 930], [726, 912]], "detail"), line([652, 930], [628, 1030], "detail"), line([640, 890], [652, 930], "detail"));

  // The plant rising beside the stair, and the one over the mezzanine rail.
  const leaves: [number, number, number, number][] = [[356, 700, 80, -60], [356, 700, 66, -86], [356, 700, 72, -34], [350, 700, 50, -104], [236, 228, 44, -62], [236, 228, 38, -104]];
  leaves.forEach(([x, y, len, ang], i) => strokes.push({ ...leaf([x, y] as P, len, ang), id: `leaf-${i}` }));

  return { id: "mezzanine-stair", title: metaFor("mezzanine-stair").title, ...frameOf("mezzanine-stair"), strokes, glows };
}
