import { describe, expect, it } from "vitest";

import type { FranchiseSeasonSummary } from "@/lib/nba/queries";

import { playoffTeamSeasonOverlapCount } from "./wolves-tenure-snapshot";

function playoffSeason(label: string): FranchiseSeasonSummary {
  return {
    seasonLabel: label,
    gp: 82,
    wins: 50,
    losses: 32,
    winPct: 0.61,
    playoffWins: 1,
    playoffLosses: 0,
    confRank: null,
    divRank: null,
    raw: {} as FranchiseSeasonSummary["raw"],
  };
}

function regularSeasonOnly(label: string): FranchiseSeasonSummary {
  return {
    seasonLabel: label,
    gp: 82,
    wins: 40,
    losses: 42,
    winPct: 0.49,
    playoffWins: 0,
    playoffLosses: 0,
    confRank: null,
    divRank: null,
    raw: {} as FranchiseSeasonSummary["raw"],
  };
}

describe("playoffTeamSeasonOverlapCount", () => {
  it("returns 0 when roster season labels are missing or empty", () => {
    expect(playoffTeamSeasonOverlapCount(undefined, [playoffSeason("2003-04")])).toBe(0);
    expect(playoffTeamSeasonOverlapCount([], [playoffSeason("2003-04")])).toBe(0);
  });

  it("counts only labels that appear in a franchise year with playoff games", () => {
    const franchise = [
      playoffSeason("2003-04"),
      regularSeasonOnly("2004-05"),
      playoffSeason("2017-18"),
    ];
    expect(
      playoffTeamSeasonOverlapCount(["2003-04", "2004-05", "2017-18", "1991-92"], franchise),
    ).toBe(2);
  });

  it("treats wins + losses > 0 as playoff activity (either axis)", () => {
    const franchise: FranchiseSeasonSummary[] = [
      {
        seasonLabel: "2000-01",
        gp: 82,
        wins: 0,
        losses: 0,
        winPct: null,
        playoffWins: 0,
        playoffLosses: 3,
        confRank: null,
        divRank: null,
        raw: {} as FranchiseSeasonSummary["raw"],
      },
    ];
    expect(playoffTeamSeasonOverlapCount(["2000-01"], franchise)).toBe(1);
  });
});
