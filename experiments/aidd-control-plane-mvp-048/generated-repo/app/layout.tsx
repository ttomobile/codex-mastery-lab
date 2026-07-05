import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIDD Control Plane MVP 048",
  description: "One-Run Execution Readiness Gate for AIDD Control Plane SaaS"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
