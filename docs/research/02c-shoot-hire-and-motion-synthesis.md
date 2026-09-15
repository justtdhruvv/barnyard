# Shoot-hire pages, runtime-verified award sites, and the motion synthesis (14 Sep 2026)

Companion to `02-awwwards-hospitality.md` and `02b-editorial-architecture-hotels.md`. This file adds a runtime verification layer (JS executed in Playwright: window globals, loaded fonts, computed type, node counts for split, mask, pin, cursor, blend), the full shoot and location-hire audit, and the cross-cutting synthesis.

## Part A: runtime-verified additions to the award-tier inventory

| Site (award) | Runtime stack | Opening as observed | Verified motion | Type loaded | Note |
|---|---|---|---|---|---|
| Studenterkilden (HM Aug 2026) | GSAP 3.15 + ScrollTrigger + SplitText + CustomEase, Lenis 1.2.3, Barba 2.10, all live | Branch logo fills left to right with load progress on white; centred typographic hero with dotted eyebrow "Since 1854", GT Ultra headline, two CTAs, full-bleed photo below the fold | 71 split-text nodes, 28 mask nodes, 9 loader nodes, sticky header | GT Ultra Median only, 22.4 px body | Closest analogue to a café-as-building site; FAQ carries 75 seated / 100 standing and "music till 3 am" |
| Son Daven (SOTD + Dev 8.09, Jun 2026) | GSAP 3.13 + ScrollTrigger + SplitText + Flip, Lenis 1.3, Barba, Swiper, 16 canvases, WebGL | Dark olive loader with spike bars, sliced wordmark over a render, three-column meta line | 282 will-change nodes, 17 sticky, 14 pin, 3 marquee, 35,888 px tall | KTF Metro Roman + Blueline | Highest Dev score in the hospitality set; investor site for an unbuilt hotel |
| Tripletta Pizza (SOTD Apr 2025, CSSDA WOTD Mar 2025) | Lenis live; Webflow IX + Lottie; no GSAP global | Preloader cycles city names on brand blue; 234 px Oswald wordmark ghosted behind a mascot | 90 cursor-class nodes, 144 split nodes, 9 clip-path, 2 marquee | Oswald 700 + Merriweather | Awwwards usability 6.98 and accessibility 6.0: the price of the theatre |
| Tastavents (HM Oct 2024) | Locomotive Scroll, Swiper | Cookiebot wall on black first; macro food photo with a 122 px hairline IvyPresto title | 353 split nodes, 167 mask nodes, 16 marquee, 14 parallax | ivypresto-display 100 + Optima | Body text computes to 6.5 px: a real accessibility failure |
| Vander Hotel (Nominee Aug 2026) | GSAP 3.12 + ScrollTrigger, Splide | Cream page, handwritten logo, script line plus 109 px Söhne headline, four small photos scattered around it with parallax, hand-drawn underline buttons | 12 split nodes, sticky nav, no preloader, no cursor | Söhne Buch only | Quiet and editorial; "Welcome to our Vander Hotel" copy |
| The Drake Hotel (SOTD + Dev Sep 2025) | Locomotive `data-scroll` x36 + Lenis + Swup + Swiper; no GSAP | Boxed mono-label nav, white boxed word blocks over a blurred photo, numbered property list, then a huge white intro paragraph over a bar photo with rounded page corners | anim-reveal x14, heading split x14, 32 mask nodes, 7 sticky | Sequel Sans + Maison Mono | Tripleseat for events; meetings page gives "120 guests theatre-style" only |
| White Desert (SOTD + Dev Sep 2026) | Lenis live; GSAP bundled; Cloudflare Stream | Penguin video with a 12-column hairline grid overlay; "ANTARCTICA" in 222 px Oswald bleeding off the bottom; italic serif tagline; then a mist overlay washes the section out | 39 horizontal nodes, 14 pin, 6 cursor, 5 clip-path, 22,768 px tall | Cardinal Classic Long + Inter Tight + Oswald | Best "Animations" score (7.8) with the lightest touch |
| Flôr (Nominee Jan 2026) | No motion libraries; SevenRooms | Parallax stills, no h1 | 54 transition-class nodes | Helvetica LT Pro | Proof a nominee can be CSS-only |
| Haven Coffee + Kitchen (Nominee Apr 2026) | Vanilla JS | Line drawing of the storefront; **hours as navigation labels** ("Coffee from 8:00", "Brunch 9:00 to 2:00") | none | PF DIN Text Pro | The only café in the set |
| Le Pain Quotidien (HM Aug 2025) | Framer Motion strings only | Textured white hero, bread still life; an editorial "Magazine" section with heritage essays | CSS transitions | | Motion near-silent by intent ("slowing down") |
| Da Maria (HM Apr 2026) | GSAP + SplitText + Barba + Lenis, scripts from codesandbox | Reservation form in the hero | | Google fonts | A Webflow template with placeholder phone numbers; not a benchmark |

