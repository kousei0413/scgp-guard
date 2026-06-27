import { NextResponse } from 'next/server';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  // URLの?action=の後ろの文字を取得する
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  const body = await request.json();
  const { token, guildId, channelId, count, content } = body;

  // 今回は安全な公式Botでの運用を前提としてプレフィックスを固定
  const authHeader = `Bot ${token}`;

  try {
    // 🟢 アクション1: 所属サーバー一覧の取得
    if (action === 'getGuilds') {
      const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: { 'Authorization': authHeader },
      });
      if (!res.ok) return NextResponse.json({ error: 'Failed to fetch guilds' }, { status: res.status });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // 🟢 アクション2: サーバー内のチャンネル一覧の取得
    if (action === 'getChannels') {
      const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: { 'Authorization': authHeader },
      });
      if (!res.ok) return NextResponse.json({ error: 'Failed to fetch channels' }, { status: res.status });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // 🟢 アクション3: 選択されたチャンネルへの連続メッセージ送信
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

        if (!res.ok) return NextResponse.json({ error: `Error at step ${i + 1}` }, { status: res.status });
        if (i < loopCount - 1) await sleep(1000);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
