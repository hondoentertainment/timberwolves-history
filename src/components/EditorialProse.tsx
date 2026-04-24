type Source = { label: string; url: string };

type EditorialProseProps = {
  title: string;
  attribution: string;
  paragraphs: string[];
  sources?: Source[];
};

export function EditorialProse({
  title,
  attribution,
  paragraphs,
  sources,
}: EditorialProseProps) {
  if (!paragraphs.length) return null;
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/35 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">{title}</h3>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-zinc-200">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {sources?.length ? (
        <ul className="mt-4 list-inside list-disc text-sm text-zinc-400">
          {sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-emerald-400 underline-offset-2 hover:underline"
                rel="noopener noreferrer"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-4 text-xs text-zinc-600">{attribution}</p>
    </div>
  );
}
