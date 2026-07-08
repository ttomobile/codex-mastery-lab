import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Publication Evidence QA Gate",
  description: "AIDD Control Plane MVP065"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
