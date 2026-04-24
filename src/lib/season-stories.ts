import storiesFile from "@/data/season-stories.json";

export type SeasonStory = {
  blurb: string;
  updated: string;
};

export function getSeasonStory(seasonId: string): SeasonStory | null {
  const entry = storiesFile.stories[seasonId as keyof typeof storiesFile.stories];
  if (!entry || typeof entry.blurb !== "string") return null;
  return {
    blurb: entry.blurb,
    updated: typeof entry.updated === "string" ? entry.updated : "",
  };
}

export function seasonStoriesAttribution(): string {
  return storiesFile.attribution;
}
