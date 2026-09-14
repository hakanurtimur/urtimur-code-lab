"use client";

import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { StudentProgressItem } from "./types";

type StudentProgressState = {
  studentUid: string;
  items: StudentProgressItem[];
  error: string;
};

export function useStudentProgress(studentUid: string | null) {
  const { role } = useAuthSession();
  const [state, setState] = useState<StudentProgressState | null>(null);
  const teacherMode = role === "teacher" && Boolean(studentUid);

  useEffect(() => {
    if (!teacherMode || !studentUid) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;

    return onSnapshot(
      collection(firebase.db, "students", studentUid, "progress"),
      (snapshot) => {
        const items = snapshot.docs.map((document) => {
          const data = document.data();
          return {
            lessonId: document.id,
            completed: data.completed === true,
            currentStage: data.completed === true || data.currentStage === "mini" ? "mini" : data.currentStage === "challenge" ? "challenge" : "practice",
            practiceCompleted: data.practiceCompleted === true,
            challengeCompleted: data.challengeCompleted === true,
            miniCompleted: data.miniCompleted === true || data.completed === true,
            attempts: typeof data.attempts === "number" ? data.attempts : [data.practiceAttempts, data.challengeAttempts, data.miniAttempts].reduce((sum: number, value) => sum + (typeof value === "number" ? value : 0), 0),
            lastPassedCount: typeof data.lastPassedCount === "number" ? data.lastPassedCount : 0,
            totalTests: typeof data.totalTests === "number" ? data.totalTests : 0,
            updatedAtMs: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : null,
            completedAtMs: data.completedAt instanceof Timestamp ? data.completedAt.toMillis() : null,
          } satisfies StudentProgressItem;
        });
        setState({ studentUid, items, error: "" });
      },
      () => setState({
        studentUid,
        items: [],
        error: "Öğrenci ilerlemesi okunamıyor. Firestore kurallarını kontrol et.",
      }),
    );
  }, [studentUid, teacherMode]);

  if (!teacherMode || !studentUid || state?.studentUid !== studentUid) {
    return { items: [], error: "" };
  }

  return { items: state.items, error: state.error };
}
