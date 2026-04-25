"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Home", priority: "primary" },
  { href: "/browse", label: "Browse", priority: "primary" },
  { href: "/seasons", label: "Seasons", priority: "primary" },
  { href: "/players", label: "Players", priority: "primary" },
  { href: "/eras", label: "Eras", priority: "primary" },
  { href: "/stories", label: "Stories", priority: "primary" },
  { href: "/explore", label: "Explore", priority: "primary" },
  { href: "/search", label: "Search", priority: "cta" },
  { href: "/at-a-glance", label: "At a Glance", priority: "secondary" },
  { href: "/players/leaders", label: "Leaders", priority: "secondary" },
  { href: "/coaches", label: "Coaches", priority: "secondary" },
  { href: "/timeline", label: "Timeline", priority: "secondary" },
  { href: "/memes", label: "Memes", priority: "secondary" },
  { href: "/trivia", label: "Trivia", priority: "secondary" },
] as const;

const adminNav = { href: "/admin", label: "Admin", priority: "secondary" } as const;

function navItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (pathname === href || pathname === `${href}/`) return true;
  /** `/players` is index-only; detail URLs use `/players/[id]`. */
  if (href === "/players") return false;
  return pathname.startsWith(`${href}/`);
}

export function PrimaryNav() {
  const pathname = usePathname() ?? "";
  const [showAdmin, setShowAdmin] = useState(false);
  const items = showAdmin ? [...nav, adminNav] : nav;

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/me", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        if (
          !cancelled &&
          data &&
          typeof data === "object" &&
          "isAdmin" in data &&
          data.isAdmin === true
        ) {
          setShowAdmin(true);
        }
      })
      .catch(() => {
        if (!cancelled) setShowAdmin(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="flex min-w-max snap-x items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.035] p-1 shadow-inner shadow-white/5 lg:min-w-0 lg:flex-wrap lg:justify-end"
    >
      {items.map((item) => {
        const active = navItemActive(pathname, item.href);
        const isSecondary = item.priority === "secondary";
        const isCta = item.priority === "cta";
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "relative snap-start whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold outline-offset-2 transition duration-200",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70",
              active
                ? "bg-emerald-400/15 text-emerald-50 shadow-[inset_0_0_0_1px_rgba(110,231,183,0.38),0_8px_22px_-16px_rgba(52,211,153,0.9)]"
                : isCta
                  ? "bg-white/[0.07] text-zinc-100 hover:bg-emerald-400/12 hover:text-emerald-50"
                  : isSecondary
                    ? "text-zinc-500 hover:bg-white/[0.055] hover:text-zinc-200"
                    : "text-zinc-300 hover:bg-white/[0.07] hover:text-zinc-100",
            ].join(" ")}
          >
            {item.label}
            {active ? (
              <span
                aria-hidden
                className="absolute inset-x-3 -bottom-1 h-px rounded-full bg-emerald-300/80"
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
