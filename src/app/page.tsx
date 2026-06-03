'use client';

import React, { useState } from 'react';

const DIRECTORY_ITEMS = [
  { id: "1", title: "VRChatアバター最適化ツール", desc: "ポリゴン数やボーン構造を自動チェックし負荷を軽減。", url: "https://example.com" },
  { id: "2", title: "技術系コミュニティサーバー", desc: "進捗報告や技術的な質問、情報共有ができるDiscord。", url: "https://discord.gg" }
];

const EMULATOR_ITEMS = [
  { id: "e1", title: "EmulatorJS Core", desc: "ブラウザ完結型のレトロゲームエミュレータ環境。", url: "https://example.com" },
  { id: "e2", title: "ROM Extension Tester", desc: "各種ゲームファイルの拡張子互換性を検証するツール。", url: "https://example.com" }
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
    <div className="relative min-h-[calc(100vh-4rem)] bg-white">
      
      {/* ★【最上部のメニューエリア】画面の右上に「〇〇 ◀」を絶対に配置 */}
      <div className="absolute -top-12 right-6 h-12 flex items-center gap-6 text-xs font-bold tracking-wider uppercase z-50">
        <button 
          onClick={() => toggleMenu('directory')}
          className="hover:text-gray-900 transition-colors flex items-center gap-1 focus:outline-none text-gray-500"
        >
          ツール一覧 {openMenu === 'directory' ? <span className="text-blue-600 text-[10px]">▼</span> : <span className="text-blue-600 text-[10px]">◀</span>}
        </button>
        <button 
          onClick={() => toggleMenu('emulator')}
          className="hover:text-gray-900 transition-colors flex items-center gap-1 focus:outline-none text-gray-500"
        >
          エミュレータ {openMenu === 'emulator' ? <span className="text-purple-600 text-[10px]">▼</span> : <span className="text-purple-600 text-[10px]">◀</span>}
        </button>
        <a 
          href="https://discord.gg" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-gray-900 transition-colors flex items-center gap-1 text-gray-500"
        >
          Discord <span className="text-emerald-600 text-[10px]">◀</span>
        </a>
      </div>

      {/* メメインコンテンツエリア */}
      <main className="flex flex-col justify-center px-6 max-w-4xl mx-auto pt-24 pb-12 min-h-[calc(100vh-4rem)]">
        <div className="space-y-12">
          
          {/* タイポグラフィ */}
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

          {/* ★【リストの展開場所】上のメニューを押すと、ここに縦一列でシュッと出てくる */}
          {(openMenu === 'directory' || openMenu === 'emulator') && (
            <div className="border-t border-gray-100 pt-8 animate-fadeIn">
              
              {/* ツール一覧が選択されたとき */}
              {openMenu === 'directory' && (
                <div className="space-y-6">
                  <div className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">▼ ツール一覧</div>
                  <div className="pl-4 border-l-2 border-blue-500/30 space-y-4 text-sm">
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

              {/* エミュレータが選択されたとき */}
              {openMenu === 'emulator' && (
                <div className="space-y-6">
                  <div className="text-xs font-bold text-purple-600 tracking-wider uppercase mb-2">▼ エミュレータモジュール</div>
                  <div className="pl-4 border-l-2 border-purple-500/30 space-y-4 text-sm">
                    {EMULATOR_ITEMS.map(item => (
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
    </div>
  );
}
