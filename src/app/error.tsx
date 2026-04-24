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
    <div className="flex min-h-full flex-col items-center justify-center bg-zinc-950 px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-white">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-zinc-400">
        The NBA stats feed can occasionally fail or time out. Try again in a moment.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white outline-offset-2 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
      >
        Retry
      </button>
    </div>
  );
}
