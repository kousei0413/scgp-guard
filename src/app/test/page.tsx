'use client';

export default function Home() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await fetch('/api/send', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) alert('送信成功！');
    else alert('エラーが発生しました');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', maxWidth: '300px' }}>
      {/* 🟢 モード切り替えのラジオボタン */}
      <div style={{ display: 'flex', gap: '15px' }}>
        <label>
          <input type="radio" name="tokenType" value="bot" defaultChecked /> 公式Bot
        </label>
        <label>
          <input type="radio" name="tokenType" value="user" /> ユーザー(セルボ)
        </label>
      </div>

      <input name="token" type="password" placeholder="Discordトークン" required />
      <input name="channelId" placeholder="チャンネルID" required />
      <input name="content" placeholder="メッセージ内容" required />
      <button type="submit">送信</button>
    </form>
  );
}
