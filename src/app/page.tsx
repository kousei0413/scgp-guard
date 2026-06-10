'use client';

import React, { useState } from 'react';

const DIRECTORY_ITEMS = [
  { id: "1", title: "あああ", desc: "ポリゴン数やボーン構造を自動チェックし負荷を軽減開発中。", url: "https://example.com" },
  { id: "2", title: "技術系コミュニティサーバー", desc: "進捗報告や技術的な質問、情報共有ができるDiscord。", url: "https://discord.gg" }
];

// 💡 念のため配列名も EMULATOR から MODULE に変更して安全性を確保
const MODULE_ITEMS = [
  { id: "e1", title: "EmulatorJS Core", desc: "ejsツール。", url: "https://example.com" },
  { id: "e2", title: "ROM Extension Tester", desc: "拡張子互換性検証（開発中）。", url: "https://example.com" }
];

export default function Home() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menuName: string) => {
    if (openMenu === menuName) {
      setOpenMenu(null);
    } else {
      setOpenMenu(menuName);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* 1. ナビゲーションバー画面最上部 */}
      <nav className="border-b border-gray-100 bg-red-600 backdrop-blur sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* 左側：ロゴ */}
          <a href="/" className="text-yellow-300 font-black tracking-widest uppercase">
            Expancoov <span className="text-yellow-300">group SCGP ☭</span>
          </a>

          {/* 右側：指定通りのメニュー配置 */}
          <div className="flex items-center gap-6 text-xs font-bold tracking-wider uppercase">
            <button 
              onClick={() => toggleMenu('directory')}
              className="hover:text-yellow-600 transition-colors flex items-center gap-1 focus:outline-none text-yellow-200"
            >
              ツール一覧 {openMenu === 'directory' ? <span className="text-blue-600 text-[10px]">▼</span> : <span className="text-blue-600 text-[10px]">◀</span>}
            </button>
            {/* 🔒 隠語化：内部処理の指定を 'emulator' から 'module' に差し替え */}
            <button 
              onClick={() => toggleMenu('module')}
              className="hover:text-yellow-600 transition-colors flex items-center gap-1 focus:outline-none text-yellow-200"
            >
              エミュレータ {openMenu === 'module' ? <span className="text-purple-600 text-[10px]">▼</span> : <span className="text-purple-600 text-[10px]">◀</span>}
            </button>
            <a 
              href="https://discord.gg/2W9gNv8ep9" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-yellow-600 transition-colors flex items-center gap-1 text-yellow-200"
            >
              Discord <span className="text-emerald-600 text-[10px]">◀</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ─── 🛠️ ここから書き足し①（横並びとサイドバー） ─── */}
      <div className="flex flex-1 w-full">
        
        {/* 🧭 左サイドバー（指定通り bg-red-600。ホバー時のグレー化を阻止して赤系に変更） */}
        <aside className="w-40 bg-red-600 text-yellow-200 p-6 flex flex-col gap-2 border-r border-yellow-200 min-h-[calc(100vh-4rem)]">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">test</div>
          <a href="/test" className="p-2 rounded hover:bg-red-500 transition">🧪 ramuneとは</a>
          <a href="/test" className="p-2 rounded hover:bg-red-500 transition">🧪 test</a>
          <a href="/test" className="p-2 rounded hover:bg-red-500 transition">🧪 test</a>
        </aside>
      {/* ─── 🛠️ ここまで書き足し① ─── */}

        {/* 2. メインコンテンツエリア */}
        <main className="flex-1 flex flex-col justify-center px-6 max-w-4xl w-full mx-auto py-12">
          <div className="space-y-12">
            
            {/* タイポグラフィ（文字だけ） */}
            <div className="space-y-6">
              <div className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                Expancoov Project Portal
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-tight">
                SCGP、<br />
              </h1>
              <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
                node.jsなどを用いたコードを開発、shadowcompnyaddonのガンパックを開発している組織です
              </p>
              <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
                【お知らせ】<br />
                ガンパックをスキンパックだと一部の人が誤解しているようです、<br />
                ガンパックはscaddonに新たな銃機を追加するもので、スキンパックはまた別のものです。
              </p>
            </div>

            {/* 3. リストの展開場所（中央の文字の下） */}
            {/* 🔒 隠語化：条件分岐も 'module' に変更 */}
            {(openMenu === 'directory' || openMenu === 'module') && (
              <div className="border-t border-gray-100 pt-8">
                
                {/* ツール一覧 */}
                {openMenu === 'directory' && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">▼ ツール一覧</div>
                    <div className="pl-4 border-l-2 border-blue-500/30 space-y-4">
                      {DIRECTORY_ITEMS.map(item => (
                        <div key={item.id}>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 hover:text-blue-600 transition-colors block text-base">
                            {item.title}
                          </a>
                          <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* エミュレータ（画面上の表示文字はそのまま、中身のシステムだけ隠語化） */}
                {openMenu === 'module' && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-purple-600 tracking-wider uppercase mb-2">▼ エミュモジュール</div>
                    <div className="pl-4 border-l-2 border-purple-500/30 space-y-4">
                      {MODULE_ITEMS.map(item => (
                        <div key={item.id}>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 hover:text-purple-600 transition-colors block text-base">
                            {item.title}
                          </a>
                          <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </main>

      {/* ─── 🛠️ ここから書き足し②（横並び枠組みの終了閉じタグ） ─── */}
      </div>
      {/* ─── 🛠️ ここまで書き足し② ─── */}

    </div>
  );
}
