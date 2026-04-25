import type { AllTimePlayerEntry } from "@/lib/nba/players-index";
import type { FranchiseSeasonSummary } from "@/lib/nba/queries";
import { compareSeasonIds } from "@/lib/trivia/season-order";
import { playoffTeamSeasonOverlapCount } from "@/lib/wolves-tenure-snapshot";

export type SeasonCompareMetric = {
  label: string;
  a: string | number;
  b: string | number;
  leader?: "a" | "b" | "tie";
};

function leaderForNumber(a: number | null, b: number | null, lowerIsBetter = false): "a" | "b" | "tie" | undefined {
  if (a === null || b === null) return undefined;
  if (a === b) return "tie";
  if (lowerIsBetter) return a < b ? "a" : "b";
  return a > b ? "a" : "b";
}

function pct(n: number | null): string {
  return n === null || !Number.isFinite(n) ? "-" : n.toFixed(3);
}

export function compareFranchiseSeasons(
  a: FranchiseSeasonSummary,
  b: FranchiseSeasonSummary,
): SeasonCompareMetric[] {
  return [
    { label: "Regular-season record", a: `${a.wins}-${a.losses}`, b: `${b.wins}-${b.losses}` },
    { label: "Wins", a: a.wins, b: b.wins, leader: leaderForNumber(a.wins, b.wins) },
    { label: "Win percentage", a: pct(a.winPct), b: pct(b.winPct), leader: leaderForNumber(a.winPct, b.winPct) },
    {
      label: "Conference rank",
      a: a.confRank ?? "-",
      b: b.confRank ?? "-",
      leader: leaderForNumber(a.confRank, b.confRank, true),
    },
    {
      label: "Division rank",
      a: a.divRank ?? "-",
      b: b.divRank ?? "-",
      leader: leaderForNumber(a.divRank, b.divRank, true),
    },
    {
      label: "Playoff record",
      a: a.playoffWins + a.playoffLosses > 0 ? `${a.playoffWins}-${a.playoffLosses}` : "-",
      b: b.playoffWins + b.playoffLosses > 0 ? `${b.playoffWins}-${b.playoffLosses}` : "-",
    },
    {
      label: "Playoff wins",
      a: a.playoffWins,
      b: b.playoffWins,
      leader: leaderForNumber(a.playoffWins, b.playoffWins),
    },
  ];
}

export type PlayerTenureCompare = {
  sharedSeasons: string[];
  onlyA: string[];
  onlyB: string[];
  aSpan: string;
  bSpan: string;
  aPlayoffOverlap: number;
  bPlayoffOverlap: number;
};

function spanLabel(seasons: string[]): string {
  const sorted = [...seasons].sort(compareSeasonIds);
  if (!sorted.length) return "-";
  if (sorted.length === 1) return sorted[0]!;
  return `${sorted[0]} to ${sorted[sorted.length - 1]}`;
}

export function comparePlayerTenures(
  a: AllTimePlayerEntry,
  b: AllTimePlayerEntry,
  franchiseSeasons: FranchiseSeasonSummary[],
): PlayerTenureCompare {
  const aSet = new Set(a.seasons);
  const bSet = new Set(b.seasons);
  const sharedSeasons = a.seasons.filter((season) => bSet.has(season)).sort(compareSeasonIds);
  const onlyA = a.seasons.filter((season) => !bSet.has(season)).sort(compareSeasonIds);
  const onlyB = b.seasons.filter((season) => !aSet.has(season)).sort(compareSeasonIds);

  return {
    sharedSeasons,
    onlyA,
    onlyB,
    aSpan: spanLabel(a.seasons),
    bSpan: spanLabel(b.seasons),
    aPlayoffOverlap: playoffTeamSeasonOverlapCount(a.seasons, franchiseSeasons),
    bPlayoffOverlap: playoffTeamSeasonOverlapCount(b.seasons, franchiseSeasons),
  };
}
