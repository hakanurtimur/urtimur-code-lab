"use client";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import { readCompletedLessonIds } from "./progress-store";

export function useCompletedLessonIds() {
  const { user, role, firebaseReady } = useAuthSession();
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!firebaseReady || role !== "student" || !user) {
      setCompletedIds(readCompletedLessonIds(window.localStorage));
      return;
    }

    const firebase = getFirebaseClient();
    if (!firebase) return;

    const progressQuery = query(
      collection(firebase.db, "students", user.uid, "progress"),
      where("completed", "==", true),
    );

    return onSnapshot(
      progressQuery,
      (snapshot) => setCompletedIds(snapshot.docs.map((document) => document.id)),
      () => setCompletedIds([]),
    );
  }, [firebaseReady, role, user]);

  return completedIds;
}
