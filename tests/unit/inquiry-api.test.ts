import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/inquiry/route";
import { buildInquiryRecord, renderInquiryEmail } from "@/lib/inquiry/deliver";
import { inquiryDuplicates, inquiryRateLimit } from "@/lib/inquiry/guards";
import { validateInquiry } from "@/lib/inquiry/schema";
import { validInquiryBody as valid } from "./fixtures/inquiry";

let n = 0;
function post(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new Request("https://greenvalor.test/api/inquiry", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        host: "greenvalor.test",
        "x-forwarded-for": `198.51.100.${++n % 250}`,
        ...headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  inquiryRateLimit.reset();
  inquiryDuplicates.reset();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
  for (const k of [
    "INQUIRY_WEBHOOK_URL",
    "INQUIRY_WEBHOOK_SECRET",
    "RESEND_API_KEY",
    "INQUIRY_EMAIL_FROM",
    "INQUIRY_EMAIL_TO",
    "CONTACT_EMAIL_FROM",
    "CONTACT_EMAIL_TO",
    "CONTACT_MORTGAGE_EMAIL_TO",
    "NEXT_PUBLIC_COMPANY_EMAIL",
    "TURNSTILE_SECRET_KEY",
  ])
    vi.stubEnv(k, "");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

const crm = () => vi.stubEnv("INQUIRY_WEBHOOK_URL", "https://crm.test/leads");
const record = (i = 0) => JSON.parse(fetchMock.mock.calls[i]![1]!.body as string);

describe("POST /api/inquiry", () => {
  it("validates on the server first", async () => {
    crm();
    const res = await post({ elapsedMs: 30_000 });
    expect(res.status).toBe(400);
    expect(Object.keys((await res.json()).errors)).toContain("goal");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects out-of-state properties on the server", async () => {
    crm();
    const res = await post({ ...valid, propertyState: "NY" });
    expect(res.status).toBe(400);
    expect((await res.json()).errors.propertyState).toMatch(/Florida only/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails spam protection for bot-speed submissions and bad Turnstile tokens", async () => {
    crm();
    expect(await (await post({ ...valid, elapsedMs: 900 })).json()).toMatchObject({ error: "spam_check" });
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    fetchMock.mockResolvedValueOnce(Response.json({ success: false }));
    expect((await post({ ...valid, turnstileToken: "x" })).status).toBe(400);
    expect(fetchMock).toHaveBeenCalledTimes(1); // only the Turnstile check, no delivery
  });

  it("drops honeypot submissions silently", async () => {
    crm();
    expect((await post({ ...valid, company_name: "Acme SEO" })).status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 503 when no backend is configured (never success)", async () => {
    expect((await post(valid)).status).toBe(503);
  });

  it.each([
    ["purchase", "residential", "purchase"],
    ["refinance", "residential", "refinance"],
    ["non-qm", "non-qm", "unspecified"],
    ["investment", "residential-or-non-qm", "unspecified"],
    ["other", "undetermined", "unspecified"],
  ])("classifies goal %s and delivers it to the CRM", async (goal, product, transaction) => {
    crm();
    fetchMock.mockResolvedValue(new Response("ok"));
    const res = await post({ ...valid, goal });
    expect(await res.json()).toEqual({ ok: true });
    const r = record();
    expect(r).toMatchObject({
      type: "mortgage_inquiry",
      category: "borrower_lead",
      classification: {
        leadType: "borrower",
        goal,
        productInterest: product,
        transaction,
        followUp: "near-term",
      },
      property: { state: "FL", location: "Tampa", estimatedValue: 425000 },
      financing: { approximateAmount: 340000 },
    });
  });

  it("classifies follow-up priority by timeline", async () => {
    crm();
    fetchMock.mockResolvedValue(new Response("ok"));
    await post({ ...valid, timeline: "exploring" });
    await post({ ...valid, timeline: "6-plus-months", email: "other@example.com" });
    expect(record(0).classification.followUp).toBe("nurture");
    expect(record(1).classification.followUp).toBe("later");
  });

  it("never forwards sensitive fields even if a client sends them", async () => {
    crm();
    fetchMock.mockResolvedValue(new Response("ok"));
    await post({ ...valid, ssn: "123-45-6789", dob: "1990-01-01", accountNumber: "000123456789" });
    const raw = fetchMock.mock.calls[0]![1]!.body as string;
    expect(raw).not.toMatch(/123-45-6789|1990-01-01|000123456789|ssn|dob|accountNumber/);
  });

  it("sends the email notification to the configured inbox with fallbacks", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_EMAIL_FROM", "Website <web@greenvalor.test>");
    vi.stubEnv("CONTACT_MORTGAGE_EMAIL_TO", "loans@greenvalor.test");
    fetchMock.mockResolvedValue(Response.json({ id: "1" }));
    expect((await post(valid)).status).toBe(200);
    const payload = record();
    expect(payload.to).toEqual(["loans@greenvalor.test"]);
    expect(payload.reply_to).toBe("morgan@example.com");
    expect(payload.subject).toBe("Mortgage inquiry: Purchase a Home (Morgan Lee)");
    vi.stubEnv("INQUIRY_EMAIL_TO", "intake@greenvalor.test");
    await post({ ...valid, email: "second@example.com" });
    expect(record(1).to).toEqual(["intake@greenvalor.test"]);
  });

  it("returns 502 on backend error and timeout, without leaking applicant data to logs", async () => {
    crm();
    fetchMock.mockResolvedValueOnce(new Response("err", { status: 500 }));
    expect((await post(valid)).status).toBe(502);
    fetchMock.mockRejectedValueOnce(new DOMException("timed out", "TimeoutError"));
    expect((await post(valid)).status).toBe(502);
    const logged = JSON.stringify((console.error as unknown as ReturnType<typeof vi.fn>).mock.calls);
    expect(logged).not.toMatch(/morgan|Morgan|813|Tampa|self-employed/);
  });

  it("succeeds when one channel works even if the other fails (and only then)", async () => {
    crm();
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("INQUIRY_EMAIL_FROM", "web@greenvalor.test");
    vi.stubEnv("INQUIRY_EMAIL_TO", "intake@greenvalor.test");
    fetchMock.mockImplementation(async (u) =>
      String(u).includes("resend") ? new Response("", { status: 500 }) : new Response("ok"),
    );
    expect((await post(valid)).status).toBe(200);
    fetchMock.mockResolvedValue(new Response("", { status: 500 }));
    expect((await post({ ...valid, email: "x@example.com" })).status).toBe(502);
  });

  it("delivers a duplicate submission only once, but a failed one can be retried", async () => {
    crm();
    fetchMock.mockResolvedValueOnce(new Response("", { status: 500 })).mockResolvedValue(new Response("ok"));
    expect((await post(valid)).status).toBe(502);
    expect(await (await post(valid)).json()).toEqual({ ok: true });
    expect(await (await post(valid)).json()).toEqual({ ok: true, duplicate: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("applies the shared request guards and rate limit", async () => {
    crm();
    fetchMock.mockResolvedValue(new Response("ok"));
    expect((await post(valid, { origin: "https://evil.example" })).status).toBe(403);
    expect((await post("goal=purchase", { "content-type": "text/plain" })).status).toBe(415);
    expect((await post({ ...valid, notes: "x".repeat(20_000) })).status).toBe(413);
    const codes = [];
    for (let i = 0; i < 6; i++)
      codes.push(
        (await post({ ...valid, email: `p${i}@example.com` }, { "x-forwarded-for": "203.0.113.5" })).status,
      );
    expect(codes).toEqual([200, 200, 200, 200, 200, 429]);
  });
});

describe("inquiry email", () => {
  it("escapes HTML and states it is not an application", () => {
    const r = validateInquiry({ ...valid, notes: "<script>x</script> self-employed" });
    if (!r.ok) throw new Error("invalid");
    const { html, text } = renderInquiryEmail(buildInquiryRecord(r.data));
    expect(html).not.toContain("<script>");
    expect(text).toMatch(/not a loan application/);
    expect(text).toMatch(/\$425,000/);
  });
});
