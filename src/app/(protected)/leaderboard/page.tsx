"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getLeaderboardForYear } from "@/lib/firebase/firestore";
import { getCurrentYear } from "@/lib/utils/dates";
import type { YearlyTotal } from "@/types/models";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<YearlyTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const year = getCurrentYear();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        setItems(await getLeaderboardForYear(year));
      } catch {
        toast.error("Could not load leaderboard.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [year]);

  return (
    <main className="space-y-3 pt-1">
      <Card className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Dog Log</p>
        <h1 className="text-xl font-black sm:text-2xl">{year} Leaderboard</h1>
        <p className="text-sm text-zinc-500">Most dogs wins. Ties break by latest log, then display name.</p>
      </Card>
      <Card className="px-3 py-3">
        {loading ? (
          <p className="py-4 text-sm text-zinc-500">Loading rankings...</p>
        ) : (
          <LeaderboardList items={items} currentUserId={user?.uid} />
        )}
      </Card>
    </main>
  );
}



