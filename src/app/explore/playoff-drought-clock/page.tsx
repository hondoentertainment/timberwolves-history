import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";

import { DroughtClockExplorer } from "./DroughtClockExplorer";

export const metadata: Metadata = {
  title: "Playoff drought clock explorer",
  description:
    "Static STORY-008 vignette: editorial steps from themed seasons to the franchise timeline to the 2017–18 playoff return explorer—no live APIs.",
};

export default function ExplorePlayoffDroughtClockPage() {
  return (
    <>
      <PageHeader
        title="Playoff drought clock explorer"
        description="A third STORY-008-style shell: three steps, no live APIs. The “drought” here is the famous fourteen-season gap between postseason berths—this route only points to structured and editorial pages, not a running counter."
      />
      <DroughtClockExplorer />
      <section className="mt-10 space-y-3 text-sm text-zinc-400">
        <h2 className="text-base font-semibold text-white">Sources</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <Link href="/seasons?theme=playoff-return" className="text-emerald-400 hover:text-emerald-300">
              /seasons?theme=playoff-return
            </Link>{" "}
            — seasons index with the playoff-return theme from season-stories.
          </li>
          <li>
            <Link href="/timeline" className="text-emerald-400 hover:text-emerald-300">
              /timeline
            </Link>{" "}
            — franchise timeline.
          </li>
          <li>
            <Link href="/explore/2017-18-playoff-return" className="text-emerald-400 hover:text-emerald-300">
              /explore/2017-18-playoff-return
            </Link>{" "}
            — related STORY-008 explorer with curated notes and season links.
          </li>
        </ul>
      </section>
      <p className="mt-8 text-sm text-zinc-500">
        <Link href="/browse" className="text-emerald-400 hover:text-emerald-300">
          ← Browse the archive
        </Link>
      </p>
    </>
  );
}
