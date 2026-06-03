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
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* 1. 本物のナビゲーションバー（画面最上部に固定） */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* 左側：ロゴ */}
          <a href="/" className="text-lg font-black tracking-widest uppercase">
            Expancoov <span className="text-blue-600">group</span> SCGP
          </a>

          {/* 右側：指定通りのメニュー配置 */}
          <div className="flex items-center gap-6 text-xs font-bold tracking-wider uppercase">
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
        </div>
      </nav>

      {/* 2. メインコンテンツエリア */}
      <main className="flex-1 flex flex-col justify-center px-6 max-w-4xl w-full mx-auto py-12">
        <div className="space-y-12">
          
          {/* タイポグラフィ（文字だけ） */}
          <div className="space-y-6">
            <div className="text-xs font-bold tracking-widest text-blue-600 uppercase">
              Expancoov Project Portal
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-tight">
              すべてのgayと、<br />
              コアなアナル技術をここに集約！。
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
              EmulatorJSの思想を受け継いだ、ブラウザ完結型の総合開発プラットフォーム。
            </p>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
　　　　　　　　（セミ兄貴による演奏）
ん～ いいときには結構いくね - 田所
              
へ～ - 遠野
              
結構楽だったよ - 田所
              
こ↑こ↓ - 田所
              
はえ～・・・すっごいおっきい・・・ - 遠野
              
