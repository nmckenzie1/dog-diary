"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CumulativeChart } from "@/components/dashboard/cumulative-chart";
import { RecentLogs } from "@/components/dashboard/recent-logs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { getLogsForYear, getUserProfile, updateUserProfile } from "@/lib/firebase/firestore";
import { buildCumulativeChart } from "@/lib/utils/charts";
import { getCurrentYear } from "@/lib/utils/dates";
import type { DogLog, UserProfile } from "@/types/models";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<DogLog[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
	if (!user?.uid) {
	  return;
	}
	const uid = user.uid;

	async function load() {
	  try {
		const year = getCurrentYear();
		const [nextProfile, nextLogs] = await Promise.all([
		  getUserProfile(uid),
		  getLogsForYear(uid, year),
		]);

		setProfile(nextProfile);
		setDisplayName(nextProfile?.displayName || "");
		setLogs([...nextLogs].reverse());
	  } catch {
		toast.error("Could not load your profile.");
	  }
	}

	void load();
  }, [user]);

  async function saveDisplayName() {
	if (!user || !displayName.trim()) {
	  toast.error("Display name cannot be empty.");
	  return;
	}

	setSaving(true);
	try {
	  await updateUserProfile(user.uid, { displayName: displayName.trim() });
	  setProfile((current) => (current ? { ...current, displayName: displayName.trim() } : current));
	  toast.success("Profile updated.");
	} catch {
	  toast.error("Could not update your profile.");
	} finally {
	  setSaving(false);
	}
  }

  return (
	<main className="space-y-4">
	  <Card className="space-y-4">
		<div>
		  <h1 className="text-xl font-bold">Your profile</h1>
		  <p className="text-sm text-zinc-500">Name yourself for leaderboard glory.</p>
		</div>

		<div>
		  <Label htmlFor="displayName">Display name</Label>
		  <Input id="displayName" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
		</div>

		<div className="grid grid-cols-2 gap-2">
		  <Button onClick={saveDisplayName} isLoading={saving}>
			Save profile
		  </Button>
		  <Button
			className="bg-zinc-900 text-zinc-50 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
			onClick={() => void logout()}
		  >
			Log out
		  </Button>
		</div>
	  </Card>

	  <Card>
		<h2 className="mb-2 text-sm font-semibold">{getCurrentYear()} progress</h2>
		<CumulativeChart data={buildCumulativeChart([...logs].reverse())} />
	  </Card>

	  <Card>
		<h2 className="mb-2 text-sm font-semibold">History</h2>
		<RecentLogs logs={logs} />
	  </Card>

	  <Card>
		<p className="text-sm text-zinc-500">Account: {profile?.email || user?.email || "Unknown"}</p>
	  </Card>
	</main>
  );
}

