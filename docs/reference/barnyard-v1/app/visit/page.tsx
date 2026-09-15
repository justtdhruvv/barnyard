import type { Metadata } from "next";
import { cafe, fact, mapsHref, phoneHref, whatsappHref } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";
import { OpenNow } from "@/components/light/OpenNow";
import { Figure } from "@/components/Figure";
import { StickyBar } from "@/components/product/StickyBar";
import { ButtonLink, FactFile, TextLink } from "@/components/ui";

const { meta } = cafe;
const openLabel = formatClock(meta.hours.open);
const closeLabel = formatClock(meta.hours.close);

export const metadata: Metadata = {
  title: `Visit ${meta.name}: ${meta.address.area}, ${meta.address.region}`,
  description: `${meta.address.landmark}, ${meta.address.line2}, ${meta.address.area}, ${meta.city}. Open ${openLabel} to ${closeLabel}; brunch from ${formatClock(meta.brunchHours.open)}. Call or WhatsApp ${meta.phoneDisplay}.`,
  alternates: { canonical: "/visit" },
};

export default function Visit() {
  const parking = fact(meta.parking)?.split(";")[0];
  return (
    <>
      {/* Arrival */}
      <section className="wrap section-tight product-hero" aria-labelledby="visit-title">
        <div className="stack" style={{ "--stack": "1.5rem" } as React.CSSProperties}>
          <h1 id="visit-title" className="t-display">
            Find the house.
          </h1>
          <p className="t-lede">
            A loft house in {meta.address.area}, {meta.address.region}, open late. Ask for{" "}
            {meta.address.landmark.replace(/^Near /, "")} on {meta.address.line2}.
          </p>
          <p className="t-ui num">
            <OpenNow open={meta.hours.open} close={meta.hours.close} />
          </p>
          <div className="enquiry-actions">
            <ButtonLink href={mapsHref} primary>
              Get directions
            </ButtonLink>
            <ButtonLink href={whatsappHref}>WhatsApp</ButtonLink>
          </div>
        </div>
        <Figure id="visit-exterior-night" priority sizes="(min-width: 64rem) 50vw, 100vw" caption="The house from the road, after dark." />
      </section>

      {/* The address */}
      <section className="wrap section-tight" aria-labelledby="address-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="address-title" className="t-headline">
              {meta.address.landmark}.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "1.5rem" } as React.CSSProperties}>
            <p className="t-lede">
              {meta.address.line1}, {meta.address.line2}
              <br />
              {meta.address.landmark}, {meta.address.area}
              <br />
              {meta.city} {meta.address.postalCode}
            </p>
            <FactFile
              rows={[
                { term: "Getting there", value: `Ask for ${meta.address.landmark.replace(/^Near /, "")}, on ${meta.address.line2} in ${meta.address.area}` },
                { term: "Parking", value: parking },
              ]}
            />
            <Figure id="facade-corten" sizes="(min-width: 64rem) 40vw, 100vw" caption="The corten signage on the wall outside, under the creeper: the first thing you see." />
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="wrap section-tight" aria-labelledby="hours-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="hours-title" className="t-headline">
              Days slow down here. Nights run late.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "1.5rem" } as React.CSSProperties}>
            <FactFile
              rows={[
                { term: "Open", value: `${openLabel} to ${closeLabel}` },
                { term: "Brunch", value: `${formatClock(meta.brunchHours.open)} to ${formatClock(meta.brunchHours.close)}, ${meta.brunchHours.days === "Mon-Sun" ? "every day" : meta.brunchHours.days}` },
              ]}
            />
            <p className="t-ui">
              <TextLink href="/menu">The menu</TextLink>
            </p>
          </div>
        </div>
      </section>

      {/* Call or message */}
      <section className="wrap section-tight" aria-labelledby="contact-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="contact-title" className="t-headline">
              One number, for calls and WhatsApp.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "1.25rem" } as React.CSSProperties}>
            <div className="enquiry-actions">
              <ButtonLink href={phoneHref} primary>
                Call {meta.phoneDisplay}
              </ButtonLink>
            </div>
            <p className="t-ui">
              <TextLink href={meta.instagram}>{meta.instagramHandle} on Instagram</TextLink>
            </p>
            <p className="t-caption">
              For an event or a shoot, start with <TextLink quiet href="/host">Host</TextLink> or{" "}
              <TextLink quiet href="/shoot">Shoot</TextLink>.
            </p>
          </div>
        </div>
      </section>
      <StickyBar text="Hi, I'd like a table at The Barnyard Co." />
    </>
  );
}
