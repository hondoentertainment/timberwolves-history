import txFile from "@/data/transactions-by-season.json";

export type SeasonTransaction = {
  dateLabel: string;
  summary: string;
};

export function transactionsAttribution(): string {
  return txFile.attribution;
}

export function getTransactionsForSeason(seasonId: string): SeasonTransaction[] {
  const map = txFile.bySeason as Record<string, SeasonTransaction[]>;
  return map[seasonId] ?? [];
}
