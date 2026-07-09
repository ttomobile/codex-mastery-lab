import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Public Preview Smoke Final Receipt",
  description: "公開previewのHTML・画像・terminal evidence画像を最終確認するAIDD Control Plane MVP"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
