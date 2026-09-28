// The sun on the arch is a sun by day and a crescent moon by night, changing smoothly through dusk.
// Run against a production server on 3022: node scripts/e2e/sky.mjs
import { assert, launch, open, report, shot } from "./lib.mjs";

const HOURS = [
  { at: "11:00", moon: 0, rays: 1, regime: "day" },
  { at: "14:00", moon: 0, rays: 1, regime: "day" },
  { at: "18:45", moon: 0, rays: [0.3, 0.9], regime: "day" },
  { at: "19:30", moon: 1, rays: 0, regime: "night" },
  { at: "22:00", moon: 1, rays: 0, regime: "night" },
  { at: "01:00", moon: 1, rays: 0, regime: "night" },
];

/** The visible house variant's sun: the registered sky numbers, the ray opacity and the shadow's offset in sun radii. */
async function sky(page) {
  return page.evaluate(() => {
    const svg = Array.from(document.querySelectorAll("svg.house")).find((s) => getComputedStyle(s).display !== "none");
    const sun = svg?.querySelector(".house-sun");
    const ray = sun?.querySelector(".sun-ray");
    const shadow = sun?.querySelector(".moon-shadow");
    const track = svg?.querySelector(".house-track .hair");
    if (!sun || !ray || !shadow || !track) return null;
    const cs = getComputedStyle(sun);
    const r = Number(sun.querySelector(".sun-disc")?.getAttribute("r"));
    const m = new DOMMatrixReadOnly(getComputedStyle(shadow).transform);
    const box = svg.getBoundingClientRect();
    const sb = sun.getBoundingClientRect();
    return {
      moon: Number(cs.getPropertyValue("--sky-moon")),
      rays: Number(cs.getPropertyValue("--sky-rays")),
      rayOpacity: Number(getComputedStyle(ray).opacity),
      shadowOffset: m.m41 / r,
      trackOpacity: Number(getComputedStyle(track).opacity),
      x: (sb.left + sb.width / 2 - box.left) / box.width,
    };
  });
}

const near = (v, target) => (Array.isArray(target) ? v >= target[0] && v <= target[1] : Math.abs(v - target) < 0.02);

const browser = await launch();
for (const width of [390, 1440]) {
  for (const h of HOURS) {
    const { page, ctx, errors } = await open(browser, "/", { at: h.at, width, height: width < 800 ? 844 : 900 });
    await page.waitForSelector(".house-wrap[data-done]", { timeout: 8000 });
    await page.waitForTimeout(1200);
    const s = await sky(page);
    assert(s !== null, `${width} ?at=${h.at}: the house's sun is on the page`);
    if (s) {
      assert((await page.getAttribute("html", "data-regime")) === h.regime, `${width} ?at=${h.at}: regime is ${h.regime}`);
      assert(near(s.moon, h.moon), `${width} ?at=${h.at}: moon ${s.moon.toFixed(2)} (want ${h.moon})`);
      assert(near(s.rays, h.rays), `${width} ?at=${h.at}: rays ${s.rays.toFixed(2)} (want ${h.rays})`);
      assert(near(s.rayOpacity, Array.isArray(h.rays) ? h.rays : h.rays), `${width} ?at=${h.at}: ray opacity ${s.rayOpacity.toFixed(2)} follows the rays`);
      if (h.moon === 0) assert(s.shadowOffset >= 2, `${width} ?at=${h.at}: the shadow is clear of the disc (${s.shadowOffset.toFixed(2)} r)`);
      if (h.moon === 1) assert(s.shadowOffset > 0.3 && s.shadowOffset < 0.8, `${width} ?at=${h.at}: the shadow sits across the disc as a crescent (${s.shadowOffset.toFixed(2)} r)`);
      assert(h.regime === "day" ? s.trackOpacity > 0.95 : s.trackOpacity < 0.6, `${width} ?at=${h.at}: the track ${h.regime === "day" ? "is drawn" : "dims"} (${s.trackOpacity.toFixed(2)})`);
      const wantX = h.at === "11:00" ? [0.05, 0.3] : h.at === "01:00" ? [0.7, 0.95] : [0.2, 0.8];
      assert(near(s.x, wantX), `${width} ?at=${h.at}: sits along the track at ${s.x.toFixed(2)} of the width`);
    }
    assert(errors.length === 0, `${width} ?at=${h.at}: no console errors (${errors.join(" | ")})`);
    await shot(page, `sky-${width}-${h.at.replace(":", "")}`);
    await ctx.close();
  }
}

// The header switch: pressing it at 2 PM turns the sun into the moon smoothly, not as a swap.
{
  const { page, ctx } = await open(browser, "/", { at: "14:00" });
  await page.waitForSelector(".house-wrap[data-done]", { timeout: 8000 });
  await page.click(".regime-switch");
  await page.waitForTimeout(350);
  const mid = await sky(page);
  assert(mid && mid.moon > 0.05 && mid.moon < 0.95, `mid-flip the crescent is between sun and moon (${mid && mid.moon.toFixed(2)})`);
  await page.waitForTimeout(1400);
  const end = await sky(page);
  assert(end && near(end.moon, 1) && near(end.rays, 0), `after the flip it is the moon (${end && end.moon.toFixed(2)}, rays ${end && end.rays.toFixed(2)})`);
  await shot(page, "sky-390-switch");
  await page.click(".regime-switch");
  await page.waitForTimeout(1800);
  const back = await sky(page);
  assert(back && near(back.moon, 0) && near(back.rays, 1), `pressed again it is the sun (${back && back.moon.toFixed(2)})`);
  await ctx.close();
}

// Reduced motion: complete at rest at 1 AM, no transition to wait for.
{
  const { page, ctx } = await open(browser, "/", { at: "01:00", reducedMotion: true });
  await page.waitForSelector(".house-wrap[data-done]", { timeout: 8000 });
  const s = await sky(page);
  assert(s && near(s.moon, 1) && near(s.rays, 0), `reduced motion at 1 AM: the moon at rest (${s && s.moon.toFixed(2)})`);
  await ctx.close();
}
await browser.close();
report();
