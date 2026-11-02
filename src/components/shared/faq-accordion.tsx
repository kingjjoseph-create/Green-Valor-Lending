import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type FAQItem = { question: string; answer: React.ReactNode };

/**
 * Accessible FAQ using native <details>/<summary>: keyboard and screen-reader
 * support built in, works without JavaScript.
 */
export function FAQAccordion({ items, className }: { items: FAQItem[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left font-serif text-xl font-semibold text-heading transition-colors hover:text-gv-forest sm:text-[1.375rem] [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              className="size-5 shrink-0 text-gv-gold-deep transition-transform duration-300 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="pb-6 type-body text-muted-foreground">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
