import { getAllCoaches } from "@/lib/coaches";
import { getAllFigures } from "@/lib/figures";
import { getAllEras } from "@/lib/eras";
import { getAllLongreads } from "@/lib/longreads";
import { getWolvesMemes } from "@/lib/memes";
import { getCachedAllTimeWolvesPlayers } from "@/lib/nba/players-index";
import { collectThemeFacetsForSeasons } from "@/lib/season-theme-facets";
import { getSeasonStory } from "@/lib/season-stories";
import { getWolvesSeasonIds } from "@/lib/nba/seasons";

export type SearchHit = {
  title: string;
  href: string;
  kind: string;
  snippet?: string;
};

function titleFromThemeSlug(themeSlug: string): string {
  if (themeSlug.startsWith("era-highlight:")) {
    const era = themeSlug.slice("era-highlight:".length);
    return `Era highlight (${era.replace(/-/g, " ")})`;
  }
  return themeSlug
    .split("-")
    .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export async function siteSearch(raw: string): Promise<SearchHit[]> {
  const query = raw.trim().toLowerCase();
  if (!query) return [];

  const hits: SearchHit[] = [];

  const players = await getCachedAllTimeWolvesPlayers().catch(
    () => [] as { playerId: number; name: string; seasons: string[] }[],
  );
  for (const p of players) {
    if (p.name.toLowerCase().includes(query)) {
      hits.push({
        title: p.name,
        href: `/players/${p.playerId}`,
        kind: "Player",
        snippet: `${p.seasons.length} tracked Wolves seasons`,
      });
    }
  }

  for (const c of getAllCoaches()) {
    if (c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)) {
      hits.push({ title: c.name, href: `/coaches/${c.id}`, kind: "Coach" });
    }
  }

  for (const e of getAllEras()) {
    const themeHay = (e.contentGraph?.themes ?? []).join(" ");
    const hay = `${e.title} ${e.slug} ${e.yearsLabel} ${e.intro.join(" ")} ${themeHay}`.toLowerCase();
    if (hay.includes(query)) {
      hits.push({
        title: e.title,
        href: `/eras/${e.slug}`,
        kind: "Era",
        snippet: e.yearsLabel,
      });
    }
  }

  for (const s of getAllLongreads()) {
    const graphHay = [
      ...(s.contentGraph?.themes ?? []),
      ...(s.contentGraph?.eraSlugs ?? []),
    ].join(" ");
    const hay = `${s.title} ${s.slug} ${s.dek} ${graphHay}`.toLowerCase();
    if (hay.includes(query)) {
      hits.push({
        title: s.title,
        href: `/stories/${s.slug}`,
        kind: "Story",
        snippet: `${s.readTimeMinutes} min read`,
      });
    }
  }

  for (const m of getWolvesMemes()) {
    const hay = `${m.title} ${m.summary} ${m.era}`.toLowerCase();
    if (hay.includes(query)) {
      hits.push({
        title: m.title,
        href: `/memes#meme-${encodeURIComponent(m.id)}`,
        kind: "Meme",
        snippet: m.era,
      });
    }
  }

  for (const f of getAllFigures()) {
    const hay = `${f.title} ${f.slug} ${f.role}`.toLowerCase();
    if (hay.includes(query)) {
      hits.push({
        title: f.title,
        href: `/figures/${f.slug}`,
        kind: "Figure",
        snippet: f.role,
      });
    }
  }

  const seasonSeen = new Set<string>();
  if (query.length >= 4) {
    for (const sid of getWolvesSeasonIds()) {
      const story = getSeasonStory(sid);
      const blurbHay = story?.blurb.toLowerCase() ?? "";
      const sidHit = sid.toLowerCase().includes(query);
      const blurbHit = blurbHay.includes(query);
      if (!sidHit && !blurbHit) continue;
      if (seasonSeen.has(sid)) continue;
      seasonSeen.add(sid);
      hits.push({
        title: `${sid} season`,
        href: `/seasons/${encodeURIComponent(sid)}`,
        kind: "Season",
        snippet: story?.blurb
          ? story.blurb.slice(0, 120) + (story.blurb.length > 120 ? "…" : "")
          : undefined,
      });
    }
  }

  const themeSlugs = collectThemeFacetsForSeasons(getWolvesSeasonIds());
  for (const themeSlug of themeSlugs) {
    const slugHay = themeSlug.toLowerCase();
    const spacedHay = slugHay.replace(/-/g, " ");
    if (!slugHay.includes(query) && !spacedHay.includes(query)) continue;
    hits.push({
      title: titleFromThemeSlug(themeSlug),
      href: `/seasons?theme=${encodeURIComponent(themeSlug)}`,
      kind: "Theme",
      snippet: "Filter the season index by this merged content-graph tag.",
    });
  }

  const seen = new Set<string>();
  const deduped: SearchHit[] = [];
  for (const h of hits) {
    if (seen.has(h.href)) continue;
    seen.add(h.href);
    deduped.push(h);
    if (deduped.length >= 60) break;
  }
  return deduped;
}
