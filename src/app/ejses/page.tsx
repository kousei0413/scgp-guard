'use client';

import React from 'react';

export default function Home() {
  return (
    <div className="space-y-12 w-full">
      
      {/* タイポグラフィ（組織概要・お知らせの文字データのみに集約） */}
      <div className="space-y-6">
        <div className="text-xs font-bold tracking-widest text-blue-600 uppercase">
         what is cps3?????????
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-tight">
          cps3とは<br />
        </h1>
        
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          CPシステムIII（シーピーシステム スリー）とは、1996年に発売・稼働開始したカプコン開発のアーケードゲーム基板である。この基板がカプコンの開発した最後のアーケードゲーム用システム基板となり、以降はセガ製のNAOMI基板など、他社製の基板を採用するよう方向にシフトしていくこととなる。日本国外を中心にCPS-3と略称されることがある（以降、記事中ではこの略称を用いる）。
        </p>
        
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          
        </p>
      </div>

    </div>
  );
}
