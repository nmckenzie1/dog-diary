"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { ImageUploader } from "@/components/log/image-uploader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { getUserProfile } from "@/lib/firebase/firestore";
import { submitDogLog } from "@/services/logs";

function nowForInput() {
  const date = new Date();
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default function LogPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [loggedAt, setLoggedAt] = useState(nowForInput());
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loggedAtDate = useMemo(() => new Date(loggedAt), [loggedAt]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!user) {
      return;
    }

    if (!photo) {
      toast.error("Proof photo required.");
      return;
    }

    if (Number.isNaN(loggedAtDate.getTime())) {
      toast.error("Please enter a valid date and time.");
      return;
    }

    setSubmitting(true);

    try {
      const profile = await getUserProfile(user.uid);
      await submitDogLog({
        userId: user.uid,
        displayName: profile?.displayName || user.displayName || "Top Dog",
        photoFile: photo,
        input: {
          quantity,
          note,
          loggedAt: loggedAtDate,
        },
      });
      toast.success("Dog logged. The board has been notified.");
      router.replace("/dashboard");
    } catch (error) {
      const detail = error instanceof Error ? ` ${error.message}` : "";
      toast.error(`Could not submit log.${detail}`.trim());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold">I ate a dog</h1>
        <p className="mt-1 text-sm text-zinc-500">Proof required. No photo, no glizzy credit.</p>
      </Card>

      <Card>
        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <div>
            <Label htmlFor="loggedAt">Date and time</Label>
            <Input
              id="loggedAt"
              type="datetime-local"
              required
              value={loggedAt}
              onChange={(event) => setLoggedAt(event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={20}
              required
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
          </div>

          <div>
            <Label htmlFor="photo">Photo proof</Label>
            <ImageUploader file={photo} onFileChange={setPhoto} />
          </div>

          <Button type="submit" className="w-full text-base" isLoading={submitting}>
            Submit entry
          </Button>
        </form>
      </Card>
    </main>
  );
}

