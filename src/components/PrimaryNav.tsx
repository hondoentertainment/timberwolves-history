"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/at-a-glance", label: "At a Glance" },
  { href: "/browse", label: "Browse" },
  { href: "/seasons", label: "Seasons" },
  { href: "/players", label: "Players" },
  { href: "/players/leaders", label: "Leaders" },
  { href: "/coaches", label: "Coaches" },
  { href: "/eras", label: "Eras" },
  { href: "/timeline", label: "Timeline" },
  { href: "/memes", label: "Memes" },
  { href: "/stories", label: "Stories" },
  { href: "/trivia", label: "Trivia" },
  { href: "/search", label: "Search" },
] as const;

const adminNav = { href: "/admin", label: "Admin" } as const;

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
    <nav aria-label="Primary" className="flex flex-wrap gap-1 sm:gap-1.5">
      {items.map((item) => {
        const active = navItemActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "rounded-lg px-3 py-2 text-sm font-medium outline-offset-2 transition-colors duration-200",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70",
              active
                ? "bg-emerald-500/15 text-emerald-100 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.35)]"
                : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
