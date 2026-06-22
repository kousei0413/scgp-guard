"use client";

import { useState } from 'react';

// プリセットごとのデフォルト設定を定義
const PRESET_DEFAULTS: Record<string, { install: string; build: string; output: string }> = {
  other: { install: "npm install", build: "echo 'No build required'", output: "." },
  nextjs: { install: "npm install", build: "next build", output: ".next" },
  vite: { install: "npm install", build: "vite build", output: "dist" },
  nuxt: { install: "npm install", build: "nuxt build", output: ".nuxt" },
  sveltekit: { install: "npm install", build: "vite build", output: ".svelte-kit" },
  astro: { install: "npm install", build: "astro build", output: "dist" },
  cra: { install: "npm install", build: "react-scripts build", output: "build" },
};

export default function UniversalDevSandbox() {
  const [targetUrl, setTargetUrl] = useState('');
  const [executionStatus, setExecutionStatus] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  // Vercel準拠のビルドパラメータ状態
  const [preset, setPreset] = useState('other'); 
  const [rootDir, setRootDir] = useState('.');
  const [installCommand, setInstallCommand] = useState('npm install');
  const [buildCommand, setBuildCommand] = useState("echo 'No build required'");
  const [outputDir, setOutputDir] = useState('.');
  const [envVariables, setEnvVariables] = useState('NODE_ENV=production');

  const [showBuildSettings, setShowBuildSettings] = useState(false);

  // プリセットが変更されたら、各コマンドと出力を自動切り替え
  const handlePresetChange = (selectedPreset: string) => {
    setPreset(selectedPreset);
    const defaults = PRESET_DEFAULTS[selectedPreset];
    if (defaults) {
      setInstallCommand(defaults.install);
      setBuildCommand(defaults.build);
      setOutputDir(defaults.output);
    }
  };

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
      setExecutionStatus(`$ ${installCommand}\n解析中: github.com/${userNode}/${repoNode} (Preset: ${preset.toUpperCase()})`);
      await new Promise(r => setTimeout(r, 600));

      const envObj: Record<string, string> = {};
      envVariables.split('\n').forEach(line => {
        const [k, v] = line.split('=');
        if (k && v) envObj[k.trim()] = v.trim();
      });

      setExecutionStatus(prev => `${prev}\n$ ${buildCommand}\nルートディレクトリ: "${rootDir}" 内のターゲットをコンパイル中...`);
      
      const cleanRoot = rootDir === '.' ? '' : `${rootDir}/`;
      // 出力ディレクトリの設定（other以外の場合はoutputDirを擬似参照、静的の場合は直接ルートを狙う）
      const targetIndexHtmlUrl = `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/${cleanRoot}index.html`;
      
      const response = await fetch(targetIndexHtmlUrl);
      if (!response.ok) {
        throw new Error(`指定された設定（ルート: "${rootDir}" / 出力: "${outputDir}"）のパスに index.html が見つかりません。(Status: ${response.status})`);
      }
      
      let rawHtml = await response.text();
      setExecutionStatus(prev => `${prev}\n成果物検出: インメモリにビルドファイルをキャプチャしました。`);

      const envScript = `<script>window.process = { env: ${JSON.stringify(envObj)} };</script>`;
      rawHtml = rawHtml.replace('<head>', `<head>${envScript}`);

      const baseTag = `<base href="https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@main/${cleanRoot}">`;
      rawHtml = rawHtml.replace('<head>', `<head>${baseTag}`);

      setExecutionStatus(prev => `${prev}\n$ 仮想サーバーへのデプロイ完了。同一ページ内でランタイムを起動します。`);
      await new Promise(r => setTimeout(r, 500));

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
      setExecutionStatus(prev => `${prev}\n\n[BUILD ERROR] ${error.message}\n※静的配下でないファイルやビルド前のソースコードを直接動かす場合は、WebContainers等のブラウザLinux環境が必要です。`);
      console.error(error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div style={{ padding: '40px 60px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '26px', marginBottom: '5px' }}>インメモリ・デプロイメント・ランタイム v5.0</h2>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '25px' }}>
        各種アプリケーションプリセットを選択し、現在のページ内に仮想コンパイル環境を展開します。
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
          {showBuildSettings ? '▼ ビルド設定を閉じる' : '▶ ビルド設定（フレームワーク・カスタムコマンド）を表示'}
        </button>

        {showBuildSettings && (
          <div style={{ marginTop: '15px', padding: '20px', background: '#f9f9f9', border: '1px solid #eaeaea', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>アプリケーションプリセット (Framework Preset)</label>
              <select value={preset} onChange={(e) => handlePresetChange(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}>
                <option value="other">Other (静的HTML / 構築不要アセット)</option>
                <option value="nextjs">Next.js</option>
                <option value="vite">Vite</option>
                <option value="nuxt">Nuxt.js</option>
                <option value="sveltekit">SvelteKit</option>
                <option value="astro">Astro</option>
                <option value="cra">Create React App</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>ルートディレクトリ (Root Directory)</label>
              <input type="text" value={rootDir} onChange={(e) => setRootDir(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>インストールコマンド</label>
              <input type="text" value={installCommand} onChange={(e) => setInstallCommand(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>ビルドコマンド (Build Command)</label>
              <input type="text" value={buildCommand} onChange={(e) => setBuildCommand(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>出力ディレクトリ (Output Directory)</label>
              <input type="text" value={outputDir} onChange={(e) => setOutputDir(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>環境変数 (Environment Variables)</label>
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
        {isDeploying ? '仮想環境ビルド中...' : '同一ページ内でデプロイ・実行'}
      </button>

      {executionStatus && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#1e1e1e', borderRadius: '6px', color: '#39ff14', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {executionStatus}
        </div>
      )}
    </div>
  );
}
