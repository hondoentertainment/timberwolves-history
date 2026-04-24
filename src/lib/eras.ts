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

export function erasAttribution(): string {
  return erasFile.attribution;
}
