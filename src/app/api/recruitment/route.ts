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

const MAX_BODY_BYTES = 16 * 1024;

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Reject cross-site posts: when an Origin is sent it must match this host. */
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!featureFlags.careersApplication) return json({ ok: false, error: "not_configured" }, 503);
  if (!sameOrigin(request)) return json({ ok: false, error: "forbidden" }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ ok: false, error: "unsupported_media_type" }, 415);

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES)
    return json({ ok: false, error: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    return json({ ok: false, error: "invalid_json" }, 400);
  const input = body as Record<string, unknown>;

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
