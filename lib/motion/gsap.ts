"use client";

export interface GsapKit {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  DrawSVGPlugin: typeof import("gsap/DrawSVGPlugin").DrawSVGPlugin;
  MorphSVGPlugin: typeof import("gsap/MorphSVGPlugin").MorphSVGPlugin;
}

let kit: Promise<GsapKit> | null = null;

/** GSAP and its plugins (all free and bundled in the gsap package), loaded after first paint, once. */
export function loadGsap(): Promise<GsapKit> {
  kit ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/DrawSVGPlugin"),
    import("gsap/MorphSVGPlugin"),
    import("gsap/CustomEase"),
  ]).then(([g, st, draw, morph, ce]) => {
    g.gsap.registerPlugin(st.ScrollTrigger, draw.DrawSVGPlugin, morph.MorphSVGPlugin, ce.CustomEase);
    ce.CustomEase.create("pen", "M0,0 C0.18,0 0.26,0.62 0.5,0.8 0.74,0.96 0.84,1 1,1");
    g.gsap.defaults({ ease: "pen" });
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger, DrawSVGPlugin: draw.DrawSVGPlugin, MorphSVGPlugin: morph.MorphSVGPlugin };
  });
  return kit;
}

/** False under reduced motion (read from the attribute the pre-paint script sets, with the media query as fallback). */
export function motionAllowed(): boolean {
  if (typeof window === "undefined") return false;
  const attr = document.documentElement.getAttribute("data-motion");
  if (attr) return attr === "on";
  return !matchMedia("(prefers-reduced-motion: reduce)").matches;
}
