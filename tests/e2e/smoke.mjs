/**
 * Browser smoke + accessibility audit against a running server.
 *
 *   npm run build && npm start            # in one terminal
 *   npm run test:e2e                      # in another
 *
 * Env:
 *   SMOKE_BASE_URL     default http://localhost:3000
 *   SMOKE_STYLEGUIDE=1 also audit /styleguide (build with NEXT_PUBLIC_ENABLE_STYLEGUIDE=true);
 *                      otherwise asserts /styleguide returns 404
 *   SMOKE_SCREENSHOTS  directory to write full-page screenshots
 *
 * Uses the Playwright runtime available in the environment (`playwright` package) and axe-core.
 */
import { createRequire } from "node:module";
import { mkdirSync, readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const SHOTS = process.env.SMOKE_SCREENSHOTS;
const STYLEGUIDE = process.env.SMOKE_STYLEGUIDE === "1";

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
  "/complaints",
  ...(STYLEGUIDE ? ["/styleguide"] : []),
];
const navTitles = [
  "Home",
  "Residential Loans",
  "Non-QM Loans",
  "Resources",
  "About Us",
  "Careers",
  "Contact",
];
const footerLinks = [
  "Residential Loans",
  "Non-QM Loans",
  "Careers",
  "Resources",
  "Contact",
  "Licensing",
  "Privacy Policy",
  "Terms of Use",
  "Accessibility",
  "Consumer Complaints",
  "NMLS Consumer Access",
];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small", width: 320, height: 640 },
];

const failures = [];
const fail = (msg) => failures.push(msg);
const browser = await chromium.launch();

