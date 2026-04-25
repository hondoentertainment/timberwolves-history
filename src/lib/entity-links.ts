import linksFile from "@/data/entity-links.json";

import { getLongreadBySlug } from "@/lib/longreads";

export function entityLinksAttribution(): string {
  return linksFile.attribution;
}

export type RelatedStoryLink = { slug: string; title: string };

function storiesForPlayer(playerId: number): RelatedStoryLink[] {
  const key = String(playerId);
  const raw = linksFile.players[key as keyof typeof linksFile.players];
  if (!raw?.storySlugs?.length) return [];
  return raw.storySlugs
    .map((slug) => {
      const s = getLongreadBySlug(slug);
      return s ? { slug: s.slug, title: s.title } : null;
    })
    .filter((x): x is RelatedStoryLink => x !== null);
}

function storiesForCoach(coachId: string): RelatedStoryLink[] {
  const raw = linksFile.coaches[coachId as keyof typeof linksFile.coaches];
  if (!raw?.storySlugs?.length) return [];
  return raw.storySlugs
    .map((slug) => {
      const s = getLongreadBySlug(slug);
      return s ? { slug: s.slug, title: s.title } : null;
    })
    .filter((x): x is RelatedStoryLink => x !== null);
}

export function getRelatedStoriesForPlayer(playerId: number): RelatedStoryLink[] {
  return storiesForPlayer(playerId);
}

export function getRelatedStoriesForCoach(coachId: string): RelatedStoryLink[] {
  return storiesForCoach(coachId);
}
