import biosFile from "@/data/player-bios.json";

export type PlayerBioSource = { label: string; url: string };

export type PlayerBio = {
  paragraphs: string[];
  sources: PlayerBioSource[];
};

export function getPlayerBio(playerId: number): PlayerBio | null {
  const key = String(playerId);
  const raw = biosFile.bios[key as keyof typeof biosFile.bios];
  if (!raw || !Array.isArray(raw.paragraphs)) return null;
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
  };
}

export function playerBiosAttribution(): string {
  return biosFile.attribution;
}
