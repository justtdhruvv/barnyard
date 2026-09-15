"use client";

import { useEffect, useRef, useState } from "react";
import { Drawing, type DrawMode } from "./Drawing";
import type { Drawing as DrawingData } from "@/lib/draw/types";
import "./sheet.css";

export interface Photo { src: string; width: number; height: number; sourceWidth?: number }

/** Never more than 1.25 times the photograph's own pixels on the device's pixels. */
export function honestScale(sourceWidth: number, cssWidth: number, dpr: number): number {
  return Math.min(1, (1.25 * sourceWidth) / (cssWidth * dpr));
}

interface Props { drawing: DrawingData; photo: Photo | null; credit: string | null; lift: boolean; mode?: DrawMode; className?: string; note?: string }

/** A drawing on tracing paper: hold it, or press the button, and the photograph it was drawn from shows through. */
export function Sheet({ drawing, photo, credit, lift, mode = "view", className, note }: Props) {
  const canLift = lift && !!photo;
  const [lifted, setLifted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const box = useRef<HTMLDivElement>(null);
  const hold = useRef<{ timer: number; x: number; y: number; holding: boolean } | null>(null);

  useEffect(() => {
    if (!lifted || !photo || !box.current) { setScale(1); return; }
    setLoaded(true);
    const w = box.current.clientWidth;
    setScale(honestScale(photo.width, w, window.devicePixelRatio || 1));
  }, [lifted, photo]);

  const down = (e: React.PointerEvent) => {
    if (!canLift || e.button !== 0) return;
    const timer = window.setTimeout(() => {
      if (hold.current) {
        hold.current.holding = true;
        setLifted(true);
        try { navigator.vibrate?.(10); } catch { /* not supported */ }
      }
    }, 350);
    hold.current = { timer, x: e.clientX, y: e.clientY, holding: false };
  };
  const move = (e: React.PointerEvent) => {
    const h = hold.current;
    if (h && !h.holding && Math.hypot(e.clientX - h.x, e.clientY - h.y) > 8) { window.clearTimeout(h.timer); hold.current = null; }
  };
  const up = () => {
    const h = hold.current;
    if (!h) return;
    window.clearTimeout(h.timer);
    if (h.holding) setLifted(false);
    hold.current = null;
  };

  return (
    <figure className={`sheet${lifted ? " is-lifted" : ""}${className ? ` ${className}` : ""}`}>
      <div
        ref={box}
        className="sheet-box"
        style={{ aspectRatio: `${drawing.width} / ${drawing.height}`, ["--lift-scale" as string]: scale }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
        onContextMenu={(e) => { if (canLift) e.preventDefault(); }}
      >
        {canLift ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="sheet-photo" src={loaded ? photo!.src : undefined} width={photo!.width} height={photo!.height} alt={lifted ? `The photograph: ${drawing.title}` : ""} draggable={false} />
        ) : null}
        <div className="sheet-drawing"><Drawing drawing={drawing} mode={mode} /></div>
      </div>
      <figcaption className="sheet-caption t-label">
        {canLift ? (
          <button type="button" className="sheet-toggle" aria-pressed={lifted} onClick={() => setLifted((v) => !v)}>
            {lifted ? "Show the drawing" : "Show the photograph"}
          </button>
        ) : null}
        <span className="sheet-credit">{lifted && credit ? credit : note ?? (canLift ? "Or press and hold the drawing." : "")}</span>
      </figcaption>
    </figure>
  );
}
