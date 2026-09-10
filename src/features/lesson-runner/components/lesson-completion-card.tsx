"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Map, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CodeBuddyIllustration } from "@/components/code-buddy-illustration";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/features/curriculum/types";
import type { LessonCompletionHandoff } from "@/features/curriculum/lesson-navigation";

type LessonCompletionCardProps = {
  lesson: Lesson;
  handoff: LessonCompletionHandoff;
  completed: boolean;
  completing: boolean;
  error?: string;
  onCompleteStay: () => void | Promise<void>;
  onCompleteAndNavigate: (href: string) => void | Promise<void>;
};

export function LessonCompletionCard({
  lesson,
  handoff,
  completed,
  completing,
  error,
  onCompleteStay,
  onCompleteAndNavigate,
}: LessonCompletionCardProps) {
  const reduceMotion = useReducedMotion();
  const nextHref = handoff.nextLesson ? `/lesson/${handoff.nextLesson.id}` : null;
  const waitingForTeacher = Boolean(
    handoff.weekComplete && handoff.nextWeek && !handoff.nextWeekUnlocked,
  );

  return (
    <motion.div
      className="lesson-completion-card"
      aria-live="polite"
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 330, damping: 27 }}
    >
      <div className="lesson-completion-celebration" aria-hidden="true">
        <span className="completion-spark completion-spark-one"><Sparkles /></span>
        <span className="completion-spark completion-spark-two"><Sparkles /></span>
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -4, 0], rotate: [0, -1.5, 1.5, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <CodeBuddyIllustration className="lesson-completion-buddy" mood="celebrate" />
        </motion.div>
      </div>

      <div className="lesson-completion-copy">
        <span>{handoff.weekComplete ? "HAFTA TAMAMLANDI" : "DERS TAMAMLANDI"}</span>
        <h3>{handoff.weekComplete ? "Bu rotadaki tüm görevleri çözdün." : "Tüm kontroller geçti."}</h3>
        {handoff.nextLesson ? (
          <p>Sıradaki: <strong>{handoff.nextLesson.title}</strong></p>
        ) : null}
        {waitingForTeacher ? (
          <p className="completion-wait-copy"><Clock3 /> Sonraki rota öğretmenin açtığında burada görünecek.</p>
        ) : null}
        {handoff.curriculumComplete ? <p>Basic HTML rotasının sonuna geldin. Harika iş!</p> : null}
        {error ? <p className="completion-error" role="alert">{error}</p> : null}
      </div>

      <div className="lesson-completion-actions">
        {nextHref ? (
          completed ? (
            <Button asChild size="lg">
              <Link href={nextHref}>
                {handoff.nextLessonStartsNewWeek ? "Sonraki haftayı keşfet" : "Sıradaki derse geç"} <ArrowRight />
              </Link>
            </Button>
          ) : (
            <Button size="lg" disabled={completing} onClick={() => void onCompleteAndNavigate(nextHref)}>
              {completing
                ? "Kaydediliyor…"
                : handoff.nextLessonStartsNewWeek
                  ? "Tamamla ve sonraki haftayı keşfet"
                  : "Tamamla ve sıradakine geç"}
              {!completing ? <ArrowRight /> : null}
            </Button>
          )
        ) : completed ? (
          <Button asChild variant="outline"><Link href="/#learning-path"><Map /> Hafta rotasına dön</Link></Button>
        ) : (
          <Button size="lg" disabled={completing} onClick={() => void onCompleteStay()}>
            {completing ? "Kaydediliyor…" : "Dersi tamamla"}<CheckCircle2 />
          </Button>
        )}

        {nextHref && !completed ? (
          <Button variant="ghost" disabled={completing} onClick={() => void onCompleteStay()}>Tamamla, bu derste kal</Button>
        ) : null}
        {completed ? <Badge variant="success"><CheckCircle2 /> Kaydedildi</Badge> : null}
      </div>
      <small className="lesson-completion-lesson-name">{lesson.title}</small>
    </motion.div>
  );
}
