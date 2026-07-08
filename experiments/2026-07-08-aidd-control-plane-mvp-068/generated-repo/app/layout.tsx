import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Public Preview Smoke Verifier",
  description: "AIDD Control Plane MVP066"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
