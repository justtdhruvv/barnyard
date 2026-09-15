"use client";

import { useRef, useState } from "react";
import { Drawing, type DrawMode } from "./Drawing";
import type { Photo } from "./Sheet";
import type { Drawing as DrawingData } from "@/lib/draw/types";
import "./wipe.css";

interface Props { drawing: DrawingData; photo: Photo; credit: string | null; mode?: DrawMode }

/** The photograph on the left of the handle, the drawing on the right. Drag, tap, or use the arrow keys. */
export function Wipe({ drawing, photo, credit, mode = "view" }: Props) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; active: boolean } | null>(null);

  const at = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  const down = (e: React.PointerEvent) => {
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, active: e.pointerType === "mouse" };
    if (e.pointerType === "mouse") { box.current?.setPointerCapture(e.pointerId); at(e.clientX); }
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.active) {
      const dx = Math.abs(e.clientX - d.x), dy = Math.abs(e.clientY - d.y);
      if (dx > 6 && dx > dy) { d.active = true; box.current?.setPointerCapture(e.pointerId); }
      else if (dy > 8) { drag.current = null; return; }
    }
    if (d.active) at(e.clientX);
  };
  const up = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d && !d.active && e.type === "pointerup") at(e.clientX);
    drag.current = null;
  };
  const key = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setPos((p) => Math.max(0, p - step)); }
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setPos((p) => Math.min(100, p + step)); }
    else if (e.key === "Home") { e.preventDefault(); setPos(0); }
    else if (e.key === "End") { e.preventDefault(); setPos(100); }
  };

  return (
    <figure className="wipe">
      <div
        ref={box}
        className="wipe-box"
        style={{ aspectRatio: `${drawing.width} / ${drawing.height}`, ["--pos" as string]: `${pos}%` }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wipe-photo" src={photo.src} width={photo.width} height={photo.height} alt={`The photograph the drawing was made from: ${drawing.title}`} loading="lazy" draggable={false} />
        <div className="wipe-drawing"><Drawing drawing={drawing} mode={mode} /></div>
        <div
          className="wipe-handle"
          role="slider"
          tabIndex={0}
          aria-label="Photograph on the left, drawing on the right"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% photograph`}
          onKeyDown={key}
        >
          <span className="wipe-knob" aria-hidden="true">
            <svg viewBox="0 0 24 12" width="24" height="12"><path d="M8 1L3 6L8 11M16 1L21 6L16 11" /></svg>
          </span>
        </div>
      </div>
      <figcaption className="t-label wipe-caption">
        <span>Drag the line: the photograph on the left, the drawing on the right.</span>
        {credit ? <span className="wipe-credit">{credit}</span> : null}
      </figcaption>
    </figure>
  );
}
