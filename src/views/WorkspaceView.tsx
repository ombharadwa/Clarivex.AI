import React, { useState, useEffect, useRef } from 'react';
import { PageTab, WorkspaceMode, WorkspaceModel, AttachedFile, WorkspaceConversation, ChatMessage, AIPersona } from '../types';
import { useTheme } from '../context/ThemeContext';
import { AudioTranscriberModal } from '../components/AudioTranscriberModal';
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

const MODE_META: Record<WorkspaceMode, { title: string; desc: string; hint: string; icon: React.ComponentType<{ className?: string }> }> = {
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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');

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
        const errMessage: ChatMessage = {
          role: 'assistant',
          content:
            'I could not complete that request. The local Clarivex-1 model may still be loading — please try again in a moment.',
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
    <div className="min-h-screen pt-[70px] flex flex-col bg-[#070b18] text-[#f8fafc] overflow-hidden">
      {/* Audio Transcriber Modal */}
      <AudioTranscriberModal
        isOpen={isTranscribeModalOpen}
        onClose={() => setIsTranscribeModalOpen(false)}
        onApplyTranscription={text => setInput(prev => (prev ? `${prev} ${text}` : text))}
      />

      {/* Top Workspace Header */}
      <div className="h-14 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between bg-[#070b18]/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-1.5 text-xs text-[#8892B0] hover:text-white transition-colors cursor-pointer mr-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Website
          </button>
          <div className="w-[1px] h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] flex items-center justify-center font-bold text-xs text-white">
              CX
            </div>
            <span className="font-extrabold text-sm tracking-wide text-white">
              CLARIVEX<span className="grad-text">.AI</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Persona selector */}
          <select
            value={persona}
            onChange={e => handlePersonaChange(e.target.value as AIPersona)}
            className="hidden sm:block bg-[#111a31] border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#7C5CFF]"
          >
            <option value="general">Role: Standard AI</option>
            <option value="architect">Role: Software Architect</option>
            <option value="strategist">Role: Enterprise Strategist</option>
            <option value="auditor">Role: Security Auditor</option>
          </select>

          {/* New Chat */}
          <button
            onClick={createNewChat}
            className="px-3 py-1.5 rounded-lg bg-[#111a31] hover:bg-[#1a2544] border border-white/10 text-xs text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#00D4FF]" />
            New chat
          </button>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg bg-[#111a31] border border-white/10 flex items-center justify-center text-[#8892B0] hover:text-white transition-all cursor-pointer"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Area (Sidebar + Chat) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#0a0f1e]/80 p-4 flex flex-col shrink-0 hidden md:flex">
          <div className="text-[10px] font-bold tracking-[2px] text-[#71809d] uppercase mb-3">
            Workspace Mode
          </div>

          <div className="space-y-1 mb-6">
            {(Object.keys(MODE_META) as WorkspaceMode[]).map(key => {
              const item = MODE_META[key];
              const Icon = item.icon;
              const isActive = mode === key;
              return (
                <button
                  key={key}
                  onClick={() => handleModeChange(key)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-white'
                      : 'hover:bg-white/5 border border-transparent text-[#8892B0] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00D4FF]' : 'text-[#8892B0]'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold">{item.title}</div>
                    <div className="text-[10px] text-[#8892B0] truncate">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Conversations History */}
          <div className="flex-1 overflow-y-auto">
            <div className="text-[10px] font-bold tracking-[2px] text-[#71809d] uppercase mb-2">
              Conversations
            </div>
            <div className="space-y-1">
              {conversations.slice(0, 25).map(c => (
                <div
                  key={c.id}
                  onClick={() => handleSelectConv(c)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    c.id === activeId
                      ? 'bg-[#7C5CFF]/15 text-white font-medium border border-[#7C5CFF]/20'
                      : 'text-[#8892B0] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="truncate flex-1 mr-2">{c.title || 'New conversation'}</span>
                  <button
                    onClick={e => deleteConversation(c.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 rounded transition-opacity"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10.5px] text-[#556480] border-t border-white/5 pt-3 mt-3 leading-relaxed">
            Powered by Clarivex-1 — our own model, running locally. No external AI providers.
          </div>
        </aside>

        {/* Chat Section */}
        <section className="flex-1 flex flex-col min-w-0 bg-[#070b18]">
          {/* Subheader */}
          <div className="h-16 border-b border-white/10 px-4 sm:px-8 flex items-center justify-between shrink-0 bg-[#070b18]/60">
            <div>
              <div className="text-[10px] font-bold tracking-[2px] text-[#71809d] uppercase flex items-center gap-2">
                <span>Clarivex AI · {currentModeMeta.hint}</span>
              </div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                {currentModeMeta.title}
                <span className="text-xs text-[#8892B0] font-normal">
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
                className="bg-[#111a31] border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#7C5CFF]"
              >
                <option value="auto">Clarivex-1 (Balanced)</option>
                <option value="fast">Clarivex-1 (Fast)</option>
                <option value="deep">Clarivex-1 (Deep)</option>
              </select>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CLARIVEX-1 LOCAL
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5">
            {(!currentConv?.messages || currentConv.messages.length === 0) ? (
              <div className="max-w-xl mx-auto my-10 text-center animate-in fade-in">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] mx-auto mb-4 flex items-center justify-center font-extrabold text-white text-lg shadow-xl shadow-indigo-500/20">
                  CX
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
                <p className="text-xs text-[#8892B0] max-w-md mx-auto mb-6 leading-relaxed">
                  Ask about our services, process, pricing, industries, or careers. Every answer is generated by Clarivex-1, our own model running locally.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                  {STARTER_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="p-3 rounded-xl bg-[#0d1326] hover:bg-[#151b35] border border-white/10 hover:border-[#7C5CFF]/40 text-xs text-[#aebbd0] hover:text-white transition-all cursor-pointer shadow-sm"
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
                  className={`max-w-3xl mx-auto flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="text-[10px] text-[#65728b] mb-1 font-medium px-1 flex items-center gap-1.5">
                    <span>{msg.role === 'user' ? 'You' : 'Clarivex AI'}</span>
                  </div>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#7C5CFF]/30 to-[#00D4FF]/20 border border-[#7C5CFF]/30 text-white rounded-br-xs'
                        : 'bg-[#111a31] border border-white/10 text-white/95 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10 text-[11px] text-[#8892B0]">
                        <button
                          onClick={() => handleCopy(msg.content, idx)}
                          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === idx ? (
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
                          onClick={handleRegenerate}
                          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Regenerate</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isGenerating && (
              <div className="max-w-3xl mx-auto flex flex-col items-start">
                <div className="text-[10px] text-[#65728b] mb-1 font-medium">Clarivex AI</div>
                <div className="bg-[#111a31] border border-white/10 px-4 py-3 rounded-2xl rounded-bl-xs text-[13px] text-white/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A48BFF] animate-pulse" />
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
          <div className="p-4 sm:px-8 shrink-0 bg-[#070b18]">
            <div className="max-w-3xl mx-auto bg-[#0d1326] border border-[#7C5CFF]/30 focus-within:border-[#7C5CFF]/60 rounded-2xl p-3 shadow-xl transition-all">
              {/* Attachment chips */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b border-white/5">
                  {files.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-xs text-[#b9c5db]"
                    >
                      <span className="truncate max-w-[140px]">{f.name}</span>
                      <button onClick={() => removeFile(i)} className="hover:text-red-400 cursor-pointer">
                        <X className="w-3 h-3" />
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
                className="w-full bg-transparent border-0 outline-none text-white text-[13px] placeholder-white/30 resize-none max-h-40"
              />

              <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                <div className="flex items-center gap-3 flex-wrap">
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
                    className="text-xs text-[#8f9db5] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attach</span>
                  </button>

                  {/* Audio Transcribe Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsTranscribeModalOpen(true)}
                    className="text-xs text-[#A48BFF] hover:text-white flex items-center gap-1 cursor-pointer transition-colors px-2 py-0.5 rounded bg-[#7C5CFF]/10 hover:bg-[#7C5CFF]/20 border border-[#7C5CFF]/20"
                    title="Voice input using your browser's speech recognition"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Input</span>
                  </button>

                  {/* Research mode toggle in composer */}
                  <button
                    type="button"
                    onClick={() => handleModeChange(mode === 'research' ? 'general' : 'research')}
                    className={`text-xs flex items-center gap-1 cursor-pointer transition-colors px-2 py-0.5 rounded ${
                      mode === 'research'
                        ? 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 font-semibold'
                        : 'text-[#8f9db5] hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Research {mode === 'research' ? 'On' : 'Off'}</span>
                  </button>

                  {files.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFiles([])}
                      className="text-[11px] text-[#71809d] hover:text-white cursor-pointer"
                    >
                      Clear files
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isGenerating ? (
                    <button
                      onClick={handleStop}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-1 cursor-pointer hover:bg-red-500/20"
                    >
                      <Square className="w-3 h-3 fill-current" />
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() && files.length === 0}
                      className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] hover:opacity-90 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer transition-all shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="text-center text-[10px] text-[#4f5c73] mt-2">
              Clarivex-1 runs entirely on this server. No external AI providers, no API keys.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
