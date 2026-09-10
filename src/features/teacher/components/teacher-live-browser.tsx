"use client";

import { Monitor, Radio } from "lucide-react";
import { PreviewViewport, previewPresets } from "@/features/lesson-runner/components/preview-viewport";
import type { LiveSessionRecord } from "../types";

type TeacherLiveBrowserProps = {
  session: LiveSessionRecord | null;
  studentName: string;
};

export function TeacherLiveBrowser({ session, studentName }: TeacherLiveBrowserProps) {
  const mode = session?.previewPreset ?? "fit";
  const preset = previewPresets[mode];
  const dimensions = preset.width && preset.height
    ? `${preset.label} · ${preset.width} × ${preset.height}`
    : `${preset.label} · alanı doldurur`;
  const source = session?.code ?? "<!doctype html><html><body><p>Öğrenci önizlemeyi açtığında browser sonucu burada görünecek.</p></body></html>";

  return (
    <section className="teacher-live-browser" aria-label={`${studentName} canlı browser görünümü`}>
      <header className="teacher-live-browser-header">
        <span><Monitor /> Canlı browser</span>
        <strong>{dimensions}</strong>
        <small><Radio /> Öğrencinin Code Lab önizlemesi</small>
      </header>
      <div className="teacher-live-browser-stage">
        <PreviewViewport
          source={source}
          mode={mode}
          scrollY={session?.previewScrollY ?? 0}
          interactive={false}
          title={`${studentName} canlı tarayıcı`}
        />
      </div>
    </section>
  );
}
