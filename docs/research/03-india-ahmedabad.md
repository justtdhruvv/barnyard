# India and Ahmedabad: competitive web research for The Barnyard Co. (14 Sep 2026)

Method: WebSearch for discovery; every candidate fetched raw (platform, script libraries, font links, viewport, CTAs) and rendered; Playwright desktop and 390 px screenshots for the key Ahmedabad sites (in `docs/research/refs/`). Two sub-agents covered the national coffee and restaurant/hotel sets (see `03b-india-restaurants-hotels.md`); headline claims re-verified with an independent curl sweep.

## 0. Three corrections to the brief before anyone builds the press strip

| Claim in brief and cafe.json | What the source actually shows |
|---|---|
| AD India, Nov 2024 | **AD India, 6 Jul 2024**, by Alisha Lad: "A new cafe in Ahmedabad, designed like an industrial loft, promises a welcoming experience" (architecturaldigest.in/story/a-new-cafe-in-ahmedabad-designed-like-an-industrial-loft-...). Pull quote from the architect: *"I wanted to create a space that reveals itself slowly."* |
| CNT India, Nov 2024 | **CNT India, 12 Sep 2024**: "6 design-forward cafés in Ahmedabad" (cntraveller.in/story/cafes-in-ahmedabad/). Barnyard's entry links only to Instagram and carries a CNT-inserted "reserve at District" button. |
| ELLE Decor India, Jul 2025 | **ELLE Decor India, 10 Jun 2025**: "These restaurants are a visual platter of colours, textures and decor" (12 venues; Barnyard and Chenab from Ahmedabad). |

The Architect's Diary feature (10,000 sq ft, completed 2023, photographer Rishabh Goenka) and Knocksense are confirmed as described.

**The bowling alley and the 3 AM close exist nowhere online.** Zomato lists 11:30 AM to midnight; District 11:30 AM to 11:59 PM; EazyDiner 11 AM to 11:59 PM; magicpin midnight to 2 AM; one Justdial snippet 11 AM to 3 AM. None of the four listings, nor AD, CNT, ELLE, TAD or Knocksense, mention bowling. Cost for two disagrees (₹1,000 EazyDiner, ₹1,300 District), ratings disagree (4.0 vs 3.6), and Justdial carries two listings with different addresses. The venue has no source of truth. That is the first argument for the site.

## Task A: Ahmedabad and Gandhinagar direct competitors

### Scorecard

| # | Venue (area) | Website | Stack (verified) | Score | Verdict |
|---|---|---|---|---|---|
| 1 | House of MG / The Green House / Bucky Diner | houseofmg.com | WordPress + Elementor, Swiper, 2 Lottie, hosted MP4 hero | 6.5 | The only competent local site; hotel-first, SEO-heavy, but has real Shoot and Celebrate pages and a press strip |
| 2 | The Project Café (Ambawadi) | theprojectcafe.co/ahmedabad-75 (.in is empty) | Squarespace 7.1; Open Sans, Libre Baskerville, Almarai; no motion | 6 | Clean, photo-led, works on mobile; no menu, no booking, /press 404s |
| 3 | Gulabo & Co. (Navrangpura) | gulaboandco.com | WordPress + Elementor Pro + WooCommerce + RevSlider + AOS on Hostinger; four font families | 4.5 | Template; live page shows the Hostinger placeholder email in the sidebar; hero tagline overlaps the pizza on mobile |
| 4 | Café Upper Crust | cafeuppercrust.com | WordPress + WPBakery + RevSlider; seven font families | 3.5 | Title tag "Best Restaurants Near Me in Ahmedabad"; three PDF menus; mobile hero crops to a slice of cake |
| 5 | The Yard (Maninagar) | theyardahmedabad.com | Hostinger builder (Zyro) | 3.5 | Two pages; only notable for selling "venue available for rent for photography sessions" via WhatsApp |
| 6 | Mocha (chain) | mocha.co.in | Static HTML, jQuery, RevSlider | 3 | Franchise recruitment site; menu is an image gallery |
| 7 | The Chocolate Room (4D Square, Chandkheda) | chain site | 5 KB static, no viewport meta | 2 | Franchise number page |
| 8 | KOMO by Kaffa (Bodakdev; 25 to 26k sq ft, opened Nov 2025, "the Bastian of Ahmedabad") | komobykaffa.com | A bare PDF viewer page iframing the breakfast menu | 1 | Gujarat's biggest café has a PDF as its website |
| 9 | Kaffa Coffee Roasters (CNT-featured) | none | both domains are parked redirects | 0 | Instagram, Zomato, District only |
| 10 | Pepito (Sindhu Bhavan; 13,500 sq ft; ELLE Decor 2023) | dead | pepito.co.in returns a "Test Successful" placeholder with a cert error | 0 | Instagram, Zomato, District, Design Pataki |
| 11 | Roastery Cultúr (Bodakdev) | dead | parked lander | 0 | |
| 12 | Black Bagheera (Sola) | down | DNS failure | 0 | |
| 13 to 16 | Zen Café, The Shaka Café, Itameshi, Native Stories, Crazy Plant Lady, Kamla (SEWA), Bucky | none | | | CNT lists Instagram as the sole link for each and bolts on "reserve at District" |
| 17 | Cafe Natarani (Darpana) | academy site only | | | Some listings say permanently closed |
| 18 | Cafe Alpha, Hashtag Chandkheda, Neu, Studio Coffee, Kalgi, Boho | none identifiable | | | Search budget exhausted before a second pass; flagged, not concluded |

