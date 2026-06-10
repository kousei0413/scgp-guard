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
        
        <h1 className="text-4xl sm:text-6xl font-black text-red-600 tracking-tight leading-tight">
          キチガイ検知！<br />
        </h1>
        
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          ramuneとはShadow Garden Officialに頻繫に出没するキチガイ（変質者）です、彼はモデレーター権限を乱用して都合の悪いメッセージをひたすら削除します、
          なのに正義感（見せかけ）だけは一人前です、
  
        </p>
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          彼はscgpを乗っ取ろうとしています
  
        </p>
        
        
        <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          【お知らせ】<br />
          ramuneがocasanをtoしました。
        </p>
      </div>

    </div>
  );
}
