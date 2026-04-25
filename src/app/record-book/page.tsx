import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { SectionHeader, StatCard, SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
import { StatTable } from "@/components/StatTable";
import { getAllCoaches } from "@/lib/coaches";
import { getCachedAllTimeWolvesPlayers, getFallbackAllTimeWolvesPlayers } from "@/lib/nba/players-index";
import { getFranchiseSeasonsOrEmpty } from "@/lib/nba/queries";
import { buildRecordBook } from "@/lib/record-book";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Record book",
  description:
    "Minnesota Timberwolves franchise record book: top seasons, playoff runs, coach wins, and tenure leaders.",
};

function formatPct(n: number | null): string {
  return n === null || !Number.isFinite(n) ? "-" : n.toFixed(3);
}

export default async function RecordBookPage() {
  const [seasons, players] = await Promise.all([
    getFranchiseSeasonsOrEmpty(),
    getCachedAllTimeWolvesPlayers().catch(() => getFallbackAllTimeWolvesPlayers()),
  ]);
  const book = buildRecordBook(seasons, getAllCoaches(), players, 10);

  return (
    <>
      <PageHeader
        eyebrow="Franchise record book"
        title="The Wolves archive, ranked"
        description="A sports-native hub for the best seasons, playoff runs, coaching records, and roster tenures this archive can derive honestly from its current data."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/compare/seasons" className={`inline-flex min-h-11 items-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 ${premiumLinkFocus}`}>
              Compare seasons
            </Link>
            <Link href="/compare/players" className={`inline-flex min-h-11 items-center rounded-xl border border-zinc-700/90 bg-zinc-950/40 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-zinc-600 ${premiumLinkFocus}`}>
              Compare players
            </Link>
          </div>
        }
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Seasons ranked" value={String(seasons.length)} detail="NBA.com team year-over-year rows or snapshot fallback." href="/seasons" />
        <StatCard label="Tracked players" value={String(players.length)} detail="Merged all-time Wolves regular-season roster index." href="/players" />
        <StatCard label="Best season" value={book.mostWins[0]?.seasonLabel ?? "-"} detail={book.mostWins[0] ? `${book.mostWins[0].wins} wins` : "Unavailable"} href={book.mostWins[0] ? `/seasons/${book.mostWins[0].seasonLabel}` : "/seasons"} />
        <StatCard label="Top coach wins" value={book.coachWins[0]?.name ?? "-"} detail={book.coachWins[0] ? `${book.coachWins[0].wins} regular-season wins` : "Unavailable"} href={book.coachWins[0] ? `/coaches/${book.coachWins[0].id}` : "/coaches"} />
      </div>

      <div className="grid gap-10">
        <section aria-labelledby="record-seasons">
          <SectionHeader id="record-seasons" title="Top regular seasons" description="Ranked by wins, then win percentage, then playoff wins." />
          <StatTable
            caption="Top Timberwolves regular seasons"
            columns={["Season", "W-L", "Win%", "Playoffs"]}
            rows={book.mostWins.map((s) => [
              <Link key={s.seasonLabel} href={`/seasons/${s.seasonLabel}`} className={`text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>{s.seasonLabel}</Link>,
              `${s.wins}-${s.losses}`,
              formatPct(s.winPct),
              s.playoffWins + s.playoffLosses > 0 ? `${s.playoffWins}-${s.playoffLosses}` : "-",
            ])}
          />
        </section>

        <section aria-labelledby="record-playoffs">
          <SectionHeader id="record-playoffs" title="Playoff runs" description="Postseason rows from the franchise season feed." />
          <StatTable
            caption="Top Timberwolves playoff runs"
            columns={["Season", "Playoff W-L", "Regular season"]}
            rows={book.mostPlayoffWins.map((s) => [
              <Link key={s.seasonLabel} href={`/seasons/${s.seasonLabel}`} className={`text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>{s.seasonLabel}</Link>,
              `${s.playoffWins}-${s.playoffLosses}`,
              `${s.wins}-${s.losses}`,
            ])}
          />
        </section>

        <section aria-labelledby="record-people" className="grid gap-6 lg:grid-cols-2">
          <SurfaceCard className="p-5">
            <SectionHeader id="record-people" title="Coach wins" description="Aggregated from the static head-coach register." />
            <ol className="space-y-3 text-sm">
              {book.coachWins.slice(0, 8).map((coach, index) => (
                <li key={coach.id} className="flex items-center justify-between gap-4">
                  <Link href={`/coaches/${coach.id}`} className={`font-medium text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
                    {index + 1}. {coach.name}
                  </Link>
                  <span className="text-zinc-500">{coach.wins}-{coach.losses}</span>
                </li>
              ))}
            </ol>
          </SurfaceCard>
          <SurfaceCard className="p-5">
            <SectionHeader title="Longest roster tenures" description="Regular-season roster seasons, not minute totals." />
            <ol className="space-y-3 text-sm">
              {book.longestTenures.slice(0, 8).map((player, index) => (
                <li key={player.playerId} className="flex items-center justify-between gap-4">
                  <Link href={`/players/${player.playerId}`} className={`font-medium text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
                    {index + 1}. {player.name}
                  </Link>
                  <span className="text-zinc-500">{player.seasons.length} seasons</span>
                </li>
              ))}
            </ol>
          </SurfaceCard>
        </section>
      </div>
    </>
  );
}
