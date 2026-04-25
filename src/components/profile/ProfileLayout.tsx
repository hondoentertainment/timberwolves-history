import { Children, type ReactNode } from "react";

import { ChipLink } from "@/components/PremiumUX";

type ProfileLayoutProps = {
  children: ReactNode;
  navItems?: { href: string; label: string }[];
};

export function ProfileLayout({ children, navItems = [] }: ProfileLayoutProps) {
  const childItems = Children.toArray(children);
  const [hero, ...sections] = childItems;

  return (
    <div className="space-y-12 md:space-y-14">
      {hero}
      {navItems.length ? (
        <nav
          aria-label="On this page"
          className="sticky top-[8.5rem] z-20 -mx-4 overflow-x-auto border-y border-zinc-800/70 bg-zinc-950/82 px-4 py-3 backdrop-blur-xl [scrollbar-width:none] md:top-[9.25rem] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex min-w-max items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
              On this page
            </span>
            {navItems.map((item) => (
              <ChipLink key={item.href} href={item.href}>
                {item.label}
              </ChipLink>
            ))}
          </div>
        </nav>
      ) : null}
      {sections}
    </div>
  );
}
