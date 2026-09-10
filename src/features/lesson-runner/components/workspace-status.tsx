"use client";

import { CheckCircle2, Cloud, CloudOff } from "lucide-react";
import { useAuthSession } from "@/features/auth/auth-provider";

type WorkspaceStatusProps = {
  dirty?: boolean;
};

export function WorkspaceStatus({ dirty = false }: WorkspaceStatusProps) {
  const { firebaseReady, role } = useAuthSession();
  const cloud = firebaseReady && role === "student";

  return (
    <span className={cloud ? "workspace-sync-status is-cloud" : "workspace-sync-status"} aria-label={cloud ? dirty ? "Kod canlı olarak senkronlanıyor" : "Bulut bağlantısı hazır" : "İlerleme bu cihazda saklanıyor"}>
      {cloud ? dirty ? <Cloud /> : <CheckCircle2 /> : <CloudOff />}
      <span>{cloud ? dirty ? "Canlı senkron" : "Buluta bağlı" : "Yerel kayıt"}</span>
    </span>
  );
}
