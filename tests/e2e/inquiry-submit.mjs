/**
 * End-to-end Get Started submissions against a running production server with
 * a mock CRM. Start the server with INQUIRY_WEBHOOK_URL=http://127.0.0.1:<MOCK_PORT>/hook
 * (and NEXT_PUBLIC_BORROWER_APPLICATION_URL set or unset to match ARIVE=on|off).
 * Usage: SMOKE_BASE_URL=http://localhost:3000 MOCK_PORT=4097 ARIVE=off node tests/e2e/inquiry-submit.mjs
 *
 * Checks: valid submission, record classification, double-click sends once,
 * backend error and network timeout show errors (never success), ARIVE link
 * shown only when configured, and no applicant data in the browser console
 * or storage.
 */
import { createRequire } from "node:module";
import http from "node:http";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const MOCK_PORT = Number(process.env.MOCK_PORT ?? 4097);
const ARIVE = process.env.ARIVE === "on";

let failMode = false;
const received = [];
const server = http
  .createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      if (failMode) {
        res.statusCode = 500;
        return res.end("down");
      }
      received.push(JSON.parse(body));
      res.end("ok");
    });
  })
  .listen(MOCK_PORT);

const failures = [];
const fail = (m) => failures.push(m);
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
const consoleText = [];
page.on("console", (m) => consoleText.push(m.text()));
let ip = 20;
const routeIp = () =>
  page.route("**/api/inquiry", (route) =>
    route.continue({ headers: { ...route.request().headers(), "x-forwarded-for": `192.0.2.${ip}` } }),
  );
await routeIp();

async function complete({ goal = "Purchase a Home", email = "morgan@example.com" } = {}) {
  ip++;
  await page.goto(BASE + "/get-started", { waitUntil: "load" });
  await page.locator("label", { hasText: goal }).click();
  await page.getByRole("button", { name: /^Next/ }).click();
  await page.locator("#gs-location").fill("Tampa");
  await page.locator("#gs-propertyType").selectOption("single-family");
  await page.locator("#gs-occupancy").selectOption("primary");
  await page.locator("#gs-estimatedValue").fill("425000");
  await page.getByRole("button", { name: /^Next/ }).click();
  await page.locator("#gs-loanAmount").fill("340000");
  await page.locator("#gs-timeline").selectOption("asap");
  await page.getByRole("button", { name: /^Next/ }).click();
  await page.locator("#gs-fullName").fill("Morgan Lee");
  await page.locator("#gs-email").fill(email);
  await page.locator("#gs-phone").fill("(813) 555-0142");
  await page.getByText("Phone call").click();
  await page.locator("#gs-consent").check();
  await page.waitForTimeout(5200); // the server rejects bot-speed submissions
}
const success = () =>
  page
    .getByTestId("inquiry-success")
    .waitFor({ timeout: 10_000 })
    .then(
      () => true,
      () => false,
    );
const errorShown = (t = 10_000) =>
  page
    .getByTestId("inquiry-submit-error")
    .waitFor({ timeout: t })
    .then(
      () => true,
      () => false,
    );

// 1. Valid submission with a double click: delivered exactly once, classified.
await complete({ goal: "Explore a Non-QM Mortgage" });
const before = received.length;
await page.getByRole("button", { name: "Submit Inquiry" }).dblclick();
if (!(await success())) fail("valid submission did not show the confirmation");
if (received.length - before !== 1) fail(`double click delivered ${received.length - before} records`);
const r = received.at(-1);
if (
  r?.type !== "mortgage_inquiry" ||
  r.classification.productInterest !== "non-qm" ||
  r.property.state !== "FL"
)
  fail(`record classification wrong: ${JSON.stringify(r?.classification)}`);
const text = await page.getByTestId("inquiry-success").innerText();
if (!text.includes("Thank you for contacting Green Valor Lending. Your inquiry has been received."))
  fail("approved confirmation wording missing");
const ariveShown = (await page.getByTestId("arive-cta").count()) > 0;
if (ARIVE && !ariveShown) fail("ARIVE link enabled but not shown");
if (!ARIVE && ariveShown) fail("ARIVE link shown while not configured");

// 2. Backend error.
failMode = true;
await complete({ email: "second@example.com" });
await page.getByRole("button", { name: "Submit Inquiry" }).click();
if (!(await errorShown())) fail("backend error not shown");
if (await page.getByTestId("inquiry-success").count()) fail("FALSE SUCCESS on backend error");
failMode = false;

// 3. Network timeout: the request never answers.
await complete({ email: "third@example.com" });
await page.unroute("**/api/inquiry");
await page.route("**/api/inquiry", () => {}); // hang forever
await page.getByRole("button", { name: "Submit Inquiry" }).click();
if (!(await errorShown(30_000))) fail("network timeout not reported");
if (!/timed out/i.test(await page.getByTestId("inquiry-submit-error").innerText()))
  fail("timeout message missing");
if (await page.getByTestId("inquiry-success").count()) fail("FALSE SUCCESS on timeout");
await page.unroute("**/api/inquiry");
await routeIp();

// 4. Privacy: no applicant data in console or storage.
const storage = await page.evaluate(
  () => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }),
);
if (/Morgan|morgan@|555-0142/.test(storage)) fail("applicant data found in browser storage");
if (consoleText.some((t) => /Morgan|morgan@|555-0142|Tampa/.test(t)))
  fail("applicant data written to console");

await browser.close();
server.close();
if (failures.length) {
  console.error(`FAIL (${failures.length})\n- ` + failures.join("\n- "));
  process.exit(1);
}
console.log(
  `PASS: inquiry delivered once on double click and classified; backend error and timeout never show success; ARIVE ${ARIVE ? "shown" : "hidden"} as configured; no applicant data in console/storage`,
);
