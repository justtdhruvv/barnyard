"use client";

import { useEffect, useRef } from "react";
import { DRAWINGS, drawingFor } from "@/drawings";
import { markDrawing } from "@/drawings/mark";
import type { Drawing } from "@/lib/draw/types";
import { archPath, houseGeometry, sunOnArch, VIGNETTES, type HouseGeometry } from "@/lib/house";
import { loadGsap, motionAllowed } from "@/lib/motion/gsap";
import { nowHour, parseAt, stateFor } from "@/lib/daylight";
import { useLight } from "@/components/light/LightProvider";
import { MARK_SUN, MARK_RAYS } from "./markParts";
import "./house.css";

let arrivedThisLoad = false;

const MOBILE = houseGeometry(350, 2, 3, 132);
const DESKTOP = houseGeometry(1000, 3, 2, 220);

function vignetteOf(slug: keyof typeof VIGNETTES, id: string): { d: Drawing | null; vb: string } {
  const d = DRAWINGS[id] ? drawingFor(id) : null;
  if (!d) return { d: null, vb: "0 0 100 100" };
  const v = VIGNETTES[slug];
  return { d, vb: v ? v.join(" ") : `${d.x ?? 0} ${d.y ?? 0} ${d.width} ${d.height}` };
}

function Variant({ g, variant, clockT, night }: { g: HouseGeometry; variant: "m" | "d"; clockT: number; night: boolean }) {
  const mark = markDrawing();
  const sun = sunOnArch(clockT, g);
  const fs = variant === "m" ? 12.5 : 17;
  const sunR = variant === "m" ? 11 : 22;
  const markStrokes = mark.strokes.filter((s) => !s.id?.startsWith("mark-arch") && !s.id?.startsWith("mark-divider") && s.id !== "mark-sun");
  return (
    <svg className={`house house-${variant}`} viewBox={`0 0 ${g.width} ${g.height}`} data-variant={variant} role="group" aria-label="The house, drawn from the café's mark: six rooms under one arch">
      <defs>
        <radialGradient id={`sun-glow-${variant}`}>
          <stop offset="0" stopColor="#e7a64f" stopOpacity="0.75" />
          <stop offset="1" stopColor="#e7a64f" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* the sun's track through the opening hours, in the arch head */}
      <g className="house-track" aria-hidden="true">
        <path className="hair" d={`M${g.cx - sun.track} ${g.spring}A${sun.track} ${sun.track} 0 0 1 ${g.cx + sun.track} ${g.spring}`} />
        <text x={g.cx - sun.track} y={g.spring - 8} textAnchor="middle" fontSize={fs * 0.82}>11 AM</text>
        <text x={g.cx + sun.track} y={g.spring - 8} textAnchor="middle" fontSize={fs * 0.82}>3 AM</text>
      </g>

      <g className="house-panes">
        {g.panes.map((p) => {
          const { d, vb } = vignetteOf(p.slug, p.drawing);
          return (
            <a key={p.slug} href={`/spaces#${p.slug}`} className="pane" aria-label={p.name}>
              <rect className="pane-hit" x={p.x} y={p.y} width={p.w} height={p.h} />
              <rect className="pane-frame" x={p.x + 5} y={p.y + 5} width={p.w - 10} height={p.h - 10} />
              {d ? (
                <svg className="vignette" x={p.x + 8} y={p.y + fs + 16} width={p.w - 16} height={p.h - fs - 24} viewBox={vb} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  {d.glows?.map((gl, i) => <circle key={i} className="glow" cx={gl.x} cy={gl.y} r={gl.r} fill={`url(#sun-glow-${variant})`} />)}
                  {d.strokes.map((s, i) => <path key={i} className={`v v-${s.layer}`} d={s.d} />)}
                </svg>
              ) : null}
              <text className="pane-label" x={p.x + 10} y={p.y + fs + 8} fontSize={fs}>{p.name}</text>
            </a>
          );
        })}
      </g>

      <g className="house-lines" aria-hidden="true">
        <path className="house-arch ln" d={archPath(g.x0, g.x1, g.spring, g.base)} />
        {g.lines.map((l, i) => <path key={i} className={`house-line ln line-${i}`} d={`M${l[0]} ${l[1]}L${l[2]} ${l[3]}`} />)}
      </g>

      <g className={`house-sun${night ? " is-lamp" : ""}`} transform={`translate(${sun.cx.toFixed(1)} ${sun.cy.toFixed(1)})`} aria-hidden="true">
        <circle className="sun-glow" r={sunR * 4} fill={`url(#sun-glow-${variant})`} />
        <circle className="sun-disc ln" r={sunR} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <path key={i} className="sun-ray ln" d={`M${(Math.cos(a) * sunR * 1.35).toFixed(1)} ${(Math.sin(a) * sunR * 1.35).toFixed(1)}L${(Math.cos(a) * sunR * 1.85).toFixed(1)} ${(Math.sin(a) * sunR * 1.85).toFixed(1)}`} />;
        })}
      </g>

      {/* the mark, used only by the arrival: it draws itself, then its arch widens into the house */}
      <g className="house-mark" aria-hidden="true" style={{ opacity: 0 }}>
        {markStrokes.map((s, i) => <path key={i} className="ln mark-part" d={s.d} />)}
        <path className="ln mark-sun-part" d={MARK_SUN} />
        {MARK_RAYS.map((d, i) => <path key={i} className="ln mark-sun-part" d={d} />)}
      </g>
    </svg>
  );
}

