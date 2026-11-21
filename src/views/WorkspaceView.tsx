import React, { useState, useEffect, useRef } from 'react';
import { PageTab, WorkspaceMode, WorkspaceModel, AttachedFile, WorkspaceConversation, ChatMessage, AIPersona } from '../types';
import { useTheme } from '../context/ThemeContext';
import { AudioTranscriberModal } from '../components/AudioTranscriberModal';
import { Markdown } from '../components/Markdown';
import { 
  Sparkles, 
  Search, 
  Code2, 
  Briefcase, 
  FileText, 
  Plus, 
  Trash2, 
  Paperclip, 
  Send, 
  Square, 
  Copy, 
  RotateCcw, 
  Sun, 
  Moon, 
  ArrowLeft,
  X,
  Check,
  Globe,
  Mic,
  Shield,
  Bot
} from 'lucide-react';

interface WorkspaceViewProps {
  onSelectTab: (tab: PageTab) => void;
}

const STORAGE_KEY = 'clarivex_workspace_v2';

const MODE_META: Record<WorkspaceMode, { title: string; desc: string; hint: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  general: {
    title: 'Ask Anything',
    desc: 'Your general-purpose AI assistant.',
    hint: 'General AI',
    icon: Sparkles,
  },
  research: {
    title: 'Research',
    desc: 'Structured research and analysis from the Clarivex-1 knowledge base.',
    hint: 'Research & Analysis',
    icon: Search,
  },
  coding: {
    title: 'Code & Debug',
    desc: 'Build, review, explain and troubleshoot software.',
    hint: 'Developer & Architecture',
    icon: Code2,
  },
  business: {
    title: 'Business',
    desc: 'Strategy, requirements, analysis and next steps.',
    hint: 'Enterprise Strategy',
    icon: Briefcase,
  },
  documents: {
    title: 'Documents',
    desc: 'Analyze attached source files, PDFs & images.',
    hint: 'Document Intelligence',
    icon: FileText,
  },
};

const PERSONA_LABELS: Record<AIPersona, { name: string; desc: string; icon: React.ComponentType<{ className?: string }> }> = {
  general: { name: 'Clarivex AI (Standard)', desc: 'General intelligence & enterprise support', icon: Bot },
  architect: { name: 'Senior Software Architect', desc: 'Code architecture, scaling & patterns', icon: Code2 },
  strategist: { name: 'Enterprise AI Strategist', desc: 'ROI, roadmap & automation scoping', icon: Briefcase },
  auditor: { name: 'Security & Compliance Auditor', desc: 'GDPR, HIPAA, and threat assessment', icon: Shield },
};

