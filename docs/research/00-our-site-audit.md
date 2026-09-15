# Our site, audited honestly (14 Sep 2026)

Screenshots taken from the running dev build at 1440 px and 390 px, at 1 PM and 11 PM (`?at=`), all eight routes.

## What holds up

- **The light system.** The house following the clock, the arch-and-sun control, the night band that pulls the whole page to 1 AM: this is a real idea, it is specific to this building, and nobody else in the category has anything like it. Keep it. Make it the spine of the redesign rather than a single moment.
- **The night state.** Black steel ground, concrete ink, lamp accent, grain. It is the strongest thing on the site by a distance. The day state is the weak one.
- **Content discipline.** Every fact is from `cafe.json`, every press claim dated and linked, nothing invented. A critic cannot catch a lie here. That stays.
- **Performance and accessibility foundation.** Lighthouse 97 to 100 across routes, real semantics, reduced-motion honoured. This is a floor to protect, not a reason to stay still.
- **Type pairing.** Bricolage light at display size over Newsreader text is a defensible editorial choice and not the default serif-display-over-sans.

## What a tasteful critic sees in the first ten seconds

1. **Empty beige rectangles with debug labels.** Twenty-seven placeholder slots print their slot id (`home-hero`, `facade-corten`) and a subject line in italics. To an architect or photographer this reads as an unfinished wireframe, not a designed site. On the homepage at 1440 px, roughly half the pixels are placeholder.
2. **Nothing moves.** Apart from the 1.6 s light shift on arrival and hover underlines, the site is fully static. No page transitions, no reveals, no scroll response, no cursor, no image motion, no preloader. Modern hospitality sites at the level we are claiming all have a motion vocabulary; ours has one gesture.
3. **Every section is the same section.** Headline in the left column, prose, a placeholder on the right, hairline rule, repeat. Six times on the homepage, seven on `/spaces`, six on `/host`. No change of scale, no full-bleed, no pinned moment, no big numeral, no dark band except one. The rhythm is a document, not a magazine issue.
4. **The day palette is inside the danger zone the brief named.** Concrete `#DCD8D1` with corten accents on a warm grey ground is, in practice, the oatmeal-and-clay default that the brief said would fail the demo. The building's materials (black steel, corten, brick, heavy green) are almost absent from the day state; they only appear at night.
5. **The hero is a headline and a box.** A 6.5 rem headline, a lede, and a placeholder. No hierarchy of scale between the headline and the rest of the page. The arch sits below the fold at 900 px height, so the one interesting element is not in the first screen.
6. **No sense of the building.** The site says "10,000 sq ft, six rooms, corten, brick, steel" in words, but nothing on screen is corten, brick or steel. Without photography, the materials have to be *rendered*: texture, light, shadow, line drawing, or 3D. Currently they are named, not shown.
7. **Mobile is one long column of the same.** 8,965 px tall at 375 wide, with placeholders stacked between paragraphs. Nothing rewards the scroll.
8. **The revenue pages do not sell.** `/host`, `/shoot`, `/bowl` open with the same headline-and-box, then a fact file, then rooms again (the same six rooms appear on `/`, `/spaces`, `/host`, `/shoot` and `/bowl` with the same placeholders). The enquiry forms are plain grey inputs. A producer or event planner gets no floor plan, no capacity, no light direction, no rates, no "how a shoot day works", no gallery.
9. **Small tells.** The "N" debug/light toggle floats bottom-left on every page. Navigation is a plain text list with no active-state motion. Footer is the same on every page with no closing gesture. Link text underlines are the only affordance.

## Root cause

The build was optimised for the brief's "boldness once, everything else still" rule and for zero-photo graceful degradation. Both were reasonable in isolation. Together they produced a site whose only visible idea is a colour shift, wrapped in placeholder boxes. The fix is not "add animations to the existing pages". It is to redesign the pages so that light, material and motion carry the experience that photography would normally carry, and so that when photographs do arrive they slot into a site that already looks finished without them.

## Constraints that do not change

- No invented facts. `UNKNOWN` never renders. Every press claim dated and linked.
- Eight routes. No booking backend. WhatsApp and call are the enquiry paths.
- Lighthouse 95+ and reduced-motion support remain the floor.
- The light system is the identity; everything new must live inside it (day and night states, lamp accent after dark).
- No literal barn or farm imagery.
