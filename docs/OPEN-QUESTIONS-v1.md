# Open questions

Things needed and not had. Updated as the build goes. Nothing here has been guessed at on the site.

## Blocking for a finished site (not for the demo)
- High-resolution photography. Rishabh Goenka's files for the magazine features have not been handed over. Every image is a named slot in `content/media.json` and renders a designed placeholder until the file exists.
- Bowling alley: no images, video, lane count, pricing or hours anywhere. `/bowl` says only "recently opened".
- Productions, brands and influencers who have shot on location. Only one credit is real (NoCatch brand film, 25 Nov 2025).
- Event formats to sell and past private events by name. Only the three public events in cafe.json are used.

## Needed from the owner
- Closing time: bio says 3 AM, a Nov 2025 post says 4 AM. The site renders 3 AM (the value in cafe.json).
- Whether the kitchen is pure vegetarian (EazyDiner says so). Not rendered.
- Owner's name and spelling. Not rendered.
- Capacity per space. Not rendered; no capacity numbers appear anywhere.
- Hire pricing, and whether pricing should appear at all. Not rendered.
- Latitude and longitude for JSON-LD `geo`. Omitted from structured data until known.
- Canonical article URLs for the AD, CNT and ELLE features. The site links to the cafe's own announcement posts, labelled as such.

## Contact and domain
- No email address exists in cafe.json. Enquiry forms compose a WhatsApp message to 87805 91708 unless NEXT_PUBLIC_ENQUIRY_EMAIL is set, in which case they compose an email.
- No domain is known. Metadata, sitemap and JSON-LD use NEXT_PUBLIC_SITE_URL, falling back to localhost for the demo.

## Brand assets
- The brief refers to `assets/brand/logo.svg` with a wordmark. What exists is `assets/brand/logo barnyard.jpg`: a 320 px JPG of the mark only, no wordmark. The mark will be traced to SVG for the site, favicons and OG images; the wordmark is set in the display face until a real wordmark file arrives.
- Confirm the mark may be rendered in the site's ink colour (black steel by day, concrete at night). It is never recoloured into an accent.

## Assumptions made in the plan
- The light curve uses a fixed Ahmedabad-typical dusk window (about 18:45 to 19:30) rather than a solar calculation, and follows the visitor's local clock as specified.
- Hours in the JSON-LD are expressed as one span opening 11:00 and closing 03:00; brunch 10:00 to 13:00 is stated in copy only.
- The Knocksense feature is dated 30 Mar 2026 in cafe.json; rendered as given.

## Tooling
- `npm audit` flags the postcss copy bundled inside Next 15. The only fix offered is Next 16, which the brief excludes. Build-time only.

## Raised while building the routes

### /visit
- Is the house open every day? cafe.json meta.hours has no days field; the page says 'every day' following the homepage and JSON-LD (brunchHours is Mon-Sun).
- Closing time: 3 AM (bio) or 4 AM (Nov 2025 post)? The page renders 3 AM from meta.hours.close, as the rest of the site does.
- Brunch runs 10 AM to 1 PM but the listed opening time is 11 AM. Does the house open at 10 AM for brunch? Both values are shown exactly as given, side by side in the Hours fact file.
- Latitude/longitude (meta.geo is UNKNOWN): no map is embedded; 'Open in Maps' is a Google Maps search on the name and address. A pin would need coordinates.
- Who photographed, or will photograph, the exterior at night (visit-exterior-night)? No credit is rendered until known.
- Parking detail beyond 'Ample parking' (on-site vs street, capacity, valet) is not in cafe.json and is not rendered.
- Any real wayfinding detail (which side of Zundal Circle, distance from the circle, nearest bus/metro stop) is not in cafe.json, so 'Getting there' says only the landmark, the road and the area.

