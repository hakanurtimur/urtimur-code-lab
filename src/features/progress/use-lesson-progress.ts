"use client";

import { doc, increment, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import { markLessonCompleted, readCompletedLessonIds } from "./progress-store";

export type LessonAttemptSummary = {
  passedTests: number;
  totalTests: number;
};

export function useLessonProgress(lessonId: string) {
  const { user, role, firebaseReady } = useAuthSession();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!firebaseReady || role !== "student" || !user) {
      setCompleted(readCompletedLessonIds(window.localStorage).includes(lessonId));
      return;
    }

    const firebase = getFirebaseClient();
    if (!firebase) return;
    const progressRef = doc(firebase.db, "students", user.uid, "progress", lessonId);
    return onSnapshot(
      progressRef,
      (snapshot) => setCompleted(snapshot.exists() && snapshot.data().completed === true),
      () => setCompleted(false),
    );
  }, [firebaseReady, lessonId, role, user]);

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

  const completeLesson = useCallback(async () => {
    setCompleted(true);

    if (!firebaseReady || role !== "student" || !user) {
      markLessonCompleted(window.localStorage, lessonId);
      return;
    }
    const firebase = getFirebaseClient();
    if (!firebase) return;

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
    } catch {
      setCompleted(false);
    }
  }, [firebaseReady, lessonId, role, user]);

  return { completed, completeLesson, recordAttempt };
}
