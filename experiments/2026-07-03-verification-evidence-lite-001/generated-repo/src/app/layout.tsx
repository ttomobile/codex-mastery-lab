import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "日次チェックリスト Lite",
  description: "日々のタスクをさっと追加して確認する小さなチェックリスト"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