### The five live sites that matter

- **House of MG (6.5).** Nav: Stay, Eat, Celebrate, **Shoot**, Shop, Kid Zone, Explore, Rejuvenate, Rewards. Hosted video hero, then SEO H1s. Fonts: BombshellPro script logo, Roboto, Roboto Slab, Montserrat, Playfair Display. Press strip (Vogue, GQ, Lonely Planet, SCMP, NDTV, AD, NatGeo Traveller, Forbes) plus a CNT badge. The shoot page sells product, fashion, film and pre-wedding shoots across four properties and mentions a white backdrop, **but no rates, no form, no crew, power or parking specs**: phone and email only. Three PDF menus. Booking engine plus WhatsApp. On mobile a "Need help?" widget, a WhatsApp bubble and a reCAPTCHA badge stack in the viewport. Dezeen (Sep 2023) covered its Darwin Bucky dome, the only Dezeen piece touching Ahmedabad hospitality.
- **The Project Café (6).** Full-bleed courtyard photo with "Eat / Shop / Experience" in Libre Baskerville. One embedded video, a Maps embed. No menu, no WhatsApp deep link, no reservation CTA beyond a "Book" nav item, and /press returns 404 despite being in the nav. The closest thing to a design-led café site in the city, and it is a Squarespace template with no motion.
- **Gulabo & Co. (4.5).** Dark navy pizza hero, "A Café That Celebrates Taste & Togetherness". Menu is WooCommerce product cards plus a PDF. Stats bar "10 Awards Won, 5k Daily Orders, 99 Members". Featured by The Architect's Diary.
- **Café Upper Crust (3.5)** and **The Yard (3.5)** are the two poles of the local template market.

### Who from Ahmedabad shows up in the design press

| Publication | Ahmedabad cafés and restaurants found |
|---|---|
| AD India | The Barnyard Co. (Jul 2024) only. House of MG displays an AD logo. |
| CNT India | Native Stories, Kaffa Roasters, Bucky, Crazy Plant Lady, The Barnyard Co., Kamla (Sep 2024) |
| ELLE Decor India | The Barnyard Co., Chenab (Jun 2025); Pepito (2023) |
| Dezeen | Darwin Bucky dome (Sep 2023). No café. |
| Yellowtrace | Nothing for Ahmedabad hospitality |
| The Architect's Diary | The Barnyard Co., Gulabo & Co. |

**Barnyard is the only Ahmedabad café with AD, CNT and ELLE coverage, and none of that coverage links anywhere but Instagram.**

