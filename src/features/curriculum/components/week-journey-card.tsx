"use client";

import { Check, ChevronRight, LockKeyhole, Radio } from "lucide-react";
import { CircularProgress } from "@/components/circular-progress";
import { LearningSticker } from "@/components/learning-sticker";
import { cn } from "@/lib/utils";
import type { CurriculumWeek } from "../types";

const toneByWeek = ["violet", "sky", "peach", "mint", "pink", "yellow", "violet", "sky"] as const;
const iconByStatus = {
  completed: Check,
  current: Radio,
  upcoming: LockKeyhole,
} as const;

type WeekJourneyCardProps = {
  week: CurriculumWeek;
  completedLessons: number;
  selected: boolean;
  onSelect: () => void;
};

export function WeekJourneyCard({ week, completedLessons, selected, onSelect }: WeekJourneyCardProps) {
  const percent = Math.round((completedLessons / week.lessons.length) * 100);
  const tone = toneByWeek[(week.order - 1) % toneByWeek.length];
  const StatusIcon = iconByStatus[week.fccStatus];

  return (
    <button
      type="button"
      className={cn("week-journey-card", `week-journey-${tone}`, selected && "is-selected")}
      data-week-card={week.id}
      aria-pressed={selected}
      aria-controls={`week-detail-${week.id}`}
      onClick={onSelect}
    >
      <div className="week-journey-topline">
        <LearningSticker icon={StatusIcon} label={`Hafta ${week.order} durumu`} tone={tone} size="sm" />
        <span className="week-journey-number">{String(week.order).padStart(2, "0")}</span>
        <CircularProgress value={percent} size={52} strokeWidth={5} tone={tone === "yellow" ? "peach" : tone === "pink" ? "violet" : tone}>
          <strong>{completedLessons}/{week.lessons.length}</strong>
        </CircularProgress>
      </div>
      <div className="week-journey-copy">
        <span>HAFTA {week.order}</span>
        <strong>{week.theme}</strong>
        <p>{week.title}</p>
      </div>
      <div className="week-journey-foot">
        <span>{week.fccStatus === "completed" ? "FCC tamam" : week.fccStatus === "current" ? "Şimdi burada" : "Sırada"}</span>
        <ChevronRight />
      </div>
    </button>
  );
}
