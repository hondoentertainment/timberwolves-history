"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-8 shadow-xl shadow-black/30 ring-1 ring-white/[0.04]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400/80">Error</p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-zinc-400">
          The NBA stats feed can occasionally fail or time out. Try again in a moment.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 w-full rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/35 outline-offset-2 transition hover:from-emerald-400 hover:to-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300/80 active:translate-y-px"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
