"use client";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import {
  getLocalProgressSnapshot,
  parseCompletedLessonIds,
  subscribeToLocalProgress,
} from "./progress-store";

type RemoteProgressState = {
  uid: string;
  completedIds: string[];
};

export function useCompletedLessonIds() {
  const { user, role, firebaseReady } = useAuthSession();
  const [remoteProgress, setRemoteProgress] = useState<RemoteProgressState | null>(null);
  const localSnapshot = useSyncExternalStore(
    subscribeToLocalProgress,
    getLocalProgressSnapshot,
    () => "",
  );
  const remoteMode = firebaseReady && role === "student" && Boolean(user);

  useEffect(() => {
    if (!remoteMode || !user) return;

    const firebase = getFirebaseClient();
    if (!firebase) return;

    const progressQuery = query(
      collection(firebase.db, "students", user.uid, "progress"),
      where("completed", "==", true),
    );

    return onSnapshot(
      progressQuery,
      (snapshot) => setRemoteProgress({
        uid: user.uid,
        completedIds: snapshot.docs.map((document) => document.id),
      }),
      () => setRemoteProgress({ uid: user.uid, completedIds: [] }),
    );
  }, [remoteMode, user]);

  if (remoteMode) {
    if (remoteProgress && remoteProgress.uid === user?.uid) {
      return remoteProgress.completedIds;
    }
    return [];
  }

  return parseCompletedLessonIds(localSnapshot);
}
