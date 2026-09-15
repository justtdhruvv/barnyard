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
