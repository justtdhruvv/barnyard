// Extracts the photographic crop behind each "lift" drawing.
//
// Reads content/drawings.json. For every drawing with lift: true and a
// source, crops the matching source photo (under D:/barnyard-source/ig) to
// exactly the rectangle the drawing's viewBox uses — measured in the
// 1080-wide frame of the whole source image — and writes the result to
// public/photos/<id>.jpg. Writes content/photos.json describing each output.
//
// Never upscales. If a crop's bottom (or right) falls past the source
// image's actual bounds, the extraction is clamped and a warning is printed
// naming the drawing id and the real crop rectangle (in the 1080 frame).

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PROJECT_ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_ROOT = "D:/barnyard-source/ig";
const DRAWINGS_PATH = path.join(PROJECT_ROOT, "content", "drawings.json");
const PHOTOS_JSON_PATH = path.join(PROJECT_ROOT, "content", "photos.json");
const PHOTOS_DIR = path.join(PROJECT_ROOT, "public", "photos");
const FRAME_WIDTH = 1080;
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 80;

function round(n) {
  return Math.round(n);
}

async function main() {
  const raw = await readFile(DRAWINGS_PATH, "utf8");
  const { drawings } = JSON.parse(raw);

  await mkdir(PHOTOS_DIR, { recursive: true });

  const photos = {};
  const results = [];
  const warnings = [];

  for (const drawing of drawings) {
    if (!drawing.lift || !drawing.source) continue;

    const { id, source, crop } = drawing;
    const sourcePath = path.join(SOURCE_ROOT, source);

    const image = sharp(sourcePath);
    const metadata = await image.metadata();
    const sourceWidth = metadata.width;
    const sourceHeight = metadata.height;

    const scale = sourceWidth / FRAME_WIDTH;
    const [x0, y0, x1, y1] = crop;

    const left = round(x0 * scale);
    const top = round(y0 * scale);
    const rawWidth = round((x1 - x0) * scale);
    const rawHeight = round((y1 - y0) * scale);

    const clampedLeft = Math.min(Math.max(left, 0), sourceWidth);
    const clampedTop = Math.min(Math.max(top, 0), sourceHeight);
    const maxWidth = sourceWidth - clampedLeft;
    const maxHeight = sourceHeight - clampedTop;

    const extractWidth = Math.min(rawWidth, maxWidth);
    const extractHeight = Math.min(rawHeight, maxHeight);

    const wasClamped = extractWidth !== rawWidth || extractHeight !== rawHeight;
    if (wasClamped) {
      const realX1 = x0 + extractWidth / scale;
      const realY1 = y0 + extractHeight / scale;
      const message = `warning: "${id}" crop clamped to source bounds — real crop in the 1080 frame is [${x0}, ${y0}, ${round(realX1)}, ${round(realY1)}] (requested [${x0}, ${y0}, ${x1}, ${y1}])`;
      warnings.push(message);
      console.warn(message);
    }

    let pipeline = image.extract({
      left: clampedLeft,
      top: clampedTop,
      width: extractWidth,
      height: extractHeight,
    });

    const sourceWidthBeforeResize = extractWidth;
    let outputWidth = extractWidth;
    let outputHeight = extractHeight;

    if (extractWidth > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH });
      outputWidth = MAX_WIDTH;
      outputHeight = round((extractHeight * MAX_WIDTH) / extractWidth);
    }

    const outputPath = path.join(PHOTOS_DIR, `${id}.jpg`);
    const info = await pipeline
      .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
      .toFile(outputPath);

    photos[id] = {
      src: `/photos/${id}.jpg`,
      width: info.width,
      height: info.height,
      sourceWidth: sourceWidthBeforeResize,
    };

    results.push({ id, width: info.width, height: info.height });
  }

  await writeFile(PHOTOS_JSON_PATH, JSON.stringify(photos, null, 2) + "\n", "utf8");

  for (const { id, width, height } of results) {
    console.log(`${id}: ${width}x${height}`);
  }

  if (warnings.length > 0) {
    console.log("\nWarnings:");
    for (const w of warnings) console.log(`  ${w}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
