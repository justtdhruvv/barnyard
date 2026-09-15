# World-best café and coffee-shop websites: evidence-based teardown (14 Sep 2026)

Method: recognition confirmed by search (Dezeen, Wallpaper*, Frame, Yellowtrace, Dezeen Awards, World's 100 Best Coffee Shops, Food & Wine, Webby). Sites pulled three ways: raw HTML (28 homepages, 18 inner pages), JS/CSS bundles grepped for library signatures, and live Playwright renders of the 11 priority sites (runtime globals, loaded fonts, fixed elements, blend modes, computed type sizes, screenshots in `docs/research/refs/`). "No GSAP or Lenis" means the globals were absent at runtime and the bundles carried no signature.

Could not fetch: Bar Luce (Cloudflare challenge), Café Kitsuné (403), Ralph's Coffee (bot-blocked), Lot Sixty One (DNS), Cafe Onion Seoul, Gota Vienna.

## Scorecard

| Site | Recognised by | Stack | Hero | Runtime motion | Type | Canvas |
|---|---|---|---|---|---|---|
| Blue Bottle | Dezeen x4 (Schemata Kyoto, Toyosu, Minatomirai) | Next.js | 4-slide product carousel, 24 px h1 | CSS fades 300 to 500 ms, sticky header | ABC Marfa / ABC Diatype | white |
| % Arabica | Dezeen (Puddle HK, Nendo Kuwait, BLUE Chengdu) | WordPress, jQuery | 100vh fixed video, no headline, page = viewport | none | calder-dark / Avenir | white + video |
| Koffee Mameya | Dezeen Awards 2022 shortlist, Wallpaper*, Frame | 2.5 KB static HTML | full-bleed photo + PNG logo | none | text as images | photo |
| Onyx Coffee Lab | #1 World's 100 Best 2026, Webby 2025 | Shopify custom, Swiper, anime.js, ScrollReveal | 100vh video, script logo, ticker bar | split-text, ScrollReveal, ticker marquee, 15 play-on-visible videos, 16 blend-mode elements | Kapra / Room-205 / Bajern / Montserrat | cream #fbfaf3 |
| Tim Wendelboe | #2 World's 100 Best 2026 | Shopify | 100vh video, h1 "Echemo" 64 px serif | banner fade only | Fedra Serif A / Fedra Sans | paper #f6ede7, green-black text |
| Higher Ground | Dezeen, Yellowtrace, ArchitectureAU | Gatsby, slick, sal.js | **typographic on paper texture, no photo** | sal.js reveals, header state on scroll | HigherGround (custom), Teodor / Sailec | paper grey #ebedec |
| Hart Bageri | ArchDaily (Spacon & X), The Brand Identity (Gretel) | Vite/React SPA | 100vh video, no headline, fixed header and footer frame | scrollY hooks, IO, blend-mode x4, cursor refs | Basel Grotesk Mono / Graphik | black #0b0b0b |
| Juno the Bakery | Dezeen (Frama), IGNANT | hand-built static | single cobalt-blue screen, 35 px light serif | logo preloader, two-panel page-transition masks | Plantin / Poppins | cobalt blue |
| Sey | Food & Wine best coffee shop in America | Shopify | photo + 22 px condensed caps h1 | none | GT America Condensed / GT Super | white |
| Kafé Magasinet | Yellowtrace, ArchDaily | Squarespace | crowd photo, 91 px hand-lettered title | Squarespace fade, grain, parallax | Hypercrack / Source Code Pro | white |
| Onibus | Sprudge; B Corp | Shopify | large logo + tagline + farm photo | Dawn slide-in | tenon / Yu Gothic | beige #f8f6f4 |
| The Barn | Roaster of the Year 2025 (self-stated) | Shopify | 100vh video, 94 px condensed promo headline | awards marquee, Dawn fades, sticky header | Chalet Comprime / Assistant | dark #0f1115 |

**Zero of the 12 use GSAP, Lenis, Locomotive, Barba, Three.js or WebGL at runtime.**

## Site by site (condensed)

- **Blue Bottle.** Two-face system (Diatype UI, Marfa uppercase display), numbered 01 to 04 pagination, 500 ms opacity as the single motion primitive. Weak: a DTC storefront; the most architecturally celebrated café brand on Earth has zero occurrences of "architect" on its cafés page; popup and cookie stack on arrival; 8.4 MB HTML; h1 at 24 px means no hero moment.
- **% Arabica.** Whole site is a fixed full-viewport film, a logo lockup, one sentence, "WATCH FILM". Nav: Philosophy, Locations, Shop, Films, Contact. Excellent: total commitment, brand as cinema. Weak: 2014 WordPress build, nowhere to go after the film.
- **Koffee Mameya.** One screen: logo, two Google Maps links, mailto. The design happens in the room; the site says where the room is. Not accessible (text as images), no hours.
- **Onyx.** Black ticker bar on top ("Now Listening: Incubus, Kendrick Lamar; Trending Coffees ▲ Power Nap ▼ Geometry" with stock-ticker arrows), 100vh farm video, handwritten wordmark, "SCROLL" cue. 23 homepage sections, 15,946 px tall, producer spotlight, 12-year award list as a section, press quotes, catering. Excellent: coffee treated as data, the ticker as an editorial device, density of ambient video. Weak: heavy old stack, Montserrat body, email popup and chat bubble.
- **Tim Wendelboe.** The h1 is a farmer's name ("Echemo"), the video is a washing station, Farms and Transparency Reports are nav items. Paper canvas, green-black serif. Weak: Shopify skeleton shows; the espresso bar is a footnote on its own site; broken inner link.
- **Higher Ground, Melbourne.** No photo in the hero: a stacked ragged headline "A / FORMER / POWER / STATION / AN ALL DAY / DINING / DESTINATION" in a custom thin inline face on speckled recycled paper, then three underlined text links. Header hidden at top, appears on scroll. HTML menu with prices and dietary codes. Events page with capacities (150 seated, 250 to 300 cocktail), wedding, celebration and corporate sections, enquiry form. Weak: 16 uncaptioned slides; the Dezeen-featured architecture is only described in words.
- **Hart Bageri.** Video of bakers between a fixed header and a fixed footer strip (copyright, Site Credits, hygiene Smiley Report); no headline; mono caps knock out over video via blend mode; contact opens as a full-screen overlay. Weak: empty HTML for crawlers, no h1, hours not on the home screen.
- **Juno the Bakery.** One cobalt-blue page, one light serif sentence, a logo preloader and two-panel page-transition wipes on a two-page site. Frama never named. The most photographed cardamom bun in Europe needs no photo.
- **Sey.** GT America Condensed caps never above 22 px over GT Super serif body. "Limited laptops on weekdays. No laptops on weekends." as brand voice. Hours everywhere. No motion at all.
- **Kafé Magasinet.** Photographs crowds, not empty rooms; hand-lettered 91 px title; every practical question one click from the nav; "public house" positioning; history "from auction house to bar".
- **Onibus.** Calm; wordmark as hero; printed-index nav. Generic Shopify beneath.
- **The Barn.** Awards marquee with logos, 94 px condensed type over dark video, per-café location cards with hours by day and a carousel. Weak: four overlays on arrival (country modal, cookie wall, trust badge, chat).

Also reviewed briefly: Toby's Estate (#1 World's 100 Best 2025; a roaster's store, nothing about the Chippendale space), Dandelion Chocolate (press-quote section from NYT, Vogue, Saveur; five location cards with live hours; the most complete content site, least distinctive design), Coutume (Splide, parallax, splitting and page-transition classes), Fuglen (Cargo site; "OSLO 1963 · TOKYO 2012 · SEOUL 2024" as a line), Stumptown, Coffee Collective, Mokonuts.

## Synthesis

### Patterns all the best ones share
1. **One hero, one sentence, or none.** Hero copy is 15 words or fewer everywhere; Arabica and Hart have no headline; Wendelboe's is a farmer's name. Nobody writes "Welcome to".
2. **Two licensed typefaces, one weight each, one of them a serif or a mono.** No site uses Inter or Helvetica as display. Display sizes are either very small and tracked (22 to 24 px) or very large (91 to 94 px). Nothing in the timid middle.
3. **Motion is almost silent.** The vocabulary is muted full-viewport video, 300 to 500 ms opacity fades, a sticky header, at most one marquee, one page-transition wipe. The loudest site (Onyx) limits itself to split-text, ticker and reveal.
4. **Full-bleed muted video is the current default hero**, and it always shows hands, farms, bakers, people walking. **Never the room.**
5. **Practical information is structural:** hours in the header or footer, per-location hours, HTML menus with prices. No PDFs anywhere.
6. **Paper-toned or truly dark canvases.** No pure white with grey UI, no gradients, no brand colour sprayed on buttons.
7. **Nav of seven items or fewer, nouns of the place.** Instagram is a link; none of the 12 embeds a feed.

### Signature moves the top tier makes
- Typographic hero on a paper texture, no image (Higher Ground).
- One-colour page as identity (Juno).
- Headline-less video inside a fixed header and footer frame; the site as a cinema (Hart, Arabica).
- Lead with a person or a place, not a product (Wendelboe, Onyx).
- The ticker as an editorial device (Onyx).
- Preloader and page-transition masks even on a two-page site: craft signals in the seams (Juno).
- Honesty details: Site Credits and hygiene report in the footer (Hart), Transparency Reports in nav (Wendelboe), laptop policy (Sey), a 12-year award list (Onyx).
- Photograph people, not furniture (Magasinet).
- Menu with dietary codes as real HTML; an events page that sells the building's scale ("1890s power station, six levels, 300 standing") (Higher Ground).
- Per-location cards with hours and a carousel (The Barn); numbered pagination (Blue Bottle).
- Blend-mode wordmark and nav over video (Hart, Onyx).

### Motion vocabulary: premium versus template
- **Reads premium:** ambient 100vh muted video that is not a promo; a single 300 to 500 ms opacity or transform primitive used everywhere; header that recedes on scroll-down and returns on scroll-up; one page-transition wipe; one split-text reveal on the hero only; a marquee whose content is real; blend-mode logo; hover equals underline or opacity, never scale; a small "SCROLL" cue.
- **Reads template:** slide-in-from-bottom on every block; slick or Swiper arrows and dots; Squarespace parallax, grain and liquid effects; ScrollReveal on everything; hover-zoom cards; the arrival stack of newsletter popup, cookie wall, country modal, trust badge and chat bubble; promotional announcement sliders.
- **Absent from all 12, therefore open territory if used with the same restraint:** Lenis smooth scroll, GSAP ScrollTrigger pinning and scrubbing, scroll-driven image sequences, WebGL or shader imagery, custom cursors, section-driven palette shifts, horizontal scroll, sound.

### The gap: what none of them do
1. **Show the architecture.** Not one Dezeen-, Wallpaper*- or Yellowtrace-featured café credits its architect or treats the space as the subject. Blue Bottle's cafés page has zero mentions of "architect"; Juno never names Frama; Higher Ground never names DesignOffice; Toby's never mentions its Chippendale design. A café famous for its building has an entirely uncontested lane: rooms as chapters, a plan, materials, scale, the architect's name.
2. **A designed press and recognition wall.** Onyx lists awards as text and Dandelion has a quote strip; nobody presents the actual magazines as a first-class, beautiful section.
3. **"Is it open right now, how do I get there, what is the light like at this hour" in the first viewport.** Hours live in footers; no site renders open-now state, day-to-night mood, or a route.
4. **A room-by-room walk driven by scroll.** Everyone uses video of people; nobody uses motion to move you through the building.
5. **Hosting as a product.** Higher Ground's enquiry form is the ceiling; nobody has capacities as UI, shoot or location hire, or a private-hire configurator.
6. **The menu as an editorial object.** Menus are absent (roasters) or utilitarian lists; none is typeset like the interiors.
7. **A palette that changes with the section or the time of day.** Magasinet's copy says "early morning to late night"; nobody renders it.
8. **Sound or music as an ambient layer.** Onyx's "Now Listening" is text only.

### Note on our current build
The existing Barnyard demo already sits squarely in this gap in *content* (architect credits, a press section, an open-now state, the light system). What it lacks is the craft the benchmark shares (a real hero moment, transitions in the seams, a fixed frame, a ticker or marquee with real content, honesty details in the footer) and the moves nobody has made (the scroll-driven walk through the rooms, the press wall as a designed object, hosting as UI).
