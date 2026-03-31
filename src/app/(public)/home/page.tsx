import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-between px-4 py-8">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Dog Log</p>
        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Track your hot dog dominance.
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-300">
          Log every dog, upload the proof, and see who rules the year.
        </p>
      </section>

      <Card className="my-6 space-y-3">
        <p className="text-sm font-semibold">What you get</p>
        <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
          <li>Yearly leaderboard</li>
          <li>Photo proof for every dog</li>
          <li>One-tap logging from your phone</li>
          <li>Personal progress charts</li>
        </ul>
      </Card>

      <section className="space-y-3">
        <Link href="/login" className="block">
          <Button className="w-full">Get Started</Button>
        </Link>
        <Link href="/leaderboard" className="block">
          <Button className="w-full bg-zinc-900 text-zinc-50 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white">
            View Leaderboard
          </Button>
        </Link>
      </section>
    </main>
  );
}


