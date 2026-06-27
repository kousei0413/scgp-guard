'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [token, setToken] = useState('');
  const [tokenType, setTokenType] = useState('bot'); // 'bot' または 'user'
  const [guilds, setGuilds] = useState<{ id: string; name: string }[]>([]);
  const [channels, setChannels] = useState<{ id: string; name: string; type: number }[]>([]);
  const [selectedGuild, setSelectedGuild] = useState('');

  // 🟢 トークンまたはアカウント種別が変わったら、自動でサーバー一覧を取得
  useEffect(() => {
    if (token.length < 20) {
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
      .catch(() => {
        setGuilds([]);
      });
  }, [token, tokenType]);

  // 🟢 サーバーが選択されたら、自動でそのサーバーのチャンネル一覧を取得
  const handleGuildChange = async (guildId: string) => {
    setSelectedGuild(guildId);
    setChannels([]);
    if (!guildId) return;

    const res = await fetch('/api/send?action=getChannels', {
      method: 'POST',
      body: JSON.stringify({ token, tokenType, guildId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      // type: 0 は通常のテキストチャンネル、type: 11 などはスレッド（必要に応じて調整）
      setChannels(data.filter((c) => c.type === 0 || c.type === 11));
    }
  };

  // 🟢 送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('token', token);
    formData.append('tokenType', tokenType);

    const res = await fetch('/api/send?action=sendMessage', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) alert('Sent successfully!・送信成功！');
    else alert('error・エラーが発生しました');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '25px', width: '350px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>discord tt</h3>

        {/* 🟢 モード切り替え（これの選択状態もAPIに送るように連動） */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '10px' }}>
          <label style={{ cursor: 'pointer' }}>
            <input type="radio" name="tokenType" value="bot" checked={tokenType === 'bot'} onChange={() => { setTokenType('bot'); setGuilds([]); setChannels([]); setSelectedGuild(''); }} style={{ marginRight: '5px' }} /> bot
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input type="radio" name="tokenType" value="user" checked={tokenType === 'user'} onChange={() => { setTokenType('user'); setGuilds([]); setChannels([]); setSelectedGuild(''); }} style={{ marginRight: '5px' }} /> self・ユーザー
          </label>
        </div>

        {/* トークン入力枠（状態を管理するために value と onChange をバインド） */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>token・トークン</label>
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="MTk4N..." required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        {/* 🟢 【新設】サーバー選択一覧ボックス */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>server・サーバー選択</label>
          <select value={selectedGuild} onChange={(e) => handleGuildChange(e.target.value)} required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff' }}>
            <option value="">サーバーを選択（入力後に自動取得）</option>
            {guilds.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* 🟢 【新設】チャンネル選択一覧ボックス（古い input タグから置き換え） */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>channel・チャンネル選択</label>
          <select name="channelId" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff' }}>
            <option value="">チャンネルを選択</option>
            {channels.map((c) => (
              <option key={c.id} value={c.id}>#{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>count・送信回数</label>
          <input name="count" type="number" min="1" max="10" defaultValue="3" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>message・メッセージ内容</label>
          <textarea name="content" placeholder="こんにちは！" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px', minHeight: '60px', resize: 'vertical' }} />
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#e91e63', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          go・連投を開始する
        </button>
      </form>
    </div>
  );
}
