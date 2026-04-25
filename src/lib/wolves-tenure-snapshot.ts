import type { FranchiseSeasonSummary } from "@/lib/nba/queries";

/**
 * Count of Wolves roster seasons that overlap a franchise year when the team had any playoff games
 * in the NBA.com team feed. Does not prove the player appeared in postseason minutes.
 */
export function playoffTeamSeasonOverlapCount(
  wolvesSeasonLabels: string[] | undefined,
  franchise: FranchiseSeasonSummary[],
): number {
  if (!wolvesSeasonLabels?.length) return 0;
  const playoffSeasons = new Set(
    franchise.filter((r) => r.playoffWins + r.playoffLosses > 0).map((r) => r.seasonLabel),
  );
  return wolvesSeasonLabels.filter((s) => playoffSeasons.has(s)).length;
}
