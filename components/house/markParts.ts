import { SUN_CENTER, SUN_RADIUS, SUN_RAYS } from "@/lib/mark";
import { circle } from "@/lib/draw/primitives";

export const MARK_SUN = circle([SUN_CENTER.x, SUN_CENTER.y], SUN_RADIUS).d;
export const MARK_RAYS = SUN_RAYS;
