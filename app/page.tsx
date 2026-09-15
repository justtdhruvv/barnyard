import Link from "next/link";
import { Drawing } from "@/components/draw/Drawing";
import { Door, type DoorKind } from "@/components/home/Door";
import { House } from "@/components/house/House";
import { OpenNow } from "@/components/light/OpenNow";
import { addressLines, cafe, eventDate, fact, mapsHref, phoneHref, pressDate, whatsappHref, whatsappWith } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";
import { maybeDrawing } from "@/lib/maybe";
import "@/components/home/home.css";

const event = (slug: string) => cafe.events.find((e) => e.slug === slug)!;
const press = (publication: string) => cafe.press.find((p) => p.publication === publication)!;

export default function Home() {
  const { meta } = cafe;
  const open = formatClock(meta.hours.open);
  const close = formatClock(meta.hours.close);
  const ad = press("Architectural Digest India");
  const elle = press("ELLE Decor India");
  const garba = event("coffee-garba");
  const hoodie = event("hoodie-workshop");
  const nocatch = event("nocatch");
  const parking = fact(meta.parking)?.split(";")[0];

  const doors: { kind: DoorKind; title: string; proof: string; href: string; action: string; external: boolean }[] = [
    { kind: "host", title: "Host something", proof: `${garba.name} on ${eventDate(garba.date)}, and a ${hoodie.name.toLowerCase()} on ${eventDate(hoodie.date)}.`, href: whatsappWith(`Hello, I would like to host something at ${meta.name}.`), action: "Ask the house on WhatsApp", external: true },
    { kind: "shoot", title: "Shoot here", proof: `NoCatch shot their brand film on location here, ${eventDate(nocatch.date)}.`, href: whatsappWith(`Hello, I would like to ask about a shoot at ${meta.name}.`), action: "Ask about a shoot", external: true },
    { kind: "bowl", title: "Bowl", proof: "The bowling alley has recently opened. Ask the house about lanes and timings.", href: whatsappWith(`Hello, I would like to ask about the bowling alley at ${meta.name}: lanes and timings.`), action: "Ask about the alley", external: true },
    { kind: "late", title: "Work late", proof: `Open until ${close}, with quiet corners for a laptop.`, href: "/spaces#mezzanine", action: "See the mezzanine", external: false },
  ];

  const stair = maybeDrawing("mezzanine-stair");
  const entry = maybeDrawing("entry");
  const alley = maybeDrawing("alley-sign");
  const facade = maybeDrawing("facade");

  return (
    <>
      <section className="hero wrap" aria-labelledby="hero-title">
        <House />
        <div className="under-arch">
          <h1 id="hero-title" className="t-display">{meta.name}</h1>
          <p className="t-line">A house to slow down in. Come for a coffee, and stay a little longer than you meant to.</p>
          <p className="t-label hero-facts">
            <OpenNow open={meta.hours.open} close={meta.hours.close} />
            <span aria-hidden="true"> · </span>
            <span>{open} to {close}</span>
            <span aria-hidden="true"> · </span>
            <span>{meta.address.area}, {meta.city}</span>
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href={whatsappHref} rel="noopener">Message the house on WhatsApp</a>
            <Link className="btn" href="/spaces">Walk through the rooms</Link>
          </div>
        </div>
      </section>

      <section id="written" className="written wrap" aria-labelledby="written-title">
        <h2 id="written-title" className="t-label section-label">Written about</h2>
        <figure className="press-pair">
          <div className="press-drawing">{stair ? <Drawing drawing={stair} mode="scrub" /> : null}</div>
          <div className="press-words">
            <blockquote className="t-quote"><p>&ldquo;{ad.quote}&rdquo;</p></blockquote>
            <figcaption className="t-label">
              {ad.quoteBy}, <time dateTime={ad.date}>{pressDate(ad.date)}</time>.{" "}
              <a className="pen-link" href={ad.link} rel="noopener">See the feature</a>
            </figcaption>
          </div>
        </figure>
        <figure className="press-pair press-pair-flip">
          <div className="press-drawing">{entry ? <Drawing drawing={entry} mode="scrub" /> : null}</div>
          <div className="press-words">
            <blockquote className="t-quote t-quote-long"><p>&ldquo;{elle.quote}&rdquo;</p></blockquote>
            <figcaption className="t-label">
              {elle.publication}, {elle.author}, <time dateTime={elle.date}>{pressDate(elle.date)}</time>.{" "}
              <a className="pen-link" href={elle.link} rel="noopener">Read the article</a>
            </figcaption>
          </div>
        </figure>
      </section>

      <section id="ways" className="ways wrap" aria-labelledby="ways-title">
        <h2 id="ways-title" className="t-head">Four ways into the house</h2>
        <ul className="doors">
          {doors.map((d) => (
            <li key={d.kind}>
              <a className="door-card" href={d.href} rel={d.external ? "noopener" : undefined}>
                <Door kind={d.kind} />
                <span className="door-title">{d.title}</span>
                <span className="t-body door-proof">{d.proof}</span>
                <span className="t-label door-action">{d.action}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="nights night" aria-labelledby="nights-title">
        <div className="wrap nights-inner">
          <div className="nights-words">
            <h2 id="nights-title" className="t-display">The nights here are softer.</h2>
            <p className="t-line">The house stays open until {close}. The lamps come on, the bowling sign lights up, and the evening takes its time.</p>
          </div>
          <div className="nights-drawing chase">{alley ? <Drawing drawing={alley} mode="view" /> : null}</div>
        </div>
      </section>

      <section id="visit" className="visit wrap" aria-labelledby="visit-title">
        <div className="visit-drawing">{facade ? <Drawing drawing={facade} mode="view" /> : null}</div>
        <div className="visit-words">
          <h2 id="visit-title" className="t-head">Come and find the house</h2>
          <address className="t-body visit-address">
            {addressLines.map((l) => <span key={l}>{l}</span>)}
          </address>
          <p className="t-body"><OpenNow open={meta.hours.open} close={meta.hours.close} />. Open {open} to {close}.{parking ? ` ${parking}.` : ""}</p>
          <div className="btn-row">
            <a className="btn btn-primary" href={mapsHref} rel="noopener">Get directions</a>
            <a className="btn" href={phoneHref}>Call {meta.phoneDisplay}</a>
            <a className="btn" href={whatsappHref} rel="noopener">WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
