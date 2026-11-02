/**
 * Shared request guards for public form endpoints (server only).
 * Every form endpoint: same-origin, JSON only, size limit, safe JSON parse,
 * no-store responses.
 */

export const MAX_BODY_BYTES = 16 * 1024;

export function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Reject cross-site posts: when an Origin is sent it must match this host. */
export function sameOrigin(request: Request) {
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

export type ParsedBody = { ok: true; body: Record<string, unknown> } | { ok: false; response: Response };

/** Apply the shared guards and parse a JSON object body. */
export async function readJsonBody(request: Request, maxBytes = MAX_BODY_BYTES): Promise<ParsedBody> {
  if (!sameOrigin(request)) return { ok: false, response: json({ ok: false, error: "forbidden" }, 403) };
  if (!request.headers.get("content-type")?.includes("application/json"))
    return { ok: false, response: json({ ok: false, error: "unsupported_media_type" }, 415) };

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > maxBytes)
    return { ok: false, response: json({ ok: false, error: "too_large" }, 413) };

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return { ok: false, response: json({ ok: false, error: "invalid_json" }, 400) };
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    return { ok: false, response: json({ ok: false, error: "invalid_json" }, 400) };
  return { ok: true, body: body as Record<string, unknown> };
}
