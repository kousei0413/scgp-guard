'use client'; // クリックイベント（動的ギミック）を有効にする魔法の呪文

import React, { useState } from 'react';

// アコーディオンの中身のデータ
const DIRECTORY_ITEMS = [
  { id: "1", title: "VRChatアバター最適化ツール", desc: "ポリゴン数やボーン構造を自動チェックし負荷を軽減。", url: "https://example.com" },
  { id: "2", title: "技術系コミュニティサーバー", desc: "進捗報告や技術的な質問、情報共有ができるDiscord。", url: "https://discord.gg" }
];

const EMULATOR_ITEMS = [
  { id: "e1", title: "EmulatorJS Core", desc: "ブラウザ完結型のレトロゲームエミュレータ環境。", url: "https://example.com" },
  { id: "e2", title: "ROM Extension Tester", desc: "各種ゲームファイルの拡張子互換性を検証するツール。", url: "https://example.com" }
];

export default function Home() {
  // どのメニューが開いているかを管理する状態（初期値は何も開いていない）
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // メニューをクリックしたときの処理
  const toggleMenu = (menuName: string) => {
    if (openMenu === menuName) {
      setOpenMenu(null); // すでに開いていたら閉じる
    } else {
      setOpenMenu(menuName); // 新しく開く
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-center px-6 max-w-4xl mx-auto py-12">
      <div className="space-y-12">
        
        {/* メインタイポグラフィ */}
        <div className="space-y-6">
          <div className="text-xs font-bold tracking-widest text-blue-600 uppercase">
            Expancoov Project Portal
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-tight">
            すべてのツールと、<br />
            コアな技術をここに集約。
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
            EmulatorJSの思想を受け継いだ、ブラウザ完結型の総合開発プラットフォーム。
          </p>
        </div>

        {/* 展開式メニューセクション */}
        <div className="space-y-8 border-t border-gray-100 pt-8 text-sm">
          
          {/* 1. ツール一覧 */}
          <div>
            <button 
              onClick={() => toggleMenu('directory')}
              className="font-bold tracking-wider text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors uppercase focus:outline-none text-xs"
            >
              {openMenu === 'directory' ? (
                <>ツール一覧 <span className="text-blue-600 text-[10px]">▼</span></>
              ) : (
                <>ツール一覧 <span className="text-blue-600 text-[10px]">◀</span></></>
              )}
            </button>

            {/* 開いたときの中身：縦一列のリスト */}
            {openMenu === 'directory' && (
              <div className="mt-4 ml-4 pl-4 border-l-2 border-blue-500/30 space-y-4 animate-fadeIn">
                {DIRECTORY_ITEMS.map(item => (
                  <div key={item.id} className="group">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 hover:text-blue-600 transition-colors block text-base">
                      {item.title}
                    </a>
                    <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. エミュレータ */}
          <div>
            <button 
              onClick={() => toggleMenu('emulator')}
              className="font-bold tracking-wider text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors uppercase focus:outline-none text-xs"
            >
              {openMenu === 'emulator' ? (
                <>エミュレータ <span className="text-purple-600 text-[10px]">▼</span></>
              ) : (
                <>エミュレータ <span className="text-purple-600 text-[10px]">◀</span></></>
              )}
            </button>

            {/* 開いたときの中身 */}
            {openMenu === 'emulator' && (
              <div className="mt-4 ml-4 pl-4 border-l-2 border-purple-500/30 space-y-4">
                {EMULATOR_ITEMS.map(item => (
                  <div key={item.id}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 hover:text-purple-600 transition-colors block text-base">
                      {item.title}
                    </a>
                    <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Discord（外部リンク） */}
          <div>
            <a 
              href="https://discord.gg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold tracking-wider text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors uppercase text-xs"
            >
              Discord <span className="text-emerald-600 text-[10px]">◀</span>
            </a>
          </div>

        </div>

      </div>
    </main>
  );
}
