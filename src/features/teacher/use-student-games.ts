"use client";

import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import { getFirebaseClient } from "@/lib/firebase/client";

export type StudentGameProgressItem = {
  gameId: string;
  completed: boolean;
  attempts: number;
  bestScore: number;
  total: number;
  updatedAtMs: number | null;
};

type State = { studentUid: string; items: StudentGameProgressItem[]; error: string };

export function useStudentGames(studentUid: string | null) {
  const { role } = useAuthSession();
  const [state, setState] = useState<State | null>(null);
  const teacherMode = role === "teacher" && Boolean(studentUid);

  useEffect(() => {
    if (!teacherMode || !studentUid) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;
    return onSnapshot(
      collection(firebase.db, "students", studentUid, "games"),
      (snapshot) => setState({
        studentUid,
        items: snapshot.docs.map((document) => {
          const data = document.data();
          return {
            gameId: document.id,
            completed: data.completed === true,
            attempts: typeof data.attempts === "number" ? data.attempts : 0,
            bestScore: typeof data.bestScore === "number" ? data.bestScore : 0,
            total: typeof data.total === "number" ? data.total : 0,
            updatedAtMs: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : null,
          };
        }),
        error: "",
      }),
      () => setState({ studentUid, items: [], error: "Oyun ilerlemesi okunamıyor." }),
    );
  }, [studentUid, teacherMode]);

  if (!teacherMode || !studentUid || state?.studentUid !== studentUid) return { items: [], error: "" };
  return { items: state.items, error: state.error };
}
