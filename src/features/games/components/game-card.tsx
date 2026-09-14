"use client";

import Link from "next/link";
import { Gamepad2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { LessonGame } from "../types";

export function GameCard({ game, reduceMotion }: { game: LessonGame; reduceMotion: boolean }) {
  return (
    <motion.article
      className={`topic-game-card topic-game-${game.tone}`}
      initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <span className="topic-game-icon"><Gamepad2 /></span>
      <div>
        <span className="surface-kicker">2–5 DK · KONU OYUNU</span>
        <strong>{game.title}</strong>
        <p>{game.description}</p>
      </div>
      <Button asChild size="sm" variant="outline"><Link href={`/game/${game.id}`}>Oyunu aç <Sparkles /></Link></Button>
    </motion.article>
  );
}
