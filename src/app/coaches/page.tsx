import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { getAllCoaches } from "@/lib/coaches";

export default function CoachesPage() {
  const coaches = getAllCoaches();
  return (
    <>
      <PageHeader
        title="Head coaches"
        description="Register-style list derived from public Wikipedia summaries (April 2026). It is not a live NBA.com coaching feed; use it for historical context alongside NBA stats elsewhere on this site."
      />
      <ul className="space-y-4">
        {coaches.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3"
          >
            <h2 className="text-lg font-semibold text-white">
              <Link
                href={`/coaches/${c.id}`}
                className="text-emerald-400 outline-offset-2 hover:text-emerald-300 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/80"
              >
                {c.name}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {c.tenures
                .map((t) => `${t.from}–${t.to}`)
                .join(" · ")}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
