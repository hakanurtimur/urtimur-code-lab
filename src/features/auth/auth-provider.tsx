"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { getFirebaseClient, isFirebaseConfigured } from "@/lib/firebase/client";
import { studentEmailFromUsername } from "./student-identity";

export type AuthRole = "student" | "teacher" | null;

type AuthContextValue = {
  user: User | null;
  role: AuthRole;
  loading: boolean;
  firebaseReady: boolean;
  signInStudent: (username: string, password: string) => Promise<void>;
  signInTeacher: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readRole(user: User): Promise<AuthRole> {
  const token = await user.getIdTokenResult(true);
  return token.claims.role === "teacher"
    ? "teacher"
    : token.claims.role === "student"
      ? "student"
      : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const firebaseReady = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AuthRole>(null);
  const [loading, setLoading] = useState(firebaseReady);

  useEffect(() => {
    const firebase = getFirebaseClient();
    if (!firebase) return;

    let unsubscribeProfile: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(firebase.auth, async (nextUser) => {
      unsubscribeProfile?.();
      unsubscribeProfile = undefined;
      setUser(nextUser);

      if (!nextUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const nextRole = await readRole(nextUser);
        setRole(nextRole);

        if (nextRole === "student") {
          unsubscribeProfile = onSnapshot(
            doc(firebase.db, "students", nextUser.uid),
            (snapshot) => {
              if (!snapshot.exists() || snapshot.data().active === false) {
                void signOut(firebase.auth);
              }
            },
            () => undefined,
          );
        }
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeProfile?.();
      unsubscribeAuth();
    };
  }, []);

  const signInStudent = useCallback(async (username: string, password: string) => {
    const firebase = getFirebaseClient();
    if (!firebase) throw new Error("Firebase henüz yapılandırılmadı.");

    const credential = await signInWithEmailAndPassword(
      firebase.auth,
      studentEmailFromUsername(username),
      password,
    );
    const nextRole = await readRole(credential.user);
    if (nextRole !== "student") {
      await signOut(firebase.auth);
      throw new Error("Bu hesap öğrenci hesabı değil.");
    }

    const profile = await getDoc(doc(firebase.db, "students", credential.user.uid));
    if (!profile.exists() || profile.data().active === false) {
      await signOut(firebase.auth);
      throw new Error("Bu öğrenci hesabı aktif değil.");
    }

    setRole(nextRole);
  }, []);

  const signInTeacher = useCallback(async (email: string, password: string) => {
    const firebase = getFirebaseClient();
    if (!firebase) throw new Error("Firebase henüz yapılandırılmadı.");

    const credential = await signInWithEmailAndPassword(firebase.auth, email.trim(), password);
    const nextRole = await readRole(credential.user);
    if (nextRole !== "teacher") {
      await signOut(firebase.auth);
      throw new Error("Bu hesaba öğretmen yetkisi verilmemiş.");
    }

    setRole(nextRole);
  }, []);

  const signOutUser = useCallback(async () => {
    const firebase = getFirebaseClient();
    if (firebase) await signOut(firebase.auth);
    setRole(null);
    setUser(null);
  }, []);

  const getIdToken = useCallback(async () => user?.getIdToken() ?? null, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      firebaseReady,
      signInStudent,
      signInTeacher,
      signOutUser,
      getIdToken,
    }),
    [firebaseReady, getIdToken, loading, role, signInStudent, signInTeacher, signOutUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthSession AuthProvider içinde kullanılmalı.");
  return context;
}
