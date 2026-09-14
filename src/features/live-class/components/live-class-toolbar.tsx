"use client";

import { Eye, Monitor, Pause, Play, Radio, Square, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PreviewPreset } from "@/features/live-session/types";
import type { LiveClassSpotlight, LiveClassStatus, LiveClassSyncState } from "../types";

const spotlightOptions: Array<{ value: LiveClassSpotlight; label: string }> = [
  { value: "split", label: "Bölünmüş" },
  { value: "code", label: "Kod" },
  { value: "browser", label: "Browser" },
];
const presets: PreviewPreset[] = ["fit", "desktop", "tablet", "mobile"];

type Props = {
  title: string;
  status: LiveClassStatus;
  syncState: LiveClassSyncState;
  viewerCount: number;
  spotlight: LiveClassSpotlight;
  previewPreset: PreviewPreset;
  onTitleChange: (value: string) => void;
  onSpotlightChange: (value: LiveClassSpotlight) => void;
  onPreviewPresetChange: (value: PreviewPreset) => void;
  onFreeze: () => void;
  onResume: () => void;
  onEnd: () => void;
};

export function LiveClassToolbar({
  title,
  status,
  syncState,
  viewerCount,
  spotlight,
  previewPreset,
  onTitleChange,
  onSpotlightChange,
  onPreviewPresetChange,
  onFreeze,
  onResume,
  onEnd,
}: Props) {
  return (
    <div className="live-class-toolbar">
      <div className="live-class-toolbar-primary">
        <Badge variant={status === "live" ? "success" : "outline"}><Radio /> {status === "live" ? "CANLI" : "DONDURULDU"}</Badge>
        <input value={title} onChange={(event) => onTitleChange(event.target.value)} aria-label="Canlı ders başlığı" />
        <span className="live-class-viewer-count"><Users /> {viewerCount} izleyici</span>
        <span className={`live-class-sync-state is-${syncState}`}>{syncState === "saving" ? "Kaydediliyor…" : syncState === "error" ? "Bağlantı sorunu" : "Senkron"}</span>
      </div>

      <div className="live-class-toolbar-secondary">
        <div className="live-class-segment" aria-label="Sunum odağı">
          <Eye />
          {spotlightOptions.map((option) => (
            <button key={option.value} type="button" className={spotlight === option.value ? "is-active" : ""} onClick={() => onSpotlightChange(option.value)}>{option.label}</button>
          ))}
        </div>
        <div className="live-class-segment" aria-label="Browser cihazı">
          <Monitor />
          {presets.map((preset) => (
            <button key={preset} type="button" className={previewPreset === preset ? "is-active" : ""} onClick={() => onPreviewPresetChange(preset)}>{preset === "fit" ? "Fit" : preset[0].toUpperCase() + preset.slice(1)}</button>
          ))}
        </div>
        {status === "live" ? <Button variant="outline" onClick={onFreeze}><Pause /> Freeze</Button> : <Button variant="outline" onClick={onResume}><Play /> Yayına dön</Button>}
        <Button className="live-class-end-button" onClick={onEnd}><Square /> Dersi bitir</Button>
      </div>
    </div>
  );
}
