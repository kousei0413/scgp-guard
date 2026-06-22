"use client";

import { useState } from 'react';

export default function UniversalDevSandbox() {
  const [targetUrl, setTargetUrl] = useState('');
  const [executionStatus, setExecutionStatus] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  // Vercel同等のビルド構成
  const [preset, setPreset] = useState('other'); 
  const [rootDir, setRootDir] = useState('.');
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [outputDir, setOutputDir] = useState('dist');
  const [installCommand, setInstallCommand] = useState('npm install');
  const [envVariables, setEnvVariables] = useState('NODE_ENV=production');

  const [showBuildSettings, setShowBuildSettings] = useState(false);

  const handleDynamicDeploy = async () => {
    if (!targetUrl) {
      setExecutionStatus('エラー: 対象のGitHubリポジトリURLを指定してください。');
      return;
    }

    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = targetUrl.match(urlPattern);

    if (!match) {
      setExecutionStatus('エラー: 有効なGitHubリポジトリURLを入力してください。');
      return;
    }

    const userNode = match[1];
    const repoNode = match[2].replace('.git', '');
    
    setIsDeploying(true);
    try {
      // 1. パス解決
      setExecutionStatus(`$ ${installCommand}\n解析中: github.com/${userNode}/${repoNode}`);
      await new Promise(r => setTimeout(r, 600));

      // 2. 環境変数のオブジェクト化（疑似パース）
      const envObj: Record<string, string> = {};
      envVariables.split('\n').forEach(line => {
        const [k, v] = line.split('=');
        if (k && v) envObj[k.trim()] = v.trim();
      });

      // 3. ビルドプロセスのシミュレートと実際のファイル結合
      setExecutionStatus(prev => `${prev}\n$ ${buildCommand}\nルートディレクトリ: "${rootDir}" を走査中...`);
      
      // 対象リポジトリから実際のソース（index.htmlとコア構成）をフェッチしてメモリに載せる
      const cleanRoot = rootDir === '.' ? '' : `${rootDir}/`;
      const targetIndexHtmlUrl = `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/${cleanRoot}index.html`;
      
      const response = await fetch(targetIndexHtmlUrl);
      if (!response.ok) {
        throw new Error(`指定された出力・ルートパスに index.html が見つかりません。 (Status: ${response.status})`);
      }
      
      let rawHtml = await response.text();
      setExecutionStatus(prev => `${prev}\n成果物検出: index.html をキャプチャしました。`);

      // 4. 環境変数や出力の動的インジェクション（ビルドエミュレーション）
      setExecutionStatus(prev => `${prev}\n環境変数をランタイムに注入中...`);
      const envScript = `<script>window.process = { env: ${JSON.stringify(envObj)} };</script>`;
      rawHtml = rawHtml.replace('<head>', `<head>${envScript}`);

      // EmulatorJSなどのパスがルートベースで壊れるのを防ぐため、ベースタグを動的埋め込み
      const baseTag = `<base href="https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/${cleanRoot}">`;
      rawHtml = rawHtml.replace('<head>', `<head>${baseTag}`);

      setExecutionStatus(prev => `${prev}\n$ 出力ディレクトリ "${outputDir}" へバイナリをビルド完了。\n同じページ内でサンドボックスを起動します。`);
      await new Promise(r => setTimeout(r, 500));

      // 5. 新リンクを作らず、メモリ上のHTML（Blob）から同じページ内にデプロイ
      const blob = new Blob([rawHtml], { type: 'text/html' });
      const internalDeploymentUrl = URL.createObjectURL(blob);

      const viewLayer = document.createElement('div');
      viewLayer.id = 'internal-vercel-sandbox'; 
      viewLayer.style.position = 'fixed';
      viewLayer.style.top = '0'; viewLayer.style.left = '0';
      viewLayer.style.width = '100vw'; viewLayer.style.height = '100vh';
      viewLayer.style.zIndex = '99999'; viewLayer.style.backgroundColor = '#000';

      const frame = document.createElement('iframe');
      frame.src = internalDeploymentUrl;
      frame.style.width = '100%'; frame.style.height = '100%'; frame.style.border = 'none';
      
      viewLayer.appendChild(frame);
      document.body.appendChild(viewLayer);

    } catch (error: any) {
      setExecutionStatus(prev => `${prev}\n\n[BUILD ERROR] ${error.message}`);
      console.error(error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div style={{ padding: '40px 60px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '26px', marginBottom: '5px' }}>インメモリ・デプロイメント・ランタイム v4.5</h2>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '25px' }}>
        設定されたVercelパラメータに基づいてコードをメモリ内で動的コンパイルし、同一ページ上に隠蔽展開します。
      </p>

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
                <option value="other">Other (静的アセット / 各種コア直読み)</option>
                <option value="nextjs">Next.js</option>
                <option value="vite">Vite</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>ルートディレクトリ</label>
              <input type="text" value={rootDir} onChange={(e) => setRootDir(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

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

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>環境変数 (ENV)</label>
              <textarea value={envVariables} onChange={(e) => setEnvVariables(e.target.value)} rows={2} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'monospace' }} />
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handleDynamicDeploy}
        disabled={isDeploying}
        style={{ width: '100%', padding: '15px', background: isDeploying ? '#ccc' : '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: isDeploying ? 'not-allowed' : 'pointer' }}
      >
        {isDeploying ? 'コンパイル実行中...' : '同一ページ内でデプロイ・実行'}
      </button>

      {executionStatus && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#1e1e1e', borderRadius: '6px', color: '#39ff14', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {executionStatus}
        </div>
      )}
    </div>
  );
}
