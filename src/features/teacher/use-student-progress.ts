"use client";

import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { StudentProgressItem } from "./types";

export function useStudentProgress(studentUid: string | null) {
  const { role } = useAuthSession();
  const [items, setItems] = useState<StudentProgressItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (role !== "teacher" || !studentUid) {
      setItems([]);
      setError("");
      return;
    }
    const firebase = getFirebaseClient();
    if (!firebase) return;

    return onSnapshot(
      collection(firebase.db, "students", studentUid, "progress"),
      (snapshot) => {
        setItems(
          snapshot.docs.map((document) => {
            const data = document.data();
            return {
              lessonId: document.id,
              completed: data.completed === true,
              attempts: typeof data.attempts === "number" ? data.attempts : 0,
              lastPassedCount: typeof data.lastPassedCount === "number" ? data.lastPassedCount : 0,
              totalTests: typeof data.totalTests === "number" ? data.totalTests : 0,
              updatedAtMs: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : null,
              completedAtMs: data.completedAt instanceof Timestamp ? data.completedAt.toMillis() : null,
            };
          }),
        );
        setError("");
      },
      () => {
        setItems([]);
        setError("Öğrenci ilerlemesi okunamıyor. Firestore kurallarını kontrol et.");
      },
    );
  }, [role, studentUid]);

  return { items, error };
}
