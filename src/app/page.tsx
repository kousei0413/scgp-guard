'use client';

import React from 'react';

export default function Home() {
  return (
    <div className="space-y-12 w-full">
      
      {/* タイポグラフィ（組織概要・お知らせの文字データのみに集約） */}
      <div className="space-y-6">
        <div className="text-xs font-bold tracking-widest text-blue-600 uppercase">
          Expancoov Project Portal
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-tight">
          SCGP☭<br />
        </h1>
        
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          node.jsなどを用いたコードを開発、shadowcompnyaddonのガンパックを開発している組織です
      
        </p>
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          当サイトではガンパックの他に、多種多様なツールを提供しております
      
        </p>

           <hr className="border-gray-250 my-6" />
        
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          【お知らせ】<br />
          ガンパックをスキンパックだと一部の人が誤解しているようです、<br />
          ガンパックはscaddonに新たな銃機を追加するもので、スキンパックはまた別のものです。
        </p>
      </div>

    </div>
  );
}
