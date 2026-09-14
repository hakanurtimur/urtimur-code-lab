"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";
import { parseLiveClassDiscovery } from "./live-class-utils";
import type { LiveClassDiscovery } from "./types";

type CurrentLiveClassState = {
  ownerUid: string;
  liveClass: LiveClassDiscovery | null;
  loading: boolean;
  error: string;
};

export function useCurrentLiveClass() {
  const { firebaseReady, role, user } = useAuthSession();
  const [state, setState] = useState<CurrentLiveClassState | null>(null);
  const eligible = firebaseReady && Boolean(user) && (role === "student" || role === "teacher");

  useEffect(() => {
    if (!eligible || !user) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;

    return onSnapshot(
      doc(firebase.db, "liveClass", "current"),
      (snapshot) => {
        setState({
          ownerUid: user.uid,
          liveClass: snapshot.exists() ? parseLiveClassDiscovery(snapshot.data()) : null,
          loading: false,
          error: "",
        });
      },
      () => setState({
        ownerUid: user.uid,
        liveClass: null,
        loading: false,
        error: "Canlı ders bilgisi alınamadı.",
      }),
    );
  }, [eligible, user]);

  if (!eligible || !user) return { liveClass: null, loading: false, error: "" };
  if (!state || state.ownerUid !== user.uid) return { liveClass: null, loading: true, error: "" };
  return { liveClass: state.liveClass, loading: state.loading, error: state.error };
}
