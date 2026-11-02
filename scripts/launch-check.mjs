/**
 * Lists the release blockers for a public launch. Exits 1 while any remain.
 * Reads the same rules as the site and next.config.ts.
 * Usage: npm run launch:check   (uses the current environment variables)
 */
import { readFileSync } from "node:fs";

import { getReleaseBlockers } from "../src/lib/release-blockers.mjs";

const approvals = JSON.parse(
  readFileSync(new URL("../src/config/compliance-approvals.json", import.meta.url), "utf8"),
);
const blockers = getReleaseBlockers(approvals, {
  nmlsId: process.env.NEXT_PUBLIC_COMPANY_NMLS_ID ?? null,
  stateLicenseNumber: process.env.NEXT_PUBLIC_FL_LICENSE_NUMBER ?? null,
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? null,
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? null,
});

if (blockers.length === 0) {
  console.log("Launch check: no release blockers. Counsel sign-off is still required before going live.");
} else {
  console.error(`Launch check: ${blockers.length} release blocker(s). Public launch is blocked.\n`);
  for (const b of blockers) console.error(`- ${b.requirement}\n  ${b.detail}`);
  process.exitCode = 1;
}
