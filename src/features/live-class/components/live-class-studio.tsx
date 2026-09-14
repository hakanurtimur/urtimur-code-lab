"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Radio, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { TeacherSessionControls } from "@/features/auth/session-controls";
import { cn } from "@/lib/utils";
import { LIVE_CLASS_TEMPLATES } from "../types";
import { useLiveClassStudio } from "../use-live-class-studio";
import { LiveClassEditor } from "./live-class-editor";
import { LiveClassPreview } from "./live-class-preview";
import { LiveClassToolbar } from "./live-class-toolbar";

export function LiveClassStudio() {
  const studio = useLiveClassStudio();
  const [setupTitle, setSetupTitle] = useState("HTML Canlı Kod Atölyesi");
  const [setupTemplate, setSetupTemplate] = useState("starter");
  const [starting, setStarting] = useState(false);

  const start = async () => {
    setStarting(true);
    await studio.startClass(setupTitle, setupTemplate);
    setStarting(false);
  };

  const end = () => {
    if (window.confirm("Canlı dersi bitirmek istediğine emin misin?")) void studio.endClass();
  };

  if (studio.loading) {
    return <main className="live-class-loading"><Brand /><Radio /><strong>Canlı ders stüdyosu hazırlanıyor…</strong></main>;
  }

  if (!studio.isActive) {
    return (
      <main className="live-class-setup-page">
        <header className="live-class-shell-header"><Brand /><TeacherSessionControls /></header>
        <section className="live-class-setup-card">
          <div className="live-class-setup-copy"><span>CANLI DERS STÜDYOSU</span><h1>Tarayıcıyı tahtaya çevir.</h1><p>HTML, CSS ve JavaScript&apos;i çocuklara canlı göster. Öğrenciler kendi dashboard&apos;larından isteyerek katılır.</p></div>
          <label><span>Ders başlığı</span><input value={setupTitle} onChange={(event) => setSetupTitle(event.target.value)} placeholder="Örn. HTML'de linkler" /></label>
          <div className="live-class-template-grid" role="group" aria-label="Başlangıç şablonu">
            {LIVE_CLASS_TEMPLATES.map((template) => (
              <button key={template.id} type="button" className={setupTemplate === template.id ? "is-selected" : ""} onClick={() => setSetupTemplate(template.id)}>
                <Sparkles /><strong>{template.label}</strong><span>{template.description}</span>
              </button>
            ))}
          </div>
          {studio.error ? <p className="live-class-error" role="alert">{studio.error}</p> : null}
          <div className="live-class-setup-actions"><Button asChild variant="ghost"><Link href="/teacher"><ArrowLeft /> Teacher paneline dön</Link></Button><Button size="lg" disabled={starting} onClick={() => void start()}><Radio /> {starting ? "Başlatılıyor…" : "Canlı dersi başlat"}</Button></div>
        </section>
      </main>
    );
  }

  return (
    <main className="live-class-studio-page">
      <header className="live-class-shell-header">
        <div><Brand /><Link href="/teacher" className="live-class-back-link"><ArrowLeft /> Teacher paneli</Link></div>
        <TeacherSessionControls />
      </header>

      <LiveClassToolbar
        title={studio.title}
        status={studio.status === "frozen" ? "frozen" : "live"}
        syncState={studio.syncState}
        viewerCount={studio.viewerCount}
        spotlight={studio.spotlight}
        previewPreset={studio.previewPreset}
        onTitleChange={studio.setTitle}
        onSpotlightChange={studio.setSpotlight}
        onPreviewPresetChange={studio.setPreviewPreset}
        onFreeze={() => void studio.freezeClass()}
        onResume={() => void studio.resumeClass()}
        onEnd={end}
      />

      {studio.status === "frozen" ? <div className="live-class-freeze-strip"><strong>Yayın donduruldu.</strong><span>Sen düzenlemeye devam edebilirsin; öğrenciler son yayınlanan kodu görüyor.</span></div> : null}
      {studio.error ? <div className="live-class-error live-class-studio-error" role="alert">{studio.error}</div> : null}

      <section className={cn("live-class-stage", `is-${studio.spotlight}`)}>
        <div className="live-class-code-column">
          <div className="live-class-template-strip">
            <span>Hazır örnek:</span>
            {LIVE_CLASS_TEMPLATES.map((template) => <button key={template.id} type="button" onClick={() => studio.applyTemplate(template.id)}>{template.label}</button>)}
          </div>
          <LiveClassEditor draft={studio.draft} onActiveFileChange={studio.setActiveFile} onChangeFile={studio.updateFile} onCursorLineChange={studio.setCursorLine} />
        </div>
        <LiveClassPreview draft={studio.draft} preset={studio.previewPreset} title="Teacher canlı ders browser" />
      </section>
    </main>
  );
}