Frequency across about 30 distinct award-tier sites: GSAP about 20, ScrollTrigger about 17, Lenis about 15, sliders about 14, text splitting about 11, Barba or Swup about 10, preloaders about 10, WebGL actually running 4, scroll-scrubbed image sequence 1, horizontal layout 2.

Awwwards scoring pattern: hospitality Sites of the Day score 7.2 to 7.6 overall; "Animations and transitions" 7.0 to 8.2; "Accessibility" 6.0 to 7.4. Son Daven (8.09 Dev) is the ceiling; Tripletta (6.0 accessibility) is the cautionary tale. **Jurors reward restraint that still has one signature move.**

## Part C: film and photo location-hire pages

Access notes: Shootfactory and Peerspace were read through a text-render proxy; Sessions Arts Club has no public hire page; Big Sky's own domain did not resolve (HeadBox listing used).

### Marketplaces
- **Peerspace, "IA House, Industrial-Chic Loft and Garden", Chicago** (architect-owned loft, 4,004 sq ft indoor plus 4,000 sq ft garden; the closest analogue). Presents $160 to $235 per hour with a 4-hour minimum, a 30-person cap, "20 ft high ceilings", "abundant daylight from large windows, complemented by blackout blinds", "minimal external noise, suitable for sound recording", "easy ground-level access for equipment load-in", a seven-day bookable-hours table, amenity icons, a cancellation ladder, 84 reviews each stating crew size, and **credits in the description** (Radical Media, NBC Dateline, InBev, "Featured in Dwell Magazine"). Missing: power, parking, floor plan. Layout: gallery, About, "Included in your booking" icons, hours table, reviews, sticky price and booking panel.
- **Giggster, "Giant Industrial-Chic Loft", Newark** (the most complete structured spec found). "From $300 per hour"; **structured dimensions** 4,500 sq ft, ceiling 20 ft, width 50 ft, length 90 ft, 2 floors; capacity split **cast and crew / max attendees / standing / sitting**; parking spots, truck and motorhome parking, access; feature tags ("Floor-to-Ceiling Windows", "Concrete Walls", "Hair/Makeup Room", "Large Vehicle Access"); allowed-activities list; **priced add-ons** (audio package, picture vehicles, lighting packages); deposit and commission disclosed; 37 photos plus 360 tours. Layout: three-image lead, **key-specs strip (minimum booking, capacity, sq ft) under the title before the prose**, reviews, About, Details, Parking and Access, Amenities, Add-ons, **sticky booking form**, FAQs, rules, map.
- **Bowling comparables.** Giggster "Vintage Bowling Alley, Montrose CA": $1,000 per hour, 6-hour minimum, 6,500 sq ft, 8 lanes, 60+ people. Bloomsbury Bowling Lanes on Hire Space: £10,000 venue fee per evening (18:00 to 02:00) or afternoon, minimum spend £5,000 to £10,000, 450 standing. **A bowling alley is priced as a whole-venue buyout by day-part, not per hour.**
- **Scouty, "cosy rustic coffee shop", London** (hospitality-specific). £80 per hour, volume discounts, dimensions "5 m x 15 m", room inventory, noise note, hours the café is closed to the public, load-in ("space for one vehicle behind the shop"), **house rules verbatim** ("Use of the coffee machine and any bar equipment must be arranged in advance and only operated by approved personnel"). The only page that spells out operational rules.
- **Indian marketplaces.** GoReccie, Bengaluru: **crew-size tiered pricing** (1 to 5 crew ₹2,500/hr; 16 to 25 ₹3,000/hr; 40+ ask), 4-hour minimum, refundable deposit mandatory. SceneLoc8, Mish Cafe Mumbai: "₹500/hour" and "cost on request", form asks "What are you planning to shoot?" (photoshoot, TVC, film, podcast). VenueLook Ahmedabad: "Rs 50,000 half day / Rs 1,00,000 full day", "Get free quotes", WhatsApp. **In Ahmedabad the mental model is a half-day or full-day buyout figure, and WhatsApp is an expected channel.**

