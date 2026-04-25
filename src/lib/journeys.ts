import journeysFile from "@/data/journeys.json";

export type JourneyLink = {
  href: string;
  label: string;
};

export type Journey = {
  id: string;
  title: string;
  audience: string;
  priority: number;
  description: string;
  href: string;
  tags: string[];
  relatedLinks: JourneyLink[];
};

export type ExplorerPath = {
  href: string;
  title: string;
  eyebrow: string;
  description: string;
};

type JourneysFile = {
  journeys: Journey[];
  explorers: ExplorerPath[];
  suggestedSearches: string[];
};

const data = journeysFile as JourneysFile;

export function getAllJourneys(): Journey[] {
  return [...data.journeys].sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title));
}

export function getFeaturedJourneys(limit = 3): Journey[] {
  return getAllJourneys().slice(0, limit);
}

export function getJourneyById(id: string): Journey | undefined {
  return getAllJourneys().find((journey) => journey.id === id);
}

export function getAllExplorerPaths(): ExplorerPath[] {
  return data.explorers;
}

export function getSuggestedSearches(): string[] {
  return data.suggestedSearches;
}

export function journeyMatchesQuery(journey: Journey, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  const haystack = [
    journey.title,
    journey.audience,
    journey.description,
    journey.href,
    ...journey.tags,
    ...journey.relatedLinks.flatMap((link) => [link.label, link.href]),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}
