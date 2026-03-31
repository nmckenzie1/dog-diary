"use client";

import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { auth } from "@/lib/firebase/client";
import {
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
} from "@/lib/firebase/auth";
import { ensureUserProfile } from "@/lib/firebase/firestore";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        await ensureUserProfile(nextUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInGoogleHandler = useCallback(async () => {
    const response = await signInWithGoogle();
    await ensureUserProfile(response.user);
  }, []);

  const signInEmailHandler = useCallback(async (email: string, password: string) => {
    const response = await signInWithEmail(email, password);
    await ensureUserProfile(response.user);
  }, []);

  const signUpEmailHandler = useCallback(async (email: string, password: string) => {
    const response = await signUpWithEmail(email, password);
    await ensureUserProfile(response.user);
  }, []);

  const logoutHandler = useCallback(async () => {
    await signOutUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signInGoogle: signInGoogleHandler,
      signInEmail: signInEmailHandler,
      signUpEmail: signUpEmailHandler,
      logout: logoutHandler,
    }),
    [loading, logoutHandler, signInEmailHandler, signInGoogleHandler, signUpEmailHandler, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

