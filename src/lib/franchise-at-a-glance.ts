import type { CoachRecord } from "@/lib/coaches";
import type { EraRecord } from "@/lib/eras";
import type { TimelineEvent } from "@/lib/franchise-timeline";
import type { AllTimePlayerEntry } from "@/lib/nba/players-index";
import type { FranchiseSeasonSummary } from "@/lib/nba/queries";

type AtAGlanceInput = {
  seasons: FranchiseSeasonSummary[];
  players: AllTimePlayerEntry[];
  coaches: CoachRecord[];
  eras: EraRecord[];
  figures: unknown[];
  longreads: unknown[];
  timelineEvents: TimelineEvent[];
};

export type FranchiseAtAGlance = {
  totals: {
    seasons: number;
    players: number;
    coaches: number;
    eras: number;
    figures: number;
    longreads: number;
    timelineEvents: number;
    playoffWins: number;
    playoffLosses: number;
    playoffAppearances: number;
    regularSeasonWins: number;
    regularSeasonLosses: number;
    regularSeasonGames: number;
    regularSeasonWinPct: number | null;
    coachTenures: number;
  };
  bestSeason: FranchiseSeasonSummary | null;
  latestSeason: FranchiseSeasonSummary | null;
  latestPlayoffSeason: FranchiseSeasonSummary | null;
  longestTenuredPlayers: AllTimePlayerEntry[];
  playoffCoachWinsLeader: {
    id: string;
    name: string;
    playoffWins: number;
  } | null;
};

function compareSeasonLabelDesc(a: FranchiseSeasonSummary, b: FranchiseSeasonSummary): number {
  return b.seasonLabel.localeCompare(a.seasonLabel);
}

function compareBestSeason(a: FranchiseSeasonSummary, b: FranchiseSeasonSummary): number {
  if (b.wins !== a.wins) return b.wins - a.wins;
  if ((b.winPct ?? 0) !== (a.winPct ?? 0)) return (b.winPct ?? 0) - (a.winPct ?? 0);
  return b.playoffWins - a.playoffWins;
}

export function summarizeFranchiseAtAGlance(input: AtAGlanceInput): FranchiseAtAGlance {
  const sortedSeasons = [...input.seasons].sort(compareSeasonLabelDesc);
  const regularSeasonWins = input.seasons.reduce((sum, s) => sum + s.wins, 0);
  const regularSeasonLosses = input.seasons.reduce((sum, s) => sum + s.losses, 0);
  const regularSeasonGames = regularSeasonWins + regularSeasonLosses;
  const playoffWins = input.seasons.reduce((sum, s) => sum + s.playoffWins, 0);
  const playoffLosses = input.seasons.reduce((sum, s) => sum + s.playoffLosses, 0);
  const playoffAppearances = input.seasons.filter((s) => s.playoffWins + s.playoffLosses > 0).length;
  const coachTenures = input.coaches.reduce((sum, c) => sum + c.tenures.length, 0);
  const bestSeason = [...input.seasons].sort(compareBestSeason)[0] ?? null;
  const latestPlayoffSeason =
    sortedSeasons.find((s) => s.playoffWins + s.playoffLosses > 0) ?? null;
  const longestTenuredPlayers = [...input.players]
    .sort((a, b) => {
      if (b.seasons.length !== a.seasons.length) return b.seasons.length - a.seasons.length;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 5);

  const playoffCoachWinsLeader =
    input.coaches
      .map((coach) => ({
        id: coach.id,
        name: coach.name,
        playoffWins: coach.tenures.reduce((sum, t) => sum + t.playoffW, 0),
      }))
      .sort((a, b) => b.playoffWins - a.playoffWins)[0] ?? null;

  return {
    totals: {
      seasons: input.seasons.length,
      players: input.players.length,
      coaches: input.coaches.length,
      eras: input.eras.length,
      figures: input.figures.length,
      longreads: input.longreads.length,
      timelineEvents: input.timelineEvents.length,
      playoffWins,
      playoffLosses,
      playoffAppearances,
      regularSeasonWins,
      regularSeasonLosses,
      regularSeasonGames,
      regularSeasonWinPct: regularSeasonGames ? regularSeasonWins / regularSeasonGames : null,
      coachTenures,
    },
    bestSeason,
    latestSeason: sortedSeasons[0] ?? null,
    latestPlayoffSeason,
    longestTenuredPlayers,
    playoffCoachWinsLeader,
  };
}
