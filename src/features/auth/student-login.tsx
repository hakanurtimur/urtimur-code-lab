"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Cloud,
  Code2,
  Gamepad2,
  LockKeyhole,
  Rocket,
  Sparkles,
  UserRound,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Brand } from "@/components/brand";
import { CodeBuddyIllustration } from "@/components/code-buddy-illustration";
import { LearningSticker } from "@/components/learning-sticker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthSession } from "./auth-provider";
import { validateStudentPassword, validateStudentUsername } from "./student-identity";

export function StudentLogin() {
  const { signInStudent, role, loading, firebaseReady } = useAuthSession();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (role === "student") router.replace("/");
    if (role === "teacher") router.replace("/teacher");
  }, [loading, role, router]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!validateStudentUsername(username) || !validateStudentPassword(password)) {
      setError("Kullanıcı adı veya şifre biçimini kontrol et.");
      return;
    }

    try {
      setPending(true);
      await signInStudent(username, password);
      router.replace("/");
    } catch {
      setError("Giriş yapılamadı. Kullanıcı adı ve şifreni kontrol et.");
    } finally {
      setPending(false);
    }
  };

  if (!firebaseReady) {
    return (
      <main className="auth-fallback" data-surface="student-login">
        <div className="auth-fallback-card">
          <Brand />
          <LearningSticker icon={Cloud} label="Yerel çalışma modu" tone="sky" size="lg" />
          <div>
            <span className="surface-kicker">YEREL MOD</span>
            <h1>Dersler hazır, bulut bağlantısı bekliyor.</h1>
            <p>Firebase değerleri eklenene kadar ilerleme yalnızca bu cihazda tutulur.</p>
          </div>
          <Button size="lg" onClick={() => router.replace("/")}>
            Yerel laboratuvara geç <ArrowRight />
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="student-auth" data-surface="student-login">
      <section className="student-auth-story" aria-labelledby="student-login-title">
        <div className="student-auth-topline">
          <Brand className="student-auth-brand" />
          <span className="student-auth-safe"><LockKeyhole /> Yalnızca öğretmenin açtığı hesaplar</span>
        </div>

        <div className="student-auth-copy">
          <motion.div
            className="student-auth-eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          >
            <Sparkles />
            <span>KENDİ KOD LABORATUVARIN</span>
          </motion.div>
          <motion.h1
            id="student-login-title"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            Öğren, dene ve <em>çalıştığını gör.</em>
          </motion.h1>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            freeCodeCamp&apos;te gördüğün konuları özgün görevlerde tekrar et. Kodun anında önizlemeye dönüşsün, ilerlemen bulutta kalsın.
          </motion.p>
        </div>

        <motion.div
          className="student-auth-visual"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 20, delay: 0.08 }}
        >
          <span className="floating-topic floating-topic-code"><Code2 /> HTML</span>
          <span className="floating-topic floating-topic-game"><Gamepad2 /> Challenge</span>
          <span className="floating-topic floating-topic-rocket"><Rocket /> Build</span>
          <CodeBuddyIllustration className="student-auth-buddy" mood="wave" />
          <div className="student-auth-dock" aria-hidden="true">
            <LearningSticker icon={BookOpen} label="Dersler" tone="violet" />
            <LearningSticker icon={Code2} label="Kodlama" tone="sky" />
            <LearningSticker icon={Rocket} label="Projeler" tone="peach" />
          </div>
        </motion.div>
      </section>

      <section className="student-auth-form-panel" aria-label="Öğrenci giriş formu">
        <div className="student-login-card">
          <div className="student-login-heading">
            <LearningSticker icon={UserRound} label="Öğrenci girişi" tone="violet" size="lg" />
            <div>
              <span className="surface-kicker">HOŞ GELDİN</span>
              <h2>Laboratuvara gir</h2>
              <p>Kaldığın görev seni bekliyor.</p>
            </div>
          </div>

          <form onSubmit={submit} className="student-login-form">
            <div className="auth-field">
              <Label htmlFor="student-username">Kullanıcı adı</Label>
              <Input
                id="student-username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="ör. ege_01"
                aria-describedby="student-username-help"
              />
              <small id="student-username-help">Öğretmenin sana verdiği kullanıcı adı.</small>
            </div>
            <div className="auth-field">
              <Label htmlFor="student-password">Şifre</Label>
              <Input
                id="student-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error ? <p className="form-error" role="alert">{error}</p> : null}

            <Button type="submit" size="lg" disabled={pending} className="student-login-submit">
              {pending ? "Laboratuvar açılıyor…" : "Devam et"}
              {!pending ? <ArrowRight /> : null}
            </Button>
          </form>

          <div className="student-login-assurance">
            <span><Cloud /> İlerlemen otomatik kaydedilir.</span>
            <span><LockKeyhole /> Şifren yalnızca giriş için kullanılır.</span>
          </div>
        </div>

        <Link className="teacher-entry-link" href="/teacher/login">Öğretmen paneline geç</Link>
      </section>
    </main>
  );
}
