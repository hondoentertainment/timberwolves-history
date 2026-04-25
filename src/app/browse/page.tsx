import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { ChipLink, SectionHeader, SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
import { getAllEras } from "@/lib/eras";
import { getGuidedPaths } from "@/lib/guided-paths";
import { getAllExplorerPaths, getFeaturedJourneys } from "@/lib/journeys";

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
  const journeys = getFeaturedJourneys(5);
  const explorers = getAllExplorerPaths();

  return (
    <>
      <PageHeader
        title="Browse the archive"
        description="Curated entry points for franchise history: eras, seasons, people, stories, interactives, and trust pages. Built for wandering, not only lookup."
      />
      <section className="mb-10">
        <SectionHeader
          title="Start with a fan journey"
          description="World-class archives do not make you know the answer before you arrive. Pick a lane and let the archive guide you."
          action={
            <Link href="/start-here" className={`text-sm font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
              Open Start Here
            </Link>
          }
        />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {journeys.map((journey) => (
            <li key={journey.id}>
              <SurfaceCard className="h-full p-4 text-sm transition hover:border-zinc-700/90 hover:bg-zinc-900/50">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  {journey.audience}
                </p>
                <Link
                  href={journey.href}
                  className={`mt-2 block font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}
                >
                  {journey.title}
                </Link>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">{journey.description}</p>
              </SurfaceCard>
            </li>
          ))}
        </ul>
      </section>
      {themeTags.length ? (
        <nav
          aria-label="Browse by theme"
          className="mb-8 flex flex-col gap-3 rounded-2xl border border-zinc-800/85 bg-zinc-900/30 p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.03]"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Browse by theme
          </span>
          <div className="flex flex-wrap gap-2">
            <ChipLink href="/browse" active={!needle.length}>All eras</ChipLink>
            {themeTags.slice(0, 24).map((t) => {
              const active = needle && t.toLowerCase().includes(needle);
              return (
                <ChipLink key={t} href={`/browse?theme=${encodeURIComponent(t)}`} active={Boolean(active)}>
                  {t.replace(/-/g, " ")}
                </ChipLink>
              );
            })}
          </div>
          <p className="text-xs leading-relaxed text-zinc-600">
            Themes group related chapters, seasons, and personalities so you can follow a story arc
            without knowing the exact page title.
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
      <section className="mb-10">
        <SectionHeader
          title="Guided paths"
          description="Hand-picked trails through era, playoff, and season-story themes."
        />
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {guidedPaths.map((p) => (
            <li key={p.href}>
              <SurfaceCard className="h-full px-4 py-3 text-sm transition hover:border-zinc-700/90 hover:bg-zinc-900/50">
              <Link href={p.href} className={`font-medium text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
                {p.title}
              </Link>
              {p.description ? <p className="mt-1 text-xs leading-relaxed text-zinc-600">{p.description}</p> : null}
              </SurfaceCard>
            </li>
          ))}
        </ul>
      </section>
      <div className="grid gap-10 md:grid-cols-2">
        <SurfaceCard className="p-6">
          <SectionHeader
            title="Era hubs"
            description={
              needle.length
                ? `Filtered to ${eras.length} hub${eras.length === 1 ? "" : "s"}.`
                : "Editorial overviews with links to seasons, people, and essays."
            }
          />
          <ul className="mt-4 space-y-2 text-sm">
            {eras.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/eras/${encodeURIComponent(e.slug)}`}
                  className={`font-medium text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}
                >
                  {e.title}
                </Link>
                <span className="text-zinc-600"> — {e.yearsLabel}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <Link href="/eras" className={`text-sm font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
              Eras landing
            </Link>
          </p>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <SectionHeader title="Franchise spine" description="The core indexes for stats, people, and chronology." />
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-zinc-400">
            <li>
              <Link href="/at-a-glance" className="text-emerald-400 hover:text-emerald-300">
                At a glance
              </Link>{" "}
              — franchise totals, playoff record, and archive coverage
            </li>
            <li>
              <Link href="/record-book" className="text-emerald-400 hover:text-emerald-300">
                Record book
              </Link>
              {" · "}
              <Link href="/compare/seasons" className="text-emerald-400 hover:text-emerald-300">
                Compare seasons
              </Link>
              {" · "}
              <Link href="/compare/players" className="text-emerald-400 hover:text-emerald-300">
                Compare players
              </Link>
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
        </SurfaceCard>
        <SurfaceCard className="p-6 md:col-span-2">
          <SectionHeader
            title="Interactive reads"
            description="Static, cited explainers that turn a transaction arc or playoff return into a guided walkthrough."
          />
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {explorers.map((explorer) => (
              <li key={explorer.href}>
                <Link href={explorer.href} className={`block h-full rounded-xl border border-zinc-800/80 bg-zinc-950/35 px-4 py-3 text-sm font-semibold text-emerald-400 hover:border-zinc-700 hover:text-emerald-300 ${premiumLinkFocus}`}>
                  {explorer.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <Link href="/explore" className={`text-sm font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
              Open all interactive reads
            </Link>
          </p>
        </SurfaceCard>
        <SurfaceCard className="p-6 md:col-span-2">
          <SectionHeader title="Trust & updates" description="How the archive changes, cites data, and handles corrections." />
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
          </p>
        </SurfaceCard>
      </div>
    </>
  );
}
