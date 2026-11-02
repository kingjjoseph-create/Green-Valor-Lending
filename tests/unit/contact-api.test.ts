import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/contact/route";
import { buildContactRecord, renderContactEmail } from "@/lib/contact/deliver";
import { contactRateLimit } from "@/lib/contact/rate-limit";
import { validateContact } from "@/lib/contact/schema";
import { resetDuplicates } from "@/lib/contact/spam";
import { validContact } from "./fixtures/contact";

let ipCounter = 0;
function post(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new Request("https://greenvalor.test/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        host: "greenvalor.test",
        "x-forwarded-for": `198.51.100.${++ipCounter % 250}`,
        ...headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

const fetchMock = vi.fn<typeof fetch>();
const ENV = [
  "CONTACT_WEBHOOK_URL",
  "CONTACT_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "CONTACT_EMAIL_FROM",
  "CONTACT_EMAIL_TO",
  "CONTACT_MORTGAGE_EMAIL_TO",
  "NEXT_PUBLIC_COMPANY_EMAIL",
  "TURNSTILE_SECRET_KEY",
];

beforeEach(() => {
  contactRateLimit.reset();
  resetDuplicates();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
  for (const k of ENV) vi.stubEnv(k, "");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

const useWebhook = () => vi.stubEnv("CONTACT_WEBHOOK_URL", "https://crm.test/hook");
function useEmail() {
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("CONTACT_EMAIL_FROM", "Website <web@greenvalor.test>");
  vi.stubEnv("CONTACT_EMAIL_TO", "hello@greenvalor.test");
}
const sentTo = () => fetchMock.mock.calls.map(([, init]) => JSON.parse(init!.body as string).to?.[0]);

describe("POST /api/contact", () => {
  it("rejects a blank form", async () => {
    useWebhook();
    const res = await post({ elapsedMs: 5000 });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(Object.keys(body.errors).sort()).toEqual([
      "consent",
      "email",
      "fullName",
      "message",
      "phone",
      "reason",
    ]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects invalid email and phone", async () => {
    useWebhook();
    const body = await (await post({ ...validContact, email: "pat@", phone: "555-01" })).json();
    expect(body.errors.email).toMatch(/valid email/i);
    expect(body.errors.phone).toMatch(/valid phone/i);
  });

  it("rejects an extremely long message (field limit and body limit)", async () => {
    useWebhook();
    const long = await post({ ...validContact, message: "x".repeat(3000) });
    expect(long.status).toBe(400);
    expect((await long.json()).errors.message).toMatch(/or fewer/);
    expect((await post({ ...validContact, message: "x".repeat(50_000) })).status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails the spam challenge for instant submissions and failed Turnstile tokens", async () => {
    useWebhook();
    expect(await (await post({ ...validContact, elapsedMs: 300 })).json()).toMatchObject({
      error: "spam_check",
    });
    expect((await post({ ...validContact, elapsedMs: undefined })).status).toBe(400);

    vi.stubEnv("TURNSTILE_SECRET_KEY", "ts_secret");
    expect(await (await post(validContact)).json()).toMatchObject({ error: "spam_check" });
    fetchMock.mockResolvedValueOnce(Response.json({ success: false }));
    expect((await post({ ...validContact, turnstileToken: "bad" })).status).toBe(400);
    expect(fetchMock.mock.calls[0]![0]).toMatch(/challenges\.cloudflare\.com/);
    // No delivery happened for any failed challenge.
    expect(fetchMock.mock.calls.every(([u]) => String(u).includes("cloudflare"))).toBe(true);
  });

  it("passes a valid Turnstile token through to delivery", async () => {
    useWebhook();
    vi.stubEnv("TURNSTILE_SECRET_KEY", "ts_secret");
    fetchMock
      .mockResolvedValueOnce(Response.json({ success: true }))
      .mockResolvedValueOnce(new Response("ok"));
    expect((await post({ ...validContact, turnstileToken: "good" })).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("accepts but never delivers honeypot submissions", async () => {
    useWebhook();
    const res = await post({ ...validContact, website: "http://spam.example" });
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("routes career inquiries to the recruitment workflow instead of delivering them", async () => {
    useWebhook();
    const res = await post({ ...validContact, reason: "career" });
    expect(res.status).toBe(422);
    expect(await res.json()).toMatchObject({ error: "use_careers", href: "/careers#apply" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 503 (never success) when no channel is configured", async () => {
    const res = await post(validContact);
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("delivers a classified borrower inquiry to the CRM webhook", async () => {
    useWebhook();
    fetchMock.mockResolvedValue(new Response("ok"));
    const res = await post({ ...validContact, reason: "non-qm" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const record = JSON.parse(fetchMock.mock.calls[0]![1]!.body as string);
    expect(record).toMatchObject({
      type: "contact_inquiry",
      category: "mortgage_inquiry",
      crm: { leadType: "borrower", product: "non-qm", reason: "Non-QM Mortgage Inquiry" },
    });
    expect(record.contact.email).toBe("pat@example.com");
  });

  it("classifies general questions as general inquiries", async () => {
    useWebhook();
    fetchMock.mockResolvedValue(new Response("ok"));
    await post({ ...validContact, reason: "general" });
    const record = JSON.parse(fetchMock.mock.calls[0]![1]!.body as string);
    expect(record).toMatchObject({
      category: "general_inquiry",
      crm: { leadType: "general", product: null },
    });
  });

  it("routes email to the right recipient", async () => {
    useEmail();
    vi.stubEnv("CONTACT_MORTGAGE_EMAIL_TO", "loans@greenvalor.test");
    fetchMock.mockResolvedValue(Response.json({ id: "1" }));
    await post({ ...validContact, reason: "residential" });
    await post({ ...validContact, reason: "general", message: "What areas of Florida do you serve?" });
    await post({ ...validContact, reason: "other", message: "Partnership question for your team." });
    expect(sentTo()).toEqual(["loans@greenvalor.test", "hello@greenvalor.test", "hello@greenvalor.test"]);
    const payload = JSON.parse(fetchMock.mock.calls[0]![1]!.body as string);
    expect(payload.reply_to).toBe("pat@example.com");
    expect(payload.subject).toBe("Website inquiry: Residential Mortgage Inquiry from Pat Rivera");
  });

  it("sends mortgage inquiries to the general inbox when no mortgage inbox is set, falling back to the company email", async () => {
    useEmail();
    vi.stubEnv("CONTACT_EMAIL_TO", "");
    vi.stubEnv("NEXT_PUBLIC_COMPANY_EMAIL", "info@greenvalor.test");
    fetchMock.mockResolvedValue(Response.json({ id: "1" }));
    expect((await post(validContact)).status).toBe(200);
    expect(sentTo()).toEqual(["info@greenvalor.test"]);
  });

  it("returns 502 when delivery fails or the network is down, and logs no message contents", async () => {
    useWebhook();
    fetchMock.mockResolvedValueOnce(new Response("down", { status: 500 }));
    expect((await post(validContact)).status).toBe(502);
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    expect((await post(validContact)).status).toBe(502);
    const logged = JSON.stringify((console.error as unknown as ReturnType<typeof vi.fn>).mock.calls);
    expect(logged).not.toContain(validContact.email);
    expect(logged).not.toContain("first home");
  });

  it("acknowledges a duplicate submission without delivering it twice", async () => {
    useWebhook();
    fetchMock.mockResolvedValue(new Response("ok"));
    expect(await (await post(validContact)).json()).toEqual({ ok: true });
    expect(
      await (await post({ ...validContact, message: `  ${validContact.message.toUpperCase()} ` })).json(),
    ).toEqual({ ok: true, duplicate: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    // A different message is delivered normally.
    await post({ ...validContact, message: "A second, different question about refinancing." });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not treat a failed delivery as sent, so a retry is delivered", async () => {
    useWebhook();
    fetchMock
      .mockResolvedValueOnce(new Response("down", { status: 500 }))
      .mockResolvedValue(new Response("ok"));
    expect((await post(validContact)).status).toBe(502);
    expect(await (await post(validContact)).json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("rate limits one address and blocks cross-origin or non-JSON posts", async () => {
    useWebhook();
    fetchMock.mockResolvedValue(new Response("ok"));
    const codes = [];
    for (let i = 0; i < 6; i++)
      codes.push(
        (
          await post(
            { ...validContact, message: `Question number ${i} about loans.` },
            { "x-forwarded-for": "203.0.113.7" },
          )
        ).status,
      );
    expect(codes).toEqual([200, 200, 200, 200, 200, 429]);
    expect((await post(validContact, { origin: "https://evil.example" })).status).toBe(403);
    expect((await post("a=b", { "content-type": "application/x-www-form-urlencoded" })).status).toBe(415);
    expect((await post("{oops")).status).toBe(400);
  });
});

describe("contact email rendering", () => {
  it("escapes HTML and marks mortgage inquiries as not an application", () => {
    const r = validateContact({
      ...validContact,
      message: "<img src=x onerror=alert(1)> Looking to refinance.",
    });
    if (!r.ok) throw new Error("expected valid");
    const { html, text } = renderContactEmail(buildContactRecord(r.data));
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
    expect(text).toMatch(/not a loan application/);
  });
});
