import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIDD Control Plane MVP 053",
  description: "AI Task Packet auto shrink proposal for STOP and BRAKE"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
