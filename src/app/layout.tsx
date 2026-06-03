import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expancoov group",
  description: "総合開発・コミュニティプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-white text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
