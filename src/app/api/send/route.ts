import { NextResponse } from 'next/server';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  const body = await request.json();
  const { token, tokenType, guildId, channelId, count, content } = body;

  // モードの選択によって認証ヘッダーを切り替える
  const authHeader = tokenType === 'bot' ? `Bot ${token}` : token;

  try {
    // 1. 所属サーバー一覧の取得
    if (action === 'getGuilds') {
      const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: { 'Authorization': authHeader },
      });
      if (!res.ok) return NextResponse.json({ error: 'Failed to fetch guilds' }, { status: res.status });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // 2. サーバー内のチャンネル一覧の取得
    if (action === 'getChannels') {
      const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: { 'Authorization': authHeader },
      });
      if (!res.ok) return NextResponse.json({ error: 'Failed to fetch channels' }, { status: res.status });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // 3. 選択されたチャンネルへの連続メッセージ送信
    if (action === 'sendMessage') {
      const loopCount = Math.min(parseInt(count) || 1, 10);

      for (let i = 0; i < loopCount; i++) {
        const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: `${content} (連投: ${i + 1}/${loopCount})` }),
        });

        // 🟢 Discord APIが失敗を返したら、その具体的なエラー内容（json）を引っこ抜いて画面に伝える
        if (!res.ok) {
          const errorDetail = await res.json().catch(() => ({ message: 'Unknown Discord Error' }));
          return NextResponse.json({ 
            error: `ステップ ${i + 1} で失敗: [ステータス ${res.status}] ${errorDetail.message || '理由不明'}` 
          }, { status: res.status });
        }

        if (i < loopCount - 1) await sleep(1000);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
