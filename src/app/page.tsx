import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { getCachedFranchiseSeasons } from "@/lib/nba/queries";

export const revalidate = 3600;

export default async function HomePage() {
  const seasons = await getCachedFranchiseSeasons();
  const latest = seasons[seasons.length - 1];

  return (
    <>
      <PageHeader
        title="Minnesota Timberwolves franchise history"
        description="Explore every season since the 1989 expansion, the full all-time roster lineage (from NBA.com team rosters), player profiles with career stats, era hubs, a franchise timeline, a head-coach register, and editorial layers documented on About the data."
      />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">Seasons</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Regular-season wins, losses, playoff results, and year-by-year rosters.
          </p>
          <Link
            href="/seasons"
            className="mt-4 inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            Browse seasons →
          </Link>
        </section>
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">Players</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Search everyone who has appeared on a Timberwolves regular-season roster, with
            profile pages and per-game career splits.
          </p>
          <Link
            href="/players"
            className="mt-4 inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            Browse players →
          </Link>
        </section>
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">Coaches</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Head coaches, tenures, and register-style win–loss summaries (static register +
            NBA stats elsewhere on the site).
          </p>
          <Link
            href="/coaches"
            className="mt-4 inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            Browse coaches →
          </Link>
        </section>
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">Eras</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Pilot era hub for the Kevin Garnett years—links into seasons, profiles, and coaches.
          </p>
          <Link
            href="/eras"
            className="mt-4 inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            Browse eras →
          </Link>
        </section>
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">Timeline</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Expansion, KG, the 2004 run, rebuild arcs, and the modern resurgence—milestones in
            one scroll.
          </p>
          <Link
            href="/timeline"
            className="mt-4 inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            Open timeline →
          </Link>
        </section>
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">About the data</h2>
          <p className="mt-2 text-sm text-zinc-400">
            What is live from NBA.com, what is static JSON, how caching and cron work, and known
            limitations.
          </p>
          <Link
            href="/about-data"
            className="mt-4 inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            Read data notes →
          </Link>
        </section>
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">Memes &amp; lore</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Recurring jokes, nicknames, and internet shorthand Wolves fans recognize—curated
            text list, not image macros.
          </p>
          <Link
            href="/memes"
            className="mt-4 inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            Browse memes →
          </Link>
        </section>
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">Latest snapshot</h2>
          {latest ? (
            <dl className="mt-3 space-y-2 text-sm text-zinc-300">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Season</dt>
                <dd className="font-medium text-white">{latest.seasonLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Record</dt>
                <dd>
                  {latest.wins}-{latest.losses}
                  {latest.playoffWins + latest.playoffLosses > 0
                    ? ` · Playoffs ${latest.playoffWins}-${latest.playoffLosses}`
                    : ""}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">Season data unavailable.</p>
          )}
          <p className="mt-4 text-xs text-zinc-500">
            Figures refresh from NBA.com on a cache window; use Vercel Cron to invalidate
            aggregates overnight.
          </p>
        </section>
      </div>
    </>
  );
}
