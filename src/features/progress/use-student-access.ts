"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { curriculumModules, getTotalCurriculumWeeks } from "@/features/curriculum/get-lesson";
import { getFirebaseClient } from "@/lib/firebase/client";

function getLocalUnlockedWeekOrder() {
  const visibleWeeks = curriculumModules
    .flatMap((module) => module.weeks)
    .filter((week) => week.fccStatus !== "upcoming");
  return visibleWeeks.at(-1)?.order ?? 1;
}

function clampWeekOrder(value: unknown) {
  const totalWeeks = getTotalCurriculumWeeks();
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.min(totalWeeks, Math.max(1, Math.trunc(value)));
}

type RemoteAccessState = {
  uid: string;
  maxUnlockedWeekOrder: number;
};

export function useStudentAccess() {
  const { user, role, firebaseReady } = useAuthSession();
  const localUnlockedWeekOrder = useMemo(() => getLocalUnlockedWeekOrder(), []);
  const [remoteAccess, setRemoteAccess] = useState<RemoteAccessState | null>(null);
  const remoteMode = firebaseReady && role === "student" && Boolean(user);

  useEffect(() => {
    if (!remoteMode || !user) return;

    const firebase = getFirebaseClient();
    if (!firebase) return;

    return onSnapshot(
      doc(firebase.db, "students", user.uid),
      (snapshot) => setRemoteAccess({
        uid: user.uid,
        maxUnlockedWeekOrder: clampWeekOrder(snapshot.data()?.maxUnlockedWeekOrder),
      }),
      () => setRemoteAccess({ uid: user.uid, maxUnlockedWeekOrder: 1 }),
    );
  }, [remoteMode, user]);

  if (!firebaseReady) {
    return { maxUnlockedWeekOrder: localUnlockedWeekOrder, loading: false };
  }

  if (!remoteMode || !user) {
    return { maxUnlockedWeekOrder: 1, loading: false };
  }

  const hasCurrentSnapshot = remoteAccess?.uid === user.uid;
  return {
    maxUnlockedWeekOrder: hasCurrentSnapshot ? remoteAccess.maxUnlockedWeekOrder : 1,
    loading: !hasCurrentSnapshot,
  };
}
