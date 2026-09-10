"use client";

import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import type { CurriculumWeek, Lesson } from "@/features/curriculum/types";
import { getFirebaseClient } from "@/lib/firebase/client";

const CODE_SYNC_DELAY = 750;
const HEARTBEAT_DELAY = 20_000;

type TestSummary = { passed: boolean }[];

type LiveSyncInput = {
  lesson: Lesson;
  week: CurriculumWeek;
  taskId: string;
  source: string;
  results: TestSummary;
};

export function useLiveSessionSync({ lesson, week, taskId, source, results }: LiveSyncInput) {
  const { user, role, firebaseReady } = useAuthSession();
  const latest = useRef({ source, taskId, results });
  latest.current = { source, taskId, results };

  const writeSession = useCallback(
    async (status: "coding" | "testing" | "active" | "idle", lastAction: string) => {
      if (!firebaseReady || role !== "student" || !user) return;
      const firebase = getFirebaseClient();
      if (!firebase) return;
      const snapshot = latest.current;

      try {
        await setDoc(
          doc(firebase.db, "liveSessions", user.uid),
          {
            studentId: user.uid,
            lessonId: lesson.id,
            weekId: week.id,
            taskId: snapshot.taskId,
            code: snapshot.source,
            passedCount: snapshot.results.filter((result) => result.passed).length,
            totalTests: lesson.tests.length,
            status,
            lastAction,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch {
        // Live monitoring is best-effort and must never interrupt the student's editor.
      }
    },
    [firebaseReady, lesson.id, lesson.tests.length, role, user, week.id],
  );

  useEffect(() => {
    if (!firebaseReady || role !== "student" || !user) return;
    const timer = window.setTimeout(() => void writeSession("coding", "Kod yazıyor"), CODE_SYNC_DELAY);
    return () => window.clearTimeout(timer);
  }, [firebaseReady, role, source, taskId, user, writeSession]);

  useEffect(() => {
    if (!firebaseReady || role !== "student" || !user) return;
    void writeSession("active", "Ders ekranında");
    const heartbeat = window.setInterval(() => void writeSession("active", "Ders ekranında"), HEARTBEAT_DELAY);

    return () => {
      window.clearInterval(heartbeat);
      const firebase = getFirebaseClient();
      if (!firebase) return;
      void updateDoc(doc(firebase.db, "liveSessions", user.uid), {
        status: "idle",
        lastAction: "Ders ekranından ayrıldı",
        updatedAt: serverTimestamp(),
      }).catch(() => undefined);
    };
  }, [firebaseReady, role, user, writeSession]);

  const markTesting = useCallback(
    async (nextResults?: TestSummary) => {
      if (nextResults) latest.current = { ...latest.current, results: nextResults };
      await writeSession("testing", "Testleri çalıştırdı");
    },
    [writeSession],
  );
  return { markTesting };
}
