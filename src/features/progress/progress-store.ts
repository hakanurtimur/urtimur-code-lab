const STORAGE_KEY = "rwd-companion:progress:v1";
const PROGRESS_UPDATED_EVENT = "urtimur-code-lab:progress-updated";

type ProgressPayload = {
  completedLessonIds: string[];
};

export function parseCompletedLessonIds(raw: string | null): string[] {
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

export function readCompletedLessonIds(storage: Storage): string[] {
  return parseCompletedLessonIds(storage.getItem(STORAGE_KEY));
}

export function getLocalProgressSnapshot(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

export function subscribeToLocalProgress(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.storageArea === window.localStorage && event.key === STORAGE_KEY) {
      onStoreChange();
    }
  };
  const onProgressUpdated = () => onStoreChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener(PROGRESS_UPDATED_EVENT, onProgressUpdated);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PROGRESS_UPDATED_EVENT, onProgressUpdated);
  };
}

export function markLessonCompleted(storage: Storage, lessonId: string): string[] {
  const completed = new Set(readCompletedLessonIds(storage));
  completed.add(lessonId);
  const completedLessonIds = [...completed];

  storage.setItem(STORAGE_KEY, JSON.stringify({ completedLessonIds } satisfies ProgressPayload));
  if (typeof window !== "undefined" && storage === window.localStorage) {
    window.dispatchEvent(new Event(PROGRESS_UPDATED_EVENT));
  }
  return completedLessonIds;
}
