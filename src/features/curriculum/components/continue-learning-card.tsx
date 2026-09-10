"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CodeBuddyIllustration } from "@/components/code-buddy-illustration";
import { CircularProgress } from "@/components/circular-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CurriculumWeek, Lesson } from "../types";

type ContinueLearningCardProps = {
  week: CurriculumWeek;
  lesson: Lesson;
  curriculumPercent: number;
  weekPercent: number;
  studentName: string;
  reviewMode?: boolean;
};

export function ContinueLearningCard({
  week,
  lesson,
  curriculumPercent,
  weekPercent,
  studentName,
  reviewMode = false,
}: ContinueLearningCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="continue-learning-card"
      data-section="continue"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.34 }}
    >
      <div className="continue-card-copy">
        <div className="continue-card-badges">
          <Badge className="soft-badge soft-badge-white"><Sparkles /> {reviewMode ? "Açık rota tamam" : "Bu haftanın görevi"}</Badge>
          <span><MapPin /> FCC {week.fccSteps.start}–{week.fccSteps.end} / 137</span>
        </div>

        <div>
          <p className="continue-greeting">Merhaba {studentName},</p>
          <h1>{week.theme}</h1>
          <p className="continue-lesson-title">{reviewMode ? "Tekrar açabileceğin ders" : "Sıradaki ders"}: <strong>{lesson.title}</strong></p>
          <p className="continue-summary">{week.summary}</p>
        </div>

        <div className="continue-card-actions">
          <Button asChild size="lg" className="continue-primary-action">
            <Link href={`/lesson/${lesson.id}`}>
              {reviewMode ? "Dersi tekrar aç" : "Derse devam et"} <ArrowRight />
            </Link>
          </Button>
          <span className="continue-save-note"><CheckCircle2 /> İlerlemen otomatik kaydedilir</span>
        </div>
      </div>

      <div className="continue-card-visual" aria-hidden="true">
        <span className="continue-orbit continue-orbit-one" />
        <span className="continue-orbit continue-orbit-two" />
        <CodeBuddyIllustration className="continue-buddy" mood="wave" />
        <div className="continue-progress-float">
          <CircularProgress value={curriculumPercent} size={82} strokeWidth={8} tone="peach" label={`Basic HTML yüzde ${curriculumPercent} tamamlandı`}>
            <span><strong>{curriculumPercent}%</strong><small>genel</small></span>
          </CircularProgress>
        </div>
        <div className="continue-week-progress">
          <span>Hafta {week.order}</span>
          <strong>{weekPercent}%</strong>
          <i><b style={{ width: `${weekPercent}%` }} /></i>
        </div>
      </div>
    </motion.article>
  );
}
