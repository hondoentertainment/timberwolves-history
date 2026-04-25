import { describe, expect, it } from "vitest";

import storiesFile from "@/data/season-stories.json";
import { getWolvesSeasonIds } from "@/lib/nba/seasons";

describe("season-stories.json coverage", () => {
  it("has a non-empty blurb for every season slug the app currently lists", () => {
    const stories = storiesFile.stories as Record<string, { blurb?: string } | undefined>;
    const missing = getWolvesSeasonIds().filter((id) => {
      const row = stories[id];
      return !row || typeof row.blurb !== "string" || !row.blurb.trim();
    });
    expect(
      missing,
      `Add a season-stories entry for: ${missing.join(", ")} (or adjust getWolvesSeasonIds if intentional).`,
    ).toEqual([]);
  });
});
