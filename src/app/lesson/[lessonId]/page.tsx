import { notFound } from "next/navigation";
import { getLessonById, getWeekForLesson } from "@/features/curriculum/get-lesson";
import { StudentGate } from "@/features/auth/student-gate";
import { LessonWorkspace } from "@/features/lesson-runner/components/lesson-workspace";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);
  if (!lesson) notFound();

  const week = getWeekForLesson(lesson);
  if (!week) notFound();

  return (
    <StudentGate>
      <LessonWorkspace lesson={lesson} week={week} />
    </StudentGate>
  );
}