async function axe(page, label) {
  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] });
    return r.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(" ")}`);
  });
  if (violations.length) fail(`${label}: axe ${violations.join(" | ")}`);
}

for (const viewport of viewports) {
  // Audit content in its final (post-animation) state; motion is checked separately below.
  const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  for (const route of routes) {
    const label = `${viewport.name} ${route}`;
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    if (res?.status() !== 200) fail(`${label}: HTTP ${res?.status()}`);
    if ((await page.locator("h1").count()) !== 1) fail(`${label}: expected exactly one <h1>`);
    const text = await page.locator("body").innerText();
    if (/\bundefined\b|\bnull\b|NaN|\[object Object\]/.test(text))
      fail(`${label}: placeholder value rendered`);
    if (/NMLS\s*#/i.test(text)) fail(`${label}: NMLS number shown while none is configured`);
    if (/Equal Housing/i.test(text)) fail(`${label}: Equal Housing shown before approval`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) fail(`${label}: horizontal overflow ${overflow}px`);
    await axe(page, label);

    if (SHOTS && ["/", "/about", "/styleguide"].includes(route)) {
      mkdirSync(SHOTS, { recursive: true });
      const name = route === "/" ? "home" : route.slice(1);
      await page.screenshot({ path: `${SHOTS}/${viewport.name}-${name}.png`, fullPage: true });
    }
  }

  await page.goto(BASE + "/");

  // Homepage CTAs point where they should and every image has an alt attribute.
  const expectedLinks = {
    "Explore Loan Options": "#mortgage-solutions",
    "Explore Careers": "/careers",
    "Learn more about us": "/about",
    "Explore Residential Loans": "/residential-loans",
    "Explore Non-QM Loans": "/non-qm",
    "Explore Resources": "/resources",
    "Discover the Green Valor Difference": "/careers",
    "Explore Career Opportunities": "/careers",
    "Join Our Team": "/careers",
  };
  const main = page.locator("main");
  for (const [name, href] of Object.entries(expectedLinks)) {
    const link = main.getByRole("link", { name: new RegExp(`^${name}`) });
    if ((await link.count()) !== 1)
      fail(`${viewport.name}: home link "${name}" found ${await link.count()} times`);
    else if ((await link.getAttribute("href")) !== href)
      fail(`${viewport.name}: "${name}" -> ${await link.getAttribute("href")}`);
  }
  if ((await page.locator("#mortgage-solutions").count()) !== 1)
    fail(`${viewport.name}: #mortgage-solutions anchor missing`);
  const missingAlt = await page.locator("img:not([alt])").count();
  if (missingAlt) fail(`${viewport.name}: ${missingAlt} image(s) without alt`);

  // Logo: official horizontal file, aspect ratio preserved, sensible size.
  const logo = await page
    .locator("header img")
    .first()
    .evaluate((img) => ({
      w: img.getBoundingClientRect().width,
      h: img.getBoundingClientRect().height,
      src: img.currentSrc,
    }));
  const ratio = logo.w / logo.h;
  if (Math.abs(ratio - 1400 / 349) > 0.05)
    fail(`${viewport.name}: header logo distorted (ratio ${ratio.toFixed(3)})`);
  if (logo.h < 30 || logo.h > 52) fail(`${viewport.name}: header logo height ${logo.h}px out of range`);
  if (!/green-valor-horizontal/.test(logo.src))
    fail(`${viewport.name}: header is not using the horizontal logo`);

  // Get Started is always visible in the header.
  if (!(await page.locator("header").getByRole("link", { name: "Get Started" }).first().isVisible()))
    fail(`${viewport.name}: header Get Started not visible`);

  // Footer contains every required link.
  const footer = page.locator("footer");
  for (const name of footerLinks) {
    if ((await footer.getByRole("link", { name: new RegExp(`^${name}`) }).count()) < 1)
      fail(`${viewport.name}: footer missing "${name}"`);
  }

  if (viewport.width >= 1280) {
    const nav = page.getByRole("navigation", { name: "Primary" });
    const titles = await nav.getByRole("link").allTextContents();
    if (titles.join("|") !== navTitles.join("|"))
      fail(`${viewport.name}: primary nav is ${titles.join(", ")}`);
    if (await page.getByRole("button", { name: "Open menu" }).isVisible())
      fail(`${viewport.name}: hamburger visible`);
    await page.keyboard.press("Tab");
    const first = await page.evaluate(() => document.activeElement?.textContent);
    if (first !== "Skip to main content") fail(`${viewport.name}: first tab stop is "${first}"`);
    await page.keyboard.press("Enter");
    const focusedMain = await page.evaluate(() => document.activeElement?.id);
    if (focusedMain !== "main-content") fail(`${viewport.name}: skip link did not move focus to main`);
    await nav.getByRole("link", { name: "Non-QM Loans" }).click();
    await page.waitForURL("**/non-qm");
    if ((await nav.locator('[aria-current="page"]').textContent()) !== "Non-QM Loans")
      fail(`${viewport.name}: active nav state not set`);
  } else {
    if (await page.getByRole("navigation", { name: "Primary" }).isVisible())
      fail(`${viewport.name}: desktop nav visible on small screen`);
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();

    // Background scroll is locked while open.
    const locked = await page.evaluate(
      () =>
        getComputedStyle(document.body).overflow === "hidden" ||
        document.body.hasAttribute("data-scroll-locked"),
    );
    if (!locked) fail(`${viewport.name}: background scroll not locked with drawer open`);

    // All links present, CTA visible, focus trapped.
    const links = await dialog
      .getByRole("navigation", { name: "Mobile" })
      .getByRole("link")
      .allTextContents();
    if (links.map((t) => t.trim()).join("|") !== navTitles.join("|"))
      fail(`${viewport.name}: drawer links are ${links.join(", ")}`);
    if (!(await dialog.getByRole("link", { name: /Get Started/ }).isVisible()))
      fail(`${viewport.name}: drawer Get Started not visible`);
    await axe(page, `${viewport.name} drawer`);
    for (let i = 0; i < 15; i++) await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
    if (!inside) fail(`${viewport.name}: focus escaped the open drawer`);

    // Escape closes and returns focus to the trigger.
    await page.keyboard.press("Escape");
    await dialog
      .waitFor({ state: "hidden", timeout: 2000 })
      .catch(() => fail(`${viewport.name}: Escape did not close drawer`));
    const back = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    if (back !== "Open menu") fail(`${viewport.name}: focus not returned to menu button`);
    const unlocked = await page.evaluate(() => getComputedStyle(document.body).overflow !== "hidden");
    if (!unlocked) fail(`${viewport.name}: scroll still locked after closing`);

    // Navigating from the drawer closes it.
    await trigger.click();
    await dialog.waitFor();
    await dialog.getByRole("link", { name: "Careers" }).click();
    await page.waitForURL("**/careers");
    await dialog
      .waitFor({ state: "hidden", timeout: 2000 })
      .catch(() => fail(`${viewport.name}: drawer did not close after navigation`));
  }

  if (viewport.name === "desktop") {
    await page.goto(BASE + "/");
    await page
      .locator("main")
      .getByRole("link", { name: /^Explore Career Opportunities/ })
      .click();
    await page.waitForURL("**/careers").catch(() => fail("home careers CTA did not open /careers"));
    await page.goto(BASE + "/");
    await page
      .locator("main")
      .getByRole("link", { name: /^Explore Residential Loans/ })
      .click();
    await page.waitForURL("**/residential-loans").catch(() => fail("residential card CTA did not navigate"));
  }

  // Residential Loans: CTA targets, program cards, FAQ accordions open/close by mouse and keyboard.
  {
    await page.goto(BASE + "/residential-loans");
    const main = page.locator("main");
    const resLinks = {
      "Discuss Your Home Loan Options": "/contact",
      "Ask about your situation": "/contact",
      "Get Started": "/get-started",
    };
    for (const [name, href] of Object.entries(resLinks)) {
      const link = main.getByRole("link", { name: new RegExp(`^${name}`) });
      if ((await link.count()) !== 1)
        fail(`${viewport.name}: residential "${name}" found ${await link.count()} times`);
      else if ((await link.getAttribute("href")) !== href)
        fail(`${viewport.name}: residential "${name}" -> ${await link.getAttribute("href")}`);
    }
    for (const t of [
      "Conventional Loans",
      "FHA Loans",
      "VA Loans",
      "Other Residential Options",
      "Purchase",
      "Refinance",
    ]) {
      if ((await main.getByRole("heading", { name: t, exact: true }).count()) !== 1)
        fail(`${viewport.name}: residential heading "${t}" missing`);
    }
    const details = main.locator("details");
    if ((await details.count()) !== 6)
      fail(`${viewport.name}: expected 6 residential FAQs, got ${await details.count()}`);
    const first = details.first();
    await first.locator("summary").click();
    if (!(await first.evaluate((d) => d.open))) fail(`${viewport.name}: FAQ did not open on click`);
    await first.locator("summary").click();
    if (await first.evaluate((d) => d.open)) fail(`${viewport.name}: FAQ did not close on click`);
    const last = details.last();
    await last.locator("summary").focus();
    await page.keyboard.press("Enter");
    if (!(await last.evaluate((d) => d.open))) fail(`${viewport.name}: FAQ did not open with Enter`);
    const faqLink = last.getByRole("link", { name: /^Get started/ });
    if ((await faqLink.getAttribute("href")) !== "/get-started")
      fail(`${viewport.name}: FAQ get-started link wrong`);
    const overflowOpen = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflowOpen > 0) fail(`${viewport.name}: residential overflow ${overflowOpen}px with FAQ open`);
    await axe(page, `${viewport.name} /residential-loans (FAQ open)`);
  }

  if (errors.length) fail(`${viewport.name}: console errors: ${[...new Set(errors)].join(" | ")}`);
  await context.close();
}

