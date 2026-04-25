import { describe, expect, it } from "vitest";

import allPlayersFile from "@/data/all-time-players.json";
import draftPicksFile from "@/data/draft-picks-by-season.json";
import entityLinksFile from "@/data/entity-links.json";
import erasFile from "@/data/eras.json";
import playerBiosFile from "@/data/player-bios.json";
import seasonStoriesFile from "@/data/season-stories.json";
import { getAllLongreads } from "@/lib/longreads";

type GraphLike = {
  playerIds?: number[];
};

const allPlayerIds = new Set(allPlayersFile.players.map((p) => p.playerId));
const mojibakePattern = /[├┼─│╛╜╢╤]/;

function unknownPlayerIds(ids: number[]): number[] {
  return ids.filter((id) => !allPlayerIds.has(id));
}

describe("player profile coverage", () => {
  it("keeps player-name fields free of mojibake encoding artifacts", () => {
    const names = [
      ...allPlayersFile.players.map((p) => p.name),
      ...Object.values(draftPicksFile.bySeason).flatMap((picks) => picks.map((pick) => pick.playerName)),
    ];

    const corrupted = names.filter((name) => mojibakePattern.test(name));
    expect(corrupted, `Fix mojibake player names: ${corrupted.join(", ")}`).toEqual([]);
  });

  it("keeps every player bio keyed to an all-time Wolves player", () => {
    const bioIds = Object.keys(playerBiosFile.bios).map(Number);

    expect(
      unknownPlayerIds(bioIds),
      "Every player-bios.json key must exist in src/data/all-time-players.json.",
    ).toEqual([]);
  });

  it("keeps curated player story links keyed to all-time Wolves players", () => {
    const linkedIds = Object.keys(entityLinksFile.players).map(Number);

    expect(
      unknownPlayerIds(linkedIds),
      "Every entity-links.json player key must exist in src/data/all-time-players.json.",
    ).toEqual([]);
  });

  it("keeps era, season, and longread player graph ids valid", () => {
    const graphIds: number[] = [];

    for (const era of erasFile.eras) {
      graphIds.push(...era.spotlightPlayers.map((p) => p.playerId));
      graphIds.push(...(((era as { contentGraph?: GraphLike }).contentGraph)?.playerIds ?? []));
    }

    for (const story of Object.values(seasonStoriesFile.stories)) {
      graphIds.push(...(((story as { graph?: GraphLike }).graph?.playerIds) ?? []));
      graphIds.push(...Object.keys((story as { graphPlayerLabels?: Record<string, string> }).graphPlayerLabels ?? {}).map(Number));
    }

    for (const longread of getAllLongreads()) {
      graphIds.push(...(longread.contentGraph?.playerIds ?? []));
      graphIds.push(...Object.keys(longread.contentGraphPlayerLabels ?? {}).map(Number));
    }

    expect(
      unknownPlayerIds(graphIds),
      "Every player id in content graph data must exist in src/data/all-time-players.json.",
    ).toEqual([]);
  });
});
