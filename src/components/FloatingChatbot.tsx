import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, RotateCcw, Volume2, Mic, Copy, Check } from 'lucide-react';
import { ChatMessage } from '../types';
import { AudioTranscriberModal } from './AudioTranscriberModal';
import { Markdown } from './Markdown';

const INITIAL_SUGGESTIONS = [
  'What services do you offer?',
  'What are your pricing tiers?',
  'Which industries do you serve?',
  'Are you hiring?',
];

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isTranscribeModalOpen, setIsTranscribeModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (messages.length === 0) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages([
            {
              role: 'assistant',
              content:
                "Hi! 👋 I'm Clarivex-1, the assistant built and trained by Clarivex.AI. Ask me about our services, process, pricing, industries or careers.",
            },
          ]);
        }, 500);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          mode: 'general',
        }),
      });

      const raw = await response.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          response.ok
            ? 'The chat API returned an unexpected response.'
            : `Chat API unavailable (HTTP ${response.status}). Start the app with "npm run dev" so /api/chat is served.`
        );
      }

      if (!response.ok) throw new Error(data.error || `Chat API error (HTTP ${response.status})`);

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      const detail = err?.message ? `\n\n_${err.message}_` : '';
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `I could not reach the Clarivex-1 model just now. Please try again in a moment.${detail}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Conversation cleared. How can I help you today?",
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AudioTranscriberModal
        isOpen={isTranscribeModalOpen}
        onClose={() => setIsTranscribeModalOpen(false)}
        onApplyTranscription={text => setInput(prev => (prev ? `${prev} ${text}` : text))}
      />

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 flex h-[550px] max-h-[550px] w-[350px] flex-col overflow-hidden rounded-2xl sm:w-[400px]"
          style={{
            background: 'var(--elevated)',
            border: '1px solid var(--line-strong)',
            boxShadow: 'var(--shadow-lg)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b p-3.5"
            style={{ background: 'rgba(124,92,255,0.12)', borderColor: 'var(--line)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
              >
                CX
              </div>
              <div>
                <div className="text-[13px] font-bold" style={{ color: 'var(--fg)' }}>
                  Clarivex AI Assistant
                </div>
                <div
                  className="flex items-center gap-1 text-[10px]"
                  style={{ color: 'var(--accent-2)' }}
                >
                  <span className="dot-live" />
                  Clarivex-1 · Local
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                title="Restart conversation"
                aria-label="Restart conversation"
                className="cursor-pointer rounded-lg p-1.5 transition-colors"
                style={{ color: 'var(--muted)' }}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="cursor-pointer rounded-lg p-1.5 transition-colors"
                style={{ color: 'var(--muted)' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? { background: 'var(--accent)', color: '#fff' }
                      : {
                          background: 'var(--surface)',
                          border: '1px solid var(--line)',
                          color: 'var(--fg-soft)',
                        }
                  }
                >
                  {msg.role === 'assistant' ? (
                    <Markdown content={msg.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}

                  {msg.role === 'assistant' && (
                    <div
                      className="mt-2 flex items-center gap-2 border-t pt-1 text-[10px]"
                      style={{ borderColor: 'var(--line-soft)', color: 'var(--muted)' }}
                    >
                      <button
                        onClick={() => handleCopy(msg.content, i)}
                        className="flex cursor-pointer items-center gap-1 transition-colors hover:opacity-80"
                      >
                        {copiedIndex === i ? (
                          <>
                            <Check className="h-3 w-3" style={{ color: 'var(--accent-3)' }} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="flex cursor-pointer items-center gap-1 transition-colors hover:opacity-80"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>Speak</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                className="flex w-20 items-center gap-1.5 rounded-2xl px-3.5 py-2.5"
                style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
              >
                <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: 'var(--accent-soft)' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.2s]" style={{ background: 'var(--accent-soft)' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.4s]" style={{ background: 'var(--accent-soft)' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length <= 2 && (
            <div
              className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-t px-3 py-2"
              style={{ borderColor: 'var(--line)' }}
            >
              {INITIAL_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="chip chip-accent cursor-pointer whitespace-nowrap transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div
            className="flex items-center gap-2 border-t p-3"
            style={{ background: 'var(--bg-soft)', borderColor: 'var(--line)' }}
          >
            <button
              onClick={() => setIsTranscribeModalOpen(true)}
              title="Voice input (on-device)"
              aria-label="Voice input"
              className="cursor-pointer rounded-lg p-2 transition-all"
              style={{
                border: '1px solid var(--line)',
                background: 'rgba(124,92,255,0.1)',
                color: 'var(--accent-soft)',
              }}
            >
              <Mic className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask Clarivex-1 anything…"
              className="field !py-2 !text-[12.5px]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white transition-all disabled:opacity-40"
              style={{
                background: 'linear-gradient(120deg, var(--accent), var(--accent-2))',
                boxShadow: '0 8px 22px -10px rgba(124,92,255,0.9)',
              }}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex h-14 w-14 cursor-pointer items-center justify-center rounded-full text-white transition-all hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(120deg, var(--accent), var(--accent-2))',
          boxShadow: '0 18px 44px -14px rgba(124,92,255,0.95)',
        }}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6 transition-transform group-hover:scale-110" />
        )}
      </button>
    </div>
  );
};
