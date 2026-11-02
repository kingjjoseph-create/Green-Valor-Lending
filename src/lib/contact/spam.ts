/**
 * Contact-form spam helpers. The generic pieces live in @/lib/forms/spam.
 */
import { createDuplicateGuard, fillTimeOk, hashParts, verifyTurnstile } from "@/lib/forms/spam";
import type { ContactInquiry } from "./schema";

export { fillTimeOk, verifyTurnstile };

const guard = createDuplicateGuard();

export const fingerprint = (i: ContactInquiry) =>
  hashParts([i.email, i.reason, i.message.toLowerCase().replace(/\s+/g, " ")]);
export const isDuplicate = (key: string, now?: number) => guard.isDuplicate(key, now);
export const rememberDelivered = (key: string, now?: number) => guard.remember(key, now);
export const resetDuplicates = () => guard.reset();
