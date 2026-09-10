"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Expand, Monitor, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";

import type { PreviewPreset } from "@/features/live-session/types";

export type { PreviewPreset } from "@/features/live-session/types";

export type PreviewPresetDefinition = {
  label: string;
  width: number | null;
  height: number | null;
  icon: typeof Monitor;
};

export const previewPresets: Record<PreviewPreset, PreviewPresetDefinition> = {
  fit: { label: "Fit", width: null, height: null, icon: Expand },
  desktop: { label: "Desktop", width: 1280, height: 800, icon: Monitor },
  tablet: { label: "Tablet", width: 768, height: 1024, icon: Tablet },
  mobile: { label: "Mobile", width: 390, height: 844, icon: Smartphone },
};

type PreviewViewportProps = {
  source: string;
  mode: PreviewPreset;
  title?: string;
  scrollY?: number;
  onScrollChange?: (scrollY: number) => void;
  interactive?: boolean;
  className?: string;
};

const SCROLL_SYNC_DELAY = 240;

function applyFrameScroll(frameWindow: Window, scrollY: number) {
  const nextScrollY = Math.max(0, scrollY);
  const documentElement = frameWindow.document.documentElement;
  const body = frameWindow.document.body;

  if (documentElement) documentElement.scrollTop = nextScrollY;
  if (body) body.scrollTop = nextScrollY;
}

export function PreviewViewport({
  source,
  mode,
  title = "Canlı önizleme",
  scrollY = 0,
  onScrollChange,
  interactive = true,
  className,
}: PreviewViewportProps) {
  const [availableSize, setAvailableSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const removeFrameListenerRef = useRef<(() => void) | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const lastScrollSyncRef = useRef(0);
  const preset = previewPresets[mode];

  useEffect(() => {
    const element = canvasRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setAvailableSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    removeFrameListenerRef.current?.();
    if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
  }, []);

  useEffect(() => {
    const frameWindow = iframeRef.current?.contentWindow;
    if (!frameWindow) return;
    try {
      applyFrameScroll(frameWindow, scrollY);
    } catch {
      // A temporarily reloading srcDoc may not be available yet.
    }
  }, [scrollY, source]);

  const scale = useMemo(() => {
    if (mode === "fit" || preset.width === null || preset.height === null) return 1;
    if (!availableSize.width || !availableSize.height) return 1;
    const horizontalRoom = Math.max(availableSize.width - 40, 120);
    const verticalRoom = Math.max(availableSize.height - 40, 120);
    return Math.min(1, horizontalRoom / preset.width, verticalRoom / preset.height);
  }, [availableSize, mode, preset.height, preset.width]);

  const fixed = preset.width !== null && preset.height !== null;

  const bindFrameScroll = () => {
    removeFrameListenerRef.current?.();
    removeFrameListenerRef.current = null;

    const frameWindow = iframeRef.current?.contentWindow;
    if (!frameWindow) return;

    try {
      applyFrameScroll(frameWindow, scrollY);
    } catch {
      return;
    }

    if (!interactive || !onScrollChange) return;

    const emitScroll = () => {
      const nextScrollY = Math.max(0, Math.round(frameWindow.scrollY));
      const elapsed = Date.now() - lastScrollSyncRef.current;
      const emit = () => {
        lastScrollSyncRef.current = Date.now();
        scrollTimerRef.current = null;
        onScrollChange(nextScrollY);
      };

      if (elapsed >= SCROLL_SYNC_DELAY) {
        emit();
        return;
      }

      if (scrollTimerRef.current !== null) window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = window.setTimeout(emit, SCROLL_SYNC_DELAY - elapsed);
    };

    frameWindow.addEventListener("scroll", emitScroll, { passive: true });
    removeFrameListenerRef.current = () => frameWindow.removeEventListener("scroll", emitScroll);
  };

  return (
    <div
      ref={canvasRef}
      className={cn("preview-canvas", !interactive && "is-read-only", className)}
      data-preview-viewport={mode}
    >
      <div
        className={cn("preview-device-sizer", mode === "fit" && "is-fit")}
        style={fixed ? { width: `${preset.width! * scale}px`, height: `${preset.height! * scale}px` } : undefined}
      >
        <div
          className={cn("preview-device", `preview-device-${mode}`)}
          style={fixed ? {
            width: `${preset.width!}px`,
            height: `${preset.height!}px`,
            transform: `scale(${scale})`,
          } : undefined}
        >
          <iframe
            ref={iframeRef}
            title={title}
            srcDoc={source}
            sandbox="allow-same-origin"
            className="preview-frame"
            onLoad={bindFrameScroll}
            tabIndex={interactive ? 0 : -1}
          />
        </div>
      </div>
    </div>
  );
}
