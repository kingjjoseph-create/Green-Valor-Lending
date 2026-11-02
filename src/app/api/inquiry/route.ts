/**
 * POST /api/inquiry: Get Started mortgage lead intake (not a loan application).
 *
 * 1. Validate on the server. 2. Verify spam protection. 3. Classify.
 * 4-5. Deliver to the configured CRM webhook and/or email notification.
 * 6. Return an authoritative result: { ok: true } only when at least one
 * channel accepted the inquiry.
 */
import {
  buildInquiryRecord,
  deliverInquiry,
  isInquiryDeliveryConfigured,
  readInquiryConfig,
} from "@/lib/inquiry/deliver";
import { inquiryDuplicates, inquiryFingerprint, inquiryRateLimit } from "@/lib/inquiry/guards";
import { INQUIRY_HONEYPOT as HONEYPOT, validateInquiry } from "@/lib/inquiry/schema";
import { envValue } from "@/lib/forms/delivery";
import { clientIp, json, readJsonBody } from "@/lib/forms/request";
import { fillTimeOk, verifyTurnstile } from "@/lib/forms/spam";

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const input = parsed.body;
  const ip = clientIp(request);

  if (!inquiryRateLimit.check(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  // 1. Server-side validation.
  const result = validateInquiry(input);
  if (!result.ok) return json({ ok: false, error: "validation", errors: result.errors }, 400);

  // 2. Spam protection.
  if (typeof input[HONEYPOT] === "string" && input[HONEYPOT] !== "") return json({ ok: true }, 200);
  if (!fillTimeOk(input.elapsedMs, 5000)) return json({ ok: false, error: "spam_check" }, 400);
  if (!(await verifyTurnstile(input.turnstileToken, envValue(process.env.TURNSTILE_SECRET_KEY), ip)))
    return json({ ok: false, error: "spam_check" }, 400);

  const config = readInquiryConfig();
  if (!isInquiryDeliveryConfigured(config)) return json({ ok: false, error: "not_configured" }, 503);

  const key = inquiryFingerprint(result.data);
  if (inquiryDuplicates.isDuplicate(key)) return json({ ok: true, duplicate: true }, 200);

  // 3-5. Classify, then record/deliver and notify.
  const delivery = await deliverInquiry(buildInquiryRecord(result.data), config);
  if (!delivery.delivered) return json({ ok: false, error: "delivery_failed" }, 502);
  inquiryDuplicates.remember(key);
  return json({ ok: true }, 200);
}
