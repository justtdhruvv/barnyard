import Link from "next/link";
import { cafe } from "@/lib/cafe";
import { Mark } from "./Mark";

export function SiteFooter() {
  return (
    <footer className="site-footer wrap">
      <Mark size={44} />
      <p className="t-label">{cafe.meta.name}, {cafe.meta.address.area}, {cafe.meta.city}. Drawn in one line, from the house&rsquo;s own photographs.</p>
      <nav aria-label="Footer">
        <ul>
          <li><Link className="pen-link" href="/spaces">The rooms</Link></li>
          <li><a className="pen-link" href={cafe.meta.instagram} rel="noopener">Instagram</a></li>
          <li><Link className="pen-link" href="/visit">Visit</Link></li>
        </ul>
      </nav>
    </footer>
  );
}
