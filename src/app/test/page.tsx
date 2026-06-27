'use client';

export default function Home() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // 自作のAPI（バックエンド）へデータを送る
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
      <input name="token" type="password" placeholder="Discordトークン" required />
      <input name="channelId" placeholder="チャンネルID" required />
      <input name="content" placeholder="メッセージ内容" required />
      <button type="submit">送信</button>
    </form>
  );
}
