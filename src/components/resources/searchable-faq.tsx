"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { FAQAccordion } from "@/components/shared/faq-accordion";
import { cn } from "@/lib/utils";

type Item = { category: string; question: string; answer: string };

/** Normalise for matching: lower case, straight quotes, collapsed spaces. */
function normalise(s: string) {
  return s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
}

/** Matches when every word of the query appears in the question or answer. */
export function filterFaq<T extends Item>(items: T[], query: string, category: string | null): T[] {
  const words = normalise(query).split(" ").filter(Boolean);
  return items.filter((item) => {
    if (category && item.category !== category) return false;
    const haystack = normalise(`${item.question} ${item.answer}`);
    return words.every((w) => haystack.includes(w));
  });
}

export function SearchableFaq({ items, categories }: { items: Item[]; categories: readonly string[] }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string | null>(null);
  const results = filterFaq(items, query, category);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <label htmlFor="faq-search" className="sr-only">
            Search questions
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            autoComplete="off"
            enterKeyHint="search"
            className="block h-12 w-full rounded-md border border-input bg-white pr-12 pl-12 text-base text-gv-charcoal placeholder:text-muted-foreground focus-visible:border-gv-green focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-gv-green"
              aria-label="Clear search"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {[null, ...categories].map((c) => {
            const active = category === c;
            return (
              <button
                key={c ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
                  active
                    ? "border-gv-green bg-gv-green text-white"
                    : "border-border bg-card text-gv-charcoal hover:border-gv-green",
                )}
              >
                {c ?? "All topics"}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 type-support text-muted-foreground" aria-live="polite" data-testid="faq-count">
        {results.length === items.length
          ? `${items.length} questions`
          : `${results.length} of ${items.length} questions`}
      </p>

      {results.length > 0 ? (
        <FAQAccordion
          className="mt-3"
          items={results.map((item) => ({ question: item.question, answer: <p>{item.answer}</p> }))}
        />
      ) : (
        <div className="mt-3 rounded-xl border border-dashed border-input/60 p-6 text-center">
          <p className="type-body text-gv-charcoal">No questions match your search.</p>
          <p className="mt-1 type-support text-muted-foreground">
            Try another word, or ask our team directly.
          </p>
        </div>
      )}
    </div>
  );
}
