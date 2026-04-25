import type { ReactNode } from "react";

type StatTableProps = {
  caption?: string;
  columns: string[];
  rows: (string | number | null | undefined | ReactNode)[][];
  emptyLabel?: string;
};

export function StatTable({
  caption,
  columns,
  rows,
  emptyLabel = "No rows.",
}: StatTableProps) {
  if (!rows.length) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 px-4 py-8 text-center text-sm text-zinc-500">
        {emptyLabel}
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800/90 bg-zinc-950/50 shadow-inner shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="bg-gradient-to-b from-zinc-900/95 to-zinc-900/70 text-xs uppercase tracking-wider text-zinc-400">
            <tr className="border-b border-zinc-800/80">
              {columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 font-semibold text-zinc-300 first:pl-5 last:pr-5"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/70 text-zinc-100">
            {rows.map((row, i) => (
              <tr
                key={i}
                className="transition-colors duration-150 hover:bg-emerald-950/20 even:bg-zinc-900/[0.15]"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="max-w-[14rem] truncate px-4 py-2.5 text-left tabular-nums first:pl-5 first:font-medium first:text-zinc-50 last:pr-5 sm:max-w-none sm:whitespace-nowrap"
                  >
                    {cell === null || cell === undefined || cell === "" ? "—" : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
