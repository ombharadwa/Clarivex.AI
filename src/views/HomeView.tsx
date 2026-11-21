import React, { useState, useEffect, useRef } from 'react';
import { PageTab } from '../types';
import { Reveal } from '../components/Reveal';
import { useLanguage } from '../context/LanguageContext';
import { AI_SERVICES, SOFTWARE_SOLUTIONS } from '../data/services';
import {
  ArrowRight,
  Bot,
  Zap,
  TrendingUp,
  Sparkles,
  Cpu,
  Layers,
  ShieldCheck,
  Send,
  Building,
  FileText,
  Globe,
  Cloud,
  Smartphone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface HomeViewProps {
  onSelectTab: (tab: PageTab) => void;
}

const ICONS: Record<string, LucideIcon> = {
  Bot,
  Zap,
  Cpu,
  TrendingUp,
  Sparkles,
  FileText,
  Globe,
  Layers,
  Cloud,
  Smartphone,
};

const HOME_SERVICES = [...AI_SERVICES.slice(0, 4), ...SOFTWARE_SOLUTIONS.slice(0, 2)];

const PROCESS = [
  { num: '01', title: 'Discovery', desc: 'Business requirement analysis & scoping' },
  { num: '02', title: 'Strategy', desc: 'Solution architecture & planning' },
  { num: '03', title: 'Design', desc: 'Wireframes & UI/UX design' },
  { num: '04', title: 'Development', desc: 'Agile AI implementation' },
  { num: '05', title: 'Testing', desc: 'QA & performance optimization' },
  { num: '06', title: 'Deployment', desc: 'Production launch & go-live' },
  { num: '07', title: 'Support', desc: 'Continuous maintenance & growth' },
];

const WHY_US = [
  {
    title: 'AI-First Development',
    desc: 'Every solution is built AI-native from the ground up, not bolted-on as an afterthought.',
    icon: Zap,
  },
  {
    title: 'Enterprise Scalability',
    desc: 'Architecture designed to handle 10x growth without performance degradation.',
    icon: TrendingUp,
  },
  {
    title: 'Rapid Delivery',
    desc: 'Agile methodology with 2-week sprints. MVP delivery in 6–8 weeks, not months.',
    icon: ArrowRight,
  },
  {
    title: 'Enterprise Security',
    desc: 'Bank-grade encryption, data privacy compliance, and secure cloud infrastructure.',
    icon: ShieldCheck,
  },
  {
    title: 'Multi-Domain Expertise',
    desc: 'Cross-industry experience across 7+ verticals including healthcare, finance, and retail.',
    icon: Building,
  },
  {
    title: 'Dedicated Support',
    desc: 'Dedicated account manager and 24/7 technical support post-deployment.',
    icon: Sparkles,
  },
];

const MARQUEE = [
  { icon: '🏥', label: 'Healthcare' },
  { icon: '💰', label: 'Finance & Banking' },
  { icon: '🏛️', label: 'Government' },
  { icon: '🛒', label: 'Retail & E-Commerce' },
  { icon: '📚', label: 'Education' },
  { icon: '🏭', label: 'Manufacturing' },
  { icon: '🚚', label: 'Logistics' },
];

const CHART_BARS = [45, 72, 38, 85, 62, 91, 55, 78, 88, 42, 95, 67];
const PERF_BARS = [60, 45, 80, 55, 90, 70, 85, 65, 95, 75, 88, 92];

const WORKFLOWS = [
  { label: 'Data Processing', pct: 87 },
  { label: 'Predictive Engine', pct: 72 },
  { label: 'NLP Pipeline', pct: 94 },
];

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTab }) => {
  const { t } = useLanguage();

  const [stats, setStats] = useState({ projects: 0, industries: 0, products: 0 });
  const [queriesDay, setQueriesDay] = useState(0);
  const [automations, setAutomations] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const [demoMsgs, setDemoMsgs] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: "Hi! I'm Clarivex-1, running locally on this site. Ask me about our services, pricing, or how we work.",
    },
  ]);
  const [demoInput, setDemoInput] = useState('');
  const [demoTyping, setDemoTyping] = useState(false);
  const [showDemoSugs, setShowDemoSugs] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer1 = setInterval(() => {
      setStats(prev => ({
        projects: Math.min(prev.projects + 1, 10),
        industries: Math.min(prev.industries + 1, 7),
        products: Math.min(prev.products + 1, 4),
      }));
    }, 80);

    const timer2 = setInterval(() => {
      setQueriesDay(prev => Math.min(prev + 140, 2847));
      setAutomations(prev => Math.min(prev + 18, 340));
      setAccuracy(prev => Math.min(prev + 5, 98));
    }, 50);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 92, 255, ${p.opacity})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleDemoSend = async (textToSend?: string) => {
    const text = (textToSend || demoInput).trim();
    if (!text || demoTyping) return;

    const nextMsgs = [...demoMsgs, { role: 'user' as const, text }];
    setDemoMsgs(nextMsgs);
    setDemoInput('');
    setShowDemoSugs(false);
    setDemoTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMsgs.map(m => ({ role: m.role, content: m.text })),
          mode: 'general',
        }),
      });

      const raw = await res.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(`Chat API unavailable (HTTP ${res.status}).`);
      }
      if (!res.ok) throw new Error(data.error || `Chat API error (HTTP ${res.status})`);

      setDemoMsgs(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch {
      setDemoMsgs(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'I could not reach the Clarivex-1 model just now. Open the AI Workspace to try again.',
        },
      ]);
    } finally {
      setDemoTyping(false);
    }
  };

  return (
    <div className="page-top min-h-screen">
      {/* ── HERO ── */}
      <div
        className="relative flex min-h-[calc(100vh-var(--nav-h))] items-center overflow-hidden"
        style={{ background: 'var(--bg)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="orb orb-violet animate-orb1 -right-24 -top-24 h-[500px] w-[500px]" />
          <div className="orb orb-cyan animate-orb2 -bottom-20 -left-20 h-[400px] w-[400px]" />
          <div className="orb orb-mint animate-orb3 right-1/3 top-1/4 h-[300px] w-[300px]" />
          <div className="grid-backdrop absolute inset-0" />
          <canvas ref={canvasRef} className="absolute inset-0" />
        </div>

        <div className="container-x relative z-10 grid grid-cols-1 items-center gap-12 py-12 lg:grid-cols-2 lg:py-16">
          {/* Left Column */}
          <Reveal animation="fade-left">
            <span className="pill-badge mb-6">
              <span className="dot-live" />
              {t('hero.badge')}
            </span>

            <h1 className="display-1 mb-6" style={{ color: 'var(--fg)' }}>
              {t('hero.title_part1')}
              <span className="grad-text">{t('hero.title_part2')}</span>
            </h1>

            <p className="lede mb-8 max-w-xl">{t('hero.subtitle')}</p>

            <div className="mb-12 flex flex-wrap items-center gap-4">
              <button onClick={() => onSelectTab('contact')} className="btn btn-primary !px-7 !py-3.5 !text-[14px]">
                {t('hero.bookConsultation')}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => onSelectTab('services')} className="btn btn-ghost !px-7 !py-3.5 !text-[14px]">
                {t('hero.exploreServices')}
              </button>
            </div>

            {/* Key Metrics Counters */}
            <div
              className="flex flex-wrap items-center gap-8 border-t pt-6"
              style={{ borderColor: 'var(--line-soft)' }}
            >
              {[
                { value: stats.projects, label: t('hero.projectsDelivered') },
                { value: stats.industries, label: t('hero.industriesServed') },
                { value: stats.products, label: t('hero.aiProducts') },
              ].map(m => (
                <div key={m.label}>
                  <div className="grad-text text-3xl font-extrabold">{m.value}+</div>
                  <div
                    className="mt-1 text-[10px] uppercase tracking-[1.5px]"
                    style={{ color: 'var(--muted)' }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right Column: Dashboard */}
          <Reveal animation="fade-right">
            <div className="relative">
              <div
                className="animate-pulse-slow absolute -top-3 right-4 z-20 rounded-xl px-3.5 py-2"
                style={{
                  background: 'var(--elevated)',
                  border: '1px solid var(--line-strong)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--muted)' }}
                >
                  {t('hero.aiAccuracy')}
                </div>
                <div className="grad-text text-[14px] font-bold">98.7%</div>
              </div>

              <div className="card relative overflow-hidden p-6">
                <div
                  className="absolute left-0 right-0 top-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}
                />

                <div className="mb-5 flex items-center justify-between">
                  <span
                    className="text-[11px] font-bold tracking-wider"
                    style={{ color: 'var(--fg)' }}
                  >
                    CLARIVEX INTELLIGENCE DASHBOARD
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                </div>

                <div className="mb-5 grid grid-cols-3 gap-3">
                  {[
                    { value: queriesDay.toLocaleString(), label: 'QUERIES/DAY' },
                    { value: automations, label: 'AUTOMATIONS' },
                    { value: `${accuracy}%`, label: 'ACCURACY' },
                  ].map(s => (
                    <div
                      key={s.label}
                      className="rounded-xl p-3 text-center"
                      style={{
                        background: 'rgba(124,92,255,0.1)',
                        border: '1px solid var(--line)',
                      }}
                    >
                      <div className="grad-text text-lg font-black">{s.value}</div>
                      <div
                        className="mt-1 text-[9px] font-semibold tracking-wider"
                        style={{ color: 'var(--muted)' }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mb-4 flex h-24 items-end gap-1.5 rounded-xl p-3"
                  style={{ background: 'var(--surface-2)' }}
                >
                  {CHART_BARS.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 rounded-t-sm transition-all duration-700"
                      style={{
                        height: `${val}%`,
                        background:
                          idx === 10
                            ? 'linear-gradient(to top, var(--accent), var(--accent-2))'
                            : 'rgba(124,92,255,0.32)',
                      }}
                    />
                  ))}
                </div>

                <div
                  className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5"
                  style={{
                    background: 'rgba(0,212,255,0.06)',
                    border: '1px solid rgba(0,212,255,0.2)',
                  }}
                >
                  <span className="dot-live" />
                  <span className="text-[11.5px]" style={{ color: 'var(--accent-2-soft)' }}>
                    AI processing 2,847 data points in real-time…
                  </span>
                </div>
              </div>

              <div
                className="absolute -bottom-3 left-4 z-20 rounded-xl px-3.5 py-2"
                style={{
                  background: 'var(--elevated)',
                  border: '1px solid rgba(0,212,255,0.3)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--muted)' }}
                >
                  Automation Rate
                </div>
                <div className="text-[14px] font-bold" style={{ color: 'var(--accent-2)' }}>
                  +340%
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── TRUST BAR / MARQUEE ── */}
      <div
        className="marquee-mask flex items-center gap-8 overflow-hidden border-y px-6 py-4"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
      >
        <span
          className="shrink-0 text-[11px] font-semibold uppercase tracking-[2px]"
          style={{ color: 'var(--muted)' }}
        >
          Industries We Serve
        </span>
        <div className="animate-trust flex gap-10 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((item, idx) => (
            <span
              key={idx}
              className="flex items-center gap-2 text-[13px] font-medium tracking-wide"
              style={{ color: 'var(--faint)' }}
            >
              <span>{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES OVERVIEW ── */}
      <section className="container-x section-y">
        <Reveal animation="fade-up">
          <div className="mb-14">
            <span className="eyebrow mb-2">What We Build</span>
            <h2 className="display-2 mb-4" style={{ color: 'var(--fg)' }}>
              AI Services & <span className="grad-text">Software Solutions</span>
            </h2>
            <p className="lede max-w-xl">
              From intelligent AI systems to enterprise-grade software — we build what modern businesses
              need to scale.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {HOME_SERVICES.map((svc, i) => {
            const Icon = ICONS[svc.icon] ?? Bot;
            const isAI = svc.tag === 'AI SERVICE';
            return (
              <Reveal key={svc.id} animation="fade-up" delay={i * 70}>
                <button
                  type="button"
                  onClick={() => onSelectTab('services')}
                  className="card card-hover group h-full w-full cursor-pointer p-7 text-left"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="text-[11px] font-bold tracking-widest"
                      style={{ color: 'var(--accent)' }}
                    >
                      {svc.num}
                    </span>
                    <span className={isAI ? 'chip chip-accent' : 'chip chip-cyan'}>
                      {isAI ? 'AI SERVICE' : 'SOFTWARE'}
                    </span>
                  </div>
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: isAI ? 'rgba(124,92,255,0.12)' : 'rgba(0,212,255,0.1)',
                      color: isAI ? 'var(--accent-soft)' : 'var(--accent-2-soft)',
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-[17px] font-bold" style={{ color: 'var(--fg)' }}>
                    {svc.name}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {svc.desc}
                  </p>
                </button>
              </Reveal>
            );
          })}
        </div>

        <Reveal animation="fade-up" delay={120}>
          <div className="mt-10">
            <button onClick={() => onSelectTab('services')} className="btn btn-ghost">
              See all ten services <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </section>

      {/* ── LIVE AI EXPERIENCE ── */}
      <section
        className="relative overflow-hidden border-y py-24"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
      >
        <div className="container-x relative z-10">
          <Reveal animation="fade-up">
            <div className="mb-12">
              <span className="eyebrow mb-2">Live AI Experience</span>
              <h2 className="display-2 mb-4" style={{ color: 'var(--fg)' }}>
                See Our <span className="grad-text">AI In Action</span>
              </h2>
              <p className="lede max-w-xl">
                This chat is wired to the same Clarivex-1 model that powers the AI Workspace — running
                locally, with no external API.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            {/* Demo Chat */}
            <Reveal animation="fade-left">
              <div className="card flex h-[440px] flex-col overflow-hidden">
                <div
                  className="flex items-center gap-3 border-b p-4"
                  style={{ background: 'rgba(124,92,255,0.08)', borderColor: 'var(--line)' }}
                >
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
                    <div className="text-[10px]" style={{ color: 'var(--accent-2)' }}>
                      ● Online — Powered by Clarivex-1
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {demoMsgs.map((m, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
                        m.role === 'user' ? 'ml-auto' : 'mr-auto'
                      }`}
                      style={
                        m.role === 'user'
                          ? { background: 'var(--accent)', color: '#fff' }
                          : {
                              background: 'rgba(124,92,255,0.1)',
                              border: '1px solid var(--line)',
                              color: 'var(--fg-soft)',
                            }
                      }
                    >
                      {m.text}
                    </div>
                  ))}
                  {demoTyping && (
                    <div
                      className="flex w-16 items-center gap-1 rounded-xl px-3.5 py-2"
                      style={{
                        background: 'rgba(124,92,255,0.1)',
                        border: '1px solid var(--line)',
                      }}
                    >
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: 'var(--accent-soft)' }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.2s]" style={{ background: 'var(--accent-soft)' }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.4s]" style={{ background: 'var(--accent-soft)' }} />
                    </div>
                  )}
                </div>

                {showDemoSugs && (
                  <div
                    className="flex flex-wrap gap-2 border-t p-2.5"
                    style={{ borderColor: 'var(--line-soft)' }}
                  >
                    {['What services do you offer?', 'What are your pricing tiers?', 'Are you hiring?'].map(sug => (
                      <button
                        key={sug}
                        onClick={() => handleDemoSend(sug)}
                        className="chip chip-accent cursor-pointer transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className="flex items-center gap-2 border-t p-3"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <input
                    type="text"
                    value={demoInput}
                    onChange={e => setDemoInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleDemoSend()}
                    placeholder="Ask anything about our AI…"
                    className="field !py-2 !text-[12px]"
                  />
                  <button
                    onClick={() => handleDemoSend()}
                    disabled={demoTyping}
                    aria-label="Send message"
                    className="btn btn-primary !p-2.5 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Performance Cards */}
            <Reveal animation="fade-right">
              <div className="space-y-6">
                <div className="card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="text-[12px] font-bold tracking-wider"
                      style={{ color: 'var(--fg)' }}
                    >
                      REAL-TIME AI PERFORMANCE
                    </span>
                    <span className="chip chip-cyan">LIVE</span>
                  </div>

                  <div className="mb-5 flex h-16 items-end gap-1.5">
                    {PERF_BARS.map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm transition-all duration-500"
                        style={{
                          height: `${v}%`,
                          background:
                            i >= 9
                              ? 'linear-gradient(to top, var(--accent), var(--accent-2))'
                              : 'rgba(124,92,255,0.3)',
                        }}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { value: '98.7%', label: 'AI ACCURACY' },
                      { value: '1.2s', label: 'AVG RESPONSE' },
                      { value: '2.8K', label: 'QUERIES/DAY' },
                      { value: '340%', label: 'AUTOMATION GAIN' },
                    ].map(s => (
                      <div
                        key={s.label}
                        className="rounded-xl p-3 text-center"
                        style={{ background: 'rgba(124,92,255,0.1)' }}
                      >
                        <div className="grad-text text-lg font-bold">{s.value}</div>
                        <div
                          className="mt-1 text-[9px] font-semibold"
                          style={{ color: 'var(--muted)' }}
                        >
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="text-[12px] font-bold tracking-wider"
                      style={{ color: 'var(--fg)' }}
                    >
                      WORKFLOW AUTOMATION STATUS
                    </span>
                    <span className="chip chip-accent">ACTIVE</span>
                  </div>

                  <div className="space-y-4">
                    {WORKFLOWS.map(w => (
                      <div key={w.label}>
                        <div className="mb-1.5 flex justify-between text-[12px]">
                          <span style={{ color: 'var(--muted)' }}>{w.label}</span>
                          <span className="font-semibold" style={{ color: 'var(--accent-3)' }}>
                            ✓ Running
                          </span>
                        </div>
                        <div
                          className="h-1.5 overflow-hidden rounded-full"
                          style={{ background: 'var(--line-soft)' }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${w.pct}%`,
                              background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── DEVELOPMENT PROCESS ── */}
      <section className="container-x section-y">
        <Reveal animation="fade-up">
          <div className="mb-14">
            <span className="eyebrow mb-2">How We Work</span>
            <h2 className="display-2 mb-4" style={{ color: 'var(--fg)' }}>
              Our <span className="grad-text">Development Process</span>
            </h2>
            <p className="lede max-w-xl">
              A battle-tested agile methodology turning complex enterprise challenges into deployed
              intelligent systems.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {PROCESS.map((step, idx) => (
            <Reveal key={step.num} animation="fade-up" delay={idx * 50}>
              <div className="card-flat flex h-full flex-col items-center p-5 text-center">
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-full text-[15px] font-extrabold"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line-strong)',
                    color: 'var(--accent)',
                  }}
                >
                  {step.num}
                </div>
                <h4 className="mb-1.5 text-[13px] font-bold" style={{ color: 'var(--fg)' }}>
                  {step.title}
                </h4>
                <p className="text-[11px] leading-snug" style={{ color: 'var(--muted)' }}>
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHY ENTERPRISES CHOOSE US ── */}
      <section
        className="border-t py-24"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
      >
        <div className="container-x">
          <Reveal animation="fade-up">
            <div className="mb-14">
              <span className="eyebrow mb-2">Why Clarivex.AI</span>
              <h2 className="display-2 mb-4" style={{ color: 'var(--fg)' }}>
                Why Enterprises <span className="grad-text">Choose Us</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((why, i) => {
              const Icon = why.icon;
              return (
                <Reveal key={why.title} animation="fade-up" delay={i * 70}>
                  <div className="card card-hover h-full p-7">
                    <div
                      className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{
                        background: 'rgba(124,92,255,0.14)',
                        border: '1px solid var(--line-strong)',
                        color: 'var(--accent-soft)',
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-[16px] font-bold" style={{ color: 'var(--fg)' }}>
                      {why.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {why.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal animation="scale" delay={120}>
            <div
              className="mt-16 rounded-3xl p-8 text-center sm:p-12"
              style={{
                background: 'linear-gradient(120deg, rgba(124,92,255,0.16), rgba(0,212,255,0.12))',
                border: '1px solid var(--line-strong)',
              }}
            >
              <h3 className="display-3 mb-3" style={{ color: 'var(--fg)' }}>
                Ready to build with AI?
              </h3>
              <p className="mx-auto mb-6 max-w-lg text-[14px]" style={{ color: 'var(--muted)' }}>
                Book a free consultation and we will scope your first production system.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => onSelectTab('contact')} className="btn btn-primary">
                  Book Consultation <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => onSelectTab('workspace')} className="btn btn-ghost">
                  Try the AI Workspace
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
