import storiesFile from "@/data/season-stories.json";

import { normalizeContentGraph } from "@/lib/content-graph";
import { mergedSeasonStoryGraph } from "@/lib/season-graph-infer";
import type { ContentGraph } from "@/types/content-graph";

type RawSeasonStory = {
  blurb: string;
  updated?: string;
  /** Optional editorial freshness label (takes precedence over `updated` when set). */
  lastUpdated?: string;
  graph?: ContentGraph;
  graphPlayerLabels?: Record<string, string>;
};

export type SeasonStory = {
  blurb: string;
  /** Resolved display string for freshness (from `lastUpdated` or `updated`). */
  updated: string;
  lastUpdated?: string;
  graph?: ContentGraph;
  graphPlayerLabels?: Record<string, string>;
};

export function getSeasonStory(seasonId: string): SeasonStory | null {
  const entry = storiesFile.stories[seasonId as keyof typeof storiesFile.stories] as
    | RawSeasonStory
    | undefined;
  if (!entry || typeof entry.blurb !== "string") return null;
  const explicitGraph = normalizeContentGraph(entry.graph);
  const last =
    typeof entry.lastUpdated === "string" && entry.lastUpdated.trim()
      ? entry.lastUpdated.trim()
      : undefined;
  const legacy = typeof entry.updated === "string" ? entry.updated : "";
  const updatedDisplay = last ?? legacy;

  return {
    blurb: entry.blurb,
    updated: updatedDisplay,
    lastUpdated: last,
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
