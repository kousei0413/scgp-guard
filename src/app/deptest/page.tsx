"use client"; // この行が絶対に必要です（Server Componentとしてのビルドを回避）

import { useState } from 'react';

export default function DevSandboxPortal() {
  const [targetSourceUrl, setTargetSourceUrl] = useState('https://github.com/kousei0413/sf3web');
  const [executionStatus, setExecutionStatus] = useState('');

  const handleSourceMount = () => {
    try {
      setExecutionStatus('リポジトリの構造を解析中...');
      
      const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
      const match = targetSourceUrl.match(urlPattern);
      
      if (!match) {
        setExecutionStatus('エラー: 有効なURLを入力してください。');
        return;
      }
      
      const userNode = match[1];
      const repoNode = match[2].replace('.git', '');
      
      setExecutionStatus(`コンポーネント [${repoNode}] から静的アセットをマウント中...`);

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

      const injectionScript = document.createElement('script');
      injectionScript.src = `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/emulator.js`;
      
      injectionScript.onload = () => {
        setExecutionStatus('マウント完了。メインプロセスを開始します。');
        
        window.EmuJS = {
          EmuJSRoot: `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/data/`,
          gameUrl: `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/sf3_rom.dat`,
          startOnLoaded: true
        };
      };
      
      injectionScript.onerror = () => {
        setExecutionStatus('通信エラー: 外部リポジトリからのデータ取得に失敗しました。ネットワーク制限を確認してください。');
        viewLayer.remove();
      };
      
      document.head.appendChild(injectionScript);

    } catch (error) {
      setExecutionStatus('システムエラーが発生しました。');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>マルチプレビュー・デプロイメント・コントロール</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        外部リポジトリのURLを指定することで、フロントエンドの静的アセットをリアルタイムで検証環境内に展開し、レンダリング確認を行うことができます。
      </p>
      
      <div style={{ marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Repository URL:</label>
        <input 
          type="text" 
          value={targetSourceUrl}
          onChange={(e) => setTargetSourceUrl(e.target.value)}
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <button 
        onClick={handleSourceMount}
        style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#2ea44f', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        環境を生成して展開（Deploy）
      </button>

      {executionStatus && (
        <div style={{ marginTop: '20px', padding: '12px', background: '#f6f8fa', borderLeft: '4px solid #005cc5', fontSize: '14px' }}>
          {executionStatus}
        </div>
      )}
    </div>
  );
}