export function House() {
  const { state } = useLight();
  const clockT = state?.clockT ?? 0.2;
  const night = state?.regime === "night";
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (arrivedThisLoad || !motionAllowed()) { arrivedThisLoad = true; el.setAttribute("data-done", ""); return; }
    arrivedThisLoad = true;
    const desktop = matchMedia("(min-width: 48rem)").matches;
    const svg = el.querySelector<SVGSVGElement>(desktop ? ".house-d" : ".house-m");
    if (!svg) { el.setAttribute("data-done", ""); return; }
    const g = desktop ? DESKTOP : MOBILE;
    el.setAttribute("data-arriving", "");
    let killed = false;
    let skip: (() => void) | null = null;
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    const onSkip = () => skip?.();

    loadGsap().then(({ gsap }) => {
      if (killed) return;
      const markG = svg.querySelector<SVGGElement>(".house-mark")!;
      const archEl = svg.querySelector<SVGPathElement>(".house-arch")!;
      const lineEls = Array.from(svg.querySelectorAll<SVGPathElement>(".house-line"));
      const sunG = svg.querySelector<SVGGElement>(".house-sun")!;
      const sunParts = Array.from(sunG.querySelectorAll<SVGPathElement | SVGCircleElement>(".ln"));
      const panes = Array.from(svg.querySelectorAll<SVGAElement>(".pane"));
      const track = svg.querySelector<SVGGElement>(".house-track")!;

      // the mark, centred in the house
      const S = Math.min(g.width * (desktop ? 0.34 : 0.6), 320);
      const s = S / 210;
      const tx = g.cx - 160 * s;
      const ty = g.height * (desktop ? 0.42 : 0.4) - 160 * s;
      markG.setAttribute("transform", `translate(${tx} ${ty}) scale(${s})`);
      const m = { x0: tx + 55 * s, x1: tx + 265 * s, spring: ty + 160 * s, base: ty + 265 * s };
      const M = (x: number, y: number) => [tx + x * s, ty + y * s] as const;
      const [v0x, v0y] = M(160, 55), [v1x, v1y] = M(160, 265);
      const [h0x, h0y] = M(55, 160), [h1x] = M(160, 160);
      const [r0x, r0y] = M(160, 172), [r1x] = M(265, 172);
      const startLines: [number, number, number, number][] = [[v0x, v0y, v1x, v1y], [h0x, h0y, h1x, h0y], [r0x, r0y, r1x, r0y]];
      const sunStart = M(108, 108);
      const sunEnd = sunOnArch(stateFor(parseAt(location.search) ?? nowHour()).clockT, g);
      const sunScale = (20 * s) / (desktop ? 22 : 11);

      const markParts = Array.from(markG.querySelectorAll<SVGPathElement>(".mark-part"));
      const sunMarkParts = Array.from(markG.querySelectorAll<SVGPathElement>(".mark-sun-part"));
      const setArch = (a: typeof m) => archEl.setAttribute("d", archPath(a.x0, a.x1, a.spring, a.base));
      const setLine = (i: number, l: number[]) => lineEls[i]?.setAttribute("d", `M${l[0].toFixed(1)} ${l[1].toFixed(1)}L${l[2].toFixed(1)} ${l[3].toFixed(1)}`);

      setArch(m);
      startLines.forEach((l, i) => setLine(i, l));
      gsap.set(markG, { opacity: 1 });
      gsap.set(sunG, { opacity: 0 });
      gsap.set(lineEls.slice(3), { opacity: 0 });
      gsap.set(panes, { opacity: 0 });
      gsap.set(track, { opacity: 0 });
      gsap.set([archEl, ...lineEls.slice(0, 3), ...markParts, ...sunMarkParts], { drawSVG: "0%" });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set([archEl, ...lineEls, ...markParts, ...sunMarkParts], { clearProps: "strokeDasharray,strokeDashoffset" });
          el.removeAttribute("data-arriving");
          el.setAttribute("data-done", "");
          events.forEach((ev) => window.removeEventListener(ev, onSkip));
        },
      });
      // 1. the mark draws itself: arch, dividers, sun, steam, plant, house (0 to 1.15 s)
      tl.to(archEl, { drawSVG: "100%", duration: 0.5 }, 0);
      tl.to(lineEls.slice(0, 3), { drawSVG: "100%", duration: 0.3, stagger: 0.07 }, 0.28);
      tl.to(sunMarkParts, { drawSVG: "100%", duration: 0.28, stagger: 0.02 }, 0.45);
      tl.to(markParts, { drawSVG: "100%", duration: 0.4, stagger: 0.018 }, 0.55);
      // 2. the arch widens to the house, the dividers become the rooms (1.2 to 1.95 s)
      const arch = { ...m };
      const lines = startLines.map((l) => [...l]);
      const proxy = { t: 0 };
      tl.to(proxy, {
        t: 1, duration: 0.75,
        onUpdate: () => {
          const t = proxy.t;
          const k = (a: number, b: number) => a + (b - a) * t;
          arch.x0 = k(m.x0, g.x0); arch.x1 = k(m.x1, g.x1); arch.spring = k(m.spring, g.spring); arch.base = k(m.base, g.base);
          setArch(arch);
          startLines.forEach((l, i) => { lines[i] = l.map((v, j) => k(v, g.lines[i][j])); setLine(i, lines[i]); });
        },
      }, 1.2);
      tl.to(markParts, { opacity: 0, duration: 0.3, ease: "power1.out" }, 1.2);
      tl.fromTo(sunMarkParts, { opacity: 1 }, { opacity: 0, duration: 0.2 }, 1.55);
      tl.fromTo(sunG, { opacity: 0, x: sunStart[0], y: sunStart[1], scale: sunScale, svgOrigin: "0 0" }, { opacity: 1, x: sunEnd.cx, y: sunEnd.cy, scale: 1, duration: 0.75 }, 1.2);
      tl.to(lineEls.slice(3), { opacity: 1, duration: 0.3 }, 1.7);
      tl.to(track, { opacity: 1, duration: 0.4 }, 1.8);
      // 3. the rooms appear, one pane after another (1.75 to 2.35 s)
      tl.to(panes, { opacity: 1, duration: 0.45, stagger: 0.03, ease: "power1.out" }, 1.75);
      void sunParts;

      skip = () => { tl.progress(1); };
      events.forEach((ev) => window.addEventListener(ev, onSkip, { passive: true, once: true }));
    });
    return () => {
      killed = true;
      events.forEach((ev) => window.removeEventListener(ev, onSkip));
      el.removeAttribute("data-arriving");
      el.setAttribute("data-done", "");
    };
    // the arrival runs once per hard load; the clock only places the sun
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={root} className="house-wrap">
      <Variant g={MOBILE} variant="m" clockT={clockT} night={night} />
      <Variant g={DESKTOP} variant="d" clockT={clockT} night={night} />
    </div>
  );
}
