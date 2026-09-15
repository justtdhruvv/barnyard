"use client";

import { useEffect, useId, useRef } from "react";
import { LAYER_ORDER, type Drawing as DrawingData } from "@/lib/draw/types";
import { loadGsap, motionAllowed } from "@/lib/motion/gsap";

export type DrawMode = "static" | "draw" | "scrub" | "view";

interface Props { drawing: DrawingData; mode?: DrawMode; title?: string; className?: string; onDrawn?: () => void; decorative?: boolean }

/**
 * One drawing as inline SVG. `draw` draws once on mount, `view` draws once when it scrolls into view,
 * `scrub` ties the drawing to scroll. Reduced motion or `static`: complete at rest, GSAP never loads.
 */
export function Drawing({ drawing, mode = "static", title, className, onDrawn, decorative }: Props) {
  const root = useRef<SVGSVGElement>(null);
  const done = useRef(onDrawn);
  done.current = onDrawn;
  const rawId = useId();
  const titleId = rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    const svg = root.current;
    if (!svg || mode === "static") return;
    if (!motionAllowed()) { svg.removeAttribute("data-pending"); return; }
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const run = () => loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const layers = LAYER_ORDER.map((l) => Array.from(svg.querySelectorAll<SVGPathElement>(`.layer-${l} path.ln`))).filter((a) => a.length);
      const all = layers.flat();
      const each = Math.min(0.03, 1.4 / Math.max(1, all.length));
      gsap.set(all, { drawSVG: "0%" });
      svg.removeAttribute("data-pending");
      const finish = () => { svg.setAttribute("data-drawn", ""); done.current?.(); };
      const tl = gsap.timeline({
        paused: mode === "scrub",
        onComplete: mode !== "scrub" ? () => { gsap.set(all, { clearProps: "strokeDasharray,strokeDashoffset" }); finish(); } : undefined,
      });
      layers.forEach((paths, i) => {
        tl.to(paths, { drawSVG: "100%", duration: i === 0 ? 1.1 : 0.8, stagger: { each, from: "start" } }, i === 0 ? 0 : ">-0.45");
      });
      if (mode === "scrub") {
        let reached = false;
        const st = ScrollTrigger.create({
          trigger: svg, start: "top 85%", end: "center 50%", scrub: 0.6, animation: tl,
          onUpdate: (self) => { if (!reached && self.progress > 0.999) { reached = true; finish(); } },
        });
        cleanup = () => { st.kill(); tl.kill(); };
      } else {
        cleanup = () => tl.kill();
      }
    });
    if (mode === "view") {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); run(); }
      }, { rootMargin: "0px 0px -15% 0px" });
      io.observe(svg);
      return () => { cancelled = true; io.disconnect(); cleanup?.(); };
    }
    run();
    return () => { cancelled = true; cleanup?.(); };
  }, [mode, drawing.id]);

  // the cue ball rolls along the felt when the drawing is tapped
  useEffect(() => {
    const svg = root.current;
    const roll = drawing.roll;
    if (!svg || !roll) return;
    const ball = svg.querySelector<SVGPathElement>(`path[data-id="${roll.ball}"]`);
    if (!ball) return;
    const guide = document.createElementNS("http://www.w3.org/2000/svg", "path");
    guide.setAttribute("d", roll.path);
    guide.setAttribute("visibility", "hidden");
    guide.setAttribute("class", "roll-guide");
    svg.appendChild(guide);
    let raf = 0, rolling = false, timer = 0;
    const onClick = () => {
      if (rolling || !motionAllowed()) return;
      rolling = true;
      const len = guide.getTotalLength();
      const start = guide.getPointAtLength(0);
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 1400);
        const e = 1 - Math.pow(1 - k, 3);
        const p = guide.getPointAtLength(e * len);
        ball.setAttribute("transform", `translate(${(p.x - start.x).toFixed(1)} ${(p.y - start.y).toFixed(1)})`);
        if (k < 1) { raf = requestAnimationFrame(step); return; }
        timer = window.setTimeout(() => {
          ball.style.transition = "opacity 300ms";
          ball.style.opacity = "0";
          timer = window.setTimeout(() => { ball.removeAttribute("transform"); ball.style.opacity = "1"; rolling = false; }, 320);
        }, 1200);
      };
      raf = requestAnimationFrame(step);
    };
    svg.addEventListener("click", onClick);
    svg.style.cursor = "pointer";
    return () => { svg.removeEventListener("click", onClick); cancelAnimationFrame(raf); window.clearTimeout(timer); guide.remove(); };
  }, [drawing]);

  return (
    <svg
      ref={root}
      className={`drawing${className ? ` ${className}` : ""}`}
      viewBox={`${drawing.x ?? 0} ${drawing.y ?? 0} ${drawing.width} ${drawing.height}`}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-labelledby={decorative ? undefined : titleId}
      data-pending={mode === "static" ? undefined : ""}
      preserveAspectRatio="xMidYMid meet"
    >
      {decorative ? null : <title id={titleId}>{title ?? drawing.title}</title>}
      {drawing.glows?.length ? (
        <g aria-hidden="true">
          <defs>
            <radialGradient id={`${titleId}-glow`}>
              <stop offset="0" stopColor="#e7a64f" stopOpacity="0.55" />
              <stop offset="1" stopColor="#e7a64f" stopOpacity="0" />
            </radialGradient>
          </defs>
          {drawing.glows.map((g, i) => <circle key={i} className="glow" cx={g.x} cy={g.y} r={g.r} fill={`url(#${titleId}-glow)`} />)}
        </g>
      ) : null}
      {LAYER_ORDER.map((layer) => {
        const strokes = drawing.strokes.filter((s) => s.layer === layer);
        return strokes.length ? (
          <g key={layer} className={`layer-${layer}`}>
            {strokes.map((s, i) => <path key={i} className="ln" d={s.d} data-id={s.id} />)}
          </g>
        ) : null;
      })}
    </svg>
  );
}
