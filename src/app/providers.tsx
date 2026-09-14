"use client";

import { AuthProvider } from "@/features/auth/auth-provider";
import { StudentPresenceBridge } from "@/features/presence/student-presence-bridge";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StudentPresenceBridge />
      {children}
    </AuthProvider>
  );
}
