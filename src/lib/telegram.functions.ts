import { createServerFn } from '@tanstack/react-start';

interface Payload {
  userId: string;
  telegramUser: string;
  platform: string;
  depositImage: string | null; // data URL
  promoImage: string | null; // data URL
}

const CHAT_ID = '1851758530';
// Bot token kept directly in code (not a secret)
const token = '8905496373:AAH9-oIvNG2rO47K4ku9EmT9qa1iFoizqGM';

function dataURLtoBuffer(dataurl: string): { buffer: Buffer; mime: string } {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  return { buffer: Buffer.from(arr[1], 'base64'), mime };
}

export const sendTelegramSubmission = createServerFn({ method: 'POST' })
  .inputValidator((input: Payload) => input)
  .handler(async ({ data }) => {

    const infoMessage = `📌 *طلب تفعيل جديد للربط بالسيرفر VIP*:\n\n👤 *معرف اللاعب (ID)*: \`${data.userId}\`\n📨 *يوزر التليجرام*: \`${data.telegramUser || '—'}\`\n🎮 *المنصة*: \`${data.platform || 'MELBET'}\`\n⏰ *التوقيت*: \`${new Date().toLocaleString('ar-EG')}\``;

    const base = `https://api.telegram.org/bot${token}`;

    if (data.depositImage && data.promoImage) {
      const dep = dataURLtoBuffer(data.depositImage);
      const pro = dataURLtoBuffer(data.promoImage);
      const fd = new FormData();
      fd.append('chat_id', CHAT_ID);
      fd.append('media', JSON.stringify([
        { type: 'photo', media: 'attach://deposit', caption: infoMessage, parse_mode: 'Markdown' },
        { type: 'photo', media: 'attach://promo', caption: `📨 *يوزر التليجرام*: \`${data.telegramUser || '—'}\``, parse_mode: 'Markdown' },
      ]));
      fd.append('deposit', new Blob([new Uint8Array(dep.buffer)], { type: dep.mime }), 'deposit.jpg');
      fd.append('promo', new Blob([new Uint8Array(pro.buffer)], { type: pro.mime }), 'promo.jpg');
      await fetch(`${base}/sendMediaGroup`, { method: 'POST', body: fd });
    }

    await fetch(`${base}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: infoMessage, parse_mode: 'Markdown' }),
    });

    return { ok: true };
  });
