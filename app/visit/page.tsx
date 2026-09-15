import type { Metadata } from "next";
import { Sheet, type Photo } from "@/components/draw/Sheet";
import { OpenNow } from "@/components/light/OpenNow";
import photos from "@/content/photos.json";
import { addressLines, cafe, fact, mapsHref, phoneHref, whatsappHref } from "@/lib/cafe";
import { formatClock } from "@/lib/daylight";
import { metaFor } from "@/lib/drawings";
import { maybeDrawing } from "@/lib/maybe";
import "@/components/home/home.css";

export const metadata: Metadata = { title: "Visit", description: `Find ${cafe.meta.name} on ${cafe.meta.address.line2}, ${cafe.meta.address.landmark}, ${cafe.meta.address.area}, ${cafe.meta.city}.` };

export default function Visit() {
  const { meta } = cafe;
  const facade = maybeDrawing("facade");
  const photo = (photos as Record<string, Photo>).facade ?? null;
  const parking = fact(meta.parking)?.split(";")[0];
  const brunch = meta.brunchHours;
  return (
    <section className="visit wrap visit-page" aria-labelledby="visit-page-title">
      <div className="visit-words">
        <h1 id="visit-page-title" className="t-display">Come and find the house</h1>
        <p className="t-line">Look for the corten sign under the creepers. The door is just past it.</p>
        <address className="t-body visit-address">
          {addressLines.map((l) => <span key={l}>{l}</span>)}
        </address>
        <p className="t-body">
          <OpenNow open={meta.hours.open} close={meta.hours.close} />. Open {formatClock(meta.hours.open)} to {formatClock(meta.hours.close)}.
          {" "}Brunch {formatClock(brunch.open)} to {formatClock(brunch.close)}, every day.
          {parking ? ` ${parking}.` : ""}
        </p>
        <div className="btn-row">
          <a className="btn btn-primary" href={mapsHref} rel="noopener">Get directions</a>
          <a className="btn" href={phoneHref}>Call {meta.phoneDisplay}</a>
          <a className="btn" href={whatsappHref} rel="noopener">WhatsApp</a>
          <a className="btn" href={meta.instagram} rel="noopener">Instagram</a>
        </div>
      </div>
      <div className="visit-drawing">
        {facade ? <Sheet drawing={facade} photo={photo} credit={metaFor("facade").credit} lift={metaFor("facade").lift} mode="draw" /> : null}
      </div>
    </section>
  );
}
