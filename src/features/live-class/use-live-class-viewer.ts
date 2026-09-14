"use client";

import { doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import { parseLiveClassPublishedSession } from "./live-class-utils";
import type { LiveClassPublishedSession } from "./types";
import { useCurrentLiveClass } from "./use-current-live-class";

const VIEWER_HEARTBEAT = 20_000;

type ViewerState = {
  sessionId: string;
  session: LiveClassPublishedSession | null;
  error: string;
};

export function useLiveClassViewer() {
  const { firebaseReady, role, user } = useAuthSession();
  const { liveClass, loading: currentLoading, error: currentError } = useCurrentLiveClass();
  const [state, setState] = useState<ViewerState | null>(null);
  const sessionId = liveClass?.sessionId ?? null;

  useEffect(() => {
    if (!firebaseReady || role !== "student" || !user || !sessionId) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;

    return onSnapshot(
      doc(firebase.db, "liveClasses", sessionId),
      (snapshot) => setState({
        sessionId,
        session: snapshot.exists() ? parseLiveClassPublishedSession(sessionId, snapshot.data()) : null,
        error: "",
      }),
      () => setState({ sessionId, session: null, error: "Canlı yayınla bağlantı kurulamadı." }),
    );
  }, [firebaseReady, role, sessionId, user]);

  useEffect(() => {
    if (!firebaseReady || role !== "student" || !user || !sessionId || liveClass?.active !== true) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;
    const viewerRef = doc(firebase.db, "liveClasses", sessionId, "viewers", user.uid);

    void setDoc(viewerRef, {
      studentId: user.uid,
      joinedAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      online: true,
    }, { merge: true }).catch(() => undefined);

    const heartbeat = window.setInterval(() => {
      void updateDoc(viewerRef, { lastSeen: serverTimestamp(), online: true }).catch(() => undefined);
    }, VIEWER_HEARTBEAT);

    return () => {
      window.clearInterval(heartbeat);
      void updateDoc(viewerRef, { lastSeen: serverTimestamp(), online: false }).catch(() => undefined);
    };
  }, [firebaseReady, liveClass?.active, role, sessionId, user]);

  const session = sessionId && state?.sessionId === sessionId ? state.session : null;
  return {
    discovery: liveClass,
    session,
    loading: currentLoading || Boolean(sessionId && state?.sessionId !== sessionId),
    error: currentError || (sessionId && state?.sessionId === sessionId ? state.error : ""),
  };
}
