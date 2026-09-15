import type { P } from "./types";

export const toward = (p: P, vp: P, t: number): P => [p[0] + (vp[0] - p[0]) * t, p[1] + (vp[1] - p[1]) * t];

/** 0..1 positions of `count` evenly spaced items receding from nearZ to farZ, as projected (1/z). */
export function perspectiveSteps(count: number, nearZ = 1, farZ = 4): number[] {
  if (count <= 1) return [0];
  const span = 1 / nearZ - 1 / farZ;
  return Array.from({ length: count }, (_, i) => {
    const z = nearZ + ((farZ - nearZ) * i) / (count - 1);
    return (1 / nearZ - 1 / z) / span;
  });
}

export const along = (a: P, b: P, ts: number[]): P[] => ts.map((t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
