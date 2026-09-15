import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Fonts for ImageResponse, read from disk on the Node runtime. Two static
 * instances (Bricolage 82 KB, Rasa 246 KB) keep every card far under the 500 KB
 * bundle limit. Satori needs at least one font, so this never returns empty.
 */
let cache: Promise<{ name: string; data: ArrayBuffer; weight: 300 | 400; style: "normal" }[]> | null = null;

export function ogFonts() {
  if (!cache) {
    cache = (async () => {
      const dir = join(process.cwd(), "assets", "fonts");
      const [display, body] = await Promise.all([
        readFile(join(dir, "bricolage-300.ttf")),
        readFile(join(dir, "rasa-400.ttf")),
      ]);
      const toArrayBuffer = (b: Buffer) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
      return [
        { name: "Bricolage Grotesque", data: toArrayBuffer(display), weight: 300 as const, style: "normal" as const },
        { name: "Rasa", data: toArrayBuffer(body), weight: 400 as const, style: "normal" as const },
      ];
    })();
  }
  return cache;
}
