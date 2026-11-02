import Link from "next/link";
import { Info } from "lucide-react";

import { Container } from "./container";

/**
 * Site-wide publication guard notice. Rendered by the root layout while
 * licensing is unverified (see src/lib/compliance.ts), so the site is never
 * presented as an authorized mortgage origination service before then.
 */
export function LicensingNotice() {
  return (
    <aside
      aria-label="Licensing status"
      className="border-b border-gv-gold/40 bg-surface-alt"
      data-testid="licensing-notice"
    >
      <Container className="flex items-start gap-3 py-2.5 type-legal text-foreground sm:items-center">
        <Info className="mt-0.5 size-4 shrink-0 text-gv-gold-deep sm:mt-0" aria-hidden="true" />
        <p>
          Green Valor Lending LLC is completing its mortgage licensing. Until licensing is verified, we do not
          take mortgage loan applications, and nothing on this site is an offer to arrange a loan.{" "}
          <Link href="/licensing" className="font-semibold text-gv-green underline underline-offset-2">
            Licensing status
          </Link>
        </p>
      </Container>
    </aside>
  );
}
