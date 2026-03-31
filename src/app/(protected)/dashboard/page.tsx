"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CumulativeChart } from "@/components/dashboard/cumulative-chart";
import { RecentLogs } from "@/components/dashboard/recent-logs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getCurrentYear } from "@/lib/utils/dates";
import { getDashboardData } from "@/services/dashboard";
import type { DogLog, UserProfile, YearlyTotal } from "@/types/models";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentLogs, setRecentLogs] = useState<DogLog[]>([]);
  const [chartData, setChartData] = useState<{ dateLabel: string; total: number }[]>([]);
  const [board, setBoard] = useState<YearlyTotal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const uid = user.uid;

    async function load() {
      setLoading(true);
      try {
        const data = await getDashboardData(uid);
        setProfile(data.profile);
        setRecentLogs(data.recentLogs);
        setChartData(data.chartData);
        setBoard(data.board);
      } catch {
        toast.error("Could not load dashboard right now.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [user]);

  const rank = useMemo(() => {
    if (!user || !board.length) {
      return null;
    }
    const index = board.findIndex((entry) => entry.userId === user.uid);
    return index === -1 ? null : index + 1;
  }, [board, user]);

  if (loading) {
    return <p className="pt-10 text-center text-sm text-zinc-500">Loading scoreboard...</p>;
  }

  return (
    <main className="space-y-4">
      <Card className="space-y-2">
        <p className="text-sm text-zinc-500">Hey, {profile?.displayName || "Top Dog"}</p>
        <p className="text-4xl font-black">{profile?.currentYearTotal ?? 0}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">hot dogs in {getCurrentYear()}</p>
        <p className="text-xs text-zinc-500">Rank: {rank ? `#${rank}` : "Unranked yet"}</p>
        <Link href="/log" className="block pt-2">
          <Button className="w-full text-base">I ate a dog</Button>
        </Link>
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold">Progress this year</h2>
        <CumulativeChart data={chartData} />
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold">Recent entries</h2>
        <RecentLogs logs={recentLogs} />
      </Card>
    </main>
  );
}

