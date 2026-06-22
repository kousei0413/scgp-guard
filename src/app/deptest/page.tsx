"use client";

import { useState } from 'react';

export default function UniversalDevSandbox() {
  const [targetUrl, setTargetUrl] = useState('');
  const [executionStatus, setExecutionStatus] = useState('');
  const [sourceMode, setSourceMode] = useState<'pages' | 'repo'>('pages');

  const handleDynamicMount = () => {
    if (!targetUrl) {
      setExecutionStatus('エラー: ターゲットURLまたはリポジトリURLを指定してください。');
      return;
    }

    try {
      setExecutionStatus('選択されたモードでURLの解析を開始...');
      
      const viewLayer = document.createElement('div');
      viewLayer.id = 'sandbox-runtime-container'; 
      viewLayer.style.position = 'fixed';
      viewLayer.style.top = '0'; viewLayer.style.left = '0';
      viewLayer.style.width = '100vw'; viewLayer.style.height = '100vh';
      viewLayer.style.zIndex = '99999'; viewLayer.style.backgroundColor = '#000';

      if (sourceMode === 'pages') {
        const normalizedBase = targetUrl.endsWith('/') ? targetUrl : `${targetUrl}/`;
        const injectionUrl = `${normalizedBase}index.html`;
        
        setExecutionStatus(`GitHub Pages [${injectionUrl}] をフレーム展開中...`);

        const frame = document.createElement('iframe');
        frame.src = injectionUrl;
        frame.style.width = '100%'; frame.style.height = '100%'; frame.style.border = 'none';
        
        frame.onload = () => setExecutionStatus('Pagesのフレームマウントが完了しました。');
        frame.onerror = () => { setExecutionStatus('エラー: ターゲットアセットの取得に失敗。'); viewLayer.remove(); };
        
        viewLayer.appendChild(frame);
        document.body.appendChild(viewLayer);
      } 
      else if (sourceMode === 'repo') {
        const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
        const match = targetUrl.match(urlPattern);
        
        if (!match) {
          setExecutionStatus('エラー: 有効なGitHubリポジトリURL（https://github.com/ユーザー名/リポジトリ名）を入力してください。');
          return;
        }
        
        const userNode = match[1];
        const repoNode = match[2].replace('.git', '');
        
        const finalScriptSrc = `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/emulator.js`;
        setExecutionStatus(`リポジトリ [${repoNode}] からスクリプトをコアに注入中...`);

        document.body.appendChild(viewLayer); 
        
        const script = document.createElement('script');
        script.src = finalScriptSrc;
        
        script.onload = () => {
          setExecutionStatus('インジェクション成功。仮想ランタイムを起動します。');
          (window as any).EmuJS = {
            EmuJSRoot: `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/data/`,
            gameUrl: `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/sf3_rom.dat`,
            startOnLoaded: true
          };
        };
        
        script.onerror = () => {
          setExecutionStatus('エラー: CDN経由のスクリプトインジェクションに失敗しました。ファイルがルートに存在するか確認してください。');
          viewLayer.remove();
        };
        
        document.head.appendChild(script);
      }

    } catch (error) {
      setExecutionStatus('システムエラーが発生しました。');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '60px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>マルチ互換アセット・デプロイメント・ランタイム v3.0</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>
        デプロイソースの種類を選択し、対応するターゲットのURLを入力して実行してください。
      </p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <label style={{ fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="radio" 
            name="sourceMode" 
            value="pages" 
            checked={sourceMode === 'pages'} 
            onChange={() => setSourceMode('pages')}
            style={{ width: '18px', height: '18px' }}
          />
          GitHub Pages を使用 (index.html 埋め込み)
        </label>
        <label style={{ fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="radio" 
            name="sourceMode" 
            value="repo" 
            checked={sourceMode === 'repo'} 
            onChange={() => setSourceMode('repo')}
            style={{ width: '18px', height: '18px' }}
          />
          GitHub リポジトリ を使用 (JS 動的注入)
        </label>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder={sourceMode === 'pages' ? "https://kousei0413.github.io/sf3web/" : "https://github.com/kousei0413/sf3web"}
          style={{ width: '100%', padding: '15px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '8px', boxSizing: 'border-box' }}
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
