"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Gamepad2, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { Brand } from "@/components/brand";
import { LearningSticker } from "@/components/learning-sticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudentAccess } from "@/features/progress/use-student-access";
import { evaluateGame } from "../game-evaluator";
import type { LessonGame } from "../types";
import { useGameProgress } from "../use-game-progress";

function rotateOrder(items: string[]) {
  if (items.length < 2) return items;
  return [...items.slice(2), ...items.slice(0, 2)];
}

export function GamePlayer({ game }: { game: LessonGame }) {
  const reduceMotion = Boolean(useReducedMotion());
  const { maxUnlockedWeekOrder, loading } = useStudentAccess();
  const { progress, saveResult } = useGameProgress(game.id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [ordered, setOrdered] = useState<string[]>([]);
  const [pool, setPool] = useState(() => game.kind === "order" ? rotateOrder(game.items) : []);
  const [result, setResult] = useState<{ score: number; total: number; completed: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  const matchOptions = useMemo(
    () => game.kind === "match" ? game.pairs.map((pair) => pair.right).reverse() : [],
    [game],
  );

  if (loading) return <main className="game-page game-access"><Brand /><p>Oyun rotası hazırlanıyor…</p></main>;
  if (game.weekOrder > maxUnlockedWeekOrder) {
    return <main className="game-page game-access"><Brand /><LearningSticker icon={Gamepad2} label="Kilitli oyun" tone="peach" size="lg" /><h1>Bu oyun henüz kilitli.</h1><Button asChild><Link href="/#learning-path">Rotaya dön</Link></Button></main>;
  }

  const reset = () => {
    setAnswers({});
    setOrdered([]);
    setPool(game.kind === "order" ? rotateOrder(game.items) : []);
    setResult(null);
  };

  const check = async () => {
    const next = evaluateGame(game, game.kind === "order" ? ordered : answers);
    setResult(next);
    setSaving(true);
    await saveResult(next.score, next.total, next.completed);
    setSaving(false);
  };

  return (
    <main className={`game-page game-tone-${game.tone}`}>
      <header className="game-topbar">
        <Brand />
        <Button asChild variant="ghost"><Link href="/#learning-path"><ArrowLeft /> Öğrenme rotası</Link></Button>
      </header>

      <div className="game-shell">
        <motion.section className="game-hero" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}>
          <LearningSticker icon={Gamepad2} label="Konu oyunu" tone={game.tone} size="lg" />
          <div><span className="surface-kicker">{game.eyebrow}</span><h1>{game.title}</h1><p>{game.description}</p></div>
          {progress.completed ? <Badge variant="success"><CheckCircle2 /> Daha önce tamamlandı</Badge> : null}
        </motion.section>

        <section className="game-board">
          {game.kind === "match" ? (
            <div className="match-game-grid">
              {game.pairs.map((pair) => (
                <article key={pair.id} className="match-game-row">
                  <strong>{pair.left}</strong>
                  <div>{matchOptions.map((option) => <button key={option} type="button" className={answers[pair.id] === option ? "is-selected" : ""} onClick={() => setAnswers((current) => ({ ...current, [pair.id]: option }))}>{option}</button>)}</div>
                </article>
              ))}
            </div>
          ) : game.kind === "order" ? (
            <div className="order-game">
              <div className="order-game-target">
                <span className="surface-kicker">SIRANI KUR</span>
                {ordered.length === 0 ? <p>Parçalara sırayla dokun.</p> : ordered.map((item, index) => <button type="button" key={`${item}-${index}`} onClick={() => { setOrdered((current) => current.filter((_, itemIndex) => itemIndex !== index)); setPool((current) => [...current, item]); }}><span>{index + 1}</span><code>{item}</code></button>)}
              </div>
              <div className="order-game-pool">{pool.map((item, index) => <button type="button" key={`${item}-${index}`} onClick={() => { setOrdered((current) => [...current, item]); setPool((current) => current.filter((_, itemIndex) => itemIndex !== index)); }}><code>{item}</code></button>)}</div>
            </div>
          ) : (
            <div className="quiz-game-grid">
              {game.questions.map((question, index) => (
                <article key={question.id} className="quiz-game-card">
                  <span>{index + 1}</span><strong>{question.prompt}</strong>
                  <div>{question.options.map((option) => <button type="button" key={option} className={answers[question.id] === option ? "is-selected" : ""} onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}>{option}</button>)}</div>
                  {result ? <small>{answers[question.id] === question.answer ? "✓ Doğru" : `Doğru cevap: ${question.answer}`} · {question.explanation}</small> : null}
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="game-action-bar">
          <Button variant="ghost" onClick={reset}><RotateCcw /> Sıfırla</Button>
          {result ? <div className={result.completed ? "game-result is-complete" : "game-result"}>{result.completed ? <Trophy /> : <Sparkles />}<span><strong>{result.score}/{result.total}</strong><small>{result.completed ? "Tam isabet!" : "Bir daha dene; yanlışlar öğrenmenin parçası."}</small></span></div> : null}
          <Button size="lg" onClick={() => void check()} disabled={saving}>{saving ? "Kaydediliyor…" : "Cevapları kontrol et"}</Button>
        </footer>
      </div>
    </main>
  );
}
