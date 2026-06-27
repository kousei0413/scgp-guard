import { NextResponse } from 'next/server';

// 指定したミリ秒だけ処理を止めるタイマー関数
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const { token, tokenType, channelId, count, content } = await request.json();

  const authHeader = tokenType === 'bot' ? `Bot ${token}` : token;
  const loopCount = Math.min(parseInt(count) || 1, 10); // 安全のため最大10回に制限

  try {
    for (let i = 0; i < loopCount; i++) {
      // 実際のDiscord APIへの送信
      const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: `${content} (連投: ${i + 1}/${loopCount})` }),
      });

      if (!res.ok) {
        // エラー（特に429: レートリミット）が出たらその時点でループを抜ける
        return NextResponse.json({ error: `Discord API Error at step ${i + 1}` }, { status: res.status });
      }

      // 🟢 連続送信の命綱：次の送信まで1秒（1000ms）待つ
      if (i < loopCount - 1) {
        await sleep(1000);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}