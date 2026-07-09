import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Publication Evidence QA Gate MVP076",
  description: "公開前QAの証跡ゲート"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
