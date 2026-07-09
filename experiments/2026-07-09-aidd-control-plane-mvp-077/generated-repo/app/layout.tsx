import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Preview Smoke Receipt Binder",
  description: "MVP076 Publication Evidence QA Gate後段のHTTP smoke receipt binder"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
