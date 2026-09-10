"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Map, Sparkles } from "lucide-react";
import type { LearningPathState } from "../learning-path-state";
import { LearningPathWeek } from "./learning-path-week";

type LearningPathProps = {
  state: LearningPathState;
};

export function LearningPath({ state }: LearningPathProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const recommendedWeekId = state.currentWeek?.id ?? state.weeks.findLast((item) => item.state !== "locked")?.week.id ?? state.weeks[0]?.week.id ?? "";
  const [expandedWeekOverride, setExpandedWeekOverride] = useState<string | null>(null);
  const expandedWeekId = expandedWeekOverride ?? recommendedWeekId;

  return (
    <section id="learning-path" className="learning-path-section" data-section="learning-path">
      <div className="learning-path-heading">
        <div>
          <span className="surface-kicker">8 HAFTALIK ÖĞRENME ROTASI</span>
          <h2>Basic HTML yolculuğun</h2>
          <p>Konuyu seç, o haftanın derslerini aynı yerde gör ve nerede kaldığını hiç kaybetme.</p>
        </div>
        <div className="learning-path-heading-note"><Map /><span><strong>137 FCC adımı</strong><small>24 özgün Code Lab dersi</small></span></div>
      </div>

      <div className="learning-path-shell">
        <motion.div
          className="learning-path-draw-line"
          aria-hidden="true"
          initial={reduceMotion ? false : { scaleY: 0 }}
          whileInView={reduceMotion ? undefined : { scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="learning-path-list">
          {state.weeks.map((item, index) => (
            <LearningPathWeek
              key={item.week.id}
              item={item}
              expanded={expandedWeekId === item.week.id}
              onToggle={() => setExpandedWeekOverride((current) => {
                const effectiveCurrent = current ?? recommendedWeekId;
                return effectiveCurrent === item.week.id ? "" : item.week.id;
              })}
              reduceMotion={reduceMotion}
              isLast={index === state.weeks.length - 1}
            />
          ))}
        </div>
      </div>

      <div className="learning-path-footnote"><Sparkles /><p><strong>Açık haftalarda özgürsün:</strong> o haftanın derslerini istediğin sırada tekrar açabilirsin. Gelecek rotaları öğretmenin açar.</p></div>
    </section>
  );
}
