"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { cafe } from "@/lib/cafe";
import { Mark } from "./Mark";

export const NAV = [
  { href: "/", label: "The house" },
  { href: "/spaces", label: "The rooms" },
  { href: "/#written", label: "Written about" },
  { href: "/#ways", label: "Four ways in" },
  { href: "/visit", label: "Visit" },
] as const;

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
      <button type="button" className="site-menu-button t-label" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        {open ? "Close" : "Menu"}
      </button>
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
