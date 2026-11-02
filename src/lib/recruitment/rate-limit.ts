/**
 * Best-effort, in-memory rate limit per client IP (per server instance).
 * On serverless hosting each instance keeps its own window, so this only
 * slows down bursts; pair it with the platform's firewall for stronger limits.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return true;
}

export function resetRateLimit() {
  hits.clear();
}