### Location agencies
- **Shootfactory, "Depository, London N16"** (6,500 sq ft warehouse). Long narrative walk-through floor by floor, working industrial lift, parking permits via app, skylights, "facility to black out the whole location", 45 photographs, "Save PDF", a disclaimer that dressing in photos is illustrative. No sq ft per floor, ceiling heights, power or rates. Persuades by photo volume and honest room-by-room narration.
- **1st Option, "Bermondsey Loft" (5,000 sq ft tannery conversion) and "Loft Studios 1"**. Provenance ("leather tannery from 1850"), Crittall-style arched windows, Velux skylights; a **permissions checklist** ("No glamour", "No animals", "Children permitted", "Food shoots permitted", "Decorating allowed", "Hand-held and large-scale filming permitted"); **62 photographs with full-res downloads**; **PDF spec sheet**; Loft Studios adds cove width, "east/west facing windows with overhead skylights", blackout blinds, "daily fee for electrics". The yes/no permissions list is the fastest screening tool a location manager has.
- **Castle Gibson "MC Motors"**: "6,000 sq ft", "2 x 32 Amp 3 Phase, 2 x 16 Amp Single Phase", skylit roof plus full blackout, **tabbed map / spec / plans with a floor-plan image and PDF**. Rates on Tagvenue only: "from £3,600 per day, 8 hours minimum, 7:00 to 23:00".
- **Locations Direct rate guide** (how UK producers budget): houses £1,500 to £2,500 for a 12-hour day; 10 to 20 crew £1,000 to £1,500; prep and strike days at half rate; hospitality £800 to £6,000; damage deposit about £2,000.

### Single-venue and studio pages
- **Loft Studios, "Studio 4"** (the best technical page found): "252.90 m² / 2,722 sq ft"; two shooting spaces with L x W; ceiling "5.8 m to apex / 3 m to beam"; power "3x 63A single phase / 1x 63A 3 phase distro board" plus "4x 32A single phase"; "east and west facing windows", daylight and blackout; "1 GB fibre"; styling bench, mirror, kitchen inventory; **floor plan PDF**; a **walkthrough video**. Layout: hero images, walkthrough video, description, specifications block split Measurements / Equipment / Features, contact. Everything a gaffer or DOP asks in the first call is on the page.
- **Big Sky Studio 1 and Spring Studios Studio A**: "L 88 ft x W 31 ft x H 25 ft to apex", cove dimensions, "2 x 200 Amp 3 phase feeds", "east-facing windows and diffused skylights", "electronic blackout blinds", "mobile makeup desk with daylight-balanced bulbs". **The L x W x H-to-apex string and amps plus outlet type are the industry shorthand.**
- **Bourne & Hollingsworth Buildings, "Photoshoots and Filming"** (Clerkenwell restaurant; closest structural match to the brief): "seven distinct spaces in one large building", "great natural light", "off street parking, easy unloading", "central location, quiet street"; **credits** (Alexa Chung for AG Jeans, BBC with Paul Hollywood, ITV This Morning, Clerkenwell Design Week press hub); regular opening hours; PDF; only four images; mailto and phone. Persuades with credits and "quiet street, easy unloading"; lacks numbers.
- **House of MG, "Shoot at House of MG"** (Ahmedabad; the only local shoot page): four properties, a paragraph of provenance each, shoot-type pills, a white backdrop mention. No rates, specs, credits or form; three phone numbers. **Sets the local bar low.**
- **Ladbroke Hall**: video hero, seven spaces as cards, each opening a **modal with a photo set and a floor plan**; "Download brochure"; tech (height 9.95 m, motorised truss, 32 A and 63 A power, full blackout, drive-in access 2.7 x 3.16 m, soundproofed ceiling) lives on a third-party listing, not the design-led site.

