'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [token, setToken] = useState('');
  const [guilds, setGuilds] = useState<{ id: string; name: string }[]>([]);
  const [channels, setChannels] = useState<{ id: string; name: string; type: number }[]>([]);
  const [selectedGuild, setSelectedGuild] = useState('');

  // 🟢 トークンが入力されたら、自動でサーバー一覧を取得
  useEffect(() => {
    if (token.length < 20) return; // トークンらしき長さになったら実行
    
    fetch('/api/send?action=getGuilds', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGuilds(data);
      })
      .catch(() => alert('サーバー一覧の取得に失敗しました'));
  }, [token]);

  // 🟢 サーバーが選択されたら、自動でそのサーバーのチャンネル一覧を取得
  const handleGuildChange = async (guildId: string) => {
    setSelectedGuild(guildId);
    setChannels([]);
    if (!guildId) return;

    const res = await fetch('/api/send?action=getChannels', {
      method: 'POST',
      body: JSON.stringify({ token, guildId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      // type: 0 が通常のテキストチャンネル
      setChannels(data.filter((c) => c.type === 0));
    }
  };

  // 🟢 送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('token', token); // トークンを手動追加

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
        <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>discord tt (Pro)</h3>

        {/* トークン入力欄（これを入れると下のセレクトボックスが動き出す） */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>token・トークン</label>
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Botトークンを入力" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        {/* 🟢 サーバー選択セレクトボックス */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>server・サーバー選択</label>
          <select value={selectedGuild} onChange={(e) => handleGuildChange(e.target.value)} required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }}>
            <option value="">サーバーを選択してください</option>
            {guilds.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* 🟢 チャンネル選択セレクトボックス */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>channel・チャンネル選択</label>
          <select name="channelId" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }}>
            <option value="">チャンネルを選択してください</option>
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

        <button type="submit" style={{ padding: '12px', backgroundColor: '#5865F2', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          go・連投を開始する
        </button>
      </form>
    </div>
  );
}
