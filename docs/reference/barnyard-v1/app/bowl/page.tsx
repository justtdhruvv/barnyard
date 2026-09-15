import type { Metadata } from "next";
import { cafe, roomWord } from "@/lib/cafe";
import { Figure } from "@/components/Figure";
import { RequestForm } from "@/components/product/RequestForm";
import { StickyBar } from "@/components/product/StickyBar";
import { TextLink } from "@/components/ui";

const { meta } = cafe;
const sqft = meta.sizeSqFt.toLocaleString("en-IN");

export const metadata: Metadata = {
  title: `Bowling in ${meta.address.area}, ${meta.address.region}`,
  description: `The Alley: a bowling alley, recently opened inside ${meta.name}, a ${sqft} sq ft loft house in ${meta.address.area}, ${meta.address.region}. Message to ask about lanes and timings.`,
  alternates: { canonical: "/bowl" },
};

/** The rooms to go with a game, in this order. Copy comes from cafe.spaces. */
const ROOMS = ["games", "main-floor", "courtyard"];

export default function Bowl() {
  const rooms = ROOMS.map((slug) => cafe.spaces.find((s) => s.slug === slug)).filter((s) => s !== undefined);

  return (
    <>
      {/* Arrival */}
      <section className="wrap section-tight product-hero" aria-labelledby="bowl-title">
        <div className="stack" style={{ "--stack": "1.5rem" } as React.CSSProperties}>
          <h1 id="bowl-title" className="t-display">
            The Alley is open.
          </h1>
          <p className="t-lede">
            The newest room in the house has a sign outside that says BOWL. Lanes, timings and what a game costs: ask
            us, and someone at the house will know.
          </p>
        </div>
        <Figure id="bowl-hero" priority sizes="(min-width: 64rem) 50vw, 100vw" />
      </section>

      {/* Before or after a game */}
      <section className="wrap section-tight" aria-labelledby="around-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="around-title" className="t-headline">
              Before a game, or after.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "1.5rem" } as React.CSSProperties}>
            <p className="t-lede">
              The alley is one room in a house of {roomWord}. The rest of the evening is already there: a pool table and
              a shelf of books, the main floor under its lamps, the courtyard open to the sky.
            </p>
            <ul className="rows">
              {rooms.map((room) => (
                <li key={room.slug} className="use-row">
                  <h3 className="t-title use-name">{room.name}</h3>
                  <div className="use-body stack" style={{ "--stack": "0.5rem" } as React.CSSProperties}>
                    <p className="t-body">{room.description}</p>
                    <p className="t-ui">
                      <TextLink href={`/spaces#${room.slug}`}>More about {room.name.replace(/^The /, "the ")}</TextLink>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Figure id="bowl-detail" sizes="(min-width: 64rem) 40vw, 100vw" caption="The pin and the OPEN sign, outside The Alley." />
          </div>
        </div>
      </section>

      <div className="wrap">
        <RequestForm kind="bowl" />
      </div>
      <StickyBar text="Hi, I'd like to book a lane at The Alley." />
    </>
  );
}
