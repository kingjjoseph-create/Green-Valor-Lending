/**
 * POST /api/recruitment: dedicated endpoint for careers inquiries.
 * Separate from any borrower/mortgage inquiry endpoint by design.
 */
import {
  buildRecruitmentRecord,
  deliverRecruitment,
  isDeliveryConfigured,
  readDeliveryConfig,
} from "@/lib/recruitment/deliver";
import { featureFlags } from "@/config/features";
import { HONEYPOT_FIELD, validateRecruitment } from "@/lib/recruitment/schema";
import { checkRateLimit } from "@/lib/recruitment/rate-limit";
import { clientIp, json, readJsonBody } from "@/lib/forms/request";

export async function POST(request: Request) {
  if (!featureFlags.careersApplication) return json({ ok: false, error: "not_configured" }, 503);
  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const input = parsed.body;

  if (!checkRateLimit(clientIp(request))) return json({ ok: false, error: "rate_limited" }, 429);

  // Bots fill the hidden field. Accept quietly without delivering anything.
  if (typeof input[HONEYPOT_FIELD] === "string" && input[HONEYPOT_FIELD] !== "")
    return json({ ok: true }, 200);

  const result = validateRecruitment(input);
  if (!result.ok) return json({ ok: false, error: "validation", errors: result.errors }, 400);

  const config = readDeliveryConfig();
  if (!isDeliveryConfigured(config)) return json({ ok: false, error: "not_configured" }, 503);

  const delivery = await deliverRecruitment(buildRecruitmentRecord(result.data), config);
  if (!delivery.delivered) return json({ ok: false, error: "delivery_failed" }, 502);
  return json({ ok: true }, 200);
}
