import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codex Run Budget Shrink Planner",
  description: "AIDD Control Plane MVP069"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
