import data from "@/content/drawings.json";

export interface DrawingMeta { id: string; title: string; source: string | null; crop: [number, number, number, number] | null; ignore: [number, number, number, number][]; credit: string | null; routes: string[]; strokeBudget: number; lift: boolean }

export const drawingsMeta: DrawingMeta[] = (data as unknown as { drawings: DrawingMeta[] }).drawings;

export function metaFor(id: string): DrawingMeta {
  const m = drawingsMeta.find((d) => d.id === id);
  if (!m) throw new Error(`No drawing "${id}" in content/drawings.json`);
  return m;
}

/** The drawing's frame: its crop in the 1080-wide frame of the whole source. */
export function frameOf(id: string): { x: number; y: number; width: number; height: number } {
  const [x0, y0, x1, y1] = metaFor(id).crop ?? [0, 0, 1080, 1350];
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}
