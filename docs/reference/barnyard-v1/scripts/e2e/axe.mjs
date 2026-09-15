// Accessibility: axe-core on every route at phone and desktop widths, by day and after dark. Any violation fails.
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const base = process.env.BASE || "http://localhost:3001";
const routes = ["/", "/spaces", "/host", "/shoot", "/bowl", "/press", "/menu", "/visit"];
const browser = await chromium.launch();
let fail = 0;

for (const [label, ctxOpts] of [
  ["390", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
  ["1440", { viewport: { width: 1440, height: 900 } }],
]) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  for (const hour of ["13:00", "23:00"]) {
    for (const r of routes) {
      await page.goto(`${base}${r}?at=${hour}`, { waitUntil: "networkidle" });
      // The arrival eases the light over 1.6 s; contrast is judged on the settled state, not a midpoint.
      await page.waitForTimeout(2500);
      await page.addScriptTag({ path: axePath });
      const result = await page.evaluate(async () => {
        const res = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } });
        return res.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) }));
      });
      if (result.length) {
        fail++;
        console.error(`FAIL ${r} ${label} ${hour}`);
        for (const v of result) console.error(`  ${v.impact} ${v.id}: ${v.help} -> ${v.nodes.join(" | ")}`);
      } else console.log(`ok   ${r} ${label} ${hour}`);
    }
  }
  await ctx.close();
}
await browser.close();
process.exit(fail ? 1 : 0);
