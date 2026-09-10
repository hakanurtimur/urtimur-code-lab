"use client";

import { ChevronLeft, ChevronRight, LockKeyhole, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

type WeekUnlockControlProps = {
  value: number;
  totalWeeks: number;
  busy: boolean;
  onChange: (value: number) => void | Promise<void>;
};

export function WeekUnlockControl({ value, totalWeeks, busy, onChange }: WeekUnlockControlProps) {
  const safeValue = Math.min(totalWeeks, Math.max(1, value));

  return (
    <section className="week-unlock-control" aria-label="Öğrenci rota erişimi">
      <div className="week-unlock-heading">
        <span className="week-unlock-icon"><Route /></span>
        <div><span className="surface-kicker">ROTA ERİŞİMİ</span><h4>Açık rota: Hafta {safeValue} / {totalWeeks}</h4><p>Öğrenci bu haftaya kadar tüm dersleri açabilir.</p></div>
      </div>
      <div className="week-unlock-track" aria-hidden="true">
        {Array.from({ length: totalWeeks }, (_, index) => (
          <span key={index} className={index + 1 <= safeValue ? "is-unlocked" : ""}>{index + 1 <= safeValue ? index + 1 : <LockKeyhole />}</span>
        ))}
      </div>
      <div className="week-unlock-actions">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy || safeValue <= 1}
          onClick={() => void onChange(safeValue - 1)}
        >
          <ChevronLeft /> Önceki haftayı kilitle
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={busy || safeValue >= totalWeeks}
          onClick={() => void onChange(safeValue + 1)}
        >
          Sonraki haftayı aç <ChevronRight />
        </Button>
      </div>
    </section>
  );
}
