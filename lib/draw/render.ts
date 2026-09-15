import { LAYER_ORDER, type Drawing } from "./types";

/** Stroke width in drawing units that shows as `cssStroke` px when the drawing is `cssWidth` px wide. */
export function strokeWidthFor(drawingWidth: number, cssWidth: number, cssStroke: number): number {
  return (cssStroke * drawingWidth) / cssWidth;
}

export function toSvg(d: Drawing, o: { stroke?: number; color?: string; background?: string; photo?: { href: string; opacity: number } } = {}): string {
  const stroke = o.stroke ?? 1.5;
  const color = o.color ?? "#1F1C1A";
  const x = d.x ?? 0;
  const y = d.y ?? 0;
  const bg = o.background ? `<rect x="${x}" y="${y}" width="${d.width}" height="${d.height}" fill="${o.background}"/>` : "";
  const photo = o.photo ? `<image href="${o.photo.href}" x="${x}" y="${y}" width="${d.width}" height="${d.height}" opacity="${o.photo.opacity}" preserveAspectRatio="xMidYMid slice"/>` : "";
  const layers = LAYER_ORDER.map((layer) => {
    const paths = d.strokes.filter((s) => s.layer === layer).map((s) => `<path d="${s.d}"${s.id ? ` id="${s.id}"` : ""}/>`).join("");
    return paths ? `<g class="layer-${layer}">${paths}</g>` : "";
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${d.width} ${d.height}" width="${d.width}" height="${d.height}">${bg}${photo}<g fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${layers}</g></svg>`;
}
