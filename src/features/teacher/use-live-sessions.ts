"use client";

import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { LiveSessionRecord, LiveSessionStatus } from "./types";

const statuses: LiveSessionStatus[] = ["coding", "testing", "active", "idle"];

function parseSession(id: string, data: Record<string, unknown>): LiveSessionRecord {
  const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : null;
  const status = typeof data.status === "string" && statuses.includes(data.status as LiveSessionStatus)
    ? (data.status as LiveSessionStatus)
    : "idle";

  return {
    studentId: typeof data.studentId === "string" ? data.studentId : id,
    lessonId: typeof data.lessonId === "string" ? data.lessonId : null,
    weekId: typeof data.weekId === "string" ? data.weekId : null,
    taskId: typeof data.taskId === "string" ? data.taskId : null,
    code: typeof data.code === "string" ? data.code : "",
    passedCount: typeof data.passedCount === "number" ? data.passedCount : 0,
    totalTests: typeof data.totalTests === "number" ? data.totalTests : 0,
    status,
    lastAction: typeof data.lastAction === "string" ? data.lastAction : "",
    updatedAtMs: updatedAt,
  };
}

export function useLiveSessions() {
  const { role, user } = useAuthSession();
  const [sessions, setSessions] = useState<Record<string, LiveSessionRecord>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (role !== "teacher" || !user) {
      setSessions({});
      setError("");
      return;
    }
    const firebase = getFirebaseClient();
    if (!firebase) return;

    return onSnapshot(
      collection(firebase.db, "liveSessions"),
      (snapshot) => {
        const next: Record<string, LiveSessionRecord> = {};
        snapshot.docs.forEach((document) => {
          next[document.id] = parseSession(document.id, document.data());
        });
        setSessions(next);
        setError("");
      },
      () => {
        setSessions({});
        setError("Canlı oturum verisi okunamıyor. Firestore kurallarını kontrol et.");
      },
    );
  }, [role, user]);

  return { sessions, error };
}
