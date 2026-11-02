/**
 * Saves full-page screenshots for visual review.
 * Usage: node tests/e2e/visual-review.mjs [route=/] [outDir=docs/visual-review] [name=homepage]
 * Requires a running server (SMOKE_BASE_URL, default http://localhost:3000).
 * Scrolls the page first so lazy-loaded images are present in the capture.
 */
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const [route = "/", outDir = "docs/visual-review", name = "homepage"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
for (const vp of [
  { label: "desktop", width: 1440, height: 900 },
  { label: "mobile", width: 390, height: 844 },
]) {
  const context = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  // Wait (bounded) for visible images to finish loading; hidden lazy images never load.
  await page.evaluate(() =>
    Promise.race([
      Promise.all([...document.images].filter((i) => i.offsetParent).map((i) => i.decode().catch(() => {}))),
      new Promise((r) => setTimeout(r, 5000)),
    ]),
  );
  const file = `${outDir}/${name}-${vp.label}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log("saved", file);
  await context.close();
}
await browser.close();
