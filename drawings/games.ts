import { frameOf, metaFor } from "@/lib/drawings";
import { ball, bulb, leaf } from "@/lib/draw/glyphs";
import { arc, circle, line, polyline, rect, repeat } from "@/lib/draw/primitives";
import type { Drawing, P, Stroke } from "@/lib/draw/types";

/** A still life of the games room: a wall shelf of books and board games over a pool table under one pendant. */
export function gamesDrawing(): Drawing {
  const s: Stroke[] = [];

  // ---- The wall shelf -------------------------------------------------
  const shelfY = 380;
  s.push(rect(100, shelfY, 880, 14, "structure"));
  for (const bx of [180, 900]) s.push(polyline([[bx, shelfY + 14], [bx, shelfY + 72], [bx + (bx < 540 ? 52 : -52), shelfY + 14]], "structure"));

  // Books: a rhythm of spines, one leaning at the end.
  const books: [number, number][] = [[26, 168], [32, 196], [22, 150], [30, 184], [26, 204], [34, 160], [24, 178], [30, 142], [28, 190], [22, 170]];
  let bx = 130;
  books.forEach(([w, h], i) => {
    s.push(polyline([[bx, shelfY], [bx, shelfY - h], [bx + w, shelfY - h], [bx + w, shelfY]], "detail"));
    if (i % 3 === 1) s.push(line([bx, shelfY - h + 24], [bx + w, shelfY - h + 24], "detail"));
    bx += w;
  });
  {
    const a = (16 * Math.PI) / 180;
    const w = 30, h = 176;
    const o: P = [bx + Math.sin(a) * h + 2, shelfY];
    const up: P = [-Math.sin(a) * h, -Math.cos(a) * h];
    const across: P = [Math.cos(a) * w, -Math.sin(a) * w];
    const p1: P = [o[0] + up[0], o[1] + up[1]];
    const p3: P = [o[0] + across[0], o[1] + across[1]];
    const p2: P = [p1[0] + across[0], p1[1] + across[1]];
    s.push(polyline([o, p1, p2, p3], "detail", true));
  }

  // Board games: two upright, three stacked flat, each with its lid line.
  const upright: [number, number, number][] = [[616, 40, 176], [656, 34, 150]];
  for (const [x, w, h] of upright) {
    s.push(polyline([[x, shelfY], [x, shelfY - h], [x + w, shelfY - h], [x + w, shelfY]], "detail"));
    s.push(line([x + 9, shelfY - h + 14], [x + 9, shelfY - 14], "detail"));
  }
  const flat: [number, number, number][] = [[716, 240, 40], [730, 214, 32], [722, 226, 36]];
  let fy = shelfY;
  for (const [x, w, h] of flat) {
    s.push(rect(x, fy - h, w, h, "detail"));
    s.push(line([x, fy - h + 10], [x + w, fy - h + 10], "detail"));
    fy -= h;
  }
  // A small plant on the stack.
  const potX = 880;
  s.push(polyline([[potX - 26, fy - 40], [potX - 20, fy], [potX + 20, fy], [potX + 26, fy - 40]], "detail", true));
  s.push(line([potX, fy - 40], [potX, fy - 70], "life"));
  for (const [len, ang] of [[62, -150], [70, -118], [74, -62], [60, -30], [48, -90]] as [number, number][]) {
    s.push(leaf([potX, fy - 44], len, ang));
  }

  // ---- The pendant ----------------------------------------------------
  const lampX = 540;
  s.push(line([lampX, 0], [lampX, 556], "lamp"));
  s.push(polyline([[lampX - 16, 556], [lampX + 16, 556], [lampX + 58, 626], [lampX - 58, 626]], "lamp", true));
  s.push(bulb([lampX, 640], 12));

  // ---- The pool table (one-point, vanishing point above the lamp) -------
  const vp: P = [540, 300];
  const nearY = 1060;
  const farT = 0.395;
  const at = (x: number, t: number): P => [x + (vp[0] - x) * t, nearY + (vp[1] - nearY) * t];
  const nL = at(110, 0), nR = at(970, 0), fL = at(110, farT), fR = at(970, farT);
  s.push(polyline([nL, nR, fR, fL], "structure", true));
  // Cushion rail, inset.
  const inner = { nl: [168, 1026] as P, nr: [912, 1026] as P, fl: [312, 784] as P, fr: [768, 784] as P };
  s.push(polyline([inner.nl, inner.nr, inner.fr, inner.fl], "structure", true));
  // Apron and legs.
  s.push(polyline([nL, [110, 1112], [970, 1112], nR], "structure"));
  for (const lx of [160, 920]) {
    // A turned leg: tapered shaft, a collar under the apron, a ring above the foot.
    s.push(polyline([[lx - 20, 1112], [lx - 11, 1296], [lx + 11, 1296], [lx + 20, 1112]], "structure"));
    s.push(arc([lx, 1103.8], 46.2, 124.2, 55.8, "structure"));
    s.push(arc([lx, 1228], 30, 126.9, 53.1, "structure"));
  }
  // Six pockets.
  s.push(arc(inner.nl, 22, 45, 225));
  s.push(arc(inner.nr, 22, -45, 135));
  s.push(arc(inner.fl, 15, 135, 315));
  s.push(arc(inner.fr, 15, 225, 405));
  s.push(arc([540, 1026], 20, 0, 180));
  s.push(arc([540, 784], 14, 180, 360));

  // Racked balls in their triangle.
  const apex: P = [690, 900];
  const r = 13;
  repeat(4, (row) => repeat(row + 1, (j) => s.push(circle([apex[0] + row * 23, apex[1] + (j - row / 2) * 26], r))));
  s.push(polyline([[apex[0] - 22, apex[1]], [apex[0] + 3 * 23 + 20, apex[1] - 3 * 13 - 34], [apex[0] + 3 * 23 + 20, apex[1] + 3 * 13 + 34]], "detail", true));

  // The cue, lying along the near cushion, tip toward the left.
  const tip: P = [236, 1000], butt: P = [880, 990];
  s.push(polyline([[tip[0], tip[1] - 2], [butt[0], butt[1] - 6], [butt[0], butt[1] + 6], [tip[0], tip[1] + 2]], "detail", true));
  s.push(line([700, 986], [700, 1000], "detail"));

  // The cue ball, and the line it rolls along the felt.
  s.push({ ...ball([340, 920], 14), id: "cue-ball" });

  return {
    id: "games",
    title: metaFor("games").title,
    ...frameOf("games"),
    strokes: s,
    glows: [{ x: lampX, y: 650, r: 130 }],
    roll: { ball: "cue-ball", path: "M340 920L500 856L664 898" },
  };
}
