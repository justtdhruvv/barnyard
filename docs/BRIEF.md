# The Barnyard Co. — Flagship Website Brief

Read this file completely before writing anything. Then read `content/cafe.json`.
Everything you need is in these two files. Do not search the web for this client.

---

## 1. The situation

The Barnyard Co. is a 10,000 sq ft design-led cafe in Chandkheda, North Ahmedabad.
They have no website. All their traffic lives on Instagram.

This is a **pitch demo**, not a paid build. The owner is currently being offered a
free website by his existing marketing agency. Our job is to make that offer look
irrelevant — not by being prettier, but by doing something structurally different:
turning a cafe's Instagram presence into a set of working sales pages for revenue
lines they already have and currently cannot sell online.

If this lands, three to four more projects follow. Build accordingly.

**This is the flagship tier.** Two cut-down versions will be derived from it later.
Do not hold anything back for the lesser tiers — build the best version first.

---

## 2. What makes this client unusual

Most cafes have no story. This one has been written about by three national magazines.

- **Architectural Digest India** — Nov 2024
- **Condé Nast Traveller India** — Nov 2024, by Chaitali Patel
- **ELLE Decor India** — Jul 2025
- **The Architect's Diary** — Jan 2025, full project fact file
- **Knocksense** — city feature

It was designed by architect Rohan Bhargade of Mudra Design Studio: a one-year build,
₹2 crore, completed 2023. Photographed for those features by Rishabh Goenka.

None of that recognition is doing any work for them right now. There is nowhere for it
to land. That gap is the entire product thesis.

Proof the angle works: a creator's reel whose hook was literally *"Elle and AD
recognised cafe in Ahmedabad"* did 53,000 plays and 1,600 likes — among the best
performing content about them, and they didn't make it.

---

## 3. The strategic idea

**Three magazines each wrote a page about this place. This site is the whole issue.**

That is the concept. Not a restaurant website with a press logo strip bolted on —
a site that behaves like the definitive feature on the building, and sells from inside
that. The design vocabulary is editorial. The credibility is real and linkable.

The second idea, equal weight:

**It is not a venue. It is a house you can borrow.**

Bhargade designed it explicitly as an unpretentious "loft house" — the barnyard as a
metaphor for inclusion, not for farm kitsch. The cafe's own hashtag on nearly every
post is `#feelathome`. Their captions repeat the same idea: days slow down, stay a
little longer, a sense of belonging.

So the commercial pages don't say "book our event space." They say: you are borrowing
a ₹2-crore, 10,000 sq ft house that took a year to build. For a film shoot, that framing
is devastating — you aren't a location, you're a pre-dressed set with magazine credits.

**Avoid literal barn/farm imagery entirely.** Rooster iconography, gingham, hand-drawn
wheat, rope textures, "rustic" script fonts — all wrong. The building is industrial
loft: corten steel, exposed brick, black steel structure, pallet wood, concrete,
tall glazing, heavy greenery. The name is ironic-warm, not agricultural.

---

## 4. What NOT to lead with

Read this before planning any section order.

Across Zomato, District, EazyDiner, Wanderlog and Instagram comments, the pattern is
consistent: **the space is praised almost universally, the food is polarising.** Recurring
complaints are price-to-taste, service speed, and air conditioning. Several reviewers
describe it as a place that is mainly for the aesthetic.

Therefore:

- **Do not build a food-forward site.** No large menu section, no dish grid, no "our
  chef" story, no food-hero homepage.
- Menu exists as a light, appetite-setting page — a handful of signatures, no full
  price list.
- The site leads with **space, design, recognition, and hosting.**

This is not a compromise. It happens to be exactly what the owner asked for, and it
aims the site at the comparison they win rather than the one they lose.

---

## 5. Sitemap

```
/                 The feature. Story, spaces, recognition, the four ways to use it.
/spaces           Room-by-room tour of the building. The architecture piece.
/host             Events, birthdays, ceremonies, private hire.
/shoot            Film, photo, brand and influencer shoots. The B2B page.
/bowl             The bowling alley. Newest thing they have.
/press            The recognition wall. Real, dated, linked.
/menu             Deliberately light. Signatures only.
/visit            Location, hours, parking, contact, map.
```

Eight routes. `/host`, `/shoot` and `/bowl` are the revenue pages — each needs its own
argument, its own imagery, and its own enquiry path.

**There is no booking system and there will not be one.** Enquiry = a clear call/WhatsApp
action on 8780591708, plus a simple form that composes an email. Nothing that needs a backend.

**Late hours are an under-sold asset.** They're open until 3 AM. Their own co-working
reel — laptop, quiet corner, late — did 149,000 plays with nothing to convert it. Give
the late-night/work angle a real section on `/spaces`, not its own page.

---

## 6. Design direction

The owner asked for "minimal." Take that as *disciplined and uncluttered*, not as
*empty and generic*. The building is warm, heavy, material and full of stuff — a cold
minimal site would misrepresent it.

**Where the palette comes from:** the actual material list of the building. Oxidised
corten steel, red brick, pallet wood, raw concrete, black steel, and the green of very
heavy planting. Warm, mid-dark, material. Derive 4–6 named values from that, not from
a stock palette.

**Typography:** this site is arguing it belongs in AD, CNT and ELLE. Set type like an
editorial feature. One display family with real character, one clean workhorse. Not Inter.
Not a "rustic" or slab face. Let the type treatment be an active part of the layout.

### Read this before you plan

