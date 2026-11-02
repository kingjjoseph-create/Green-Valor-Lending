import { createRateLimiter } from "@/lib/forms/rate-limit";
import { createDuplicateGuard, hashParts } from "@/lib/forms/spam";
import type { MortgageInquiry } from "./schema";

/** 5 inquiries per 10 minutes per client IP (per server instance). */
export const inquiryRateLimit = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });
export const inquiryDuplicates = createDuplicateGuard();

export const inquiryFingerprint = (i: MortgageInquiry) =>
  hashParts([
    i.email,
    i.goal,
    i.location.toLowerCase(),
    String(i.loanAmount),
    i.timeline,
    i.message.toLowerCase(),
  ]);
