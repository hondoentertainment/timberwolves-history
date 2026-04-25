import draftFile from "@/data/draft-picks-by-season.json";

export type DraftPickRow = {
  round: number;
  pickOverall: number;
  playerName: string;
  note?: string;
};

export function draftPicksAttribution(): string {
  return draftFile.attribution;
}

export function getDraftPicksForSeason(seasonId: string): DraftPickRow[] {
  const map = draftFile.bySeason as Record<string, DraftPickRow[]>;
  return map[seasonId] ?? [];
}
