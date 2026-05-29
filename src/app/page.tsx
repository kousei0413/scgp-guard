import React from 'react';

const ITEMS = [
  {
    id: "1",
    title: "VRChatアバター最適化ツール",
    description: "ポリゴン数やボーン構造を自動でチェックし、負荷を軽減するツール。",
    category: "ツール",
    tags: ["VRChat", "Unity"],
    url: "https://example.com"
  },
  {
    id: "2",
    title": "技術系コミュニティサーバー",
    description": "進捗報告や技術的な質問、情報共有ができるDiscordサーバー。",
    category": "Discord",
    tags: ["Minecraft", "開発"],
    url": "https://discord.gg"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">便利ツール & Discordサーバー まとめ</h1>
          <p className="text-gray-600">お気に入りのツールやコミュニティを一覧化</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ITEMS.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-3">
                  {item.category}
                </span>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-lg text-sm transition-colors">
                リンクを開く
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
