/**
 * End-to-end recruitment submission against a running production server.
 * Starts a mock webhook receiver, then checks that:
 *  - a valid inquiry is delivered as a recruitment_inquiry record and only then shows success;
 *  - when the receiver fails, the form shows an error and never a success message.
 *
 * The server under test must be started with
 *   RECRUITMENT_WEBHOOK_URL=http://127.0.0.1:<MOCK_PORT>/hook
 * Usage: SMOKE_BASE_URL=http://localhost:3000 MOCK_PORT=4099 node tests/e2e/careers-submit.mjs
 */
import { createRequire } from "node:module";
import http from "node:http";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const MOCK_PORT = Number(process.env.MOCK_PORT ?? 4099);

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
      received.push({ headers: req.headers, body: JSON.parse(body) });
      res.end("ok");
    });
  })
  .listen(MOCK_PORT);

const failures = [];
const fail = (m) => failures.push(m);

async function fillForm(page, name) {
  await page.locator("#rf-fullName").fill(name);
  await page.locator("#rf-email").fill("jordan.test@example.com");
  await page.locator("#rf-phone").fill("(813) 555-0142");
  await page.locator("#rf-location").fill("Tampa, FL");
  await page.locator("#rf-profession").fill("Sales manager");
  await page.locator("#rf-experience").selectOption("none");
  await page.locator("#rf-licensingStatus").selectOption("not-licensed");
  await page.locator("#rf-why").fill("I want to build a long-term career helping Florida families.");
  await page.getByRole("radio", { name: "Email" }).check();
  await page.locator("#rf-consent").check();
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
const page = await context.newPage();

// 1. Success path (mobile viewport), pathway preselected by the CTA link.
await page.goto(BASE + "/careers?pathway=aspiring#apply", { waitUntil: "networkidle" });
await fillForm(page, "Jordan Success");
await page.getByRole("button", { name: "Submit Inquiry" }).click();
await page
  .getByTestId("recruitment-success")
  .waitFor({ timeout: 10_000 })
  .catch(() => fail("success state not shown after delivery"));
const rec = received.at(-1)?.body;
if (!rec) fail("mock receiver got nothing");
else {
  if (rec.type !== "recruitment_inquiry" || rec.category !== "careers") fail(`wrong record type ${rec.type}`);
  if (rec.applicant.fullName !== "Jordan Success") fail("wrong applicant");
  if (rec.applicant.careerPathway !== "Aspiring Mortgage Loan Originator")
    fail("pathway not carried through");
  if (rec.applicant.nmlsId !== null) fail("blank NMLS ID should be null");
}

// 2. Failure path: receiver down, no false success.
failMode = true;
const before = received.length;
await page.goto(BASE + "/careers#apply", { waitUntil: "networkidle" });
await fillForm(page, "Jordan Failure");
await page.locator("#rf-pathway").selectOption("licensed");
await page.locator("#rf-nmlsId").fill("1234567");
await page.getByRole("button", { name: "Submit Inquiry" }).click();
await page
  .getByTestId("recruitment-submit-error")
  .waitFor({ timeout: 15_000 })
  .catch(() => fail("error not shown when delivery failed"));
if (await page.getByTestId("recruitment-success").count()) fail("FALSE SUCCESS shown when delivery failed");
if ((await page.locator("#rf-fullName").inputValue()) !== "Jordan Failure")
  fail("entries lost after failure");
if (received.length !== before) fail("failed delivery was recorded");

await browser.close();
server.close();
if (failures.length) {
  console.error(`FAIL (${failures.length})\n- ` + failures.join("\n- "));
  process.exit(1);
}
console.log(
  "PASS: careers submission delivered to mock receiver; delivery failure shows an error, never success",
);
