import "server-only";

import type { ReactNode } from "react";

import { getFranchiseSeasonsFetchedAtIso } from "@/lib/nba/queries";

function formatFetchedAt(iso: string | null | undefined): string | null {
  if (!iso || typeof iso !== "string") return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function humanRevalidate(seconds: number): string {
  if (seconds >= 3600 && seconds % 3600 === 0) {
    const h = seconds / 3600;
    return `${h} hour${h === 1 ? "" : "s"}`;
  }
  if (seconds >= 60 && seconds % 60 === 0) {
    const m = seconds / 60;
    return `${m} minute${m === 1 ? "" : "s"}`;
  }
  return `${seconds}s`;
}

type Props = {
  /** ISR window for this route (Next.js `revalidate`). */
  routeRevalidateSeconds: number;
  /** Short noun phrase for what revalidates, e.g. "This page" or "This roster index". */
  label: string;
  /** When true, reads franchise team-years cache timestamp when NBA.com path populated it. */
  includeTeamStatsFetchedAt?: boolean;
  children?: ReactNode;
};

/**
 * Compact transparency note for list routes (HIST-006 / DISC-004).
 */
export async function DataCadenceNote({
  routeRevalidateSeconds,
  label,
  includeTeamStatsFetchedAt = false,
  children,
}: Props) {
  const fetchedIso = includeTeamStatsFetchedAt ? await getFranchiseSeasonsFetchedAtIso() : null;
  const refreshed = formatFetchedAt(fetchedIso);
  const windowLabel = humanRevalidate(routeRevalidateSeconds);

  return (
    <aside className="mb-6 rounded-xl border border-zinc-800/80 bg-zinc-950/35 px-4 py-3 text-xs leading-relaxed text-zinc-500 shadow-sm shadow-black/10 ring-1 ring-white/[0.03]">
      <p className="font-semibold uppercase tracking-wide text-zinc-500">Data cadence</p>
      <p className="mt-1.5 text-zinc-400">
        <span className="text-zinc-500">{label}</span> revalidates every{" "}
        <span className="tabular-nums text-zinc-300">{windowLabel}</span>
        {includeTeamStatsFetchedAt ? (
          refreshed ? (
            <>
              . Franchise team-stats cache last refreshed{" "}
              <time dateTime={fetchedIso ?? undefined} className="tabular-nums text-zinc-400">
                {refreshed}
              </time>
              .
            </>
          ) : (
            <>
              . Franchise team-stats are serving from the bundled snapshot (no live refresh timestamp
              for this deploy).
            </>
          )
        ) : (
          "."
        )}
      </p>
      {children ? <div className="mt-2 space-y-2 text-zinc-500">{children}</div> : null}
    </aside>
  );
}
