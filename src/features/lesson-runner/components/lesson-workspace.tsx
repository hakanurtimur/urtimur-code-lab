"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Code2,
  Eye,
  FileCode2,
  Lightbulb,
  LockKeyhole,
  Monitor,
  PanelLeft,
  Play,
  RotateCcw,
  Route,
  Target,
} from "lucide-react";
import type { CurriculumWeek, Lesson } from "@/features/curriculum/types";
import { curriculumModules, getTotalCurriculumWeeks } from "@/features/curriculum/get-lesson";
import { deriveLearningPathState } from "@/features/curriculum/learning-path-state";
import { getLessonCompletionHandoff, getLessonNavigation } from "@/features/curriculum/lesson-navigation";
import { useCompletedLessonIds } from "@/features/progress/use-completed-lesson-ids";
import { useLessonProgress } from "@/features/progress/use-lesson-progress";
import { useStudentAccess } from "@/features/progress/use-student-access";
import { useLiveSessionSync } from "@/features/live-session/use-live-session-sync";
import { StudentSessionControls } from "@/features/auth/session-controls";
import { Brand } from "@/components/brand";
import { CircularProgress } from "@/components/circular-progress";
import { LearningSticker } from "@/components/learning-sticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CodeEditor } from "./code-editor";
import { LivePreview } from "./live-preview";
import { LessonCompletionCard } from "./lesson-completion-card";
import { LessonDrawer } from "./lesson-drawer";
import { LessonNavigation } from "./lesson-navigation";
import { MissionStageCard } from "./mission-stage-card";
import { TestResults } from "./test-results";
import { WorkspaceStatus } from "./workspace-status";
import type { LiveActivePane, PreviewPreset } from "@/features/live-session/types";
import { runHtmlTests, type TestResult } from "../lib/run-html-tests";

type LessonWorkspaceProps = {
  lesson: Lesson;
  week: CurriculumWeek;
};

type LessonStageKey = "practice" | "challenge" | "mini";

const stageConfig = {
  practice: { label: "Practice", icon: Lightbulb, tone: "violet" as const },
  challenge: { label: "Challenge", icon: Target, tone: "sky" as const },
  mini: { label: "Mini Build", icon: FileCode2, tone: "peach" as const },
};

const allWeeks = curriculumModules.flatMap((module) => module.weeks);

