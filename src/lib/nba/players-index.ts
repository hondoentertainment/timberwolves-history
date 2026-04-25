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

function normalizedPlayerName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

export function mergeAllTimePlayerEntries(
  base: AllTimePlayerEntry[],
  incoming: AllTimePlayerEntry[],
): AllTimePlayerEntry[] {
  const byId = new Map<number, { playerId: number; name: string; seasons: Set<string> }>();
  const idByName = new Map<string, number>();

  const add = (entry: AllTimePlayerEntry, preferName: boolean) => {
    const nameKey = normalizedPlayerName(entry.name);
    const existingId = byId.has(entry.playerId) ? entry.playerId : idByName.get(nameKey);
    const playerId = existingId ?? entry.playerId;
    const current =
      byId.get(playerId) ??
      ({
        playerId,
        name: entry.name,
        seasons: new Set<string>(),
      } as { playerId: number; name: string; seasons: Set<string> });

    if (entry.name && (preferName || !current.name)) current.name = entry.name;
    for (const season of entry.seasons) current.seasons.add(season);
    byId.set(playerId, current);
    if (nameKey && !idByName.has(nameKey)) idByName.set(nameKey, playerId);
  };

  for (const entry of base) add(entry, false);
  for (const entry of incoming) add(entry, true);

  return [...byId.values()]
    .map((p) => ({
      playerId: p.playerId,
      name: p.name,
      seasons: [...p.seasons].sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
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
  return mergeAllTimePlayerEntries(fallbackAllTimeWolvesPlayers, liveIndex);
}

export const getCachedAllTimeWolvesPlayers = unstable_cache(
  buildAllTimeWolvesPlayerIndex,
  ["wolves-all-players-v6"],
  { revalidate: 86_400, tags: ["wolves-players"] },
);
