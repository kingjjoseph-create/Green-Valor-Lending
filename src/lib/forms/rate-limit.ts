/**
 * Best-effort, in-memory sliding-window rate limit (per server instance).
 * On serverless hosting each instance keeps its own window, so this only
 * slows down bursts; pair it with the platform firewall for stronger limits.
 */
export function createRateLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const hits = new Map<string, number[]>();
  return {
    check(key: string, now = Date.now()): boolean {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= max) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 5000) {
        for (const [k, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(k);
      }
      return true;
    },
    reset() {
      hits.clear();
    },
  };
}
