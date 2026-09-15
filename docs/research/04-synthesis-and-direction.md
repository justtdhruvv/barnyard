# Synthesis: where we stand, what the best do, and the proposed direction (14 Sep 2026)

Sources: `00-our-site-audit.md`, `01-world-cafes.md`, `02-awwwards-hospitality.md`, `02b-editorial-architecture-hotels.md`, `03-india-ahmedabad.md`, `03b-india-restaurants-hotels.md`. About 90 sites were examined; roughly 60 were fetched and their code inspected; 11 world cafés and 5 Ahmedabad sites were rendered in a browser.

## 1. The comparison in one table

Scored the way the research scored competitors (design, craft, content, motion, commercial usefulness, honesty), 10 is a site a design-literate critic would find nothing wrong with.

| Tier | Site | Score | What earns it | What loses it |
|---|---|---|---|---|
| World café, design-led | Higher Ground, Melbourne | 7.5 | Typographic hero on paper, HTML menu, events page with capacities | Uncaptioned slides, architect never named |
| World café, design-led | Onyx Coffee Lab (#1 world) | 7.5 | Editorial ticker, ambient video, awards as a section | Heavy stack, popups, Montserrat body |
| World café, design-led | Tim Wendelboe (#2 world) | 7 | Farmer's name as the h1, transparency in the nav, paper canvas | Shopify skeleton, café is a footnote |
| World café, design-led | Hart Bageri, Juno, Sey, Blue Bottle | 6.5 to 7 | Restraint, one gesture done perfectly, honesty details | Thin content, no building story |
| Awwwards hospitality | White Desert (SOTD 2026) | 8 | Mist transitions, glass cursor, editorial grid, prices inline | Consent scripts first, press logos as bitmaps |
| Awwwards hospitality | Studenterkilden, Ballena, Mùn | 7.5 | Logo-fill preloader, clip-path wipe, moon scroll sequence | Alt text as filenames, missing hours, bloat |
| Architecture and editorial | Snøhetta | 8.5 | Chaptered project dossier, facts table, captions with credits, low-res mode | Long stacked-portrait scroll |
| Architecture and editorial | Herzog & de Meuron | 8 | Photographer on every card, principals quoted, imperial plus metric | Cold, no standfirst |
| Hotels and clubs | Soho House Mumbai, Hotel Sanders, Aman | 6.5 to 7 | Capacities and brochure (Soho), video and Barba (Sanders) | Architects never credited, numberless event cards |
| India best | Americano, Subko | 7.5 | Next.js plus Lenis, self-hosted type, 37 KB HTML; events sold as products | No hire page, PDF menus |
| India best | Bastian, RAAS, Ekaa | 7 | GSAP choreography; Celebrations page with forms; press wall | No SSR, Elementor, Wix |
| Ahmedabad best | House of MG | 6.5 | Shoot and Celebrate pages, press strip | Hotel-first template, no rates or specs, widget stack |
| Ahmedabad best | The Project Café | 6 | Clean photo hero, works on mobile | Squarespace, no menu, no motion, /press 404s |
| Ahmedabad, rest | Gulabo, Upper Crust, The Yard, KOMO, Kaffa, Pepito | 0 to 4.5 | | Templates, placeholder emails, PDFs as websites, parked domains |
| **Ours, today** | The Barnyard Co. demo | **5.5 by day, 6.5 at night** | Light system, facts discipline, Lighthouse 97 to 100, type pairing | Static, placeholder boxes with debug labels, same section seven times, day palette in the oatmeal zone, no sense of the building, revenue pages don't sell |

Our content already sits in the gap every tier leaves open (architect credited, press dated, open-now state, time-of-day light). Our craft does not yet match the tier we are claiming, and the pages look unfinished without photographs.

## 2. What the research settles

**What all the best share.** One hero, one sentence or none. Two licensed faces, one weight each, one of them a serif or a mono; display type either tiny and tracked or huge, never the timid middle. Paper-toned or truly dark grounds, never white-with-grey-UI. Practical information structural, not buried: hours in the header, HTML menus, capacities as numbers. Nav of seven nouns or fewer. No Instagram feed embeds.

**The premium motion vocabulary (frequency across 17 award-winning hospitality sites).** Scroll-triggered reveals (13), smooth scroll via Lenis (11), autoplay muted video (9), parallax (9), a preloader that means something (8), line and word splitting on headlines (8), page transitions via Barba, Swup or the app router (7), a custom cursor with labels (7), a marquee with real content (5), WebGL used once and on purpose (5), a scroll-scrubbed image sequence (1, the most memorable single element in the set). GSAP plus ScrollTrigger is the engine on 12 of 17. World cafés use none of this; India's top two use Lenis and GSAP. The room to be first is wide.

**What reads templated.** Slide-up on every block, slider arrows and dots, hover-zoom cards, Squarespace grain and liquid effects, the arrival stack of popups, "Welcome to", "unforgettable", "timeless charm", alt text as filenames, stock photography, leaked CMS strings, six font families, libraries loaded twice, no hours on a bar, menus in new tabs.

**The editorial structure of a building feature.** Headline, standfirst, one-sentence lede, then a facts table (designed by, principal, team, year, duration, area, cost, photography, structural, lighting, materials). Chapters with subheads that are claims, not labels. Two paragraphs, one captioned image, metronomic. Pull quotes from named people. Mixed column widths. A handoff at the end: related, press package, address line.

**The gaps nobody fills.** Show the architecture and credit the architect (none of the Dezeen-featured cafés do; only one Awwwards site does). A press wall as a designed object. Open-now and the light of the hour in the first viewport. A room-by-room walk driven by scroll. Hosting as a product with capacities, specs and rates. A menu typeset like the interiors. A palette that changes with the hour. In India specifically: nobody combines a modern motion stack with a real hire flow, nobody has a shoot page with specs, nobody has a boutique bowling page, and in Ahmedabad nobody has a source of truth for their own hours.

## 3. Facts the research corrected

| Item | Site says today | Verified | Action |
|---|---|---|---|
| Condé Nast Traveller India | 26 Nov 2024, links to the café's Instagram | **12 Sep 2024**, "6 cafés in Ahmedabad with a design-forward focus", cntraveller.in/story/cafes-in-ahmedabad/ (datePublished verified by fetch) | Update date and link |
| ELLE Decor India | 9 Jul 2025, links to Instagram | **10 Jun 2025**, "These restaurants are a visual platter of colours, textures and decor", by Krishna Jaisinghani, elledecor.in/12-design-oriented-restaurants-delhi-bengaluru-amritsar-hyderabad/ (verified by fetch). Photo credit printed as "Rishi Goenka". | Update date and link; ask owner which spelling the photographer uses |
| Architectural Digest India | 22 Nov 2024, links to Instagram | Research agent reports **6 Jul 2024**, by Alisha Lad, "A new cafe in Ahmedabad, designed like an industrial loft, promises a welcoming experience", with the architect's quote "I wanted to create a space that reveals itself slowly." AD blocks crawlers and the slug could not be re-confirmed. | Update date once the URL is confirmed by hand in a browser |
| Hours | 11 AM to 3 AM | Zomato says 11:30 AM to midnight; District, EazyDiner, magicpin and Justdial all differ; the 3 AM close and the bowling alley appear nowhere online | Keep as the owner's stated hours; add to OPEN-QUESTIONS that the site will be the first public source of truth |

## 4. Proposed direction

**Concept stays.** "Three magazines wrote a page about this place; this site is the whole issue" and "a house you can borrow". Both are validated by the research: the editorial dossier is the strongest structure found, and the hire flow is the biggest commercial gap in the country.

**Execution changes from document to cinema.** The same discipline, delivered with the motion craft of the award tier and with the building rendered on screen instead of described.

### Pillar 1: render the building without photographs

The materials are the imagery. Six documented surfaces (oxidised corten, raw concrete, exposed brick, black steel, pallet wood, heavy planting) rendered as textured, lit surfaces that respond to the same clock that drives the palette: sun raking across corten at noon, ship-lamp warmth on brick after dark. Each placeholder frame becomes a material panel with a caption, not a beige box with a slot id. Nothing literal is invented: no floor plan we do not have, no rendered room pretending to be a photograph. When Rishabh Goenka's files arrive they drop into the same frames and the material panels become the site's secondary vocabulary.

Two ways to build it, in order of ambition:

- **WebGL material wall** (three.js, one instance, in the hero and the room walk): real normal-mapped surfaces, a directional "sun" whose angle is the clock, a warm point light after dark, grain in the shader. The boldness spent once, and the thing a critic in architecture or film has not seen on a café site.
- **Procedural CSS and Canvas textures** everywhere else: cheap, static, reduced-motion safe, and the fallback if WebGL is unavailable.

### Pillar 2: one motion system with the building's physics

The award-tier finding that matters most: **the winners run a small budget, executed perfectly.** One signature move, one transition primitive, one reveal primitive reused everywhere, one ambient layer, and everything else still. Sites that stack more (Tripletta, Tastavents) lose usability and accessibility points from the same jury, and a tasteful critic reacts the same way. So "more motion" here means a system that touches every page, not fourteen different effects. Weighted, slow, no bounce. Three verbs: **light** (the clock), **reveal** (masks in the shape of the mark's arch, hairlines that draw), **settle** (long deceleration).

**The signature, spent once: the house keeps its own hours, made visible.**
- **Arrival.** A brief preloader tied to real load progress: the arch draws, the sun rises to the current hour, the light arrives across the material wall, the hero resolves. Under two seconds; never on client navigation.
- **Hero.** Full-viewport. Very large display type, the material wall behind, the clock as the hero's instrument. The first screen carries: what it is, where it is, that three magazines wrote about it, whether it is open right now, and one action. A small scroll cue.
- **The walk through the rooms.** A pinned section on the homepage and the spine of `/spaces`: scrolling moves you through the six rooms (horizontal rows inside a vertical page, the survivable version), each a material panel lit by the clock, with the room's name, its materials and one fact. Nobody in the research scrubs a building.

**The engine.** Lenis at default lerp with the native scrollbar kept, plus GSAP ScrollTrigger, with a hard off-switch under reduced motion. The brief said no Lenis; the research shows it on 15 of about 30 award-tier sites and on both top Indian sites, and you asked for more motion. We adopt it and tune it light.

**The reveal primitive, reused everywhere.** Headlines split by line and masked, on the hero and section titles only; frames revealed by a clip-path in the arch's shape. Paragraphs never animate. Nothing slides up, nothing fades in on its own.

**The transition primitive.** A curtain in the ground colour between pages (Next.js view transitions or a small custom layer); the light state and the clock persist, so the house never "reloads".

**The ambient layer.** The light drifting with the hour, and one slow marquee with real content only: the five publications and their dates under the hero, or "Lamps on at 7:12 PM, open until 3 AM" in the header. Never promotions.

**Still, and answering an action only.** Header recedes on scroll-down and returns on scroll-up; the wordmark knocks out over the hero via blend mode. Cursor labels only on media ("drag" on the walk, "scrub" on the clock), hidden on touch. Hover is an underline that draws, or a lamp glow at night; nothing scales. The footer is a closing gesture: the mark at full width, the arch, the hour, credits.

**Reduced motion:** everything present at rest; transitions become 200 ms crossfades; the walk becomes a vertical list; the preloader does not play.

### Pillar 3: sell the three doors

Café, Host, Shoot, Bowl remain the routes; Host, Shoot and Bowl become product pages built on the schemas the research found, rendering only the fields we actually have and hiding the rest. No invented capacities, rates or lane counts; the structure shows the owner what the page becomes once he gives us the numbers.

- **`/shoot`** follows the best location pages (Giggster, Loft Studios, 1st Option, Ace): a key-facts strip under the title before any prose (10,000 sq ft, six rooms, open until 3 AM so night shoots are possible, parking); a spec block split Measurements / Light / Power / Access / Facilities with only known fields shown (light and the pallet-wood ceiling and glazing are documented; power and door dimensions are not, so they do not render); a "shot here" list (NoCatch, dated); a policy-first request form in the Ace pattern (usage, crew size, dates, setup and strike times, budget) with WhatsApp click-to-chat beside it; "Request the tech pack". Ahmedabad buyers think in half-day and full-day buyouts, so the rate structure is framed that way once the owner sets it.
- **`/host`** follows RAAS, Soho House and Weddingz: each room as a card with a one-line use case, capacities by layout when known, a yes/no policy grid when known, an Occasion selector (birthday, ceremony, corporate, brand launch, shoot), WhatsApp first, short form second.
- **`/bowl`** follows The Game's slot flow and the buyout convention: a spec card for the alley, a four-step request (date, hour, lane, players) held on WhatsApp, and the alley offered as an add-on or a day-part buyout for hosts and shoots. Lane count, pricing and hours render only when the owner confirms them.

### Also in scope

- Fix the press dates and links (section 3) and print the pull quotes.
- Day palette moved out of the oatmeal zone: black steel and corten present by day (a dark header band, corten rules, steel type on concrete), so the day state reads as the same building as the night state.
- Add a mono utility face for labels, fact files, the ticker and coordinates (the editorial-architecture pattern: Aman, Joakim, Hart). Keep Bricolage for display and Newsreader for prose; push the size contrast so display is huge and labels are tiny.
- Placeholders never print slot ids or subjects; they print a caption.
- HTML menu typeset like the interiors, with the brunch as a set piece.
- Address with a landmark line as listings phrase it, a Maps deep link, and a "Get directions" action.
- Footer honesty details: credits for architect, studio, photographer and this site; hours; the hour it is now.

### What we keep as hard constraints

No invented facts; `UNKNOWN` never renders; eight routes; no backend; WhatsApp and call as enquiry; reduced motion honoured; Lighthouse 95+ on desktop on every route; mobile performance held at 90+ where the WebGL hero is present and 95+ elsewhere; no barn or farm imagery.

## 5. Three ways to build it

| | A. Cinema (recommended) | B. Editorial motion | C. Polish only |
|---|---|---|---|
| What | Pillars 1 to 3 in full, with the WebGL material wall in the hero and the room walk | Pillars 2 and 3 in full; pillar 1 with procedural CSS and Canvas textures only, no WebGL | Keep the current structure; add reveals and transitions, hide placeholder labels, fix facts |
| Wow for a critic | Highest: nothing like it on any café site found | High: matches the Awwwards tier's vocabulary | Low: still reads as a document |
| Risk | Mobile GPU and Lighthouse; mitigated by DPR caps, a static fallback and loading the scene after LCP | Low | None, but fails the brief |
| Effort | Largest | About two-thirds of A | Small |

Recommendation: build B as the base system first, then spend the boldness once on A's WebGL hero and room walk. If the hero costs more than the budget allows on mobile, it degrades to B's textures with nothing else changing.

## 6. Decisions needed before building

1. **Photographs.** The published web-resolution images (AD, ELLE, The Architect's Diary, Instagram) exist publicly. Should the demo use them as clearly-marked temporary stand-ins, or stay photo-free? Recommendation: build photo-free so the demo never depends on rights we do not hold, and drop stills in only if you say yes.
2. **Motion budget versus Lighthouse.** Accept mobile performance in the low 90s on the homepage for the WebGL hero, or hold 95+ everywhere (which means option B)?
3. **Facts.** Apply the CNT and ELLE date and link corrections now; hold AD until its URL is confirmed in a browser. Ask the owner whether the photographer is Rishabh or Rishi Goenka.
4. **Skills.** The existing skill set covers this (motion design, overdrive, animate, frontend design, three.js shaders, materials and lighting, polish, critique, audit). Nothing further is required; a GSAP or Lenis reference would be a convenience, not a need.
