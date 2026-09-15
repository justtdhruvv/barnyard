import type { Metadata } from "next";
import { cafe, eventDate, fact, pressDate, roomWord, whatsappWith } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";
import { DayArc } from "@/components/light/DayArc";
import { Figure } from "@/components/Figure";
import { KeyFacts } from "@/components/product/KeyFacts";
import { ProofRow } from "@/components/product/ProofRow";
import { RequestForm } from "@/components/product/RequestForm";
import { SpecBlock } from "@/components/product/SpecBlock";
import { StickyBar } from "@/components/product/StickyBar";
import { TextLink } from "@/components/ui";

const { meta, events, press } = cafe;
const size = meta.sizeSqFt.toLocaleString("en-IN");
const openLabel = formatClock(meta.hours.open);
const closeLabel = formatClock(meta.hours.close);

export const metadata: Metadata = {
  title: "Shoot location in Ahmedabad: a magazine-published loft house",
  description: `Film, photo and brand shoots in a loft house in ${meta.address.area}, Ahmedabad: ${size} sq ft, ${roomWord} rooms, open until ${closeLabel}, featured by AD India, CNT India and ELLE Decor India.`,
  alternates: { canonical: "/shoot" },
};

export default function Shoot() {
  const credits = events.filter((e) => "type" in e && e.type === "shoot-credit");
  const tier1 = press.filter((p) => p.tier === 1).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      {/* Arrival */}
      <section className="wrap section-tight product-hero" aria-labelledby="shoot-title">
        <div className="stack" style={{ "--stack": "1.5rem" } as React.CSSProperties}>
          <h1 id="shoot-title" className="t-display">
            A set that took a year to build.
          </h1>
          <p className="t-lede">
            A {size} sq ft loft house in {meta.address.area}, {meta.address.region}: {roomWord} rooms of brick, black
            steel and tall glazing, daylight from the skylights, and ship lamps after dark until {closeLabel}. Bring the
            crew, not the dressing.
          </p>
        </div>
        <Figure id="shoot-hero" priority sizes="(min-width: 64rem) 50vw, 100vw" />
      </section>

      <section className="wrap" aria-label="Key facts">
        <KeyFacts
          items={[
            { label: "Floor area", value: `${size} sq ft` },
            { label: "Rooms", value: roomWord },
            { label: "Hours", value: `${openLabel} to ${closeLabel}` },
          ]}
        />
      </section>

      {/* What the camera gets */}
      <section className="wrap section-tight" aria-labelledby="sheet-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="sheet-title" className="t-headline">
              What the camera gets.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "2rem" } as React.CSSProperties}>
            <p className="t-lede">
              Every room is dressed the way the house is every day: salvaged furniture from Jogeshwari market,
              Chesterfield couches, vintage maps of Ahmedabad, work by regional artists and heavy planting.
            </p>
            <SpecBlock
              groups={[
                {
                  title: "Light",
                  rows: [
                    { term: "By day", value: "Skylights and floor-to-ceiling windows on the main floor" },
                    { term: "After dark", value: "Ship lamps and layered lighting" },
                    { term: "Night shoots", value: `The house is open until ${closeLabel}` },
                  ],
                },
                {
                  title: "Surfaces",
                  rows: [
                    { term: "Walls", value: "Exposed brick; a facade of upcycled bottles in metal mesh" },
                    { term: "Floors", value: "Raw concrete; wood on the mezzanine" },
                    { term: "Ceiling", value: "Pallet-wood strips from fruit-vendor crates" },
                    { term: "Structure", value: "Black steel; oxidised corten signage and doors" },
                  ],
                },
                {
                  title: "Access",
                  rows: [
                    { term: "Parking", value: fact(meta.parking)?.split(";")[0] },
                    { term: "Where", value: `${meta.address.landmark}, ${meta.address.line2}, ${meta.address.area}` },
                  ],
                },
                {
                  title: "Published",
                  rows: tier1.map((p) => ({
                    term: p.publication,
                    value: (
                      <TextLink quiet href={p.link}>
                        {pressDate(p.date)}
                      </TextLink>
                    ),
                  })),
                },
              ]}
            />
            <p className="t-body">
              Power, load-in and rates are confirmed for each production.{" "}
              <TextLink href={whatsappWith("Please send the tech pack for a shoot at The Barnyard Co.")}>Ask for the tech pack</TextLink>
            </p>
          </div>
        </div>
      </section>

      {/* Light through the day */}
      <section className="wrap section-tight" aria-labelledby="light-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="light-title" className="t-headline">
              Light through the day.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "1.5rem" } as React.CSSProperties}>
            <p className="t-body">
              By day the skylights and floor-to-ceiling windows do the work; after dark the ship lamps and the layered
              lighting take over. Drag the sun along the arch and the page moves from skylit noon to the small hours, so
              you can see the house at the hour you would be shooting.
            </p>
            <DayArc openLabel={openLabel} closeLabel={closeLabel} place={meta.address.area} />
          </div>
        </div>
      </section>

      {/* Shot here */}
      <section className="wrap section-tight" aria-labelledby="shot-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="shot-title" className="t-headline">
              Shot here.
            </h2>
          </div>
          <div className="col-main">
            <ul className="proofs">
              {credits.map((e) => (
                <ProofRow
                  key={e.slug}
                  name={e.name}
                  date={eventDate(e.date)}
                  line={e.description}
                  slot="shoot-nocatch"
                  caption="A frame from the film, shot at a table by the windows."
                />
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="wrap">
        <RequestForm kind="shoot" />
      </div>
      <StickyBar text="Hi, I'd like to enquire about a shoot at The Barnyard Co." />
    </>
  );
}
