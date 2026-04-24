import Link from "next/link";
import { notFound } from "next/navigation";

import { EditorialProse } from "@/components/EditorialProse";
import { ProfileHero, ProfileLayout, ProfileSection } from "@/components/profile";
import { StatTable } from "@/components/StatTable";
import { coachesFileAttribution, getCoachById } from "@/lib/coaches";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ coachId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { coachId } = await params;
  const coach = getCoachById(coachId);
  if (!coach) return { title: "Coach" };
  return {
    title: coach.name,
    description: `${coach.name} — Minnesota Timberwolves head coaching profile (register + tenure table).`,
  };
}

export default async function CoachDetailPage({ params }: PageProps) {
  const { coachId } = await params;
  const coach = getCoachById(coachId);
  if (!coach) notFound();

  const rows = coach.tenures.map((t) => [
    `${t.from}–${t.to}`,
    t.gc,
    t.w,
    t.l,
    t.playoffGc ? `${t.playoffW}-${t.playoffL}` : "—",
    t.note ?? "—",
  ]);

  return (
    <ProfileLayout>
      <ProfileHero
        role="Head coach"
        title={coach.name}
        intro={
          <p>
            {coachesFileAttribution()} For live roster-era stats, use NBA.com; this page
            foregrounds the static register table.
          </p>
        }
      />
      {coach.bio?.length ? (
        <ProfileSection
          id="story"
          title="Story"
          description="Editorial register notes; wins/losses table remains the factual anchor."
        >
          <EditorialProse
            title="Franchise context"
            attribution={coachesFileAttribution()}
            paragraphs={coach.bio}
          />
        </ProfileSection>
      ) : null}
      <ProfileSection
        id="tenures"
        title="Timberwolves tenures"
        description="Games and wins/losses are from the curated register, not a live NBA feed."
      >
        <StatTable
          caption={`${coach.name} Timberwolves tenures`}
          columns={["Tenure", "Games", "W", "L", "Playoffs (W-L)", "Notes"]}
          rows={rows}
        />
      </ProfileSection>
      <p className="text-sm text-zinc-500">
        <Link href="/coaches" className="text-emerald-400 hover:text-emerald-300">
          ← All coaches
        </Link>
      </p>
    </ProfileLayout>
  );
}
