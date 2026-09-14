"use client";

import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import type { CurriculumWeek, Lesson } from "@/features/curriculum/types";
import type { LiveActivePane, PreviewPreset } from "./types";
import { getFirebaseClient } from "@/lib/firebase/client";

const CODE_SYNC_DELAY = 750;
const PREVIEW_SCROLL_SYNC_DELAY = 260;
const HEARTBEAT_DELAY = 20_000;

type TestSummary = { passed: boolean }[];

type LiveSyncInput = {
  lesson: Lesson;
  week: CurriculumWeek;
  taskId: string;
  source: string;
  results: TestSummary;
  activePane: LiveActivePane;
  previewPreset: PreviewPreset;
  previewScrollY: number;
  totalTests?: number;
  enabled?: boolean;
};

type SessionSnapshot = {
  source: string;
  taskId: string;
  results: TestSummary;
  activePane: LiveActivePane;
  previewPreset: PreviewPreset;
  previewScrollY: number;
};

export function useLiveSessionSync({
  lesson,
  week,
  taskId,
  source,
  results,
  activePane,
  previewPreset,
  previewScrollY,
  totalTests,
  enabled = true,
}: LiveSyncInput) {
  const { user, role, firebaseReady } = useAuthSession();
  const latest = useRef<SessionSnapshot>({
    source,
    taskId,
    results,
    activePane,
    previewPreset,
    previewScrollY,
  });

  useEffect(() => {
    latest.current = {
      source,
      taskId,
      results,
      activePane,
      previewPreset,
      previewScrollY,
    };
  }, [activePane, previewPreset, previewScrollY, results, source, taskId]);

  const writeSession = useCallback(
    async (status: "coding" | "testing" | "active" | "idle", lastAction: string) => {
      if (!enabled || !firebaseReady || role !== "student" || !user) return;
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
            totalTests: totalTests ?? lesson.tests.length,
            status,
            lastAction,
            activePane: snapshot.activePane,
            previewPreset: snapshot.previewPreset,
            previewScrollY: Math.max(0, Math.round(snapshot.previewScrollY)),
            previewUpdatedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch {
        // Live monitoring is best-effort and must never interrupt the student's editor.
      }
    },
    [enabled, firebaseReady, lesson.id, lesson.tests.length, role, totalTests, user, week.id],
  );

  useEffect(() => {
    if (!enabled || !firebaseReady || role !== "student" || !user) return;
    const timer = window.setTimeout(() => void writeSession("coding", "Kod yazıyor"), CODE_SYNC_DELAY);
    return () => window.clearTimeout(timer);
  }, [enabled, firebaseReady, role, source, taskId, user, writeSession]);

  useEffect(() => {
    if (!enabled || !firebaseReady || role !== "student" || !user) return;
    void writeSession("active", activePane === "result" ? "Canlı sonucu inceliyor" : activePane === "mission" ? "Görevi inceliyor" : "Kod alanında");
  }, [activePane, enabled, firebaseReady, previewPreset, role, user, writeSession]);

  useEffect(() => {
    if (!enabled || !firebaseReady || role !== "student" || !user) return;
    const timer = window.setTimeout(
      () => void writeSession("active", "Önizlemeyi inceliyor"),
      PREVIEW_SCROLL_SYNC_DELAY,
    );
    return () => window.clearTimeout(timer);
  }, [enabled, firebaseReady, previewScrollY, role, user, writeSession]);

  useEffect(() => {
    if (!enabled || !firebaseReady || role !== "student" || !user) return;
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
  }, [enabled, firebaseReady, role, user, writeSession]);

  const markTesting = useCallback(
    async (nextResults?: TestSummary) => {
      if (nextResults) latest.current = { ...latest.current, results: nextResults };
      await writeSession("testing", "Testleri çalıştırdı");
    },
    [writeSession],
  );

  return { markTesting };
}
