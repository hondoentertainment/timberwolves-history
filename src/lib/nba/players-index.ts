import "server-only";

import { unstable_cache } from "next/cache";

import playersSnapshot from "@/data/all-time-players.json";

import { fetchTeamRoster, parseRoster } from "./queries";
import { liveNbaStatsEnabled } from "./live";
import { mergeRosterIntoIndex } from "./roster-merge";
import { getWolvesSeasonIds } from "./seasons";

export type AllTimePlayerEntry = {
  playerId: number;
  name: string;
  seasons: string[];
};

const BATCH = 8;

const fallbackAllTimeWolvesPlayers: AllTimePlayerEntry[] = playersSnapshot.players
  .map((p) => ({
    playerId: p.playerId,
    name: p.name,
    seasons: [...p.seasons].sort(),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getFallbackAllTimeWolvesPlayers(): AllTimePlayerEntry[] {
  return fallbackAllTimeWolvesPlayers;
}

export async function buildAllTimeWolvesPlayerIndex(): Promise<AllTimePlayerEntry[]> {
  if (!liveNbaStatsEnabled()) {
    return fallbackAllTimeWolvesPlayers;
  }

  const seasonIds = getWolvesSeasonIds();
  const index = new Map<number, { name: string; seasons: Set<string> }>();

  for (let i = 0; i < seasonIds.length; i += BATCH) {
    const chunk = seasonIds.slice(i, i + BATCH);
    const settled = await Promise.allSettled(chunk.map((s) => fetchTeamRoster(s)));
    chunk.forEach((seasonId, j) => {
      const result = settled[j];
      if (result.status !== "fulfilled") return;
      try {
        const roster = parseRoster(result.value, seasonId).map((r) => ({
          playerId: r.playerId,
          name: r.name,
        }));
        mergeRosterIntoIndex(index, seasonId, roster);
      } catch {
        /* skip season on malformed upstream */
      }
    });
  }

  const liveIndex = [...index.entries()]
    .map(([playerId, v]) => ({
      playerId,
      name: v.name,
      seasons: [...v.seasons].sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return liveIndex.length ? liveIndex : fallbackAllTimeWolvesPlayers;
}

export const getCachedAllTimeWolvesPlayers = unstable_cache(
  buildAllTimeWolvesPlayerIndex,
  ["wolves-all-players-v5"],
  { revalidate: 86_400, tags: ["wolves-players"] },
);