export function LessonWorkspace({ lesson, week }: LessonWorkspaceProps) {
  const router = useRouter();
  const [source, setSource] = useState(lesson.starterCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [activePane, setActivePane] = useState<LiveActivePane>("code");
  const [activeStage, setActiveStage] = useState<LessonStageKey>("practice");
  const [previewPreset, setPreviewPreset] = useState<PreviewPreset>("fit");
  const [previewScrollY, setPreviewScrollY] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const { completed, completeLesson, recordAttempt } = useLessonProgress(lesson.id);
  const completedIds = useCompletedLessonIds();
  const { maxUnlockedWeekOrder, loading: accessLoading } = useStudentAccess();
  const reduceMotion = useReducedMotion();

  const navigation = useMemo(() => getLessonNavigation(lesson, allWeeks), [lesson]);
  const completionHandoff = useMemo(
    () => getLessonCompletionHandoff(lesson, allWeeks, completedIds, maxUnlockedWeekOrder),
    [completedIds, lesson, maxUnlockedWeekOrder],
  );
  const pathState = useMemo(
    () => deriveLearningPathState(allWeeks, completedIds, maxUnlockedWeekOrder),
    [completedIds, maxUnlockedWeekOrder],
  );
  const weekPath = pathState.weeks.find((item) => item.week.id === week.id);
  const canAccessLesson = !accessLoading && week.order <= maxUnlockedWeekOrder;
  const allPassed = useMemo(
    () => results.length > 0 && results.every((result) => result.passed),
    [results],
  );
  const passedCount = results.filter((result) => result.passed).length;
  const testPercent = lesson.tests.length
    ? Math.round((passedCount / lesson.tests.length) * 100)
    : 0;
  const currentStage = activeStage === "practice"
    ? lesson.practice
    : activeStage === "challenge"
      ? lesson.challenge
      : lesson.miniBuild;

  const { markTesting } = useLiveSessionSync({
    lesson,
    week,
    taskId: activeStage,
    source,
    results,
    activePane,
    previewPreset,
    previewScrollY,
    enabled: canAccessLesson,
  });

  const runTests = () => {
    const nextResults = runHtmlTests(source, lesson.tests);
    const nextPassedCount = nextResults.filter((result) => result.passed).length;
    setResults(nextResults);
    setActivePane("result");
    void recordAttempt({ passedTests: nextPassedCount, totalTests: nextResults.length });
    void markTesting(nextResults);
  };

  const resetLesson = () => {
    setSource(lesson.starterCode);
    setResults([]);
    setPreviewScrollY(0);
  };

  const persistCompletion = async () => {
    setCompletionError("");
    if (completed) return true;

    setCompleting(true);
    try {
      const saved = await completeLesson();
      if (!saved) {
        setCompletionError("İlerleme kaydedilemedi. Bağlantıyı kontrol edip tekrar dene.");
      }
      return saved;
    } catch {
      setCompletionError("İlerleme kaydedilemedi. Bağlantıyı kontrol edip tekrar dene.");
      return false;
    } finally {
      setCompleting(false);
    }
  };

  const completeStay = async () => {
    await persistCompletion();
  };

  const completeAndNavigate = async (href: string) => {
    const saved = await persistCompletion();
    if (saved) router.push(href);
  };

  if (accessLoading) {
    return (
      <main className="lesson-access-state">
        <Brand />
        <LearningSticker icon={Route} label="Rota yükleniyor" tone="violet" size="lg" />
        <div><span className="surface-kicker">ROTAN HAZIRLANIYOR</span><h1>Ders erişimin kontrol ediliyor.</h1></div>
      </main>
    );
  }

  if (!canAccessLesson) {
    return (
      <main className="lesson-access-state">
        <Brand />
        <LearningSticker icon={LockKeyhole} label="Kilitli rota" tone="peach" size="lg" />
        <div><span className="surface-kicker">GELECEK ROTA</span><h1>Bu hafta henüz kilitli.</h1><p>Öğretmenin rotayı açtığında burada çalışmaya başlayabilirsin.</p></div>
        <Button asChild><Link href="/#learning-path">Öğrenme rotasına dön</Link></Button>
      </main>
    );
  }

  return (
    <main className="lesson-workspace-page" data-workspace="lesson">
      <header className="lesson-topbar">
        <div className="lesson-topbar-start">
          <Brand className="lesson-brand" />
          <span className="lesson-topbar-divider" aria-hidden="true" />
          <LessonNavigation
            weekOrder={week.order}
            totalWeeks={getTotalCurriculumWeeks()}
            lessonIndex={navigation.currentIndex}
            totalLessons={navigation.totalInWeek}
            previousLesson={navigation.previousLesson}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
        </div>
        <div className="lesson-topbar-end">
          <Badge variant="outline" className="lesson-fcc-badge">FCC {week.fccSteps.start}–{week.fccSteps.end} / 137</Badge>
          {completed ? <Badge variant="success"><CheckCircle2 /> Tamamlandı</Badge> : null}
          <StudentSessionControls />
        </div>
      </header>

      <LessonDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        week={week}
        currentLesson={lesson}
        lessons={weekPath?.lessons ?? []}
      />

      <nav className="lesson-pane-switcher" aria-label="Ders çalışma alanları">
        <button className={activePane === "mission" ? "is-active" : ""} onClick={() => setActivePane("mission")} type="button"><PanelLeft /> Görev</button>
        <button className={activePane === "code" ? "is-active" : ""} onClick={() => setActivePane("code")} type="button"><Code2 /> Kod</button>
        <button className={activePane === "result" ? "is-active" : ""} onClick={() => setActivePane("result")} type="button"><Monitor /> Sonuç</button>
      </nav>

      <div className="lesson-workspace-grid">
        <aside
          className={cn("lesson-mission-pane", activePane !== "mission" && "is-mobile-hidden")}
          data-pane="mission"
          onPointerDown={() => setActivePane("mission")}
          onFocusCapture={() => setActivePane("mission")}
        >
          <div className="mission-pane-scroll">
            <section className="mission-hero-card">
              <div className="mission-hero-topline"><Badge>HAFTA {week.order}</Badge><span>{lesson.eyebrow}</span></div>
              <h1>{lesson.title}</h1>
              <p>{lesson.description}</p>
              <motion.div
                className="mission-hero-art"
                aria-hidden="true"
                animate={reduceMotion ? undefined : { y: [0, -5, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <LearningSticker icon={Code2} label="HTML görevi" tone="sky" size="lg" /><span>&lt;/&gt;</span>
              </motion.div>
            </section>

            <section className="mission-checkpoint-card">
              <LearningSticker icon={Route} label="FCC kontrol noktası" tone="mint" size="md" />
              <div><span className="surface-kicker">FCC CHECKPOINT</span><p>{lesson.fccCheckpoint}</p></div>
            </section>

            <Tabs value={activeStage} onValueChange={(value) => setActiveStage(value as LessonStageKey)} className="mission-stage-tabs">
              <TabsList className="mission-stage-switcher">
                {(Object.entries(stageConfig) as Array<[LessonStageKey, typeof stageConfig.practice]>).map(([key, config]) => (
                  <TabsTrigger key={key} value={key} className="mission-stage-trigger">
                    {activeStage === key && !reduceMotion ? <motion.span layoutId="active-stage-pill" className="mission-stage-active-pill" /> : null}
                    <span>{config.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeStage}
                  initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value={activeStage} forceMount>
                    <MissionStageCard
                      stage={currentStage}
                      icon={stageConfig[activeStage].icon}
                      tone={stageConfig[activeStage].tone}
                      label={stageConfig[activeStage].label}
                    />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>

            <Collapsible className="mission-disclosure">
              <CollapsibleTrigger className="mission-disclosure-trigger">
                <span><BookOpen /> Bu derste 5 kazanım</span><ChevronDown className="collapsible-chevron" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mission-disclosure-content">
                <ol className="lesson-outcome-list">
                  {lesson.outcomes.map((outcome, index) => <li key={outcome.id}><span>{index + 1}</span><p>{outcome.text}</p></li>)}
                </ol>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible className="mission-disclosure">
              <CollapsibleTrigger className="mission-disclosure-trigger">
                <span><CircleHelp /> Takıldığında hatırla</span><ChevronDown className="collapsible-chevron" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mission-disclosure-content lesson-recall-list">
                {lesson.quickRecall.map((item) => <details key={item.id}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </aside>

        <section
          className={cn("lesson-code-pane", activePane === "result" && "is-workspace-hidden", activePane !== "code" && "is-mobile-hidden")}
          data-pane="code"
          aria-label="Kod alanı"
          onPointerDown={() => setActivePane("code")}
          onFocusCapture={() => setActivePane("code")}
        >
          <div className="code-pane-toolbar">
            <div className="code-file-tab"><span className="code-file-icon">HTML</span><strong>index.html</strong><i /></div>
            <div className="code-toolbar-actions"><WorkspaceStatus dirty={source !== lesson.starterCode} /><Button variant="ghost" size="sm" onClick={resetLesson}><RotateCcw /> Sıfırla</Button></div>
          </div>
          <CodeEditor value={source} onChange={setSource} minHeight="620px" />
          <div className="code-action-bar">
            <div><Code2 /><span><strong>{currentStage.title.split("·").pop()?.trim()}</strong><small>Kodun değiştikçe önizleme de güncellenir.</small></span></div>
            <Button size="lg" onClick={runTests}><Play className="fill-current" /> Kodumu kontrol et</Button>
          </div>
        </section>

        <section
          className={cn("lesson-result-pane", activePane !== "result" && "is-workspace-hidden", activePane !== "result" && "is-mobile-hidden")}
          data-pane="result"
          aria-label="Canlı önizleme ve test sonuçları"
          onPointerDown={() => setActivePane("result")}
          onFocusCapture={() => setActivePane("result")}
        >
          <div className="result-pane-toolbar">
            <div><span className="surface-kicker">CANLI SONUÇ</span><strong>Önizleme</strong></div>
            <span className="live-indicator"><i /> canlı</span>
          </div>

          <div className="result-preview-stage">
            <LivePreview
              source={source}
              mode={previewPreset}
              scrollY={previewScrollY}
              onModeChange={(mode) => {
                setActivePane("result");
                setPreviewPreset(mode);
                setPreviewScrollY(0);
              }}
              onScrollChange={(nextScrollY) => {
                setActivePane("result");
                setPreviewScrollY(nextScrollY);
              }}
            />
          </div>

          <section className="test-drawer-card">
            <div className="test-drawer-heading">
              <div><span className="surface-kicker">GÖREV KONTROLLERİ</span><h2>{results.length ? `${passedCount} / ${results.length} test geçti` : "Hazır olduğunda kontrol et"}</h2></div>
              <CircularProgress value={results.length ? testPercent : 0} size={62} strokeWidth={6} tone={allPassed ? "mint" : "violet"} label={`Testlerin yüzde ${results.length ? testPercent : 0} kadarı geçti`}>
                <strong>{results.length ? `${passedCount}/${results.length}` : `0/${lesson.tests.length}`}</strong>
              </CircularProgress>
            </div>
            <Progress value={results.length ? testPercent : 0} />

            {results.length ? <TestResults results={results} /> : (
              <div className="tests-empty-state"><Eye /><div><strong>Önce kendi çözümünü dene.</strong><p>“Kodumu kontrol et” dediğinde her gereksinimi tek tek inceleyeceğiz.</p></div></div>
            )}

            <AnimatePresence mode="wait">
              {allPassed ? (
                <LessonCompletionCard
                  key="completion"
                  lesson={lesson}
                  handoff={completionHandoff}
                  completed={completed}
                  completing={completing}
                  error={completionError}
                  onCompleteStay={completeStay}
                  onCompleteAndNavigate={completeAndNavigate}
                />
              ) : null}
            </AnimatePresence>
          </section>
        </section>
      </div>
    </main>
  );
}
