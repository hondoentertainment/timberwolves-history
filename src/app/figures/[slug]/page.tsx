import Link from "next/link";
import { notFound } from "next/navigation";

import { EditorialProse } from "@/components/EditorialProse";
import { ProfileHero, ProfileLayout, ProfileSection } from "@/components/profile";
import { figuresAttribution, getAllFigures, getFigureBySlug } from "@/lib/figures";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllFigures().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const f = getFigureBySlug(slug);
  if (!f) return { title: "Figure" };
  return {
    title: f.title,
    description: `${f.role} — ${f.yearsLabel}. Editorial capsule on Wolves History.`,
  };
}

export default async function FigureDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const f = getFigureBySlug(slug);
  if (!f) notFound();

  return (
    <ProfileLayout>
      <ProfileHero
        role={f.role}
        title={f.title}
        subtitle={f.yearsLabel}
        intro={<p className="text-xs text-zinc-500">{figuresAttribution()}</p>}
      />
      <ProfileSection id="capsule" title="Capsule">
        <EditorialProse
          title="Overview"
          attribution={figuresAttribution()}
          paragraphs={f.paragraphs}
          sources={f.sources}
        />
      </ProfileSection>
      <p className="text-sm text-zinc-500">
        <Link href="/figures" className="text-emerald-400 hover:text-emerald-300">
          ← All figures
        </Link>
      </p>
    </ProfileLayout>
  );
}
