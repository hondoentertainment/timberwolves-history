import { describe, expect, it } from "vitest";

import { buildTriviaDeck, TRIVIA_DECK_TARGET_MIN } from "./build-deck";
import { seasonIdFromStartYear } from "@/lib/nba/seasons";
import type { TriviaFranchiseRow } from "./types";

function rngFixed(seq: number[]) {
  let i = 0;
  return () => {
    const v = seq[i % seq.length] ?? 0.5;
    i += 1;
    return v;
  };
}

/** Dense synthetic franchise rows so pairwise / triple generators produce a huge deck. */
function syntheticFranchiseRows(count: number, startYear = 1990): TriviaFranchiseRow[] {
  const out: TriviaFranchiseRow[] = [];
  for (let i = 0; i < count; i += 1) {
    const y = startYear + i;
    const label = seasonIdFromStartYear(y);
    out.push({
      seasonLabel: label,
      wins: i,
      losses: Math.max(0, 60 - i),
      winPct: Math.min(0.999, Math.max(0.001, (40 + i) / 82)),
      playoffWins: i % 6,
      playoffLosses: (i * 3) % 8,
      confRank: (i % 12) + 1,
      divRank: (i % 5) + 1,
    });
  }
  return out;
}

describe("buildTriviaDeck", () => {
  it("returns many questions from static data even without NBA rows", () => {
    const deck = buildTriviaDeck([], new Date("2026-04-24"), rngFixed([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]));
    expect(deck.length).toBeGreaterThan(40);
    for (const q of deck) {
      expect(q.choices).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThanOrEqual(3);
      expect(q.choices[q.correctIndex]).toBeTruthy();
    }
  });

  it("meets the 1000+ question target when franchise rows cover many seasons", () => {
    const rows = syntheticFranchiseRows(32, 1990);
    const deck = buildTriviaDeck(rows, new Date("2026-04-24"), rngFixed([0.11, 0.22, 0.33, 0.44, 0.55, 0.66]));
    expect(deck.length).toBeGreaterThanOrEqual(TRIVIA_DECK_TARGET_MIN);
  });

  it("adds a wins fact for a known season label when present in the row set", () => {
    const rows: TriviaFranchiseRow[] = [
      {
        seasonLabel: "2003-04",
        wins: 58,
        losses: 24,
        winPct: 0.707,
        playoffWins: 10,
        playoffLosses: 8,
        confRank: 1,
        divRank: 1,
      },
      {
        seasonLabel: "2010-11",
        wins: 17,
        losses: 65,
        winPct: 0.207,
        playoffWins: 0,
        playoffLosses: 0,
        confRank: 12,
        divRank: 5,
      },
    ];
    const deck = buildTriviaDeck(rows, new Date("2026-04-24"), rngFixed([0.11, 0.22, 0.33, 0.44, 0.55]));
    const winsQ = deck.find((q) => q.id === "wins-2003-04");
    expect(winsQ).toBeDefined();
    expect(winsQ!.choices).toContain("58");
    expect(winsQ!.choices[winsQ!.correctIndex]).toBe("58");
  });
});
