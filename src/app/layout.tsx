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
        {/* ナビゲーションバー */}
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div>
              <a href="/" className="text-lg font-black tracking-widest uppercase hover:opacity-75 transition-opacity">
                Expancoov <span className="text-blue-600">group</span>
              </a>
            </div>
            {/* 各機能を「〇〇 ◀」の形式で右側に集約 */}
            <div className="flex items-center gap-6 text-xs font-bold tracking-wider uppercase text-gray-500">
              <a href="/directory" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                ツール一覧 <span className="text-blue-600 text-[10px]">◀</span>
              </a>
              <a href="/emulator" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                エミュレータ <span className="text-purple-600 text-[10px]">◀</span>
              </a>
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                Discord <span className="text-emerald-600 text-[10px]">◀</span>
              </a>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
