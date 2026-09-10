"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Cloud,
  Code2,
  Layers3,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { CurriculumModule } from "./types";
import { useCompletedLessonIds } from "@/features/progress/use-completed-lesson-ids";
import { useAuthSession } from "@/features/auth/auth-provider";
import { StudentSessionControls } from "@/features/auth/session-controls";
import { Brand } from "@/components/brand";
import { LearningSticker } from "@/components/learning-sticker";
import { Progress } from "@/components/ui/progress";
import { ContinueLearningCard } from "./components/continue-learning-card";
import { WeekJourneyCard } from "./components/week-journey-card";
import { WeekDetailPanel } from "./components/week-detail-panel";

function firstName(value: string | null | undefined) {
  return value?.trim().split(/\s+/)[0] || "Coder";
}

type CurriculumDashboardProps = {
  modules: CurriculumModule[];
};

export function CurriculumDashboard({ modules }: CurriculumDashboardProps) {
  const completedIds = useCompletedLessonIds();
  const { user } = useAuthSession();
  const reduceMotion = useReducedMotion();
  const weeks = useMemo(() => modules.flatMap((module) => module.weeks), [modules]);
  const allLessons = useMemo(() => weeks.flatMap((week) => week.lessons), [weeks]);

  const actionableWeek =
    weeks.find((week) => week.fccStatus !== "upcoming" && week.lessons.some((lesson) => !completedIds.includes(lesson.id))) ??
    weeks.find((week) => week.fccStatus === "current") ??
    weeks[0];
  const [selectedWeekId, setSelectedWeekId] = useState(actionableWeek?.id ?? weeks[0]?.id ?? "");
  const selectedWeek = weeks.find((week) => week.id === selectedWeekId) ?? actionableWeek ?? weeks[0];
  const continueLesson = actionableWeek?.lessons.find((lesson) => !completedIds.includes(lesson.id)) ?? actionableWeek?.lessons[0];

  const completedCount = allLessons.filter((lesson) => completedIds.includes(lesson.id)).length;
  const completionPercent = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const weekCompletedCount = actionableWeek?.lessons.filter((lesson) => completedIds.includes(lesson.id)).length ?? 0;
  const weekPercent = actionableWeek?.lessons.length ? Math.round((weekCompletedCount / actionableWeek.lessons.length) * 100) : 0;

  return (
    <main className="student-dashboard-page" data-dashboard="student">
      <div className="student-dashboard-blob student-dashboard-blob-one" aria-hidden="true" />
      <div className="student-dashboard-blob student-dashboard-blob-two" aria-hidden="true" />

      <header className="student-shell-header">
        <Brand />
        <div className="student-shell-actions">
          <span className="curriculum-pill"><Code2 /> Responsive Web Design</span>
          <StudentSessionControls />
        </div>
      </header>

      <div className="student-dashboard-shell">
        <section className="dashboard-welcome-row">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          >
            <span className="surface-kicker">HAKAN URTIMUR CODE LAB</span>
            <h2>Bugün ne inşa ediyoruz, {firstName(user?.displayName)}?</h2>
            <p>FCC&apos;de öğren, burada farklı bir görevde kendi başına uygula.</p>
          </motion.div>
          <div className="dashboard-module-progress">
            <div><span>Basic HTML</span><strong>{completedCount}/{allLessons.length} ders</strong></div>
            <Progress value={completionPercent} aria-label="Basic HTML ilerlemesi" />
            <small>%{completionPercent} tamamlandı</small>
          </div>
        </section>

        {actionableWeek && continueLesson ? (
          <section className="dashboard-focus-grid" data-section="continue">
            <ContinueLearningCard
              week={actionableWeek}
              lesson={continueLesson}
              curriculumPercent={completionPercent}
              weekPercent={weekPercent}
              studentName={firstName(user?.displayName)}
            />

            <aside className="weekly-outcome-card" data-section="weekly-outcomes">
              <div className="weekly-outcome-head">
                <LearningSticker icon={Target} label="Haftanın kazanımları" tone="sky" size="lg" />
                <div><span className="surface-kicker">BU HAFTA</span><h3>5 hedef</h3></div>
              </div>
              <ol>
                {actionableWeek.outcomes.map((outcome, index) => (
                  <li key={outcome.id}><span>{index + 1}</span><p>{outcome.text}</p></li>
                ))}
              </ol>
              <div className="weekly-outcome-build"><Rocket /><span><small>HAFTALIK BUILD</small><strong>{actionableWeek.weeklyBuild}</strong></span></div>
            </aside>
          </section>
        ) : null}

        <section className="learning-cycle-strip" aria-label="Öğrenme yöntemi">
          <article><LearningSticker icon={BookOpen} label="Öğren" tone="violet" /><div><strong>1. FCC&apos;de öğren</strong><p>Kavramı adım adım keşfet.</p></div></article>
          <span aria-hidden="true">→</span>
          <article><LearningSticker icon={Code2} label="Tekrar et" tone="sky" /><div><strong>2. Burada tekrar et</strong><p>Farklı senaryoda kodla.</p></div></article>
          <span aria-hidden="true">→</span>
          <article><LearningSticker icon={Rocket} label="İnşa et" tone="peach" /><div><strong>3. Kendi başına inşa et</strong><p>Mini build ile bilgiyi birleştir.</p></div></article>
        </section>

        <section className="week-journey-section" data-section="week-journey">
          <div className="section-heading-row">
            <div>
              <span className="surface-kicker">8 HAFTALIK ÖĞRENME ROTASI</span>
              <h2>Basic HTML yolculuğun</h2>
              <p>Her hafta FCC içeriğiyle eşleşir; görevlerin ve örneklerin ise tamamen özgündür.</p>
            </div>
            <div className="journey-note"><Sparkles /><span><strong>137 FCC adımı</strong><small>24 özgün Code Lab dersi</small></span></div>
          </div>

          <div className="week-journey-grid">
            {weeks.map((week) => (
              <WeekJourneyCard
                key={week.id}
                week={week}
                completedLessons={week.lessons.filter((lesson) => completedIds.includes(lesson.id)).length}
                selected={week.id === selectedWeek?.id}
                onSelect={() => setSelectedWeekId(week.id)}
              />
            ))}
          </div>

          {selectedWeek ? <WeekDetailPanel week={selectedWeek} completedIds={completedIds} /> : null}
        </section>

        <section className="dashboard-support-grid">
          <article className="support-card support-card-cloud">
            <LearningSticker icon={Cloud} label="Buluta kaydet" tone="mint" size="lg" />
            <div><span className="surface-kicker">KAYIP YOK</span><h3>Kodun ve ilerlemen seninle gelir.</h3><p>Başka bir cihazdan giriş yaptığında tamamladığın derslere kaldığın yerden devam edersin.</p></div>
          </article>
          <article className="support-card support-card-method">
            <LearningSticker icon={Layers3} label="Aşamalı öğrenme" tone="pink" size="lg" />
            <div><span className="surface-kicker">YARDIM AZALARAK</span><h3>Practice → Challenge → Mini Build</h3><p>İlk adımda yönlendirme alırsın; son adımda çözüm yolunu tamamen sen seçersin.</p></div>
          </article>
          <article className="support-card support-card-progress">
            <LearningSticker icon={Check} label="Kazanım odaklı" tone="yellow" size="lg" />
            <div><span className="surface-kicker">TAKVİM DEĞİL KAZANIM</span><h3>Hazır olduğunda ilerle.</h3><p>Hız yarışına girmezsin. Beş kazanım yerleşmeden sonraki haftaya geçmek zorunda değilsin.</p></div>
          </article>
        </section>
      </div>
    </main>
  );
}
