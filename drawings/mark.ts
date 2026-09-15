import { DIVIDER_PATHS, DROPS, HOUSE_PATHS, PLANT_PATHS, STEAM_PATHS, SUN_CENTER, SUN_RADIUS, SUN_RAYS, WINDOW_PATHS, ARCH_PATH } from "@/lib/mark";
import { circle } from "@/lib/draw/primitives";
import type { Drawing, Stroke } from "@/lib/draw/types";

/** The brand mark as a drawing, in the order an architect would draw it: arch, dividers, sun, steam, plant, house. */
export function markDrawing(): Drawing {
  const strokes: Stroke[] = [
    { d: ARCH_PATH, layer: "structure", id: "mark-arch" },
    ...DIVIDER_PATHS.map((d, i) => ({ d, layer: "structure" as const, id: `mark-divider-${i}` })),
    ...WINDOW_PATHS.map((d) => ({ d, layer: "detail" as const })),
    { ...circle([SUN_CENTER.x, SUN_CENTER.y], SUN_RADIUS, "detail"), id: "mark-sun" },
    ...SUN_RAYS.map((d) => ({ d, layer: "detail" as const })),
    ...STEAM_PATHS.map((d, i) => ({ d, layer: "life" as const, id: `mark-steam-${i}` })),
    ...PLANT_PATHS.map((d) => ({ d, layer: "life" as const })),
    ...DROPS.map((p) => circle([p.x, p.y], p.r, "life")),
    ...HOUSE_PATHS.map((d) => ({ d, layer: "structure" as const })),
  ];
  return { id: "mark", title: "The Barnyard Co. mark", width: 320, height: 320, strokes };
}
