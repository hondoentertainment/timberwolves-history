import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/seasons", label: "Seasons" },
  { href: "/players", label: "Players" },
  { href: "/coaches", label: "Coaches" },
  { href: "/eras", label: "Eras" },
  { href: "/timeline", label: "Timeline" },
  { href: "/memes", label: "Memes" },
  { href: "/about-data", label: "Data" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-zinc-900"
      >
        Skip to content
      </a>
      <header
        aria-label="Site"
        className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="group rounded-md outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/80"
          >
            <span className="block text-lg font-semibold tracking-tight text-white">
              Wolves History
            </span>
            <span className="text-xs text-zinc-500 group-hover:text-zinc-400">
              Minnesota Timberwolves franchise archive
            </span>
          </Link>
          <nav aria-label="Primary" className="flex flex-wrap gap-2 sm:gap-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 outline-offset-2 hover:bg-zinc-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        {children}
      </main>
      <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 py-8 text-sm text-zinc-500">
        <div className="mx-auto max-w-6xl space-y-3 px-4">
          <p>
            Player and team statistics are fetched server-side from{" "}
            <a
              className="text-emerald-400 underline-offset-2 outline-offset-2 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/80"
              href="https://www.nba.com/stats"
            >
              NBA.com Stats
            </a>{" "}
            for personal, non-commercial reference. This site is not affiliated with the NBA
            or the Minnesota Timberwolves.
          </p>
          <p>
            Coaching summaries on coach pages combine NBA roster-era stats with a static
            head-coach register derived from public sources (see each page).
          </p>
          <p>
            <Link
              className="text-emerald-400 underline-offset-2 outline-offset-2 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/80"
              href="/about-data"
            >
              About the data
            </Link>{" "}
            — sources, static JSON, caching, and limitations.
          </p>
        </div>
      </footer>
    </div>
  );
}