// Motion: with normal motion preferences, pages still render and animate without errors.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const animated = await page.evaluate(
    () => getComputedStyle(document.querySelector(".gv-fade-in")).animationName,
  );
  if (animated !== "gv-fade-up") fail(`motion: hero fade-in not applied (got ${animated})`);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await axe(page, "motion / scrolled to bottom");
  if (errors.length) fail(`motion: ${errors.join(" | ")}`);
  await context.close();
}
{
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(BASE + "/");
  const name = await page.evaluate(
    () => getComputedStyle(document.querySelector(".gv-fade-in")).animationName,
  );
  if (name !== "none") fail(`reduced motion: animations still applied (${name})`);
  await context.close();
}

const robots = await (await fetch(BASE + "/robots.txt")).text();
if (!/Disallow: \//.test(robots)) fail("robots.txt should block crawling before launch");
const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
if (!sitemap.includes("/complaints")) fail("sitemap missing /complaints");
if (sitemap.includes("/styleguide")) fail("sitemap must not list /styleguide");
if (!STYLEGUIDE) {
  const sg = await fetch(BASE + "/styleguide");
  if (sg.status !== 404) fail(`/styleguide should be 404 when disabled (got ${sg.status})`);
}

await browser.close();
if (failures.length) {
  console.error(`FAIL (${failures.length})\n- ` + failures.join("\n- "));
  process.exit(1);
}
console.log(
  `PASS: ${routes.length} routes x ${viewports.length} viewports (${viewports.map((v) => v.width).join("/")}), ` +
    "header/drawer keyboard + scroll lock, footer links, logo scaling, axe (WCAG 2.1 AA + best practice), motion, robots/sitemap",
);
