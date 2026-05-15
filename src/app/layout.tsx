import type { Metadata } from "next";
import "./globals.css";

import { ThemeScript } from "@/components/ThemeScript";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "やること保管庫",
  description: "後回し案件を保存し、次にやることまで整理するWebアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full antialiased" lang="ja" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeScript />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

