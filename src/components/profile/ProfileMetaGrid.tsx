type Row = { label: string; value: string };

export function ProfileMetaGrid({ rows }: { rows: Row[] }) {
  return (
    <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 sm:gap-3">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex justify-between gap-4 rounded-lg border border-zinc-800/60 bg-zinc-900/25 px-4 py-3 shadow-sm shadow-black/20"
        >
          <dt className="shrink-0 font-medium text-zinc-500">{r.label}</dt>
          <dd className="text-right text-zinc-100 tabular-nums">{r.value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
