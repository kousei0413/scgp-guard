'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [token, setToken] = useState('');
  const [tokenType, setTokenType] = useState('bot'); // 'bot' または 'user'
  const [sendMode, setSendMode] = useState('server'); // 🟢 'server' または 'dm'
  const [guilds, setGuilds] = useState<{ id: string; name: string }[]>([]);
  const [channels, setChannels] = useState<{ id: string; name: string; type: number }[]>([]);
  const [selectedGuild, setSelectedGuild] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // 🟢 トークンやアカウント種別が変わったらサーバー一覧を自動取得（サーバーモード時のみ）
  useEffect(() => {
    if (token.length < 20 || sendMode !== 'server') {
      setGuilds([]);
      return;
    }
    
    fetch('/api/send?action=getGuilds', {
      method: 'POST',
      body: JSON.stringify({ token, tokenType }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGuilds(data);
        else setGuilds([]);
      })
      .catch(() => setGuilds([]));
  }, [token, tokenType, sendMode]);

  // 🟢 サーバー選択時のチャンネル取得
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
      const data = await res.json();
      if (Array.isArray(data)) {
        setChannels(data.filter((c) => c.type === 0 || c.type === 11));
        setStatusMessage('Success: チャンネル一覧を更新しました');
      }
    } catch (err: any) {
      setStatusMessage(`Error: チャンネル取得失敗 (${err.message})`);
    }
  };

  // 🟢 送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('token', token);
    formData.append('tokenType', tokenType);
    formData.append('sendMode', sendMode); // 🟢 モードをバックエンドに伝える

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
        setStatusMessage(`Error: ${data.error || '送信に失敗しました'}`);
        alert(`error: ${data.error || '送信エラー'}`);
      }
    } catch (err: any) {
      setStatusMessage(`Error: 通信エラー (${err.message})`);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '25px', width: '350px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>discord tt</h3>

        {/* アカウント種別切り替え */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          <label style={{ cursor: 'pointer', fontSize: '14px' }}>
            <input type="radio" name="tokenType" value="bot" checked={tokenType === 'bot'} onChange={() => setTokenType('bot')} style={{ marginRight: '5px' }} /> bot
          </label>
          <label style={{ cursor: 'pointer', fontSize: '14px' }}>
            <input type="radio" name="tokenType" value="user" checked={tokenType === 'user'} onChange={() => setTokenType('user')} style={{ marginRight: '5px' }} /> self・ユーザー
          </label>
        </div>

        {/* 🟢 送信モード切り替え（新設） */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '5px' }}>
          <label style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
            <input type="radio" name="sendMode" value="server" checked={sendMode === 'server'} onChange={() => { setSendMode('server'); setStatusMessage(''); }} style={{ marginRight: '5px' }} /> server
          </label>
          <label style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
            <input type="radio" name="sendMode" value="dm" checked={sendMode === 'dm'} onChange={() => { setSendMode('dm'); setStatusMessage(''); }} style={{ marginRight: '5px' }} /> DM
          </label>
        </div>

        {/* トークン入力 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>token・トークン</label>
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="MTk4N..." required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        {/* 🟢 モードによる表示の分岐 */}
        {sendMode === 'server' ? (
          <>
            {/* サーバーモード用のUI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>server・サーバー選択</label>
              <select value={selectedGuild} onChange={(e) => handleGuildChange(e.target.value)} required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff' }}>
                <option value="">サーバーを選択</option>
                {guilds.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>channel・チャンネル選択</label>
              <select name="channelId" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff' }}>
                <option value="">チャンネルを選択</option>
                {channels.map((c) => (
                  <option key={c.id} value={c.id}>#{c.name}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            {/* 🟢 DMモード用のUI: 相手のユーザーID入力欄 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>recipient user id・送信先ユーザーID</label>
              <input name="userId" type="text" placeholder="123456789012345678" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }} />
            </div>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>count・送信回数</label>
          {/* 必要に応じて max="10" から数値を変更してください */}
          <input name="count" type="number" min="1" max="10" defaultValue="3" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>message・メッセージ内容</label>
          <textarea name="content" placeholder="こんにちは！" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px', minHeight: '60px', resize: 'vertical' }} />
        </div>

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
