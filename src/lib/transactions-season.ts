import txFile from "@/data/transactions-by-season.json";

export const transactionKinds = [
  "trade",
  "waiver",
  "signing",
  "draft",
  "coach",
  "roster",
] as const;

export type TransactionKind = (typeof transactionKinds)[number];

export type SeasonTransaction = {
  kind?: TransactionKind;
  dateLabel: string;
  summary: string;
};

export function transactionsAttribution(): string {
  return txFile.attribution;
}

export function transactionKindLabel(kind: SeasonTransaction["kind"]): string {
  switch (kind) {
    case "trade":
      return "Trade";
    case "waiver":
      return "Waiver wire";
    case "signing":
      return "Signing";
    case "draft":
      return "Draft";
    case "coach":
      return "Coach";
    case "roster":
      return "Roster";
    default:
      return "Transaction";
  }
}

export function getTransactionsForSeason(seasonId: string): SeasonTransaction[] {
  const map = txFile.bySeason as Record<string, SeasonTransaction[]>;
  return map[seasonId] ?? [];
}
