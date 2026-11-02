/**
 * POST /api/contact: general website inquiries (mortgage questions, general
 * questions, other). Career inquiries are rejected here and routed to
 * /careers, whose /api/recruitment endpoint keeps applicants out of borrower
 * lead workflows.
 */
import {
  buildContactRecord,
  deliverContact,
  isContactDeliveryConfigured,
  readContactConfig,
} from "@/lib/contact/deliver";
import { CAREER_REASON, CONTACT_HONEYPOT, validateContact } from "@/lib/contact/schema";
import { fillTimeOk, fingerprint, isDuplicate, rememberDelivered, verifyTurnstile } from "@/lib/contact/spam";
import { contactRateLimit } from "@/lib/contact/rate-limit";
import { clientIp, json, readJsonBody } from "@/lib/forms/request";
import { envValue } from "@/lib/forms/delivery";

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const input = parsed.body;
  const ip = clientIp(request);

  if (!contactRateLimit.check(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  // Bots fill the hidden field. Accept quietly without delivering anything.
  if (typeof input[CONTACT_HONEYPOT] === "string" && input[CONTACT_HONEYPOT] !== "")
    return json({ ok: true }, 200);

  // Career inquiries belong to the recruitment workflow.
  if (input.reason === CAREER_REASON)
    return json({ ok: false, error: "use_careers", href: "/careers#apply" }, 422);

  if (!fillTimeOk(input.elapsedMs)) return json({ ok: false, error: "spam_check" }, 400);
  if (!(await verifyTurnstile(input.turnstileToken, envValue(process.env.TURNSTILE_SECRET_KEY), ip)))
    return json({ ok: false, error: "spam_check" }, 400);

  const result = validateContact(input);
  if (!result.ok) return json({ ok: false, error: "validation", errors: result.errors }, 400);

  const config = readContactConfig();
  if (!isContactDeliveryConfigured(config)) return json({ ok: false, error: "not_configured" }, 503);

  // A repeat of a message we already delivered: acknowledge without sending it twice.
  const key = fingerprint(result.data);
  if (isDuplicate(key)) return json({ ok: true, duplicate: true }, 200);

  const delivery = await deliverContact(buildContactRecord(result.data), result.data.reason, config);
  if (!delivery.delivered) return json({ ok: false, error: "delivery_failed" }, 502);
  rememberDelivered(key);
  return json({ ok: true }, 200);
}
