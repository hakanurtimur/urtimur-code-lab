"use client";

import { PreviewViewport } from "@/features/lesson-runner/components/preview-viewport";
import type { PreviewPreset } from "@/features/live-session/types";
import { composeLiveClassDocument } from "../live-class-utils";
import type { LiveClassDraft } from "../types";

type LiveClassPreviewProps = {
  draft: Pick<LiveClassDraft, "html" | "css" | "js">;
  preset: PreviewPreset;
  title?: string;
};

export function LiveClassPreview({ draft, preset, title = "Canlı ders browser" }: LiveClassPreviewProps) {
  const source = composeLiveClassDocument(draft.html, draft.css, draft.js);
  return (
    <section className="live-class-preview" aria-label="Canlı ders browser">
      <div className="live-class-browser-bar">
        <span><i /><i /><i /></span>
        <strong>preview.local</strong>
        <small>{preset === "fit" ? "Fit" : preset}</small>
      </div>
      <div className="live-class-preview-stage">
        <PreviewViewport
          source={source}
          mode={preset}
          title={title}
          sandbox="allow-scripts"
          interactive
          className="live-class-preview-viewport"
        />
      </div>
    </section>
  );
}
