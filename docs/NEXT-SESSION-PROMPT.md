# Prompt for a fresh session on the drawn house

Copy everything below the line into a new Claude Code session opened on `D:\barnyard-drawn`.

---

You are working on `D:\barnyard-drawn`, option three of three website designs for The Barnyard Co., a design-led loft café in Chandkheda, Ahmedabad. The client saw this site on 15 Sep 2026 and liked it a lot. Your job is to take it from a demo cut to a finished, faster, more inventive site, starting with one specific fix.

Read first, in this order: `CLAUDE.md`, `docs/spec.md`, `docs/craft-standard.md`, then `docs/plan.md` (23 tasks; its "Cross-task reconciliation" section explains how to treat the demo code already on `main`).

**What exists now.** A demo cut built in one evening, all on `main`: the logo draws itself and opens into a house of six room panes; seven room drawings built in code; `/spaces` with press-and-hold or a button to lift the drawing and reveal the photograph; a Drawing · Both · Photograph toggle on the home page; a drag-to-wipe on the facade; a day/night switch; steam, swaying leaves and chasing bulbs; tap a pane to fly into its room; `/visit` and a 404. Missing: `/host`, `/shoot`, `/bowl`, `/menu`, `/press`, the room annotations, the guide pipeline and nearly all tests.

**Your goal, in priority order.**

1. **Fix the sun and the moon on the arch (the client asked for this by name).** Today the arch carries a sun all the time, sliding along a track from 11 AM to 3 AM. It should be the sun while there is daylight and the moon once night falls, with the change happening smoothly at dusk, not as a swap. Build it from `lib/daylight.ts`, which already gives `daylight` (1 at skylit noon, 0 at deep night), `clockT` (position along the opening hours) and the regime flip at 0.375. Suggested behaviour, refine it as you see fit: the sun keeps its rays and warm glow at full daylight; through dusk the rays retract, the disc cools and a crescent shadow slides across it until it reads as a moon; glow fades from warm to cool; the track's own line dims. It must animate smoothly when the day/night button is pressed too, and be correct at rest under reduced motion. Check it at 11:00, 14:00, 18:45, 19:30, 22:00 and 01:00 with `?at=`, and look at every one.
2. **Finish the site.** Work through the plan's remaining tasks in order, reusing what the demo already does well: the room annotations on `/spaces` (Task 18), then `/host`, `/shoot` and `/bowl` (Task 20), then `/menu`, `/press` and `/visit` (Task 21), then the detail floor (Task 22) and verification (Task 23). Everything the four doors on the home page promise should lead to a real page.
3. **Make it faster.** Lighthouse mobile 95 or better on all four scores, LCP under 2.5 s, initial JavaScript under 180 KB gzipped, each room drawing under 40 KB gzipped, no layout shift. Drawings should load when their room is near, not all at once. Task 23 has the budget script.
4. **Add creative depth, without breaking the rules.** The client wants more, so spend it where the idea is strongest. Ideas worth testing, pick the ones that earn their place: drag the sun along the arch to scrub the hours and watch the lamps come on; a pen-nib cursor and an ink-weight shift on desktop; the tracing-paper lift extended to a slow two-finger peel on phones; a room's construction drawing rebuilding itself stroke by stroke when you ask "how was this drawn"; a printed-spread layout for the press page; the logo's steam reacting to scroll speed. Every addition must honour reduced motion, work by touch, and add nothing that is not in the café's own material.

**Rules that do not move.** Facts only from `content/cafe.json`; `UNKNOWN` and `CONFIRM` never render; no capacities, prices beyond the three real ones, lane counts, testimonials or room adjacency claims. Drawings show only what the café's photographs show; no people, no faces. Photographs appear at honest size with their credit from `content/media.json`. Mobile first at 390 px. No `localStorage`, no backend; enquiries compose WhatsApp messages. Sentence case, the café's own register.

**How to work.**

- Branch off `main` (for example `plan/full`), and leave `main` able to serve the demo at any moment.
- Dev server on port 3021, production checks on 3022. `npx next build` then `NEXT_DIST_DIR=.next-prod npx next start -p 3021`. To show the client again, run `cloudflared tunnel --url http://localhost:3021` (the old quick-tunnel address is dead and a new one is issued each time).
- Verify by looking, every time: Playwright MCP screenshots at 390x844 and 1440x900, `?at=14:00` and `?at=01:00`, and read them before calling anything done. Judge every drawing at 390 px first.
- A note for later: an earlier agent committed build output to git, so `.next-prod*` folders sit in the history of a few commits. Do not add more; cleaning the history is optional and needs a rewrite.
- Commit per working step; commit messages end with the co-author line the harness gives you.
- Never edit `D:\barnyard` or `D:\barnyard-arch`; `D:\barnyard-source` is read only.

**Done means:** the sun becomes the moon convincingly at dusk; every route in the sitemap exists and is honest; Lighthouse mobile is 95 or better; the site feels authored rather than generated; and you can hand over a screenshot set and a live link.

Start with the sun and moon, show me that one change, then continue down the list.
