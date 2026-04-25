import { weightOfTheNorthLongread } from "@/content/longreads/weight-of-the-north";

import type { Longread } from "@/content/longreads/weight-of-the-north";

const bySlug: Record<string, typeof weightOfTheNorthLongread> = {
  [weightOfTheNorthLongread.slug]: weightOfTheNorthLongread,
};

export type { Longread, LongreadSection, LongreadSource } from "@/content/longreads/weight-of-the-north";

export function getLongreadSlugs(): string[] {
  return Object.keys(bySlug);
}

export function getLongreadBySlug(slug: string): Longread | undefined {
  return bySlug[slug];
}

export function getAllLongreads(): Longread[] {
  return Object.values(bySlug);
}

export function getLongreadSummaries(): { slug: string; title: string; dek: string }[] {
  return getAllLongreads().map((s) => ({ slug: s.slug, title: s.title, dek: s.dek }));
}