### /press
- Canonical article URLs for the Architectural Digest, Condé Nast Traveller and ELLE Decor pieces: the wall links to the cafe's own Instagram announcements, labelled as such by PressList (already in OPEN-QUESTIONS.md).
- Whether the three magazine pieces ran in print, online or both. Copy avoids 'in print'; a heading like 'In print and online' was rejected for that reason.
- Confirmation that Rishabh Goenka's photographs are the ones the magazines ran. BRIEF says so; cafe.json only names him as project photographer, so the page says 'photographed by', not 'photographed for the magazines by'.
- Whether the owner wants a press kit or downloadable image set on this page (needs the photographer's files and permission). For now 'request images' routes to call/WhatsApp only.
- Whether the recognition wall should read in date order rather than tier-then-newest; that is a PressList decision affecting the homepage as well.
- Any further coverage (awards, listicles, podcasts, radio) not in cafe.json. Nothing beyond the five entries is shown.

### /bowl
- Lane count for the bowling alley.
- The alley's own hours, and whether it simply keeps the house's 11 AM to 3 AM; the page only states the house's hours.
- Pricing per game or per hour, and whether pricing should appear on the site at all.
- Booking rules for the alley: group sizes, whether a lane can be reserved, age limits, shoe hire.
- The alley's opening date; only 'recently' is known, and a month/year would let the page date it the way press and events are dated.
- Photographs or video of the alley for the bowl-hero (16:9 / 4:5) and bowl-detail (4:5) slots, and who shot them so a credit can be added.
- Where the alley sits in the house (which floor or room it adjoins); all spatial claims were avoided.
- Whether the alley is available as part of private hire, so /host and /bowl can cross-reference it honestly.

### /menu
- Prices for the six unpriced signatures (Honey chilli lotus stem, Roasted hazelnut cold coffee, Tiramisu, Biscoff cheesecake, Watermelon mojito, Peach iced tea) and for the fixed brunch; the rows and the brunch Price line render automatically once cafe.json has them.
- Whether the owner wants the third-party 'About Rs 1,000 for two, per the EazyDiner listing' line on the page at all; it is one conditional caption and trivially removable.
- Who shot the menu photographs when they arrive, so a credit can be added to the Figure captions the way the building photographs credit Rishabh Goenka.
- Whether kitchen hours match the house hours (the page avoids claiming the kitchen serves until 3 AM) and whether the brunch really runs every day of the week (menu.brunch.hours says daily; meta.brunchHours says Mon-Sun).
- Site-wide, not this file: next/font loads only the latin subset, which does not include the rupee sign (U+20B9), so prices on /menu and the Rs 2 crore figure on / fall back to Arial/Georgia for that one glyph. Adding 'latin-ext' to the Bricolage/Newsreader subsets in app/layout.tsx would fix it if the families carry the glyph.
- The closing link is labelled 'Directions and parking' on the assumption that /visit (built by another agent) covers parking as the sitemap says; and the cross-link assumes /host exists at that path.

### /host
- Capacity per room and for the whole house (cafe.json gaps: 'Capacity numbers per space'). Not rendered; the page never states how many people any room holds.
- Hire pricing or minimum spend, and whether pricing should appear at all. Not rendered.
- Whether the house is hired whole or room by room, and whether the cafe stays open to walk-ins during a hosted evening. The copy says 'borrow the house' without claiming either.
- Which room each past event took place in. Not in cafe.json, so rooms and events are kept in separate sections with no pairing.
- Named private events actually held (birthdays, ceremonies) and the event formats the owner wants to sell. Only the three public events in cafe.json appear.
- Closing time, 3 AM or 4 AM (meta.hours.note is CONFIRM). The page renders 3 AM from meta.hours.close, as the homepage does.
- Whether The Architect's Diary's wording 'flexible and multifunctional, hosting pop-ups and performances by night' is verbatim from the article. Rendered as an attributed paraphrase, not a quotation.
- Who will photograph the hosting slots (host-hero, host-coffee-garba, host-hoodie-workshop, host-phone-free). No credit is passed until a file and its photographer are known.
- Whether the latin-subset OG fonts carry the rupee glyph (U+20B9). Avoided in the OG card; worth checking once before any route's OG line uses ₹.
- Whether the shared Enquiry component could accept a heading id so its section can use aria-labelledby like the rest of the page (one-line change in components/Enquiry.tsx, outside my allowed files).

### /spaces
- Which rooms actually hold the wardrobe doors ('north wall' names no room), the shortened Jogeshwari poster table, the ship lamps, the Chesterfield couches, the Indian seating platform and the vintage maps: captions avoid placing them, but the sections imply main floor / entry hall per the task.
- Is 'Structure: black steel' acceptable in the material list, given it comes from the main-floor description rather than design.materials?
- Is the house open every day? meta.hours has no days field; the homepage says 'every day', /spaces does not.
- Closing time 3 AM or 4 AM (existing CONFIRM on meta.hours.note); the page renders 3 AM from hours.close.
- Is the mezzanine the only wooden floor, i.e. is the courtyard floor concrete or something else? The overlook caption says 'raw concrete below', which the materials list supports for the main floor only.
- Is the courtyard usable during late hours, and which rooms are the 'quiet corners' for laptops? Nothing on the page claims either.
- When photographs arrive, are all room images by Rishabh Goenka (credit is currently passed only on the hero) or a mix with Instagram stills?

### /shoot
- Productions, brands and influencers that have actually shot on location: only the NoCatch brand film is in cafe.json, so 'Shot here' has one credit.
- Hire pricing or day rates for shoots, and whether pricing should appear at all: nothing rendered.
- Capacity per room, crew-size limits, power supply, load-in access and parking for production vehicles: none of these are in cafe.json, so the fact file and copy say nothing about them (parking is only mentioned as 'ample' on /visit-type copy, not here).
- Whether the shoot-hero photograph (main floor lit for a shoot) will be by Rishabh Goenka or by a production: I did not attach a photographer credit to the hero for that reason; the credit sits in the fact file.
- Closing time (3 AM vs 4 AM) flows from cafe.json's hours as 3 AM throughout this page, including the meta description and OG fact line.

## Raised in review
- Is the house open every day? cafe.json gives hours but no days, so the site no longer says "every day" for the main hours (brunch keeps "every day" from brunchHours.days). JSON-LD states opens and closes without days.
- Brunch is listed from 10 AM while the house opens at 11 AM. Both are rendered as given; the menu page says "open 11 AM to 3 AM; brunch from 10 AM" so the two sit together deliberately.
- Photographer credits now travel with files: add a "credit" field to a slot in content/media.json when the delivered photograph's author is known. No credit prints until then.

## Raised by the competitive research (14 Sep 2026, see docs/research/)
- Press dates and links: the site renders the dates of the cafe's own Instagram announcements. The verified article dates are Condé Nast Traveller India 12 Sep 2024 (cntraveller.in/story/cafes-in-ahmedabad/) and ELLE Decor India 10 Jun 2025 (elledecor.in/12-design-oriented-restaurants-delhi-bengaluru-amritsar-hyderabad/, by Krishna Jaisinghani). Architectural Digest India is reported as 6 Jul 2024 by Alisha Lad; the URL could not be re-confirmed because AD blocks crawlers. Confirm in a browser before it goes on the site.
- Photographer's name: ELLE Decor credits the photographs to "Rishi Goenka"; cafe.json says "Rishabh Goenka". Ask the owner which the photographer uses.
- Hours conflict online: Zomato lists 11:30 AM to midnight, District 11:30 AM to 11:59 PM, EazyDiner 11 AM to 11:59 PM, magicpin midnight to 2 AM, Justdial 11 AM to 3 AM. Neither the 3 AM close nor the bowling alley appears on any listing or article. The site will be the first public source of truth; the owner should confirm the hours he wants published.
- Justdial carries two listings with different addresses; cost for two is ₹1,000 on EazyDiner and ₹1,300 on District. Worth the owner reconciling once the site is live.

## Raised by the design critique, 15 Sep 2026
- **How many rooms?** The site now counts six everywhere, from one helper: every space in cafe.json except the facade, which is the way in rather than a room (the entry hall, main floor, mezzanine, courtyard, games corner and the alley). This matches "six distinct rooms" in cafe.json. Before this, pages said six or seven. Confirm with the owner whether the alley or the facade should count.
- **Kitchen hours.** The menu page no longer says the kitchen keeps the house's hours; nothing in cafe.json supports it. Confirm whether food is served until 3 AM.
- **Reply times.** The enquiry forms no longer promise a reply "within the day"; they say the house replies on WhatsApp. Confirm a service promise before adding one back.
- **Press weight.** AD India links to the cafe's Instagram announcement, and the CNT and ELLE pieces are multi-venue round-ups. The press wall now sorts the magazines first and sets the two tier-two sites a size down; the headline "Three magazines, one house" stays. Confirm the AD article URL so it can link to the article itself.
