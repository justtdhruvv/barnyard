import { chromium } from "playwright";
import fs from "node:fs";

export const BASE = process.env.BASE || "http://localhost:3022";
const failures = [];

export async function launch() {
  return chromium.launch({ headless: !process.env.HEADED });
}

/** Opens a page at `path` (its own query kept), pinning the house to `at` and the motion preference. */
export async function open(browser, path, { width = 390, height = 844, at, reducedMotion = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: width < 800 ? 3 : 2, reducedMotion: reducedMotion ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const [p, qs] = path.split("?");
  // the colon stays a colon: the house reads ?at=HH:MM as people type it
  const q = [qs, at ? `at=${at}` : ""].filter(Boolean).join("&");
  await page.goto(`${BASE}${p}${q ? `?${q}` : ""}`, { waitUntil: "networkidle" });
  return { page, ctx, errors };
}

export async function shot(page, name, fullPage = false) {
  fs.mkdirSync("shots", { recursive: true });
  await page.screenshot({ path: `shots/${name}.png`, fullPage });
}

export function assert(cond, msg) {
  if (cond) console.log(`  ok  ${msg}`);
  else { console.log(`  FAIL ${msg}`); failures.push(msg); }
}

export function report() {
  if (failures.length) { console.log(`\n${failures.length} failure(s)`); process.exit(1); }
  console.log("\nall checks passed");
}
