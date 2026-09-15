# "Editorial feature about a building": web reference audit (14 Sep 2026)

Scope: architecture studio sites, magazine feature pages, and design-led hotels and members' clubs, checked for structure, motion, type and credits. Text fetched with WebFetch; tech and fonts from raw HTML (and the Wayback Machine where sites block bots). Fully JS-rendered or bot-blocked sites are flagged.

One incidental find: The Architect's Diary feature on The Barnyard Co. (24 Jan 2025) carries a full Fact File that is a ready-made credits block: Mudra Design Studio; Principal Architect Ar. Rohan Bhargade; team Ramarao Uttarala and Akshay Mandaokar; 2023; one year; 10,000 sq ft; photographs courtesy Rishabh Goenka; consultants Induce Engineering, Sai Steels, Mahadev Construction, Arihant Innovations (lighting). Mudra Design Studio has no findable website, only Instagram.

## Group 1: architecture studio sites

### Snøhetta, snohetta.com (the strongest reference in the set)
- Recognition: Siteinspire (Feb 2024), Visuelt Green Award 2024, Communicator Award 2025. Custom typeface "Dovre" by Dinamo; dev by Værsågod.
- Home: one-line manifesto, featured-projects carousel, disciplines, news, events table, then a footer with **data-usage toggles: Dark mode / Simplified / Low-res**.
- Project page (Restaurant Huset, Svalbard): hero, title, one-line subtitle, years and disciplines, **one-sentence lede**, facts table (typologies, status, location, client, collaborators, size, photography with three credits), then about 1,100 words in **subheaded chapters** ("A place shaped by conditions", "Design of contrasts", "Light, textiles, and spatial atmosphere"), each chapter one text block plus 4 to 7 stacked portrait images with captions, embedded video, "Related Projects: Shuffle" carousel.
- Motion and tech: custom Tailwind, component architecture (ImageGallery, PageHeader, LoadingBar, RelatedProjects, UserPreferences), Lottie logo, image swap on link hover, ratio-reserved bandwidth-aware images with low-res and high-res srcsets, 200 to 500 ms eased transitions. No GSAP, Lenis or three.js. Restrained by design (a carbon-footprint brief).
- Type and colour: Dovre Social Light and Light Italic only; grey scale, white ground, optional dark mode.
- Expensive because: one custom face doing everything; captions on every image with photographer named; the low-res and simplified modes signal ethics as taste; chaptered dossier structure.
- A critic faults: stacked portraits become a long scroll with little rhythm change; studio-speak copy; the news and events tables on home dilute the manifesto.