const STARTER_PROMPTS = [
  'What services does Clarivex.AI offer?',
  'How does your development process work?',
  'Which industries do you serve?',
  'What are your pricing tiers?',
];

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ onSelectTab }) => {
  const { isDark, toggleTheme } = useTheme();

  const [mode, setMode] = useState<WorkspaceMode>('general');
  const [model, setModel] = useState<WorkspaceModel>('auto');
  const [persona, setPersona] = useState<AIPersona>('general');
  const [conversations, setConversations] = useState<WorkspaceConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isTranscribeModalOpen, setIsTranscribeModalOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && Array.isArray(saved.conversations) && saved.conversations.length > 0) {
        setConversations(saved.conversations);
        setActiveId(saved.conversations[0].id);
        setMode(saved.conversations[0].mode || saved.mode || 'general');
        setModel(saved.model || 'auto');
        setPersona(saved.conversations[0].persona || 'general');
      } else {
        createNewChat();
      }
    } catch {
      createNewChat();
    }
  }, []);

  // Save to local storage
  const saveWorkspace = (
    updatedConvs: WorkspaceConversation[],
    currentMode = mode,
    currentModel = model
  ) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode: currentMode,
        model: currentModel,
        conversations: updatedConvs,
      })
    );
  };

  const currentConv = conversations.find(c => c.id === activeId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConv?.messages, isGenerating]);

  const createNewChat = () => {
    const newId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    const newConv: WorkspaceConversation = {
      id: newId,
      title: 'New conversation',
      mode: 'general',
      persona: 'general',
      messages: [],
      created: Date.now(),
      updated: Date.now(),
    };
    const updated = [newConv, ...conversations];
    setConversations(updated);
    setActiveId(newId);
    setMode('general');
    setPersona('general');
    setFiles([]);
    saveWorkspace(updated, 'general', model);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    if (activeId === id) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
        setMode(updated[0].mode || 'general');
        setPersona(updated[0].persona || 'general');
      } else {
        createNewChat();
        return;
      }
    }
    saveWorkspace(updated);
  };

  const handleSelectConv = (c: WorkspaceConversation) => {
    setActiveId(c.id);
    setMode(c.mode || 'general');
    setPersona(c.persona || 'general');
  };

  const handleModeChange = (nextMode: WorkspaceMode) => {
    setMode(nextMode);
    if (currentConv) {
      const updated = conversations.map(c =>
        c.id === activeId ? { ...c, mode: nextMode, updated: Date.now() } : c
      );
      setConversations(updated);
      saveWorkspace(updated, nextMode);
    }
  };

  const handlePersonaChange = (nextPersona: AIPersona) => {
    setPersona(nextPersona);
    if (currentConv) {
      const updated = conversations.map(c =>
        c.id === activeId ? { ...c, persona: nextPersona, updated: Date.now() } : c
      );
      setConversations(updated);
      saveWorkspace(updated);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (!uploadedFiles.length) return;

    const newAttached: AttachedFile[] = [];

    for (const file of uploadedFiles) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum file size is 10 MB.`);
        continue;
      }

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        let textContent = '';
        if (
          /^(text\/|application\/json)/i.test(file.type || '') ||
          file.name.endsWith('.txt') ||
          file.name.endsWith('.md') ||
          file.name.endsWith('.ts') ||
          file.name.endsWith('.js')
        ) {
          textContent = (await file.text()).slice(0, 20000);
        }

        newAttached.push({
          name: file.name,
          mime: file.type || 'application/octet-stream',
          data: base64,
          text: textContent,
          size: file.size,
        });
      } catch (err) {
        console.error('File reading failed', err);
      }
    }

    if (newAttached.length > 0) {
      setFiles(prev => [...prev, ...newAttached]);
      handleModeChange('documents');
    }

    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isGenerating) return;

    let targetConv = currentConv;
    let currentConvs = [...conversations];

    if (!targetConv) {
      const newId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
      targetConv = {
        id: newId,
        title: text.slice(0, 40),
        mode,
        persona,
        messages: [],
        created: Date.now(),
        updated: Date.now(),
      };
      currentConvs = [targetConv, ...currentConvs];
      setActiveId(newId);
    }

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    const updatedMessages = [...(targetConv.messages || []), userMessage];

    const updatedTitle =
      targetConv.title === 'New conversation' ? text.slice(0, 45) : targetConv.title;

    const updatedConvs = currentConvs.map(c =>
      c.id === targetConv!.id
        ? { ...c, messages: updatedMessages, title: updatedTitle, updated: Date.now() }
        : c
    );
    setConversations(updatedConvs);
    saveWorkspace(updatedConvs);

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: updatedMessages.slice(-25).map(m => ({ role: m.role, content: m.content })),
          mode,
          model,
          persona,
          files: files.map(f => ({ name: f.name, mime: f.mime, data: f.data, text: f.text })),
        }),
      });

      const raw = await res.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        // A non-JSON body means the request never reached the API route, which
        // happens when the static preview server is used instead of the app server.
        throw new Error(
          res.ok
            ? 'The chat API returned an unexpected response.'
            : `Chat API unavailable (HTTP ${res.status}). Start the app with "npm run dev" so /api/chat is served.`
        );
      }

      if (!res.ok) throw new Error(data.error || `Chat API error (HTTP ${res.status})`);

      const reply = data.reply || 'No response returned.';
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalConvs = updatedConvs.map(c =>
        c.id === targetConv!.id ? { ...c, messages: finalMessages, updated: Date.now() } : c
      );
      setConversations(finalConvs);
      saveWorkspace(finalConvs);
      setFiles([]);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const detail = err?.message ? `\n\n_${err.message}_` : '';
        const errMessage: ChatMessage = {
          role: 'assistant',
          content: `I could not complete that request. The local Clarivex-1 model may still be loading — please try again in a moment.${detail}`,
          timestamp: Date.now(),
        };
        const finalMessages = [...updatedMessages, errMessage];
        const finalConvs = updatedConvs.map(c =>
          c.id === targetConv!.id ? { ...c, messages: finalMessages, updated: Date.now() } : c
        );
        setConversations(finalConvs);
        saveWorkspace(finalConvs);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRegenerate = () => {
    if (!currentConv || !currentConv.messages.length || isGenerating) return;
    const lastMsg = currentConv.messages[currentConv.messages.length - 1];
    if (lastMsg.role !== 'assistant') return;

    const trimmed = currentConv.messages.slice(0, -1);
    const lastUser = trimmed[trimmed.length - 1];
    if (lastUser && lastUser.role === 'user') {
      const promptText = lastUser.content;
      const withoutUser = trimmed.slice(0, -1);
      const updatedConvs = conversations.map(c =>
        c.id === activeId ? { ...c, messages: withoutUser } : c
      );
      setConversations(updatedConvs);
      setInput(promptText);
      handleSend(promptText);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const currentModeMeta = MODE_META[mode] || MODE_META.general;

  return (
    <div
      className="page-top flex min-h-screen flex-col overflow-hidden"
      style={{ background: 'var(--bg)', color: 'var(--fg)' }}
    >
      {/* Audio Transcriber Modal */}
      <AudioTranscriberModal
        isOpen={isTranscribeModalOpen}
        onClose={() => setIsTranscribeModalOpen(false)}
        onApplyTranscription={text => setInput(prev => (prev ? `${prev} ${text}` : text))}
      />

      {/* Top Workspace Header */}
      <div
        className="flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6"
        style={{ borderColor: 'var(--line)', background: 'var(--elevated)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('home')}
            className="mr-2 flex cursor-pointer items-center gap-1.5 text-xs transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Website
          </button>
          <div className="h-4 w-[1px]" style={{ background: 'var(--line)' }} />
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
            >
              CX
            </div>
            <span className="text-sm font-extrabold tracking-wide" style={{ color: 'var(--fg)' }}>
              CLARIVEX<span className="grad-text">.AI</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Persona selector */}
          <select
            value={persona}
            onChange={e => handlePersonaChange(e.target.value as AIPersona)}
            className="field hidden !w-auto !py-1.5 !text-xs sm:block"
            aria-label="AI role"
          >
            <option value="general">Role: Standard AI</option>
            <option value="architect">Role: Software Architect</option>
            <option value="strategist">Role: Enterprise Strategist</option>
            <option value="auditor">Role: Security Auditor</option>
          </select>

          {/* New Chat */}
          <button
            onClick={createNewChat}
            className="btn btn-ghost !px-3 !py-1.5 !text-xs"
          >
            <Plus className="h-3.5 w-3.5" style={{ color: 'var(--accent-2)' }} />
            New chat
          </button>

          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              color: 'var(--muted)',
            }}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Area (Sidebar + Chat) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="hidden w-64 shrink-0 flex-col border-r p-4 md:flex"
          style={{ borderColor: 'var(--line)', background: 'var(--bg-soft)' }}
        >
          <div
            className="mb-3 text-[10px] font-bold uppercase tracking-[2px]"
            style={{ color: 'var(--faint)' }}
          >
            Workspace Mode
          </div>

          <div className="mb-6 space-y-1">
            {(Object.keys(MODE_META) as WorkspaceMode[]).map(key => {
              const item = MODE_META[key];
              const Icon = item.icon;
              const isActive = mode === key;
              return (
                <button
                  key={key}
                  onClick={() => handleModeChange(key)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl border p-2.5 text-left transition-all"
                  style={
                    isActive
                      ? {
                          background: 'rgba(124,92,255,0.14)',
                          borderColor: 'var(--line-strong)',
                          color: 'var(--fg)',
                        }
                      : { borderColor: 'transparent', color: 'var(--muted)' }
                  }
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: isActive ? 'var(--accent-2)' : 'var(--muted)' }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold">{item.title}</div>
                    <div className="truncate text-[10px]" style={{ color: 'var(--faint)' }}>
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Conversations History */}
          <div className="flex-1 overflow-y-auto">
            <div
              className="mb-2 text-[10px] font-bold uppercase tracking-[2px]"
              style={{ color: 'var(--faint)' }}
            >
              Conversations
            </div>
            <div className="space-y-1">
              {conversations.slice(0, 25).map(c => (
                <div
                  key={c.id}
                  onClick={() => handleSelectConv(c)}
                  className="group flex cursor-pointer items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs transition-colors"
                  style={
                    c.id === activeId
                      ? {
                          background: 'rgba(124,92,255,0.14)',
                          borderColor: 'var(--line)',
                          color: 'var(--fg)',
                          fontWeight: 500,
                        }
                      : { borderColor: 'transparent', color: 'var(--muted)' }
                  }
                >
                  <span className="mr-2 flex-1 truncate">{c.title || 'New conversation'}</span>
                  <button
                    onClick={e => deleteConversation(c.id, e)}
                    className="rounded p-0.5 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                    title="Delete conversation"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-3 border-t pt-3 text-[10.5px] leading-relaxed"
            style={{ borderColor: 'var(--line-soft)', color: 'var(--faint)' }}
          >
            Powered by Clarivex-1 — our own model, running locally. No external AI providers.
          </div>
        </aside>

        {/* Chat Section */}
        <section className="flex min-w-0 flex-1 flex-col" style={{ background: 'var(--bg)' }}>
          {/* Subheader */}
          <div
            className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-8"
            style={{ borderColor: 'var(--line)', background: 'var(--bg-soft)' }}
          >
            <div>
              <div
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px]"
                style={{ color: 'var(--faint)' }}
              >
                <span>Clarivex AI · {currentModeMeta.hint}</span>
              </div>
              <h1
                className="flex items-center gap-2 text-base font-bold"
                style={{ color: 'var(--fg)' }}
              >
                {currentModeMeta.title}
                <span className="text-xs font-normal" style={{ color: 'var(--muted)' }}>
                  ({PERSONA_LABELS[persona]?.name || 'Standard'})
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={model}
                onChange={e => {
                  const m = e.target.value as WorkspaceModel;
                  setModel(m);
                  saveWorkspace(conversations, mode, m);
                }}
                className="field !w-auto !py-1.5 !text-xs"
                aria-label="Model"
              >
                <option value="auto">Clarivex-1 (Balanced)</option>
                <option value="fast">Clarivex-1 (Fast)</option>
                <option value="deep">Clarivex-1 (Deep)</option>
              </select>
              <div
                className="hidden items-center gap-1.5 text-[10px] font-bold tracking-wider sm:flex"
                style={{ color: 'var(--accent-3)' }}
              >
                <span className="dot-live" style={{ background: 'var(--accent-3)' }} />
                CLARIVEX-1 LOCAL
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-8">
            {(!currentConv?.messages || currentConv.messages.length === 0) ? (
              <div className="mx-auto my-10 max-w-xl text-center">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-extrabold text-white"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                    boxShadow: '0 18px 44px -18px rgba(124,92,255,0.9)',
                  }}
                >
                  CX
                </div>
                <h2 className="mb-2 text-2xl font-bold" style={{ color: 'var(--fg)' }}>
                  How can I help you today?
                </h2>
                <p
                  className="mx-auto mb-6 max-w-md text-xs leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  Ask about our services, process, pricing, industries, or careers. Every answer is
                  generated by Clarivex-1, our own model running locally.
                </p>

                <div className="grid grid-cols-1 gap-2.5 text-left sm:grid-cols-2">
                  {STARTER_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="card-flat cursor-pointer p-3 text-xs transition-all"
                      style={{ color: 'var(--fg-soft)' }}
                    >
                      {prompt} →
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              currentConv.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mx-auto flex max-w-3xl flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className="mb-1 flex items-center gap-1.5 px-1 text-[10px] font-medium"
                    style={{ color: 'var(--faint)' }}
                  >
                    <span>{msg.role === 'user' ? 'You' : 'Clarivex AI'}</span>
                  </div>
                  <div
                    className="max-w-[88%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed"
                    style={
                      msg.role === 'user'
                        ? {
                            background:
                              'linear-gradient(120deg, rgba(124,92,255,0.28), rgba(0,212,255,0.18))',
                            border: '1px solid var(--line-strong)',
                            color: 'var(--fg)',
                          }
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
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}

                    {msg.role === 'assistant' && (
                      <div
                        className="mt-3 flex items-center gap-2 border-t pt-2 text-[11px]"
                        style={{ borderColor: 'var(--line-soft)', color: 'var(--muted)' }}
                      >
                        <button
                          onClick={() => handleCopy(msg.content, idx)}
                          className="flex cursor-pointer items-center gap-1 transition-colors hover:opacity-80"
                        >
                          {copiedId === idx ? (
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
                          onClick={handleRegenerate}
                          className="flex cursor-pointer items-center gap-1 transition-colors hover:opacity-80"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Regenerate</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isGenerating && (
              <div className="mx-auto flex max-w-3xl flex-col items-start">
                <div className="mb-1 text-[10px] font-medium" style={{ color: 'var(--faint)' }}>
                  Clarivex AI
                </div>
                <div
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-[13px]"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    color: 'var(--fg-soft)',
                  }}
                >
                  <span
                    className="h-2 w-2 animate-pulse rounded-full"
                    style={{ background: 'var(--accent-soft)' }}
                  />
                  <span>
                    {mode === 'research'
                      ? 'Researching with Clarivex-1...'
                      : 'Processing with Clarivex-1...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div className="shrink-0 p-4 sm:px-8" style={{ background: 'var(--bg)' }}>
            <div
              className="mx-auto max-w-3xl rounded-2xl p-3 transition-all"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line-strong)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* Attachment chips */}
              {files.length > 0 && (
                <div
                  className="mb-2 flex flex-wrap gap-2 border-b pb-2"
                  style={{ borderColor: 'var(--line-soft)' }}
                >
                  {files.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs"
                      style={{
                        background: 'rgba(124,92,255,0.14)',
                        border: '1px solid var(--line-strong)',
                        color: 'var(--fg-soft)',
                      }}
                    >
                      <span className="max-w-[140px] truncate">{f.name}</span>
                      <button
                        onClick={() => removeFile(i)}
                        className="cursor-pointer hover:text-red-400"
                        aria-label={`Remove ${f.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask Clarivex AI anything about our services, process, pricing or careers..."
                className="max-h-40 w-full resize-none border-0 bg-transparent text-[13px] outline-none"
                style={{ color: 'var(--fg)' }}
              />

              <div
                className="mt-1 flex items-center justify-between border-t pt-2"
                style={{ borderColor: 'var(--line-soft)' }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  {/* File attach */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".txt,.md,.csv,.json,.log,.xml,.html,.css,.js,.ts,.py,.java,.sql,.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.gif"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer items-center gap-1 text-xs transition-colors"
                    style={{ color: 'var(--muted)' }}
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>Attach</span>
                  </button>

                  {/* Audio Transcribe Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsTranscribeModalOpen(true)}
                    className="flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 text-xs transition-colors"
                    style={{
                      color: 'var(--accent-soft)',
                      background: 'rgba(124,92,255,0.1)',
                      border: '1px solid var(--line)',
                    }}
                    title="Voice input using your browser's speech recognition"
                  >
                    <Mic className="h-3.5 w-3.5" />
                    <span>Voice Input</span>
                  </button>

                  {/* Research mode toggle */}
                  <button
                    type="button"
                    onClick={() => handleModeChange(mode === 'research' ? 'general' : 'research')}
                    className="flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 text-xs transition-colors"
                    style={
                      mode === 'research'
                        ? {
                            background: 'rgba(0,212,255,0.14)',
                            border: '1px solid rgba(0,212,255,0.3)',
                            color: 'var(--accent-2)',
                            fontWeight: 600,
                          }
                        : { color: 'var(--muted)' }
                    }
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Research {mode === 'research' ? 'On' : 'Off'}</span>
                  </button>

                  {files.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFiles([])}
                      className="cursor-pointer text-[11px]"
                      style={{ color: 'var(--faint)' }}
                    >
                      Clear files
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isGenerating ? (
                    <button
                      onClick={handleStop}
                      className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium"
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        color: '#FF8A8A',
                      }}
                    >
                      <Square className="h-3 w-3 fill-current" />
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() && files.length === 0}
                      aria-label="Send message"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white transition-all disabled:opacity-30"
                      style={{
                        background: 'linear-gradient(120deg, var(--accent), var(--accent-2))',
                        boxShadow: '0 8px 22px -10px rgba(124,92,255,0.9)',
                      }}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2 text-center text-[10px]" style={{ color: 'var(--faint)' }}>
              Clarivex-1 runs entirely on this server. No external AI providers, no API keys.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
