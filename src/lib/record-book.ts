import type { CoachRecord } from "@/lib/coaches";
import type { AllTimePlayerEntry } from "@/lib/nba/players-index";
import type { FranchiseSeasonSummary } from "@/lib/nba/queries";
import { compareSeasonIds } from "@/lib/trivia/season-order";

export type RankedSeasonRecord = {
  seasonLabel: string;
  wins: number;
  losses: number;
  winPct: number | null;
  playoffWins: number;
  playoffLosses: number;
};

export type RankedCoachRecord = {
  id: string;
  name: string;
  wins: number;
  losses: number;
  playoffWins: number;
  playoffLosses: number;
};

export type RecordBook = {
  mostWins: RankedSeasonRecord[];
  bestWinPct: RankedSeasonRecord[];
  mostPlayoffWins: RankedSeasonRecord[];
  latestPlayoffSeasons: RankedSeasonRecord[];
  coachWins: RankedCoachRecord[];
  coachPlayoffWins: RankedCoachRecord[];
  longestTenures: AllTimePlayerEntry[];
};

function seasonRecord(s: FranchiseSeasonSummary): RankedSeasonRecord {
  return {
    seasonLabel: s.seasonLabel,
    wins: s.wins,
    losses: s.losses,
    winPct: s.winPct,
    playoffWins: s.playoffWins,
    playoffLosses: s.playoffLosses,
  };
}

function compareSeasonDesc(a: RankedSeasonRecord, b: RankedSeasonRecord): number {
  return compareSeasonIds(b.seasonLabel, a.seasonLabel);
}

export function buildRecordBook(
  seasons: FranchiseSeasonSummary[],
  coaches: CoachRecord[],
  players: AllTimePlayerEntry[],
  limit = 10,
): RecordBook {
  const seasonRecords = seasons.map(seasonRecord);
  const playoffSeasons = seasonRecords.filter((s) => s.playoffWins + s.playoffLosses > 0);
  const coachRecords = coaches.map((coach) => ({
    id: coach.id,
    name: coach.name,
    wins: coach.tenures.reduce((sum, tenure) => sum + tenure.w, 0),
    losses: coach.tenures.reduce((sum, tenure) => sum + tenure.l, 0),
    playoffWins: coach.tenures.reduce((sum, tenure) => sum + tenure.playoffW, 0),
    playoffLosses: coach.tenures.reduce((sum, tenure) => sum + tenure.playoffL, 0),
  }));

  return {
    mostWins: [...seasonRecords]
      .sort((a, b) => b.wins - a.wins || (b.winPct ?? 0) - (a.winPct ?? 0) || compareSeasonDesc(a, b))
      .slice(0, limit),
    bestWinPct: [...seasonRecords]
      .filter((s) => s.winPct !== null)
      .sort((a, b) => (b.winPct ?? 0) - (a.winPct ?? 0) || b.wins - a.wins || compareSeasonDesc(a, b))
      .slice(0, limit),
    mostPlayoffWins: [...playoffSeasons]
      .sort((a, b) => b.playoffWins - a.playoffWins || b.wins - a.wins || compareSeasonDesc(a, b))
      .slice(0, limit),
    latestPlayoffSeasons: [...playoffSeasons].sort(compareSeasonDesc).slice(0, limit),
    coachWins: [...coachRecords]
      .sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name))
      .slice(0, limit),
    coachPlayoffWins: [...coachRecords]
      .sort((a, b) => b.playoffWins - a.playoffWins || b.wins - a.wins || a.name.localeCompare(b.name))
      .slice(0, limit),
    longestTenures: [...players]
      .sort((a, b) => b.seasons.length - a.seasons.length || a.name.localeCompare(b.name))
      .slice(0, limit),
  };
}
