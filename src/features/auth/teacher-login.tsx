"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, Radio, ShieldCheck, Users } from "lucide-react";
import { Brand } from "@/components/brand";
import { LearningSticker } from "@/components/learning-sticker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthSession } from "./auth-provider";

export function TeacherLogin() {
  const { firebaseReady, loading, role, signInTeacher } = useAuthSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (role === "teacher") router.replace("/teacher");
    if (role === "student") router.replace("/");
  }, [loading, role, router]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      setPending(true);
      await signInTeacher(email, password);
      router.replace("/teacher");
    } catch {
      setError("Giriş yapılamadı. Yetkili öğretmen hesabını kontrol et.");
    } finally {
      setPending(false);
    }
  };

  if (!firebaseReady) {
    return <main className="teacher-auth-missing" data-surface="teacher-login">Firebase yapılandırılmadan öğretmen paneli açılamaz.</main>;
  }

  return (
    <main className="teacher-auth" data-surface="teacher-login">
      <section className="teacher-auth-intro">
        <Brand />
        <div className="teacher-auth-copy">
          <span className="surface-kicker">ÖĞRETMEN KONTROL MERKEZİ</span>
          <h1>Ders sürerken sınıfın nabzı burada.</h1>
          <p>Öğrencileri yönet, ilerlemeyi izle ve yazdıkları kodu gerçek zamanlı takip et.</p>
        </div>
        <div className="teacher-auth-features">
          <span><Users /> Öğrenci CRUD</span>
          <span><Radio /> Canlı durum</span>
          <span><Eye /> Read-only kod izleme</span>
        </div>
      </section>

      <section className="teacher-auth-form-panel">
        <div className="teacher-login-card">
          <div className="teacher-login-heading">
            <LearningSticker icon={ShieldCheck} label="Güvenli öğretmen girişi" tone="mint" size="lg" />
            <div>
              <span className="surface-kicker">YETKİLİ GİRİŞİ</span>
              <h2>Panele giriş yap</h2>
            </div>
          </div>
          <form onSubmit={submit} className="teacher-login-form">
            <div className="auth-field">
              <Label htmlFor="teacher-email">Email</Label>
              <Input id="teacher-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="auth-field">
              <Label htmlFor="teacher-password">Şifre</Label>
              <Input id="teacher-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            {error ? <p className="form-error" role="alert">{error}</p> : null}
            <Button type="submit" size="lg" disabled={pending} className="w-full">
              {pending ? "Kontrol ediliyor…" : "Kontrol merkezini aç"}
              {!pending ? <ArrowRight /> : null}
            </Button>
          </form>
        </div>
        <a className="teacher-entry-link" href="/">Öğrenci ekranına dön</a>
      </section>
    </main>
  );
}
