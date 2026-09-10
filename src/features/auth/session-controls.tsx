"use client";

import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "./auth-provider";

function firstName(value: string | null | undefined) {
  return value?.trim().split(/\s+/)[0] || "Öğrenci";
}

export function StudentSessionControls() {
  const router = useRouter();
  const { user, role, firebaseReady, signOutUser } = useAuthSession();

  if (!firebaseReady || role !== "student") {
    return (
      <span className="identity-pill identity-pill-local">
        <UserRound /> Yerel mod
      </span>
    );
  }

  return (
    <div className="session-controls">
      <span className="identity-pill">
        <span className="identity-avatar">{firstName(user?.displayName).slice(0, 1).toLocaleUpperCase("tr")}</span>
        <span><small>Öğrenci</small><strong>{firstName(user?.displayName)}</strong></span>
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="session-signout"
        aria-label="Çıkış yap"
        onClick={async () => {
          await signOutUser();
          router.replace("/");
        }}
      >
        <LogOut />
      </Button>
    </div>
  );
}

export function TeacherSessionControls() {
  const router = useRouter();
  const { user, signOutUser } = useAuthSession();

  return (
    <div className="session-controls">
      <span className="identity-pill identity-pill-teacher">
        <span className="identity-avatar"><ShieldCheck /></span>
        <span><small>Öğretmen</small><strong>{user?.email ?? "Yetkili hesap"}</strong></span>
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="session-signout"
        aria-label="Çıkış yap"
        onClick={async () => {
          await signOutUser();
          router.replace("/teacher/login");
        }}
      >
        <LogOut />
      </Button>
    </div>
  );
}
