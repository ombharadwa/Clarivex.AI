/* Clarivex.AI — production chatbot client
 * Add <script src="/chatbot.js"></script> after the existing chatbot markup.
 * The API route is /api/chat and keeps the model key server-side.
 */
(function () {
  const history = [];
  const API = window.CLARIVEX_CHAT_API || '/api/chat';

  async function ask(message) {
    const text = String(message || '').trim();
    if (!text) return '';
    history.push({ role: 'user', content: text });
    const response = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Chat request failed');
    const reply = data.reply || 'I could not generate a response.';
    history.push({ role: 'assistant', content: reply });
    return reply;
  }

  window.ClarivexChat = { ask, reset: () => history.splice(0) };
})();
