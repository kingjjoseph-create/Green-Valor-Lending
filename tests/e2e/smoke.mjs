/**
 * Smoke test against a running server (default http://localhost:3000).
 * Usage: npm run build && npm run start & npm run test:e2e
 * Uses the Playwright runtime available in the environment (`playwright` package).
 */
import { createRequire } from "node:module";
import { mkdirSync, readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const SHOTS = process.env.SMOKE_SCREENSHOTS; // optional output dir
const routes = [
  "/",
  "/residential-loans",
  "/non-qm",
  "/resources",
  "/about",
  "/careers",
  "/contact",
  "/get-started",
  "/licensing",
  "/privacy",
  "/terms",
  "/accessibility",
];

const failures = [];
const fail = (msg) => failures.push(msg);

const browser = await chromium.launch();
for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  for (const route of routes) {
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    if (res?.status() !== 200) fail(`${viewport.name} ${route}: HTTP ${res?.status()}`);
    if ((await page.locator("h1").count()) !== 1)
      fail(`${viewport.name} ${route}: expected exactly one <h1>`);
    const text = await page.locator("body").innerText();
    if (/\bundefined\b|\bnull\b|NaN/.test(text))
      fail(`${viewport.name} ${route}: placeholder value rendered`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflow) fail(`${viewport.name} ${route}: horizontal overflow`);

    await page.addScriptTag({ content: axeSource });
    const violations = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa"] });
      return r.violations.map((v) => `${v.id} (${v.nodes.length})`);
    });
    if (violations.length) fail(`${viewport.name} ${route}: axe ${violations.join(", ")}`);
    if (SHOTS && (route === "/" || route === "/about")) {
      mkdirSync(SHOTS, { recursive: true });
      await page.screenshot({
        path: `${SHOTS}/${viewport.name}${route === "/" ? "-home" : route.replace(/\//g, "-")}.png`,
        fullPage: true,
      });
    }
  }

  if (viewport.name !== "desktop") {
    await page.goto(BASE + "/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    await dialog.getByRole("link", { name: "Careers" }).click();
    await page.waitForURL("**/careers");
    await dialog
      .waitFor({ state: "hidden", timeout: 2000 })
      .catch(() => fail("mobile menu did not close after navigation"));
  } else {
    await page.goto(BASE + "/");
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.textContent);
    if (focused !== "Skip to main content") fail(`first tab stop is "${focused}", expected skip link`);
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Non-QM Loans" })
      .click();
    await page.waitForURL("**/non-qm");
    const current = await page.locator('[aria-current="page"]').first().textContent();
    if (current !== "Non-QM Loans") fail("active nav state not set");
  }

  if (errors.length) fail(`${viewport.name}: console errors: ${[...new Set(errors)].join(" | ")}`);
  await page.close();
}

const robots = await (await fetch(BASE + "/robots.txt")).text();
if (!/Disallow: \//.test(robots)) fail("robots.txt should block crawling before launch");

await browser.close();
if (failures.length) {
  console.error(`FAIL (${failures.length})\n- ` + failures.join("\n- "));
  process.exit(1);
}
console.log(`PASS: ${routes.length} routes x 3 viewports (1440, 1024, 390), nav, a11y (axe), robots`);
