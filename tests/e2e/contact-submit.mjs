/**
 * End-to-end contact submissions against a running production server, using
 * a mock CRM webhook. Start the server with
 *   CONTACT_WEBHOOK_URL=http://127.0.0.1:<MOCK_PORT>/hook
 * Usage: SMOKE_BASE_URL=http://localhost:3000 MOCK_PORT=4098 node tests/e2e/contact-submit.mjs
 *
 * Checks: success only after the backend accepts; record classification
 * (routing); duplicate submissions delivered once; spam challenge failure;
 * network failure; delivery failure; career reason never submitted.
 */
import { createRequire } from "node:module";
import http from "node:http";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const MOCK_PORT = Number(process.env.MOCK_PORT ?? 4098);

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
// Each scenario uses its own client address so the per-IP rate limit doesn't interfere.
let ip = 10;
await page.route("**/api/contact", (route) =>
  route.continue({ headers: { ...route.request().headers(), "x-forwarded-for": `192.0.2.${ip}` } }),
);

async function open() {
  ip++;
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
}
async function fill({
  reason = "residential",
  message = "We hope to buy our first home in Tampa next year.",
  wait = true,
} = {}) {
  await page.locator("#cf-fullName").fill("Pat Rivera");
  await page.locator("#cf-email").fill("pat@example.com");
  await page.locator("#cf-phone").fill("(813) 555-0100");
  await page.locator("#cf-reason").selectOption(reason);
  await page.locator("#cf-message").fill(message);
  await page.locator("#cf-consent").check();
  if (wait) await page.waitForTimeout(3200);
}
const send = () => page.getByRole("button", { name: "Send Message" }).click();
const success = () =>
  page
    .getByTestId("contact-success")
    .waitFor({ timeout: 10_000 })
    .then(
      () => true,
      () => false,
    );
const errorShown = () =>
  page
    .getByTestId("contact-submit-error")
    .waitFor({ timeout: 10_000 })
    .then(
      () => true,
      () => false,
    );

// 1. Success + routing/classification.
await open();
await fill({
  reason: "non-qm",
  message: "I'm self-employed and want to learn about bank statement options.",
});
await send();
if (!(await success())) fail("success not shown after delivery");
const rec = received.at(-1);
if (
  !rec ||
  rec.type !== "contact_inquiry" ||
  rec.category !== "mortgage_inquiry" ||
  rec.crm.product !== "non-qm"
)
  fail(`wrong classification: ${JSON.stringify(rec?.crm)}`);

await open();
await fill({ reason: "general", message: "Do you work with buyers anywhere in Florida?" });
await send();
if (!(await success())) fail("general inquiry not accepted");
if (received.at(-1)?.category !== "general_inquiry") fail("general inquiry misclassified");

// 2. Duplicate: the same message again is acknowledged but not delivered twice.
const before = received.length;
await open();
await fill({ reason: "general", message: "Do you work with buyers anywhere in Florida?" });
await send();
if (!(await success())) fail("duplicate not acknowledged");
if (received.length !== before) fail("duplicate delivered twice");

// 3. Spam challenge failure: submitted instantly after load.
await open();
await fill({ message: "Instant bot-like submission for the spam test.", wait: false });
await send();
if (!(await errorShown())) fail("spam check failure not shown");
if (await page.getByTestId("contact-success").count()) fail("FALSE SUCCESS on spam check failure");

// 4. Network failure.
await open();
await fill({ message: "Testing a dropped network connection here." });
await page.route("**/api/contact", (route) => route.abort("internetdisconnected"));
await send();
if (!(await errorShown())) fail("network failure not shown");
if (await page.getByTestId("contact-success").count()) fail("FALSE SUCCESS on network failure");
await page.unroute("**/api/contact");
await page.route("**/api/contact", (route) =>
  route.continue({ headers: { ...route.request().headers(), "x-forwarded-for": `192.0.2.${ip}` } }),
);

// 5. Delivery failure.
failMode = true;
const n = received.length;
await open();
await fill({ message: "Testing what happens when the CRM is down." });
await send();
if (!(await errorShown())) fail("delivery failure not shown");
if (await page.getByTestId("contact-success").count()) fail("FALSE SUCCESS on delivery failure");
if (received.length !== n) fail("failed delivery recorded");
failMode = false;

// 6. Career reason routes to /careers without submitting.
await open();
let posted = 0;
page.on("request", (r) => r.url().includes("/api/contact") && posted++);
await page.locator("#cf-reason").selectOption("career");
await page.getByRole("link", { name: /Go to the Careers Form/ }).click();
await page.waitForURL(/\/careers#apply$/).catch(() => fail("career link did not open /careers#apply"));
if (posted) fail("career inquiry posted to /api/contact");

await browser.close();
server.close();
if (failures.length) {
  console.error(`FAIL (${failures.length})\n- ` + failures.join("\n- "));
  process.exit(1);
}
console.log(
  "PASS: contact success + classification, duplicate delivered once, spam check, network and delivery failures show errors, career routing",
);
