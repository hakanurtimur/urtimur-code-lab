import { getFirebaseClient } from "@/lib/firebase/client";
import type { StudentRecord } from "./types";

async function teacherFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const firebase = getFirebaseClient();
  const user = firebase?.auth.currentUser;
  if (!user) throw new Error("Öğretmen oturumu bulunamadı.");
  const token = await user.getIdToken();

  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });

  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error ?? "İşlem tamamlanamadı.");
  return payload;
}

export function listStudents() {
  return teacherFetch<{ students: StudentRecord[] }>("/api/teacher/students");
}

export function createStudent(input: { name: string; username: string; password: string }) {
  return teacherFetch<{ student: StudentRecord }>("/api/teacher/students", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateStudent(
  uid: string,
  input: { name?: string; username?: string; password?: string; active?: boolean },
) {
  return teacherFetch<{ ok: true }>(`/api/teacher/students/${uid}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteStudent(uid: string) {
  return teacherFetch<{ ok: true }>(`/api/teacher/students/${uid}`, { method: "DELETE" });
}

export function resetStudentProgress(uid: string) {
  return teacherFetch<{ ok: true }>(`/api/teacher/students/${uid}/reset-progress`, { method: "POST" });
}
