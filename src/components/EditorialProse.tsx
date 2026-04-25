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
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/60 via-zinc-900/40 to-zinc-950/60 p-6 shadow-lg shadow-black/25 ring-1 ring-white/[0.04]">
      <div
        className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-full bg-gradient-to-b from-emerald-400/90 to-teal-600/50"
        aria-hidden
      />
      <div className="relative pl-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500/90">
          {title}
        </h3>
        <div className="mt-4 space-y-3.5 text-base leading-relaxed text-zinc-200">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-pretty">
              {p}
            </p>
          ))}
        </div>
        {sources?.length ? (
          <ul className="mt-5 space-y-2 border-t border-zinc-800/80 pt-5 text-sm text-zinc-400">
            {sources.map((s) => (
              <li key={s.url} className="flex gap-2">
                <span className="text-emerald-600/80" aria-hidden>
                  ·
                </span>
                <a
                  href={s.url}
                  className="font-medium text-emerald-400/95 underline decoration-emerald-500/35 underline-offset-2 outline-offset-2 transition hover:text-emerald-300 hover:decoration-emerald-400/55 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-5 text-xs leading-relaxed text-zinc-600">{attribution}</p>
      </div>
    </div>
  );
}
