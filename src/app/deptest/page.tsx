"use client";

import { useState } from 'react';

export default function UniversalDevSandbox() {
  const [targetBaseUrl, setTargetBaseUrl] = useState('');
  const [executionStatus, setExecutionStatus] = useState('');

  const handleDynamicMount = () => {
    if (!targetBaseUrl) {
      setExecutionStatus('エラー: 配信拠点のベースURLを指定してください。');
      return;
    }

    try {
      setExecutionStatus('URL構造の正規化を開始...');
      
      const normalizedBase = targetBaseUrl.endsWith('/') ? targetBaseUrl : `${targetBaseUrl}/`;
      const injectionUrl = `${normalizedBase}emulator.js`;
      
      setExecutionStatus(`ノード [${normalizedBase}] からアセットをマウント中...`);

      const viewLayer = document.createElement('div');
      viewLayer.id = 'game-holder'; 
      viewLayer.style.position = 'fixed';
      viewLayer.style.top = '0'; 
      viewLayer.style.left = '0';
      viewLayer.style.width = '100vw'; 
      viewLayer.style.height = '100vh';
      viewLayer.style.zIndex = '99999'; 
      viewLayer.style.backgroundColor = '#000';
      document.body.appendChild(viewLayer);

      const script = document.createElement('script');
      script.src = injectionUrl;
      
      script.onload = () => {
        setExecutionStatus('マウント完了。メインプロセスを開始します。');
        
        (window as any).EmuJS = {
          EmuJSRoot: `${normalizedBase}data/`,
          gameUrl: `${normalizedBase}sf3_rom.dat`,
          startOnLoaded: true
        };
      };
      
      script.onerror = () => {
        setExecutionStatus('エラー: アセットの取得に失敗しました。パスを確認してください。');
        viewLayer.remove();
      };
      
      document.head.appendChild(script);

    } catch (error) {
      setExecutionStatus('システムエラーが発生しました。');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '60px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>アセット・デプロイメント・ランタイム v2.0</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>
        リポジトリのベースURLを入力するだけで、内部の静的モジュールを自動解析し、サンドボックス環境内でプレビューを実行します。
      </p>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={targetBaseUrl}
          onChange={(e) => setTargetBaseUrl(e.target.value)}
          placeholder="https://username.github.io/repository/"
          style={{ width: '100%', padding: '15px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '8px' }}
        />
      </div>

      <button 
        onClick={handleDynamicMount}
        style={{ width: '100%', padding: '15px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        環境をマウントして実行
      </button>

      {executionStatus && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f7ff', borderLeft: '4px solid #0070f3', color: '#004a99', fontSize: '14px' }}>
          {executionStatus}
        </div>
      )}
    </div>
  );
}
