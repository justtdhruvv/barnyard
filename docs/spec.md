# The Barnyard Co. — "The drawn house" (design spec)

Date: 15 Sep 2026. Status: direction chosen by the studio lead (option A of two second-design directions). This is design option three of three for the same client. Option one is the editorial light-system site at `D:\barnyard` (branch `redesign/mobile-cinema`); option two is the motion-heavy 3D walk at `D:\barnyard-arch`. The three must look and feel like three different studios made them.

Read first, in this order: `docs/BRIEF.md`, `docs/craft-standard.md`, this spec, then `docs/plan.md`. Evidence behind the decisions: `docs/research/spikes/lineart.md` (tracing photos to line) and `docs/research/spikes/drawn-stack.md` (GSAP, SVG performance, transitions, fonts).

---

## 1. The idea in one paragraph

The café's logo is already a drawing of a house: an arch divided into panes, a sun in a window, steam rising, a potted plant, a small house with an arched door, all in one thin, even line. This site is that drawing grown into the whole house. The logo draws itself when you arrive, then its arch widens to fill the screen and its panes become the rooms. Every room is drawn in the same line and constructed the way the logo is constructed: straight lines, true arcs, circles and repeated rhythms like ceiling strips, stair treads and window mullions. Life in the rooms is drawn with the logo's own glyphs: steam from a cup, the sun crossing the arch with the visitor's clock, lamps switching on after dark, a cue ball rolling, a paintbrush in a jar, the bulbs of the BOWL sign. Hold any drawing and the photograph it was drawn from appears underneath, like lifting a sheet of tracing paper. Every drawing is a translation of the café's own photographs, never an imagined café.

Why this belongs beside the other two: it does not depend on photography the café has not handed over; it is the lightest and fastest of the three on a phone; nobody could mistake it for the other options; and it is built from the one asset the café already owns outright, its mark.

## 2. What must be true (non-negotiable)

1. **Nothing invented.** Facts only from `content/cafe.json`; `UNKNOWN` and `CONFIRM` never render; no capacities, prices, lane counts, testimonials, floor plans or room adjacencies.
2. **Drawings show only what is real.** Each drawing is constructed from one of the café's own photographs (named in `content/drawings.json` with its source file and credit) or from an object `cafe.json` documents. No faces, no crowds, no invented people. Where a room has no photograph (the games corner), it is drawn as a still life of its documented objects, not as a room layout.
3. **The line looks authored.** Single weight, round caps and joins, no fragments, no scribble, no edge-detection texture. Automatic traces are placement guides only (section 3).
4. **Photographs at honest size.** When the tracing paper lifts, the photo is never shown larger than 1.25 times its source pixels on the device's physical pixels, and its credit shows.
5. **Mobile first.** Every drawing is judged at 390 px wide before desktop. A drawing that does not read on a phone is simplified, not shrunk.
6. **Reduced motion:** every drawing is complete at rest, nothing loops, transitions are short crossfades.
7. **The pane order is a story order, not a plan.** The house's panes never claim which room is next to which.

## 3. How the drawings are made

The spike (`docs/research/spikes/lineart.md`) settled this. Automatic tracing of these Instagram stills gives fragmented, wobbly strokes, scribble on foliage and brick, jagged ceiling strips, and nothing at all on crowds. It is a good underlay and a poor drawing. So every drawing on this site is constructed in code, in the logo's grammar, over a traced guide.

