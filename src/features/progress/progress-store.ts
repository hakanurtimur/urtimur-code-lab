const STORAGE_KEY = "rwd-companion:progress:v1";

type ProgressPayload = {
  completedLessonIds: string[];
};

export function readCompletedLessonIds(storage: Storage): string[] {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Partial<ProgressPayload>;
    return Array.isArray(parsed.completedLessonIds)
      ? parsed.completedLessonIds.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function markLessonCompleted(storage: Storage, lessonId: string): string[] {
  const completed = new Set(readCompletedLessonIds(storage));
  completed.add(lessonId);
  const completedLessonIds = [...completed];

  storage.setItem(STORAGE_KEY, JSON.stringify({ completedLessonIds } satisfies ProgressPayload));
  return completedLessonIds;
}
