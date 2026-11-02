import * as React from "react";

const DEFAULT_TERMS = ["Non-QM", "W-2s", "no-documentation", "1099"];

/**
 * Wraps hyphenated terms such as "Non-QM" in a no-wrap span so a line
 * never breaks at the hyphen ("Non-" / "QM"). Text content is unchanged.
 */
export function keepTogether(text: string, terms: string[] = DEFAULT_TERMS): React.ReactNode {
  const pattern = new RegExp(
    `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );
  const parts = text.split(pattern);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    terms.includes(part) ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
