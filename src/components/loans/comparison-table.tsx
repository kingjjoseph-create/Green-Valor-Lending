import { cn } from "@/lib/utils";

type Row = { topic: string; traditional: string; nonQm: string };

type ComparisonTableProps = {
  caption: string;
  columns: readonly [string, string];
  rows: Row[];
  className?: string;
};

/**
 * Two-column comparison. A real <table> from md up; below md the same rows
 * render as stacked cards (the table is display:none there, so assistive
 * technology only ever meets one version).
 */
export function ComparisonTable({ caption, columns, rows, className }: ComparisonTableProps) {
  const [left, right] = columns;
  return (
    <div className={className}>
      <table className="w-full border-collapse text-left max-md:hidden">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b-2 border-gv-gold">
            <th scope="col" className="w-[22%] py-4 pr-6 align-bottom">
              <span className="sr-only">Topic</span>
            </th>
            <th scope="col" className="py-4 pr-6 align-bottom font-serif text-2xl font-semibold text-heading">
              {left}
            </th>
            <th
              scope="col"
              className="rounded-t-xl bg-gv-green px-6 py-4 align-bottom font-serif text-2xl font-semibold text-white"
            >
              {right}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.topic} className="border-b border-border last:border-b-0">
              <th scope="row" className="py-6 pr-6 align-top type-support font-semibold text-gv-green">
                {row.topic}
              </th>
              <td className="py-6 pr-6 align-top type-support text-muted-foreground">{row.traditional}</td>
              <td
                className={cn(
                  "bg-gv-green/[0.04] px-6 py-6 align-top type-support text-foreground",
                  i === rows.length - 1 && "rounded-b-xl",
                )}
              >
                {row.nonQm}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="space-y-4 md:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li key={row.topic} className="rounded-xl border border-border bg-card p-5 min-[380px]:p-6">
            <p className="font-sans font-semibold text-gv-green">{row.topic}</p>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="type-eyebrow">{left}</dt>
                <dd className="mt-1.5 type-support text-muted-foreground">{row.traditional}</dd>
              </div>
              <div className="border-l-2 border-gv-gold pl-4">
                <dt className="type-eyebrow">{right}</dt>
                <dd className="mt-1.5 type-support text-foreground">{row.nonQm}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
