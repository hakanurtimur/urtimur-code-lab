"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  PreviewViewport,
  previewPresets,
  type PreviewPreset,
} from "./preview-viewport";

export type { PreviewPreset } from "./preview-viewport";

type LivePreviewProps = {
  source: string;
  mode?: PreviewPreset;
  onModeChange?: (mode: PreviewPreset) => void;
  scrollY?: number;
  onScrollChange?: (scrollY: number) => void;
};

export function LivePreview({
  source,
  mode,
  onModeChange,
  scrollY = 0,
  onScrollChange,
}: LivePreviewProps) {
  const [internalMode, setInternalMode] = useState<PreviewPreset>("fit");
  const selectedMode = mode ?? internalMode;
  const preset = previewPresets[selectedMode];
  const fixed = preset.width !== null && preset.height !== null;
  const dimensions = fixed ? `${preset.width} × ${preset.height}` : "Alanı doldurur";

  const selectMode = (nextMode: PreviewPreset) => {
    if (mode === undefined) setInternalMode(nextMode);
    onModeChange?.(nextMode);
  };

  return (
    <div className="preview-shell" data-preview-mode={selectedMode}>
      <div className="preview-toolbar" aria-label="Önizleme boyutu">
        <div className="preview-mode-group">
          {(Object.entries(previewPresets) as Array<[PreviewPreset, (typeof previewPresets)[PreviewPreset]]>).map(([value, option]) => {
            const Icon = option.icon;
            return (
              <button
                key={value}
                type="button"
                aria-label={`Önizleme: ${option.label}`}
                aria-pressed={selectedMode === value}
                className={cn("preview-mode-button", selectedMode === value && "is-active")}
                onClick={() => selectMode(value)}
              >
                <Icon /><span>{option.label}</span>
              </button>
            );
          })}
        </div>
        <span className="preview-dimensions">{dimensions}</span>
      </div>

      <PreviewViewport
        source={source}
        mode={selectedMode}
        scrollY={scrollY}
        onScrollChange={onScrollChange}
      />
    </div>
  );
}
