import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { EmptyState, SectionHeader, SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
import { StatTable } from "@/components/StatTable";
import { comparePlayerTenures } from "@/lib/compare";
import { getCachedAllTimeWolvesPlayers, getFallbackAllTimeWolvesPlayers } from "@/lib/nba/players-index";
import { getFranchiseSeasonsOrEmpty } from "@/lib/nba/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Compare players",
  description: "Compare two Timberwolves roster tenures, shared seasons, and playoff-era overlap.",
};

type PageProps = { searchParams: Promise<{ a?: string; b?: string }> };

export default async function ComparePlayersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const [players, franchiseSeasons] = await Promise.all([
    getCachedAllTimeWolvesPlayers().catch(() => getFallbackAllTimeWolvesPlayers()),
    getFranchiseSeasonsOrEmpty(),
  ]);
  const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));
  const defaultA = sortedPlayers.find((p) => p.name === "Kevin Garnett")?.playerId ?? sortedPlayers[0]?.playerId;
  const defaultB = sortedPlayers.find((p) => p.name === "Anthony Edwards")?.playerId ?? sortedPlayers.find((p) => p.playerId !== defaultA)?.playerId ?? defaultA;
  const aId = Number(sp.a ?? defaultA);
  const bId = Number(sp.b ?? defaultB);
  const a = sortedPlayers.find((p) => p.playerId === aId);
  const b = sortedPlayers.find((p) => p.playerId === bId);
  const comparison = a && b ? comparePlayerTenures(a, b, franchiseSeasons) : null;

  return (
    <>
      <PageHeader
        eyebrow="Head to head"
        title="Compare Wolves player tenures"
        description="Compare roster seasons, overlap, unique chapters, and whether each tenure lined up with Wolves playoff seasons."
      />
      <SurfaceCard className="mb-8 p-4">
        <form action="/compare/players" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-sm font-semibold text-zinc-300">
            Player A
            <select name="a" defaultValue={String(aId)} className="mt-2 min-h-12 w-full rounded-xl border border-zinc-700/90 bg-zinc-950/60 px-3 py-2 text-base text-white sm:text-sm">
              {sortedPlayers.map((player) => (
                <option key={`a-${player.playerId}`} value={player.playerId}>
                  {player.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-zinc-300">
            Player B
            <select name="b" defaultValue={String(bId)} className="mt-2 min-h-12 w-full rounded-xl border border-zinc-700/90 bg-zinc-950/60 px-3 py-2 text-base text-white sm:text-sm">
              {sortedPlayers.map((player) => (
                <option key={`b-${player.playerId}`} value={player.playerId}>
                  {player.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="min-h-12 self-end rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-400">
            Compare
          </button>
        </form>
      </SurfaceCard>

      {a && b && comparison ? (
        <div className="space-y-10">
          <section aria-labelledby="player-compare-results">
            <SectionHeader
              id="player-compare-results"
              title={`${a.name} vs ${b.name}`}
              description="Tenure comparison is based on tracked regular-season roster seasons."
            />
            <StatTable
              caption={`Compare ${a.name} and ${b.name}`}
              columns={["Metric", a.name, b.name]}
              rows={[
                ["Tracked seasons", a.seasons.length, b.seasons.length],
                ["Span", comparison.aSpan, comparison.bSpan],
                ["Playoff-era overlap", comparison.aPlayoffOverlap, comparison.bPlayoffOverlap],
                ["Shared seasons", comparison.sharedSeasons.length, comparison.sharedSeasons.length],
                ["Unique seasons", comparison.onlyA.length, comparison.onlyB.length],
              ]}
            />
          </section>
          <section className="grid gap-4 md:grid-cols-3" aria-label="Season overlap details">
            <SurfaceCard className="p-5">
              <h2 className="font-semibold text-white">Shared seasons</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {comparison.sharedSeasons.length ? comparison.sharedSeasons.join(", ") : "No tracked overlap."}
              </p>
            </SurfaceCard>
            <SurfaceCard className="p-5">
              <h2 className="font-semibold text-white">{a.name} only</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {comparison.onlyA.length ? comparison.onlyA.join(", ") : "No unique tracked seasons."}
              </p>
            </SurfaceCard>
            <SurfaceCard className="p-5">
              <h2 className="font-semibold text-white">{b.name} only</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {comparison.onlyB.length ? comparison.onlyB.join(", ") : "No unique tracked seasons."}
              </p>
            </SurfaceCard>
          </section>
          <p className="text-sm text-zinc-500">
            <Link href={`/players/${a.playerId}`} className={`text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
              Open {a.name}
            </Link>
            <span className="text-zinc-700"> · </span>
            <Link href={`/players/${b.playerId}`} className={`text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
              Open {b.name}
            </Link>
          </p>
        </div>
      ) : (
        <EmptyState title="Choose two valid players" description="The comparison needs two players from the all-time Wolves roster index." />
      )}
    </>
  );
}
