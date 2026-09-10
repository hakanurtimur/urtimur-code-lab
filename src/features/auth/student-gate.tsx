"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/brand";
import { CodeBuddyIllustration } from "@/components/code-buddy-illustration";
import { useAuthSession } from "./auth-provider";

export function StudentGate({ children }: { children: ReactNode }) {
  const { firebaseReady, loading, role } = useAuthSession();
  const router = useRouter();

  useEffect(() => {
    if (!firebaseReady || loading) return;
    if (role === "teacher") router.replace("/teacher");
    else if (role !== "student") router.replace("/login");
  }, [firebaseReady, loading, role, router]);

  if (!firebaseReady) return <>{children}</>;
  if (loading || role !== "student") {
    return (
      <main className="route-loading-shell">
        <Brand />
        <CodeBuddyIllustration className="route-loading-buddy" mood="focus" />
        <div className="route-loading-copy">
          <span>LABORATUVAR HAZIRLANIYOR</span>
          <p>Görevlerin ve ilerlemen yükleniyor…</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
