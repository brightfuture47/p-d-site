export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, contact, projectType, message } = req.body;

  if (!name || !contact || !message) {
    return res.status(400).json({ error: 'Пожалуйста, заполните обязательные поля' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ error: 'Ошибка конфигурации сервера' });
  }

  const text = 
`🔔 *Новая заявка с сайта*

👤 *Имя:* ${name}
📞 *Контакт:* ${contact}
📁 *Тип проекта:* ${projectType || 'Не указан'}

💬 *Сообщение:*
${message}`;

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    return res.status(200).json({ success: true, message: 'Заявка отправлена!' });
  } catch (error) {
    return res.status(500).json({ error: 'Не удалось отправить заявку' });
  }
}