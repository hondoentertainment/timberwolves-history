import { describe, expect, it } from "vitest";

import type { PlayerCareerSeasonRow } from "@/lib/nba/types";

import { computeWolvesHighlightBullets, summarizeWolvesStatRows } from "./player-highlights";

describe("computeWolvesHighlightBullets", () => {
  it("returns empty for no rows", () => {
    expect(computeWolvesHighlightBullets([])).toEqual([]);
  });

  it("summarizes best counting-stat seasons", () => {
    const rows: PlayerCareerSeasonRow[] = [
      {
        SEASON_ID: "2022-23",
        TEAM_ABBREVIATION: "MIN",
        PTS: 20,
        REB: 5,
        AST: 4,
        GP: 79,
      },
      {
        SEASON_ID: "2023-24",
        TEAM_ABBREVIATION: "MIN",
        PTS: 25,
        REB: 6,
        AST: 5,
        GP: 80,
      },
    ];
    const b = computeWolvesHighlightBullets(rows);
    expect(b[0]).toContain("2 Timberwolves seasons");
    expect(b.some((x) => x.includes("25.0 PPG"))).toBe(true);
    expect(b.some((x) => x.includes("159"))).toBe(true);
  });

  it("returns structured stat peaks for profile summary cards", () => {
    const rows: PlayerCareerSeasonRow[] = [
      {
        SEASON_ID: "2021-22",
        TEAM_ABBREVIATION: "MIN",
        PTS: 9.5,
        REB: 7.2,
        AST: 2.1,
        GP: 72,
      },
      {
        SEASON_ID: "2022-23",
        TEAM_ABBREVIATION: "MIN",
        PTS: 12.4,
        REB: 6.8,
        AST: 3.5,
        GP: 70,
      },
    ];

    expect(summarizeWolvesStatRows(rows)).toEqual({
      seasonCount: 2,
      totalGames: 142,
      bestPts: { value: 12.4, season: "2022-23" },
      bestReb: { value: 7.2, season: "2021-22" },
      bestAst: { value: 3.5, season: "2022-23" },
    });
  });
});
