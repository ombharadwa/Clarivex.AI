import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, RotateCcw, Volume2, Mic, Copy, Check, Globe, ExternalLink } from 'lucide-react';
import { ChatMessage, GroundingSource } from '../types';
import { AudioTranscriberModal } from './AudioTranscriberModal';

const INITIAL_SUGGESTIONS = [
  'Ask anything',
  'Research AI trends',
  'Enterprise software stack',
  'Business analysis',
];

const LOCAL_KB: Record<string, string> = {
  'what can clarivex do': 'Clarivex.AI builds AI-powered enterprise software — including AI chatbots, automation workflows, predictive analytics, LLM integrations, and custom software platforms for all industries. 🚀',
  'ai chatbot pricing': 'Our AI Chatbot solutions start from ₹4,999/mo for the Starter plan. For enterprise chatbots with custom training, pricing is based on scope. Book a free consultation for a custom quote! 💬',
  'book a demo': 'Absolutely! Head to our Contact page or reach out at hello@clarivex.ai — our team will schedule a personalized demo within 24 hours. 📅',
  'services': 'We offer: AI Chatbots, AI Automation, AI Agents, Predictive Analytics, Generative AI, NLP Solutions, Web Applications, ERP/CRM, SaaS Platforms, and Mobile Apps.',
  'pricing': 'Starter: ₹4,999/mo · Growth: ₹14,999/mo · Enterprise: Custom. All plans include our core AI platform. Book a consultation for a custom proposal!',
  'careers': 'We are hiring: AI/ML Engineers, Full Stack Developers, Product Designers, and Business Development Executives. Check out the Careers page to apply! 💼',
  'industries': 'We serve Healthcare, Finance, Government, Retail, Education, Manufacturing, and Logistics with domain-specific AI solutions.',
  'hello': 'Hello! 👋 Welcome to Clarivex.AI. How can I assist you with intelligent software and AI transformation today?',
  'hi': 'Hi there! 👋 Great to see you. Ask me about our AI services, architecture, or request a consultation!',
  'about': 'Clarivex.AI is an AI-driven software & digital transformation company based in Ahmedabad, India, building intelligent enterprise solutions.',
  'contact': 'Connect with us at hello@clarivex.ai, or visit our Contact page to book a consultation with our AI specialists!',
};

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [enableSearch, setEnableSearch] = useState(false);
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
              content: "Hi! 👋 I'm the Clarivex AI assistant powered by Google Gemini 3.8. Ask me about our AI services, real-time research, enterprise architecture, or book a consultation!",
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
          mode: enableSearch ? 'research' : 'general',
          enableSearch,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: data.reply,
              sources: data.sources || [],
              isGrounded: Boolean(data.grounded),
            },
          ]);
          setIsTyping(false);
          return;
        }
      }
      throw new Error('API request failed');
    } catch {
      // Graceful intelligent knowledge-base fallback
      setTimeout(() => {
        const lower = text.toLowerCase();
        let reply = "Thank you for reaching out! For tailored enterprise software or deep AI architecture inquiries, please visit our Contact page to connect directly with our engineering team. 😊";
        for (const [k, v] of Object.entries(LOCAL_KB)) {
          if (lower.includes(k)) {
            reply = v;
            break;
          }
        }
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        setIsTyping(false);
      }, 700);
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
        <div className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] max-h-[550px] h-[550px] bg-[#151B35] border border-[#7C5CFF]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 backdrop-blur-2xl">
          {/* Header */}
          <div className="p-3.5 bg-[#7C5CFF]/15 border-b border-[#7C5CFF]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] flex items-center justify-center font-bold text-xs text-white shadow-sm">
                CX
              </div>
              <div>
                <div className="font-bold text-[13px] text-white">Clarivex AI Assistant</div>
                <div className="text-[10px] text-[#00D4FF] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
                  Gemini 3.8 · Online
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Search Grounding Toggle */}
              <button
                onClick={() => setEnableSearch(!enableSearch)}
                className={`p-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
                  enableSearch
                    ? 'bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/40'
                    : 'bg-white/5 text-[#8892B0] border-transparent hover:text-white'
                }`}
                title="Toggle Google Search Grounding"
              >
                <Globe className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleReset}
                title="Restart conversation"
                className="p-1.5 text-[#8892B0] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#8892B0] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[12.5px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#7C5CFF] text-white rounded-br-xs'
                      : 'bg-[#0B1020]/90 text-white/90 border border-[#7C5CFF]/20 rounded-bl-xs shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Grounded Source Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10 text-[10px]">
                      <div className="text-[#00D4FF] font-semibold mb-1 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Grounded Sources:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {msg.sources.slice(0, 3).map((src, idx) => (
                          <a
                            key={idx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#A48BFF] truncate max-w-[140px]"
                          >
                            <span>{src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 pt-1 border-t border-white/10 text-[10px] text-[#8892B0]">
                      <button
                        onClick={() => handleCopy(msg.content, i)}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedIndex === i ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Speak</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-[#0B1020]/80 border border-[#7C5CFF]/20 px-3.5 py-2.5 rounded-2xl rounded-bl-xs w-20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A48BFF] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#A48BFF] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#A48BFF] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 border-t border-[#7C5CFF]/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {INITIAL_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="px-2.5 py-1 rounded-full bg-[#7C5CFF]/10 hover:bg-[#7C5CFF]/20 border border-[#7C5CFF]/25 text-[11px] text-[#A48BFF] whitespace-nowrap transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="p-3 bg-[#0B1020]/90 border-t border-[#7C5CFF]/15 flex items-center gap-2">
            <button
              onClick={() => setIsTranscribeModalOpen(true)}
              title="Voice transcription via gemini-3.5-transcribe"
              className="p-2 rounded-lg border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 text-[#A48BFF] hover:bg-[#7C5CFF]/25 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={enableSearch ? 'Search Google with Gemini 3.8…' : 'Ask Clarivex AI anything…'}
              className="flex-1 bg-white/5 border border-[#7C5CFF]/20 rounded-lg px-3 py-2 text-[12.5px] text-white placeholder-white/30 focus:outline-none focus:border-[#7C5CFF] transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-lg bg-[#7C5CFF] hover:bg-[#A48BFF] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
};
