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
          </div>
        </nav>

        {/* ─── 横並びレイアウトの開始 ─── */}
        <div className="flex flex-1 w-full">
          
          {/* 🧭 【共通枠】左サイドバー */}
          <aside className="w-40 bg-red-600 text-yellow-200 p-4 flex flex-col justify-between border-r border-yellow-200 min-h-[calc(100vh-4rem)]">
            
            {/* 上側：メニューリンク群 */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold text-red-300 uppercase tracking-wider mb-2">test</div>
              <a href="/whatsramune" className="p-2 rounded hover:bg-red-500 transition text-sm">ramuneとは</a>
              <a href="/test" className="p-2 rounded hover:bg-red-500 transition text-sm">🧪 test</a>
              <a href="/test" className="p-2 rounded hover:bg-red-500 transition text-sm">🧪 test</a>
            </div>

            {/* 下側：🎴 Discord 画像製ボタン */}
            <div className="mt-auto pt-4 border-t border-red-500/50">
              <a 
                href="https://discord.gg/2W9gNv8ep9" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative block w-full aspect-[4/3] rounded-lg overflow-hidden bg-zinc-950 border border-yellow-200/40 shadow-md transition-all duration-300 hover:scale-[1.03] hover:border-yellow-300"
              >
                {/* 🔒 変更点：コメントアウトを解除し、パスを /dlogo.png に修正 */}
                <img 
                  src="/dlogo.png" 
                  alt="Discord" 
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                /> 
                
                {/* 画像がホバーされた時にフワッと浮かび上がるオーバーレイ装飾（高級感アップ） */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
              </a>
            </div>

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
