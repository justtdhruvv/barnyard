// Generates five 512x512 material tiles (corten, concrete, brick, steel, pallet wood) from seeded noise and SVG.
// Run once: node scripts/build-materials.mjs
import fs from "node:fs";
import sharp from "sharp";

const OUT = "public/materials";
fs.mkdirSync(OUT, { recursive: true });
const S = 512;

function noise(scale = 1, seed = 1) {
  const buf = Buffer.alloc(S * S);
  let x = seed * 9301 + 49297;
  for (let i = 0; i < buf.length; i++) {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    buf[i] = Math.max(0, Math.min(255, Math.round(128 + ((x % 256) - 128) * scale)));
  }
  return sharp(buf, { raw: { width: S, height: S, channels: 1 } });
}

async function tint(base, rgb, opts = {}) {
  const grey = await base.blur(opts.blur ?? 0.6).png().toBuffer();
  return sharp(grey).tint(rgb).modulate({ brightness: opts.bright ?? 1, saturation: opts.sat ?? 1 });
}

const svg = (body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">${body}</svg>`);
const brickSvg = svg(
  Array.from({ length: 16 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) => {
      const off = r % 2 ? 43 : 0;
      return `<rect x="${c * 86 + off - 86}" y="${r * 32 + 2}" width="82" height="28" rx="1" fill="#000" opacity="0.16"/>`;
    }).join(""),
  ).join(""),
);
const woodSvg = svg(
  Array.from({ length: 12 }, (_, i) => `<rect x="0" y="${i * 43}" width="512" height="41" fill="#000" opacity="${(i % 3) * 0.06 + 0.04}"/>`).join(""),
);
const steelSvg = svg(Array.from({ length: 64 }, (_, i) => `<rect x="${i * 8}" y="0" width="1" height="512" fill="#fff" opacity="0.05"/>`).join(""));

async function out(name, img) {
  await img.webp({ quality: 70 }).toFile(`${OUT}/${name}.webp`);
  console.log(name, fs.statSync(`${OUT}/${name}.webp`).size, "B");
}

await out("corten", await tint(noise(0.9, 3), "#8e4b2a", { blur: 2.2, sat: 1.2 }));
await out("concrete", await tint(noise(0.35, 7), "#cfcac1", { blur: 0.8 }));
await out("brick", (await tint(noise(0.5, 11), "#6a4032", { blur: 1.4 })).composite([{ input: brickSvg }]));
await out("steel", (await tint(noise(0.25, 5), "#2b2622", { blur: 0.5 })).composite([{ input: steelSvg }]));
await out("wood", (await tint(noise(0.6, 13), "#8a6a44", { blur: 1.8 })).composite([{ input: woodSvg }]));
