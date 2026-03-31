"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Trophy, UserCircle2 } from "lucide-react";
import { clsx } from "clsx";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/log", label: "Log", icon: PlusCircle },
  { href: "/leaderboard", label: "Board", icon: Trophy },
  { href: "/profile", label: "You", icon: UserCircle2 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95"
      aria-label="Primary"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-4 gap-2">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "flex min-h-12 flex-col items-center justify-center rounded-xl text-xs font-medium",
                  active
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                    : "text-zinc-500 dark:text-zinc-400",
                )}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


