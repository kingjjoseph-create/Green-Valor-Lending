/**
 * Shared spam protection for public forms (server only):
 *  - Minimum fill time: the client reports how long the form was open.
 *  - Optional Cloudflare Turnstile when TURNSTILE_SECRET_KEY is set (the
 *    widget renders when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set).
 *  - Duplicate suppression: an identical submission within a window is
 *    acknowledged without being delivered twice.
 * Honeypot fields are checked in each route.
 */
import { createHash } from "node:crypto";

import type { Fetch } from "./delivery";

export const MIN_FILL_MS = 3000;
export const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

export function fillTimeOk(elapsed: unknown, minMs = MIN_FILL_MS): boolean {
  const ms = typeof elapsed === "number" ? elapsed : typeof elapsed === "string" ? Number(elapsed) : NaN;
  return Number.isFinite(ms) && ms >= minMs && ms <= MAX_FORM_AGE_MS;
}

export async function verifyTurnstile(
  token: unknown,
  secret: string | null,
  ip: string,
  f: Fetch = fetch,
): Promise<boolean> {
  if (!secret) return true; // Challenge not configured.
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) return false;
  try {
    const res = await f("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, ...(ip !== "unknown" ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export const hashParts = (parts: string[]) => createHash("sha256").update(parts.join("\u0000")).digest("hex");

/** Remembers delivered submissions (by fingerprint) for a window, per server instance. */
export function createDuplicateGuard(windowMs = 10 * 60 * 1000) {
  const seen = new Map<string, number>();
  return {
    isDuplicate(key: string, now = Date.now()) {
      const at = seen.get(key);
      return at !== undefined && now - at < windowMs;
    },
    remember(key: string, now = Date.now()) {
      seen.set(key, now);
      if (seen.size > 5000) for (const [k, t] of seen) if (now - t >= windowMs) seen.delete(k);
    },
    reset() {
      seen.clear();
    },
  };
}
