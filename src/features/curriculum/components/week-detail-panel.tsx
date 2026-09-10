"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Code2,
  FlaskConical,
  LockKeyhole,
  Route,
  Target,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CurriculumWeek } from "../types";

type WeekDetailPanelProps = {
  week: CurriculumWeek;
  completedIds: string[];
};

export function WeekDetailPanel({ week, completedIds }: WeekDetailPanelProps) {
  const reduceMotion = useReducedMotion();
  const locked = week.fccStatus === "upcoming";

  return (
    <motion.section
      id={`week-detail-${week.id}`}
      className="week-detail-panel"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      key={week.id}
    >
      <div className="week-detail-header">
        <div>
          <span className="surface-kicker">HAFTA {week.order} · FCC {week.fccSteps.start}–{week.fccSteps.end}</span>
          <h3>{week.theme}</h3>
          <p>{week.summary}</p>
        </div>
        <div className="weekly-build-pill">
          <FlaskConical />
          <span><small>HAFTALIK BUILD</small><strong>{week.weeklyBuild}</strong></span>
        </div>
      </div>

      <div className="week-detail-grid">
        <section className="week-detail-card week-detail-fcc">
          <div className="week-detail-title"><Route /><span><small>ÖNCE FCC&apos;DE</small><strong>Bu blokları ilerlet</strong></span></div>
          <div className="fcc-learning-blocks">
            {week.fccBlocks.map((block) => (
              <div key={`${week.id}-${block.title}-${block.scope ?? ""}`}>
                <Badge variant="outline">{block.type}</Badge>
                <span><strong>{block.title}</strong>{block.scope ? <small>{block.scope}</small> : null}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="week-detail-card week-detail-outcomes">
          <div className="week-detail-title"><Target /><span><small>BU HAFTA</small><strong>5 kazanım</strong></span></div>
          <ol>
            {week.outcomes.map((outcome, index) => (
              <li key={outcome.id}><span>{index + 1}</span><p>{outcome.text}</p></li>
            ))}
          </ol>
        </section>
      </div>

      <section className="companion-lessons-section">
        <div className="companion-lessons-heading">
          <div className="week-detail-title"><Code2 /><span><small>SONRA CODE LAB&apos;DE</small><strong>Özgün tekrar görevleri</strong></span></div>
          <span>{week.lessons.length} ders</span>
        </div>
        <div className="companion-lesson-grid">
          {week.lessons.map((lesson, index) => {
            const completed = completedIds.includes(lesson.id);
            return (
              <article className={cn("companion-lesson-card", completed && "is-complete", locked && "is-locked")} key={lesson.id}>
                <div className="companion-lesson-index">{completed ? <Check /> : index + 1}</div>
                <div className="companion-lesson-copy">
                  <span>{lesson.eyebrow}</span>
                  <strong>{lesson.title}</strong>
                  <p>{lesson.description}</p>
                </div>
                {locked ? (
                  <span className="lesson-locked-label"><LockKeyhole /> FCC sırası gelince açılır</span>
                ) : (
                  <Button asChild variant={completed ? "outline" : "default"} size="sm">
                    <Link href={`/lesson/${lesson.id}`}>
                      {completed ? "Tekrar aç" : "Çalışmayı aç"} <ArrowRight />
                    </Link>
                  </Button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <div className="week-detail-tip"><BookOpenCheck /><p><strong>Öğrenme sırası:</strong> önce FCC bloğunu tamamla, sonra burada aynı bilgiyi farklı bir problem üzerinde kullan.</p></div>
    </motion.section>
  );
}
