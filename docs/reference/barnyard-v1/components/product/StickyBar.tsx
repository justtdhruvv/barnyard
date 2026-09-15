"use client";

import { useEffect, useState } from "react";
import { cafe, phoneHref, whatsappWith } from "@/lib/cafe";

/**
 * On phones: WhatsApp and Call within a thumb's reach once the first screen has
 * been read, stepping aside while the form is in view.
 */
export function StickyBar({ text }: { text: string }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const form = document.querySelector("main form");
    let formInView = false;
    const update = () => setHidden(formInView || window.scrollY < window.innerHeight * 0.6);
    const io = form
      ? new IntersectionObserver(
          ([e]) => {
            formInView = e.isIntersecting;
            update();
          },
          { threshold: 0.15 },
        )
      : null;
    if (form && io) io.observe(form);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div className="sticky-bar" data-hidden={hidden ? "" : undefined} inert={hidden}>
      <a className="btn btn-primary" href={whatsappWith(text)} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      <a className="btn" href={phoneHref}>
        Call {cafe.meta.phoneDisplay}
      </a>
    </div>
  );
}
