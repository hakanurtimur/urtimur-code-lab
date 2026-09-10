"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Columns2, Code2, Eye, Monitor } from "lucide-react";
import { CodeEditor } from "@/features/lesson-runner/components/code-editor";
import { cn } from "@/lib/utils";
import type { LiveSessionRecord } from "../types";
import { TeacherLiveBrowser } from "./teacher-live-browser";

type TeacherLiveView = "code" | "browser" | "split";

type TeacherLiveWorkspaceProps = {
  session: LiveSessionRecord | null;
  studentName: string;
};

const paneLabels: Record<LiveSessionRecord["activePane"], string> = {
  mission: "Görev paneli",
  code: "Kod paneli",
  result: "Sonuç paneli",
};

const viewOptions = [
  { value: "code" as const, label: "Kod", icon: Code2 },
  { value: "browser" as const, label: "Tarayıcı", icon: Monitor },
  { value: "split" as const, label: "Bölünmüş", icon: Columns2 },
];

export function TeacherLiveWorkspace({ session, studentName }: TeacherLiveWorkspaceProps) {
  const [view, setView] = useState<TeacherLiveView>("split");
  const reduceMotion = useReducedMotion();
  const source = session?.code ?? "<!-- Öğrenci ders editörünü açtığında kod burada canlı görünecek. -->";

  return (
    <section className="teacher-live-workspace" data-live-view={view}>
      <div className="teacher-live-workspace-toolbar">
        <div><Eye /><span><strong>Canlı çalışma alanı</strong><small>Yalnızca görüntüleme</small></span></div>
        <div className="teacher-live-view-switcher" aria-label="Canlı görünüm seçimi">
          {viewOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={view === option.value}
                className={view === option.value ? "is-active" : ""}
                onClick={() => setView(option.value)}
              >
                <Icon /> {option.label}
              </button>
            );
          })}
        </div>
        <small>{session ? `Öğrenci: ${paneLabels[session.activePane]} · yaklaşık 750 ms` : "Canlı oturum bekleniyor"}</small>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${studentName}-${view}`}
          className={cn("teacher-live-workspace-grid", `is-${view}`)}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {view !== "browser" ? (
            <section className="teacher-live-code-pane">
              <header><Code2 /><span>index.html</span><small>read-only</small></header>
              <div className="teacher-live-editor">
                <CodeEditor
                  value={source}
                  readOnly
                  minHeight="560px"
                  ariaLabel={`${studentName} canlı kodu`}
                />
              </div>
            </section>
          ) : null}
          {view !== "code" ? <TeacherLiveBrowser session={session} studentName={studentName} /> : null}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
