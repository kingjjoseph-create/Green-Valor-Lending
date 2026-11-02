import { createRateLimiter } from "@/lib/forms/rate-limit";

/** Contact endpoint: 5 submissions per 10 minutes per client IP (per server instance). */
export const contactRateLimit = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });
