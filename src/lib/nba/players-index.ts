import "server-only";

import { unstable_cache } from "next/cache";

import { fetchTeamRoster, parseRoster } from "./queries";
import { mergeRosterIntoIndex } from "./roster-merge";
import { getWolvesSeasonIds } from "./seasons";

export type AllTimePlayerEntry = {
  playerId: number;
  name: string;
  seasons: string[];
};

const BATCH = 8;

export async function buildAllTimeWolvesPlayerIndex(): Promise<AllTimePlayerEntry[]> {
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

  return [...index.entries()]
    .map(([playerId, v]) => ({
      playerId,
      name: v.name,
      seasons: [...v.seasons].sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const getCachedAllTimeWolvesPlayers = unstable_cache(
  buildAllTimeWolvesPlayerIndex,
  ["wolves-all-players-v4"],
  { revalidate: 86_400, tags: ["wolves-players"] },
);
