import erasFile from "@/data/eras.json";

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
  for (const era of getAllEras()) {
    const spotlight = era.spotlightPlayers.find((p) => p.playerId === playerId);
    if (spotlight) {
      return { slug: era.slug, linkLabel: `${spotlight.label} era hub` };
    }
  }
  return undefined;
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
