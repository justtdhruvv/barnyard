# Drawn-line site stack: research report (verified 2026-09-15)

**Scratch spike:** `D:\barnyard-source\spikes\drawn-stack\`
- `app/House.tsx`, `app/layout.tsx`, `app/fonts.ts`: Next 15.5.25 App Router build using every GSAP plugin; `next build` passes.
- `react-vt.d.ts`: types shim for ViewTransition.
- `svgo.config.mjs`, `svgr.mjs`, `svg/house.svg`: SVG pipeline test.
- `bench/index.html`, `bench/extra.js`: performance benchmark.

**Repo baseline** (read only from `D:\barnyard\package.json`): next 15.5.25, react/react-dom 19.1.0, gsap ^3.15.0, tailwindcss ^4.

**Benchmark caveat:** all fps numbers below come from Chromium 153 on desktop at a 412×915 viewport, capped by a 144 Hz monitor. CPU throttling slows only the main thread, not GPU or raster work. Use the numbers to compare techniques, not to predict phones. **Real mid-range Android performance is UNVERIFIED.**

---

## 1. GSAP

**Versions (npm):**

| Package | Version | Date / notes |
|---|---|---|
| `gsap` | 3.15.0 (latest) | 2026-04-13 |
| `@gsap/react` | 2.1.2 | peers: `gsap ^3.12.5`, `react >=17` |
| `gsap` 3.13.0 | — | 2025-04-30, the release that made GSAP entirely free |

**Licence.** The package licence field reads `Standard 'no charge' license: https://gsap.com/standard-license`.
- The pricing page says "GSAP is now 100% free for all users, thanks to Webflow's support."
- The licence FAQ says: "All of GSAP including the plugins that were formerly 'members-only'… can be used in commercial projects at no charge."
- The one restriction is a prohibited use: building no-code visual animation tools "that compete with Webflow's visual animation building capabilities". A cafe website is not affected.
- Sources: [pricing](https://gsap.com/pricing/), [standard licence](https://gsap.com/standard-license/)

**Bundled in the npm package (verified in `node_modules/gsap` 3.15.0):**
- `DrawSVGPlugin.js`, `MorphSVGPlugin.js`, `MotionPathPlugin.js`, `SplitText.js`, `ScrollTrigger.js`, `Flip.js`, `CustomEase.js`, `Observer.js` (plus `ScrollSmoother.js`).
- TypeScript types sit in `types/`.
- No separate registry or token is needed.

**Imports (compiled and type-checked in the spike):**
```tsx
"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { Observer } from "gsap/Observer";
gsap.registerPlugin(useGSAP, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, ScrollTrigger, SplitText, Flip, CustomEase, Observer);
```
Spike build cost: a route importing all eight plugins came to 72.8 kB route JS and 188 kB First Load JS (`next build` output).

**Snippets.** The spike compiled these; they were not visually checked.
```tsx
const root = useRef<SVGSVGElement>(null);
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
    const { motion } = ctx.conditions as { motion: boolean };
    if (!motion) { gsap.set(".ln", { drawSVG: "100%" }); return; }          // reduced motion: show final drawing

    // Staggered draw-on of many paths
    gsap.from(".ln", { drawSVG: 0, duration: 1.2, ease: "power2.inOut", stagger: { each: 0.03, from: "start" } });

    // Something travelling along a drawn path (MotionPath)
    gsap.to("#dot", { motionPath: { path: "#stair", align: "#stair", alignOrigin: [0.5, 0.5], autoRotate: true }, duration: 2 });

    // Morph one line drawing into another (both <path>; use MorphSVGPlugin.convertToPath for shapes)
    gsap.to("#steam-a", { morphSVG: { shape: "#steam-b", type: "rotational" }, duration: 1.5, yoyo: true, repeat: -1 });

    // ScrollTrigger scrub of a draw
    gsap.fromTo(".stair-ln", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none",
      scrollTrigger: { trigger: ".room", start: "top 80%", end: "bottom 20%", scrub: true } });
  });
}, { scope: root });
// Event handlers that animate must be wrapped: const { contextSafe } = useGSAP({ scope: root });
```

**DrawSVG facts:**
- It animates strokes only, never fills, using `stroke-dasharray` and `stroke-dashoffset`.
- It works on `<path>`, `<line>`, `<polyline>`, `<polygon>`, `<rect>` and `<ellipse>`.
- Values: `"20% 80%"`, `true`, absolute lengths, and a `"live"` suffix that re-measures every frame.
- Helpers: `DrawSVGPlugin.getLength(el)` and `getPosition(el)`.
- Sources: [DrawSVG docs](https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/)

**MorphSVG options:** `shapeIndex`, `type: "rotational"`, `smooth`, and `precompile: "log"`, which lets you bake point data ahead of time for expensive morphs. Source: [MorphSVG docs](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin).

**useGSAP:** accepts `scope`, `dependencies`, `revertOnUpdate` and `contextSafe`. Source: [greensock/react README](https://github.com/greensock/react/blob/main/README.md).

## 2. Zooming into the drawing as navigation

**DrawSVG with `vector-effect="non-scaling-stroke"`** (verified in `gsap/dist/DrawSVGPlugin.js` 3.15.0):
- For such elements, `_getLength` multiplies the path length by the scale from `getScreenCTM()` at the moment it measures.
- If the element is not scaled proportionally, it warns: "path length cannot be measured when vector-effect is non-scaling-stroke and the element isn't proportionally scaled."
- **Consequence:** a length measured before a zoom is wrong after it. Either finish the draw before zooming, run the draw after the zoom settles, or use `"live"` (which re-measures every frame and costs more).

**What `non-scaling-stroke` does:** stroke width stays independent of transforms and zoom. It applies to path, line, polyline, rect, `use`, text and more, and has been Baseline since July 2020 ([MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/vector-effect)).

**Verified:** GSAP's attr plugin tweens `viewBox` strings. At 50% progress the value was `"75 150 175 350"`.

**Benchmark: fps (worst frame in ms), 412×915 viewport**

| Technique | 500 paths, CPU 6× | 3000 paths, CPU 1× | 3000 paths, CPU 6× |
|---|---|---|---|
| DrawSVG draw-on, all paths within 1 s stagger | 52.7 (70) | 24 (361) | **0.4 (7639)** |
| Tween `viewBox` + non-scaling-stroke | 116 (35) | 53.5 (35) | 36.5 (56) |
| Transform `scale` on `<g>` + non-scaling-stroke | 103 (28) | 93 (35) | 28.9 (56) |
| Transform `scale` on `<g>`, strokes scale | 143 (14) | 87 (35) | 92.7 (21) |
| Static SVG as `<img>`, CSS `scale` | 142 (14) | 77 (28) | 87.6 (28) |

**Recommended approach.** This is a recommendation built on the numbers above, not a measured end-to-end result.
- **Persistent house:** keep the house as a client component in a layout. Next's docs note that layouts persist across navigations.
- **The flight:** zoom with a transform on a `<g>` (`gsap.to("#house", { scale, x, y })` or `svgOrigin`) or on an `<img>` snapshot of the static line work. Let strokes scale during the roughly 0.6–0.9 s flight.
- **Landing:** cross-fade to a room SVG authored at its own `viewBox`, so strokes are crisp and constant width. Draw on only that room's people and props, measured after landing.
- **Avoid:** `non-scaling-stroke` on thousands of paths while animating; it was the slowest at 3000 paths (28.9 fps, 6×).
- **Keep simultaneous draw-ons to a few hundred paths.**
- **Merge static strokes:** combine paths that never animate on their own (svgo `mergePaths`, section 6) and draw them as one layer.
- **Framing a room:** `const b = roomEl.getBBox()`, then tween `attr: { viewBox: \`${b.x-p} ${b.y-p} ${b.width+2*p} ${b.height+2*p}\` }` or the equivalent transform.
- **Crispness after a CSS scale:** a W3C SVG WG note says a browser may keep a bitmap while `will-change: transform` is set and re-render crisply once it is removed. So set `will-change` only during the flight ([W3C wiki](https://www.w3.org/Graphics/SVG/WG/wiki/Proposals/Performance_in_panning_%26_zooming)).
- **Compositor guidance:** restrict animation to `transform` and `opacity`, and use `will-change` sparingly ([web.dev](https://web.dev/articles/animations-guide)).
- **Flip between two SVGs:** the docs only confirm Flip doesn't support 3D transforms. Whether Flip works on SVG child elements is **UNVERIFIED**.
- **Canvas fallback:** not tested, **UNVERIFIED**.

## 3. "Line boil" and wobble

**feTurbulence and feDisplacementMap:**
- GSAP staff: "SVG filters are pretty horrific for performance… very short bursts, or on a small area". Filters are "notoriously VERY demanding on the CPU".
- The forum thread reports iOS Safari lag and crashes, and suggests sprite cross-fades or WebGL instead ([GSAP forum](https://gsap.com/community/forums/topic/33075-gsap-and-feturbulence-mobile-performance/)).
- The benchmark could not measure filter raster cost (throttling doesn't model the GPU). **Don't use it full-screen on mobile.**

**Swapping pre-jittered variants:**
- Three full DOM copies of 3000 paths, toggled at 10 fps, dropped to 40 fps at 6× (worst frame 118 ms).
- Swapping two or three `<img>` layers by opacity would be compositor-only; that variant is **UNVERIFIED** (not benchmarked).

**Libraries:**
- `perfect-freehand` 1.2.3: `getStroke` "will return a new array of outline points… a polygon". That is a filled shape, so it is incompatible with DrawSVG stroke draw-on (README in package).
- `roughjs` 4.6.6: sketchy rendering controlled by `roughness` and `bowing` (README). It was last published 2023-11. It is off-brief for a precise line.

**Recommendation for a restrained, precise line:**
- No boil at all on architecture.
- If life is wanted, loop 2–3 baked path variants on the small people only, at 8 fps.
- Put character in the line offline instead: round caps, slight taper and simplification baked into the path data.

## 4. Night lamps

**Benchmark: 8 lamps pulsing opacity over the line drawing, fps at CPU 6×**

| Glow technique | 500 paths | 3000 paths |
|---|---|---|
| `radialGradient` circle | 144 | 63.1 |
| `feGaussianBlur` (stdDeviation 14) | 138 | 59.1 |
| CSS `filter: drop-shadow` | 142 | 59.1 |

The emulation couldn't separate them because GPU cost isn't modelled. The published guidance:
- CSS filters are generally cheaper than SVG filter chains.
- Keep filter regions tight.
- Use static filtered backgrounds under animated unfiltered foregrounds ([CSS-Tricks](https://css-tricks.com/adding-shadows-to-svg-icons-with-css-and-svg-filters/), [MDN SVG filters](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_filters)).

**Cheapest good-looking option (recommendation):**
- A `radialGradient` circle (or a CSS `radial-gradient` div) sits in a layer behind the line layer, and only its `opacity` animates.
- Use no filter and no blur.
- Warm stop, e.g. `#ffb24a`, fading to 0 opacity.
- **UNVERIFIED:** the cost of `mix-blend-mode` (not tested).

## 5. Page transitions in Next 15 App Router

**Next 15.5.25 facts (all verified):**
- **Flag:** `experimental.viewTransition` exists in the config schema. The type comment says it "Enables view transitions by using the unstable_ViewTransition Component."
- **Status:** Next 15 docs say it is "experimental… **not recommended for production**" and "not developed or maintained by the Next.js team". Usage is `import { unstable_ViewTransition as ViewTransition } from 'react'` ([docs v15](https://nextjs.org/docs/15/app/api-reference/config/next-config-js/viewTransition)).
- **It switches React build:** enabling the flag makes Next use its bundled experimental React (`dist/lib/needs-experimental-react.js`, together with ppr, taint and routerBFCache).
- **Bundled React:** `19.2.0-canary-0bdb9206-20250818`. Only the experimental copy exports `unstable_ViewTransition` and `unstable_addTransitionType`.
- **Types:** `@types/react` 19.3.0 has no `unstable_ViewTransition`, so the build fails without a shim. This shim got the build passing:
  ```ts
  // react-vt.d.ts
  import "react";
  declare module "react" { export const unstable_ViewTransition: typeof import("react").ViewTransition; }
  ```
- **No `transitionTypes`:** absent from 15.5.25's `next/dist/client` and `next/dist/shared`. The Link docs say it was added in v16.2.0. `onNavigate` was added in v15.3.0 ([Link docs](https://nextjs.org/docs/app/api-reference/components/link)).

**React and Next 16:**
- `react@19.3.0` (npm, published 2026-09-14) exports `ViewTransition`, `addTransitionType` and `Activity` as stable names (checked with Node).
- The GitHub release (dated 9 Sep 2026) lists "Adds `<ViewTransition />` and `addTransitionType`" ([releases](https://github.com/facebook/react/releases)).
- react.dev still shows a canary label. That is a docs inconsistency.
- Next latest is 16.3.5. Its guide says view transitions "work in the App Router with no configuration" and imports `ViewTransition` from `'react'` ([guide](https://nextjs.org/docs/app/guides/view-transitions)).

**Caveats from the Next 16 guide:**
- Layouts persist, so enter/exit never fire in a layout; the wrapper goes in `page.tsx`.
- A shared-element morph only plays if the destination renders in the same commit (prefetched).
- `::view-transition` captures clicks unless you set `pointer-events: none`.
- Browser back navigation carries no transition type.
- Types and `view-transition-class` need Chromium 125+.

**Browser support** (same-document; [caniuse](https://caniuse.com/view-transitions)): Chrome 111, Safari/iOS 18.0, Firefox 144, Samsung Internet 23. Global usage 91.75%.

**Recommendation for Next 15:**
- Don't rely on the experimental flag.
- Put the house SVG in a persistent layout.
- Intercept `<Link onNavigate>` (15.3+): `e.preventDefault()`, run the GSAP zoom, then `router.push(href)`. Or animate on a `usePathname()` change.
- Plain CSS cross-fades or `document.startViewTransition` are optional.
- Native `<ViewTransition>` plus `transitionTypes` becomes the clean path only after upgrading to Next ≥16.2.

## 6. SVG build pipeline

**Versions:**

| Package | Version | Date / notes |
|---|---|---|
| `svgo` | 4.1.0 | 2026-08-24 |
| `@svgr/core`, `@svgr/webpack`, `@svgr/cli` | 8.1.0 | 2023-08; `@svgr/plugin-svgo` depends on `svgo ^3` |
| `simplify-js` | 1.2.4 | — |
| `paper` | 0.12.18 | — |
| `potrace` | 2.1.8 | 2022 |

**svgo v4 defaults:**
- `removeViewBox` and `removeTitle` are no longer in preset-default ([migration guide](https://svgo.dev/docs/migrations/migration-from-v3-to-v4/)).
- The 4.1.0 preset includes `cleanupIds`, `mergePaths`, `collapseGroups`, `convertShapeToPath` and `removeDesc` (read from `plugins/preset-default.js`).

**Config for line art** (ran it; ids, classes and `vector-effect` survived; paths rounded to 2 decimals):
```js
// svgo.config.mjs
export default {
  multipass: true, floatPrecision: 2,
  plugins: [
    { name: 'preset-default', params: { overrides: {
      cleanupIds: false, mergePaths: false, collapseGroups: false, moveElemsAttrsToGroup: false,
      convertShapeToPath: false, removeDesc: false,
      removeUnknownsAndDefaults: { keepDataAttrs: true, keepAriaAttrs: true, keepRoleAttr: true },
      convertPathData: { floatPrecision: 2 },
    } } },
    'removeDimensions',
    { name: 'removeAttrs', params: { attrs: ['stroke', 'stroke-width'] } }, // style via CSS/currentColor
  ],
};
```
- For static layers that never animate per path, allow `mergePaths` in a separate pass.
- If several inline SVGs share a page, add `prefixIds` to avoid id collisions.

**svgr:**
- Run svgo 4 yourself first, then svgr with only `@svgr/plugin-jsx`, which avoids its bundled svgo 3.
- Verified options: `{ plugins:['@svgr/plugin-jsx'], typescript:true, ref:true, titleProp:true, dimensions:false, jsxRuntime:'automatic' }`. Output keeps `id`, `className` and `vectorEffect`.
- Turbopack loader rule: `turbopack: { rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } } }`. The top-level `turbopack` key exists since 15.3 ([docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)).

**Simplification and tracing:**
- `simplify-js` works on point arrays: in the spike, 200 points became 20 at tolerance 1 with high quality. Bezier tracer output must be flattened to points first.
- `paper` `path.simplify()`: installed but not run, **UNVERIFIED**.
- **Tracing warning:** potrace-style tracers produce filled outline shapes. DrawSVG needs centreline strokes. Centreline tracing tooling is **UNVERIFIED**, so prefer generating strokes from code.

**Lazy room layers:**
- One component per room, loaded with `next/dynamic` (or `import()` on tap), with the house overview as its own light layer.
- Avoid `<use href="rooms.svg#room">`. MDN says its clones live in a "non-exposed DOM", so GSAP selectors can't reach the inner paths ([MDN use](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use)).
- Fetching SVG text at runtime and injecting it is possible; **UNVERIFIED** in the spike.

## 7. Accessibility

**Verified in Chromium 153:**
- An SVG `<a href>` containing a transparent-filled `<path>` took focus (`document.activeElement`, `tabIndex` 0).
- An `a:focus-visible path { outline: 3px solid }` rule computed as `solid 3px`. Only the computed style was checked, not a screenshot.
- Whether `next/link` `<Link>` behaves inside `<svg>` is **UNVERIFIED**. A safe fallback is SVG `<a href>` plus an `onClick` handler that calls `router.push`.

**Guidance:**
- **Focusable elements:** only `<a href>` is focusable by default. `tabindex` works as in HTML.
- **Focus style:** old Firefox (≤50) and Edge (≤15) didn't render `outline` on SVG, so also change stroke or fill on focus ([ally.js](https://allyjs.io/tutorials/focusing-in-svg.html)).
- **Names:** name each room with `aria-label` on the `<a>` or a `<title>` child ([W3C SVG2 access](https://www.w3.org/TR/SVG/access.html), [CSS-Tricks](https://css-tricks.com/accessible-svgs/)).
- **Target size:** WCAG 2.2 SC 2.5.8 (AA) requires targets of at least 24×24 CSS px or equivalent spacing ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)). Give each room a transparent hit rectangle.

**Reduced motion:**
- `gsap.matchMedia()` with a condition that sets `drawSVG: "100%"` (the section 1 snippet).
- For any view transitions, the Next guide's rule: `@media (prefers-reduced-motion: reduce) { ::view-transition-old(*), ::view-transition-new(*), ::view-transition-group(*) { animation-duration: 0s !important; } }`.

**Text alternative:** a real `<nav>` with a list of `<Link>`s to every room, visible or behind a skip link. The SVG group gets `role="group"` and `aria-label`.

## 8. Typography (all verified in Next 15.5.25 `font-data.json` and built with `next/font/google`, 49 font files emitted)

1. **Ysabeau Office** (`Ysabeau_Office`, weight 1–1000, italic): true hairline weights can match a single-weight line exactly.
2. **Jost** (weight 100–900, italic): a geometric sans whose thin weights echo the arch, sun and house geometry.
3. **Hedvig Letters Serif** (`Hedvig_Letters_Serif`, 400, optical size 12–24): a quiet, low-contrast text serif that won't fight the drawings.
4. **Imbue** (optical size 10–100, weight 100–900): a condensed Didone with hairline strokes for display headings.
5. **Italiana** (400 only): a thin, high-contrast display face with the delicacy of fine-line logos.
6. **Spectral** (static 200–800, italic): a light, screen-first text serif for body copy with elegant italics.

Weights, axes and names are verified; the reasons are design judgement. None are on the exclusion list.

## 9. Award-listed line-drawing sites (all pages returned HTTP 200 on 2026-09-15; stack from shipped code)

I could only verify three. All are Honorable Mentions from 2025–2026. I found no line-drawing SOTD from 2023–2026 that I could verify. The two SOTDs that surfaced were excluded:
- **The Tuscan Journey Begins:** WebGL and Vue, not line drawing.
- **Paul Kalkbrenner:** Webflow, black and white; not confirmed as a drawing experience.

| Site | Award | Illustrated move | Stack verified in shipped code |
|---|---|---|---|
| [ecoLINEAR Studio](https://ecolinearstudio.com/) | Awwwards HM, 18 Aug 2026 ([page](https://www.awwwards.com/sites/ecolinear-studio)) | "hand-plotted linework draws itself as you scroll", framing full-bleed photography | Next.js (`/_next/static`, 16 chunks); GSAP (`GreenSock`, `gsap.com`, `ScrollTrigger`); Lenis; hand-rolled `strokeDashoffset`/`getTotalLength` draws; 53 `<path>` and 24 `vector-effect="non-scaling-stroke"` in the HTML. No `DrawSVGPlugin` string found. |
| [FRA! Doodle Artist Portfolio](https://fradesign.it/) | Awwwards HM, 4 Jul 2025 ([page](https://www.awwwards.com/sites/fra-doodle-artist-portfolio)) | Doodle illustration portfolio with animated hero and scroll interactions | WordPress theme (`wp-content/themes/fra-portfolio/dist/index.js`); GSAP with ScrollTrigger, Observer and CustomEase registered; 63 inline `<svg>`. Stroke draw-on not confirmed (no `drawSVG` or dasharray strings). |
| [Searching for Birds](https://searchingforbirds.visualcinnamon.com/) (Visual Cinnamon) | Awwwards HM, 26 Feb 2026 ([page](https://www.awwwards.com/sites/searching-for-birds)) | Illustration and data-visualisation scrollytelling | Single ES-module bundle `/assets/index.js` (366 kB); `scrollama`; `stroke-dasharray` and `getTotalLength` present. D3 is listed by Awwwards but not string-identifiable in the minified bundle. It is dataviz-led more than line-drawing-led. |

A fourth candidate, Yan Liu portfolio (HM, Apr 2026, Next.js), was excluded: its "doodles" showed no roughjs or drawing evidence in the chunks.
