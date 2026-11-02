import type { NextConfig } from "next";

import approvals from "./src/config/compliance-approvals.json";
import { getReleaseBlockers } from "./src/lib/release-blockers.mjs";

/**
 * Release guard: a build meant for public launch (search indexing on, or
 * LAUNCH_CHECK=strict) fails while any release blocker remains. Preview builds
 * still succeed, but stay noindexed and show the licensing notice.
 */
const publicLaunch =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING?.trim().toLowerCase() === "true" ||
  process.env.LAUNCH_CHECK?.trim().toLowerCase() === "strict";
if (publicLaunch) {
  const blockers = getReleaseBlockers(approvals, {
    nmlsId: process.env.NEXT_PUBLIC_COMPANY_NMLS_ID ?? null,
    stateLicenseNumber: process.env.NEXT_PUBLIC_FL_LICENSE_NUMBER ?? null,
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? null,
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? null,
  });
  if (blockers.length > 0) {
    throw new Error(
      `Public launch blocked by ${blockers.length} release blocker(s):\n` +
        blockers.map((b) => `  - ${b.requirement}: ${b.detail}`).join("\n") +
        "\nSee COMPLIANCE_REVIEW.md. Run `npm run launch:check` for the current list.",
    );
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-of-use", permanent: true },
      { source: "/complaints", destination: "/consumer-complaints", permanent: true },
    ];
  },
};

export default nextConfig;
