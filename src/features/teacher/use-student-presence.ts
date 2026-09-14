"use client";

import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { StudentPresence } from "@/features/presence/types";

type PresenceState = {
  teacherUid: string;
  items: Record<string, StudentPresence>;
  error: string;
};

export function parsePresence(id: string, data: Record<string, unknown>): StudentPresence {
  return {
    studentId: typeof data.studentId === "string" ? data.studentId : id,
    online: data.online === true,
    currentPath: typeof data.currentPath === "string" ? data.currentPath : "/",
    currentLessonId: typeof data.currentLessonId === "string" ? data.currentLessonId : null,
    visibility: data.visibility === "hidden" ? "hidden" : "visible",
    lastSeenMs: data.lastSeen instanceof Timestamp ? data.lastSeen.toMillis() : null,
  };
}

export function useStudentPresence() {
  const { role, user } = useAuthSession();
  const [state, setState] = useState<PresenceState | null>(null);
  const teacherMode = role === "teacher" && Boolean(user);

  useEffect(() => {
    if (!teacherMode || !user) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;

    return onSnapshot(
      collection(firebase.db, "presence"),
      (snapshot) => {
        const items: Record<string, StudentPresence> = {};
        snapshot.docs.forEach((document) => {
          items[document.id] = parsePresence(document.id, document.data());
        });
        setState({ teacherUid: user.uid, items, error: "" });
      },
      () => setState({ teacherUid: user.uid, items: {}, error: "Öğrenci çevrim içi durumu okunamıyor. Firestore kurallarını kontrol et." }),
    );
  }, [teacherMode, user]);

  if (!teacherMode || !user || state?.teacherUid !== user.uid) return { presence: {}, error: "" };
  return { presence: state.items, error: state.error };
}
