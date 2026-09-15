import { arch, circle, line, polyline } from "@/lib/draw/primitives";
import { cup, laptop, pin, steam } from "@/lib/draw/glyphs";
import type { Stroke } from "@/lib/draw/types";

export type DoorKind = "host" | "shoot" | "bowl" | "late";

function glyphFor(kind: DoorKind): Stroke[] {
  switch (kind) {
    case "host":
      return [...cup([100, 212], 46, 40), ...steam([100, 160], 54, 0)];
    case "shoot": {
      const x0 = 62, x1 = 138, y0 = 150, y1 = 205, k = 14;
      return [
        polyline([[x0, y0 + k], [x0, y0], [x0 + k, y0]], "detail"),
        polyline([[x1 - k, y0], [x1, y0], [x1, y0 + k]], "detail"),
        polyline([[x1, y1 - k], [x1, y1], [x1 - k, y1]], "detail"),
        polyline([[x0 + k, y1], [x0, y1], [x0, y1 - k]], "detail"),
        circle([100, 177.5], 9, "detail"),
      ];
    }
    case "bowl":
      return pin([100, 232], 104);
    case "late":
      return [
        line([100, 92], [100, 118], "detail"),
        { d: "M84 132A16 14 0 0 1 116 132Z", layer: "detail" },
        circle([100, 138], 4, "lamp"),
        ...laptop(62, 176, 76, 50),
      ];
  }
}

/** The small arched door from the mark, with the use drawn inside it. The leaf swings open in line on hover. */
export function Door({ kind }: { kind: DoorKind }) {
  const frame = arch([100, 250], 150, 222);
  const leaf = arch([100, 250], 132, 208);
  return (
    <svg className="door drawing" viewBox="0 0 200 262" aria-hidden="true">
      {kind === "late" ? <circle className="glow" cx="100" cy="140" r="70" fill="url(#door-glow)" /> : null}
      <defs>
        <radialGradient id="door-glow">
          <stop offset="0" stopColor="#e7a64f" stopOpacity="0.6" />
          <stop offset="1" stopColor="#e7a64f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="door-inside">
        {glyphFor(kind).map((s, i) => <path key={i} className={`layer-${s.layer}`} d={s.d} />)}
      </g>
      <path d={frame.d} />
      <path d="M12 250L188 250" />
      <g className="door-leaf">
        <path d={leaf.d} />
        <path d="M150 170L150 182" />
      </g>
    </svg>
  );
}
