"use client";

import { doc, increment, serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import { markLessonCompleted } from "./progress-store";
import { useCompletedLessonIds } from "./use-completed-lesson-ids";

export type LessonAttemptSummary = {
  passedTests: number;
  totalTests: number;
};

export function useLessonProgress(lessonId: string) {
  const { user, role, firebaseReady } = useAuthSession();
  const completedLessonIds = useCompletedLessonIds();
  const [optimisticCompletedIds, setOptimisticCompletedIds] = useState<string[]>([]);
  const completed = completedLessonIds.includes(lessonId) || optimisticCompletedIds.includes(lessonId);

  const recordAttempt = useCallback(
    async ({ passedTests, totalTests }: LessonAttemptSummary) => {
      if (!firebaseReady || role !== "student" || !user) return;
      const firebase = getFirebaseClient();
      if (!firebase) return;

      try {
        await setDoc(
          doc(firebase.db, "students", user.uid, "progress", lessonId),
          {
            lessonId,
            attempts: increment(1),
            lastPassedCount: passedTests,
            totalTests,
            lastAttemptAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch {
        // Realtime progress can recover on the next attempt.
      }
    },
    [firebaseReady, lessonId, role, user],
  );

  const completeLesson = useCallback(async (): Promise<boolean> => {
    setOptimisticCompletedIds((current) => current.includes(lessonId) ? current : [...current, lessonId]);

    if (!firebaseReady || role !== "student" || !user) {
      markLessonCompleted(window.localStorage, lessonId);
      return true;
    }
    const firebase = getFirebaseClient();
    if (!firebase) {
      setOptimisticCompletedIds((current) => current.filter((id) => id !== lessonId));
      return false;
    }

    try {
      await setDoc(
        doc(firebase.db, "students", user.uid, "progress", lessonId),
        {
          lessonId,
          completed: true,
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      return true;
    } catch {
      setOptimisticCompletedIds((current) => current.filter((id) => id !== lessonId));
      return false;
    }
  }, [firebaseReady, lessonId, role, user]);

  return { completed, completeLesson, recordAttempt };
}
