import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));

import { buildWolvesLeadersAugmented } from "@/lib/wolves-leaders-stats";

import { buildAllTimeWolvesPlayerIndex, getFallbackAllTimeWolvesPlayers } from "./players-index";
import { getCachedFranchiseSeasons, getFallbackFranchiseSeasons } from "./queries";

const FAST_SNAPSHOT_MS = 250;

async function measure<T>(run: () => T | Promise<T>): Promise<{ elapsed: number; value: T }> {
  const start = performance.now();
  const value = await run();
  return { elapsed: performance.now() - start, value };
}

describe("snapshot-backed data loading", () => {
  beforeEach(() => {
    delete process.env.NBA_LIVE_STATS;
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        throw new Error("Unexpected network call during snapshot data test");
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("keeps franchise seasons populated without a live NBA request", async () => {
    const { elapsed, value } = await measure(() => getCachedFranchiseSeasons());

    expect(value.length).toBeGreaterThanOrEqual(35);
    expect(value.at(0)?.seasonLabel).toBe("1989-90");
    expect(value.at(-1)?.wins).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(FAST_SNAPSHOT_MS);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("keeps the all-time players index populated without roster feed fan-out", async () => {
    const { elapsed, value } = await measure(() => buildAllTimeWolvesPlayerIndex());

    expect(value).toHaveLength(311);
    expect(value.some((p) => p.name === "Kevin Garnett" && p.seasons.length > 10)).toBe(true);
    expect(value.some((p) => p.name === "Anthony Edwards")).toBe(true);
    expect(elapsed).toBeLessThan(FAST_SNAPSHOT_MS);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("builds leaders from local snapshots without career-stat requests", async () => {
    const { elapsed, value } = await measure(() => buildWolvesLeadersAugmented());

    expect(value).toHaveLength(12);
    expect(value[0]?.franchiseSeasons).toBeGreaterThanOrEqual(value.at(-1)?.franchiseSeasons ?? 0);
    expect(value.some((p) => p.name === "Kevin Garnett" && p.playoffTeamSeasonOverlap > 0)).toBe(true);
    expect(value.every((p) => p.bestMinPpg === null && p.bestMinRpg === null)).toBe(true);
    expect(elapsed).toBeLessThan(FAST_SNAPSHOT_MS);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("keeps fallback snapshots large enough for page-level rendering", () => {
    const seasons = getFallbackFranchiseSeasons();
    const players = getFallbackAllTimeWolvesPlayers();

    expect(seasons.length).toBeGreaterThanOrEqual(35);
    expect(players).toHaveLength(311);
    expect(new Set(players.map((p) => p.playerId)).size).toBe(players.length);
    expect(players.every((p) => p.name && p.seasons.length > 0)).toBe(true);
  });
});
