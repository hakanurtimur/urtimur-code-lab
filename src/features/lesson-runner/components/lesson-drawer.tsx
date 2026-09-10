"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Circle, LockKeyhole, Map, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CurriculumWeek, Lesson } from "@/features/curriculum/types";
import type { LearningPathLessonState } from "@/features/curriculum/learning-path-state";

type LessonDrawerProps = {
  open: boolean;
  onClose: () => void;
  week: CurriculumWeek;
  currentLesson: Lesson;
  lessons: LearningPathLessonState[];
};

export function LessonDrawer({ open, onClose, week, currentLesson, lessons }: LessonDrawerProps) {
  const reduceMotion = useReducedMotion();
  const completedCount = lessons.filter((item) => item.state === "completed").length;
  const progressPercent = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => dialogRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hasAttribute("hidden"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="lesson-drawer-backdrop"
            aria-label="Ders listesi dışına tıkla ve kapat"
            onClick={onClose}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
          />
          <motion.aside
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Hafta ${week.order} dersleri`}
            className="lesson-drawer"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={reduceMotion ? undefined : { x: 0 }}
            exit={reduceMotion ? undefined : { x: "100%" }}
            transition={{ type: "spring", stiffness: 330, damping: 34 }}
          >
            <div className="lesson-drawer-header">
              <div><span className="surface-kicker">HAFTA {week.order}</span><h2>{week.theme}</h2><p>{week.title}</p></div>
              <Button type="button" variant="ghost" size="icon" aria-label="Ders listesini kapat" onClick={onClose}><X /></Button>
            </div>
            <div className="lesson-drawer-progress">
              <span>{completedCount}/{lessons.length} ders tamam</span>
              <i><b style={{ width: `${progressPercent}%` }} /></i>
            </div>
            <nav className="lesson-drawer-list" aria-label="Bu haftanın dersleri">
              {lessons.map((item, index) => {
                const selected = item.lesson.id === currentLesson.id;
                const Icon = item.state === "completed" ? Check : item.state === "locked" ? LockKeyhole : Circle;
                return (
                  <Link
                    key={item.lesson.id}
                    href={`/lesson/${item.lesson.id}`}
                    onClick={onClose}
                    className={cn("lesson-drawer-item", selected && "is-current", item.state === "completed" && "is-complete")}
                    aria-current={selected ? "page" : undefined}
                  >
                    <span className="lesson-drawer-index">{item.state === "completed" ? <Icon /> : index + 1}</span>
                    <span><small>{item.lesson.eyebrow}</small><strong>{item.lesson.title}</strong></span>
                    <ArrowRight />
                  </Link>
                );
              })}
            </nav>
            <Button asChild variant="outline" className="lesson-drawer-path-link">
              <Link href="/#learning-path" onClick={onClose}><Map /> Tüm öğrenme rotasını aç</Link>
            </Button>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
