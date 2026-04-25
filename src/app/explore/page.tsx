import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { SectionHeader, SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
import { getAllExplorerPaths } from "@/lib/journeys";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Interactive, cited Wolves History explainers for franchise turning points and roster-building arcs.",
};

export default function ExploreIndexPage() {
  const explorers = getAllExplorerPaths();

  return (
    <>
      <PageHeader
        eyebrow="Interactive reads"
        title="Explore Wolves turning points"
        description="Guided, source-aware explainers for fans who want a richer path than a table but a tighter read than a long essay."
        actions={
          <Link
            href="/browse"
            className={`inline-flex min-h-11 items-center rounded-xl border border-zinc-700/90 bg-zinc-950/40 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-zinc-600 hover:bg-zinc-900/70 ${premiumLinkFocus}`}
          >
            Back to Browse
          </Link>
        }
      />
      <section aria-labelledby="interactive-reads">
        <SectionHeader
          id="interactive-reads"
          title="Featured explainers"
          description="Each path is static and editorially scoped, with links back into seasons, eras, and source context."
        />
        <ul className="grid gap-4 md:grid-cols-3">
          {explorers.map((explorer) => (
            <li key={explorer.href}>
              <SurfaceCard className="group h-full p-5 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700/90 hover:bg-zinc-900/50">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400/80">
                  {explorer.eyebrow}
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
                  <Link
                    href={explorer.href}
                    className={`text-emerald-300 hover:text-emerald-200 ${premiumLinkFocus}`}
                  >
                    {explorer.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{explorer.description}</p>
                <p className="mt-5 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-300">
                  Open walkthrough <span aria-hidden>→</span>
                </p>
              </SurfaceCard>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
