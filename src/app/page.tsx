import React from 'react';

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-center px-6 max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* タグ */}
        <div className="text-xs font-bold tracking-widest text-blue-600 uppercase">
          Expancoov Project Portal
        </div>

        {/* メインタイトル */}
        <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-tight sm:leading-none">
          すべてのツールと、<br />
          コアな技術をここに集約。
        </h1>

        {/* ディスクリプション（文字のみ） */}
        <div className="max-w-2xl space-y-4 text-gray-500 text-sm sm:text-base leading-relaxed font-medium">
          <p>
            EmulatorJSの思想を受け継いだ、ブラウザ完結型の総合開発プラットフォーム。
          </p>
          <p>
            データ管理、エミュレーション、そしてコミュニティ。Expancoov group が展開する各種モジュールや技術ドキュメントへのアクセスは、上部のナビゲーションメニューをご利用ください。
          </p>
        </div>
      </div>
    </main>
  );
}

