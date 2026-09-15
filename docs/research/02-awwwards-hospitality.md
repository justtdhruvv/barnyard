# Award-winning hospitality web design, 2024 to 2026: motion audit (14 Sep 2026)

Method: discovery via Awwwards category pages (hotel/restaurant, food and drink, hotel booking). For each site: the Awwwards page, the raw homepage HTML via curl (WebFetch strips scripts, so HTML, linked CSS and JS bundles were grepped directly), and one inner page. JS was not executed; "motion inventory" is what libraries, class names, data attributes and Awwwards "featured elements" prove. Godly now redirects to recent.design and yielded nothing citable; the search budget ran out before CSSDA, Siteinspire or FWA could be pulled, so every citation is Awwwards. Kamezí Boutique Villas dropped (HTTP 429).

## Site by site

| # | Site | Award | Stack | Opening | Motion (verified) | Type | Menu / booking / press | Memorable | Flaw a critic flags |
|---|---|---|---|---|---|---|---|---|---|
| 1 | White Desert (Antarctic camps), white-desert.com | SOTD + Dev, Sep 2026 | Next.js on Vercel, Sanity, GSAP, Lenis | Muted Cloudflare Stream video, "Watch Film" | Mist-overlay section transitions, SVG scribble underlines, `data-scroll-speed` parallax, scrub, glass custom cursor with "Learn More / Prev / Next" labels, marquee | Cardinal Classic Long + Inter Tight + Oswald (coordinates) | No menu; enquiry page + mailto + tel; CNT and T+L links; prices inline (US $115,500) | Mist transition plus glass cursor over navy and cream | Consent scripts before content; press logos as bitmaps |
| 2 | Explore Primland, explore.ownprimland.com | SOTD + Dev, Feb 2026 | Nuxt 3, three.js, GSAP + ScrollTrigger, Lenis | WebGL explorable 3D map with seasons toggle, audio prompt | ScrollTrigger, Lenis, three.js | inferi, centra | "Inquire", two brochure PDFs | Seasons toggle on 3D terrain | Zero-content HTML, audio prompt, portrait-orientation gate |
| 3 | Crav Burgers (concept), cravburgers.shop | SOTD + Dev, Jun 2026 | Next.js, Tailwind v4, GSAP | Text preloader with progress bar; vw-scaled stacked words; three tilted cards | Loader, page transition, footer animation, cursor hide, hover swaps | Modak + Mouse Memoirs | HTML menu cards with prep time and calories; cart | vw-scaled type stack plus tilted card fan | Fictional brand; reference for motion only |
| 4 | Escape Coffee, Montréal, escape.cafe | SOTD, May 2024 | Shopify custom theme, GSAP + ScrollTrigger, Splitting.js, Swiper, Lenis | Animated intro text "Go Against the Grain" | Split-text reveals, parallax, marquee, thumbnail hover swaps, page transition element | TWK Lausanne + Molitor + Garaje | Product grid with origin and process; address + Maps; no hours | A Shopify store that reads editorial | Slogan-heavy; shipping bar and cart above the brand moment |
| 5 | Kimpton Vividora Barcelona | Nominee, Dec 2025 | Custom PHP, Swiper, jQuery | Hero slider | Swiper and CSS transitions only; excellent Hotel JSON-LD | GT Super Display + Area Normal | Booking mask, perks modal, brochure, press page, F&B hours | The GT Super / Area Normal pairing; honest perks strip | Corporate copy; leaked "translation missing" key; 199 images on rooms page |
| 6 | Badrutt's Palace, St. Moritz | Honorable Mention, Dec 2025 | Umbraco-like CMS, GSAP 3.12 + ScrollTrigger, Swiper 11 | Postered autoplay video; header season switcher with dates, live weather, webcam | Reveal classes, gsap fromTo, three autoplay videos per page | SwissNow + SwissTime + Canora Frente | 11 restaurants with meal-period eyebrows; Michelin, Gault&Millau, CNT; separate phone lines for rooms and F&B | Season-aware IA; the site behaves like a concierge | Inner-page boilerplate; weather renders "--" without JS |
| 7 | Restaurant Zimmerl (Michelin), restaurantzimmerl.at | Honorable Mention, Nov 2025 | Concrete CMS, GSAP + ScrollTrigger + ScrollSmoother + SplitText, Vegas slideshow | Background slideshow | ScrollSmoother `smooth: 2`, SplitText, staggered from, three scrub tweens, quickSetter cursor follower | rogliano + acumin-pro | Fixed 23-course menu, no substitutions; Tablein widget; Michelin, Gault&Millau, Falstaff; **interior designer credited (Meindl Cavar Concepts), the only site in the set crediting its designer** | No-substitutions confidence | Alt text is filenames ("250712 - CKP - Zimmerl - Fotoshoot 07-2025 - 0049.jpg"); "Willkommen"; `smooth: 2` is heavy |
| 8 | Mùn Rooftop, Rome, munrooftoprome.com | Honorable Mention, Aug 2025 | WordPress + Vite, GSAP, Lenis, Barba | Barba preloader, lazy video, **55-frame moon image sequence scrubbed on scroll** | Lenis, ScrollTrigger, Barba namespaces, marquee, IO reveals | Forma DJR Text + Qualettee | HTML cocktail list "ten districts, ten cocktails" with pairings; CF7 form; no hours | Moon-phase scroll sequence plus ten-rioni concept | 76 images with alts "Footer image"; 638 KB HTML; no hours on a bar |
| 9 | Restaurant GEM (2 Michelin stars), restaurantgem.com | Nominee, Oct 2025 | WordPress, jQuery, MDB, GSAP, Lenis, Barba, Swiper | First-load hero animation; on-hover dish preview | Bi-directional outlined marquee, four gsap timelines | Gilda Display + DM Sans | HTML menus with prices; Zenchef; Michelin star cards; schema openingHours | Hover-preview dish list plus counter-rotating outlined marquee | Six libraries for an 8-image page; malformed title |
| 10 | La table de Joakim (private chef), latabledejoakim.fr | Honorable Mention, Aug 2026 | Webflow, GSAP + ScrollTrigger + SplitText, Lenis, Lottie | Lottie logo loader; "UNE EXPÉRIENCE GASTRONOMIQUE, CHEZ VOUS." | Scroll animation, menu interactions | **Instrument Serif + Geist Mono** on black; mono eyebrows | Pricing tiers in HTML (60, 70, 95 €); Calendly + prefilled mailto | Instrument Serif × Geist Mono on black | GSAP loaded twice; unpinned lenis@latest; vous/tu inconsistency |
| 11 | Studenterkilden (est. 1854), studenterkilden.dk | Honorable Mention, Aug 2026 | Webflow, GSAP (ScrollTrigger, SplitText, CustomEase), Barba, Lenis 1.2.3 | **Logo-fill preloader driven by load progress**; "Scroll to discover" | `data-reveal-split="lines|words"`, reveal groups, parallax images, footer parallax, button anim targets; accordion via grid-template-rows with a custom cubic-bezier | GT Ultra Median + Helvetica Neue | Menu deliberately withheld ("a surprise until you arrive"); DinnerBooking; FAQ accordion with 75 seated / 100 standing and music till 3 am; hygiene Smiley link | Logo-fill preloader plus lines-and-words reveals | Danish title on English page; error string in DOM |
| 12 | Ballena (fine dining, Los Cabos), ballenacabo.com | Honorable Mention, Jun 2026 | WordPress custom block theme, GSAP + ScrollTrigger, Swup, Lenis | **Clip-path inset wipe preloader** on logo and phrase; hero video; split headline around an inline SVG | Every block has `data-animate`; blocks named hero, media-intro, split-content, image-cta, editorial-section, book-bar | Sweet Sans Pro + TT Commons Pro; terracotta and cream | Full HTML menu with weights; "Dinner 5:00 PM to 10:30 PM"; OpenTable; gift cards | Clip-path preloader phrase plus desert manifesto copy | Elementor bloat; empty alts; menu opens in a new tab |
| 13 | Caffè Gilli, Florence (1733), caffegilli.com | Honorable Mention, Aug 2026 | Custom CMS, Tailwind, GSAP, Splitting | Image preloader, then Vimeo-progressive video | 57 split calls, 25 gsap.to, matchMedia, cursor labels, parallax | greycliff-cf + Cosen italic; navy and powder blue | Multi-venue; e-shop; award badges as images; no bar menu; no hours | Vimeo hero plus Cosen italics on a 290-year-old brand | Thin inner pages; no drinks list on the cocktail page |
| 14 | Tandjung Sari, Bali (1962), tandjungsarihotel.com | Honorable Mention, Aug 2026 | Nuxt 3, Lenis, Swiper, three.js strings | Preloader, then a **horizontal home** with a history timeline; "Keep Scroll"; base cursor | Lenis, custom pause and mute video controls | Adobe Caslon Pro + Optima | Booking drawer; WhatsApp; per-meal menus; monograph PDF | Horizontal history timeline in Caslon and Optima | 1.38 MB HTML; four distinct alts across 22 images; horizontal home frustrates rate-seekers |
| 15 | Palazzo Sogni, Florence | Honorable Mention, Jun 2026 | WordPress, three.js + Vanta fog, Lenis, SplitText, Glide | "SCROLL DOWN" over a WebGL fog | Lenis, `data-scroll-repeat`, parallax | Sogo + Montserrat | Rooms slider; SynXis; no press | WebGL dream-fog behind the type | 107 images almost all alt="Loading"; reveals replay on every scroll |
| 16 | Sunbeam Bagels, Texas, sunbeambagels.com | Honorable Mention, Jul 2026 | Webflow, GSAP + ScrollTrigger, three.js | Two background videos; hours in the hero ("Come On In: 7am to 3pm") | **Physics bagel drop in the footer**, 14 ingredient marquees, rotating product, hidden audio | forma-djr-mono + Belgard + Archivo Narrow | Toast ordering; hours in hero and footer; good alt text | Physics bagels in the footer | Live "Button Text" placeholder; truncated headline; unused font |
| 17 | The Pop-Up Hotel, thepopuphotel.com | Honorable Mention, Jul 2026 | WordPress + WooCommerce, Lenis, Barba | Looping video hero | `data-scroll` x42, `data-cursor`, parallax | Noe Display + Satoshi | Rooms as filtered products with prices; WhatsApp | Event-based IA | Shutterstock image on a luxury card; five font families |

