import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Run Result Digest Publisher",
  description: "AIDD Control Plane MVP064"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
