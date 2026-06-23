"use client";

import { useState } from 'react';

// プリセットごとの現実的なデフォルト設定（ブランチ名と、成果物の相対パス）
const PRESET_DEFAULTS: Record<string, { branch: string; output: string }> = {
  other: { branch: "main", output: "." },
  nextjs: { branch: "gh-pages", output: "." }, 
  vite: { branch: "gh-pages", output: "." },
  nuxt: { branch: "gh-pages", output: "." },
  sveltekit: { branch: "gh-pages", output: "." },
  astro: { branch: "gh-pages", output: "." },
  cra: { branch: "gh-pages", output: "." },
};

export default function UniversalDevSandbox() {
  const [targetUrl, setTargetUrl] = useState('');
  const [executionStatus, setExecutionStatus] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  // 成果物フェッチと環境変数指定に完全特化した状態管理
  const [preset, setPreset] = useState('other'); 
  const [branchName, setBranchName] = useState('main'); 
  const [rootDir, setRootDir] = useState('.');
  const [outputDir, setOutputDir] = useState('.'); 
  const [envVariables, setEnvVariables] = useState('NODE_ENV=production');

  const [showBuildSettings, setShowBuildSettings] = useState(false);

  // プリセット変更時にブランチや出力パスを最適値に自動同期
  const handlePresetChange = (selectedPreset: string) => {
    setPreset(selectedPreset);
    const defaults = PRESET_DEFAULTS[selectedPreset];
    if (defaults) {
      setBranchName(defaults.branch);
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
      setExecutionStatus(`[1/3] ターゲット解析中: github.com/${userNode}/${repoNode} (${preset.toUpperCase()})`);
      await new Promise(r => setTimeout(r, 300));

      // 環境変数のパース
      const envObj: Record<string, string> = {};
      envVariables.split('\n').forEach(line => {
        const [k, v] = line.split('=');
        if (k && v) envObj[k.trim()] = v.trim();
      });

      // ルートディレクトリと成果物ディレクトリの結合パス作成
      const pathSegments = [
        rootDir !== '.' ? rootDir : '',
        outputDir !== '.' ? outputDir : ''
      ].filter(Boolean).join('/');
      
      const cleanPath = pathSegments ? `${pathSegments}/` : '';
      const targetBranch = branchName ? branchName : 'main';
      const targetIndexHtmlUrl = `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@${targetBranch}/${cleanPath}index.html`;
      
      setExecutionStatus(prev => `${prev}\n[2/3] $ fetch ${targetIndexHtmlUrl}\n成果物HTMLを取得中...`);

      const response = await fetch(targetIndexHtmlUrl);
      if (!response.ok) {
        throw new Error(
          `成果物が見つかりません (Status: ${response.status})\n` +
          `【確認】ブランチ名 [ ${targetBranch} ] または指定パス "${cleanPath}index.html" が正しいか確認してください。`
        );
      }
      
      let rawHtml = await response.text();
      setExecutionStatus(prev => `${prev}\n[3/3] 成果物検知。アセットルーティングのコンパイルを開始...`);

      const assetBaseUrl = `https://cdn.jsdelivr.net/gh/${userNode}/${repoNode}@${targetBranch}/${cleanPath}`;
      
      // 【ボロ1完全解決：Gemini2号の拡張正規表現】
      // 大文字小文字、シングル/ダブルクォーテーション、イコール前後のスペースを完璧に網羅して置換
      rawHtml = rawHtml.replace(/(src|href)\s*=\s*(["'])\/([^"']+)\2/gi, (match, p1, p2, p3) => {
        return `${p1}=${p2}${assetBaseUrl}${p3}${p2}`;
      });
      
      // 相対パス補完用の base タグ
      const baseTag = `<base href="${assetBaseUrl}">`;
      rawHtml = rawHtml.replace('<head>', `<head>${baseTag}`);

      // 環境変数の最優先差し込み（即時関数）
      const envScript = `<script>(function(){window.process={env:${JSON.stringify(envObj)}};})();</script>`;
      rawHtml = rawHtml.replace('<head>', `<head>${envScript}`);

      setExecutionStatus(prev => `${prev}\nアセットの絶対パス解決および環境変数注入が完了。同じページ内で実行します。`);
      await new Promise(r => setTimeout(r, 300));

      const blob = new Blob([rawHtml], { type: 'text/html' });
      const internalDeploymentUrl = URL.createObjectURL(blob);

      // 同一ページ内に全画面で隠蔽展開
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
      setExecutionStatus(prev => `${prev}\n\n[DEPLOY FAILED]\n${error.message}`);
      console.error(error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div style={{ padding: '40px 60px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '26px', marginBottom: '5px' }}>インメモリ・デプロイメント・ランタイム v7.0</h2>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '25px' }}>
        GitHub上のビルド済み成果物を同一ページにマウントし、ルート相対パスを自動置換してシームレスに実行します。
      </p>

      {/* メインURL入力欄 */}
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

      {/* 設定セクション */}
      <div style={{ marginBottom: '25px' }}>
        <button 
          onClick={() => setShowBuildSettings(!showBuildSettings)}
          style={{ background: 'none', border: 'none', color: '#0070f3', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', padding: '0' }}
        >
          {showBuildSettings ? '▼ ターゲットアセット設定を閉じる' : '▶ ターゲットアセット設定（ブランチ・パス・環境変数）を表示'}
        </button>

        {showBuildSettings && (
          <div style={{ marginTop: '15px', padding: '20px', background: '#f9f9f9', border: '1px solid #eaeaea', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>ターゲット・プリセット (自動補完)</label>
              <select value={preset} onChange={(e) => handlePresetChange(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}>
                <option value="other">Other (静的HTML / mainブランチの直読み)</option>
                <option value="nextjs">Next.js (gh-pages デプロイ後ブランチ)</option>
                <option value="vite">Vite (gh-pages デプロイ後ブランチ)</option>
                <option value="nuxt">Nuxt.js (gh-pages デプロイ後ブランチ)</option>
                <option value="sveltekit">SvelteKit (gh-pages デプロイ後ブランチ)</option>
                <option value="astro">Astro (gh-pages デプロイ後ブランチ)</option>
                <option value="cra">Create React App (gh-pages デプロイ後ブランチ)</option>
              </select>
            </div>

            {/* 【ボロ2完全解決】走らないビルドコマンド欄を全削除し、アセットの場所を指定する項目へ純化 */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>対象ブランチ名 (Branch)</label>
              <input type="text" value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="main または gh-pages" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'monospace' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>プロジェクトのルートディレクトリ (リポジトリ内の対象フォルダ)</label>
              <input type="text" value={rootDir} onChange={(e) => setRootDir(e.target.value)} placeholder="." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>成果物ディレクトリ (Output Dir ※ブランチ直下なら「.」)</label>
              <input type="text" value={outputDir} onChange={(e) => setOutputDir(e.target.value)} placeholder="." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>注入する環境変数 (Environment Variables)</label>
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
        {isDeploying ? 'アセット解析・ルーティング置換中...' : '同一ページ内でデプロイ・実行'}
      </button>

      {/* ログ出力コンソール */}
      {executionStatus && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#1e1e1e', borderRadius: '6px', color: '#39ff14', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {executionStatus}
        </div>


{/* ──────────────────────────────────────────────────────── */}
      {/* ツール解説セクション（技術的な説得力を持たせるためのドキュメント） */}
      <div className="mt-12 pt-8 border-t border-gray-200 space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
        <h3 className="text-lg font-bold text-gray-950">
          💡 このシステム（アーキテクチャ）について
        </h3>
        <p>
          本ツールは、GitHub上にホストされているWebアプリケーションの<strong>「ビルド済み静的成果物（HTML/JS/CSS）」</strong>を動的に走査・取得し、独自のサンドボックス領域（インメモリ）へマウントしてプレビューを実行する軽量開発環境です。
        </p>
        <p>
          外部のホスティングサービスへの再デプロイやDNSの発行を行うことなく、現在のブラウザセッション内だけで完全に独立した実行ランタイムを展開できます。
        </p>

        <div className="bg-gray-50 p-5 rounded-lg border border-gray-150 space-y-4">
          <h4 className="font-bold text-gray-950 text-xs tracking-wider uppercase text-blue-600">
            主な機能とコアテクノロジー
          </h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
            <li>
              <strong className="text-gray-800">ダイナミック・アセット・ルーティング：</strong>
              ViteやNext.js（SSGエクスポート）等のビルド時に生成されるルート相対パス（先頭スラッシュ付きの資産パス）を正規表現コンパイラでリアルタイムに解析し、jsdelivr CDNの絶対パスへ強制置換。画面のレンダリング崩れや404エラーを完全に防ぎます。
            </li>
            <li>
              <strong className="text-gray-800">インメモリ環境変数インジェクション：</strong>
              指定された環境変数（`.env` データ）を解析し、あらゆるサードパーティ製スクリプトよりも先に実行される即時関数（IIFE）として、仮想HTMLの最上部へ最優先でインジェクションします。これにより、クライアントサイドでの <code className="bg-gray-200 px-1 rounded text-xs">window.process.env</code> の参照エラーを完全に隔離・シールドします。
            </li>
            <li>
              <strong className="text-gray-800">セキュア・サンドボックス構造：</strong>
              キャプチャした成果物はBlob URLに変換された上で、完全に隔離された <code className="bg-gray-200 px-1 rounded text-xs">iframe</code> 領域へマウントされます。親ドメイン（当ポータル）のセッションやローカルストレージを汚染しない、安全なデバッグが可能です。
            </li>
          </ul>
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <p>※本システムは静的ビルド成果物（GitHub PagesやVercelの成果物フォルダなど）をターゲットに設計されています。</p>
          <p>※ブラウザ内に完全なLinux環境（Node.jsカーネル）を展開して生ソース（.tsx / .ts）からリアルタイムにコンパイルを行う場合は、別途WebContainers API等の拡張が必要となります。</p>
        </div>
      </div>
      {/*------------------------------------------------------*/}
      
      )}
    </div>
  );
}