## Task B: national best-in-class

### Speciality coffee and design-led cafés

| Site | Stack | Hero and motion | Type | Menu, events, booking | Score |
|---|---|---|---|---|---|
| Subko | Shopify | Autoplay video slider; no motion libs | Adobe Fonts: dashiell-bright, miller-headline, IBM Plex Sans and Mono | Events sold as Shopify products; Zomato and Swiggy for food | 7.5 |
| Blue Tokai | Shopify | Promo slideshow; AOS, slick, flickity | Brandon Grotesque + Cormorant | Best events engine in India: 11 cities, 8 workshop formats, ticketed; /blogs/press | 7 |
| Araku | Shopify | Flickity; marquee sections, video blocks | Montserrat + T-Star | Provenance story; events is a newsletter box | 7 |
| Copper + Cloves (Bengaluru) | Next.js | Still; Tailwind keyframes | Playfair + Inter | Most coherent palette (deep green, cream, sage, clay); no menu, no press | 6.5 |
| Cafe Lota | Nuxt 3 | Still | Bespoke Anaktoria serif + Lato | Menu renders "Loading Menu" without JS | 6 |
| Savorworks | Shopify | Muted autoplay video; Swiper | Montserrat | HTML dine-in menu; best café press wall (NDTV, GQ, Sprudge) | 6 |
| Naru Noodle Bar | Squarespace | Still + marquee | minerva-modern | JPEG to PDF menu; slot drops explained clearly | 5.5 |
| Café Panama | Webflow | IX2 load reveals + Lottie | Five Google families | PDF menu; own domain parked | 5.5 |
| Third Wave, Kaffa Cerrado, Kunzum, Koinonia | Shopify, WP, GoDaddy | Banner sliders | Lato, Roboto, Poppins, Montserrat | | 5, 5, 4.5, 2.5 |
| Perch, Noon, Larder & Folk, Mudra Design Studio | no functioning site (parked or Instagram only) | | | | |

**None of the 16 café and coffee sites loads GSAP, Lenis, Locomotive, Framer Motion, Three.js or Barba.** 8 of 12 live sites are Shopify themes.

### Restaurants and hotels
See `03b-india-restaurants-hotels.md` for the full 25-site table. Verified additions: Americano's Lenis is in a Next.js chunk; Bastian's raw HTML is a 2 KB shell; Ekaa has 52 press references and Tock; Indian Accent has 166 press references and OpenTable plus Tock; Mag St.'s enquiry form has an Occasion dropdown that includes "Shoot".

### Ranked top five in India (both sets)
1. **Americano, Mumbai (7.5).** The only Indian hospitality site with a modern stack: Next.js, self-hosted type, Lenis, 37 KB payload, one clear brand statement, a 50 Best badge. Weak: PDF menus, no events, phone-only booking.
2. **Subko (7.5).** Video hero, an Adobe Fonts serif and mono system with real voice, events sold as products. Weak: no scroll craft, press hidden.
3. **Bastian Hospitality (7).** The only real GSAP and ScrollTrigger choreography, a banquet video, a banquets route, outlet-aware WhatsApp. Weak: no SSR, 1 MB bundle.
4. **RAAS Hotels (7).** The best venue-hire pattern in the country under a Michelin Key and Condé Nast strip. Weak: Elementor bloat, generic fonts.
5. **Ekaa (7).** Hero video, palette matched to the interiors, the strongest press wall. Weak: Wix, menus hidden behind icons.

**No site in India combines a modern motion stack with a proper venue-hire flow, and nobody has a shoot page with specs and rates.**

## Task C: venue hire, shoot locations and bowling

### How Indian venues sell events and shoots online

