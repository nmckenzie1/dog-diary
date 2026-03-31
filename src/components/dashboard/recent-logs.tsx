import Image from "next/image";

import { formatReadableDateTime } from "@/lib/utils/dates";
import type { DogLog } from "@/types/models";

type Props = {
  logs: DogLog[];
};

export function RecentLogs({ logs }: Props) {
  if (!logs.length) {
    return <p className="text-sm text-zinc-500">No entries yet. Tap I ate a dog to start the year strong.</p>;
  }

  return (
    <ul className="space-y-3">
      {logs.map((log) => (
        <li key={log.id} className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2 dark:border-zinc-800">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
            <Image src={log.imageUrl} alt="Hot dog proof" fill sizes="56px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">+{log.quantity} dog{log.quantity > 1 ? "s" : ""}</p>
            <p className="truncate text-xs text-zinc-500">{formatReadableDateTime(log.loggedAt.toDate())}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}



