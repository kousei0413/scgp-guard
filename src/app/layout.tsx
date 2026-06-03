import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ポータルハブ",
  description: "総合開発・コミュニティプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-950 text-gray-100 antialiased font-sans">
        {/* 全ページ共通のナビゲーションバー */}
        <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="/" className="text-xl font-black tracking-wider text-white hover:opacity-80">
                PORTAL<span className="text-blue-500">.JS</span>
              </a>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
              <a href="/directory" className="hover:text-white transition-colors">ツール一覧</a>
              <a href="/emulator" className="hover:text-white transition-colors">エミュレータ</a>
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors">
                Discord
              </a>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
