# India: design-led restaurants and hospitality brands, web audit (14 Sep 2026)

Method: each site fetched raw (script, link, font and colour grep) plus rendered copy; inner pages fetched where they exist. Wix sites ship the Thunderbolt runtime which contains `webgl`, `lottie`, `marquee`, `parallax`, `cursor` strings regardless of use; only motion actually instantiated in markup is reported.

Could not fetch (7 of 25): Slink & Bardot (domain parked), Sublime Goa (parked), Lavaash by Saby (403, listed closed), Kyma (no site), Fig at Malcha (no site, Instagram only), Coromandel Pondicherry (DNS fails; sister La Villa audited as proxy), Toast & Tonic (own domain hijacked; lives inside olivebarandkitchen.com).

## Site by site

| # | Site | Stack | Hero | Motion | Type | Menu | Events / hire | Press | Reservations | Score |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Papa's, papasbombay.com | Wix | Full-bleed muted loop video, "Reserve Now" | Wix-native only | Bodoni Moda + Helvetica Neue Light | None (/menu 404) | None (12-seat counter) | One Michelin mention | WhatsApp + email | 6.5 |
| 2 | Ekaa, ekaamumbai.com | Wix | Autoplay video block | Wix-native; menus behind icon hotspots | Custom uploads + Avenir + DIN | PDF behind icons | "Parties over 6, call" | Asia's 50 Best badges, Vogue, AD, CN | Own form + phone | 7 |
| 3 | Masque, masquerestaurant.com | Squarespace | Text-led + index slideshow | Parallax images, AJAX page transitions with loading bar | Work Sans only | HTML pages | None (Lab is R&D) | Two press pages | Phone / WhatsApp / email | 6 |
| 4 | Americano, americanobombay.com | Next.js + Tailwind | Full-bleed still, chef panel | Lenis smooth scroll, marquee, scroll-cue, float keyframes | Spectral, Source Sans 3, Hanken, Space Grotesk (next/font) | Three PDFs | None | Asia's 50 Best 2025 badge | Phone + email only | 7.5 |
| 5 | Bastian Hospitality, bastianhospitality.com | React + Vite SPA, no SSR | Full-screen banquet video | GSAP + ScrollTrigger + AOS + slick | MADE Outer Sans, Caviar Dreams, Vocago | Not detectable | Dedicated /bastianbanquets | Times Food & Nightlife x4, /awards, /mediacoverage | Per-outlet WhatsApp deep links | 7 |
| 6 | Indian Accent, indianaccent.com | Wix | Still; Delhi page has video + marquee | Wix-native, Swiper | Futura Light, Avenir, DIN | PDFs (India), HTML (NYC) | Private events page NYC only | World's 50 Best, Asia's 50 Best, Time, CN | Phone; OpenTable class present | 6.5 |
| 7 | The Bombay Canteen, thebombaycanteen.com | Shopify | Static banner | Theme sliders only | Soleil + Murden CF | Dated, versioned PDFs | Catering page with downloadable deck PDF + WhatsApp | /pages/press | WhatsApp in header and announcement bar | 6.5 |
| 8 | Mag St., foodmatters.in/mag-st + Linktree | WordPress | WP gallery | GSAP 3.0.5 + ScrollMagic (old) | Open Sans, Montserrat, Metropolis | None (Zomato) | CF7 enquiry with Occasion dropdown | None | Linktree | 4 |
| 11 | Olive Bar & Kitchen, olivebarandkitchen.com | PHP + Bootstrap | Text "scroll to set off" | Owl Carousel | Poppins | Empty shell | None | None | ReserveGo on outlet pages | 3 |
| 12 | Toast & Tonic (sub-page of Olive) | same | Text | none | Poppins | None | None | Times, EazyDiner, CNT Top Restaurant listed plainly | ReserveGo widget | 3.5 |
| 14 | Gunpowder Goa, gunpowder.co.in | WP + Elementor + Phlox | Depicter slider | Elementor parallax, Swiper | Gotham HTF (self-hosted), lowercase brand voice | HTML page | None; CF7 booking form | None | CF7 form + phone | 5.5 |
| 15 | Bomras Goa, bomras.com | Static HTML | Body background image + JS quote rotator | Quote rotator only | Browser defaults | HTML | Event catering page ("10 to 1000s") + mailto | Vogue India quote | Phone | 3.5 |
| 16 | Comorin, comorin.in | Custom PHP | fullPage.js section scroll, hotspot split image | fullPage + anime.js + barba.js + parallax.js | Montserrat | Dated PDFs + HTML | None | Asia's 50 Best, Vogue, CN, BBC Good Food | Phone / email / Zomato | 3 (hacked: gambling spam injected on /awards and footer) |
| 19 | La Villa Pondicherry (proxy for Coromandel) | WP + Elementor | Slider | Swiper, 2 Lottie | Source Sans Pro, Montserrat | PDF | Events page | One Michelin mention | SimpleBooking + WhatsApp | 5 |
| 20 | Bar Palladio Jaipur, bar-palladio.com | Contao CMS | Revolution Slider, Henry Wilson stills | RevSlider, Swiper, Colorbox, LightWidget IG feed | Sabon MT (Monotype) | HTML prose + accordion | "Contact us"; events on Villa site | 20+ press PDFs: AD ME, Vogue Living, CNT, Gestalten, Harper's, NatGeo Traveler | Contact form | 6.5 |
| 21 | Villa Palladio Jaipur, villa-palladio-jaipur.com | Contao | Splash "Enter" gate, hidden webm intro | same | Sabon | Prose | "Exclusivity & Events" buyout page, one paragraph | Press page | Synxis | 6 |
| 22 | Ahilya by the Sea, ahilyabythesea.com | WP | Autoplay loop video (hidden on mobile) | Swiper | Lato | Prose | None | CNT Readers' Choice, T+L 2016, Tatler 2015 | SimpleBooking + phone | 5.5 |
| 23 | RAAS Hotels, raashotels.com | WP + Elementor | Video hero, "Book directly", press logo strip | Swiper, Lottie x2, glass-blur buttons | Poppins, Montserrat, Lora | HTML | Dedicated /celebrations/ with 7 enquiry forms, Synxis, WhatsApp | Michelin Key 2025, CN Triple Crown 2026, logo strip (CNT, Tatler, AD, Outlook, ELLE) | Synxis + forms + WhatsApp | 7 |
| 24 | The Postcard Hotel, postcardresorts.com | Custom | Video + YouTube | slick; three jQuery versions loaded | Raleway | n/a | None found | Forbes x3 | Lead form | 5 |
| 25 | The Oberoi Patisserie, oberoihotels.com | Sitecore | Still in Swiper | Swiper, slick, Vue | Optima + EB Garamond + Verdana | Menumodo live widget | Hotel-level events page with Request-a-Proposal form | Michelin x2 | Request form + Synxis + WhatsApp | 6 |

