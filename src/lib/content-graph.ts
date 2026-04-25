import type { ContentGraph } from "@/types/content-graph";

const SEASON_SLUG = /^\d{4}-\d{2}$/;

export function humanizeIdSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

export type ContentGraphLink = {
  href: string;
  label: string;
  hint?: string;
};

function uniq<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}

/** True when `id` looks like a canonical season slug used on this site. */
export function isSeasonSlugForGraph(id: string): boolean {
  return SEASON_SLUG.test(id.trim());
}

/**
 * Normalizes optional partial graph: drops empty arrays and undefined keys.
 */
export function normalizeContentGraph(raw: ContentGraph | null | undefined): ContentGraph | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const out: ContentGraph = {};
  if (raw.playerIds?.length) out.playerIds = uniq(raw.playerIds);
  if (raw.seasonIds?.length) out.seasonIds = uniq(raw.seasonIds);
  if (raw.coachIds?.length) out.coachIds = uniq(raw.coachIds);
  if (raw.eraSlugs?.length) out.eraSlugs = uniq(raw.eraSlugs);
  if (raw.gameIds?.length) out.gameIds = uniq(raw.gameIds);
  if (raw.storySlugs?.length) out.storySlugs = uniq(raw.storySlugs);
  if (raw.themes?.length) out.themes = uniq(raw.themes.map((t) => t.trim()).filter(Boolean));
  return Object.keys(out).length ? out : undefined;
}

/** Deep-merge two graphs (deduped lists). Either side may be undefined. */
export function mergeContentGraphs(
  a: ContentGraph | undefined,
  b: ContentGraph | undefined,
): ContentGraph | undefined {
  return normalizeContentGraph({
    playerIds: [...(a?.playerIds ?? []), ...(b?.playerIds ?? [])],
    seasonIds: [...(a?.seasonIds ?? []), ...(b?.seasonIds ?? [])],
    coachIds: [...(a?.coachIds ?? []), ...(b?.coachIds ?? [])],
    eraSlugs: [...(a?.eraSlugs ?? []), ...(b?.eraSlugs ?? [])],
    gameIds: [...(a?.gameIds ?? []), ...(b?.gameIds ?? [])],
    storySlugs: [...(a?.storySlugs ?? []), ...(b?.storySlugs ?? [])],
    themes: [...(a?.themes ?? []), ...(b?.themes ?? [])],
  });
}

/**
 * Builds navigable links from a standalone content graph (e.g. longread, season blurb).
 */
export function linksFromContentGraph(graph: ContentGraph | undefined): ContentGraphLink[] {
  const g = normalizeContentGraph(graph);
  if (!g) return [];
  const links: ContentGraphLink[] = [];

  for (const id of g.playerIds ?? []) {
    links.push({
      href: `/players/${id}`,
      label: `Player ${id}`,
      hint: "Profile",
    });
  }
  for (const sid of g.seasonIds ?? []) {
    links.push({
      href: `/seasons/${encodeURIComponent(sid)}`,
      label: sid,
      hint: "Season",
    });
  }
  for (const cid of g.coachIds ?? []) {
    links.push({
      href: `/coaches/${encodeURIComponent(cid)}`,
      label: humanizeIdSlug(cid),
      hint: "Coach",
    });
  }
  for (const slug of g.eraSlugs ?? []) {
    links.push({
      href: `/eras/${encodeURIComponent(slug)}`,
      label: humanizeIdSlug(slug),
      hint: "Era hub",
    });
  }
  for (const gid of g.gameIds ?? []) {
    if (isSeasonSlugForGraph(gid)) {
      links.push({
        href: `/seasons/${encodeURIComponent(gid)}`,
        label: gid,
        hint: "Season context",
      });
    }
  }
  for (const s of g.storySlugs ?? []) {
    links.push({
      href: `/stories/${encodeURIComponent(s)}`,
      label: humanizeIdSlug(s),
      hint: "Story",
    });
  }

  return dedupeLinks(links);
}

/** `gameIds` entries that are not season slugs (no route yet — show as editorial labels). */
export function opaqueGameLabels(graph: ContentGraph | undefined): string[] {
  const g = normalizeContentGraph(graph);
  if (!g?.gameIds?.length) return [];
  return g.gameIds.filter((id) => !isSeasonSlugForGraph(id));
}

function dedupeLinks(links: ContentGraphLink[]): ContentGraphLink[] {
  const seen = new Set<string>();
  const out: ContentGraphLink[] = [];
  for (const l of links) {
    if (seen.has(l.href)) continue;
    seen.add(l.href);
    out.push(l);
  }
  return out;
}
