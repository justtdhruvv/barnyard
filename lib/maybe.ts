import { DRAWINGS, drawingFor } from "@/drawings";
import type { Drawing } from "@/lib/draw/types";

/** The drawing when its module is registered, otherwise null so a page never breaks on a missing drawing. */
export function maybeDrawing(id: string): Drawing | null {
  return DRAWINGS[id] ? drawingFor(id) : null;
}
