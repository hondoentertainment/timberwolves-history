import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { getAllEras } from "@/lib/eras";
import { getGuidedPaths } from "@/lib/guided-paths";

export const metadata: Metadata = {
  title: "Browse the archive",
  description:
    "Dense index of eras, seasons, people, stories, and data documentation — guided paths through Wolves History.",
};

type PageProps = { searchParams: Promise<{ theme?: string }> };

export default async function BrowsePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const needle = (sp.theme ?? "").trim().toLowerCase();
  const allEras = getAllEras();
  const eras = needle.length
    ? allEras.filter((e) =>
        (e.contentGraph?.themes ?? []).some((t) => t.toLowerCase().includes(needle)),
      )
    : allEras;

  const themeTags = Array.from(
    new Set(allEras.flatMap((e) => e.contentGraph?.themes ?? []).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const guidedPaths = getGuidedPaths();

  return (
    <>
      <PageHeader
        title="Browse the archive"
        description="Jump off points for franchise history: eras, every season, people indexes, editorial stories, and transparency pages. Built for wandering, not only search."
      />
      {themeTags.length ? (
        <nav
          aria-label="Theme facets from era graphs"
          className="mb-8 flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-4"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Theme facets (DISC-009)
          </span>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/browse"
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                !needle.length
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              All eras
            </Link>
            {themeTags.slice(0, 24).map((t) => {
              const active = needle && t.toLowerCase().includes(needle);
              return (
                <Link
                  key={t}
                  href={`/browse?theme=${encodeURIComponent(t)}`}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    active
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  {t.replace(/-/g, " ")}
                </Link>
              );
            })}
          </div>
          <p className="text-xs text-zinc-600">
            Filters match <strong className="text-zinc-500">contentGraph.themes</strong> on era hubs
            (substring match). Add more themes in <code className="text-zinc-500">eras.json</code> to
            grow this index.
          </p>
        </nav>
      ) : null}
      {needle.length && !eras.length ? (
        <p className="mb-6 rounded-lg border border-amber-500/20 bg-amber-950/20 px-4 py-3 text-sm text-amber-100/90">
          No era hubs matched theme “{needle}”.{" "}
          <Link href="/browse" className="font-medium text-emerald-400 hover:text-emerald-300">
            Clear filter
          </Link>
          .
        </p>
      ) : null}
      <section className="mb-10 rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-6">
        <h2 className="text-lg font-semibold text-white">Guided paths</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Stable URLs that stack era, playoff, and season-story themes—built for wandering, not only
          search.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {guidedPaths.map((p) => (
            <li
              key={p.href}
              className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 px-4 py-3 text-sm"
            >
              <Link href={p.href} className="font-medium text-emerald-400 hover:text-emerald-300">
                {p.title}
              </Link>
              {p.description ? <p className="mt-1 text-xs leading-relaxed text-zinc-600">{p.description}</p> : null}
            </li>
          ))}
        </ul>
      </section>
      <div className="grid gap-10 md:grid-cols-2">
        <section className="rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-6">
          <h2 className="text-lg font-semibold text-white">Era hubs</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {needle.length
              ? `Filtered (${eras.length} hub${eras.length === 1 ? "" : "s"}).`
              : "Editorial overviews with typed links to seasons and people."}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {eras.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/eras/${encodeURIComponent(e.slug)}`}
                  className="font-medium text-emerald-400 hover:text-emerald-300"
                >
                  {e.title}
                </Link>
                <span className="text-zinc-600"> — {e.yearsLabel}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <Link href="/eras" className="text-sm text-emerald-400 hover:text-emerald-300">
              Eras landing →
            </Link>
          </p>
        </section>
        <section className="rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-6">
          <h2 className="text-lg font-semibold text-white">Franchise spine</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-zinc-400">
            <li>
              <Link href="/at-a-glance" className="text-emerald-400 hover:text-emerald-300">
                At a glance
              </Link>{" "}
              — franchise totals, playoff record, and archive coverage
            </li>
            <li>
              <Link href="/seasons" className="text-emerald-400 hover:text-emerald-300">
                All seasons
              </Link>{" "}
              — records, rosters, optional draft & transaction notes
            </li>
            <li>
              <Link href="/timeline" className="text-emerald-400 hover:text-emerald-300">
                Franchise timeline
              </Link>
            </li>
            <li>
              <Link href="/players" className="text-emerald-400 hover:text-emerald-300">
                Players index
              </Link>
              {" · "}
              <Link href="/players/leaders" className="text-emerald-400 hover:text-emerald-300">
                Tenure leaders
              </Link>
              {" · "}
              <Link href="/coaches" className="text-emerald-400 hover:text-emerald-300">
                Coaches
              </Link>
              {" · "}
              <Link href="/figures" className="text-emerald-400 hover:text-emerald-300">
                Figures
              </Link>
            </li>
            <li>
              <Link href="/stories" className="text-emerald-400 hover:text-emerald-300">
                Flagship stories
              </Link>
              {" · "}
              <Link href="/memes" className="text-emerald-400 hover:text-emerald-300">
                Memes
              </Link>
              {" · "}
              <Link href="/trivia" className="text-emerald-400 hover:text-emerald-300">
                Trivia
              </Link>
            </li>
          </ul>
        </section>
        <section className="rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-white">Trust & updates</h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/changelog" className="text-emerald-400 hover:text-emerald-300">
                Changelog
              </Link>
            </li>
            <li>
              <Link href="/feed.xml" className="text-emerald-400 hover:text-emerald-300">
                RSS feed
              </Link>
            </li>
            <li>
              <Link href="/search" className="text-emerald-400 hover:text-emerald-300">
                Search
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-xs text-zinc-600">
            <Link href="/seasons?playoffs=1" className="text-emerald-500/90 hover:text-emerald-300">
              Playoff seasons only
            </Link>
            {" · "}
            <Link href="/explore/2003-04-offseason" className="text-emerald-500/90 hover:text-emerald-300">
              2003–04 offseason explorer
            </Link>
            {" · "}
            <Link
              href="/explore/2017-18-playoff-return"
              className="text-emerald-500/90 hover:text-emerald-300"
            >
              2017–18 playoff return explorer
            </Link>
            {" · "}
            <Link href="/explore/2007-garnett-trade" className="text-emerald-500/90 hover:text-emerald-300">
              2007 Garnett trade explorer
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
