# ADDENDUM — the client-side lead's raised bar (overrides BRIEF.md where they conflict)

Source files (read both in full first): D:\barnyard\BRIEF.md and D:\barnyard\content\cafe.json
Logo mark: "D:\barnyard\assets\brand\logo barnyard.jpg" — NOTE: the brief text said logo.svg with a
wordmark. What actually exists is a 320x320 JPG of the MARK ONLY (no wordmark): a fine single-weight
black line drawing of an arch divided into four panes — top-left a sun inside a window grid, top-right
three vertical wavy lines (steam/heat), bottom-left a potted plant under three dots, bottom-right a
gabled house with an arched door. Thin precise line, no fills. It will need re-tracing as SVG.

## The standard
This has to beat a free website. Not by being prettier — by being clearly impossible to produce from a
template. The owner will spend about ninety seconds on it and decide. In those ninety seconds he must
feel that someone understood his building.
Restraint still rules. Minimal is the brand. But minimal executed to an extremely high craft standard is
very different from minimal that is just empty, and the gap between those two is the entire pitch.

## Brand assets
The mark is delicate. Give it room, don't scale it below its legible size, and don't recolour it
arbitrarily. Let the linework quality inform the rest of the system: their existing visual language is
thin, precise line against heavy material. That tension is worth carrying through.

## One signature moment
Design and build exactly ONE idea that could not be lifted onto another cafe's site. Everything else stays
quiet and supports it. Pick one, own it, make it genuinely good. Raw material from the building, in rough
order of how strong the lead thinks they are:

1. LIGHT THROUGH THE DAY. They're open 11 AM to 3 AM — sixteen hours from daylight into deep night. The
   building is designed around light: skylights, floor-to-ceiling glazing, layered lighting, ship lamps.
   Their own words are "days slow down and nights feel softer." Build a site whose palette, image grade and
   atmosphere shift with the visitor's actual local time. Bright and glazed at noon; low, warm and lamp-lit
   at 1 AM. One coherent system, not a toggle. It also sells the late-night asset without a word of copy.

2. THE SECTION. It's a 10,000 sq ft loft house — main floor, mezzanine, central courtyard, bowling alley.
   Architects publish sectional drawings; three architecture magazines published this building. Build an
   architectural section you move through as you scroll, each room resolving as you reach it. Makes the
   "you're borrowing a house" argument literal.

3. PROVENANCE. Almost every object has a real story — a ceiling of fruit crates from farmers' markets,
   salvaged furniture from Jogeshwari market in Mumbai, vintage wardrobe doors hung as art, a shortened
   dining table with movie posters under glass. AD wrote about the stories in every corner. Let a
   photograph be interrogated: find the objects, learn where each came from.

Choose one. A better idea grounded in the same material is allowed if the case is made. Don't build two.

## Craft floor — all pages
Type. A real scale with intent, not a Tailwind default ramp. Tighten tracking as display sizes go up. No
widows or orphans in any headline — handle it properly, not with a non-breaking-space hack. Body measure
under 75 characters. Sentence case.

Motion. Custom easing curves, authored not borrowed. Slow and weighted: most things 600-1100ms, not 300.
Scroll-LINKED where it carries meaning, not scroll-triggered reveals on every section. Nothing animates
just because it entered the viewport. Honour prefers-reduced-motion completely, not by disabling
transitions and calling it done.

Images. One consistent grade across every image so compressed Instagram stills and future high-res files
sit together. Real art direction — mobile gets its own crops, not the desktop image squashed. Subtle grain
over the whole site; the building is textured and a flat surface will misrepresent it.

Depth. Corten, brick and concrete are materials, not colours. The surface should feel like it has
substance — layered shadow, real tonal range, warmth in the darks. Avoid flat fills and avoid the same
border-radius on everything regardless of what it is.

Detail. Do all of these; they are where the money is visible:
- a custom selection colour that belongs to the palette
- a considered focus ring, visible and on-brand
- real OG images per route, not a single generic card
- a favicon set built from the mark
- a 404 that belongs to this site
- a first-load state that is designed, not a spinner
- link and button affordances that feel authored

Accessibility is part of the craft, not a checklist: AA contrast throughout, correct heading order,
keyboard path through every interactive thing.

## Restraint
Spend the boldness once. One memorable element, everything around it quiet. Section 6 of BRIEF.md
describes the exact default this kind of brief pulls toward — cream, serif, terracotta, all-caps eyebrows,
identical rounded cards. If the work lands there it has failed, however polished.

## Technical constraints (from BRIEF.md section 9, restated)
Next.js 15 App Router, TypeScript, Tailwind v4. next/image throughout. ONE animation library (Lenis
allowed for smooth scroll). No CMS/db/auth/booking. NO localStorage / sessionStorage. Per-route metadata
and OG images, JSON-LD Restaurant/LocalBusiness. Lighthouse 95+ all four, homepage LCP < 2.0s.
No real photography exists yet — every image is a named slot in content/media.json rendered through a
<Frame> component that shows an in-palette labelled placeholder when the file is missing.
Fields marked UNKNOWN / CONFIRM in cafe.json must not be rendered as fact.
