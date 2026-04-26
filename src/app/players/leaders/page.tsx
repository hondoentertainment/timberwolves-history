import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { getCachedWolvesLeadersAugmented } from "@/lib/wolves-leaders-stats";
import { getCachedAllTimeWolvesPlayers } from "@/lib/nba/players-index";

/** Full roster index can exceed static build timeouts; render on demand (cached via unstable_cache). */
export const dynamic = "force-dynamic";

const leadersDescription =
  "Wolves-only roster footprint, summed regular-season games played in MIN rows, per-game scoring/rebound/assist peaks, and playoff-era overlap (team made playoffs).";

export const metadata: Metadata = {
  title: "Wolves tenure leaders",
  description: leadersDescription,
  openGraph: {
    title: "Wolves tenure leaders",
    description: leadersDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wolves tenure leaders",
    description: leadersDescription,
  },
};

function formatPpg(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  return n.toFixed(1);
}

function formatGp(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  return String(Math.round(n));
}

export default async function WolvesLeadersPage() {
  const index = await getCachedAllTimeWolvesPlayers().catch(() => []);
  const fallback = [...index].sort((a, b) => b.seasons.length - a.seasons.length).slice(0, 30);

  const augmented = await getCachedWolvesLeadersAugmented().catch(() => null);
  const useAugmented = augmented && augmented.length > 0;

  return (
    <>
      <PageHeader
        title="Wolves tenure leaders"
        description="Top roster presences from the merged NBA.com index, enriched with summed Wolves regular-season games from MIN per-game rows, single-season peaks for scoring, rebounds, and assists, plus a simple playoff-era overlap count."
      />
      <p className="mb-6 text-sm leading-relaxed text-zinc-500">
        <strong className="text-zinc-400">PROF-005:</strong> “Playoff-era overlap” counts Wolves seasons on a player’s
        roster index that line up with franchise years when the team had a non-zero playoff record
        in our NBA.com team feed—it is <em>not</em> a statement that the player logged postseason
        minutes.
      </p>
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3">Franchise seasons</th>
                  {useAugmented ? (
                    <>
                      <th className="px-4 py-3">Wolves RS GP</th>
                      <th className="px-4 py-3">Best MIN PPG</th>
                  <th className="px-4 py-3">Best MIN RPG</th>
                  <th className="px-4 py-3">Best MIN APG</th>
                  <th className="px-4 py-3">PO-era overlap*</th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
            {useAugmented
              ? augmented!.map((p, i) => (
                  <tr key={p.playerId} className="hover:bg-zinc-900/40">
                    <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/players/${p.playerId}`}
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-zinc-400">{p.franchiseSeasons}</td>
                    <td className="px-4 py-3 tabular-nums text-zinc-400">{formatGp(p.wolvesRegSeasonGp)}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {formatPpg(p.bestMinPpg)}
                      {p.bestMinPpgSeason ? (
                        <span className="ml-1 text-xs text-zinc-600">({p.bestMinPpgSeason})</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {formatPpg(p.bestMinRpg)}
                      {p.bestMinRpgSeason ? (
                        <span className="ml-1 text-xs text-zinc-600">({p.bestMinRpgSeason})</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {formatPpg(p.bestMinApg)}
                      {p.bestMinApgSeason ? (
                        <span className="ml-1 text-xs text-zinc-600">({p.bestMinApgSeason})</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-zinc-400">{p.playoffTeamSeasonOverlap}</td>
                  </tr>
                ))
              : fallback.map((p, i) => (
                  <tr key={p.playerId} className="hover:bg-zinc-900/40">
                    <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/players/${p.playerId}`}
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-zinc-400">{p.seasons.length}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {!useAugmented && index.length ? (
        <p className="mt-3 text-xs text-amber-200/85">
          Enriched columns skipped (NBA.com career fetch unavailable). Showing roster index only.
        </p>
      ) : null}
      {!index.length ? (
        <p className="mt-4 text-sm text-amber-200/90">
          Roster index is empty (cold cache or NBA.com unreachable). Retry later; leaders populate
          after the index builds.
        </p>
      ) : null}
      <p className="mt-8 text-sm text-zinc-500">
        <Link href="/players" className="text-emerald-400 hover:text-emerald-300">
          ← All players
        </Link>
      </p>
    </>
  );
}
