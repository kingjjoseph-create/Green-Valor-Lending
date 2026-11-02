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
  "/privacy-policy",
  "/terms-of-use",
  "/accessibility",
  "/consumer-complaints",
  ...(STYLEGUIDE ? ["/styleguide"] : []),
];
const LEGAL_ROUTES = [
  "/licensing",
  "/privacy-policy",
  "/terms-of-use",
  "/accessibility",
  "/consumer-complaints",
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
    // Publication guard: licensing is unverified, so every page carries the notice.
    if (!(await page.getByTestId("licensing-notice").isVisible())) fail(`${label}: licensing notice missing`);
    if (/Start Your Secure Mortgage Application/.test(text))
      fail(`${label}: application link shown before licensing`);
    if (LEGAL_ROUTES.includes(route) && !(await page.getByTestId("legal-draft-banner").isVisible()))
      fail(`${label}: legal page missing its draft banner`);
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

  // Non-QM: CTA targets, programs, process steps, responsive comparison, FAQ accordions.
  {
    await page.goto(BASE + "/non-qm");
    const main = page.locator("main");
    const nqmLinks = {
      "Discuss Non-QM Options": "/contact",
      "Ask about your situation": "/contact",
      "Explore Your Options": "/get-started",
    };
    for (const [name, href] of Object.entries(nqmLinks)) {
      const link = main.getByRole("link", { name: new RegExp(`^${name}`) });
      if ((await link.count()) !== 1)
        fail(`${viewport.name}: non-qm "${name}" found ${await link.count()} times`);
      else if ((await link.getAttribute("href")) !== href)
        fail(`${viewport.name}: non-qm "${name}" -> ${await link.getAttribute("href")}`);
    }
    for (const t of [
      "Bank Statement Loans",
      "DSCR Loans",
      "1099 Borrower Programs",
      "Other Alternative Documentation Options",
    ]) {
      if ((await main.getByRole("heading", { name: t, exact: true }).count()) !== 1)
        fail(`${viewport.name}: non-qm heading "${t}" missing`);
    }
    if ((await main.locator(`section[aria-labelledby="nqm-process"] ol > li`).count()) !== 5)
      fail(`${viewport.name}: non-qm should show 5 process steps`);
    const table = main.getByRole("table");
    const tableVisible = await table.isVisible();
    if (viewport.width >= 768 !== tableVisible)
      fail(`${viewport.name}: comparison table visible=${tableVisible} at ${viewport.width}px`);
    if (tableVisible) {
      if ((await table.getByRole("rowheader").count()) !== 5)
        fail(`${viewport.name}: comparison should have 5 row headers`);
      if ((await table.getByRole("columnheader").count()) !== 3)
        fail(`${viewport.name}: comparison should have 3 column headers`);
    } else if (!(await main.getByRole("list", { name: /compared/ }).isVisible())) {
      fail(`${viewport.name}: stacked comparison not visible on mobile`);
    }
    const details = main.locator("details");
    if ((await details.count()) !== 6)
      fail(`${viewport.name}: expected 6 non-qm FAQs, got ${await details.count()}`);
    const faq = details.nth(4);
    await faq.locator("summary").focus();
    await page.keyboard.press("Enter");
    if (!(await faq.evaluate((d) => d.open))) fail(`${viewport.name}: non-qm FAQ did not open with Enter`);
    const overflowOpen = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflowOpen > 0) fail(`${viewport.name}: non-qm overflow ${overflowOpen}px with FAQ open`);
    await axe(page, `${viewport.name} /non-qm (FAQ open)`);
  }

  // Resources: calculator works in a real browser without reloads, FAQ search filters, links route.
  {
    await page.goto(BASE + "/resources");
    const main = page.locator("main");
    await page.evaluate(() => (window.__noReload = true));
    const fill = (label, value) => main.getByLabel(label).fill(value);
    await fill(/home purchase price/i, "375000");
    await fill(/down payment \(dollars\)/i, "75000");
    await fill(/interest rate/i, "6.5");
    const totalText = await main.getByTestId("calculator-total").textContent();
    if (totalText !== "$1,896.20")
      fail(`${viewport.name}: calculator total ${totalText}, expected $1,896.20`);
    await fill(/property taxes per year/i, "4800");
    if ((await main.getByTestId("calculator-total").textContent()) !== "$2,296.20")
      fail(`${viewport.name}: calculator did not add taxes live`);
    if (!(await page.evaluate(() => window.__noReload === true)))
      fail(`${viewport.name}: calculator reloaded the page`);
    // Mobile usability: 16px+ inputs (no iOS zoom), 44px+ targets, numeric keyboard.
    for (const input of await main
      .locator('form[aria-label="Mortgage payment calculator"] input[type=text]')
      .all()) {
      const m = await input.evaluate((el) => ({
        fs: parseFloat(getComputedStyle(el).fontSize),
        h: el.getBoundingClientRect().height,
        im: el.inputMode,
      }));
      if (m.fs < 16 || m.h < 44 || m.im !== "decimal")
        fail(`${viewport.name}: calculator input not mobile-friendly ${JSON.stringify(m)}`);
    }
    for (const radio of ["Dollars", "Percent"]) {
      const box = await main.getByRole("radio", { name: radio }).locator("xpath=..").boundingBox();
      if (!box || box.height < 36 || box.width < 44)
        fail(`${viewport.name}: down payment toggle "${radio}" too small`);
    }
    await fill(/interest rate/i, "-1");
    if ((await main.getByLabel(/interest rate/i).getAttribute("aria-invalid")) !== "true")
      fail(`${viewport.name}: negative rate not flagged`);
    await axe(page, `${viewport.name} /resources (calculator filled, error shown)`);
    await fill(/interest rate/i, "6.5");

    const search = main.getByRole("searchbox", { name: "Search questions" });
    await search.fill("escrow");
    const count = await main.getByTestId("faq-count").textContent();
    if (!/^\d+ of \d+ questions$/.test(count)) fail(`${viewport.name}: FAQ search did not filter (${count})`);
    await search.fill("zzzz");
    if (!(await main.getByText("No questions match your search.").isVisible()))
      fail(`${viewport.name}: FAQ empty state missing`);
    await main.getByRole("button", { name: "Clear search" }).click();
    await main.getByRole("button", { name: "The process" }).click();
    if ((await main.getByRole("button", { name: "The process" }).getAttribute("aria-pressed")) !== "true")
      fail(`${viewport.name}: FAQ category not pressed`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) fail(`${viewport.name}: resources overflow ${overflow}px after interaction`);
    await axe(page, `${viewport.name} /resources (FAQ filtered)`);

    const resLinks = {
      "Learn about residential loans": "/residential-loans",
      "Learn about Non-QM loans": "/non-qm",
      "Speak With Our Team": "/contact",
      "Payment calculator": "#calculator",
    };
    for (const [name, href] of Object.entries(resLinks)) {
      const link = main.getByRole("link", { name: new RegExp(name) });
      if ((await link.count()) !== 1)
        fail(`${viewport.name}: resources "${name}" found ${await link.count()} times`);
      else if ((await link.getAttribute("href")) !== href)
        fail(`${viewport.name}: resources "${name}" -> ${await link.getAttribute("href")}`);
    }
  }

  // About: links route, five values and qualities render, no team section until profiles are approved.
  {
    await page.goto(BASE + "/about");
    const main = page.locator("main");
    const aboutLinks = {
      "Explore borrower resources": "/resources",
      "Explore careers": "/careers",
      "Explore Mortgage Solutions": "/#mortgage-solutions",
      "Join Our Team": "/careers",
    };
    for (const [name, href] of Object.entries(aboutLinks)) {
      const link = main.getByRole("link", { name: new RegExp(`^${name}`) });
      if ((await link.count()) !== 1)
        fail(`${viewport.name}: about "${name}" found ${await link.count()} times`);
      else if ((await link.getAttribute("href")) !== href)
        fail(`${viewport.name}: about "${name}" -> ${await link.getAttribute("href")}`);
    }
    for (const t of ["Integrity", "Service", "Family", "Accountability", "Growth", "Teamwork"]) {
      if (
        (await main.getByRole("heading", { name: t, exact: true }).count()) < 1 &&
        (await main.getByText(t, { exact: true }).count()) < 1
      )
        fail(`${viewport.name}: about "${t}" missing`);
    }
    if ((await main.getByText("Meet the Team.").count()) !== 0)
      fail(`${viewport.name}: team section shown without approved profiles`);
    if (/NMLS ID/.test(await main.innerText())) fail(`${viewport.name}: an NMLS ID is shown on /about`);
    if (viewport.name === "desktop") {
      await main.getByRole("link", { name: /^Explore Mortgage Solutions/ }).click();
      await page
        .waitForURL(/\/#mortgage-solutions$/)
        .catch(() => fail("about solutions CTA did not navigate"));
      await page.goto(BASE + "/about");
      await page
        .locator("main")
        .getByRole("link", { name: /^Join Our Team/ })
        .click();
      await page.waitForURL("**/careers").catch(() => fail("about Join Our Team did not navigate"));
    }
  }

  // Careers: CTAs, pathway preselection, client validation, no mortgage fields, mobile usability.
  // (No submission here; tests/e2e/careers-submit.mjs covers delivery against a mock receiver.)
  {
    const v = viewport.name;
    await page.goto(BASE + "/careers", { waitUntil: "networkidle" });
    const main = page.locator("main");
    const careerLinks = {
      "Apply to Join Our Team": "#apply",
      "Discover Our Culture": "#culture",
      "I'm a Licensed Loan Officer": "/careers?pathway=licensed#apply",
      "I'm Exploring a Mortgage Career": "/careers?pathway=aspiring#apply",
      "Apply Now": "#apply",
    };
    for (const [name, href] of Object.entries(careerLinks)) {
      const link = main.getByRole("link", { name: new RegExp(`^${name}`) });
      if ((await link.count()) !== 1) fail(`${v}: careers "${name}" found ${await link.count()} times`);
      else if ((await link.getAttribute("href")) !== href)
        fail(`${v}: careers "${name}" -> ${await link.getAttribute("href")}`);
    }
    for (const id of ["apply", "culture"])
      if ((await page.locator(`#${id}`).count()) !== 1) fail(`${v}: careers #${id} target missing`);
    if ((await main.locator('input[type="file"]').count()) !== 0) fail(`${v}: careers has a file upload`);
    const names = await main
      .locator("form input, form select, form textarea")
      .evaluateAll((els) => els.map((e) => e.getAttribute("name") ?? ""));
    if (names.some((n) => /loan|property|income|ssn|social|credit|down|asset|birth/i.test(n)))
      fail(`${v}: careers form has mortgage fields: ${names.join(",")}`);
    const small = await main
      .locator("form input:not([type=radio]):not([type=checkbox]), form select, form textarea")
      .evaluateAll(
        (els) => els.filter((e) => e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 16).length,
      );
    if (small) fail(`${v}: ${small} careers inputs below 16px (iOS zoom)`);
    const tiny = await main
      .locator(
        "form input:not([type=radio]):not([type=checkbox]):not([name=company_website]), form select, form button",
      )
      .evaluateAll(
        (els) => els.filter((e) => e.offsetParent && e.getBoundingClientRect().height < 44).length,
      );
    if (tiny) fail(`${v}: ${tiny} careers controls shorter than 44px`);

    // Hero CTA scrolls to the form.
    await main.getByRole("link", { name: /^Apply to Join Our Team/ }).click();
    await page.waitForTimeout(400);
    const formTop = await page.locator("#apply").evaluate((el) => el.getBoundingClientRect().top);
    if (Math.abs(formTop) > 120) fail(`${v}: Apply CTA did not scroll to the form (top ${formTop})`);

    // Pathway CTAs preselect the category.
    for (const [name, value] of [
      ["I'm a Licensed Loan Officer", "licensed"],
      ["I'm Exploring a Mortgage Career", "aspiring"],
    ]) {
      await main.getByRole("link", { name: new RegExp(`^${name}`) }).click();
      await page
        .waitForURL(new RegExp(`pathway=${value}`))
        .catch(() => fail(`${v}: "${name}" did not navigate`));
      await page.waitForTimeout(300);
      const selected = await page.locator("#rf-pathway").inputValue();
      if (selected !== value) fail(`${v}: "${name}" preselected "${selected}", expected "${value}"`);
    }
    // A direct visit with the parameter also preselects.
    await page.goto(BASE + "/careers?pathway=licensed#apply", { waitUntil: "networkidle" });
    if ((await page.locator("#rf-pathway").inputValue()) !== "licensed")
      fail(`${v}: direct ?pathway=licensed did not preselect`);

    // Empty submission is rejected client-side; no request is sent.
    let posted = 0;
    const onReq = (r) => r.url().includes("/api/recruitment") && posted++;
    page.on("request", onReq);
    await page.getByRole("button", { name: "Submit Inquiry" }).click();
    const summary = page.getByTestId("recruitment-error-summary");
    if (!(await summary.isVisible())) fail(`${v}: empty careers submission not rejected`);
    if (!(await summary.evaluate((el) => el === document.activeElement)))
      fail(`${v}: error summary not focused`);
    // Invalid email rejected; NMLS ID is not required.
    await page.locator("#rf-email").fill("jordan@example");
    await page.getByRole("button", { name: "Submit Inquiry" }).click();
    const errText = await summary.innerText();
    if (!/valid email/i.test(errText)) fail(`${v}: invalid email not rejected`);
    if (/NMLS/i.test(errText)) fail(`${v}: NMLS ID treated as required`);
    if (posted) fail(`${v}: invalid careers form was sent to the server`);
    page.off("request", onReq);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) fail(`${v}: careers overflow ${overflow}px with errors shown`);
    await axe(page, `${v} /careers (errors shown)`);
  }

  // Contact: verified info only, callouts, career routing, client validation, mobile keyboards.
  // (No submission here; tests/e2e/contact-submit.mjs covers delivery against a mock receiver.)
  {
    const v = viewport.name;
    // Fresh context: after many loads, local `next start` (HTTP/1.1) leaves link-prefetch
    // responses open, which stalls "networkidle". This also happens on main; real page
    // loads are unaffected (load fires in ~100 ms).
    const contactContext = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await contactContext.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
    const main = page.locator("main");
    const rows = await main
      .locator("[data-testid=contact-info] [data-row]")
      .evaluateAll((els) => els.map((e) => e.getAttribute("data-row")));
    if (rows.join() !== "company,service")
      fail(`${v}: contact rows ${rows.join()} (expected only company,service)`);
    if (await main.locator("[data-testid=contact-info] [data-row] > div > div:empty").count())
      fail(`${v}: blank contact row`);
    for (const [name, href] of [
      ["Get Started", "/get-started"],
      ["Explore Careers", "/careers"],
    ]) {
      const link = main.getByRole("link", { name: new RegExp(`^${name}`) });
      if ((await link.count()) !== 1) fail(`${v}: contact "${name}" found ${await link.count()} times`);
      else if ((await link.getAttribute("href")) !== href)
        fail(`${v}: contact "${name}" -> ${await link.getAttribute("href")}`);
    }
    const kb = await page.evaluate(() => ({
      email: [document.querySelector("#cf-email")?.type, document.querySelector("#cf-email")?.inputMode],
      phone: [document.querySelector("#cf-phone")?.type, document.querySelector("#cf-phone")?.inputMode],
    }));
    if (kb.email.join() !== "email,email" || kb.phone.join() !== "tel,tel")
      fail(`${v}: contact keyboards ${JSON.stringify(kb)}`);
    const small = await main
      .locator("form input:not([type=checkbox]):not([name=website]), form select, form textarea")
      .evaluateAll(
        (els) => els.filter((e) => e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 16).length,
      );
    if (small) fail(`${v}: ${small} contact inputs below 16px`);

    let posted = 0;
    const onReq = (r) => r.url().includes("/api/contact") && posted++;
    page.on("request", onReq);
    await page.getByRole("button", { name: "Send Message" }).click();
    const summary = page.getByTestId("contact-error-summary");
    if (!(await summary.isVisible())) fail(`${v}: blank contact form not rejected`);
    await page.locator("#cf-email").fill("pat@example");
    await page.locator("#cf-phone").fill("555-0100");
    await page.locator("#cf-message").fill("x".repeat(2500));
    if ((await page.locator("#cf-message").inputValue()).length !== 2000)
      fail(`${v}: message not capped at 2000`);
    await page.getByRole("button", { name: "Send Message" }).click();
    const t = await summary.innerText();
    if (!/valid email/i.test(t) || !/valid phone/i.test(t)) fail(`${v}: invalid email/phone not rejected`);
    if (posted) fail(`${v}: invalid contact form was sent to the server`);
    page.off("request", onReq);
    await axe(page, `${v} /contact (errors shown)`);

    await page.locator("#cf-reason").selectOption("career");
    const go = page.getByRole("link", { name: /Go to the Careers Form/ });
    if ((await go.getAttribute("href")) !== "/careers#apply") fail(`${v}: career routing link wrong`);
    if (await page.getByRole("button", { name: "Send Message" }).count())
      fail(`${v}: career reason still submittable`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) fail(`${v}: contact overflow ${overflow}px`);
    await axe(page, `${v} /contact (career notice)`);
    await contactContext.close();
  }

  // Get Started: wizard steps, Back keeps entries, Florida-only, numbers, no sensitive fields.
  // (No submission here; tests/e2e/inquiry-submit.mjs covers delivery against a mock CRM.)
  {
    const v = viewport.name;
    const gsContext = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await gsContext.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(BASE + "/get-started", { waitUntil: "networkidle" });
    const count = () => page.getByTestId("step-count").textContent();
    const nextBtn = () => page.getByRole("button", { name: /^Next/ }).click();
    let posted = 0;
    page.on("request", (r) => r.url().includes("/api/inquiry") && posted++);

    await nextBtn();
    if ((await count()) !== "Step 1 of 4") fail(`${v}: get-started advanced without a goal`);
    await page.locator("label", { hasText: "Finance an Investment Property" }).click();
    await nextBtn();
    if ((await count()) !== "Step 2 of 4") fail(`${v}: goal step did not advance`);
    if ((await page.locator("#gs-propertyState").inputValue()) !== "FL")
      fail(`${v}: Florida not preselected`);
    await page.locator("#gs-propertyState").selectOption("CA");
    if (!(await page.getByTestId("florida-only").isVisible())) fail(`${v}: Florida-only notice missing`);
    await page.locator("#gs-location").fill("Orlando");
    await page.locator("#gs-propertyType").selectOption("multi-unit");
    await page.locator("#gs-occupancy").selectOption("investment");
    await nextBtn();
    if ((await count()) !== "Step 2 of 4") fail(`${v}: advanced with an out-of-state property`);
    await page.locator("#gs-propertyState").selectOption("FL");
    await page.locator("#gs-estimatedValue").fill("12x");
    await nextBtn();
    if ((await count()) !== "Step 2 of 4") fail(`${v}: advanced with an invalid amount`);
    await page.locator("#gs-estimatedValue").fill("610000");
    await page.locator("#gs-location").focus();
    if ((await page.locator("#gs-estimatedValue").inputValue()) !== "610,000")
      fail(`${v}: amount not formatted`);
    await axe(page, `${v} /get-started (step 2)`);
    await nextBtn();
    if ((await count()) !== "Step 3 of 4") fail(`${v}: property step did not advance`);
    await page.locator("#gs-timeline").selectOption("3-6-months");
    await page.locator("#gs-notes").fill("Two rentals already.");
    await nextBtn();
    if ((await count()) !== "Step 4 of 4") fail(`${v}: financing step did not advance`);
    const kb = await page.evaluate(() => [
      document.querySelector("#gs-email")?.type,
      document.querySelector("#gs-email")?.inputMode,
      document.querySelector("#gs-phone")?.type,
    ]);
    if (kb.join() !== "email,email,tel") fail(`${v}: get-started keyboards ${kb}`);
    await page.getByRole("button", { name: "Submit Inquiry" }).click();
    if ((await count()) !== "Step 4 of 4") fail(`${v}: blank contact step left step 4`);
    await axe(page, `${v} /get-started (step 4 errors)`);
    for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Back" }).click();
    if ((await count()) !== "Step 1 of 4") fail(`${v}: Back did not reach step 1`);
    if (!(await page.locator("#gs-goal-investment").isChecked())) fail(`${v}: goal lost after Back`);
    await nextBtn();
    if ((await page.locator("#gs-location").inputValue()) !== "Orlando")
      fail(`${v}: location lost after Back`);
    await nextBtn();
    if ((await page.locator("#gs-notes").inputValue()) !== "Two rentals already.")
      fail(`${v}: notes lost after Back`);
    const names = await page
      .locator("form input, form select, form textarea")
      .evaluateAll((els) => els.map((e) => e.getAttribute("name") ?? ""));
    if (names.some((n) => /ssn|social|birth|dob|account|routing|tax|paystub|license|credit/i.test(n)))
      fail(`${v}: sensitive field on get-started: ${names}`);
    if (posted) fail(`${v}: incomplete inquiry was sent`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) fail(`${v}: get-started overflow ${overflow}px`);
    await gsContext.close();
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
  // Hero video: muted, looping, playing, hidden from assistive tech; the pause button works.
  const video = page.getByTestId("home-hero-video");
  await page.waitForFunction(() => !document.querySelector("[data-testid=home-hero-video]").paused, null, {
    timeout: 10_000,
  });
  const v = await video.evaluate((el) => ({
    muted: el.muted,
    loop: el.loop,
    hidden: el.getAttribute("aria-hidden"),
  }));
  if (!v.muted || !v.loop || v.hidden !== "true") fail(`hero video attributes wrong: ${JSON.stringify(v)}`);
  const toggle = page.getByRole("button", { name: "Pause background video" });
  await toggle.click();
  if (!(await video.evaluate((el) => el.paused))) fail("hero video did not pause");
  await page.getByRole("button", { name: "Play background video" }).click();
  if (await video.evaluate((el) => el.paused)) fail("hero video did not resume");
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
  await page.waitForTimeout(1000);
  if (!(await page.getByTestId("home-hero-video").evaluate((el) => el.paused)))
    fail("reduced motion: hero video should not play");
  if (!(await page.getByRole("button", { name: "Play background video" }).isVisible()))
    fail("reduced motion: play button missing");
  await context.close();
}

for (const [from, to] of [
  ["/privacy", "/privacy-policy"],
  ["/terms", "/terms-of-use"],
  ["/complaints", "/consumer-complaints"],
]) {
  const r = await fetch(BASE + from, { redirect: "manual" });
  if (r.status !== 308 || !r.headers.get("location")?.endsWith(to))
    fail(`${from} should redirect to ${to} (got ${r.status})`);
}
const robots = await (await fetch(BASE + "/robots.txt")).text();
if (!/Disallow: \//.test(robots)) fail("robots.txt should block crawling before launch");
const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
if (!sitemap.includes("/consumer-complaints")) fail("sitemap missing /consumer-complaints");
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
    "header/drawer keyboard + scroll lock, footer links, logo scaling, careers CTAs/preselection/validation, contact info/validation/career routing, get-started wizard, axe (WCAG 2.1 AA + best practice), licensing notice + legal draft banners, legacy legal redirects, hero video (loop/pause/reduced motion), motion, robots/sitemap",
);
