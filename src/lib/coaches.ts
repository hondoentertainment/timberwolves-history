import coachesFile from "@/data/wolves-coaches.json";

export type CoachTenure = {
  from: string;
  to: string;
  gc: number;
  w: number;
  l: number;
  playoffGc: number;
  playoffW: number;
  playoffL: number;
  note?: string;
};

export type CoachRecord = {
  id: string;
  name: string;
  /** Optional editorial paragraphs (see `wolves-coaches.json`). */
  bio?: string[];
  tenures: CoachTenure[];
};

function seasonKey(seasonId: string): number {
  const [y, tail] = seasonId.split("-");
  const year = Number(y);
  const suffix = Number(tail);
  return year * 100 + suffix;
}

function between(seasonId: string, from: string, to: string): boolean {
  const s = seasonKey(seasonId);
  return s >= seasonKey(from) && s <= seasonKey(to);
}

export function getAllCoaches(): CoachRecord[] {
  return coachesFile.coaches as CoachRecord[];
}

export function getCoachById(id: string): CoachRecord | undefined {
  return getAllCoaches().find((c) => c.id === id);
}

export function coachNamesForSeason(seasonId: string): string[] {
  const names = new Set<string>();
  for (const c of getAllCoaches()) {
    for (const t of c.tenures) {
      if (between(seasonId, t.from, t.to)) names.add(c.name);
    }
  }
  return [...names];
}

export function coachesFileAttribution(): string {
  return coachesFile.attribution;
}
