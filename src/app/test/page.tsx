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

    if (res.ok) alert('Sent successfully!・送信成功！');
    else alert('error・エラーが発生しました');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '25px', width: '350px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>discord tt </h3>

        {/* 🟢 モード切り替え */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '10px' }}>
          <label style={{ cursor: 'pointer' }}>
            <input type="radio" name="tokenType" value="bot" defaultChecked style={{ marginRight: '5px' }} /> bot
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input type="radio" name="tokenType" value="user" style={{ marginRight: '5px' }} /> self・ユーザー
          </label>
        </div>

        {/* 🟢 肝心の入力枠（アナ）たち */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>token・トークン</label>
          <input name="token" type="password" placeholder="MTk4N..." required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>cannel ID・チャンネルID</label>
          <input name="channelId" type="text" placeholder="1234567890..." required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>message・メッセージ内容</label>
          <textarea name="content" placeholder="こんにちは！" required style={{ padding: '10px', border: '1px solid #aaa', borderRadius: '4px', fontSize: '14px', minHeight: '8px', resize: 'vertical' }} />
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#5865F2', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          go・送信する
        </button>
      </form>
    </div>
  );
}
