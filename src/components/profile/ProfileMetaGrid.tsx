type Row = { label: string; value: string };

export function ProfileMetaGrid({ rows }: { rows: Row[] }) {
  return (
    <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex justify-between gap-4 border-b border-zinc-800/80 py-2"
        >
          <dt className="text-zinc-500">{r.label}</dt>
          <dd className="text-right text-zinc-100">{r.value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
