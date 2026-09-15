import Link from "next/link";
import { ROOM_ORDER } from "@/lib/house";

export default function NotFound() {
  return (
    <section className="wrap" style={{ paddingBlock: "12svh", display: "grid", gap: 24, justifyItems: "start" }}>
      <svg className="drawing" viewBox="150 150 124 124" style={{ width: 140 }} aria-hidden="true">
        <path d="M 166 212 L 213 172 L 260 212" />
        <path d="M 166 212 L 260 212" />
        <path d="M 172 212 L 172 265 M 254 212 L 254 265 M 160 265 L 266 265" />
        <path d="M 200 265 L 200 238 A 13 13 0 0 1 226 238 L 226 265" />
        <path d="M 200 265 L 190 259 L 190 236 A 13 13 0 0 1 200 226" />
      </svg>
      <h1 className="t-head">There&rsquo;s no room by that name.</h1>
      <p className="t-body">The door is open, but nothing is inside. These are the rooms the house does have:</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
        {ROOM_ORDER.map((r) => <li key={r.slug}><Link className="pen-link" href={`/spaces#${r.slug}`}>{r.name}</Link></li>)}
      </ul>
      <Link className="btn" href="/">Back to the house</Link>
    </section>
  );
}
