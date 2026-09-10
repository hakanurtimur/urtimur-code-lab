"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Code2,
  Eye,
  FileCode2,
  Lightbulb,
  Monitor,
  PanelLeft,
  Play,
  RotateCcw,
  Route,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import type { CurriculumWeek, Lesson } from "@/features/curriculum/types";
import { useLessonProgress } from "@/features/progress/use-lesson-progress";
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
import { MissionStageCard } from "./mission-stage-card";
import { TestResults } from "./test-results";
import { WorkspaceStatus } from "./workspace-status";
import { runHtmlTests, type TestResult } from "../lib/run-html-tests";

type LessonWorkspaceProps = {
  lesson: Lesson;
  week: CurriculumWeek;
};

type ActivePane = "mission" | "code" | "result";
type LessonStageKey = "practice" | "challenge" | "mini";

const stageConfig = {
  practice: { label: "Practice", icon: Lightbulb, tone: "violet" as const },
  challenge: { label: "Challenge", icon: Target, tone: "sky" as const },
  mini: { label: "Mini Build", icon: FileCode2, tone: "peach" as const },
};

export function LessonWorkspace({ lesson, week }: LessonWorkspaceProps) {
  const [source, setSource] = useState(lesson.starterCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [activePane, setActivePane] = useState<ActivePane>("code");
  const [activeStage, setActiveStage] = useState<LessonStageKey>("practice");
  const { completed, completeLesson, recordAttempt } = useLessonProgress(lesson.id);
  const reduceMotion = useReducedMotion();

  const allPassed = useMemo(() => results.length > 0 && results.every((result) => result.passed), [results]);
  const passedCount = results.filter((result) => result.passed).length;
  const testPercent = lesson.tests.length ? Math.round((passedCount / lesson.tests.length) * 100) : 0;
  const currentStage = activeStage === "practice" ? lesson.practice : activeStage === "challenge" ? lesson.challenge : lesson.miniBuild;
  const { markTesting } = useLiveSessionSync({ lesson, week, taskId: activeStage, source, results });

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
  };

  return (
    <main className="lesson-workspace-page" data-workspace="lesson">
      <header className="lesson-topbar">
        <div className="lesson-topbar-start">
          <Link href="/" className="round-icon-link" aria-label="Müfredata dön"><ArrowLeft /></Link>
          <Brand className="lesson-brand" />
          <span className="lesson-topbar-divider" aria-hidden="true" />
          <div className="lesson-topbar-title"><span>Hafta {week.order} · {week.theme}</span><strong>{lesson.title}</strong></div>
        </div>
        <div className="lesson-topbar-end">
          <Badge variant="outline" className="lesson-fcc-badge">FCC {week.fccSteps.start}–{week.fccSteps.end} / 137</Badge>
          {completed ? <Badge variant="success"><CheckCircle2 /> Tamamlandı</Badge> : null}
          <StudentSessionControls />
        </div>
      </header>

      <nav className="lesson-pane-switcher" aria-label="Ders çalışma alanları">
        <button className={activePane === "mission" ? "is-active" : ""} onClick={() => setActivePane("mission")} type="button"><PanelLeft /> Görev</button>
        <button className={activePane === "code" ? "is-active" : ""} onClick={() => setActivePane("code")} type="button"><Code2 /> Kod</button>
        <button className={activePane === "result" ? "is-active" : ""} onClick={() => setActivePane("result")} type="button"><Monitor /> Sonuç</button>
      </nav>

      <div className="lesson-workspace-grid">
        <aside
          className={cn("lesson-mission-pane", activePane !== "mission" && "is-mobile-hidden")}
          data-pane="mission"
        >
          <div className="mission-pane-scroll">
            <section className="mission-hero-card">
              <div className="mission-hero-topline"><Badge>HAFTA {week.order}</Badge><span>{lesson.eyebrow}</span></div>
              <h1>{lesson.title}</h1>
              <p>{lesson.description}</p>
              <div className="mission-hero-art" aria-hidden="true"><LearningSticker icon={Code2} label="HTML görevi" tone="sky" size="lg" /><span>&lt;/&gt;</span></div>
            </section>

            <section className="mission-checkpoint-card">
              <LearningSticker icon={Route} label="FCC kontrol noktası" tone="mint" size="md" />
              <div><span className="surface-kicker">FCC CHECKPOINT</span><p>{lesson.fccCheckpoint}</p></div>
            </section>

            <Tabs value={activeStage} onValueChange={(value) => setActiveStage(value as LessonStageKey)} className="mission-stage-tabs">
              <TabsList className="mission-stage-switcher">
                {(Object.entries(stageConfig) as Array<[LessonStageKey, typeof stageConfig.practice]>).map(([key, config]) => (
                  <TabsTrigger key={key} value={key}>{config.label}</TabsTrigger>
                ))}
              </TabsList>
              {(Object.entries(stageConfig) as Array<[LessonStageKey, typeof stageConfig.practice]>).map(([key, config]) => (
                <TabsContent value={key} key={key}>
                  <MissionStageCard
                    stage={key === "practice" ? lesson.practice : key === "challenge" ? lesson.challenge : lesson.miniBuild}
                    icon={config.icon}
                    tone={config.tone}
                    label={config.label}
                  />
                </TabsContent>
              ))}
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
        >
          <div className="code-pane-toolbar">
            <div className="code-file-tab"><span className="code-file-icon">HTML</span><strong>index.html</strong><i /></div>
            <div className="code-toolbar-actions"><WorkspaceStatus dirty={source !== lesson.starterCode} /><Button variant="ghost" size="sm" onClick={resetLesson}><RotateCcw /> Sıfırla</Button></div>
          </div>
          <CodeEditor value={source} onChange={setSource} minHeight="560px" />
          <div className="code-action-bar">
            <div><Code2 /><span><strong>{currentStage.title.split("·").pop()?.trim()}</strong><small>Kodun değiştikçe önizleme de güncellenir.</small></span></div>
            <Button size="lg" onClick={runTests}><Play className="fill-current" /> Kodumu kontrol et</Button>
          </div>
        </section>

        <section
          className={cn("lesson-result-pane", activePane !== "result" && "is-workspace-hidden", activePane !== "result" && "is-mobile-hidden")}
          data-pane="result"
          aria-label="Canlı önizleme ve test sonuçları"
        >
          <div className="result-pane-toolbar">
            <div><span className="surface-kicker">CANLI SONUÇ</span><strong>Önizleme</strong></div>
            <span className="live-indicator"><i /> canlı</span>
          </div>

          <div className="result-preview-stage"><LivePreview source={source} /></div>

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

            <AnimatePresence>
              {allPassed ? (
                <motion.div
                  className="lesson-success-card"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                >
                  <LearningSticker icon={Trophy} label="Tüm testler geçti" tone="yellow" size="lg" />
                  <div><span>GÖREV TAMAM</span><strong>Tüm kontroller geçti.</strong><p>Bu aşamayı kendi çözümünle tamamladın.</p></div>
                  {completed ? <Badge variant="success"><CheckCircle2 /> Kaydedildi</Badge> : <Button variant="success" onClick={completeLesson}><Sparkles /> Dersi tamamla</Button>}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </section>
        </section>
      </div>
    </main>
  );
}
