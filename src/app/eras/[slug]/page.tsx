import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentGraphRelated } from "@/components/ContentGraphRelated";
import { ProfileHero, ProfileLayout, ProfileSection } from "@/components/profile";
import { RelatedReading, type RelatedReadingLink } from "@/components/RelatedReading";
import { getCoachById } from "@/lib/coaches";
import { erasAttribution, getEraBySlug } from "@/lib/eras";
import { getLongreadBySlug } from "@/lib/longreads";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const era = getEraBySlug(slug);
  if (!era) return { title: "Era" };
  return {
    title: era.title,
    description: `${era.title} (${era.yearsLabel}) — Minnesota Timberwolves historical overview and links.`,
    openGraph: {
      title: era.title,
      description: `${era.title} (${era.yearsLabel}) — Wolves History era hub.`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: era.title,
      description: `${era.title} (${era.yearsLabel}) — Wolves History.`,
    },
  };
}

export default async function EraPage({ params }: PageProps) {
  const { slug } = await params;
  const era = getEraBySlug(slug);
  if (!era) notFound();

  const storyLinks: RelatedReadingLink[] = [];
  for (const storySlug of era.relatedStorySlugs ?? []) {
    const s = getLongreadBySlug(storySlug);
    if (s) {
      storyLinks.push({
        href: `/stories/${s.slug}`,
        label: s.title,
        hint: "Flagship essay",
      });
    }
  }

  return (
    <ProfileLayout>
      <ProfileHero
        role="Era hub"
        title={era.title}
        subtitle={era.yearsLabel}
        intro={
          <div className="space-y-3">
            {era.intro.map((p) => (
              <p key={`${slug}-${p}`}>{p}</p>
            ))}
            {era.lastReviewed ? (
              <p className="text-xs text-zinc-500">Hub last reviewed {era.lastReviewed}.</p>
            ) : null}
            <p className="text-xs text-zinc-500">{erasAttribution()}</p>
          </div>
        }
      />
      <ProfileSection id="seasons" title="Season snapshots" description="Jump into season pages with rosters and records.">
        <ul className="flex flex-wrap gap-2">
          {era.highlightSeasonIds.map((sid) => (
            <li key={sid}>
              <Link
                href={`/seasons/${encodeURIComponent(sid)}`}
                className="inline-block rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-emerald-400 hover:border-emerald-700 hover:text-emerald-300"
              >
                {sid}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-zinc-500">
          <Link href="/seasons" className="text-emerald-400 hover:text-emerald-300">
            Browse all seasons →
          </Link>
        </p>
      </ProfileSection>
      {storyLinks.length ? (
        <ProfileSection id="essays" title="Essays" description="Longer editorial pieces that intersect with this era.">
          <RelatedReading links={storyLinks} title="" />
        </ProfileSection>
      ) : null}
      <ProfileSection id="people" title="People" description="Spotlight profiles and coaches tied to this era.">
        {era.spotlightPlayers.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No spotlight players listed for this hub yet—browse the{" "}
            <Link href="/players" className="text-emerald-400 hover:text-emerald-300">
              all-time players index
            </Link>{" "}
            for roster lineage.
          </p>
        ) : null}
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          {era.spotlightPlayers.map((sp) => (
            <Link
              key={sp.playerId}
              href={`/players/${sp.playerId}`}
              className="inline-flex rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-emerald-400 hover:border-emerald-700 hover:text-emerald-300"
            >
              {sp.label}
            </Link>
          ))}
          {era.relatedCoachIds.map((cid) => {
            const coach = getCoachById(cid);
            return (
              <Link
                key={cid}
                href={`/coaches/${cid}`}
                className="inline-flex rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-emerald-400 hover:border-emerald-700 hover:text-emerald-300"
              >
                Coach · {coach?.name ?? cid}
              </Link>
            );
          })}
        </div>
      </ProfileSection>
      <ContentGraphRelated
        graph={era.contentGraph}
        playerLabels={Object.fromEntries(era.spotlightPlayers.map((p) => [String(p.playerId), p.label]))}
        idPrefix={`era-graph-${slug}`}
      />
      {era.sources.length ? (
        <ProfileSection id="sources" title="Sources" description="External references for further reading (editorial hub only).">
          <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
            {era.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  className="text-emerald-400 underline-offset-2 hover:underline"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </ProfileSection>
      ) : null}
      <p className="text-sm text-zinc-500">
        <Link href="/eras" className="text-emerald-400 hover:text-emerald-300">
          ← All eras
        </Link>
      </p>
    </ProfileLayout>
  );
}