### Hotel and restaurant private-hire pages (for contrast)
- **The Ned**: six spaces as cards with **sq m plus sq ft plus pax** ("The Tapestry Room 165 sq m / 1,776 sq ft, 200 pax"), one-line character line, "Make an Enquiry" per space, virtual tour, sticky enquiry CTA.
- **The Standard, London**: nine spaces with floor and **seated / standing** capacities per layout ("12 boardroom | 20 standing | 20 theatre"); "Tour Room" 3D; downloadable factsheet; Townhouse 8 explicitly listed for photoshoots. The group's shoot page is copy-led with one rule ("all shoot content is subject to approval") and zero specs.
- **Ace Hotel, Photoshoot Requests**: the best **form** found. Policy stated first ("no photo, no film policy in our public spaces; vetted at least two business days in advance; shoots without prior approval will be asked to leave"). Fields: contact, company, website; hotel; **usage** (print, TV/film, web, social, advertising, point of sale, billboard); **budget (required)**; **crew size (required)**; shoot date; days; **start, end, setup and breakdown times**; type of shoot; brand sponsors; spaces needed; F&B; equipment and storage; security. No-budget projects must state the editorial value the hotel receives.
- **Soho House**: cards with "Spaces: 3, Capacity: 12 to 150", brochure, enquiry. **Sessions Arts Club**: "up to 60 seated or 100 standing", Events Deck PDF. **Gordon Ramsay "Filming Requests"**: two sentences and a mailto.

Event-hire pages are organised around **capacity by layout, F&B and a brochure**; shoot-hire pages around **dimensions, light, power, access and permissions**. Nobody sampled does both well on one page; the venues that have both split them and hide the shoot specs in PDFs.

### Consolidated data-field checklist (ranked by frequency and producer need)

**Tier 1, on every credible page, asked first**
1. Total floor area (sq ft and m²), per space or floor.
2. Capacity split cast and crew / standing / seated.
3. Rate structure: hourly or day rate, minimum hours, what a "day" is, overtime, crew-size tiers; hospitality venues alternatively quote a whole-venue buyout by day-part.
4. Hours available (seven-day table) and closed-to-public windows.
5. Natural light: window compass orientation, skylights, blackout capability.
6. Gallery of 20 to 60 images with full-res download.
7. Permissions list: filming (hand-held versus large-scale), decorating, food, animals, children, glamour, alcohol, smoking, loud noise, heels, drones (never seen listed; add it).
8. Load-in and access: door dimensions, lift, stairs, ground level, truck parking, crew parking.
9. Enquiry with the right fields: shoot type, usage, crew size, dates, days, setup and strike times, budget.

**Tier 2, the DOP and gaffer's confirmation list**
10. Ceiling height to apex, to beam, to rig. 11. Power: total amps, three-phase versus single, outlet types and counts, generator bay. 12. L x W x H per space. 13. Floor plan (PDF and on-page). 14. Green room, hair and make-up with daylight-balanced light, changing room, styling bench, kitchen inventory, toilets, WiFi speed, storage, production office. 15. Sound: ambient level, soundproofing, traffic. 16. Cancellation ladder and deposit. 17. House rules. 18. Transport, airport distance, hotels nearby.

**Tier 3, rarely present, high persuasive value**
19. "Previously shot here" credits per location. 20. Priced add-ons (for a café: kitchen plus chef, bowling lanes, furniture removal, props). 21. Virtual tour or walkthrough video. 22. Insurance and permit requirements. 23. Prep and strike pricing, night-shoot availability, overtime. 24. Weather and season notes, air conditioning. 25. Illustrative-dressing disclaimer and empty-versus-dressed image pairs (nobody did this well).

### Layout patterns that worked best
1. Key-facts strip under the title, before the prose (Giggster, The Ned).
2. Gallery-first thumbnail grid with lightbox, full-res download and an "other spaces" rail (1st Option, Shootfactory). Grids beat carousels.
3. Sticky enquiry panel with a pre-scoped form (Giggster, Peerspace, Scouty).
4. Structured spec block split Measurements / Power and Tech / Access / Facilities, plus PDF and floor plan (Loft Studios, Big Sky, MC Motors).
5. Per-space cards opening to a modal or sub-page with photos, floor plan and capacities by layout (Ladbroke Hall, The Standard, Ace NY): the right pattern for a 10,000 sq ft building with a café floor, a bowling alley and a courtyard.
6. Permissions as a scannable yes/no list (1st Option, Giggster).
7. Policy-first request form (Ace): lead time and rules first, then usage, budget, crew, dates, setup and strike windows.

