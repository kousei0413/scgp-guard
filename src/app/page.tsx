'use client';

import React, { useState } from 'react';

const DIRECTORY_ITEMS = [
  { id: "1", title: "あああ", desc: "ポリゴン数やボーン構造を自動チェックし負荷を軽減開発中。", url: "https://example.com" },
  { id: "2", title: "技術系コミュニティサーバー", desc: "進捗報告や技術的な質問、情報共有ができるDiscord。", url: "https://discord.gg" }
];

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
    <div className="space-y-12 w-full">
      
      {/* 🛠️ メインエリア内上部に設置したメニュー展開トリガーボタン */}
      <div className="flex gap-6 text-xs font-bold tracking-wider uppercase border-b border-gray-100 pb-4">
        <button 
          onClick={() => toggleMenu('directory')}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          ツール一覧 {openMenu === 'directory' ? '▼' : '◀'}
        </button>
        <button 
          onClick={() => toggleMenu('module')}
          className="text-purple-600 hover:underline flex items-center gap-1"
        >
          エミュレータ（モジュール） {openMenu === 'module' ? '▼' : '◀'}
        </button>
      </div>

      {/* タイポグラフィ（文字データ） */}
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

      {/* 3. リストの展開場所（隠語 'module' に完全対応） */}
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

          {/* エミュレータ（隠語: module） */}
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
  );
}
