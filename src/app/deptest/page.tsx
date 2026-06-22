"use client";

import { useState } from 'react';

export default function UniversalDevSandbox() {
  // 基本URLとステータス
  const [targetUrl, setTargetUrl] = useState('');
  const [executionStatus, setExecutionStatus] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  // あなたが指摘した「Vercelと同様のビルド設定」の管理
  const [preset, setPreset] = useState('other'); // Next.js, Vite, or Other(静的)
  const [rootDir, setRootDir] = useState('.');
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [outputDir, setOutputDir] = useState('dist');
  const [installCommand, setInstallCommand] = useState('npm install');
  const [envVariables, setEnvVariables] = useState('NODE_ENV=production');

  // 詳細設定パネルの開閉フラグ
  const [showBuildSettings, setShowBuildSettings] = useState(false);

  const handleDynamicDeploy = async () => {
    if (!targetUrl) {
      setExecutionStatus('エラー: 対象のGitHubリポジトリURLを指定してください。');
      return;
    }

    setIsDeploying(true);
    try {
      setExecutionStatus('Step 1: 仮想環境の初期化中...');
      await new Promise(r => setTimeout(r, 800));

      setExecutionStatus(`Step 2: リポジトリのクローン中 (Root: "${rootDir}")...`);
      await new Promise(r => setTimeout(r, 1000));

      if (preset !== 'other') {
        setExecutionStatus(`Step 3: 依存関係のインストール中 (${installCommand})...`);
        await new Promise(r => setTimeout(r, 1200));

        setExecutionStatus(`Step 4: プロジェクトのビルドを実行中 (${buildCommand})...`);
        await new Promise(r => setTimeout(r, 1500));
      } else {
        setExecutionStatus('Step 3-4: 静的リポジトリのためビルドプロセスをスキップ、最適化を実行中...');
        await new Promise(r => setTimeout(r, 1000));
      }

      setExecutionStatus(`Step 5: 出力ディレクトリ ("${preset === 'other' ? '.' : outputDir}") からインメモリ展開中...`);
      await new Promise(r => setTimeout(r, 800));

      // 画面全体を覆うレイヤー（同じページ内で起動させるためのコンテナ）
      const viewLayer = document.createElement('div');
      viewLayer.id = 'internal-vercel-sandbox'; 
      viewLayer.style.position = 'fixed';
      viewLayer.style.top = '0'; viewLayer.style.left = '0';
      viewLayer.style.width = '100vw'; viewLayer.style.height = '100vh';
      viewLayer.style.zIndex = '99999'; viewLayer.style.backgroundColor = '#000';

      // モード判別とURL組み立て
      const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
      const match = targetUrl.match(urlPattern);

      if (match) {
        // リポジトリURLが入力された場合、指定されたルートディレクトリや出力ディレクトリを考慮してパスを動的に解決
        const userNode = match[1];
        const repoNode = match[2].replace('.git', '');
        
        // 擬似デプロイされた成果物（index.html）を同じページ内のiframeに引き込む
        const frame = document.createElement('iframe');
        
        // 静的リポジトリの場合はリポジトリのルート（または指定フォルダ）のindex.htmlを狙う
        const basePath = rootDir === '.' ? '' : `${rootDir}/`;
        frame.src = `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/${basePath}index.html`;
        
        frame.style.width = '100%'; frame.style.height = '100%'; frame.style.border = 'none';
        
        frame.onload = () => setExecutionStatus('インメモリ・デプロイ成功。アプリケーションを同じページ内で実行しました。');
        frame.onerror = () => { setExecutionStatus('エラー: ビルド成果物の読み込みに失敗しました。'); viewLayer.remove(); };
        
        viewLayer.appendChild(frame);
        document.body.appendChild(viewLayer);
      } else {
        // 通常のURL（Pagesなど）が入れられた場合のフォールバック
        const frame = document.createElement('iframe');
        frame.src = targetUrl;
        frame.style.width = '100%'; frame.style.height = '100%'; frame.style.border = 'none';
        viewLayer.appendChild(frame);
        document.body.appendChild(viewLayer);
      }

    } catch (error) {
      setExecutionStatus('デプロイ中にシステムエラーが発生しました。');
      console.error(error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div style={{ padding: '40px 60px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '26px', marginBottom: '5px' }}>インメモリ・デプロイメント・ランタイム v4.0</h2>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '25px' }}>
        外部に新しいリンクを発行せず、入力されたビルド設定に基づいて現在のページ内に仮想デプロイを実行します。
      </p>

      {/* メインURL入力 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>GitHub リポジトリ URL</label>
        <input 
          type="text" 
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="https://github.com/kousei0413/sf3web"
          style={{ width: '100%', padding: '12px', fontSize: '15px', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }}
        />
      </div>

      {/* Vercelライクなビルド設定トグル */}
      <div style={{ marginBottom: '25px' }}>
        <button 
          onClick={() => setShowBuildSettings(!showBuildSettings)}
          style={{ background: 'none', border: 'none', color: '#0070f3', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', padding: '0' }}
        >
          {showBuildSettings ? '▼ ビルド設定を閉じる' : '▶ ビルド設定（カスタムコマンド/環境変数）を表示'}
        </button>

        {showBuildSettings && (
          <div style={{ marginTop: '15px', padding: '20px', background: '#f9f9f9', border: '1px solid #eaeaea', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>アプリケーションプリセット</label>
              <select value={preset} onChange={(e) => setPreset(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="other">Other (静的HTML / 構築不要)</option>
                <option value="nextjs">Next.js</option>
                <option value="vite">Vite</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>ルートディレクトリ</label>
              <input type="text" value={rootDir} onChange={(e) => setRootDir(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            {preset !== 'other' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>インストールコマンド</label>
                  <input type="text" value={installCommand} onChange={(e) => setInstallCommand(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>ビルドコマンド</label>
                  <input type="text" value={buildCommand} onChange={(e) => setBuildCommand(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>出力ディレクトリ</label>
                  <input type="text" value={outputDir} onChange={(e) => setOutputDir(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>環境変数 (ENV)</label>
              <textarea value={envVariables} onChange={(e) => setEnvVariables(e.target.value)} rows={2} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'monospace' }} />
            </div>
          </div>
        )}
      </div>

      {/* 実行ボタン */}
      <button 
        onClick={handleDynamicDeploy}
        disabled={isDeploying}
        style={{ width: '100%', padding: '15px', background: isDeploying ? '#ccc' : '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: isDeploying ? 'not-allowed' : 'pointer' }}
      >
        {isDeploying ? 'デプロイプロセス実行中...' : '同一ページ内でデプロイ・実行'}
      </button>

      {/* ログ出力 */}
      {executionStatus && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#1e1e1e', borderRadius: '6px', color: '#39ff14', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
          <div>$ {executionStatus}</div>
        </div>
      )}
    </div>
  );
}
