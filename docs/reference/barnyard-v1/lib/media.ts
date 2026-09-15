import fs from "node:fs";
import path from "node:path";
import manifest from "@/content/media.json";

export type Priority = "hero" | "high" | "normal" | "low";

export interface MediaSlot {
  id: string;
  subject: string;
  alt: string;
  aspect: string;
  mobileAspect: string;
  priority: Priority;
  routes: string[];
  /** the photographer of the delivered file; set only once a real file is in place */
  credit?: string;
}

export interface ResolvedSlot extends MediaSlot {
  src?: string;
  mobileSrc?: string;
  ratio: number;
  mobileRatio: number;
}

const slots = manifest.slots as MediaSlot[];
const byId = new Map(slots.map((s) => [s.id, s]));

export function ratioOf(aspect: string): number {
  const [w, h] = aspect.split(":").map(Number);
  return w / h;
}

const MEDIA_DIR = path.join(process.cwd(), "public", "media");

function exists(file: string): boolean {
  try {
    return fs.existsSync(path.join(MEDIA_DIR, file));
  } catch {
    return false;
  }
}

/**
 * Resolves a slot at render time on the server. The file check happens here,
 * deterministically, so a missing photograph never reaches next/image.
 */
export function resolveSlot(id: string): ResolvedSlot {
  const slot = byId.get(id);
  if (!slot) {
    throw new Error(`Unknown media slot "${id}". Add it to content/media.json.`);
  }
  const desktop = ["jpg", "jpeg", "png", "webp", "avif"].map((ext) => `${id}.${ext}`).find(exists);
  const mobile = ["jpg", "jpeg", "png", "webp", "avif"].map((ext) => `${id}.mobile.${ext}`).find(exists);
  return {
    ...slot,
    src: desktop ? `/media/${desktop}` : undefined,
    mobileSrc: mobile ? `/media/${mobile}` : undefined,
    ratio: ratioOf(slot.aspect),
    mobileRatio: ratioOf(slot.mobileAspect),
  };
}

export function allSlots(): MediaSlot[] {
  return slots;
}