A brief like this one — warm, rustic-adjacent, cafe, "minimal" — pulls extremely hard
toward one specific look that is the current default for AI-generated design:

> cream/oatmeal background near `#F4F1EA`, a high-contrast serif display, a terracotta
> or warm-clay accent near `#D97757`, tracked-out all-caps eyebrow labels, everything
> chopped into identical rounded cards with the same soft grey shadow, `→` glued onto
> every link.

If you produce that, the demo fails. It is exactly what a template would produce and it
would hand the argument straight back to the free agency. The palette must come from
corten and brick and concrete, which is a *darker, dirtier, more metallic* place than
cream-and-clay. Take a real position.

**Motion:** one orchestrated moment, not effects everywhere. Scattered fade-and-slide-up
on every section, and a hover transition on every card, is the generic tell. Spend the
boldness once — most likely the arrival on `/` — and keep everything after it quiet and
deliberate. Respect `prefers-reduced-motion`.

**Spend the boldness in one place.** Pick the single memorable element and let everything
around it be restrained.

---

## 7. Images — read carefully, this will otherwise sink the build

**There is no real photography in the repo yet.** The good images exist (Rishabh Goenka
shot the building for the magazine features) but haven't been handed over. Instagram
images are 1080px and heavily re-compressed — they will fall apart on a large display,
which is exactly where the owner will judge this.

Build so the real photos drop in later without a refactor:

1. Every image is a named slot in `content/media.json` with intended subject, aspect
   ratio and priority. Filenames are decided now, files arrive later.
2. Write a `<Frame>` component that renders the image if present, and a labelled
   placeholder block if not — showing the slot name and the intended subject, styled
   in-palette so the page still reads as designed.
3. Never let a missing image collapse a layout or render a broken icon.
4. Apply a consistent grade — slight warmth, subtle grain — so that low-res IG stills
   and future high-res files sit together. This is also what covers for the compression
   in the meantime.

**The bowling alley has zero assets.** It's too new to appear anywhere — not on their
Instagram, not on the web. `/bowl` gets built fully as a page with placeholder slots
and copy that does not describe details we don't have.

---

## 8. Content rules — non-negotiable

Everything factual comes from `content/cafe.json`.

- **Do not invent anything.** No made-up awards, no fake testimonials, no invented
  capacity numbers, no imagined dish descriptions, no fabricated client logos. This
  demo will be shown to the owner, who will immediately spot anything untrue and will
  stop trusting the whole thing.
- Fields marked `"UNKNOWN"` must not be rendered. Design each component so it degrades
  gracefully when a field is absent rather than printing a placeholder string.
- Every press claim renders with its publication, date and a working link.
- The cafe's own caption language is in `voice` in the JSON. Write in that register.
  Adapt it; don't paste it verbatim into headlines.
- Where you need connective copy that isn't in the JSON, write it — but keep it factual
  and mark anything you're unsure of in `OPEN-QUESTIONS.md` as you go.

---

## 9. Technical spec

- Next.js 15, App Router, TypeScript, Tailwind v4
- `next/image` throughout, with correct `sizes`; hero images `priority`
- One animation library — pick it and stick to it. Lenis for smooth scroll if used.
- No CMS, no database, no auth, no booking. Content is JSON on disk.
- No `localStorage` / `sessionStorage`
- Accessibility is part of the pitch, not an afterthought: visible keyboard focus,
  correct heading order, alt text from the media manifest, reduced motion honoured,
  AA contrast throughout
- SEO is a differentiator we will explicitly sell — do it properly:
  - per-route metadata and OG images
  - JSON-LD: `Restaurant` / `LocalBusiness` with address, geo, hours, phone, `sameAs`
  - each revenue page targets its real local intent — event venue in Ahmedabad,
    shoot location Ahmedabad, bowling Chandkheda
- Performance targets: Lighthouse 95+ on all four scores, LCP under 2.0s on the
  homepage. Verify before declaring done.

---

## 10. Process — do this in order

1. Read this brief and `content/cafe.json`. Ask nothing yet.
2. Write **`PLAN.md`** containing:
   - the design plan: 4–6 named hex values with their source in the building's
     materials; typefaces and their roles; layout concept with ASCII wireframes for
     the homepage and one revenue page; the principles that make this site specific
     to this client
   - the section-by-section homepage structure
   - the component inventory
   - the media slot list
3. **Then review your own plan against section 6 of this brief.** For each of palette,
   type, layout and motion, ask whether you'd have arrived there from any similar
   "warm minimal cafe" prompt. Anything that would have, revise — and note in `PLAN.md`
   what you changed and why.
4. **Stop. Wait for approval on `PLAN.md` before writing any component code.**
5. Build in this order: design tokens and type scale → `<Frame>` and the media manifest
   → homepage → `/spaces` → `/host` → `/shoot` → `/bowl` → `/press` → `/menu` → `/visit`
6. Critique as you go. Screenshot, look, cut. Before calling a page done, remove one thing.
7. Keep `OPEN-QUESTIONS.md` updated with anything you needed and didn't have.

---

## 11. Done means

- All eight routes built and responsive to 375px
- No invented facts anywhere
- Every image slot either filled or gracefully placeheld
- Lighthouse 95+ verified, not assumed
- A visitor who has never heard of the place understands, within one screen, that this
  is an award-covered building in Ahmedabad they can eat in, shoot in, or hire
- It does not look like a template, and it does not look like the default described
  in section 6
