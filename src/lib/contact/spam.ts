/**
 * Spam protection for the contact form (server only):
 *  1. Honeypot field (checked in the route).
 *  2. Minimum fill time: the client reports how long the form was open.
 *  3. Optional Cloudflare Turnstile challenge when TURNSTILE_SECRET_KEY is set
 *     (the widget renders when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set).
 *  4. Duplicate suppression: the same message from the same email within
 *     10 minutes is acknowledged without being delivered twice.
 */
import { createHash } from "node:crypto";

import type { Fetch } from "@/lib/forms/delivery";
import { MAX_FORM_AGE_MS, MIN_FILL_MS, type ContactInquiry } from "./schema";

export function fillTimeOk(elapsed: unknown): boolean {
  const ms = typeof elapsed === "number" ? elapsed : typeof elapsed === "string" ? Number(elapsed) : NaN;
  return Number.isFinite(ms) && ms >= MIN_FILL_MS && ms <= MAX_FORM_AGE_MS;
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

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const recent = new Map<string, number>();

export function fingerprint(i: ContactInquiry) {
  return createHash("sha256")
    .update([i.email, i.reason, i.message.toLowerCase().replace(/\s+/g, " ")].join("\u0000"))
    .digest("hex");
}

export function isDuplicate(key: string, now = Date.now()) {
  const at = recent.get(key);
  return at !== undefined && now - at < DUPLICATE_WINDOW_MS;
}

export function rememberDelivered(key: string, now = Date.now()) {
  recent.set(key, now);
  if (recent.size > 5000) for (const [k, t] of recent) if (now - t >= DUPLICATE_WINDOW_MS) recent.delete(k);
}

export function resetDuplicates() {
  recent.clear();
}
