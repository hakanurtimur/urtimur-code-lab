"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ChevronDown,
  LockKeyhole,
  Radio,
  Route,
  Sparkles,
} from "lucide-react";
import { CircularProgress } from "@/components/circular-progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LearningPathWeekState } from "../learning-path-state";
import { LearningPathLesson } from "./learning-path-lesson";
import { GameCard } from "@/features/games/components/game-card";
import { getGamesForWeek } from "@/features/games/data/basic-html-games";

type LearningPathWeekProps = {
  item: LearningPathWeekState;
  expanded: boolean;
  onToggle: () => void;
  reduceMotion: boolean;
  isLast: boolean;
};

const toneByWeek = ["violet", "sky", "peach", "mint", "pink", "yellow", "violet", "sky"] as const;

export function LearningPathWeek({
  item,
  expanded,
  onToggle,
  reduceMotion,
  isLast,
}: LearningPathWeekProps) {
  const { week, state, completedLessons, percent } = item;
  const tone = toneByWeek[(week.order - 1) % toneByWeek.length];
  const StatusIcon = state === "completed" ? Check : state === "current" ? Radio : state === "locked" ? LockKeyhole : Route;
  const games = getGamesForWeek(week.id);

  return (
    <motion.section
      className={cn("learning-path-week", `learning-path-week-${tone}`, `is-${state}`, expanded && "is-expanded")}
      data-learning-path-week={week.id}
      data-week-state={state}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.34, delay: Math.min(week.order * 0.035, 0.2) }}
    >
      {!isLast ? <span className="learning-path-connector" aria-hidden="true"><i /></span> : null}
      <button
        type="button"
        className="learning-path-week-trigger"
        aria-expanded={expanded}
        aria-controls={`learning-path-panel-${week.id}`}
        aria-label={`Hafta ${week.order}: ${week.theme}`}
        onClick={onToggle}
      >
        <span className="learning-path-week-node" aria-hidden="true"><StatusIcon /></span>
        <span className="learning-path-week-number">{String(week.order).padStart(2, "0")}</span>
        <span className="learning-path-week-copy">
          <small>HAFTA {week.order} · FCC {week.fccSteps.start}–{week.fccSteps.end}</small>
          <strong>{week.theme}</strong>
          <span>{week.title}</span>
        </span>
        <span className="learning-path-week-meta">
          {state === "locked" ? (
            <Badge variant="outline"><LockKeyhole /> Kilitli</Badge>
          ) : (
            <CircularProgress value={percent} size={52} strokeWidth={5} tone={tone === "yellow" ? "peach" : tone === "pink" ? "violet" : tone}>
              <strong>{completedLessons}/{week.lessons.length}</strong>
            </CircularProgress>
          )}
          <ChevronDown className="learning-path-chevron" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            id={`learning-path-panel-${week.id}`}
            className="learning-path-week-panel"
            data-learning-path-lessons={week.id}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="learning-path-week-panel-inner">
              <div className="learning-path-week-intro">
                <div>
                  <span className="surface-kicker">BU ROTADA</span>
                  <p>{week.summary}</p>
                </div>
                <div className="learning-path-week-build"><Sparkles /><span><small>HAFTALIK BUILD</small><strong>{week.weeklyBuild}</strong></span></div>
              </div>

              {state === "locked" ? (
                <div className="learning-path-locked-panel">
                  <LockKeyhole />
                  <div><strong>Bu hafta henüz kilitli.</strong><p>Öğretmenin açtığında dersler burada görünecek.</p></div>
                </div>
              ) : (
                <>
                  {games.length ? (
                    <div className="learning-path-games">
                      {games.map((game) => <GameCard key={game.id} game={game} reduceMotion={reduceMotion} />)}
                    </div>
                  ) : null}
                  <div className="learning-path-lessons-list">
                    {item.lessons.map((lessonItem, index) => (
                      <LearningPathLesson
                        key={lessonItem.lesson.id}
                        item={lessonItem}
                        index={index}
                        reduceMotion={reduceMotion}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
