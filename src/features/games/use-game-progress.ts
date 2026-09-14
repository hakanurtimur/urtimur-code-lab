"use client";

import { doc, increment, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";

export type GameProgress = {
  gameId: string;
  completed: boolean;
  attempts: number;
  bestScore: number;
  total: number;
};

const EMPTY: GameProgress = { gameId: "", completed: false, attempts: 0, bestScore: 0, total: 0 };

export function useGameProgress(gameId: string) {
  const { user, role, firebaseReady } = useAuthSession();
  const [progress, setProgress] = useState<GameProgress>({ ...EMPTY, gameId });
  const remoteMode = firebaseReady && role === "student" && Boolean(user);

  useEffect(() => {
    if (!remoteMode || !user) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;
    return onSnapshot(
      doc(firebase.db, "students", user.uid, "games", gameId),
      (snapshot) => {
        const data = snapshot.data() ?? {};
        setProgress({
          gameId,
          completed: data.completed === true,
          attempts: typeof data.attempts === "number" ? data.attempts : 0,
          bestScore: typeof data.bestScore === "number" ? data.bestScore : 0,
          total: typeof data.total === "number" ? data.total : 0,
        });
      },
      () => undefined,
    );
  }, [gameId, remoteMode, user]);

  const saveResult = useCallback(async (score: number, total: number, completed: boolean) => {
    setProgress((current) => ({
      gameId,
      completed: current.completed || completed,
      attempts: current.attempts + 1,
      bestScore: Math.max(current.bestScore, score),
      total,
    }));

    if (!remoteMode || !user) return true;
    const firebase = getFirebaseClient();
    if (!firebase) return false;

    try {
      await setDoc(
        doc(firebase.db, "students", user.uid, "games", gameId),
        {
          gameId,
          completed: progress.completed || completed,
          attempts: increment(1),
          bestScore: Math.max(progress.bestScore, score),
          total,
          lastScore: score,
          lastAttemptAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ...(completed && !progress.completed ? { completedAt: serverTimestamp() } : {}),
        },
        { merge: true },
      );
      return true;
    } catch {
      return false;
    }
  }, [gameId, progress.bestScore, progress.completed, remoteMode, user]);

  return { progress, saveResult };
}
