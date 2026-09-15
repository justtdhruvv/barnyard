import type { Metadata } from "next";
import { cafe, eventDate, fact, roomWord, rooms } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";
import { Figure } from "@/components/Figure";
import { KeyFacts } from "@/components/product/KeyFacts";
import { ProofRow } from "@/components/product/ProofRow";
import { RequestForm } from "@/components/product/RequestForm";
import { SpecBlock } from "@/components/product/SpecBlock";
import { StickyBar } from "@/components/product/StickyBar";
import { TextLink } from "@/components/ui";

const { meta, events, press } = cafe;
const size = meta.sizeSqFt.toLocaleString("en-IN");
const closeLabel = formatClock(meta.hours.close);
const buildTime = meta.buildDurationYears === 1 ? "a year" : `${meta.buildDurationYears} years`;

export const metadata: Metadata = {
  title: { absolute: `Event venue in Ahmedabad: host at ${meta.name}` },
  description: `Birthdays, ceremonies and private hire at a ${size} sq ft loft house in ${meta.address.area}, ${meta.address.region}: ${roomWord} rooms in one house, open until ${closeLabel}.`,
  alternates: { canonical: "/host" },
};

/** Event slug -> the frame that shows it. */
const EVENT_SLOT: Record<string, string> = {
  "coffee-garba": "host-coffee-garba",
  "hoodie-workshop": "host-hoodie-workshop",
  kaunversations: "host-phone-free",
};

/** The first sentence of a room description. */
function lead(text: string): string {
  const m = /^(.+?[.!?])(\s|$)/.exec(text.trim());
  return m ? m[1] : text;
}

export default function Host() {
  const gatherings = events.filter((e) => !("type" in e && e.type === "shoot-credit"));
  const diary = press.find((p) => p.publication === "The Architect's Diary");

  return (
    <>
      {/* Arrival */}
      <section className="wrap section-tight product-hero" aria-labelledby="host-title">
        <div className="stack" style={{ "--stack": "1.5rem" } as React.CSSProperties}>
          <h1 id="host-title" className="t-display">
            Borrow the house for an evening.
          </h1>
          <p className="t-lede">
            Birthdays, ceremonies, a night with people you like. What you borrow is a {meta.buildCostDisplay}, {size} sq ft
            loft house in {meta.address.area}, built over {buildTime} and designed as a home rather than a restaurant.
          </p>
        </div>
        <Figure id="host-hero" priority sizes="(min-width: 64rem) 50vw, 100vw" />
      </section>

      <section className="wrap" aria-label="Key facts">
        <KeyFacts
          items={[
            { label: "Size", value: `${size} sq ft` },
            { label: "Rooms", value: `${roomWord} in one house` },
            { label: "Open until", value: closeLabel },
          ]}
        />
      </section>

      {/* What you borrow */}
      <section className="wrap section-tight" aria-labelledby="borrow-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="borrow-title" className="t-headline">
              Brick, lamps and the hours after dark.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "2rem" } as React.CSSProperties}>
            {diary ? (
              <p className="t-lede">
                <TextLink quiet href={diary.link}>
                  The Architect&rsquo;s Diary
                </TextLink>{" "}
                described the layout as flexible and multifunctional, hosting pop-ups and performances by night.
              </p>
            ) : null}
            <SpecBlock
              groups={[
                { title: "Rooms", rows: rooms.map((s) => ({ term: s.name, value: fact(lead(s.description)) })) },
                {
                  title: "Access",
                  rows: [
                    { term: "Parking", value: fact(meta.parking)?.split(";")[0] },
                    { term: "Where", value: `${meta.address.landmark}, ${meta.address.line2}` },
                  ],
                },
              ]}
            />
            <p className="t-ui">
              <TextLink href="/spaces">Walk through all the rooms</TextLink>
            </p>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="wrap section-tight" aria-labelledby="happened-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="happened-title" className="t-headline">
              Things that have happened here.
            </h2>
          </div>
          <div className="col-main">
            <ul className="proofs">
              {gatherings.map((e) => (
                <ProofRow
                  key={e.slug}
                  name={e.name}
                  date={eventDate(e.date)}
                  line={e.description}
                  partners={"partners" in e ? e.partners : undefined}
                  slot={EVENT_SLOT[e.slug]}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="wrap">
        <RequestForm kind="host" />
      </div>
      <StickyBar text="Hi, I'd like to host something at The Barnyard Co." />
    </>
  );
}
