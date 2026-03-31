import { clsx } from "clsx";

import type { YearlyTotal } from "@/types/models";

type Props = {
  items: YearlyTotal[];
  currentUserId?: string;
};

export function LeaderboardList({ items, currentUserId }: Props) {
  if (!items.length) {
    return <p className="text-sm text-zinc-500">No leaderboard entries yet. Be the inaugural legend.</p>;
  }

  return (
    <ol className="space-y-2">
      {items.map((entry, index) => {
        const isCurrent = entry.userId === currentUserId;
        return (
          <li
            key={entry.id}
            className={clsx(
              "flex items-center justify-between rounded-xl border px-3 py-2.5",
              isCurrent
                ? "border-amber-400 bg-amber-50 dark:border-amber-400 dark:bg-amber-950/30"
                : "border-zinc-200 dark:border-zinc-800",
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="w-8 text-sm font-bold text-zinc-500">#{index + 1}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">{entry.displayName}</p>
                {isCurrent ? <p className="text-xs text-amber-700 dark:text-amber-200">You</p> : null}
              </div>
            </div>
            <p className="pl-2 text-base font-black text-zinc-900 dark:text-zinc-50 sm:text-lg">{entry.total}</p>
          </li>
        );
      })}
    </ol>
  );
}


