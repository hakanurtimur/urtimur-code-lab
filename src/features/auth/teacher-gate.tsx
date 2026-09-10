"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CloudOff, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/brand";
import { LearningSticker } from "@/components/learning-sticker";
import { useAuthSession } from "./auth-provider";

export function TeacherGate({ children }: { children: ReactNode }) {
  const { firebaseReady, loading, role } = useAuthSession();
  const router = useRouter();

  useEffect(() => {
    if (firebaseReady && !loading && role !== "teacher") router.replace("/teacher/login");
  }, [firebaseReady, loading, role, router]);

  if (!firebaseReady) {
    return (
      <main className="auth-fallback">
        <div className="auth-fallback-card">
          <Brand />
          <LearningSticker icon={CloudOff} label="Firebase bağlantısı yok" tone="peach" size="lg" />
          <h1>Öğretmen paneli için Firebase kurulumu gerekiyor.</h1>
          <p><code>.env.local</code> değerlerini ekledikten sonra bu ekran otomatik açılır.</p>
        </div>
      </main>
    );
  }

  if (loading || role !== "teacher") {
    return (
      <main className="route-loading-shell route-loading-teacher">
        <Brand />
        <LearningSticker icon={ShieldCheck} label="Öğretmen paneli yükleniyor" tone="mint" size="lg" />
        <div className="route-loading-copy">
          <span>KONTROL MERKEZİ AÇILIYOR</span>
          <p>Canlı sınıf verileri hazırlanıyor…</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
