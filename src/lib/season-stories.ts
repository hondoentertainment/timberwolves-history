import storiesFile from "@/data/season-stories.json";

import { normalizeContentGraph } from "@/lib/content-graph";
import { mergedSeasonStoryGraph } from "@/lib/season-graph-infer";
import type { ContentGraph } from "@/types/content-graph";

type RawSeasonStory = {
  blurb: string;
  updated?: string;
  graph?: ContentGraph;
  graphPlayerLabels?: Record<string, string>;
};

export type SeasonStory = {
  blurb: string;
  updated: string;
  graph?: ContentGraph;
  graphPlayerLabels?: Record<string, string>;
};

export function getSeasonStory(seasonId: string): SeasonStory | null {
  const entry = storiesFile.stories[seasonId as keyof typeof storiesFile.stories] as
    | RawSeasonStory
    | undefined;
  if (!entry || typeof entry.blurb !== "string") return null;
  const explicitGraph = normalizeContentGraph(entry.graph);

  return {
    blurb: entry.blurb,
    updated: typeof entry.updated === "string" ? entry.updated : "",
    graph: mergedSeasonStoryGraph(explicitGraph, seasonId),
    graphPlayerLabels:
      entry.graphPlayerLabels && typeof entry.graphPlayerLabels === "object"
        ? entry.graphPlayerLabels
        : undefined,
  };
}

export function seasonStoriesAttribution(): string {
  return storiesFile.attribution;
}
