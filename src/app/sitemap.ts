import type { MetadataRoute } from "next";

import { getAllCoaches } from "@/lib/coaches";
import { getAllFigures } from "@/lib/figures";
import { getAllEras } from "@/lib/eras";
import { getLongreadSlugs } from "@/lib/longreads";
import { getCachedAllTimeWolvesPlayers } from "@/lib/nba/players-index";
import { getWolvesSeasonIds } from "@/lib/nba/seasons";

const base = () =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Player URL fan-out + cold roster index can exceed default static generation budget. */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const root = base();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/start-here",
    "/at-a-glance",
    "/record-book",
    "/compare/seasons",
    "/compare/players",
    "/seasons",
    "/players",
    "/coaches",
    "/eras",
    "/timeline",
    "/memes",
    "/stories",
    "/search",
    "/trivia",
    "/changelog",
    "/about-data",
    "/figures",
    "/browse",
    "/explore",
    "/players/leaders",
    "/explore/2003-04-offseason",
    "/explore/2017-18-playoff-return",
    "/explore/2007-garnett-trade",
  ].map((path) => ({
    url: `${root}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "daily",
    priority: path === "" ? 1 : 0.8,
  }));

  const seasons = getWolvesSeasonIds().map((id) => ({
    url: `${root}/seasons/${encodeURIComponent(id)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const coaches = getAllCoaches().map((c) => ({
    url: `${root}/coaches/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  const eraPages = getAllEras().map((e) => ({
    url: `${root}/eras/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  const storyPages = getLongreadSlugs().map((slug) => ({
    url: `${root}/stories/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const figurePages = getAllFigures().map((f) => ({
    url: `${root}/figures/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.35,
  }));

  let playerPages: MetadataRoute.Sitemap = [];
  try {
    const players = await getCachedAllTimeWolvesPlayers();
    playerPages = players.map((p) => ({
      url: `${root}/players/${p.playerId}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  } catch {
    playerPages = [];
  }

  return [
    ...staticRoutes,
    ...seasons,
    ...coaches,
    ...eraPages,
    ...storyPages,
    ...figurePages,
    ...playerPages,
  ];
}
