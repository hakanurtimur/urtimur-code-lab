"use client";

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthSession } from "@/features/auth/auth-provider";
import type { PreviewPreset } from "@/features/live-session/types";
import { getFirebaseClient } from "@/lib/firebase/client";
import {
  isLiveClassViewerOnline,
  parseLiveClassDraft,
  parseLiveClassPublishedSession,
  shouldPublishLiveClass,
} from "./live-class-utils";
import {
  DEFAULT_LIVE_CLASS_DRAFT,
  LIVE_CLASS_TEMPLATES,
  type LiveClassDraft,
  type LiveClassFile,
  type LiveClassSpotlight,
  type LiveClassStatus,
  type LiveClassSyncState,
} from "./types";
import { useCurrentLiveClass } from "./use-current-live-class";

const SYNC_DELAY = 340;

function cloneDefaultDraft(): LiveClassDraft {
  return { ...DEFAULT_LIVE_CLASS_DRAFT };
}

export function useLiveClassStudio() {
  const { firebaseReady, role, user } = useAuthSession();
  const { liveClass: current, loading: currentLoading, error: currentError } = useCurrentLiveClass();
  const [localSessionId, setLocalSessionId] = useState<string | null>(null);
  const [hydratedSessionId, setHydratedSessionId] = useState<string | null>(null);
  const [draft, setDraft] = useState<LiveClassDraft>(cloneDefaultDraft);
  const [title, setTitleState] = useState("");
  const [localStatus, setLocalStatus] = useState<LiveClassStatus | "idle">("idle");
  const [spotlight, setSpotlight] = useState<LiveClassSpotlight>("split");
  const [previewPreset, setPreviewPreset] = useState<PreviewPreset>("fit");
  const [syncState, setSyncState] = useState<LiveClassSyncState>("idle");
  const [syncError, setSyncError] = useState("");
  const [viewerState, setViewerState] = useState<{ sessionId: string; viewers: Record<string, { lastSeenMs: number | null; online: boolean }> } | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const remoteSessionId = current?.active ? current.sessionId : null;
  const sessionId = localSessionId ?? remoteSessionId;
  const status: LiveClassStatus | "idle" = localStatus !== "idle"
    ? localStatus
    : current?.active && current.sessionId === sessionId
      ? current.status
      : "idle";
  const resolvedTitle = title || current?.title || "Canlı Kod Atölyesi";
  const teacherReady = firebaseReady && role === "teacher" && Boolean(user);

  useEffect(() => {
    if (!sessionId || !teacherReady || !user || hydratedSessionId === sessionId) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;
    let cancelled = false;

    Promise.all([
      getDoc(doc(firebase.db, "liveClasses", sessionId)),
      getDoc(doc(firebase.db, "liveClasses", sessionId, "private", "editor")),
    ]).then(([publishedSnapshot, draftSnapshot]) => {
      if (cancelled) return;
      const published = publishedSnapshot.exists()
        ? parseLiveClassPublishedSession(sessionId, publishedSnapshot.data())
        : null;
      const privateDraft = draftSnapshot.exists() ? parseLiveClassDraft(draftSnapshot.data()) : null;

      if (privateDraft) setDraft(privateDraft);
      else if (published) setDraft({
        html: published.html,
        css: published.css,
        js: published.js,
        activeFile: published.activeFile,
        cursorLine: published.cursorLine,
        updatedAtMs: published.updatedAtMs,
      });
      if (published) {
        setTitleState(published.title);
        setLocalStatus(published.status);
        setSpotlight(published.spotlight);
        setPreviewPreset(published.previewPreset);
      }
      setHydratedSessionId(sessionId);
      setSyncState("live");
    }).catch(() => {
      if (!cancelled) {
        setHydratedSessionId(sessionId);
        setSyncState("error");
        setSyncError("Canlı ders taslağı yüklenemedi.");
      }
    });

    return () => { cancelled = true; };
  }, [hydratedSessionId, sessionId, teacherReady, user]);

  useEffect(() => {
    if (!sessionId || !teacherReady) return;
    const firebase = getFirebaseClient();
    if (!firebase) return;

    return onSnapshot(
      collection(firebase.db, "liveClasses", sessionId, "viewers"),
      (snapshot) => {
        const viewers: Record<string, { lastSeenMs: number | null; online: boolean }> = {};
        snapshot.docs.forEach((viewer) => {
          const data = viewer.data();
          const value = data.lastSeen;
          viewers[viewer.id] = {
            lastSeenMs: value && typeof value.toMillis === "function" ? value.toMillis() : null,
            online: data.online === true,
          };
        });
        setViewerState({ sessionId, viewers });
      },
      () => setViewerState({ sessionId, viewers: {} }),
    );
  }, [sessionId, teacherReady]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 10_000);
    return () => window.clearInterval(timer);
  }, []);

  const viewerCount = useMemo(() => {
    if (!sessionId || viewerState?.sessionId !== sessionId) return 0;
    return Object.values(viewerState.viewers).filter((viewer) => viewer.online && isLiveClassViewerOnline(viewer.lastSeenMs, now)).length;
  }, [now, sessionId, viewerState]);

  const persistNow = useCallback(async (nextStatus: LiveClassStatus, publishCode: boolean) => {
    if (!sessionId || !user || role !== "teacher") return false;
    const firebase = getFirebaseClient();
    if (!firebase) return false;
    setSyncState("saving");
    setSyncError("");

    const batch = writeBatch(firebase.db);
    const privateRef = doc(firebase.db, "liveClasses", sessionId, "private", "editor");
    const sessionRef = doc(firebase.db, "liveClasses", sessionId);
    const currentRef = doc(firebase.db, "liveClass", "current");

    batch.set(privateRef, {
      draftHtml: draft.html,
      draftCss: draft.css,
      draftJs: draft.js,
      activeFile: draft.activeFile,
      cursorLine: draft.cursorLine,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    const published: Record<string, unknown> = {
      teacherUid: user.uid,
      title: resolvedTitle,
      status: nextStatus,
      updatedAt: serverTimestamp(),
    };
    if (publishCode) Object.assign(published, {
      activeFile: draft.activeFile,
      spotlight,
      previewPreset,
      publishedHtml: draft.html,
      publishedCss: draft.css,
      publishedJs: draft.js,
      cursorLine: draft.cursorLine,
    });
    batch.set(sessionRef, published, { merge: true });

    const discovery: Record<string, unknown> = {
      sessionId,
      active: nextStatus !== "ended",
      status: nextStatus,
      title: resolvedTitle,
      teacherUid: user.uid,
      updatedAt: serverTimestamp(),
    };
    if (publishCode) Object.assign(discovery, {
      activeFile: draft.activeFile,
      spotlight,
      previewPreset,
    });
    if (nextStatus === "ended") discovery.endedAt = serverTimestamp();
    batch.set(currentRef, discovery, { merge: true });

    try {
      await batch.commit();
      setSyncState(nextStatus === "ended" ? "idle" : "live");
      return true;
    } catch {
      setSyncState("error");
      setSyncError("Canlı ders Firebase'e yazılamadı. Taslağın bu ekranda duruyor.");
      return false;
    }
  }, [draft, previewPreset, resolvedTitle, role, sessionId, spotlight, user]);

  useEffect(() => {
    if (!sessionId || hydratedSessionId !== sessionId || !teacherReady || status === "idle" || status === "ended") return;
    const firebase = getFirebaseClient();
    if (!firebase || !user) return;

    const timer = window.setTimeout(() => {
      setSyncState("saving");
      const batch = writeBatch(firebase.db);
      batch.set(doc(firebase.db, "liveClasses", sessionId, "private", "editor"), {
        draftHtml: draft.html,
        draftCss: draft.css,
        draftJs: draft.js,
        activeFile: draft.activeFile,
        cursorLine: draft.cursorLine,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      if (shouldPublishLiveClass(status)) {
        batch.set(doc(firebase.db, "liveClasses", sessionId), {
          teacherUid: user.uid,
          title: resolvedTitle,
          status: "live",
          activeFile: draft.activeFile,
          spotlight,
          previewPreset,
          publishedHtml: draft.html,
          publishedCss: draft.css,
          publishedJs: draft.js,
          cursorLine: draft.cursorLine,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        batch.set(doc(firebase.db, "liveClass", "current"), {
          sessionId,
          active: true,
          status: "live",
          title: resolvedTitle,
          teacherUid: user.uid,
          activeFile: draft.activeFile,
          spotlight,
          previewPreset,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } else {
        batch.set(doc(firebase.db, "liveClasses", sessionId), {
          title: resolvedTitle,
          status: "frozen",
          updatedAt: serverTimestamp(),
        }, { merge: true });
        batch.set(doc(firebase.db, "liveClass", "current"), {
          title: resolvedTitle,
          status: "frozen",
          active: true,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      void batch.commit()
        .then(() => { setSyncState("live"); setSyncError(""); })
        .catch(() => { setSyncState("error"); setSyncError("Senkronizasyon kesildi; taslağın bu ekranda korunuyor."); });
    }, SYNC_DELAY);

    return () => window.clearTimeout(timer);
  }, [draft, hydratedSessionId, previewPreset, resolvedTitle, sessionId, spotlight, status, teacherReady, user]);

  const startClass = useCallback(async (nextTitle: string, templateId = "starter") => {
    if (!user || role !== "teacher") return false;
    const firebase = getFirebaseClient();
    if (!firebase) return false;
    const template = LIVE_CLASS_TEMPLATES.find((item) => item.id === templateId) ?? LIVE_CLASS_TEMPLATES[0];
    const nextDraft: LiveClassDraft = {
      ...template.draft,
      activeFile: "html",
      cursorLine: 1,
      updatedAtMs: null,
    };
    const sessionRef = doc(collection(firebase.db, "liveClasses"));
    const id = sessionRef.id;
    const cleanTitle = nextTitle.trim() || "Canlı Kod Atölyesi";
    const batch = writeBatch(firebase.db);

    batch.set(sessionRef, {
      teacherUid: user.uid,
      title: cleanTitle,
      status: "live",
      activeFile: "html",
      spotlight: "split",
      previewPreset: "fit",
      publishedHtml: nextDraft.html,
      publishedCss: nextDraft.css,
      publishedJs: nextDraft.js,
      cursorLine: 1,
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      endedAt: null,
    });
    batch.set(doc(firebase.db, "liveClasses", id, "private", "editor"), {
      draftHtml: nextDraft.html,
      draftCss: nextDraft.css,
      draftJs: nextDraft.js,
      activeFile: "html",
      cursorLine: 1,
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(firebase.db, "liveClass", "current"), {
      sessionId: id,
      active: true,
      status: "live",
      title: cleanTitle,
      teacherUid: user.uid,
      activeFile: "html",
      spotlight: "split",
      previewPreset: "fit",
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      endedAt: null,
    });

    try {
      await batch.commit();
      setLocalSessionId(id);
      setDraft(nextDraft);
      setTitleState(cleanTitle);
      setLocalStatus("live");
      setSpotlight("split");
      setPreviewPreset("fit");
      setHydratedSessionId(id);
      setSyncState("live");
      setSyncError("");
      return true;
    } catch {
      setSyncState("error");
      setSyncError("Canlı ders başlatılamadı. Firebase bağlantısını kontrol et.");
      return false;
    }
  }, [role, user]);

  const updateFile = useCallback((file: LiveClassFile, value: string) => {
    setDraft((currentDraft) => ({ ...currentDraft, [file]: value }));
  }, []);

  const setActiveFile = useCallback((file: LiveClassFile) => {
    setDraft((currentDraft) => ({ ...currentDraft, activeFile: file, cursorLine: 1 }));
  }, []);

  const setCursorLine = useCallback((line: number) => {
    setDraft((currentDraft) => currentDraft.cursorLine === line
      ? currentDraft
      : { ...currentDraft, cursorLine: Math.max(1, Math.round(line)) });
  }, []);

  const applyTemplate = useCallback((templateId: string) => {
    const template = LIVE_CLASS_TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;
    setDraft((currentDraft) => ({
      ...currentDraft,
      ...template.draft,
      activeFile: "html",
      cursorLine: 1,
    }));
  }, []);

  const freezeClass = useCallback(async () => {
    setLocalStatus("frozen");
    const saved = await persistNow("frozen", false);
    if (!saved) setLocalStatus("live");
    return saved;
  }, [persistNow]);

  const resumeClass = useCallback(async () => {
    setLocalStatus("live");
    const saved = await persistNow("live", true);
    if (!saved) setLocalStatus("frozen");
    return saved;
  }, [persistNow]);

  const endClass = useCallback(async () => {
    const previousStatus = status;
    setLocalStatus("ended");
    const saved = await persistNow("ended", false);
    if (saved) {
      setLocalStatus("idle");
      setLocalSessionId(null);
      setHydratedSessionId(null);
    } else {
      setLocalStatus(previousStatus === "frozen" ? "frozen" : "live");
    }
    return saved;
  }, [persistNow, status]);

  return {
    sessionId,
    status,
    isActive: Boolean(sessionId && status !== "idle" && status !== "ended"),
    loading: currentLoading || Boolean(sessionId && hydratedSessionId !== sessionId),
    error: syncError || currentError,
    syncState,
    title: resolvedTitle,
    setTitle: setTitleState,
    draft,
    updateFile,
    setActiveFile,
    setCursorLine,
    spotlight,
    setSpotlight,
    previewPreset,
    setPreviewPreset,
    viewerCount,
    startClass,
    freezeClass,
    resumeClass,
    endClass,
    applyTemplate,
  };
}