## Ranked top five

1. **Americano (7.5).** Only modern stack in the set: Next.js, Tailwind tokens, Lenis, marquee and scroll-cue keyframes, four self-hosted families, navy/cream/brass palette, 37 KB HTML.
2. **Bastian Hospitality (7).** Real GSAP + ScrollTrigger choreography, banquet video, dedicated banquets route, outlet-aware WhatsApp deep links. Held back by a blank no-SSR shell and a 1 MB bundle.
3. **Ekaa (7).** Hero video, olive/cream/burnt-orange system matching the interiors, strongest press wall, on-brand reservation form.
4. **RAAS Hotels (7).** Michelin Key and Condé Nast strip, video hero, and the best venue-hire pattern: a Celebrations page with per-property enquiry forms, Synxis and WhatsApp.
5. **Bar Palladio / Villa Palladio (6.5).** The most editorial identity: Sabon, Henry Wilson photography, a 20-PDF press archive, an "Exclusivity & Events" buyout page. Dated Contao/RevSlider stack.

Honourable mentions: The Bombay Canteen (dated PDF menus, catering deck, WhatsApp everywhere) and Papa's (best five-page brand statement).

## Takeaways for The Barnyard Co.

- **Nobody in India combines** a modern motion stack (Americano, Bastian) with a proper venue-hire flow (RAAS, Bombay Canteen). That gap is the pitch.
- **Venue-hire patterns worth borrowing:** RAAS Celebrations page plus enquiry form; Bombay Canteen's downloadable deck plus WhatsApp CTA; Food Matters' Occasion dropdown (Birthday / Wedding / Brand Launch / Corporate / Shoot); Villa Palladio's one-line buyout page; Oberoi's Request-a-Proposal form.
- **Reservations norm in India:** WhatsApp deep links beat third-party widgets. Only Toast & Tonic (ReserveGo) and hotels (Synxis, SimpleBooking) use engines.
- **Menus:** dated, versioned PDFs or live HTML. Hiding or omitting the menu (Ekaa, Papa's) reads as a weakness.
- **Press:** logos and badges as images register; text mentions alone do not.
- **Avoid:** Elementor and Wix bloat (1 to 2.5 MB pages), no-SSR SPAs, splash gates, neglected security (Comorin's spam injection).
