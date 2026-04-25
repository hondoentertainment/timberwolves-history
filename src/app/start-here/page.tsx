import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { SectionHeader, SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
import { getAllExplorerPaths, getAllJourneys } from "@/lib/journeys";

export const metadata: Metadata = {
  title: "Start here",
  description:
    "A first-visit guide to Wolves History: what to read, where to browse, and how to jump from stories to stats.",
};

export default function StartHerePage() {
  const journeys = getAllJourneys();
  const explorers = getAllExplorerPaths();

  return (
    <>
      <PageHeader
        eyebrow="First visit"
        title="Start with the Wolves story, then choose your lane"
        description="This archive is built for fans who want context: the eras, the people, the records, and the turning points that explain why each chapter mattered."
        actions={
          <Link
            href="/browse"
            className={`inline-flex min-h-11 items-center rounded-xl border border-zinc-700/90 bg-zinc-950/40 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-zinc-600 hover:bg-zinc-900/70 ${premiumLinkFocus}`}
          >
            Browse everything
          </Link>
        }
      />

      <section aria-labelledby="choose-path" className="mb-12">
        <SectionHeader
          id="choose-path"
          title="Choose a path"
          description="Each trail is designed to be readable in one sitting, with links into deeper stats and profiles when you want them."
        />
        <ol className="grid gap-4 md:grid-cols-2">
          {journeys.map((journey) => (
            <li key={journey.id}>
              <SurfaceCard className="group h-full p-5 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700/90 hover:bg-zinc-900/50">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400/80">
                  {journey.audience}
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
                  <Link
                    href={journey.href}
                    className={`text-emerald-300 hover:text-emerald-200 ${premiumLinkFocus}`}
                  >
                    {journey.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{journey.description}</p>
                {journey.relatedLinks.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {journey.relatedLinks.map((link) => (
                      <Link
                        key={`${journey.id}-${link.href}`}
                        href={link.href}
                        className={`rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 ${premiumLinkFocus}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </SurfaceCard>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="interactive-primer">
        <SectionHeader
          id="interactive-primer"
          title="Prefer a guided walkthrough?"
          description="These interactive reads explain major franchise pivots without asking you to parse a full table first."
        />
        <ul className="grid gap-4 md:grid-cols-3">
          {explorers.map((explorer) => (
            <li key={explorer.href}>
              <SurfaceCard className="h-full p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {explorer.eyebrow}
                </p>
                <Link
                  href={explorer.href}
                  className={`mt-3 block text-lg font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}
                >
                  {explorer.title}
                </Link>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{explorer.description}</p>
              </SurfaceCard>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
