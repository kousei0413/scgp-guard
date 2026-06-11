'use client';

import React from 'react';

export default function Home() {
  return (
    <div className="space-y-12 w-full">
      
      {/* タイポグラフィ（組織概要・お知らせの文字データのみに集約） */}
      <div className="space-y-6">
        <div className="text-xs font-bold tracking-widest text-blue-600 uppercase">
        test
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-tight">
          こちらはテストページです、引き返してください<br />
        </h1>
        
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          aaa
        </p>
        
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          
        </p>
      </div>

    </div>
  );
}