Every shoot-hire page sampled is utilitarian in design. The only flourishes: video heroes, one walkthrough video, 360 tours, modal galleries. No page used typography, drawings or interaction as a selling tool.

### What a design-led single-venue site can do that marketplaces cannot
- Draw the building: each zone clickable to photos, dimensions, ceiling height, nearest power drop and load-in route; a section drawing showing heights to beam and rig (when the owner provides plans).
- Show the light: a sun-path and window-orientation diagram and a same-frame time-of-day series per window wall. The one thing DOPs want and nobody provides. Ahmedabad's hard light and the loft's skylights make it a genuine differentiator.
- Editorial "shot here" credits with stills and the campaign or film name, tagged by zone.
- The bowling alley as a set piece: its own spec card (lane count, length, pin-setter noise, practical lighting, whether lanes can run for camera), priced as an add-on or a buyout by day-part.
- Availability marketplaces cannot sell: overnight and 3 AM shoots, pre-opening shoots, whole-building buyout versus zone hire while trading, prep and strike at half rate, monsoon notes.
- Publish the numbers on the plan: amps and outlet positions, generator bay, truck route with door dimensions, WiFi speed, decibel note, crew parking count.
- A produced request form (Ace pattern) with WhatsApp click-to-chat alongside, and a downloadable tech pack, so the page is the location manager's deck.
- Honest imagery: empty plates alongside dressed shots, with the "dressing is illustrative" note turned into a feature.

## Synthesis

