import Link from "next/link";

export type RelatedReadingLink = { href: string; label: string; hint?: string };

export function RelatedReading({
  title = "Related reading",
  links,
}: {
  /** Pass empty string to omit the heading (e.g. when wrapped in `ProfileSection`). */
  title?: string;
  links: RelatedReadingLink[];
}) {
  if (!links.length) return null;
  return (
    <aside className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 ring-1 ring-white/[0.03]">
      {title ? (
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{title}</h2>
      ) : null}
      <ul className={title ? "mt-3 space-y-2.5 text-sm" : "space-y-2.5 text-sm"}>
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="font-medium text-emerald-400/95 underline decoration-emerald-500/25 underline-offset-2 hover:text-emerald-300 hover:decoration-emerald-400/50 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
            >
              {l.label}
            </Link>
            {l.hint ? <span className="mt-0.5 block text-xs text-zinc-600">{l.hint}</span> : null}
          </li>
        ))}
      </ul>
    </aside>
  );
}
