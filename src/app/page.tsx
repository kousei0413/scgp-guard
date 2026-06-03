import React from 'react';

const FEATURES = [
  {
    title: "便利ツール & Discord一覧",
    description: "VRChat、Unity、Minecraftなどの開発に役立つツールやコミュニティを瞬時に検索・閲覧できるディレクトリ。",
    path: "/directory",
    status: "Available",
    color: "border-gray-200 hover:border-blue-500 hover:shadow-md"
  },
  {
    title: "Webエミュレータ部屋",
    description: "EmulatorJSを内蔵し、ブラウザ上で直接レトロゲームの動作テストやプレイができる専用モジュール。",
    path: "/emulator",
    status: "Developing",
    color: "border-gray-200 hover:border-purple-500 hover:shadow-md"
  },
  {
    title: "スクリプト / 技術ドキュメント",
    description: "C#やNode.jsによるネットワーク解析、自動化スクリプトなどの技術備忘録・開発ログ。",
    path: "/docs",
    status: "Planning",
    color: "border-gray-200 hover:border-emerald-500 hover:shadow-md"
  }
];

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 relative overflow-hidden bg-white">
      
      {/* 背景のうっすらとした爽やかな光の演出 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full text-center relative z-10 py-12">
        {/* ヒーローセクション */}
        <span className="text-xs font-bold tracking-widest text-blue-600 uppercase px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
          Expancoov Project Portal
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mt-4 mb-6 tracking-tight">
          すべてのツールと、<br className="sm:hidden" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            コアな技術をここに集約。
          </span>
        </h1>
        <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          EmulatorJSの思想を受け継いだ、ブラウザ完結型の総合開発ハブ。データ管理、エミュレーション、コミュニティの導線を「Expancoov group」が1つに。
        </p>

        {/* 主要機能へのナビゲーション（ライトモード仕様） */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {FEATURES.map((feat) => (
            <a
              key={feat.title}
              href={feat.path}
              className={`block p-6 bg-gray-50/50 backdrop-blur rounded-2xl border transition-all duration-300 group ${feat.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                  feat.status === 'Available' ? 'bg-blue-100 text-blue-800' :
                  feat.status === 'Developing' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {feat.status}
                </span>
                <span className="text-gray-400 group-hover:text-gray-900 transition-colors">→</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {feat.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feat.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
