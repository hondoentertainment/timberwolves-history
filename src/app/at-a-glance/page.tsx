import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/PremiumUX";
import { getAllCoaches } from "@/lib/coaches";
import { getAllEras } from "@/lib/eras";
import { getAllFigures } from "@/lib/figures";
import { summarizeFranchiseAtAGlance } from "@/lib/franchise-at-a-glance";
import { getFranchiseTimeline } from "@/lib/franchise-timeline";
import { getAllLongreads } from "@/lib/longreads";
import {
  getCachedAllTimeWolvesPlayers,
  getFallbackAllTimeWolvesPlayers,
} from "@/lib/nba/players-index";
import { getFranchiseSeasonsOrEmpty, getFranchiseSeasonsSource } from "@/lib/nba/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "At a glance",
  description:
    "One-screen snapshot of Timberwolves franchise archive totals: seasons, players, coaches, playoff wins, eras, stories, and timeline coverage.",
};

const nf = new Intl.NumberFormat("en-US");

function formatNumber(value: number): string {
  return nf.format(value);
}

function formatRecord(wins: number, losses: number): string {
  return `${formatNumber(wins)}-${formatNumber(losses)}`;
}

function formatPct(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "-";
  return `${(value * 100).toFixed(1)}%`;
}

export default async function AtAGlancePage() {
  const [seasons, players, seasonSource] = await Promise.all([
    getFranchiseSeasonsOrEmpty(),
    getCachedAllTimeWolvesPlayers().catch(() => getFallbackAllTimeWolvesPlayers()),
    getFranchiseSeasonsSource(),
  ]);

  const summary = summarizeFranchiseAtAGlance({
    seasons,
    players,
    coaches: getAllCoaches(),
    eras: getAllEras(),
    figures: getAllFigures(),
    longreads: getAllLongreads(),
    timelineEvents: getFranchiseTimeline(),
  });

  const bestSeason = summary.bestSeason;
  const latestPlayoffSeason = summary.latestPlayoffSeason;
  const coachLeader = summary.playoffCoachWinsLeader;

  return (
    <>
      <PageHeader
        title="At a glance"
        description="A one-screen franchise snapshot: how many people and seasons the archive covers, the Wolves' cumulative regular-season and playoff records, and the fastest paths into deeper context."
      />

      <section aria-labelledby="core-counts" className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="core-counts" className="text-xl font-semibold text-white">
              Core counts
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Player and season totals use the same cached indexes as the roster and season pages.
            </p>
          </div>
          <p className="text-xs text-zinc-600">
            Season source: {seasonSource === "nba.com" ? "NBA.com cache" : "curated snapshot"}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Players"
            value={formatNumber(summary.totals.players)}
            detail="Unique Wolves regular-season roster entries."
            href="/players"
          />
          <StatCard
            label="Head coaches"
            value={formatNumber(summary.totals.coaches)}
            detail={`${formatNumber(summary.totals.coachTenures)} recorded tenure slices.`}
            href="/coaches"
          />
          <StatCard
            label="Seasons"
            value={formatNumber(summary.totals.seasons)}
            detail={summary.latestSeason ? `Through ${summary.latestSeason.seasonLabel}.` : undefined}
            href="/seasons"
          />
          <StatCard
            label="Playoff wins"
            value={formatNumber(summary.totals.playoffWins)}
            detail={`${formatNumber(summary.totals.playoffAppearances)} playoff appearances.`}
            href="/seasons?playoffs=1"
          />
          <StatCard
            label="Eras"
            value={formatNumber(summary.totals.eras)}
            detail="Editorial hubs for major franchise chapters."
            href="/eras"
          />
        </div>
      </section>

      <section aria-labelledby="record-book" className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/25 p-6">
          <h2 id="record-book" className="text-xl font-semibold text-white">
            Franchise record
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/35 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Regular season
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-white">
                {formatRecord(summary.totals.regularSeasonWins, summary.totals.regularSeasonLosses)}
              </dd>
              <dd className="mt-1 text-sm text-zinc-500">
                {formatNumber(summary.totals.regularSeasonGames)} games,{" "}
                {formatPct(summary.totals.regularSeasonWinPct)} win rate
              </dd>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/35 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Playoffs
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-white">
                {formatRecord(summary.totals.playoffWins, summary.totals.playoffLosses)}
              </dd>
              <dd className="mt-1 text-sm text-zinc-500">
                {latestPlayoffSeason
                  ? `Most recent: ${latestPlayoffSeason.seasonLabel}`
                  : "No playoff seasons recorded."}
              </dd>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/35 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Best regular season
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-white">
                {bestSeason ? bestSeason.seasonLabel : "-"}
              </dd>
              <dd className="mt-1 text-sm text-zinc-500">
                {bestSeason
                  ? `${bestSeason.wins} wins, ${formatPct(bestSeason.winPct)} win rate`
                  : "Season data unavailable."}
              </dd>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/35 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Playoff coach leader
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-white">
                {coachLeader ? coachLeader.name : "-"}
              </dd>
              <dd className="mt-1 text-sm text-zinc-500">
                {coachLeader
                  ? `${formatNumber(coachLeader.playoffWins)} playoff wins in the coach register`
                  : "Coach data unavailable."}
              </dd>
            </div>
          </dl>
        </div>

        <aside className="rounded-2xl border border-zinc-800/80 bg-zinc-900/25 p-6">
          <h2 className="text-xl font-semibold text-white">Longest Wolves tenures</h2>
          <ol className="mt-5 space-y-3">
            {summary.longestTenuredPlayers.map((player) => (
              <li key={player.playerId} className="flex items-center justify-between gap-4 text-sm">
                <Link
                  href={`/players/${player.playerId}`}
                  className="font-medium text-emerald-400/95 hover:text-emerald-300"
                >
                  {player.name}
                </Link>
                <span className="shrink-0 text-zinc-500">
                  {player.seasons.length} season{player.seasons.length === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-relaxed text-zinc-600">
            Tenure is counted by seasons appearing in the all-time Wolves roster index, not by
            games played.
          </p>
        </aside>
      </section>

      <section aria-labelledby="archive-coverage" className="mt-10 rounded-2xl border border-zinc-800/80 bg-zinc-900/25 p-6">
        <h2 id="archive-coverage" className="text-xl font-semibold text-white">
          Archive coverage
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Timeline events"
            value={formatNumber(summary.totals.timelineEvents)}
            detail="Milestones used by the timeline and history widgets."
            href="/timeline"
          />
          <StatCard
            label="Stories"
            value={formatNumber(summary.totals.longreads)}
            detail="Flagship editorial longreads."
            href="/stories"
          />
          <StatCard
            label="Figures"
            value={formatNumber(summary.totals.figures)}
            detail="Non-coach franchise people with profile pages."
            href="/figures"
          />
          <StatCard
            label="Browse paths"
            value="More"
            detail="Guided routes through eras, playoffs, people, and stories."
            href="/browse"
          />
        </div>
      </section>
    </>
  );
}
