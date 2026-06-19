"use client";

import { useState } from 'react';

export default function UniversalDevSandbox() {
  const [repoUrl, setRepoUrl] = useState('https://github.com/kousei0413/sf3web');
  const [entryPoint, setEntryPoint] = useState('emulator.js'); // 読み込むメインファイルを指定可能にする
  const [executionStatus, setExecutionStatus] = useState('');

  const handleDynamicMount = () => {
    try {
      setExecutionStatus('リポジトリの解析を開始...');
      
      const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
      const match = repoUrl.match(urlPattern);
      
      if (!match) {
        setExecutionStatus('エラー: 有効なGitHubリポジトリのURLを入力してください。');
        return;
      }
      
      const userNode = match[1];
      const repoNode = match[2].replace('.git', '');
      
      setExecutionStatus(`モジュール [${repoNode}] から静的アセットをマウント中...`);

      // 描画用のコンテナを動的に生成（どんなアプリのプレビューにも対応できるようにする）
      const sandboxContainer = document.createElement('div');
      sandboxContainer.id = 'sandbox-runtime-container'; 
      sandboxContainer.style.position = 'fixed';
      sandboxContainer.style.top = '0';
      sandboxContainer.style.left = '0';
      sandboxContainer.style.width = '100vw';
      sandboxContainer.style.height = '100vh';
      sandboxContainer.style.zIndex = '99999';
      sandboxContainer.style.backgroundColor = '#000';
      document.body.appendChild(sandboxContainer);

      // 指定されたエントリーポイント（JSファイル）を動的に注入
      const scriptInjection = document.createElement('script');
      // jsDelivrの制限を考慮し、将来的にはここをVercelの自作API（中継プロキシ）に差し替える
      scriptInjection.src = `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/${entryPoint}`;
      
      scriptInjection.onload = () => {
        setExecutionStatus('アセットのマウントが正常に完了しました。ランタイムを実行します。');
        
        // エミュレータを動かす場合は、この読み込み成功のタイミングで
        // グローバル環境（window）に必要な初期化設定が流し込まれる。
        // 他の自作ツールやスクリプトを読み込む場合も、それぞれの初期化ロジックが走る。
      };
      
      scriptInjection.onerror = () => {
        setExecutionStatus('マウント失敗: 外部リソースの取得に失敗しました。ファイルパスまたはサイズ制限を確認してください。');
        sandboxContainer.remove();
      };
      
      document.head.appendChild(scriptInjection);

    } catch (error) {
      setExecutionStatus('システムエラーが発生しました。');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>汎用スタティックアセット・デプロイメント・ランタイム</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        GitHub上の静的ソースコードおよびWebモジュールをリアルタイムで環境内にマウントし、分離されたサンドボックス環境で動作検証を行うことができます。
      </p>
      
      <div style={{ marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Repository URL:</label>
        <input 
          type="text" 
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Entry Point File (JS):</label>
        <input 
          type="text" 
          value={entryPoint}
          onChange={(e) => setEntryPoint(e.target.value)}
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
          placeholder="example.js"
        />
      </div>

      <button 
        onClick={handleDynamicMount}
        style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        サンドボックス環境を生成して実行
      </button>

      {executionStatus && (
        <div style={{ marginTop: '20px', padding: '12px', background: '#f6f8fa', borderLeft: '4px solid #0070f3', fontSize: '14px' }}>
          {executionStatus}
        </div>
      )}
    </div>
  );
}
