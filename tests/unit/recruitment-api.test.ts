import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/recruitment/route";
import { buildRecruitmentRecord, renderEmail } from "@/lib/recruitment/deliver";
import { resetRateLimit } from "@/lib/recruitment/rate-limit";
import { validateRecruitment } from "@/lib/recruitment/schema";
import { validInquiry } from "./fixtures/recruitment";

const URL_ = "https://greenvalor.test/api/recruitment";

function post(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new Request(URL_, {
      method: "POST",
      headers: { "content-type": "application/json", host: "greenvalor.test", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  resetRateLimit();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
  for (const k of [
    "RECRUITMENT_WEBHOOK_URL",
    "RECRUITMENT_WEBHOOK_SECRET",
    "RESEND_API_KEY",
    "RECRUITMENT_EMAIL_FROM",
    "RECRUITMENT_EMAIL_TO",
    "NEXT_PUBLIC_RECRUITING_EMAIL",
  ])
    vi.stubEnv(k, "");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/recruitment", () => {
  it("returns 503 (never success) when no delivery channel is configured", async () => {
    const res = await post(validInquiry);
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ ok: false, error: "not_configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an empty submission with field errors", async () => {
    vi.stubEnv("RECRUITMENT_WEBHOOK_URL", "https://hooks.test/recruit");
    const res = await post({});
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("validation");
    expect(body.errors.fullName).toBeDefined();
    expect(body.errors.nmlsId).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    vi.stubEnv("RECRUITMENT_WEBHOOK_URL", "https://hooks.test/recruit");
    const res = await post({ ...validInquiry, email: "not-an-email" });
    expect(res.status).toBe(400);
    expect((await res.json()).errors.email).toMatch(/valid email/i);
  });

  it("delivers a signed recruitment_inquiry record to the webhook and returns 200", async () => {
    vi.stubEnv("RECRUITMENT_WEBHOOK_URL", "https://hooks.test/recruit");
    vi.stubEnv("RECRUITMENT_WEBHOOK_SECRET", "s3cret");
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));
    const res = await post({ ...validInquiry, nmlsId: "" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(res.headers.get("cache-control")).toBe("no-store");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://hooks.test/recruit");
    const raw = init!.body as string;
    const record = JSON.parse(raw);
    expect(record).toMatchObject({
      type: "recruitment_inquiry",
      category: "careers",
      source: "website:/careers",
    });
    expect(record.applicant.careerPathway).toBe("Aspiring Mortgage Loan Originator");
    expect(record.applicant.nmlsId).toBeNull();
    expect(raw).not.toMatch(/borrower_lead|"lead"/i);
    const sig = (init!.headers as Record<string, string>)["X-Green-Valor-Signature"];
    expect(sig).toBe(`sha256=${createHmac("sha256", "s3cret").update(raw).digest("hex")}`);
  });

  it("returns 502 when every channel fails, and logs no applicant data", async () => {
    vi.stubEnv("RECRUITMENT_WEBHOOK_URL", "https://hooks.test/recruit");
    fetchMock.mockResolvedValue(new Response("down", { status: 500 }));
    const res = await post(validInquiry);
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false, error: "delivery_failed" });
    const logged = JSON.stringify((console.error as unknown as ReturnType<typeof vi.fn>).mock.calls);
    expect(logged).not.toContain(validInquiry.email);
    expect(logged).not.toContain(validInquiry.fullName);
  });

  it("returns 502 when the webhook is unreachable", async () => {
    vi.stubEnv("RECRUITMENT_WEBHOOK_URL", "https://hooks.test/recruit");
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect((await post(validInquiry)).status).toBe(502);
  });

  it("sends email through Resend to the recruiting inbox, replying to the applicant", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RECRUITMENT_EMAIL_FROM", "Careers <careers@greenvalor.test>");
    vi.stubEnv("NEXT_PUBLIC_RECRUITING_EMAIL", "recruiting@greenvalor.test");
    fetchMock.mockResolvedValue(Response.json({ id: "1" }));
    expect((await post(validInquiry)).status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.resend.com/emails");
    const payload = JSON.parse(init!.body as string);
    expect(payload.to).toEqual(["recruiting@greenvalor.test"]);
    expect(payload.reply_to).toBe(validInquiry.email);
    expect(payload.subject).toMatch(/^Recruitment inquiry:/);
  });

  it("succeeds when one of two channels succeeds", async () => {
    vi.stubEnv("RECRUITMENT_WEBHOOK_URL", "https://hooks.test/recruit");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RECRUITMENT_EMAIL_FROM", "careers@greenvalor.test");
    vi.stubEnv("RECRUITMENT_EMAIL_TO", "recruiting@greenvalor.test");
    fetchMock.mockImplementation(async (u) =>
      String(u).includes("resend") ? new Response("", { status: 500 }) : new Response("ok"),
    );
    expect((await post(validInquiry)).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("accepts but does not deliver honeypot submissions", async () => {
    vi.stubEnv("RECRUITMENT_WEBHOOK_URL", "https://hooks.test/recruit");
    const res = await post({ ...validInquiry, company_website: "http://spam.example" });
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("blocks cross-origin posts, non-JSON, oversized and malformed bodies", async () => {
    vi.stubEnv("RECRUITMENT_WEBHOOK_URL", "https://hooks.test/recruit");
    expect((await post(validInquiry, { origin: "https://evil.example" })).status).toBe(403);
    expect((await post(validInquiry, { origin: "https://greenvalor.test" })).status).not.toBe(403);
    resetRateLimit();
    expect((await post("a=b", { "content-type": "application/x-www-form-urlencoded" })).status).toBe(415);
    expect((await post({ ...validInquiry, why: "x".repeat(20_000) })).status).toBe(413);
    expect((await post("{not json")).status).toBe(400);
    expect((await post("[1,2]")).status).toBe(400);
  });

  it("rate limits repeated submissions from one address", async () => {
    vi.stubEnv("RECRUITMENT_WEBHOOK_URL", "https://hooks.test/recruit");
    fetchMock.mockResolvedValue(new Response("ok"));
    const codes = [];
    for (let i = 0; i < 6; i++)
      codes.push((await post(validInquiry, { "x-forwarded-for": "203.0.113.9" })).status);
    expect(codes.slice(0, 5).every((c) => c === 200)).toBe(true);
    expect(codes[5]).toBe(429);
  });
});

describe("recruitment email rendering", () => {
  it("escapes applicant-provided HTML", () => {
    const r = validateRecruitment({
      ...validInquiry,
      why: "<script>alert(1)</script> I value service and growth.",
    });
    if (!r.ok) throw new Error("expected valid");
    const { html } = renderEmail(buildRecruitmentRecord(r.data));
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toMatch(/Not a borrower lead/);
  });
});
