# The Barnyard Co. — "The drawn house" (design option three of three)

A pitch demo for The Barnyard Co., a 10,000 sq ft design-led café in Chandkheda, Ahmedabad. This folder builds one of three alternative designs the studio will show the owner. The whole site is drawn in the thin, precise, single-weight line of the café's own logo: the logo draws itself and opens into the house; every room is a line drawing constructed in code over the café's own photographs; life is drawn with the logo's glyphs (steam, sun, lamps, a rolling cue ball, the BOWL bulbs); holding a drawing lifts it like tracing paper to show the photograph beneath. The bar is a 9/10 from a critic who knows architecture, film, photography, illustration and interiors.

## Read before doing anything, in this order

1. `docs/BRIEF.md` — the client, the content rules, the sitemap (sections 4, 6, 7, 8 matter most)
2. `docs/craft-standard.md` — the studio lead's raised bar (type, motion, images, depth, detail floor, restraint)
3. `docs/spec.md` — this option's design spec
4. `docs/plan.md` — the implementation plan; execute it task by task
5. `docs/research/04-synthesis-and-direction.md` — what award-tier hospitality sites do (skim)

## Hard rules

- **Nothing invented.** Facts come only from `content/cafe.json`. `UNKNOWN` and `CONFIRM` values never render. No capacities, prices, lane counts, testimonials, floor plans or room adjacencies. Drawings show only what the café's own photographs and reels show, or objects `cafe.json` documents. If you need a fact you do not have, add it to `docs/OPEN-QUESTIONS.md` and design around its absence.
- **Every drawing is constructed in code over one of the café's own photographs** (or, where no photograph exists, from objects `cafe.json` documents), and records its source still and credit in `content/drawings.json`. Automatic traces are placement guides only and never ship: the spike (`docs/research/spikes/lineart.md`) showed they read as edge detection, not drawing. No faces, no crowds, no invented people. Photographs appear only at honest size (never beyond 1.25x source pixels on device pixels) and are credited by handle from `content/media.json`.
- **The line must look authored:** single weight, round caps and joins, true arcs and straight lines in the logo's grammar, no fragments, no scribble. A drawing that does not read at 390 px is simplified, not shrunk.
- **Mobile first.** Check every change at 390 px wide before desktop.
- **Reduced motion:** every drawing is present and complete at rest; no draw-on, no loops.
- No `localStorage` or `sessionStorage`. No backend. Enquiries compose a WhatsApp message to the café.
- Sentence case. No tracked all-caps labels, no arrows glued to links, no identical rounded cards, no cream or oatmeal paper ground, no terracotta, no farm or rustic illustration clichés (no roosters, wheat, gingham, rope, barns).
- Copy is in the café's register (`voice` in `content/cafe.json`): feel at home, slow down, stay a little longer. Never "Welcome to", "unforgettable", "journey", "experience", "whimsical".

## Where things are

- `content/cafe.json`, `content/media.json` — copied from option one (`D:\barnyard\content`). That repo is the source of truth for facts; if a fact changes there, copy it here.
- `D:\barnyard-source\ig\` — read-only Instagram sources: `stills/`, `raw/` (press carousel photos), `reels/` (mp4), `crops/`. Never edit this folder; generated files go in this repo.
- `D:\barnyard-source\spikes\lineart\` — the tracing spike; its scripts and models produce the guide layers (`scripts/b-onnx.mjs`, `scripts/c-sed.py`, `scripts/combine.mjs`, `scripts/vectorize.mjs`, `scripts/run.mjs`, models in `models/`, Python deps in `pydeps/`). Read its `REPORT.md` first.
- `D:\barnyard-source\spikes\drawn-stack\` — the verified GSAP, SVG and Next 15 stack spike; `REPORT.md` there (also in `docs/research/spikes/drawn-stack.md`).
- `D:\barnyard-source\processed-v1\` — option one's processed stills, useful for crops that avoid baked-in captions.
- `docs/reference/barnyard-v1/` — option one's code to port: `lib/daylight.ts` (clock-driven day and night), `lib/cafe.ts` (the `fact()` guard and helpers), `lib/mark.ts` (the traced logo geometry), `lib/media.ts`, `scripts/build-media.mjs` (caption-free crop coordinates), `scripts/check-content.mjs`.
- `assets/brand/` — the logo (320 px JPG) and its traced SVG. Its line is the reference for every drawing on the site.
- `docs/OPEN-QUESTIONS-v1.md` — everything option one needed and did not have.

## Machine and ports

- Windows 11, Node 25, npm. Git Bash and PowerShell both available. ffmpeg: `C:/Users/Dhruvv/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffmpeg.exe`. Python 3.14 with pip.
- Port 3000 serves an unrelated project. Option one uses 3001 and 3002. Option two uses 3011 and 3012. **This project: dev on 3021, production checks on 3022** (`npx next start -p 3022`). Stop the 3022 server before `npm run build`.
- Do not edit `D:\barnyard` or `D:\barnyard-arch`.

## How to work

- A demo cut was built on `main` on 15 Sep 2026 before the plan was executed. Read `docs/plan.md` section "Cross-task reconciliation" item 1 first, and work on a `plan/full` branch.

- Execute `docs/plan.md` with the superpowers:subagent-driven-development or superpowers:executing-plans skill. One commit per task; commit messages end with the co-author line the harness gives you.
- Use the motion-design, animate and delight skills where a task touches motion; frontend-design for layout and type.
- Look at your work: Playwright MCP screenshots at 390x844 and 1440x900, day (`?at=14:00`) and night (`?at=01:00`), for every drawing and page you change. Read the screenshots before calling anything done. Judge drawings at 100% zoom on the phone screenshot.
- Before claiming a task is complete, run its verification commands and report the real output (superpowers:verification-before-completion).
