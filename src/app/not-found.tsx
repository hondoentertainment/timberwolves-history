import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 text-sm text-zinc-400">
        That route does not exist or the resource is unavailable.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300"
      >
        Go home
      </Link>
    </div>
  );
}