| Source | What it shows | CTAs | Notes |
|---|---|---|---|
| VenueLook | Capacity range, veg and non-veg per plate, **half-day, full-day and per-hour rental** (₹50k, ₹1L, ₹12k per hour), parking count, alcohol yes/no | Phone, "Get free quotes", "Send me venue details on WhatsApp" | Only site publishing per-hour rental |
| Weddingz.in | **Seated versus floating capacity per hall**, two fixed slots (10 to 2:30, 6 to 10), **policy grid** (outside food, décor, alcohol, music cut-off, overnight as explicit yes/no), 30% advance, GST note | tel, gated "See Prices", schedule visit | Policy grid is the clearest in India |
| Sloshout | Per-person packages split **alcoholic and non-alcoholic** (₹1,100 / ₹1,500), minimum guests, cake policy, DJ | Check availability, WhatsApp, OTP-gated form | Matches how Indian party buyers think |
| Filmapia | Field schema: total size, floors, furnished, parking, elevator, **cost to shoot, refundable deposit, crew size, extra-crew cost, overshoot cost, permissions cost, electricity, night shoots allowed** | "Shoot Here" forms | The schema is a ready spec; every café listing is an empty stub |
| Studios (Ollar, Bombay Studio) | Dimensions in ft plus ceiling height, make-up rooms, power backup; Ollar publishes ₹2,000/hr, ₹7,000/4 hr, ₹12,000/8 hr inline | Phone, WhatsApp | Best pricing transparency found |
| Bungalows (MS Locations, Palmyra), Ministry of New | 25-image galleries, make-up rooms, "ample power", parking; **no prices anywhere** | Phone, form | Design-led spaces that force a call read as slow |
| Restaurants (Comorin, Olive, Bombay Canteen, Kunzum) | One-line "private dining room" plus email | Email, WhatsApp | Private hire essentially unsold |
| House of MG /shoot/ (local) | Four properties, shoot types, white backdrop | Phone, email | Only Ahmedabad venue with a shoot page; no rates, specs or form |

Conventions: per-plate or per-person package pricing (rental secondary; minimum spend never labelled); capacity as the hero number, ideally seated versus standing per space; slot-based timings; yes/no policy grids; stacked CTAs (tel, WhatsApp, short form, "schedule a visit"); 5 to 25-image carousels with **no floor plans, video or 360 anywhere**; shoot buyers use a separate vocabulary (sq ft, ceiling ft, power kW and backup, crew cap, deposit, overshoot rate, night shoots).

### How Indian bowling venues present bowling

| Venue | Presentation | Lanes | Pricing | Booking |
|---|---|---|---|---|
| Smaaash | "Lanes that glow"; video placeholders | not stated | hidden | empty booking shell; party form never loads |
| Amoeba | Space-theme illustrations, no lane photos | 4 (via aggregator) | hidden; recharge cards | app-first |
| Timezone (incl. Palladium Ahmedabad) | One generic image; bowling is one icon among ten | not stated | hidden; party tiers ₹999 to ₹2,250 per child | walk-in |
| The Game, Worli | 6-image gallery | not stated | hidden until checkout | **the only real online slot flow in India**: date, timeslot, party size, games, pay |
| The Game Palacio ("boutique bowling") | Mood-lit carousel | not stated | recharge tiers | link, phone, DM |
| SHOTT, BounceUp (Ahmedabad) | UV lanes, projection-mapped lanes; BounceUp has the best local photography | not stated | combos ₹499 to ₹1,799 | app, phone |
| Mall arcades | District listings | | ₹150 to 400 per person per game | phone |

Pattern: nobody publishes lane count or per-lane pricing on their own site; prices live only on District; one venue has a working slot booker; aesthetics are arcade neon, spin-to-win popups and looping offer carousels.

Borrow for a boutique café alley: a four-step slot request in The Game's shape (date, hour, lane, players, held on WhatsApp); per-lane-per-hour pricing published with weekday, weekend and peak columns once the owner confirms; the lane count and tech stated plainly; party tiers with inclusions; plain policies (shoes, bumpers, lane time, outside food). Avoid: recharge cards, combos, apps, "VIP lanes", galaxy illustrations, popups. In a café it is one of three doors: Café, Hire, Bowl.

## Synthesis