ｶﾞｯｺﾁｬｯ ﾎﾟﾝ - ドアくん
入って、どうぞ - 田所
お邪魔しまーす - 遠野
ｶｯﾁｬﾝ - ドアくん
いいよ上がったって - 田所
あっ・・・すいません - 遠野
ｶﾁｯ - 謎
本当におっきいっすね・・・ - 遠野
今日はホント疲れましたよー - 遠野
ねー今日練習きつかったねー - 田所
ｱｱｧｲ - 遠野
ｽｰ、まぁ大会近いからね - 田所
そうですね・・・ - 遠野
しょうがないね - 田所
ｽｰ、今日タァイムはどう？ - 田所
イマイチっすね・・・ - 遠野
伸びた？伸びない？ - 田所
んぇー・・・ - 遠野
緊張すると力でないからね - 田所
そうですね・・・ - 遠野
ベスト出せるようにね - 田所
はい - 遠野
頼むよ - 田所
はい - 遠野
うん - 田所
まずウチさぁ・・・ - 田所
ｳﾝ（タメ口） - 遠野
屋上・・・あんだけど・・・ - 田所
はえ～・・・ - 遠野
焼いてかない？ - 田所
あ～いいっすね～ - 遠野
ｳﾝ - 田所
ﾐｰ----ﾐｰﾝﾐｰﾝﾐｰ - セミ兄貴
ﾌﾞﾛｵｵｵｵﾝ!!ﾌﾞﾛｵｵｵﾝ!! - 一般通過バイク
ｶﾞﾀﾝｺﾞﾄﾝ ｶﾞﾀﾝｺﾞﾄﾝ - 一般通過小田急
見られないですかね？ - 遠野
大丈夫でしょ。ま、多少はね？ - 田所
暑いっすね - 遠野
暑いねー - 田所
オイル塗ろっか - 田所
はあ（待望） - 遠野
やるわ - 田所
あ、ありがとうございます - 遠野
ｶﾝ - 一般通過工事
硬くなってんぜ？ - 田所
え、そんなことないですよ - 遠野
溜まってんなぁオイ - 田所
ﾌﾞﾛﾛﾛ ﾌﾞﾛﾛﾛﾛﾛ - 一般通過工事
先輩ダメっす・・・ - 遠野
どんぐらいやってないの？ - 田所
もう2ヶ月くらい・・・ - 遠野
2ヶ月・・・だいぶ溜まってんじゃんやばいじゃん - 田所
（遠野のチンピク）
（野獣の眼光）
あんまり上手いから気持ちよくなってきたな - 田所
勃ってきちゃったよ・・・（ご満悦先輩） - 田所
もうこれ以上やると気持ちよくなっちゃう もういいよ ヤバイヤバイ - 田所
喉渇いた、喉渇かない？ - 田所
あー喉渇きましたね - 遠野
なんか飲み物持ってくる - 田所
はい - 遠野
ちょっと待ってて - 田所
はい - 遠野
サッー！（迫真） サッー・・・ - 睡眠薬くん
おまたせ！アイスティーしかなかったんだけどいいかな？ - 田所
頂きまーす - 遠野
ﾄﾞｿﾞｰ - 田所
プハー - 遠野
焼けたかな？ちょっと・・・ - 田所
これもうわかんねぇな お前どう？ - 田所
ｲｲｼﾞｬﾝｲｲｼﾞｬﾝ ｷﾚｲｷﾚｲｷﾚｲ - 田所
すっげえ白くなってる、はっきり分かんだね - 田所
この辺がちょっとセクシー・・・ エロいっ！ - 田所
曇ってきたな そろそろ、中入るか - 田所
ｶｰｶｰｶｰｶｰｶｰｶｰ - カラスくん
おっ大丈夫か、大丈夫か - 田所
大丈夫です・・・ - 遠野
ｶｰｶｰｶｰｶｰｶｰ - カラスくん
ﾁｭﾊﾟｯ! ﾁｭｯ! ﾁｭｲ!↑ - チュパ音
先輩！？何してんすか！止めて下さいよホントに！ - 遠野
暴れるなよ・・・暴れるなよ・・・ - 田所
田所さん！？ ちょっと - 遠野
ｲｲﾀﾞﾛ - 田所
まずいですよ！ - 遠野
いいだろ遠野！ - 田所
止めて下さいよ！ - 遠野
な！ 暴れるなよ！ - 田所
嫌だって、ちょ！ちょ！ - 遠野
う！なぁ、何してるんすか？！ - 遠野
ﾄﾝﾄﾝﾄﾝﾄﾝﾄﾝ - やわらかスマホ
何してん・・・ちょっとホントに！ﾎﾝﾄに - 遠野
う！う、う、う、羽毛・・・う・・・ - 遠野
遠野気持ち良いか？ - 田所
う・・・う・・・ - 遠野
気持ち良いだろ - 田所
お前の事が好きだったんだよ！ - 田所
バァン！ - 壁
いいのかぁ？ - 田所
あー気持ちいい - 田所
もっと舌使ってくれよ - 田所
気持ち良いよー - 田所
自分で動かして・・・ - 田所
あーいいよー - 田所
ンアー - 田所
気持ちいいか？ - 田所
ｷﾓﾁｲｲ・・・ｷﾓﾁｲｲ・・・ - 遠野
アン！アン！アン！アン！アン！アン！アン！アン！アン！アッーンン！！（高音） - 遠野（世界レベル）
気持ち、いいよー - 田所
ッアアアア、アアアーアアッ、ハア゛ッ、ア゛ア゛、オォン、ンー、オォン！アォン！ - 田所
ゼェハア…ゼェハア…ゼェハア…ゼェハア…アアッ！ハァッ…ハッ イキスギィ！イクゥイクイクゥィク… - 田所
ンアッー！ / (≧Д≦)
フゥン！フゥン！フゥン！（シンクロ） - 田所・遠野
ｱ､ｲｷｿ - 遠野
いいよ！来いよ！胸に掛けて胸に！ - 田所
胸に掛けて！ - 田所
ファッ！？ - 田所
（二人は幸せなキスをして終了）
            </p>
          </div>

          {/* 3. リストの展開場所（中央の文字の下） */}
          {(openMenu === 'directory' || openMenu === 'emulator') && (
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

              {/* エミュレータ */}
              {openMenu === 'emulator' && (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-purple-600 tracking-wider uppercase mb-2">▼ エミュレータモジュール</div>
                  <div className="pl-4 border-l-2 border-purple-500/30 space-y-4">
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
