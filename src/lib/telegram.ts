export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('Telegram bot token or chat ID is not set. Skipping notification.')
    return
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    })

    if (!res.ok) {
      console.error('Failed to send Telegram message:', await res.text())
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error)
  }
}