### What Ahmedabad's web presence actually looks like
- Of 18 venues checked, **9 have no website**, **4 have dead, parked or placeholder domains**, and Gujarat's largest café is a PDF in an iframe.
- The five live sites are WordPress, Squarespace and Hostinger templates. **Zero motion libraries across the city**; Google-font soups of four to seven families; PDF or image menus; SEO-stuffed titles; a Hostinger placeholder email on a live homepage; two franchise-recruitment sites. Mobile breaks on two of the five.
- The only competent site is a heritage hotel, and it wins by having Shoot and Celebrate pages and a press strip, not by design.
- Discovery is fully outsourced to Zomato, District, EazyDiner, Swiggy, magicpin, Justdial and listicles. CNT's own article can only link Ahmedabad cafés to Instagram.
- Nobody in the city has a custom build, an HTML menu with photography, a hire page with specs or pricing, a shoot page with rates, a press wall (bar House of MG), a bowling or late-night story, or a single source of truth for hours.

### Clearest opportunities
1. **Be the source of truth** for hours, the bowling alley, the address, cost for two. None of it exists online today. Publishing it wins by default and gives AD, CNT and ELLE a link that is not Instagram.
2. **Own motion in the city and the country.** Smooth scroll plus scroll-driven reveals with a slow-reveal hero (the AD quote, "a space that reveals itself slowly", is the creative brief) beats every Ahmedabad site and matches the top two in India; a restrained WebGL or scroll-driven moment would be unique nationally.
3. **Three doors: Café, Hire, Bowl.** Hire splits into Private Events (seated and standing per zone, slots, packages, policy grid, WhatsApp plus a short form with an Occasion dropdown) and Shoots (sq ft per zone, ceiling height, power and backup, load-in, crew cap, parking, rates, deposit, overshoot, night-shoot policy, a downloadable tech sheet, a "shot here" reel). Add a floor plan and a walkthrough: nobody in India has either.
4. **Press as images, not text**, above the fold, with the real article links and the AD and ELLE pull quotes.
5. **HTML menu with section anchors**; PDF only as a download.
6. **Custom SSR build with self-hosted type and a small payload** is itself a positioning statement here.
7. **Late-night and events programming** as content; no Ahmedabad venue has an events calendar.
8. **Designer credit page** for Mudra Design Studio and Rohan Bhargade: the studio has no site, so Barnyard becomes the canonical reference for its own architecture.

### India-specific audience notes
- **WhatsApp is the reservation layer.** Deep links with prefilled text appear on Bombay Canteen, Papa's, Bastian, House of MG, Kunzum, Gulabo, Upper Crust, The Yard. Booking engines are rare outside hotels and 50 Best restaurants. WhatsApp primary, native form secondary, tel always.
- **Aggregator links are expected**: Zomato and Swiggy for delivery, District and EazyDiner for table booking and bank offers (District lists 30+ card offers per venue). Link out, but mirror prices and hours on-site.
- **Google Maps deep link plus "Get directions"** is standard; the ring-road address needs a landmark line exactly as listings phrase it.
- **Mobile-first and share-first**: traffic arrives from reels and listicles on phones; the 390 px hero must carry the name, the hours and one CTA. OG images sized for WhatsApp sharing.
- **Instagram embed expectation** exists (House of MG, Bar Palladio), but host the photography yourself.
- **Tone**: the successful Indian brand voices are lower-case, warm English with light Hinglish. Avoid the local SEO register.
- **Pricing transparency is rare and therefore a differentiator.** Publishing rates reads as confidence.
- **Hygiene is part of the pitch**: parked domains, lapsed SSL, placeholder emails and a hacked award-winning restaurant show that ownership, SSL, uptime and security belong in the offer.

### Fetch limitations
WebFetch is blocked on cntraveller.in and architecturaldigest.in; both articles were retrieved via curl. Instagram cannot be fetched. Search budget was exhausted before a second pass on Neu Coffee, Studio Coffee, Kalgi, Boho and Kaffa Ahmedabad's true domain. The bowling and 3 AM facts come from the brief only; no public listing or article corroborates either.
