import Link from "next/link";

import {
  linksFromContentGraph,
  normalizeContentGraph,
  opaqueGameLabels,
} from "@/lib/content-graph";
import type { ContentGraph } from "@/types/content-graph";

type Props = {
  graph: ContentGraph | undefined;
  /** Optional display names for `playerIds` (key: numeric id as string or number). */
  playerLabels?: Record<string, string>;
  idPrefix?: string;
};

function playerLinkLabel(id: number, playerLabels?: Record<string, string>): string {
  const fromMap = playerLabels?.[String(id)];
  return fromMap && fromMap.trim().length ? fromMap : `Player ${id}`;
}

export function ContentGraphRelated({ graph, playerLabels, idPrefix = "content-graph" }: Props) {
  const normalized = normalizeContentGraph(graph);
  if (!normalized) return null;

  const themes = normalized.themes ?? [];
  const links = linksFromContentGraph(normalized).map((l) => {
    if (l.hint === "Profile" && l.label.startsWith("Player ")) {
      const id = Number(l.href.replace(/^\/players\//, ""));
      if (!Number.isNaN(id)) {
        return { ...l, label: playerLinkLabel(id, playerLabels) };
      }
    }
    return l;
  });

  const opaqueGames = opaqueGameLabels(normalized);

  if (!themes.length && !links.length && !opaqueGames.length) return null;

  return (
    <section
      aria-labelledby={`${idPrefix}-heading`}
      className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5"
    >
      <h2
        id={`${idPrefix}-heading`}
        className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"
      >
        Related (data graph)
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-zinc-600">
        Typed links for discovery and future search—beyond prose on this page.
      </p>
      {themes.length ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Themes</p>
          <ul className="mt-2 flex flex-wrap gap-2" aria-label="Themes">
            {themes.map((t) => (
              <li key={t}>
                <Link
                  href={`/seasons?theme=${encodeURIComponent(t)}`}
                  className="inline-flex rounded-full border border-zinc-700/90 bg-zinc-950/60 px-3 py-1 text-xs text-zinc-300 transition hover:border-emerald-700/50 hover:text-emerald-200/95"
                >
                  {t.replace(/-/g, " ")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {links.length ? (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Related pages">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex rounded-md border border-zinc-700 bg-zinc-950/50 px-3 py-1.5 text-sm font-medium text-emerald-400/95 hover:border-emerald-700/60 hover:text-emerald-300"
              >
                <span>{l.label}</span>
                {l.hint ? (
                  <span className="ml-1.5 text-xs font-normal text-zinc-500">· {l.hint}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {opaqueGames.length ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Moments (labels)</p>
          <ul className="mt-2 list-inside list-disc text-sm text-zinc-500">
            {opaqueGames.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-zinc-600">
            Slugs without a season page stay text-only until a dedicated game hub exists.
          </p>
        </div>
      ) : null}
    </section>
  );
}
