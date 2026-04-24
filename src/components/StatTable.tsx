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
    return <p className="text-sm text-zinc-500">{emptyLabel}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950/40">
      <table className="min-w-full text-left text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col" className="whitespace-nowrap px-3 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800 text-zinc-100">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-zinc-900/50">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="max-w-[14rem] truncate px-3 py-2 text-left tabular-nums sm:max-w-none sm:whitespace-nowrap"
                >
                  {cell === null || cell === undefined || cell === "" ? "—" : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
