"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { LessonStage } from "@/features/curriculum/types";
import { LearningSticker } from "@/components/learning-sticker";

type MissionStageCardProps = {
  stage: LessonStage;
  icon: LucideIcon;
  tone: "violet" | "sky" | "peach";
  label: string;
};

export function MissionStageCard({ stage, icon, tone, label }: MissionStageCardProps) {
  const reduceMotion = useReducedMotion();
  const [prefix, ...titleParts] = stage.title.split("·");
  const title = titleParts.join("·").trim() || prefix.trim();

  return (
    <motion.article
      className={`mission-stage-card mission-stage-${tone}`}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mission-stage-heading">
        <LearningSticker icon={icon} label={label} tone={tone} size="md" />
        <div><span>{prefix.trim()}</span><h2>{title}</h2></div>
      </div>
      <p>{stage.description}</p>
      <ul>
        {stage.requirements.map((requirement) => (
          <li key={requirement}><span><Check /></span><p>{requirement}</p></li>
        ))}
      </ul>
    </motion.article>
  );
}
