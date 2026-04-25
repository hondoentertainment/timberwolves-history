import "server-only";

import { unstable_cache } from "next/cache";

import {
  fetchPlayerCareerStats,
  filterWolvesSeasons,
  getFranchiseSeasonsOrEmpty,
  parseSeasonTotalsPerGame,
} from "@/lib/nba/queries";
import type { PlayerCareerSeasonRow } from "@/lib/nba/types";
import { getCachedAllTimeWolvesPlayers } from "@/lib/nba/players-index";

function num(row: PlayerCareerSeasonRow, key: string): number {
  const v = row[key];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export type WolvesLeaderAugmented = {
  playerId: number;
  name: string;
  franchiseSeasons: number;
  bestMinPpg: number | null;
  bestMinPpgSeason: string | null;
  /** Best per-game rebounds in a MIN row (regular season). */
  bestMinRpg: number | null;
  bestMinRpgSeason: string | null;
  /**
   * Count of Wolves roster seasons that overlap a franchise year when the team made the playoffs
   * (PO wins + losses &gt; 0). Does not prove the player appeared in playoff games.
   */
  playoffTeamSeasonOverlap: number;
};

const TOP_N = 12;
const BATCH = 4;

/**
 * Top Wolves roster presences enriched with MIN per-game peak scoring and a playoff-era overlap count.
 * Cached to avoid hammering NBA.com on every leaders page view.
 */
export const getCachedWolvesLeadersAugmented = unstable_cache(
  async (): Promise<WolvesLeaderAugmented[]> => {
    const [index, franchise] = await Promise.all([
      getCachedAllTimeWolvesPlayers().catch(() => [] as { playerId: number; name: string; seasons: string[] }[]),
      getFranchiseSeasonsOrEmpty().catch(() => []),
    ]);

    const playoffSeasons = new Set(
      franchise
        .filter((r) => r.playoffWins + r.playoffLosses > 0)
        .map((r) => r.seasonLabel),
    );

    const sorted = [...index].sort((a, b) => b.seasons.length - a.seasons.length).slice(0, TOP_N);
    const out: WolvesLeaderAugmented[] = [];

    for (let i = 0; i < sorted.length; i += BATCH) {
      const chunk = sorted.slice(i, i + BATCH);
      const settled = await Promise.allSettled(
        chunk.map((p) => fetchPlayerCareerStats(p.playerId).then(parseSeasonTotalsPerGame)),
      );

      chunk.forEach((p, j) => {
        const res = settled[j];
        const rows = res.status === "fulfilled" ? filterWolvesSeasons(res.value) : [];
        let bestPts = -1;
        let bestPtsSid = "";
        let bestReb = -1;
        let bestRebSid = "";
        for (const r of rows) {
          const sid = String(r["SEASON_ID"] ?? "");
          const pts = num(r, "PTS");
          if (pts > bestPts) {
            bestPts = pts;
            bestPtsSid = sid;
          }
          const reb = num(r, "REB");
          if (reb > bestReb) {
            bestReb = reb;
            bestRebSid = sid;
          }
        }
        const bestMinPpg = bestPts > 0 ? bestPts : null;
        const bestMinRpg = bestReb > 0 ? bestReb : null;
        const playoffTeamSeasonOverlap = p.seasons.filter((s) => playoffSeasons.has(s)).length;
        out.push({
          playerId: p.playerId,
          name: p.name,
          franchiseSeasons: p.seasons.length,
          bestMinPpg,
          bestMinPpgSeason: bestMinPpg ? bestPtsSid : null,
          bestMinRpg,
          bestMinRpgSeason: bestMinRpg ? bestRebSid : null,
          playoffTeamSeasonOverlap,
        });
      });
    }

    return out.sort((a, b) => b.franchiseSeasons - a.franchiseSeasons);
  },
  ["wolves-leaders-augmented-v2"],
  { revalidate: 86_400, tags: ["wolves-players", "nba-team-years"] },
);
