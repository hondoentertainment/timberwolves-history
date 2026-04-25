/**
 * Typed relations between editorial surfaces (eras, season blurbs, longreads).
 * Prefer IDs/slugs over prose so related reading, search, and facets stay data-driven.
 */

export type ContentGraph = {
  /** NBA.com-style numeric player IDs */
  playerIds?: number[];
  /** Franchise season slugs, e.g. "2003-04" */
  seasonIds?: string[];
  /** Coach row ids from `wolves-coaches.json` */
  coachIds?: string[];
  /** Era hub slugs under `/eras/[slug]` */
  eraSlugs?: string[];
  /**
   * Curated “moment” anchors. Values that match `\\d{4}-\\d{2}` are treated as season
   * slugs and linked to `/seasons/...`; other strings render as labels only until a
   * dedicated games route exists.
   */
  gameIds?: string[];
  /** Editorial essays under `/stories/[slug]` */
  storySlugs?: string[];
  /** Facet-oriented tags (no URLs); for display and future search */
  themes?: string[];
};
