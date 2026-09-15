// Runs Lighthouse (mobile, simulated throttling) on every route and prints a table.
// Usage: CHROME_PATH=... node scripts/lighthouse-all.mjs http://localhost:3100
import { spawnSync } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";
const base = process.argv[2] ?? "http://localhost:3100";
const desktop = !!process.env.LH_DESKTOP; // LH_DESKTOP=1 for the desktop preset
const routes = ["/", "/spaces", "/host", "/shoot", "/bowl", "/press", "/menu", "/visit"];
mkdirSync("lh", { recursive: true });
const rows = [];
for (const r of routes) {
  const out = `lh/${desktop ? "d-" : ""}${r === "/" ? "home" : r.slice(1)}.json`;
  spawnSync("npx", ["lighthouse", base + r, "--output=json", `--output-path=${out}`, "--chrome-flags=--headless=new --no-sandbox", "--only-categories=performance,accessibility,best-practices,seo", "--quiet", ...(desktop ? ["--preset=desktop"] : [])], { stdio: "ignore", shell: true });
  try {
    const j = JSON.parse(readFileSync(out, "utf8"));
    const c = j.categories, a = j.audits;
    const fails = Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && !["informative", "notApplicable", "manual"].includes(x.scoreDisplayMode)).map((x) => x.id);
    rows.push({ route: r, perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100), bp: Math.round(c["best-practices"].score * 100), seo: Math.round(c.seo.score * 100), lcp: a["largest-contentful-paint"].displayValue, tbt: a["total-blocking-time"].displayValue, cls: a["cumulative-layout-shift"].displayValue, fails: fails.join(",") });
  } catch (e) { rows.push({ route: r, error: String(e).slice(0, 80) }); }
}
console.table(rows);
