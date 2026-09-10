"use client";

import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { LiveSessionRecord, LiveSessionStatus } from "./types";

const statuses: LiveSessionStatus[] = ["coding", "testing", "active", "idle"];
const previewPresets = ["fit", "desktop", "tablet", "mobile"] as const;
const activePanes = ["mission", "code", "result"] as const;

type LiveSessionsState = {
  teacherUid: string;
  sessions: Record<string, LiveSessionRecord>;
  error: string;
};

export function parseSession(id: string, data: Record<string, unknown>): LiveSessionRecord {
  const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : null;
  const previewUpdatedAt = data.previewUpdatedAt instanceof Timestamp ? data.previewUpdatedAt.toMillis() : null;
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
    activePane: typeof data.activePane === "string" && activePanes.includes(data.activePane as (typeof activePanes)[number])
      ? (data.activePane as LiveSessionRecord["activePane"])
      : "code",
    previewPreset: typeof data.previewPreset === "string" && previewPresets.includes(data.previewPreset as (typeof previewPresets)[number])
      ? (data.previewPreset as LiveSessionRecord["previewPreset"])
      : "fit",
    previewScrollY: typeof data.previewScrollY === "number" && Number.isFinite(data.previewScrollY) && data.previewScrollY >= 0
      ? Math.round(data.previewScrollY)
      : 0,
    previewUpdatedAtMs: previewUpdatedAt,
    updatedAtMs: updatedAt,
  };
}

export function useLiveSessions() {
  const { role, user } = useAuthSession();
  const [state, setState] = useState<LiveSessionsState | null>(null);
  const teacherMode = role === "teacher" && Boolean(user);

  useEffect(() => {
    if (!teacherMode || !user) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;

    return onSnapshot(
      collection(firebase.db, "liveSessions"),
      (snapshot) => {
        const sessions: Record<string, LiveSessionRecord> = {};
        snapshot.docs.forEach((document) => {
          sessions[document.id] = parseSession(document.id, document.data());
        });
        setState({ teacherUid: user.uid, sessions, error: "" });
      },
      () => setState({
        teacherUid: user.uid,
        sessions: {},
        error: "Canlı oturum verisi okunamıyor. Firestore kurallarını kontrol et.",
      }),
    );
  }, [teacherMode, user]);

  if (!teacherMode || !user || state?.teacherUid !== user.uid) {
    return { sessions: {}, error: "" };
  }

  return { sessions: state.sessions, error: state.error };
}
