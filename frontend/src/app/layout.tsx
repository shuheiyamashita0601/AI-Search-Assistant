import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI検索アシスタント",
  description: "不動産物件をAIで検索できるアシスタントアプリケーション",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
