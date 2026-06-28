'use client';
import { useState } from 'react';

export default function Home() {
  const [token, setToken] = useState('');
  const [tokenType, setTokenType] = useState('bot');
  const [guilds, setGuilds] = useState<{ id: string; name: string }[]>([]);
  const [channels, setChannels] = useState<{ id: string; name: string; type: number }[]>([]);
  const [selectedGuild, setSelectedGuild] = useState('');
  const [statusMessage, setStatusMessage] = useState(''); // 🟢 状態・詳細エラー確認用

  // 🟢 ボタンを押した時に実行される：サーバー一覧の取得
  const handleLoadGuilds = async () => {
    if (token.length < 20) {
      setStatusMessage('Error: Token is too short・トークンが短すぎます');
      return;
    }
    
    setStatusMessage('Loading servers...・サーバー一覧を取得中...');
    setGuilds([]);
    setChannels([]);
    setSelectedGuild('');

    try {
      const res = await fetch('/api/send?action=getGuilds', {
        method: 'POST',
        body: JSON.stringify({ token, tokenType }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`Status ${res.status}: フォルダ構成ミス(404)か、トークン無効(401/403)です`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setGuilds(data);
        setStatusMessage(`Success: ${data.length}個のサーバーを読み込みました`);
      } else {
        throw new Error('データが配列形式ではありません');
      }
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  // 🟢 サーバーが選択されたら自動でチャンネルを取得
  const handleGuildChange = async (guildId: string) => {
    setSelectedGuild(guildId);
    setChannels([]);
    if (!guildId) return;

    setStatusMessage('Loading channels...・チャンネル一覧を取得中...');

    try {
      const res = await fetch('/api/send?action=getChannels', {
        method: 'POST',
        body: JSON.stringify({ token, tokenType, guildId }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        // type: 0 は通常のテキストチャンネル、type: 11 は公開スレッド
        setChannels(data.filter((c) => c.type === 0 || c.type === 11));
        setStatusMessage('Success: チャンネル一覧を更新しました');
      }
    } catch (err: any) {
      setStatusMessage(`Error: チャンネル取得失敗 (${err.message})`);
    }
  };

  // 🟢 メッセージ送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('token', token);
    formData.append('tokenType', tokenType);

    setStatusMessage('Sending...・送信中...');
    
    try {
      const res = await fetch('/api/send?action=sendMessage', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage('Sent successfully!・送信成功！');
        alert('Sent successfully!・送信成功！');
      } else {
        // 🟢 サーバー側から返ってきた具体的なDiscordのエラー文言を表示する
        setStatusMessage(`Error: ${data.error || '送信に失敗しました'}`);
        alert(`error: ${data.error || '送信エラー'}`);
      }
    } catch (err: any) {
      setStatusMessage(`Error: 通信エラー (${err.message})`);
      alert('error・通信エラーが発生しました');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '25px', width: '350px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>discord tt</h3>

        {/* モード切り替え */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '10px' }}>
          <label style={{ cursor: 'pointer' }}>
            <input type="radio" name="tokenType" value="bot" checked={tokenType === 'bot'} onChange={() => { setTokenType('bot'); setGuilds([]); setChannels([]); setSelectedGuild(''); setStatusMessage(''); }} style={{ marginRight: '5px' }} /> bot
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input type="radio" name="tokenType" value="user" checked={tokenType === 'user'} onChange={() => { setTokenType('user'); setGuilds([]); setChannels([]); setSelectedGuild(''); setStatusMessage(''); }} style={{ marginRight: '5px' }} /> self・ユーザー
          </label>
        </div>

        {/* トークン入力 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>token・トークン</label>
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="MTk4N..." required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        {/* 一覧読み込みボタン */}
        <button type="button" onClick={handleLoadGuilds} style={{ padding: '10px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }}>
          Load・一覧を読み込む
        </button>

        {/* サーバー選択 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>server・サーバー選択</label>
          <select value={selectedGuild} onChange={(e) => handleGuildChange(e.target.value)} required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff' }}>
            <option value="">サーバーを選択してください</option>
            {guilds.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* チャンネル選択 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>channel・チャンネル選択</label>
          <select name="channelId" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff' }}>
            <option value="">チャンネルを選択してください</option>
            {channels.map((c) => (
              <option key={c.id} value={c.id}>#{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>count・送信回数</label>
          <input name="count" type="number" min="1" max="99999999999999999999" defaultValue="3" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>message・メッセージ内容</label>
          <textarea name="content" placeholder="こんにちは！" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px', minHeight: '60px', resize: 'vertical' }} />
        </div>

        {/* 🟢 ステータス・デバッグメッセージ枠 */}
        {statusMessage && (
          <div style={{ fontSize: '12px', backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '4px', wordBreak: 'break-all', borderLeft: statusMessage.startsWith('Error') ? '4px solid #ef4444' : '4px solid #10b981', color: statusMessage.startsWith('Error') ? '#b91c1c' : '#065f46' }}>
            {statusMessage}
          </div>
        )}

        <button type="submit" style={{ padding: '12px', backgroundColor: '#e91e63', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          go・連投を開始する
        </button>
      </form>
    </div>
  );
}
