import { getAllCoaches } from "@/lib/coaches";
import { getAllFigures } from "@/lib/figures";
import { getAllEras } from "@/lib/eras";
import { getAllLongreads } from "@/lib/longreads";
import { getCachedAllTimeWolvesPlayers } from "@/lib/nba/players-index";
import { getSeasonStory } from "@/lib/season-stories";
import { getWolvesSeasonIds } from "@/lib/nba/seasons";

export type SearchHit = {
  title: string;
  href: string;
  kind: string;
  snippet?: string;
};

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
    const hay = `${e.title} ${e.slug} ${e.yearsLabel}`.toLowerCase();
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
    const hay = `${s.title} ${s.slug} ${s.dek}`.toLowerCase();
    if (hay.includes(query)) {
      hits.push({
        title: s.title,
        href: `/stories/${s.slug}`,
        kind: "Story",
        snippet: `${s.readTimeMinutes} min read`,
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

  if (query.length >= 4) {
    for (const sid of getWolvesSeasonIds()) {
      if (sid.toLowerCase().includes(query)) {
        const story = getSeasonStory(sid);
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
  }

  const seen = new Set<string>();
  const deduped: SearchHit[] = [];
  for (const h of hits) {
    if (seen.has(h.href)) continue;
    seen.add(h.href);
    deduped.push(h);
    if (deduped.length >= 45) break;
  }
  return deduped;
}
