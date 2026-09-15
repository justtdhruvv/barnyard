import type { Metadata } from "next";
import { cafe, fact, phoneHref, whatsappHref } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";
import { OpenNow } from "@/components/light/OpenNow";
import { Figure } from "@/components/Figure";
import { FactFile, TextLink } from "@/components/ui";
import "./styles.css";

const { meta, menu } = cafe;
const closeLabel = formatClock(meta.hours.close);
const brunchOpen = formatClock(meta.brunchHours.open);
const brunchClose = formatClock(meta.brunchHours.close);

export const metadata: Metadata = {
  title: `Menu: a few things to order at ${meta.name}`,
  description: `${menu.cuisines.join(", ")}. A handful of signatures and a fixed brunch, ${brunchOpen} to ${brunchClose}, at a loft house in ${meta.address.area}, Ahmedabad. Open until ${closeLabel}.`,
  alternates: { canonical: "/menu" },
};

/** "Italian and North Indian cooking, with desserts, coffee and mocktails." */
function cuisineLine(list: string[]): string {
  const [a, b, ...rest] = list;
  const tail = rest.map((c) => c.toLowerCase());
  const tailText = tail.length ? `, with ${tail.slice(0, -1).join(", ")}${tail.length > 1 ? " and " : ""}${tail[tail.length - 1]}` : "";
  return `${a} and ${b} cooking${tailText}.`;
}

export default function Menu() {
  const brunch = menu.brunch as { name: string; hours?: string; includes?: string[] };
  return (
    <>
      {/* Arrival */}
      <section className="wrap menu-hero" aria-labelledby="menu-title">
        <div className="stack" style={{ "--stack": "1.5rem" } as React.CSSProperties}>
          <h1 id="menu-title" className="t-display">
            Order something, then stay a while.
          </h1>
          <p className="t-lede">
            {cuisineLine(menu.cuisines)} A fixed brunch, {brunchOpen} to {brunchClose}.
          </p>
        </div>
        <Figure id="menu-curriza" priority sizes="(min-width: 64rem) 40vw, 100vw" caption="Curriza, the handmade pizza, cut on the board." />
      </section>

      {/* Signatures */}
      <section className="wrap section-tight" aria-labelledby="signatures-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="signatures-title" className="t-headline">
              A few things to order.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "2rem" } as React.CSSProperties}>
            <ul className="menu-list">
              {menu.signatures.map((item) => (
                <li key={item.name} className="menu-item">
                  <span className="menu-cat t-meta">{item.category}</span>
                  <span className="menu-name">{item.name}</span>
                  <span className="menu-price t-ui num">{fact(item.price) ?? ""}</span>
                </li>
              ))}
            </ul>
            <div className="menu-side">
              <Figure id="menu-coffee" sizes="(min-width: 64rem) 30vw, 100vw" caption="Poured at a table after dark." />
              <Figure id="menu-brunch" sizes="(min-width: 64rem) 30vw, 100vw" caption="Pizzas, toasts and shakes on the main floor." />
            </div>
          </div>
        </div>
      </section>

      {/* Brunch */}
      <section className="wrap section-tight" aria-labelledby="brunch-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="brunch-title" className="t-headline">
              {brunch.name}.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "1.25rem" } as React.CSSProperties}>
            {brunch.includes?.length ? <p className="t-lede">A set spread: {brunch.includes.join(", ")}.</p> : null}
            <FactFile
              rows={[{ term: "Hours", value: `${brunchOpen} to ${brunchClose}, ${meta.brunchHours.days === "Mon-Sun" ? "every day" : meta.brunchHours.days}` }]}
            />
          </div>
        </div>
      </section>

      {/* Come by */}
      <section className="wrap section-tight" aria-labelledby="comeby-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="comeby-title" className="t-headline">
              Come by.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "1rem" } as React.CSSProperties}>
            <p className="t-body">
              {meta.address.landmark}, {meta.address.line2}, {meta.address.area}, {meta.city} {meta.address.postalCode}.
            </p>
            <p className="t-ui num">
              <OpenNow open={meta.hours.open} close={meta.hours.close} />
            </p>
            <p className="t-ui num links-row">
              <a className="link" href={phoneHref}>
                Call {meta.phoneDisplay}
              </a>
              <TextLink href={whatsappHref}>WhatsApp</TextLink>
              <TextLink href="/visit">Directions and parking</TextLink>
            </p>
            <p className="t-caption">
              For a big table, or the whole house, <TextLink quiet href="/host">host something</TextLink>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
