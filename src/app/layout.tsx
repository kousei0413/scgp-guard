import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expancoov Project Portal",
  description: "SCGP Portal Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} min-h-screen bg-white flex flex-col`}>
        
        {/* 1. 【共通枠】ナビゲーションバー画面最上部 */}
        <nav className="border-b border-gray-100 bg-red-600 backdrop-blur sticky top-0 z-50 w-full">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* 左側：ロゴ */}
            <a href="/" className="text-yellow-300 font-black tracking-widest uppercase">
              Expancoov <span className="text-yellow-300">group SCGP ☭</span>
            </a>

            {/* 右側：共通リンク（※ヘッダー開閉は非推奨のためシンプルな静的配置、または必要に応じてクライアントコンポーネント化） */}
            <div className="flex items-center gap-6 text-xs font-bold tracking-wider uppercase text-yellow-200">
              <a href="https://discord.gg/2W9gNv8ep9" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 transition-colors">
                Discord <span className="text-emerald-600 text-[10px]">◀</span>
              </a>
            </div>
          </div>
        </nav>

        {/* ─── 横並びレイアウトの開始 ─── */}
        <div className="flex flex-1 w-full">
          
          {/* 🧭 【共通枠】左サイドバー（一度書けば全ページで維持される） */}
          <aside className="w-40 bg-red-600 text-yellow-200 p-6 flex flex-col gap-2 border-r border-yellow-200 min-h-[calc(100vh-4rem)]">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">test</div>
            {/* 🔗 飛ばす先URLは href="..." の中でそれぞれ設定 */}
            <a href="/ramune" className="p-2 rounded hover:bg-red-500 transition">ramuneとは</a>
            <a href="/test2" className="p-2 rounded hover:bg-red-500 transition">🧪 test</a>
            <a href="/test3" className="p-2 rounded hover:bg-red-500 transition">🧪 test</a>
          </aside>

          {/* 📝 メインコンテンツ（ここに各ページの中身が自動的にはめ込まれる） */}
          <main className="flex-1 flex flex-col justify-center px-6 max-w-4xl w-full mx-auto py-12">
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}
