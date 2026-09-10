"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronLeft, ListTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/features/curriculum/types";

type LessonNavigationProps = {
  weekOrder: number;
  totalWeeks: number;
  lessonIndex: number;
  totalLessons: number;
  previousLesson: Lesson | null;
  onOpenDrawer: () => void;
};

export function LessonNavigation({
  weekOrder,
  totalWeeks,
  lessonIndex,
  totalLessons,
  previousLesson,
  onOpenDrawer,
}: LessonNavigationProps) {
  return (
    <div className="lesson-navigation" aria-label="Ders konumu">
      <Button asChild variant="ghost" size="sm" className="lesson-nav-curriculum">
        <Link href="/#learning-path"><ArrowLeft /><span>Müfredat</span></Link>
      </Button>
      <span className="lesson-navigation-divider" aria-hidden="true" />
      <div className="lesson-position-copy">
        <span><BookOpen /> Hafta {weekOrder} / {totalWeeks}</span>
        <strong>Ders {lessonIndex + 1} / {totalLessons}</strong>
      </div>
      {previousLesson ? (
        <Button asChild variant="ghost" size="icon" className="lesson-previous-link">
          <Link href={`/lesson/${previousLesson.id}`} aria-label={`Önceki ders: ${previousLesson.title}`}><ChevronLeft /></Link>
        </Button>
      ) : null}
      <Button type="button" variant="outline" size="sm" onClick={onOpenDrawer} className="lesson-drawer-trigger">
        <ListTree /> Tüm dersler
      </Button>
    </div>
  );
}
