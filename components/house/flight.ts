"use client";

const EASE_PEN = "cubic-bezier(0.3, 0, 0.18, 1)";

/**
 * Tapping a pane: a paper-coloured clone of the pane (with its vignette) grows from the pane to cover the screen,
 * the route changes under it, the page jumps to the room, and the clone fades away.
 */
export function flyToRoom(pane: SVGAElement, slug: string, push: (href: string) => void): void {
  const hit = pane.querySelector<SVGRectElement>(".pane-hit");
  if (!hit) { push(`/spaces#${slug}`); return; }
  const r = hit.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight;

  const clone = document.createElement("div");
  clone.className = "flight";
  clone.setAttribute("aria-hidden", "true");
  Object.assign(clone.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  const vignette = pane.querySelector<SVGSVGElement>("svg.vignette");
  let inner: SVGSVGElement | null = null;
  if (vignette) {
    inner = vignette.cloneNode(true) as SVGSVGElement;
    ["x", "y", "width", "height"].forEach((a) => inner!.removeAttribute(a));
    inner.setAttribute("class", "flight-vignette");
    clone.appendChild(inner);
  }
  document.body.appendChild(clone);

  const s = Math.max(vw / r.width, vh / r.height) * 1.02;
  const tx = (vw - r.width * s) / 2 - r.left;
  const ty = (vh - r.height * s) / 2 - r.top;
  const grow = clone.animate(
    [{ transform: "translate(0px, 0px) scale(1)" }, { transform: `translate(${tx}px, ${ty}px) scale(${s})` }],
    { duration: 800, easing: EASE_PEN, fill: "forwards" },
  );
  // the vignette is gone before the scale thickens its lines
  inner?.animate([{ opacity: 1 }, { opacity: 0, offset: 0.4 }, { opacity: 0 }], { duration: 800, easing: "linear", fill: "forwards" });

  let removed = false;
  const remove = () => { if (!removed) { removed = true; clone.remove(); } };
  const fade = () => {
    const out = clone.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: "ease-out", fill: "forwards" });
    out.onfinish = remove;
    window.setTimeout(remove, 800);
  };
  const jump = (el: HTMLElement) => {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "instant" as ScrollBehavior });
  };

  grow.onfinish = () => {
    push(`/spaces#${slug}`);
    const t0 = performance.now();
    const land = () => {
      const el = document.getElementById(slug);
      if (!el) {
        if (performance.now() - t0 < 6000) { requestAnimationFrame(land); return; }
        fade();
        return;
      }
      jump(el);
      // Next may settle its own scroll a frame later; jump again before the clone lifts
      requestAnimationFrame(() => {
        jump(el);
        window.setTimeout(() => { jump(el); fade(); }, 120);
      });
    };
    requestAnimationFrame(land);
  };
  window.setTimeout(remove, 9000);
}
