"use client";

import { doc, increment, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import { markLessonCompleted } from "./progress-store";
import { useCompletedLessonIds } from "./use-completed-lesson-ids";
import {
  EMPTY_STAGE_PROGRESS,
  markStageComplete,
  type LessonStageKey,
  type LessonStageProgress,
} from "./stage-progress";

export type LessonAttemptSummary = {
  passedTests: number;
  totalTests: number;
};

type RemoteStageState = LessonStageProgress & { uid: string };

function parseStageProgress(data: Record<string, unknown>): LessonStageProgress {
  const practiceCompleted = data.practiceCompleted === true;
  const challengeCompleted = data.challengeCompleted === true;
  const miniCompleted = data.miniCompleted === true || data.completed === true;
  const currentStage = data.currentStage === "mini"
    ? "mini"
    : data.currentStage === "challenge"
      ? "challenge"
      : miniCompleted || challengeCompleted
        ? "mini"
        : practiceCompleted
          ? "challenge"
          : "practice";
  return { practiceCompleted, challengeCompleted, miniCompleted, currentStage };
}

export function useLessonProgress(lessonId: string) {
  const { user, role, firebaseReady } = useAuthSession();
  const completedLessonIds = useCompletedLessonIds();
  const [optimisticCompletedIds, setOptimisticCompletedIds] = useState<string[]>([]);
  const [localStageProgress, setLocalStageProgress] = useState<LessonStageProgress>(EMPTY_STAGE_PROGRESS);
  const [remoteStage, setRemoteStage] = useState<RemoteStageState | null>(null);
  const remoteMode = firebaseReady && role === "student" && Boolean(user);
    const serverStage: LessonStageProgress =
        remoteMode && remoteStage && remoteStage.uid === user?.uid
            ? remoteStage
            : EMPTY_STAGE_PROGRESS;  const stageProgress = useMemo<LessonStageProgress>(() => ({
    practiceCompleted: serverStage.practiceCompleted || localStageProgress.practiceCompleted,
    challengeCompleted: serverStage.challengeCompleted || localStageProgress.challengeCompleted,
    miniCompleted: serverStage.miniCompleted || localStageProgress.miniCompleted,
    currentStage: localStageProgress.miniCompleted || serverStage.miniCompleted
      ? "mini"
      : localStageProgress.challengeCompleted || serverStage.challengeCompleted
        ? "mini"
        : localStageProgress.practiceCompleted || serverStage.practiceCompleted
          ? "challenge"
          : "practice",
  }), [localStageProgress, serverStage]);
  const completed = completedLessonIds.includes(lessonId) || optimisticCompletedIds.includes(lessonId) || stageProgress.miniCompleted;

  useEffect(() => {
    if (!remoteMode || !user) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;

    return onSnapshot(
      doc(firebase.db, "students", user.uid, "progress", lessonId),
      (snapshot) => setRemoteStage({ uid: user.uid, ...parseStageProgress(snapshot.data() ?? {}) }),
      () => setRemoteStage({ uid: user.uid, ...EMPTY_STAGE_PROGRESS }),
    );
  }, [lessonId, remoteMode, user]);

  const recordStageAttempt = useCallback(
    async (stage: LessonStageKey, { passedTests, totalTests }: LessonAttemptSummary, passed: boolean) => {
      const nextLocal = passed ? markStageComplete(stageProgress, stage) : { ...stageProgress, currentStage: stage };
      setLocalStageProgress(nextLocal);

      if (!remoteMode || !user) return true;
      const firebase = getFirebaseClient();
      if (!firebase) return false;

      const attemptField = `${stage}Attempts`;
      const completeField = `${stage === "mini" ? "mini" : stage}Completed`;
      const nextStage = passed ? nextLocal.currentStage : stage;

      try {
        await setDoc(
          doc(firebase.db, "students", user.uid, "progress", lessonId),
          {
            lessonId,
            currentStage: nextStage,
            [attemptField]: increment(1),
            ...(passed ? { [completeField]: true } : {}),
            lastPassedCount: passedTests,
            totalTests,
            lastAttemptAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        return true;
      } catch {
        return false;
      }
    },
    [lessonId, remoteMode, stageProgress, user],
  );

  const completeLesson = useCallback(async (): Promise<boolean> => {
    setOptimisticCompletedIds((current) => current.includes(lessonId) ? current : [...current, lessonId]);

    if (!remoteMode || !user) {
      markLessonCompleted(window.localStorage, lessonId);
      setLocalStageProgress({
        practiceCompleted: true,
        challengeCompleted: true,
        miniCompleted: true,
        currentStage: "mini",
      });
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
          practiceCompleted: true,
          challengeCompleted: true,
          miniCompleted: true,
          currentStage: "mini",
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      return true;
    } catch {
      setOptimisticCompletedIds((current) => current.filter((id) => id !== lessonId));
      return false;
    }
  }, [lessonId, remoteMode, user]);

  return { completed, completeLesson, recordStageAttempt, stageProgress };
}
