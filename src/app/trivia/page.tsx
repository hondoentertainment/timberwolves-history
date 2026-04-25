import { PageHeader } from "@/components/PageHeader";
import { TriviaGame } from "@/components/trivia/TriviaGame";
import { buildTriviaDeck } from "@/lib/trivia";
import type { TriviaFranchiseRow } from "@/lib/trivia/types";
import { getFranchiseSeasonsOrEmpty } from "@/lib/nba/queries";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Franchise trivia",
  description:
    "Multiple-choice Minnesota Timberwolves history trivia: 1,000+ questions from every season on this site, pairwise stat duels, chronology, era and meme lore, and NBA.com-derived records when available.",
};

export default async function TriviaPage() {
  const franchiseRows = await getFranchiseSeasonsOrEmpty();
  const slim: TriviaFranchiseRow[] = franchiseRows.map((r) => ({
    seasonLabel: r.seasonLabel,
    wins: r.wins,
    losses: r.losses,
    winPct: r.winPct,
    playoffWins: r.playoffWins,
    playoffLosses: r.playoffLosses,
    confRank: r.confRank,
    divRank: r.divRank,
  }));
  const deck = buildTriviaDeck(slim);

  return (
    <>
      <PageHeader
        title="Franchise deep trivia"
        description="A multiple-choice deck of 1,000+ questions whenever NBA.com franchise rows are available: every season slug, pairwise stat duels (wins, losses, playoffs, win %), chronology and triple-season peaks, editorial blurbs, memes and era intros, coach overlaps, timeline headlines, curated draft and transaction notes, and numeric record fields."
      />
      <TriviaGame deck={deck} />
    </>
  );
}
