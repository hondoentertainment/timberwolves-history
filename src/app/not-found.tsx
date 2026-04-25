import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">404</p>
      <h1 className="mt-3 max-w-md text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-zinc-400">
        That route does not exist or the resource is unavailable.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/35 outline-offset-2 transition hover:from-emerald-400 hover:to-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300/80"
      >
        Back to home
      </Link>
    </div>
  );
}
