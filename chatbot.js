/* Clarivex.AI — ChatGPT-powered website chatbot
 * The API key stays server-side in Vercel.
 * The script automatically replaces the old keyword-only sendChat() handler.
 */
(function () {
  const history = [];
  const API = window.CLARIVEX_CHAT_API || '/api/chat';

  function addMessage(text, type) {
    if (typeof window.cAddMsg === 'function') {
      window.cAddMsg(text, type);
      return;
    }
    const box = document.getElementById('chat-msgs');
    if (!box) return;
    const el = document.createElement('div');
    el.className = 'cmsg ' + type;
    el.textContent = text;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }

  function showTyping() {
    if (typeof window.cTyping === 'function') return window.cTyping();
    addMessage('Thinking…', 'bot');
  }

  function hideTyping() {
    if (typeof window.cHideTyping === 'function') return window.cHideTyping();
    const typing = document.querySelector('.cmsg.typing');
    if (typing) typing.remove();
  }

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
    if (!response.ok) {
      throw new Error(data.error || 'Chat request failed');
    }

    const reply = data.reply || 'I could not generate a response. Please try again.';
    history.push({ role: 'assistant', content: reply });
    return reply;
  }

  async function sendChat() {
    const input = document.getElementById('chat-inp');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    const suggestions = document.getElementById('chat-sugs');
    if (suggestions) suggestions.style.display = 'none';

    addMessage(text, 'user');
    showTyping();

    try {
      const reply = await ask(text);
      hideTyping();
      addMessage(reply, 'bot');
    } catch (error) {
      console.error('Clarivex ChatGPT error:', error);
      hideTyping();
      addMessage('I’m having trouble connecting right now. Please try again in a moment.', 'bot');
    }
  }

  function reset() {
    history.splice(0);
  }

  // Expose the API for future UI integrations.
  window.ClarivexChat = { ask, sendChat, reset };

  // Replace the old keyword-based global handler once this deferred script runs.
  window.sendChat = sendChat;
})();
