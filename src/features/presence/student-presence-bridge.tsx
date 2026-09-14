"use client";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";

const HEARTBEAT_MS = 15_000;

function lessonIdFromPath(pathname: string) {
  const match = pathname.match(/^\/lesson\/([^/?#]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function StudentPresenceBridge() {
  const pathname = usePathname();
  const { user, role, firebaseReady } = useAuthSession();

  const writePresence = useCallback(async (online: boolean) => {
    if (!firebaseReady || role !== "student" || !user) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;

    await setDoc(
      doc(firebase.db, "presence", user.uid),
      {
        studentId: user.uid,
        online,
        currentPath: pathname || "/",
        currentLessonId: lessonIdFromPath(pathname || "/"),
        visibility: typeof document !== "undefined" && document.visibilityState === "hidden" ? "hidden" : "visible",
        lastSeen: serverTimestamp(),
      },
      { merge: true },
    ).catch(() => undefined);
  }, [firebaseReady, pathname, role, user]);

  useEffect(() => {
    if (!firebaseReady || role !== "student" || !user) return;

    void writePresence(true);
    const heartbeat = window.setInterval(() => void writePresence(true), HEARTBEAT_MS);
    const onVisibilityChange = () => void writePresence(true);
    const onFocus = () => void writePresence(true);
    const onPageHide = () => void writePresence(false);

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.clearInterval(heartbeat);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pagehide", onPageHide);
      void writePresence(false);
    };
  }, [firebaseReady, role, user, writePresence]);

  return null;
}