1. **Guide.** For each source photo, run the spike's pipeline (Informative Drawings `lineart` at 1024 px, threshold 0.8, consensus with structured edges for rooms) to produce `guides/<id>.svg`. The guide and the photo are reference layers only and never ship.
2. **Construction.** Each drawing is a TypeScript module `drawings/<id>.ts` that returns ordered strokes built with a small library, `lib/draw`: `line`, `polyline`, `arc`, `circle`, `ellipse`, `rect`, `arch` (the mark's arch), `repeat` (arrays of strips, treads, mullions, bricks), `perspective` (one-point perspective from a vanishing point and horizon measured on the photo), and the glyph set (below). Coordinates are measured in the photo's 1080-wide frame. Every stroke carries a layer: `structure`, `detail`, `life` or `lamp`.
3. **Glyphs, not traces, for organic and living things.** A small constructed library in the logo's language: `leaf` (the mark's almond leaf), `vine` (leaves placed along a curve), `steam` (the mark's three rising lines), `sunRays`, `bulb`, `jar`, `brush`, `cup`, `laptop`, `pin`, `ball`. Plants, creepers, the banana plant and a hand's objects are composed from these. Where a shape cannot be built from primitives (a pair of hands on dough, the rim of a pizza), a **guided contour** is allowed: the few longest guide strokes inside a chosen region are resampled, heavily simplified and refitted as smooth single curves, then placed in the drawing module as data and reviewed like everything else. Never more than a handful of such curves per drawing, and never faces.
4. **Review gate.** Every drawing is rendered at 390 and 1440 alone and over its photo at 30% opacity. It ships only if it passes the checklist in the plan: single weight, no stray fragments, reads at 390, stroke count within budget, and it matches the photo's composition.
5. **Human pass (optional).** An illustrator can replace any drawing by placing `drawings/<id>.svg` with the same layer classes; the site prefers the SVG file when it exists.

Line weight: architecture and life share one weight, 1.25 CSS px on phones and 1.5 CSS px from 64rem, kept constant with `vector-effect: non-scaling-stroke` on static layers only (the performance research shows it is costly on thousands of animating paths).

## 4. The house (home route `/`)

1. **Arrival (the signature, once per hard load, under 2.4 s, scroll skips it).** The mark draws itself in the order an architect would draw it: arch, dividers, sun, steam, plant, house. Its arch then widens to the width of the screen and its four panes subdivide into six room panes: the entry hall, the main floor, the mezzanine, the courtyard, the games corner and the bowling alley. Each pane shows a small vignette of its room drawing. The sun stays in the head of the arch at the visitor's hour; after dark it becomes a lamp.
2. **Under the arch.** The café's name, one line in its register ("Stay a little longer." adapted, never pasted), open-now by the house's clock in Chandkheda, the hours, and one action (WhatsApp).
3. **Tap a pane** and the drawing flies in (a transform on the pane, about 0.8 s), cross-fades to the full room drawing, and the room's details draw on. The URL becomes `/spaces#<room>`.
4. **Written about.** Architectural Digest India's quote beside the drawing of the mezzanine stair against the tall windows (the room the magazines photographed); ELLE Decor India's quote about the pallet-wood ceiling beside the drawing of the strips, which draw on as you scroll. Each quote is attributed, dated and linked from `cafe.json`.
5. **Four ways to use the house.** Host, shoot, bowl and work late as four arched doors drawn from the logo's small house door; each door opens in line on tap and leads to its page; each carries one real proof line (Coffee Garba and the hoodie workshop; the NoCatch film; "recently opened"; open until 3 AM).
6. **After dark.** The page inverts to the night palette, the drawing's lamps glow, and "The nights here are softer." sits over the lit house. Always night, whatever the hour.
7. **Visit.** The facade drawing: the corten sign with the lit logo and lettering, the concrete wall, the cascading creepers and the string lights, all as the café's own photo shows them; address, hours, call, WhatsApp, directions.

## 5. The rooms (`/spaces`)

One full-screen drawing per room, in the house's story order, each with:
- **Annotations** that draw on as you scroll past them: a hairline leader from an object to a short label, with only documented materials and objects (`design.materials`, `design.signatureObjects`, the room's `description`). An object not visible in the room's photograph is listed in text beside the drawing, never drawn.
- **Lift the paper:** press and hold the drawing (or use the "Show the photograph" toggle button) to fade the drawing and reveal the aligned source photograph at honest size with its credit.
- **At night** the room's lamps glow behind the line.

| Room | Drawn from (source still) | Constructed elements | Life glyphs |
|---|---|---|---|
| The facade | `stills/sign-corten.jpg` | Concrete wall, corten plate, the logo (the real vector, lit), the lettering, string lights | Creeper vines, bulbs glowing at night |
| The entry hall | `stills/entry-ceiling.jpg` | Pallet-wood strips in rhythm, the stair and railings, the barrel, chairs, tall curtains | Plant at the stair foot |
| The main floor | `raw/ad-1.jpg` (cropped to the photo) | Brick coursing hints, black steel beams, tall windows | Banana plant; ship lamp vignette from `stills/brick-lamp.jpg` |
| The mezzanine | `raw/ad-2.jpg`, `stills/night-city-window.jpg` | Stair against the windows; shared tables | Laptop glow after dark |
| The courtyard | `stills/courtyard-vines.jpg` | Beams, rail, table and chairs | Vines and palms from the glyph set, leaves swaying |
| The games corner | no photograph | A still life of a pool table, a shelf of board games, a shelf of books | The cue ball rolls on tap |
| The bowling alley | `stills/bowl-sign.jpg` (blank its baked-in caption), `stills/bowl-neon.jpg` | The sign pylon: the vertical BOWL marquee, the giant pin with its two bands, the OPEN sign, the lightbox reading "The Alley" and "The Barnyard Co." | The marquee bulbs chase after dark; the pin's bands and OPEN glow |

## 6. The other routes

- **`/host`:** the hoodie workshop drawn from `stills/host-hoodie-painting.jpg` (jar, brush, painted hoodie, brushes); Coffee Garba told in text with the lamp glyph row (its only still is too blurred to draw honestly); phone-free Sundays in text. Key facts under the title (only known fields), the request form that composes a WhatsApp message, call and WhatsApp buttons.
- **`/shoot`:** the main floor window wall drawing with corten viewfinder frames that move between three compositions of the same room ("one house, many sets"); the NoCatch film's location drawn from `stills/shoot-nocatch-table.jpg` as the barrel, the sheer curtains, the table and the palm only (the two people in the frame are not drawn); key facts, a spec block with only known fields, the request form.
- **`/bowl`:** the sign and the pin; "recently opened"; ask the house about lanes and timings; the request form. No lane count, price or hours.
- **`/menu`:** signatures typeset with small drawings only where a still shows that exact dish (the pizza on its board from `stills/menu-pizza-board.jpg`; hands stretching dough from `stills/menu-dough-hands.jpg` beside the fixed brunch); no drawing for a dish without a still. Prices only where `cafe.json` has them.
- **`/press`:** the five pieces, dated and linked, with the two quotes and their drawings.
- **`/visit`:** the facade drawing, address, hours, open-now, parking, call, WhatsApp, directions.
- **404:** the logo's small house with its door open and nothing inside: "There's no room by that name." with links to the rooms.

## 7. Motion

One engine: GSAP 3.15 (DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, ScrollTrigger; all free and bundled in the `gsap` package), loaded after first paint; Lenis on fine pointers only.

- **The pen curve.** One authored ease for drawing, `pen`: `CustomEase.create("pen", "M0,0 C0.18,0 0.26,0.62 0.5,0.8 0.74,0.96 0.84,1 1,1")` (slow start, confident middle, soft landing). Durations: draw-on 1.2 to 1.8 s per scene; zoom flight 0.8 s; door swing 0.9 s; lamp glow 0.6 s.
- **Draw-on** runs once per view in layer order (structure, then detail, then life), never more than 300 strokes animating at once; long structural lines first.
- **Loops, restrained:** steam morphs slowly between three constructed variants; plant leaves swap between two baked variants at 6 fps; BOWL bulbs chase after dark. Architecture never wobbles. No SVG turbulence filters.
- **Scroll-linked where it means something:** annotations draw as you reach them; the ELLE strips draw with scroll. Nothing fades up because it entered the viewport.
- **Page transitions:** the house layout persists; links are intercepted (`next/link` `onNavigate`, Next 15.3+), a single pen line draws across the screen in 0.5 s, the route changes, and the new page's first drawing draws on. No experimental view transitions.
- **Reduced motion:** drawings complete at rest, loops off, transitions become 150 ms crossfades, the arrival shows the finished house.

## 8. Palette and type

Two states follow the visitor's clock (port `lib/daylight.ts`; `?at=HH:MM` pins the hour): a drafting-film day and a steel night. No cream, no terracotta.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| Paper | `#E9E8E4` | Day ground: neutral drafting film, not cream | — |
| Ink | `#1F1C1A` | Day line and text (black steel) | 13.8:1 on paper |
| Ink 2 | `#5A5650` | Day secondary text | 5.9:1 on paper |
| Corten | `#8E4B2A` | The pen mark: current page, focus ring, the viewfinder frames | 5.4:1 on paper |
| Night | `#17191C` | Night ground (cool steel) | — |
| Night ink | `#DAD6CE` | Night line and text | 12.2:1 on night |
| Night ink 2 | `#9C978F` | Night secondary text | 6.1:1 on night |
| Lamp | `#E7A64F` | Glow behind lamps and bulbs; never text on paper | 8.4:1 on night |
| Corten, night | `#D08A5C` | The pen mark after dark | 6.3:1 on night |

Hairline rules use `#B9B6AF` and are decorative only; every meaningful line uses ink.

**Type.** Two families, both verified in `next/font/google` (Next 15.5.25):
- **Ysabeau Office** (`wght` 1 to 1000, italic): display at 300 to 350, UI and labels at 450 to 500. A Garamond skeleton drawn without serifs, light enough to sit with the line.
- **Hedvig Letters Serif** (`opsz` 12 to 24): reading text at 400. Quiet, low contrast, never fights a drawing.

Option one uses Bricolage Grotesque and Rasa; option two uses Anek Gujarati. Sentence case; no tracked capitals; tracking tightens as display size grows; measure under 70 characters; no widows in headlines (`text-wrap: balance` on headings, `pretty` on prose).

## 9. Performance and accessibility

- Lighthouse mobile 95+ on all four scores; LCP under 2.5 s (the LCP is text under the arch, never the drawing).
- Initial JS under 180 KB gzipped; GSAP plugins load after first paint; each room's drawing under 40 KB gzipped and loaded when its pane is tapped or scrolled near.
- Static layers are merged; only the layer being drawn is split into separate paths.
- Panes and doors are real links with names; drawings are `role="img"` with a title that describes what the drawing shows; "Show the photograph" is a toggle button with `aria-pressed`; a plain text navigation lists every room; the focus ring is drawn in corten; AA contrast everywhere.

## 10. Content

- `content/cafe.json` and `content/media.json` are copies from option one (source of truth at `D:\barnyard\content`).
- `content/drawings.json` lists every drawing: `id`, `title`, `source` (path under `D:\barnyard-source\ig`), `crop` (in the 1080-wide frame of the whole source; it is the drawing's viewBox and the photograph's crop), `ignore` (Instagram overlays blanked in guide layers), `credit` (the handle from the matching media slot), `routes`, `strokeBudget`, `lift` (false where a reel caption crosses the subject, as on the BOWL sign still).
- Copy lives in the pages, reads every fact from `cafe.json`, and follows the café's register. A content check scans the built HTML for flagged values.

## 11. Open questions this option adds

- May the logo be animated and opened into the house on the website?
- Would the studio like an illustrator to redraw any construction drawing by hand before the pitch?
- A sharper still from Coffee Garba would let the event be drawn.
- A photograph of the games corner would let it be drawn as a room rather than a still life.
- A clean still of the BOWL sign without the reel caption would let the alley drawing lift to its photograph.
- Confirmation that the café's own photographs, and those of the creators it reposted, may be shown under the drawings with handle credits.

## 12. Different from the other two options

| | Option one (editorial light) | Option two (the arch, 3D) | Option three (the drawn house) |
|---|---|---|---|
| Imagery | Instagram photos and reels | Lit 3D sets plus depth photos | Constructed line drawings plus photos under tracing paper |
| Signature | The house keeps its own hours | Walking through arches | The logo opens into the house |
| Type | Bricolage Grotesque, Rasa | Anek Gujarati | Ysabeau Office, Hedvig Letters Serif |
| Ground | Concrete and steel | The rendered world, dark UI | Drafting film and cool steel |
| Weight on a phone | Medium | Heaviest | Lightest |
