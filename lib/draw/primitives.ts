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
