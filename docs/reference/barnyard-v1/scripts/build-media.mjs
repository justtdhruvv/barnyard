/**
 * Builds public/media from the Instagram-derived source stills and reels.
 *
 * Sources live outside the repo (they are the café's own Instagram material,
 * downloaded once). Set MEDIA_SRC to the folder that holds stills/, raw/ and
 * reels/. Every output file is named after its slot id in content/media.json,
 * so <Frame> picks it up with no code change.
 *
 *   node scripts/build-media.mjs            # stills only
 *   node scripts/build-media.mjs --video    # also encode the loops and the walk
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const SRC = process.env.MEDIA_SRC || "C:/Users/Dhruvv/AppData/Local/Temp/claude/d--barnyard/a00266ba-732f-4984-9a2d-57cbe2eba773/scratchpad/ig";
const OUT = path.join(process.cwd(), "public", "media");
const FFMPEG =
  process.env.FFMPEG ||
  "C:/Users/Dhruvv/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffmpeg.exe";
const WANT_VIDEO = process.argv.includes("--video");
const WANT_WALK = process.argv.includes("--walk") || WANT_VIDEO;

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, "video"), { recursive: true });
fs.mkdirSync(path.join(OUT, "walk"), { recursive: true });

const still = (n) => path.join(SRC, "stills", `${n}.jpg`);
const raw = (n) => path.join(SRC, "raw", `${n}.jpg`);
const reel = (n) => path.join(SRC, "reels", `${n}.mp4`);

/**
 * One output per entry: crop {left, top, width, height} from the source, then
 * resize to fit within maxW keeping the crop's aspect. Aspects are chosen here
 * to match content/media.json; the crops avoid every baked-in caption.
 */
const STILLS = [
  // home
  { out: "home-hero", src: raw("ad-1"), crop: { left: 250, top: 60, width: 830, height: 437 }, maxW: 1600 },
  { out: "home-hero.mobile", src: still("skylight-tables"), crop: { left: 0, top: 60, width: 720, height: 900 }, maxW: 900 },
  // facade and rooms
  { out: "facade-corten", src: still("sign-corten"), crop: { left: 0, top: 0, width: 800, height: 1000 }, maxW: 1000 },
  { out: "entry-ceiling", src: still("entry-ceiling"), crop: { left: 0, top: 60, width: 720, height: 480 }, maxW: 1400 },
  { out: "entry-ceiling.mobile", src: still("entry-ceiling"), crop: { left: 0, top: 0, width: 720, height: 900 }, maxW: 900 },
  { out: "main-floor-wide", src: raw("ad-1"), crop: { left: 250, top: 125, width: 830, height: 356 }, maxW: 1800 },
  { out: "main-floor-wide.mobile", src: still("main-floor-curtains"), crop: { left: 0, top: 100, width: 720, height: 900 }, maxW: 900 },
  { out: "main-floor-glazing", src: raw("elle-2"), crop: { left: 395, top: 0, width: 640, height: 800 }, maxW: 1000 },
  { out: "mezzanine-overlook", src: raw("ad-2"), crop: { left: 72, top: 52, width: 654, height: 818 }, maxW: 1000 },
  { out: "mezzanine-tables", src: still("night-city-window"), crop: { left: 0, top: 500, width: 1080, height: 720 }, maxW: 1400 },
  { out: "mezzanine-tables.mobile", src: still("night-city-window"), crop: { left: 0, top: 150, width: 1080, height: 1350 }, maxW: 900 },
  { out: "courtyard", src: still("courtyard-vines"), crop: { left: 0, top: 300, width: 720, height: 480 }, maxW: 1400 },
  { out: "courtyard.mobile", src: still("courtyard-vines"), crop: { left: 0, top: 100, width: 720, height: 900 }, maxW: 900 },
  { out: "late-laptop", src: still("late-laptop-plants"), crop: { left: 0, top: 400, width: 1080, height: 720 }, maxW: 1400 },
  { out: "late-laptop.mobile", src: still("late-laptop-plants"), crop: { left: 3, top: 0, width: 1075, height: 1344 }, maxW: 900 },
  { out: "ship-lamp", src: still("brick-lamp"), crop: { left: 0, top: 250, width: 720, height: 900 }, maxW: 1000 },
  { out: "ship-lamp.mobile", src: still("brick-lamp"), crop: { left: 0, top: 350, width: 720, height: 720 }, maxW: 900 },
  // host
  { out: "host-hero", src: still("stairday-2.30"), crop: { left: 0, top: 0, width: 1080, height: 720 }, maxW: 1600 },
  { out: "host-hero.mobile", src: still("stairday-2.30"), crop: { left: 160, top: 0, width: 760, height: 950 }, maxW: 900 },
  { out: "host-coffee-garba", src: still("host-garba-crowd"), crop: { left: 90, top: 500, width: 900, height: 600 }, maxW: 1400 },
  { out: "host-coffee-garba.mobile", src: still("host-garba-crowd"), crop: { left: 90, top: 300, width: 900, height: 1125 }, maxW: 900 },
  { out: "host-hoodie-workshop", src: still("host-hoodie-wearing"), crop: { left: 0, top: 150, width: 1080, height: 720 }, maxW: 1400 },
  { out: "host-hoodie-workshop.mobile", src: still("host-hoodie-wearing"), crop: { left: 0, top: 0, width: 1080, height: 1350 }, maxW: 900 },
  // shoot
  { out: "shoot-hero", src: raw("cnt-1"), crop: { left: 0, top: 110, width: 1080, height: 460 }, maxW: 1800 },
  { out: "shoot-hero.mobile", src: still("shoot-nocatch-table"), crop: { left: 0, top: 300, width: 1080, height: 1350 }, maxW: 900 },
  { out: "shoot-nocatch", src: still("shoot-nocatch-table"), crop: { left: 0, top: 500, width: 1080, height: 608 }, maxW: 1600 },
  { out: "shoot-nocatch.mobile", src: still("shoot-nocatch-counter"), crop: { left: 0, top: 300, width: 1080, height: 1350 }, maxW: 900 },
  // bowl
  { out: "bowl-hero", src: still("bowl-sign"), crop: { left: 0, top: 60, width: 1080, height: 608 }, maxW: 1600 },
  { out: "bowl-hero.mobile", src: still("bowl-sign"), crop: { left: 150, top: 30, width: 760, height: 950 }, maxW: 900 },
  { out: "bowl-detail", src: still("bowl-sign"), crop: { left: 440, top: 60, width: 640, height: 800 }, maxW: 1000 },
  // menu
  { out: "menu-curriza", src: still("menu-pizza-board"), crop: { left: 0, top: 200, width: 1080, height: 1350 }, maxW: 1000 },
  { out: "menu-curriza.mobile", src: still("menu-pizza-board"), crop: { left: 0, top: 350, width: 1080, height: 1080 }, maxW: 900 },
  { out: "menu-coffee", src: still("night-pour"), crop: { left: 0, top: 300, width: 1080, height: 1080 }, maxW: 1000 },
  { out: "menu-brunch", src: still("night-spread"), crop: { left: 0, top: 500, width: 1080, height: 720 }, maxW: 1400 },
  { out: "menu-brunch.mobile", src: still("night-spread"), crop: { left: 0, top: 150, width: 1080, height: 1350 }, maxW: 900 },
  // visit and press
  { out: "visit-exterior-night", src: still("exterior-night-b"), crop: { left: 0, top: 100, width: 1080, height: 720 }, maxW: 1400 },
  { out: "visit-exterior-night.mobile", src: still("exterior-night-b"), crop: { left: 190, top: 0, width: 700, height: 875 }, maxW: 900 },
  { out: "press-hero", src: raw("cnt-2"), crop: { left: 0, top: 208, width: 765, height: 510 }, maxW: 1400 },
  { out: "press-hero.mobile", src: raw("ad-2"), crop: { left: 72, top: 52, width: 654, height: 818 }, maxW: 900 },
];