### Ranked motion vocabulary, with good versus bad execution
1. **Scroll-triggered reveals (about 17 of 30).** Well: one primitive (translate 20 to 40 px plus opacity, 0.6 to 0.9 s, a custom ease), fired once, staggered by line, with matchMedia for reduced motion. Badly: replaying on every scroll, slide-in-from-bottom on every block. Studenterkilden's `data-reveal-split="lines|words"` attribute system is the cleanest authoring pattern seen.
2. **Smooth scroll (Lenis about 15).** Well: Lenis at default lerp with the native scrollbar retained (White Desert, Drake). Badly: ScrollSmoother at `smooth: 2` and transform-based Locomotive, which feel underwater and break find-in-page and anchors.
3. **Text splitting (about 11).** Well: lines only, on the hero and section heads, masked with overflow-hidden wrappers. Badly: character splits on body copy (Tastavents, 353 split nodes), splits that reflow on resize, split copy unreadable to screen readers.
4. **Preloader (about 10).** Well: tied to real load progress and carrying meaning (Studenterkilden's branch fills with progress; Ballena's clip-path wipe on the logo and a phrase). Badly: a fixed-duration logo screen with nothing behind it; a loader before a cookie wall.
5. **Page transitions (about 10).** Well: one curtain or mist overlay of 500 to 700 ms with a persistent header and footer frame. Badly: transition plus preloader plus reveal stacked on every navigation; transitions that break the back button.
6. **Autoplay muted hero video (about 9).** Well: people and hands, postered, with visible pause and mute. Badly: a promo edit, no poster, no headline, autoplaying under a cookie modal.
7. **Parallax (about 9).** Well: small scattered images at different speeds around a fixed headline (Vander's four floating photos). Badly: background-attachment parallax on full-bleed photos; hero text pushed under the nav.
8. **Custom cursor (about 7).** Well: a label-bearing cursor that appears only on media ("Watch", "Prev", "Next"), hidden on touch. Badly: a decorative dot on everything with a lagging follower.
9. **Marquee (about 6).** Well: real content (GEM's counter-rotating dish names, Onyx's "Now Listening"). Badly: "Welcome" repeated, or award logos at speed.
10. **Sliders (about 14).** Almost always a flaw on the editorial tier: carousels hide sequence and captions. Acceptable only as a draggable horizontal row with a "1 / 7" counter, never auto-advance with dots.
11. **Pinned sections (about 8).** Well: a pinned image while text chapters scroll past, or a sticky enquire bar. Badly: pinning that traps the wheel for more than one viewport.
12. **Clip-path and mask reveals (about 4).** Well: one signature reveal for one hero image. Badly: every image wiping in.
13. **WebGL actually running (4).** Jurors reward it (Primland, Son Daven), critics fault the gates that come with it (audio prompts, rotate-device, empty HTML). Zero in the editorial and architecture set.
14. **Scroll-scrubbed image sequence (1).** The most cinematic move and the least used; only if frames are preloaded, ratio-reserved, and reduced motion falls back to a still.
15. **Horizontal layout (2).** Survivable only as horizontal rows inside a vertical page.
16. **Sound (2).** Always opt-in, never a gate.

**The motion budget the winners actually run:** one signature move (preloader or hero reveal), one page-transition primitive, one reveal primitive reused everywhere, one ambient layer (video or marquee), and everything else still. Sites that stack more lose one to two points on usability and accessibility from the same jury.

### Structural patterns of the best sites
1. Frame: fixed header with a booking or enquiry CTA; optional one-line announcement.
2. Opening: eyebrow, one display headline (15 words or fewer, or a single word at 200+ px), one-sentence dek, one or two CTAs. Either typographic on a paper ground or bleeding off a full-bleed image.
3. **The hero hands off with a full-bleed photograph or a change of ground colour, never with another text block.**
4. Chapters with eyebrows or numbers whose heads are claims, not labels.
5. A proof band: award badges as images, press quotes, or an FAQ carrying the practical numbers.
6. Practical block: hours by day, address, phone per department, map link.
7. Endings: an enquiry form, then a footer with honesty details (site credits, hygiene report, company IDs) and a handoff (prev/next, related, press package, address line). The award tier treats the footer as a last gesture, not a sitemap.

### What makes a hospitality site feel expensive
One or two licensed families, one weight each, one a serif or mono, sizes tiny or huge. Paper-toned or truly dark grounds with material colour. Restraint in copy: specifics instead of adjectives ("23 courses, 5 tables, no substitutions"; "75 seated, 100 standing, music till 3 am"). Captions and credits: photographer per image, architect and designer named, consultants and materials listed. **This is the single cheapest signal of seriousness and the least used.** Real numbers presented as design (sq ft and m², year built, capacities by layout, hours by day, prices in HTML). Pacing: full-bleed image, generous space, text, a ground-colour change between chapters. Quiet, complete technology. Honesty details in the seams.

### What reads templated or AI-generated
Inter, Poppins, Montserrat or Open Sans as the only face; gradients; identical rounded cards with a coloured left border; bento grids; hero plus three feature cards plus testimonial strip. Stock or AI imagery. "Welcome to", "unforgettable", "truly unique", "timeless charm". Uniform fade-in on every block; hover-zoom; slider arrows and dots; ScrollReveal on everything. The arrival stack of popups. Leaked CMS strings; alt text as filenames; placeholder phone numbers. Library bloat. Experience gates. And, from our own audit: placeholder boxes printing slot ids, every section in the same rhythm, an oatmeal-and-clay day palette, and a floating debug toggle.

### Gaps
1. Treat the building as the subject with full credits. The Architect's Diary fact file is a ready-made credits block no competitor can match.
2. A room-by-room walk driven by scroll. Nobody scrubs a building.
3. Light as content. Extend the clock-driven light into a sun-path diagram and a time-of-day series on the shoot page.
4. Hosting and shoot hire as designed UI, not a PDF: amps, ceiling heights, door dimensions, lane specs and crew-tier rates in the site's own typography, with an Ace-style policy-first form plus WhatsApp.
5. "Shot here / featured in" as an editorial object.
6. Open-now state and the 3 AM fact in the first viewport.
7. The menu typeset like the interiors.
8. A captioned static image rhythm instead of carousels.
9. The bowling alley as both content and product.
10. Motion that is quiet and singular: exceed the field not by adding techniques but by making the one move nobody has (light plus the walk through the rooms) and executing it with Lenis, ScrollTrigger pinning and a single mask reveal, with reduced-motion stills and Lighthouse 95+ preserved.
