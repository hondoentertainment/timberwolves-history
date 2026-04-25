import type { RelatedReadingLink } from "@/components/RelatedReading";
import { getAllLongreads } from "@/lib/longreads";

function dedupeLinks(links: RelatedReadingLink[]): RelatedReadingLink[] {
  const seen = new Set<string>();
  const out: RelatedReadingLink[] = [];
  for (const l of links) {
    if (seen.has(l.href)) continue;
    seen.add(l.href);
    out.push(l);
  }
  return out;
}

/** Longreads whose `contentGraph` lists this NBA player id. */
export function getLongreadRelatedLinksForPlayer(playerId: number): RelatedReadingLink[] {
  const out: RelatedReadingLink[] = [];
  for (const story of getAllLongreads()) {
    if (story.contentGraph?.playerIds?.includes(playerId)) {
      out.push({
        href: `/stories/${story.slug}`,
        label: story.title,
        hint: "Essay graph",
      });
    }
  }
  return dedupeLinks(out);
}

/** Longreads whose `contentGraph` lists this coach row id. */
export function getLongreadRelatedLinksForCoach(coachId: string): RelatedReadingLink[] {
  const out: RelatedReadingLink[] = [];
  for (const story of getAllLongreads()) {
    if (story.contentGraph?.coachIds?.includes(coachId)) {
      out.push({
        href: `/stories/${story.slug}`,
        label: story.title,
        hint: "Essay graph",
      });
    }
  }
  return dedupeLinks(out);
}