## Motion techniques by frequency (n = 17)

| Technique | Count |
|---|---|
| Scroll-triggered reveals and timelines (ScrollTrigger) | 13 |
| Sliders (Swiper, Glide, tiny-slider, Vegas) | 11 |
| Smooth scroll (Lenis; ScrollSmoother on Zimmerl) | 11 |
| Autoplay hero video | 9 |
| Parallax | 9 |
| Preloader | 8 (text and bar, logo progress fill, clip-path wipe, image, Lottie) |
| Text splitting (SplitText, Splitting.js, DOM duplication) | 8 |
| Page transitions (Barba, Swup, app router, mist overlay) | 7 |
| Custom cursor | 7 |
| Marquee or ticker | 5 |
| WebGL or three.js | 5 (3D map, fog, physics, strings only x2) |
| Clip-path or mask reveals | 2 |
| Sound or audio | 2 |
| Scroll-scrubbed image sequence | 1 (Mùn, 55 moon frames) |
| Horizontal scroll layout | 1 |

## Libraries by frequency

GSAP core 14 · ScrollTrigger 12 · Lenis 10 · jQuery 9 · Swiper 8 · SplitText 5 (plus Splitting.js 2) · three.js 4 · Barba 3 · Swup 1 · ScrollSmoother 1 · CustomEase 1 · Lottie 1. Platforms: WordPress 6, Webflow 3, Next.js 2, Nuxt 2, Shopify 1, others 3.

