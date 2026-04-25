import erasFile from "@/data/eras.json";

import type { ContentGraph } from "@/types/content-graph";

export type EraSource = { label: string; url: string };

export type EraSpotlightPlayer = { playerId: number; label: string };

export type EraRecord = {
  slug: string;
  title: string;
  yearsLabel: string;
  intro: string[];
  highlightSeasonIds: string[];
  spotlightPlayers: EraSpotlightPlayer[];
  relatedCoachIds: string[];
  /** Optional links to `/stories/[slug]` editorial essays. */
  relatedStorySlugs?: string[];
  sources: EraSource[];
  /** Typed relations (themes, slugs) for discovery — see `src/types/content-graph.ts`. */
  contentGraph?: ContentGraph;
  /** Editorial stamp for sensitive hubs; shown on the era page when set. */
  lastReviewed?: string;
};

export function getAllEras(): EraRecord[] {
  return erasFile.eras as EraRecord[];
}

export function getEraBySlug(slug: string): EraRecord | undefined {
  return getAllEras().find((e) => e.slug === slug);
}

/** First era hub that spotlights this NBA player id (for deep links from profiles). */
export function getEraHubLinkForPlayer(
  playerId: number,
): { slug: string; linkLabel: string } | undefined {
  const all = getAllEraHubsForPlayer(playerId);
  const first = all[0];
  if (!first) return undefined;
  const era = getEraBySlug(first.slug);
  const spotlight = era?.spotlightPlayers.find((p) => p.playerId === playerId);
  return spotlight
    ? { slug: first.slug, linkLabel: `${spotlight.label} era hub` }
    : first;
}

/** Every era hub that spotlights this NBA player id (ordered as in `eras.json`). */
export function getAllEraHubsForPlayer(playerId: number): { slug: string; linkLabel: string }[] {
  const out: { slug: string; linkLabel: string }[] = [];
  for (const era of getAllEras()) {
    const spotlight = era.spotlightPlayers.find((p) => p.playerId === playerId);
    if (spotlight) {
      out.push({ slug: era.slug, linkLabel: `${spotlight.label} · ${era.title}` });
    }
  }
  return out;
}

/** Eras that list this coach in `relatedCoachIds`. */
export function getEraHubsForCoach(coachId: string): { slug: string; title: string }[] {
  return getAllEras()
    .filter((e) => e.relatedCoachIds.includes(coachId))
    .map((e) => ({ slug: e.slug, title: e.title }));
}

export function erasAttribution(): string {
  return erasFile.attribution;
}
