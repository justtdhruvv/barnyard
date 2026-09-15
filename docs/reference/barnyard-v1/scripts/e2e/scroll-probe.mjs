// Frame-time probe: a phone-sized viewport at 2x CPU throttling (a mid-range phone proxy) scrolling the homepage and the rooms.
// Gate: p95 frame time at or under 50 ms and no more than 5% of frames over 50 ms after warm-up. The 50 ms allowance exists for
// one moment only: the 350 ms "lamps on" when the night band pulls the whole page to 1 AM, which restyles every element per
// frame by design. Away from that moment the pages run at about 21 ms p95 at 1x CPU. Runs headed by default: the headless
// shell renders in software and exaggerates paint cost. HEADLESS=1 forces headless.
import { chromium } from "playwright";

const base = process.env.BASE || "http://localhost:3001";
const P95_LIMIT = Number(process.env.P95_LIMIT || 50);
const LONG_LIMIT = Number(process.env.LONG_LIMIT || 50);
const LONG_SHARE = Number(process.env.LONG_SHARE || 0.05);
const rate = Number(process.env.CPU || 2);
const browser = await chromium.launch({ headless: !!process.env.HEADLESS });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate });
let fail = 0;

for (const r of ["/", "/spaces"]) {
  await page.goto(base + r + "?at=13:00", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    window.__frames = [];
    let last = performance.now();
    const tick = (t) => {
      window.__frames.push(t - last);
      last = t;
      window.__raf = requestAnimationFrame(tick);
    };
    window.__raf = requestAnimationFrame(tick);
  });
  for (let i = 0; i < 28; i++) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(400);
  const frames = await page.evaluate(() => {
    cancelAnimationFrame(window.__raf);
    return window.__frames.slice(3);
  });
  const sorted = [...frames].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
  const long = frames.filter((f) => f > LONG_LIMIT).length;
  const worst = sorted[sorted.length - 1] || 0;
  const share = frames.length ? long / frames.length : 0;
  const ok = p95 <= P95_LIMIT && share <= LONG_SHARE;
  console.log(`${ok ? "ok  " : "FAIL"} ${r}: ${frames.length} frames at ${rate}x cpu, p95 ${p95.toFixed(1)} ms, worst ${worst.toFixed(1)} ms, over ${LONG_LIMIT} ms: ${long} (${(share * 100).toFixed(1)}%)`);
  if (!ok) fail++;
}
await browser.close();
process.exit(fail ? 1 : 0);