## Booking and menu stack seen
OpenTable, Zenchef, Tablein, DinnerBooking, aleno, Toast, Calendly plus mailto, CF7, SynXis, SiteMinder plus WhatsApp, WooCommerce with deposits, HubSpot plus mailto. HTML menus with prices: GEM, Ballena, Mùn, Crav, Joakim. PDF menus: Zimmerl, Tandjung. Menu deliberately withheld: Studenterkilden.

## Typography pairings worth stealing
Cardinal Classic Long + Inter Tight + Oswald · GT Super Display + Area Normal · Instrument Serif + Geist Mono · GT Ultra + Helvetica Neue · Gilda Display + DM Sans · Cosen + Greycliff CF · Canora Frente + SwissNow · Rogliano + Acumin Pro · Adobe Caslon Pro + Optima · Molitor + TWK Lausanne + Garaje · Noe Display + Satoshi · Belgard + Forma DJR Mono · Qualettee + Forma DJR Text · Sweet Sans Pro + TT Commons Pro.

## Recurring flaws a tasteful critic flags
1. Alt text as filenames or "Loading" / "Footer image".
2. Stock imagery on a luxury brand.
3. Leaked CMS strings ("Button Text", "translation missing", "Something went wrong while submitting").
4. Library duplication and bloat (GSAP loaded twice; six libraries for an eight-image page; 1.38 MB HTML).
5. Cliché luxury copy: "Welcome to", "unforgettable", "truly unique experience", "timeless charm".
6. Missing basics: no hours on a bar or historic café; no drinks list on a cocktail-bar page; menu opens in a new tab.
7. Experience gates: rotate-device or audio prompts, horizontal-only home, logo preloaders before content.
8. Nobody credits the architect or interior designer except Zimmerl.
