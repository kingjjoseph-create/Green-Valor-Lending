import { createRateLimiter } from "@/lib/forms/rate-limit";

/** Recruitment endpoint: 5 submissions per 10 minutes per client IP (per instance). */
const limiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

export const checkRateLimit = (key: string, now?: number) => limiter.check(key, now);
export const resetRateLimit = () => limiter.reset();
