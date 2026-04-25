import biosFile from "@/data/player-bios.json";

export type PlayerBioSource = { label: string; url: string };

export type PlayerBio = {
  paragraphs: string[];
  sources: PlayerBioSource[];
  /** When set, replaces auto-generated Wolves stat highlight bullets on the profile. */
  highlightBullets?: string[];
};

export function getPlayerBio(playerId: number): PlayerBio | null {
  const key = String(playerId);
  const raw = biosFile.bios[key as keyof typeof biosFile.bios];
  if (!raw || !Array.isArray(raw.paragraphs)) return null;
  const highlightBullets = Array.isArray((raw as { highlightBullets?: unknown }).highlightBullets)
    ? (raw as { highlightBullets: unknown[] }).highlightBullets.filter(
        (b): b is string => typeof b === "string" && b.trim().length > 0,
      )
    : undefined;
  return {
    paragraphs: raw.paragraphs.filter((p) => typeof p === "string" && p.trim()),
    sources: Array.isArray(raw.sources)
      ? raw.sources.filter(
          (s): s is PlayerBioSource =>
            typeof s === "object" &&
            s !== null &&
            typeof (s as PlayerBioSource).label === "string" &&
            typeof (s as PlayerBioSource).url === "string",
        )
      : [],
    ...(highlightBullets?.length ? { highlightBullets } : {}),
  };
}

export function playerBiosAttribution(): string {
  return biosFile.attribution;
}
