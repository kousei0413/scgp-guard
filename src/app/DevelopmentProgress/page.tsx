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
          SCGP、開発進捗<br />
        </h1>

        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          m1911model
        </p>
        <img 
  src="/m1911.png" 
  alt="m1911" 
  className="w-[300px] h-auto rounded-lg shadow-md" />
        
        <hr className="border-gray-250 my-6" />
        
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          モーゼルc96モデル
        </p>
        <img 
  src="/c96.png" 
  alt="モーゼルc96" 
  className="w-[300px] h-auto rounded-lg shadow-md" />
        
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          <br />
          
        </p>
      </div>

    </div>
  );
}