async function buildStills() {
  for (const it of STILLS) {
    if (!fs.existsSync(it.src)) {
      console.warn(`skip ${it.out}: missing ${it.src}`);
      continue;
    }
    const meta = await sharp(it.src).metadata();
    const c = { ...it.crop };
    c.width = Math.min(c.width, meta.width - c.left);
    c.height = Math.min(c.height, meta.height - c.top);
    const w = Math.min(it.maxW, c.width);
    await sharp(it.src)
      .extract(c)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(path.join(OUT, `${it.out}.jpg`));
    console.log(`${it.out}.jpg  ${w}x${Math.round((w * c.height) / c.width)}`);
  }
}

function ff(args) {
  execFileSync(FFMPEG, ["-v", "error", "-y", ...args], { stdio: "inherit" });
}

/** Loops: portrait 4:5 at 720x900, muted, short, with a poster. */
const LOOPS = [
  { out: "hero-day", src: reel("soothe"), ss: 24.6, t: 4.8, vf: "crop=720:900:0:120,scale=720:900" },
  { out: "hero-night", src: reel("softer"), ss: 0.0, t: 4.2, vf: "crop=1080:1350:0:300,scale=720:900" },
  { out: "late", src: reel("worklate"), ss: 2.4, t: 5.0, vf: "crop=1080:1344:0:576,scale=720:900" },
];

function buildLoops() {
  for (const l of LOOPS) {
    const base = path.join(OUT, "video", l.out);
    ff(["-ss", String(l.ss), "-t", String(l.t), "-i", l.src, "-an", "-vf", l.vf, "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${base}.mp4`]);
    ff(["-ss", String(l.ss), "-t", String(l.t), "-i", l.src, "-an", "-vf", l.vf, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", `${base}.webm`]);
    ff(["-ss", String(l.ss), "-i", l.src, "-frames:v", "1", "-vf", l.vf, "-q:v", "3", `${base}.jpg`]);
    console.log(`${l.out}: ${fs.statSync(`${base}.mp4`).size} B mp4, ${fs.statSync(`${base}.webm`).size} B webm`);
  }
}

/** The walk: 36 frames of the daylight walk-in at 540x675, scrubbed by scroll. About 35 KB a frame. */
function buildWalk() {
  const src = reel("soothe");
  fs.readdirSync(path.join(OUT, "walk")).forEach((f) => fs.unlinkSync(path.join(OUT, "walk", f)));
  ff(["-ss", "0.8", "-t", "3.0", "-i", src, "-vf", "fps=12,crop=720:900:0:120,scale=540:675", "-q:v", "2", path.join(OUT, "walk", "tmp-%03d.jpg")]);
  const files = fs.readdirSync(path.join(OUT, "walk")).filter((f) => f.startsWith("tmp-")).sort();
  return Promise.all(
    files.map(async (f, i) => {
      const p = path.join(OUT, "walk", f);
      await sharp(p).webp({ quality: 55, effort: 5 }).toFile(path.join(OUT, "walk", `f${String(i).padStart(3, "0")}.webp`));
      fs.unlinkSync(p);
    }),
  ).then(() => console.log(`walk: ${files.length} frames`));
}

if (!process.argv.includes("--walk")) await buildStills();
if (WANT_VIDEO) buildLoops();
if (WANT_WALK) await buildWalk();
