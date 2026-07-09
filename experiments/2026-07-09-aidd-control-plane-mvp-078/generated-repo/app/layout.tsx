import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smoke Receipt Repair Action Planner",
  description: "Preview Smoke Receiptの失敗を次の1回の修正Actionへ畳み込むAIDD Control Plane MVP"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
