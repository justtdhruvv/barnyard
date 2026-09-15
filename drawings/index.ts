import type { Drawing } from "@/lib/draw/types";
import { alleySignDrawing } from "./alley-sign";
import { courtyardDrawing } from "./courtyard";
import { entryDrawing } from "./entry";
import { facadeDrawing } from "./facade";
import { gamesDrawing } from "./games";
import { mainFloorDrawing } from "./main-floor";
import { markDrawing } from "./mark";
import { mezzanineStairDrawing } from "./mezzanine-stair";

export const DRAWINGS: Record<string, () => Drawing> = {
  mark: markDrawing,
  facade: facadeDrawing,
  entry: entryDrawing,
  "main-floor": mainFloorDrawing,
  "mezzanine-stair": mezzanineStairDrawing,
  courtyard: courtyardDrawing,
  games: gamesDrawing,
  "alley-sign": alleySignDrawing,
};

const cache = new Map<string, Drawing>();

export function drawingFor(id: string): Drawing {
  const make = DRAWINGS[id];
  if (!make) throw new Error(`No drawing module for "${id}"`);
  if (process.env.NODE_ENV === "production") {
    const hit = cache.get(id);
    if (hit) return hit;
    const d = make();
    cache.set(id, d);
    return d;
  }
  return make();
}
