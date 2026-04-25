import { FeatureCard } from "@/components/FeatureCard";
import type { Longread } from "@/lib/longreads";
import { getFranchiseSeasonsOrEmpty } from "@/lib/nba/queries";

export async function HomeFranchiseFeatureGrid({ flagship }: { flagship: Longread | undefined }) {
  const seasons = await getFranchiseSeasonsOrEmpty();
  const latest = seasons[seasons.length - 1];

  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
      {flagship ? (
        <FeatureCard
          accent="violet"
          title={flagship.title}
          description={flagship.dek}
          href={`/stories/${flagship.slug}`}
          cta="Read the flagship essay"
        />
      ) : null}
      <FeatureCard
        accent="sky"
        title="Franchise figures"
        description="Owners, broadcast voices, and other personas who shaped how the team felt off the court—editorial capsules, not stat profiles."
        href="/figures"
        cta="Browse figures"
      />
      <FeatureCard
        accent="emerald"
        title="Seasons"
        description="Regular-season wins, losses, playoff results, and year-by-year rosters."
        href="/seasons"
        cta="Browse seasons"
      />
      <FeatureCard
        accent="emerald"
        title="Players"
        description="Search everyone who has appeared on a Timberwolves regular-season roster, with profile pages and per-game career splits."
        href="/players"
        cta="Browse players"
      />
      <FeatureCard
        accent="violet"
        title="Coaches"
        description="Head coaches, tenures, and register-style win–loss summaries (static register + NBA stats elsewhere on the site)."
        href="/coaches"
        cta="Browse coaches"
      />
      <FeatureCard
        accent="emerald"
        title="Eras"
        description="Editorial era hubs—expansion, Garnett peak, post-KG rebuild, Butler chapter, and the modern Finch-led Wolves—with linked seasons and people."
        href="/eras"
        cta="Browse eras"
      />
      <FeatureCard
        accent="sky"
        title="Timeline"
        description="Expansion, KG, the 2004 run, rebuild arcs, and the modern resurgence—milestones in one scroll."
        href="/timeline"
        cta="Open timeline"
      />
      <FeatureCard
        accent="emerald"
        title="About the data"
        description="What is live from NBA.com, what is static JSON, how caching and cron work, and known limitations."
        href="/about-data"
        cta="Read data notes"
      />
      <FeatureCard
        accent="violet"
        title="Franchise trivia"
        description="1,000+ multiple-choice prompts when stats load—pairwise season duels, chronology, blurbs, memes, coaches, eras, timeline, and more."
        href="/trivia"
        cta="Play trivia"
      />
      <FeatureCard
        accent="amber"
        title="Memes & lore"
        description="Recurring jokes, nicknames, and internet shorthand Wolves fans recognize—curated text list, not image macros."
        href="/memes"
        cta="Browse memes"
      />
      <FeatureCard
        accent="sky"
        title="Latest snapshot"
        description={
          latest
            ? `Most recent team year in the cache: ${latest.seasonLabel} at ${latest.wins}-${latest.losses}${
                latest.playoffWins + latest.playoffLosses > 0
                  ? `, playoffs ${latest.playoffWins}-${latest.playoffLosses}`
                  : ""
              }.`
            : "Season aggregates are not available right now (NBA.com may be unreachable). Try again shortly."
        }
        href="/seasons"
        cta="View all seasons"
        footer={
          <span>
            Figures refresh from NBA.com on a cache window; use Vercel Cron to invalidate aggregates
            overnight.
          </span>
        }
      />
    </div>
  );
}
