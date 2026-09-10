import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "Hakan Urtimur Code Lab", template: "%s · Hakan Urtimur Code Lab" },
  description: "Responsive Web Design için yaratıcı, uygulamalı ve öğretmen destekli kod laboratuvarı",
  applicationName: "Hakan Urtimur Code Lab",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f7fc",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
