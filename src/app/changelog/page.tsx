import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { changelogAttribution, getChangelogEntries } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Substantive updates to Wolves History content, routes, and data layers.",
};

export default function ChangelogPage() {
  const entries = getChangelogEntries();
  return (
    <>
      <PageHeader
        title="Changelog"
        description={`${changelogAttribution()} Dependency-only bumps are not listed here.`}
      />
      <ol className="space-y-10 border-l border-zinc-800 pl-6">
        {entries.map((e) => (
          <li key={e.date + e.title} className="relative">
            <span className="absolute -left-[calc(0.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500/80 ring-4 ring-zinc-950" />
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{e.date}</p>
            <h2 className="mt-1 text-lg font-semibold text-white">{e.title}</h2>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm leading-relaxed text-zinc-400">
              {e.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
}
