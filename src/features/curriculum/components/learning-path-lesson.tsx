"use client";

import Link from "next/link";
import { ArrowRight, Check, Circle, LockKeyhole, Play } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LearningPathLessonState } from "../learning-path-state";

type LearningPathLessonProps = {
  item: LearningPathLessonState;
  index: number;
  reduceMotion: boolean;
};

const labels = {
  completed: "Tamamlandı",
  current: "Sıradaki ders",
  available: "Açık",
  locked: "Kilitli",
} as const;

export function LearningPathLesson({ item, index, reduceMotion }: LearningPathLessonProps) {
  const { lesson, state } = item;
  const Icon = state === "completed" ? Check : state === "current" ? Play : state === "locked" ? LockKeyhole : Circle;

  return (
    <motion.article
      className={cn("learning-path-lesson", `is-${state}`)}
      data-lesson-state={state}
      initial={reduceMotion ? false : { opacity: 0, x: -10 }}
      animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.045, duration: 0.24 }}
    >
      <div className="learning-path-lesson-rail" aria-hidden="true">
        <span><Icon /></span>
      </div>
      <div className="learning-path-lesson-copy">
        <span>{labels[state]} · {lesson.eyebrow}</span>
        <strong>{lesson.title}</strong>
        <p>{lesson.description}</p>
      </div>
      <div className="learning-path-lesson-action">
        {state === "locked" ? (
          <span className="learning-path-lock-label"><LockKeyhole /> Gelecek rota</span>
        ) : (
          <Button
            asChild
            size={state === "current" ? "default" : "sm"}
            variant={state === "current" ? "default" : "outline"}
            className={state === "current" ? "learning-path-primary-action" : undefined}
          >
            <Link href={`/lesson/${lesson.id}`}>
              {state === "completed" ? "Tekrar aç" : state === "current" ? "Derse devam et" : "Dersi aç"}
              <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
    </motion.article>
  );
}
