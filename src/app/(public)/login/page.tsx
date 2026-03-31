"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { signInGoogle, signInEmail, signUpEmail } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    try {
      await signInGoogle();
      router.replace("/dashboard");
    } catch {
      toast.error("Google sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmail(mode: "signin" | "signup") {
    setLoading(true);
    try {
      if (mode === "signin") {
        await signInEmail(email, password);
      } else {
        await signUpEmail(email, password);
      }
      router.replace("/dashboard");
    } catch {
      toast.error(mode === "signin" ? "Could not sign in." : "Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-4 py-8">
      <Card className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Dog Log</p>
          <h1 className="text-2xl font-bold">Sign in to start logging dogs</h1>
        </div>

        <Button onClick={handleGoogle} isLoading={loading} className="w-full">
          Continue with Google
        </Button>

        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void handleEmail("signin");
          }}
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button type="submit" isLoading={loading} className="w-full">
              Email Sign In
            </Button>
            <Button
              type="button"
              isLoading={loading}
              className="w-full bg-zinc-900 text-zinc-50 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
              onClick={() => void handleEmail("signup")}
            >
              Create Account
            </Button>
          </div>
        </form>
        <p className="text-xs text-zinc-500">
          By using Dog Log you agree to keep it fun, truthful, and at least a little competitive.
        </p>
      </Card>
      <Link href="/" className="mt-4 text-center text-sm text-zinc-500">
        Back to home
      </Link>
    </main>
  );
}

