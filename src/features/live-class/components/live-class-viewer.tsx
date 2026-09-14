"use client";

import Link from "next/link";
import { ArrowLeft, PauseCircle, Radio, Wifi, WifiOff } from "lucide-react";
import { Brand } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudentSessionControls } from "@/features/auth/session-controls";
import { cn } from "@/lib/utils";
import { useLiveClassViewer } from "../use-live-class-viewer";
import type { LiveClassDraft } from "../types";
import { LiveClassEditor } from "./live-class-editor";
import { LiveClassPreview } from "./live-class-preview";

export function LiveClassViewer() {
  const { discovery, session, loading, error } = useLiveClassViewer();

  if (loading) return <main className="live-class-loading"><Brand /><Radio /><strong>Canlı yayın bağlanıyor…</strong></main>;

  if (!session || !discovery) {
    return (
      <main className="live-class-empty-page">
        <Brand />
        <WifiOff />
        <h1>Şu anda canlı ders yok.</h1>
        <p>Öğretmenin yeni bir yayın başlattığında dashboard&apos;unda haber vereceğiz.</p>
        <Button asChild><Link href="/"><ArrowLeft /> Dashboard&apos;a dön</Link></Button>
      </main>
    );
  }

  if (session.status === "ended" || discovery.active === false) {
    return (
      <main className="live-class-empty-page">
        <Brand />
        <Radio />
        <h1>Canlı ders sona erdi.</h1>
        <p>{session.title} yayını tamamlandı. Normal öğrenme rotana dönebilirsin.</p>
        <Button asChild><Link href="/"><ArrowLeft /> Dashboard&apos;a dön</Link></Button>
      </main>
    );
  }

  const draft: LiveClassDraft = {
    html: session.html,
    css: session.css,
    js: session.js,
    activeFile: session.activeFile,
    cursorLine: session.cursorLine,
    updatedAtMs: session.updatedAtMs,
  };

  return (
    <main className="live-class-viewer-page">
      <header className="live-class-viewer-header">
        <div><Brand /><Button asChild variant="ghost" size="sm"><Link href="/"><ArrowLeft /> Dashboard</Link></Button></div>
        <div className="live-class-viewer-title"><Badge variant={session.status === "live" ? "success" : "outline"}>{session.status === "live" ? <Radio /> : <PauseCircle />}{session.status === "live" ? "CANLI" : "DONDURULDU"}</Badge><span><strong>{session.title}</strong><small>Hakan Hoca anlatıyor · kod alanı salt okunur</small></span></div>
        <StudentSessionControls />
      </header>

      {session.status === "frozen" ? <div className="live-class-student-freeze"><PauseCircle /><span><strong>Yayın kısa süreliğine donduruldu.</strong><small>Öğretmenin kaldığı yerden devam ettiğinde ekran otomatik güncellenecek.</small></span></div> : null}
      {error ? <div className="live-class-reconnect"><Wifi /><span>{error} Son yayınlanan içerik ekranda tutuluyor.</span></div> : null}

      <section className={cn("live-class-stage live-class-student-stage", `is-${session.spotlight}`)}>
        <div className="live-class-code-column">
          <div className="live-class-following"><Radio /><span>Öğretmenin aktif dosyası: <strong>{session.activeFile === "html" ? "index.html" : session.activeFile === "css" ? "style.css" : "script.js"}</strong> · satır {session.cursorLine}</span></div>
          <LiveClassEditor draft={draft} readOnly />
        </div>
        <LiveClassPreview draft={draft} preset={session.previewPreset} title="Öğrenci canlı ders browser" />
      </section>
    </main>
  );
}