### Herzog & de Meuron, herzogdemeuron.com
- Launched Jan 2023 (Fertig Design). Home is one mixed chronological feed of news and project cards, each with project number, title, location and **photographer credit on the card**.
- Project page (Sotheby's, 648 Madison): title with number, location and years, straight into an essay with subsections, **image essays grouped by theme** (archival, material close-ups, programme diagram, before and after, interiors, exterior), captions like "Photograph by Stefan Ruiz, Courtesy of Sotheby's", **pull quotes from named principals**, a "Facts" block (client, consultants, site area, GFA in sq ft and sq m, height, engineers), "Related" mixing news about this project with other projects, "Back to Projects", Print view.
- Tech: WordPress custom theme, **Alpine.js and Swup page transitions**, sticky page title. Fonts: Suisse Works (serif body), HdM Geometric (custom), ABC Gravity (display).
- Expensive because: project numbers, imperial plus metric, drawings and archival photos treated as equals to glossy shots, principals quoted by name, press tied to project.
- Faults: dense and cold; no standfirst so the story starts slowly; undifferentiated home feed.

### Norm Architects, normcph.com
- WordPress Divi child theme, Slick, jQuery. Home: a long run of about 30 featured projects, then curated strips ("Latest Work", "Hospitality Projects", "Soft Minimal", "Objects of Desire"), reading like magazine section fronts.
- Project page (TRUNK Hotel Yoyogi Park): title, category tags, **lede paragraph**, details (location, photography by partner Jonas Bjerre-Poulsen, category, year), about 2,200 words alternating full-width text and single or grouped images, one indented pull quote, sparse captions, Prev / Next project, 54-thumb index gallery, **"Press Package" button** (Presscloud). Mixed column widths (1/4, 1/3, 1/2, 3/8) create the editorial rhythm.
- Type: Euclid (grotesk) plus Adobe Caslon Pro. Warm off-white, grey text, no colour.
- Expensive because: consistent 4:5 and 1:1 crops, generous whitespace, long-form copy about atmosphere rather than specs, press package for journalists.
- Faults: Divi bloat, over-long repetitive essay ("harmonious", "seamless"), most images uncaptioned, bare prev/next handoff.

### Kengo Kuma and Associates, kkaa.co.jp
- WordPress plus Swiper. Projects grid with **photographer credit on every thumbnail**, NEW/OPEN status labels. Project page: hero, paragraph, exhaustive credits (team lead, structure, facility, landscape, three photographers), gallery with "© Forward Stroke Inc." captions, related projects, **Publications and Awards lists**.
- Type: Open Sans. Utilitarian. Expensive because of archival completeness; faults: generic type, no pacing, feels like a database.

### Vincent Van Duysen, vincentvanduysen.com
- Craft CMS, Swiper, infinite scroll. Category pages are single-column: one project = one large carousel with a "1/7" counter, title, location, year range, "More info" expanding in place (empty hrefs, no deep links).
- Type: Custodia Pro (serif) plus News Gothic. Black on white, tiny UI text, enormous images.
- Expensive because: almost no words; every image a considered composition; monographs as a bibliography. Faults: no deep links or SEO; carousels hide the sequence; zero captions or credits.

### Studio KO, studioko.fr
Not usable as a reference: 2013-era jQuery and Flash-shim build, PHP notices on the project list, Arial. The good Studio KO feature lives on Dezeen.

### Studio Mumbai, studiomumbai.com
One page: a map image, name, address, email, phone. A stance, not a reference.

## Group 2: magazine feature pages

### Dezeen, Sahbi Sahbi by Studio KO (Jan 2023, via Wayback)
H1, byline and date, hero, **summary lede paragraph**, then a strict **two paragraphs / one captioned image** cadence to the end (about 500 words, six images), an inline related-story card mid-body, credit sentence at the end. **Every caption is a declarative sentence** describing a material or move ("Warm wood was used for the ceiling, walls and table and chairs"). Studio quoted every other paragraph. Credits are prose, not a table.

### Wallpaper*, Park Hyatt Tokyo (2026)
Headline, **standfirst**, byline and date, hero with bracketed image credit, then **fixed review subheads**: "Wallpaper* checks into...", "What's on your doorstep?", "Who is behind the design?" (designer interview), "The room to book", "Staying for drinks and dinner?", "Where to switch off?", "The verdict". About 2,100 words. **Address line and link close the piece.**

### Yellowtrace, Daily Press café Abu Dhabi (Dec 2025)
About 420 words in five short paragraphs, then a 23-image gallery with no individual captions and a single bracketed credit line. Seventeen tags including materials.

### The Architect's Diary (Under The Neem Tree, Sep 2024; The Barnyard Co., Jan 2025)
SEO headline, standfirst, date, **Editor's Note** as italic pull quote, subheads that are claims ("The Entrancing Facade", "Repurposed Charm"), each a paragraph plus 2 to 5 lightbox images, then a **Fact File** table: designed by, project type, name, location, year, duration, size, cost, principal architect, team, photograph courtesy, products, materials and vendors, consultants, firm links. The most complete credits schema in the set.

### Architectural Digest India
Not fetchable (domain blocked). From the known template, unverified: kicker, headline, dek, byline with photographer credit in the header, full-width hero, "Also read:" inline links, single-column images with short captions and "Photo: Name" under each.

## Group 3: hotels and members' clubs

### Hotel Sanders, hotelsanders.com
- **Awwwards Nominee (Aug 2023)** plus CSSDA Best UI. Full-bleed video hero with no headline, "Book Table / Book Room" in nav, tile grid of house areas, two enquiry forms. About page: two prose paragraphs and a video; **designers Lind + Almond never credited**. Meetings and Events: video hero, seven offering cards with **no capacities or areas**.
- Tech: WordPress GeneratePress, Swiper, **Barba.js page transitions**, enter-view scroll reveals, Caspeco booking, Gravity Forms. Fonts: Darby Sans Poster display over Open Sans and Roboto Condensed.
- Expensive because: video-led, dark palette, tight tile grid, warm photography, app-like transitions. Faults: no headline, no story, no credits, numberless event spaces, Google fonts under a posh display face.

### Ett Hem, etthem.se
- Home is essentially one line ("For people looking for something more personal than the luxury hotel"), SLH and CNT logos, contact. House page: one sentence, "Come in ↓", full-bleed carousels with mute toggles and "1 /" counters. About names the 1910 townhouse, Ilse Crawford and owner Jeanette Mix, and says "Use the house to suit your occasion".
- Type: custom Remontoire serif. Cream and white. Radical brevity; designer named as a matter of fact. Faults: almost no information, carousels hide images, soft GIF hero.

### Aman, aman.com (Amangiri)
- Drupal, Slick, Vimeo. Property page: auto-advancing full-bleed carousel, one-sentence lede, **sticky Reserve bar**, stacked kicker-plus-headline sections including "Celebrations / Host the perfect event" and "Getting here" with airports. **Architects never credited.**
- Type: Spectral serif, Source Sans 3, Source Code Pro mono for labels, plus four legacy families still loaded. Sand and stone palette.
- Expensive because: kicker and headline pairs, small mono labels, restrained copy, the 900-acre number. Faults: carousel hero, no captions, no architecture credit, six font families, identical template across 36 resorts.

### Soho House, sohohouse.com (Mumbai)
- Nuxt plus Astro islands, Splide, Barba, Vimeo. House page sections: overview, bedrooms, eat and drink, health club, **event spaces**, **art collection**, information. Event spaces: per-space cards with **name, capacity ("14 to 70 seated"), one-line use case, image**, then "Make an enquiry" and **"View brochure" PDF**.
- Type: HK Grotesk plus Cardo. Black and cream. Faults: 1.4 MB HTML, carousels everywhere, no building story, corporate tone.

### Ace Hotel, acehotel.com (Kyoto)
- Video hero with stacked logo, one-line love letter, sections Rooms, Offers, Eat + Drink, Goings On, Neighborhood, Private Spaces. Mentions the former telephone office building but **no Kengo Kuma or Commune credit**.
- Type: Bianco Sans, Toronto Gothic, Interstate, Mabry Pro, Tiempos Headline. Events programme treated as content. Faults: five families, missing design credit, generic room grid.

### The Hoxton, thehoxton.com (Shoreditch)
GT America plus Tiempos Fine; line-illustration hero, voice-led copy, over 100 Swiper instances, no design credit.

### The Newt, Locke, Six Senses
Blocked live; Wayback only (ProcessWire and Craft CMS respectively). Not assessable.

### Babylonstoren, babylonstoren.com
Cormorant Garamond plus Nunito Sans, Cloudinary video, inline audio (SoundCite), live webcams, a journal, a Press link. Hotel page opens with a Telegraph review quote as the lede. No architect credit.

## Synthesis

### Structural patterns the best building-feature pages share
1. **Headline, one-line standfirst, lede sentence, then facts.** The facts table sits before the essay (Snøhetta) or after (Herzog & de Meuron, Architect's Diary), never absent.
2. **A structured credits block with fixed labels.** Best schema: designed by, principal, team, client, location, year, duration, area in sq ft and sq m, photography, structural, lighting, contractors, materials and vendors. Photographer named in the header and again per image.
3. **Chaptered body with subheads that are claims, not labels.** Each chapter is one or two paragraphs plus two to five images.
4. **Metronomic image rhythm with declarative captions.** Two paragraphs, one captioned image. Captions describe a material or a move so the body can stay narrative. Norm and Van Duysen show the failure mode: beautiful images, no captions.
5. **Pull quotes from named people.** The architect's voice is content.
6. **Mixed column widths, not a uniform grid.** Portrait pairs beside a full-bleed landscape is the standard beat; images grouped by theme.
7. **A handoff at the end:** prev/next, related that mixes press with projects, publications and awards lists, a press package download, an address line and link.
8. **One custom or licensed family, two weights, serif for the essay; mono or small caps for labels.** Tech is quiet: Swup or Barba transitions, scroll reveals, ratio-reserved lazy images, low-res and dark toggles. **No WebGL anywhere in this set.**

### Five things studio and magazine sites do that hospitality sites usually do not
1. **Credit the architect, photographer and consultants.** Aman, Ace (Kengo Kuma!), Sanders, Hoxton and Babylonstoren name nobody. Only Ett Hem does, in prose. The café can own this outright.
2. **Give the building a history and numbers** (year, area, what it was before, cost) instead of amenity lists.
3. **Caption images.** Hotels use uncaptioned carousels; magazines use single, captioned, static images in reading order.
4. **Write long, chaptered, quotable copy** and let the space be the subject. Wallpaper*'s fixed question set ("Who is behind the design?", "The verdict") is a ready-made spine.
5. **Provide a press layer**: press package PDF, publications and awards lists, and event spaces with **capacity, area, one-line use case and a brochure** (Soho House) rather than numberless cards (Sanders).
