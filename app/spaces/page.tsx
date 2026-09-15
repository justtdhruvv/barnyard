import type { Metadata } from "next";
import { Sheet, type Photo } from "@/components/draw/Sheet";
import photos from "@/content/photos.json";
import { cafe, roomWord } from "@/lib/cafe";
import { metaFor } from "@/lib/drawings";
import { ROOM_ORDER } from "@/lib/house";
import { maybeDrawing } from "@/lib/maybe";
import "./spaces.css";

export const metadata: Metadata = { title: "The rooms", description: `The ${roomWord} rooms of ${cafe.meta.name}, each drawn in one line from the house's own photographs.` };

const PHOTOS = photos as Record<string, Photo>;

const NOTES: Record<string, string> = {
  games: "There is no photograph of this corner yet, so it is drawn as a still life of what is there. Tap the table to roll the cue ball.",
  "alley-sign": "The only photograph of this sign has a caption across it, so the drawing stays down.",
};

function describe(slug: string): string {
  const d = cafe.spaces.find((s) => s.slug === slug)?.description ?? "";
  return d.replace(/\s*No further detail confirmed\.?/i, "").trim();
}

export default function Spaces() {
  const rooms = [{ slug: "facade", drawing: "facade", name: cafe.spaces.find((s) => s.slug === "facade")!.name }, ...ROOM_ORDER];
  return (
    <>
      <header className="rooms-intro wrap">
        <h1 className="t-display">The rooms</h1>
        <p className="t-line">The way in, then {roomWord} rooms, each drawn in one line from the house&rsquo;s own photographs. Hold a drawing to see the photograph under it.</p>
        <nav aria-label="Rooms" className="rooms-nav">
          <ul>
            {rooms.map((r) => <li key={r.slug}><a className="pen-link" href={`#${r.slug}`}>{r.name}</a></li>)}
          </ul>
        </nav>
      </header>
      {rooms.map((r) => {
        const drawing = maybeDrawing(r.drawing);
        const meta = metaFor(r.drawing);
        return (
          <section key={r.slug} id={r.slug} className="room wrap" aria-labelledby={`${r.slug}-title`}>
            <div className="room-words">
              <h2 id={`${r.slug}-title`} className="t-head">{r.name}</h2>
              <p className="t-body">{describe(r.slug)}</p>
            </div>
            <div className="room-sheet">
              {drawing ? <Sheet drawing={drawing} photo={PHOTOS[r.drawing] ?? null} credit={meta.credit} lift={meta.lift} note={NOTES[r.drawing]} className={r.slug === "bowling" ? "chase" : undefined} /> : null}
            </div>
          </section>
        );
      })}
    </>
  );
}
