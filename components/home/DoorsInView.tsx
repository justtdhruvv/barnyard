"use client";

import { useEffect } from "react";

/** Touch screens have no hover: each door swings open once most of it is on screen. */
export function DoorsInView() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".door-card"));
    if (!cards.length) return;
    if (!matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const i = cards.indexOf(el);
          window.setTimeout(() => el.setAttribute("data-open", ""), (i % 2) * 140);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);
  return null;
}
