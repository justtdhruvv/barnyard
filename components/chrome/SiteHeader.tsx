"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { cafe } from "@/lib/cafe";
import { useLight } from "@/components/light/LightProvider";
import { Mark } from "./Mark";

export const NAV = [
  { href: "/", label: "The house" },
  { href: "/spaces", label: "The rooms" },
  { href: "/#written", label: "Written about" },
  { href: "/#ways", label: "Four ways in" },
  { href: "/visit", label: "Visit" },
] as const;

/** Sun by day, moon by night, drawn in the house's line. Flips the whole house live. */
function RegimeSwitch() {
  const { state, toggleRegime } = useLight();
  const night = state?.regime === "night";
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return `M${(12 + Math.cos(a) * 6.8).toFixed(1)} ${(12 + Math.sin(a) * 6.8).toFixed(1)}L${(12 + Math.cos(a) * 9.4).toFixed(1)} ${(12 + Math.sin(a) * 9.4).toFixed(1)}`;
  });
  return (
    <button type="button" className="regime-switch" onClick={toggleRegime} aria-label={night ? "Switch the house to day" : "Switch the house to night"} suppressHydrationWarning>
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <g className={`rs-sun${night ? "" : " is-on"}`}>
          <circle cx="12" cy="12" r="4.2" />
          {rays.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g className={`rs-moon${night ? " is-on" : ""}`}>
          <path d="M14.5 3.8A8.4 8.4 0 1 0 20.4 15A6.6 6.6 0 1 1 14.5 3.8Z" />
        </g>
      </svg>
    </button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="site-header wrap">
      <Link href="/" className="site-brand" aria-label={`${cafe.meta.name}, home`}>
        <Mark size={30} />
        <span className="t-label" style={{ color: "var(--ink)" }}>{cafe.meta.name}</span>
      </Link>
      <div className="site-actions">
        <RegimeSwitch />
        <button type="button" className="site-menu-button t-label" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <nav id={id} className="site-menu" data-open={open ? "" : undefined} aria-label="Site">
        <ul>
          {NAV.map((l) => (
            <li key={l.href}><Link className="t-head" href={l.href} onClick={() => setOpen(false)} aria-current={pathname === l.href ? "page" : undefined}>{l.label}</Link></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
