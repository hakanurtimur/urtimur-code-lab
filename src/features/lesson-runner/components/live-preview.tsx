"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Expand, Monitor, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";

type LivePreviewProps = { source: string };
type PreviewMode = "fit" | "desktop" | "tablet" | "mobile";
type PreviewPreset = { label: string; width: number | null; height: number | null; icon: typeof Monitor };

const previewPresets: Record<PreviewMode, PreviewPreset> = {
  fit: { label: "Fit", width: null, height: null, icon: Expand },
  desktop: { label: "Desktop", width: 1280, height: 800, icon: Monitor },
  tablet: { label: "Tablet", width: 768, height: 1024, icon: Tablet },
  mobile: { label: "Mobile", width: 390, height: 844, icon: Smartphone },
};

export function LivePreview({ source }: LivePreviewProps) {
  const [mode, setMode] = useState<PreviewMode>("fit");
  const [availableSize, setAvailableSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
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

  const scale = useMemo(() => {
    if (mode === "fit" || preset.width === null || preset.height === null) return 1;
    if (!availableSize.width || !availableSize.height) return 1;
    const horizontalRoom = Math.max(availableSize.width - 40, 120);
    const verticalRoom = Math.max(availableSize.height - 40, 120);
    return Math.min(1, horizontalRoom / preset.width, verticalRoom / preset.height);
  }, [availableSize, mode, preset.height, preset.width]);

  const fixed = preset.width !== null && preset.height !== null;
  const dimensions = fixed ? `${preset.width} × ${preset.height}` : "Alanı doldurur";

  return (
    <div className="preview-shell" data-preview-mode={mode}>
      <div className="preview-toolbar" aria-label="Önizleme boyutu">
        <div className="preview-mode-group">
          {(Object.entries(previewPresets) as Array<[PreviewMode, PreviewPreset]>).map(([value, option]) => {
            const Icon = option.icon;
            return (
              <button
                key={value}
                type="button"
                aria-label={`Önizleme: ${option.label}`}
                aria-pressed={mode === value}
                className={cn("preview-mode-button", mode === value && "is-active")}
                onClick={() => setMode(value)}
              >
                <Icon /><span>{option.label}</span>
              </button>
            );
          })}
        </div>
        <span className="preview-dimensions">{dimensions}</span>
      </div>

      <div ref={canvasRef} className="preview-canvas">
        <div
          className={cn("preview-device-sizer", mode === "fit" && "is-fit")}
          style={fixed ? { width: `${preset.width! * scale}px`, height: `${preset.height! * scale}px` } : undefined}
        >
          <div
            className={cn("preview-device", `preview-device-${mode}`)}
            style={fixed ? { width: `${preset.width!}px`, height: `${preset.height!}px`, transform: `scale(${scale})` } : undefined}
          >
            <iframe title="Canlı önizleme" srcDoc={source} sandbox="" className="preview-frame" />
          </div>
        </div>
      </div>
    </div>
  );
}
